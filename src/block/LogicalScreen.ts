import { ColorTable } from "./ColorTableBlock";
import { RGB } from "../quantization/BaseQuant";

export class LogicalScreen {
    static LogicalScreenDescriptor(w: number, h: number) {
        /**
         *       7 6 5 4 3 2 1 0        Field Name                    Type
         *      +---------------+
         *   0  |               |       Logical Screen Width          Unsigned
         *      +-             -+       
         *   1  |               |
         *      +---------------+
         *   2  |               |       Logical Screen Height         Unsigned
         *      +-             -+       
         *   3  |               |
         *      +---------------+
         *   4  | |     | |     |       <Packed Fields>               See below
         *      +---------------+
         *   5  |               |       Background Color Index        Byte
         *      +---------------+
         *   6  |               |       Pixel Aspect Ratio            Byte
         *      +---------------+
         *
         *      <Packed Fields>  =      Global Color Table Flag       1 Bit
         *                              Color Resolution              3 Bits
         *                              Sort Flag                     1 Bit
         *                              Size of Global Color Table    3 Bits
         */

        const block = new Uint8Array(7)
        block[0] = w & 255
        block[1] = w >> 8
        block[2] = h & 255
        block[3] = h >> 8
        block[4] = 0xF7
        block[5] = 0x00
        block[6] = 0x00

        return block
    }

    static GlobalColorTable(rgb: RGB[]) {
        return ColorTable.gen(rgb)
    }
}