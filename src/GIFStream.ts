import { SimpleBlock } from "./block/SimpleBlock";
import { LogicalScreen } from "./block/LogicalScreen";

import * as fs from 'fs'
import { UniformQuant } from "./quantization/UniformQuant";
import { TableBasedImage } from "./block/TableBasedImage";
import { LZW } from "./LZW";

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
 * GIF Spec use little endian.
 */

type QuantizationOptions = {
    method: 'uniform' | 'neu'
}

export class GIFStream {

    static encode(path: string, buf: ArrayBuffer, w: number, h: number, options: QuantizationOptions) {
        let quantizationAlgorithm = this.chooseQuantizationAlgorithm(options)

        const pixels = this.reduceBitTo16(buf, w, h)
        const quantizationResult = quantizationAlgorithm.fromBuffer(pixels, w, h)
        
        const imageDescriptor = TableBasedImage.ImageDescriptor(w, h)

        const ws = fs.createWriteStream('result.gif')
        ws.write(Buffer.from(SimpleBlock.Header()))
        ws.write(Buffer.from(LogicalScreen.LogicalScreenDescriptor(w, h)))
        ws.write(Buffer.from(LogicalScreen.GlobalColorTable(quantizationResult.globalColorTable)))
        ws.write(Buffer.from(imageDescriptor))
        
        const compressed = LZW.compress(quantizationResult)
        for(let i=0; i< compressed.length; i++) {
            ws.write(Buffer.from(compressed[i]))
        }

        ws.write(Buffer.from(SimpleBlock.BlockTerminator()))
        ws.write(Buffer.from(SimpleBlock.Trailer()))
        ws.close()
    }

    private static chooseQuantizationAlgorithm(options: QuantizationOptions) {
        switch(options.method) {
            case 'neu':
            case 'uniform': return UniformQuant
            default: return UniformQuant
        }
    }

    private static reduceBitTo16(buf: ArrayBuffer, w: number, h: number) {
        let pixels: Uint8Array = new Uint8Array(buf)

        const dimension = pixels.length / w / h

        if(dimension == 4) {
            pixels = pixels.filter((_, i) => (i + 1) % 4 != 0)
        }

        return pixels
    }
}