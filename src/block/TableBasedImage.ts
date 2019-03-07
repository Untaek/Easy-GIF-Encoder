import { RGB } from "../quantization/BaseQuant"
import { ColorTable } from "./ColorTableBlock"

export class TableBasedImage {

    public static ImageDescriptor(w: number, h: number) {
        /**
         *      7 6 5 4 3 2 1 0        Field Name                    Type
         *     +---------------+
         *  0  |               |       Image Separator               Byte
         *     +---------------+
         *  1  |               |       Image Left Position           Unsigned
         *     +-             -+
         *  2  |               |
         *     +---------------+
         *  3  |               |       Image Top Position            Unsigned
         *     +-             -+
         *  4  |               |
         *     +---------------+
         *  5  |               |       Image Width                   Unsigned
         *     +-             -+
         *  6  |               |
         *     +---------------+
         *  7  |               |       Image Height                  Unsigned
         *     +-             -+
         *  8  |               |
         *     +---------------+
         *  9  | | | |   |     |       <Packed Fields>               See below
         *     +---------------+
         *
         *     <Packed Fields>  =      Local Color Table Flag        1 Bit
         *                             Interlace Flag                1 Bit
         *                             Sort Flag                     1 Bit
         *                             Reserved                      2 Bits
         *                             Size of Local Color Table     3 Bits
         */

        const block = new Uint8Array(10)
        block[0] = 0x2C
        block[1] = 0
        block[2] = 0
        block[3] = 0
        block[4] = 0
        block[5] = w & 255
        block[6] = w >> 8
        block[7] = h & 255
        block[8] = h >> 8
        block[9] = 0x00

        return block
    }

    public static ImageData() {
        /**
         *      7 6 5 4 3 2 1 0        Field Name                    Type
         *     +---------------+
         *     |               |       LZW Minimum Code Size         Byte
         *     +---------------+
         *
         *     +===============+
         *     |               |
         *     /               /       Image Data                    Data Sub-blocks
         *     |               |
         *     +===============+
         */
    }

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

    public static LocalColorTable(rgb: RGB[]) {
        return ColorTable.gen(rgb)
    }
}
