export class Block {
    public static SubBlock(chunk: Uint8Array, len: number) {
        /**
         *      7 6 5 4 3 2 1 0        Field Name                    Type
         *     +---------------+
         *  0  |               |       Block Size                    Byte
         *     +---------------+
         *  1  |               |
         *     +-             -+
         *  2  |               |
         *     +-             -+
         *  3  |               |
         *     +-             -+
         *     |               |       Data Values                   Byte
         *     +-             -+
         * up  |               |
         *     +-   . . . .   -+
         * to  |               |
         *     +-             -+
         *     |               |
         *     +-             -+
         * 255 |               |
         *     +---------------+
         */

        if (chunk.length > 255 || len > 255) {
            throw Error("SubBlock Data length is over 255")
        }

        const block = new Uint8Array(len + 1)
        block[0] = len
        block.set(chunk.subarray(0, len), 1)

        return block
    }
}
