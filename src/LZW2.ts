import { QuantizationResult } from "./quantization/BaseQuant";

export class LZW2 {

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

        <Summary>

        <Clear code> (start new data stream) = 2**<code size>
        Information code (EOF) = <Clear code>+1

        * The first available compression code value is <Clear code>+2

    */

    static compress(indexStream: Uint8Array, minSize: number = 8) {
        const CLEAR_CODE = 2 << minSize
        const INFORMATION_CODE = CLEAR_CODE + 1
        const EOF = indexStream.length

        let tbSize = 2 << minSize + 2
        let colorTable = new Map<string, number>()
        let current = 1

        const binaryBuffer = []
        const idxBuffer = []

        // Clear code 삽입
        idxBuffer[0] = indexStream[0]
        
        // loop
        while(current < EOF) {
            const idx = indexStream[current]
            const raw = idxBuffer.map(v => `#${v}`).join('')
            const lookup = `${raw}#${idx}`

            // idxBuffer + idx가 table에 있으면
            // idx 를 idxBuffer에 넣기
            if(colorTable.has(lookup)) {
                idxBuffer.push(idx)
                current++
                continue
            }

            // idxBuffer + idx가 table에 없으면
            // idxBuffer + idx를 table에 새롭게 추가
            // idxBuffer를 비우고 table에서 찾은 index를 binaryBuffer에 넣기
            // idxBuffer에 idx 넣기
            tbSize++
            colorTable.set(lookup, tbSize)
            idxBuffer[0] = idx
            idxBuffer.length = 1

            // 버퍼 처리 (block 생성)
            // EOF 처리
            let code = tbSize
            while(code > 0) {

            }
        }
    }
}