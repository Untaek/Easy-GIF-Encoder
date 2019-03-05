import { RGB, QuantizationResult } from "./quantization/BaseQuant";
import { TableBasedImage } from "./block/TableBasedImage";

export class LZW {

    /*

    COMPRESSION

    The LZW algorithm converts a series of data values into a series of codes which
    may be raw values or a code designating a series of values. Using text
    characters as an analogy, the output code consists of a character or a code
    representing a string of characters.

    The LZW algorithm used in GIF matches algorithmically with the standard LZW
    algorithm with the following differences:

    1.  A special Clear code is defined which resets all compression/decompression
    parameters and tables to a start-up state. The value of this code is 2**<code
    size>. For example if the code size indicated was 4 (image was 4 bits/pixel)
    the Clear code value would be 16 (10000 binary). The Clear code can appear at
    any point in the image data stream and therefore requires the LZW algorithm to
    process succeeding codes as if a new data stream was starting. Encoders should
    output a Clear code as the first code of each image data stream.

    2. An End of Information code is defined that explicitly indicates the end of
    the image data stream. LZW processing terminates when this code is encountered.
    It must be the last code output by the encoder for an image. The value of this
    code is <Clear code>+1.

    3. The first available compression code value is <Clear code>+2.

    4. The output codes are of variable length, starting at <code size>+1 bits per
    code, up to 12 bits per code. This defines a maximum code value of 4095
    (0xFFF). Whenever the LZW code value would exceed the current code length, the
    code length is increased by one. The packing/unpacking of these codes must then
    be altered to reflect the new code length.
        
    */

    // static compress(quantizationResult: QuantizationResult, minSize: number = 6) {
    //     const ct = quantizationResult.globalColorTable
    //     const pxs = quantizationResult.indexStream

    //     const CLEAR_CODE = 2 << minSize
    //     const INFORMATION_CODE = CLEAR_CODE + 1
    //     const BYTE = 8

    //     const idxTable = []
    //     const codeTable = new Map<string, number>()

    //     const compressed: Uint8Array[] = []

    //     const subBlock = new Uint8Array(255)
    //     let len = 0

    //     let idxBuf = []
    //     let binQue = [0, 0, 0, 0, 0, 0, 1]
    //     let k = 0
        
    //     while(k < pxs.length) {
    //         const raw = idxBuf.join(',')
    //         const px = pxs[k]

    //         if(!raw.includes(',') || codeTable.has(raw)) {
    //             idxBuf.push(px.index)
    //             k++
    //             continue
    //         }

    //         idxBuf = []

    //         this.put(idxTable, codeTable, raw)
    //         let code = codeTable.get(raw) || parseInt(raw)

    //         while (code > 0) {
    //             binQue.push(code % 2)
    //             code = ~~(code / 2)

    //             let byte = 0
    //             // EOF 처리 필요
    //             if(binQue.length == BYTE) {
    //                 for(let i = BYTE; i > 0; i--) {
    //                     byte += 2**(i-1) * binQue.pop()
    //                 }
    //                 subBlock[len] = byte
    //                 len++

    //                 if(k > pxs.length - 5) {
    //                     console.log('end', len)
    //                     console.log(codeTable.size)
    //                     compressed.push(TableBasedImage.SubBlock(subBlock.subarray(0, len), len))
    //                     return compressed
    //                 }

    //                 if(len == 255) {
    //                     compressed.push(TableBasedImage.SubBlock(subBlock, len))
    //                     len = 0
    //                 } 
    //             }
    //         }
    //     }
    //     return compressed
    // }

    // private static put(idxTable: string[], codeTable: Map<string, number>, code: string) {
    //     codeTable.set(code, idxTable.length + 255)
    //     idxTable.push(code)
    // }
}