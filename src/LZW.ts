import { TableBasedImage } from "./block/TableBasedImage"
import { IQuantizationResult } from "./quantization/BaseQuant"
import { Queue } from "./util/queue"

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
        const LZW_MIN_SIZE_TBL = [0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08]
        let INIT_LZW_MIN_SIZE = LZW_MIN_SIZE_TBL[0]

        const indexStream = quantizationResult.indexStream
        const TBL_SIZE = quantizationResult.globalColorTable.length

        for (const size of LZW_MIN_SIZE_TBL) {
            if (TBL_SIZE > 2 ** size) {
                continue
            }
            INIT_LZW_MIN_SIZE = size
            break
        }

        let currentLzwCodeSize = INIT_LZW_MIN_SIZE
        const CLEAR_CODE = 2 ** INIT_LZW_MIN_SIZE
        const INFORMATION_CODE = CLEAR_CODE + 1
        const INIT_TBL_SIZE = CLEAR_CODE + 2
        const MAX_CODE_SIZE = 0x0FFF

        const EOF = indexStream.length
        const MAX_SUB_BLOCK = 255

        let tbSize = INIT_TBL_SIZE
        const colorTable = new Map<string, number>()
        let current = 1

        const idxBuffer: number[] = []

        const binaryBuffer: Queue<number> = new Queue<number>(indexStream.length * 12)
        let byte = 0x00
        let byteIdx = 0 // 0 ~ 7

        const subBlock = new Uint8Array(MAX_SUB_BLOCK)
        let subBlockLength = 0

        // 설계를 stream 으로 바꿔야 한다
        // 구현을 위한 임시 용도
        const imageData: Uint8Array[] = []

        const numToBinaryBuffer = (num: number) => {
            let val = num
            let length = 0
            while (val > 0) {
                binaryBuffer.push(val % 2)
                val = val >> 1
                length++
            }

            while (length < currentLzwCodeSize + 1) {
                binaryBuffer.push(0)
                length++
            }
        }

        // LZW minimum code size 삽입
        const lzwMinCodeSize = new Uint8Array(1)
        lzwMinCodeSize[0] = INIT_LZW_MIN_SIZE
        imageData.push(lzwMinCodeSize)

        // Clear code 삽입
        numToBinaryBuffer(CLEAR_CODE)

        // init
        idxBuffer[0] = indexStream[0]

        // loop
        while (current < EOF) {
            if (tbSize === MAX_CODE_SIZE) {
                numToBinaryBuffer(CLEAR_CODE)
                tbSize = INIT_TBL_SIZE
                currentLzwCodeSize = INIT_LZW_MIN_SIZE
                colorTable.clear()
                current = current - (idxBuffer.length - 1)
                idxBuffer.length = 1
                continue
            }

            // read
            const idx = indexStream[current]
            const saved = idxBuffer.map((v) => `#${v}`).join("")
            const lookup = `${saved}#${idx}`

            current++

            // found
            if (colorTable.has(lookup)) {
                idxBuffer.push(idx)
                continue
            }

            // not found
            colorTable.set(lookup, tbSize)
            tbSize++

            let code = colorTable.get(saved)

            if (code === undefined) {
                code = idxBuffer[0]
            }

            idxBuffer.length = 1
            idxBuffer[0] = idx

            if ((2 << currentLzwCodeSize) < tbSize - 1) {
                currentLzwCodeSize++
            }

            numToBinaryBuffer(code)
        }

        numToBinaryBuffer(INFORMATION_CODE)

        while (!binaryBuffer.empty()) {
            byte += (binaryBuffer.pop() << byteIdx)
            byteIdx++

            if (byteIdx === 8) {
                subBlock[subBlockLength] = byte
                subBlockLength++

                byte = 0x00
                byteIdx = 0

                if (subBlockLength === MAX_SUB_BLOCK) {
                    imageData.push(TableBasedImage.SubBlock(subBlock, subBlockLength))
                    subBlockLength = 0
                }
            }
        }

        if (byte > 0) {
            subBlock[subBlockLength] = byte
            subBlockLength++
        }

        imageData.push(TableBasedImage.SubBlock(subBlock, subBlockLength))

        return imageData
    }
}
