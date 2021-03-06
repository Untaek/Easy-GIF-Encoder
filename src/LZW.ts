import { Block } from "./block/Block"
import { IQuantizationResult } from "./quantization/BaseQuant"
import { Queue } from "./util/queue"
import { LZWTrie } from "./util/Trie"

export class LZW {

    /*

    https://www.w3.org/Graphics/GIF/spec-gif89a.txt

    ESTABLISH CODE SIZE

    The first byte of the Compressed Data stream is a value indicating the minimum
    number of bits required to represent the set of actual pixel values. Normally
    this will be the same as the number of color bits. Because of some algorithmic
    constraints however, black & white images which have one color bit must be
    indicated as having a code size of 2.
    This code size value also implies that the compression codes must start out one
    bit longer.

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

    <Summary>

    <Clear code> (start new data stream) = 2**<code size>
    Information code (EOF) = <Clear code>+1

    * The first available compression code value is <Clear code>+2

    1. Encoders should output a Clear code as the first code of each image data stream.
    2. An End of Information code must be the last code output by the encoder for an image.
    3. The first available compression code value is <Clear code>+2.
    4. The output codes are of variable length, starting at <code size>+1 bits per code,
        up to 12 bits per code.

    */

    public static compress(quantizationResult: IQuantizationResult) {
        const indexStream = quantizationResult.indexStream
        const INIT_LZW_MIN_SIZE = quantizationResult.globalColorTableSize

        const CLEAR_CODE = 2 ** INIT_LZW_MIN_SIZE
        const INFORMATION_CODE = CLEAR_CODE + 1
        const INIT_TBL_SIZE = CLEAR_CODE + 2
        const MAX_CODE_SIZE = 0x0FFF

        const EOF = indexStream.length + 1
        const MAX_SUB_BLOCK = 255
        const subBlock = new Uint8Array(MAX_SUB_BLOCK)

        const colorTable = new LZWTrie()
        const binaryBuffer = new Queue<number>(12)

        let currentLzwCodeSize = INIT_LZW_MIN_SIZE
        let current = 0
        let byte = 0x00
        let byteIdx = 0 // 0 ~ 7
        let subBlockLength = 0

        const imageData: Uint8Array[] = []

        const nextPixel = () => {
            if (colorTable.size + INIT_TBL_SIZE === MAX_CODE_SIZE) {
                codeToSubblock(CLEAR_CODE)
                currentLzwCodeSize = INIT_LZW_MIN_SIZE
                current = current - colorTable.indicator.depth + 1
                colorTable.clear(indexStream[current])
            }
            current += 1
            return current
        }

        const codeToSubblock = (code: number) => {
            let dec = code
            let length = 0

            if ((2 << currentLzwCodeSize) < colorTable.size + INIT_TBL_SIZE - 1) {
                currentLzwCodeSize++
            }

            while (dec > 0) {
                binaryBuffer.push(dec & 0x01)
                dec = dec >> 1
                length++
            }

            while (length < currentLzwCodeSize + 1) {
                binaryBuffer.push(0)
                length++
            }

            while (!binaryBuffer.empty()) {
                byte += (binaryBuffer.pop() & 0x01) << byteIdx
                byteIdx++

                if (byteIdx === 8) {
                    subBlock[subBlockLength] = byte
                    subBlockLength++

                    byte = 0
                    byteIdx = 0

                    if (subBlockLength === MAX_SUB_BLOCK) {
                        imageData.push(Block.SubBlock(subBlock, subBlockLength))
                        subBlockLength = 0
                    }
                }
            }
        }

        // Insert LZW minimum code size
        const lzwMinCodeSize = new Uint8Array(1)
        lzwMinCodeSize[0] = INIT_LZW_MIN_SIZE
        imageData.push(lzwMinCodeSize)

        // Insert Clear code
        codeToSubblock(CLEAR_CODE)

        // init
        colorTable.newNode(indexStream[0])
        colorTable.indicator = colorTable.root.node[indexStream[0]]
        colorTable.indicator.index = indexStream[0]

        // loop
        // performance critical
        while (nextPixel() < EOF) {
            const idx = indexStream[current]
            const lookup = colorTable.indicator.node

            // found
            if (lookup && lookup[idx] && lookup[idx].step === colorTable.step) {
                colorTable.indicator = lookup[idx]
                continue
            }

            // not found
            colorTable.newNode(idx, colorTable.size + INIT_TBL_SIZE)
            colorTable.size++

            const code = colorTable.indicator.index

            colorTable.indicator = colorTable.root

            if (colorTable.root.node[idx] === undefined) {
                colorTable.newNode(idx, idx)
            }

            colorTable.indicator = colorTable.indicator.node[idx]

            codeToSubblock(code)
        }

        codeToSubblock(INFORMATION_CODE)

        // tslint:disable-next-line: no-console
        console.log("finished trans codes to binary")

        if (byte > 0) {
            subBlock[subBlockLength] = byte
            subBlockLength++
        }

        imageData.push(Block.SubBlock(subBlock, subBlockLength))

        // tslint:disable-next-line: no-console
        console.log("imageblock has created")

        return imageData
    }
}
