import * as fs from "fs"
import { Extension } from "./block/Extension"
import { LogicalScreen } from "./block/LogicalScreen"
import { SimpleBlock } from "./block/SimpleBlock"
import { TableBasedImage } from "./block/TableBasedImage"
import { LZW } from "./LZW"
import { MedianCut } from "./quantization/MedianCut"
import { NeuQuant } from "./quantization/NeuQuant"
import { UniformQuant } from "./quantization/UniformQuant"

/**
 *                      [ GIF Grammar ]
 *
 *          <GIF Data Stream> ::= Header <Logical Screen> <Data>* Trailer
 *
 *           <Logical Screen> ::= Logical Screen Descriptor [Global Color Table]
 *
 *                     <Data> ::= <Graphic Block> | <Special-Purpose Block>
 *
 *            <Graphic Block> ::= [Graphic Control Extension] <Graphic-Rendering Block>
 *
 *  <Graphic-Rendering Block> ::= <Table-Based Image> | Plain Text Extension
 *
 *        <Table-Based Image> ::= Image Descriptor [Local Color Table] Image Data
 *
 *    <Special-Purpose Block> ::= Application Extension | Comment Extension
 *
 *
 *  * GIF Spec use little endian.
 *
 *
 *  [Most simplest structure]
 *
 *  Header
 *  Logical Screen Descriptor
 *  Global Color Table
 *  Image Descriptor
 *  LZW code size
 *  Sub block*
 *  Block Terminator
 *  Trailer
 *
 */

export interface IQuantizationOptions {
    method: "uniform" | "neu" | "mediancut" | "kmeans"
}
export class GIFStream {

    public static encode(path: string, pixels: Uint8Array, w: number, h: number, options: IQuantizationOptions) {
        const quantizationAlgorithm = this.chooseQuantizationAlgorithm(options)

        // tslint:disable-next-line: no-console
        console.log(`Quantization algorithm: ${quantizationAlgorithm.name}`)

        const dimension = pixels.length / w / h

        // tslint:disable-next-line: no-console
        console.log(`Color dimension: ${dimension}`)

        // tslint:disable-next-line: no-console
        console.log("Just start a quantization")

        const quantizationResult = quantizationAlgorithm.fromBuffer(pixels, w, h, dimension)

        // tslint:disable-next-line: no-console
        console.log("Quantization has finished")

        const ws = fs.createWriteStream("result.gif")

        ws.write(Buffer.from(SimpleBlock.Header()))
        ws.write(Buffer.from(LogicalScreen.LogicalScreenDescriptor(w, h, quantizationResult.globalColorTable)))
        ws.write(Buffer.from(LogicalScreen.GlobalColorTable(quantizationResult.globalColorTable)))
        ws.write(Buffer.from(Extension.GraphicControlExtension()))
        ws.write(Buffer.from(TableBasedImage.ImageDescriptor(w, h)))
        // tslint:disable-next-line: no-console
        console.log("Just start a compression")
        for (const chunk of LZW.compress(quantizationResult)) {
            ws.write(Buffer.from(chunk))
        }
        // tslint:disable-next-line: no-console
        console.log("compression has finished")
        ws.write(Buffer.from(SimpleBlock.BlockTerminator()))
        ws.write(Buffer.from(SimpleBlock.Trailer()))
        ws.close()
    }

    public static encodeToArray(pixels: Uint8Array, w: number, h: number, options: IQuantizationOptions) {
        const startAt = Date.now()

        const quantizationAlgorithm = this.chooseQuantizationAlgorithm(options)
        const dimension = pixels.length / w / h
        const quantizationResult = quantizationAlgorithm.fromBuffer(pixels, w, h, dimension)

        const header = SimpleBlock.Header()
        const lsd = LogicalScreen.LogicalScreenDescriptor(w, h, quantizationResult.globalColorTable)
        const gct = LogicalScreen.GlobalColorTable(quantizationResult.globalColorTable)
        const gce = Extension.GraphicControlExtension()
        const id = TableBasedImage.ImageDescriptor(w, h)
        const payloads = LZW.compress(quantizationResult)
        const terminator = SimpleBlock.BlockTerminator()
        const trailer = SimpleBlock.Trailer()

        const payloadLength = payloads
                    .map((c) => c.length)
                    .reduce((a, c) => a + c, 0)

        const payload = payloads.reduce((a, c) => {
            a.p.set(c, a.o)
            a.o += c.length
            return a
        }, {p: new Uint8Array(payloadLength), o: 0})

        const result = new Uint8Array(
            header.length
            + lsd.length
            + gct.length
            + gce.length
            + id.length
            + payloadLength
            + terminator.length
            + trailer.length,
        )

        let offset = 0

        result.set(header, offset); offset += header.length
        result.set(lsd, offset); offset += lsd.length
        result.set(gct, offset); offset += gct.length
        result.set(gce, offset); offset += gce.length
        result.set(id, offset); offset += id.length
        result.set(payload.p, offset); offset += payloadLength
        result.set(terminator, offset); offset += terminator.length
        result.set(trailer, offset)

        return {
            colorTable: quantizationResult.globalColorTable,
            data: result,
            elapsedTime: Date.now() - startAt,
        }
    }

    private static chooseQuantizationAlgorithm(options: IQuantizationOptions) {
        switch (options.method) {
            case "neu": return NeuQuant
            case "uniform": return UniformQuant
            case "mediancut": return MedianCut
            default: return UniformQuant
        }
    }
}

declare global {
    // tslint:disable-next-line: interface-name
    interface Global { GIFStream: GIFStream }
    interface Window { GIFStream: GIFStream }
}

if (typeof window !== "undefined") {
    window.GIFStream = GIFStream
}
if (typeof global !== "undefined") {
    global.GIFStream = GIFStream
}
