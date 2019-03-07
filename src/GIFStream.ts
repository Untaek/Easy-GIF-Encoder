import * as fs from "fs"
import { Extension } from "./block/Extension"
import { LogicalScreen } from "./block/LogicalScreen"
import { SimpleBlock } from "./block/SimpleBlock"
import { TableBasedImage } from "./block/TableBasedImage"
import { LZW } from "./LZW"
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
 */

/**
 *
 *  GIF Spec use little endian.
 *
 *  [Simple structure]
 *
 *  Header -
 *  Logical Screen Descriptor -
 *  Global Color Table -
 *  Image Descriptor -
 *  LZW code size -
 *  Sub block* -
 *  Block Terminator -
 *  Trailer -
 *
 */

interface IQuantizationOptions {
    method: "uniform" | "neu"
}

export class GIFStream {

    public static encode(path: string, buf: ArrayBuffer, w: number, h: number, options: IQuantizationOptions) {
        const quantizationAlgorithm = this.chooseQuantizationAlgorithm(options)
        const a = "a"

        const pixels = this.reduceBitTo16(buf, w, h)
        const quantizationResult = quantizationAlgorithm.fromBuffer(pixels, w, h)

        const ws = fs.createWriteStream("result.gif")

        ws.write(Buffer.from(SimpleBlock.Header()))
        ws.write(Buffer.from(LogicalScreen.LogicalScreenDescriptor(w, h)))
        ws.write(Buffer.from(LogicalScreen.GlobalColorTable(quantizationResult.globalColorTable)))
        ws.write(Buffer.from(Extension.GraphicControlExtension()))
        ws.write(Buffer.from(TableBasedImage.ImageDescriptor(w, h)))

        const compressed = LZW.compress(quantizationResult)
        for (const chunk of compressed) {
            ws.write(Buffer.from(chunk))
        }

        ws.write(Buffer.from(SimpleBlock.BlockTerminator()))
        ws.write(Buffer.from(SimpleBlock.Trailer()))
        ws.close()
    }

    private static chooseQuantizationAlgorithm(options: IQuantizationOptions) {
        switch (options.method) {
            case "neu":
            case "uniform": return UniformQuant
            default: return UniformQuant
        }
    }

    private static reduceBitTo16(buf: ArrayBuffer, w: number, h: number) {
        const pixels: Uint8Array = new Uint8Array(buf)

        const dimension = pixels.length / w / h

        if (dimension === 4) {
            return pixels.filter((_, i) => (i + 1) % 4 !== 0)
        }
        return pixels
    }
}
