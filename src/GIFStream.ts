import * as fs from "fs"
import { Extension } from "./block/Extension"
import { LogicalScreen } from "./block/LogicalScreen"
import { SimpleBlock } from "./block/SimpleBlock"
import { TableBasedImage } from "./block/TableBasedImage"
import { LZW } from "./LZW"
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

interface IQuantizationOptions {
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

    private static chooseQuantizationAlgorithm(options: IQuantizationOptions) {
        switch (options.method) {
            case "neu": return NeuQuant
            case "uniform": return UniformQuant
            default: return UniformQuant
        }
    }
}
