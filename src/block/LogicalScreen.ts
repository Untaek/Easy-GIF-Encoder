import { RGB } from "../quantization/BaseQuant"
import { ColorTable } from "./ColorTableBlock"

export class LogicalScreen {
    public static LogicalScreenDescriptor(w: number, h: number, tbl: RGB[]) {
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

        const tblSize = (tbl.length - 1).toString(2).length - 1

        const block = new Uint8Array(7)
        block[0] = w & 0xFF
        block[1] = w >> 8
        block[2] = h & 0xFF
        block[3] = h >> 8
        block[4] = tblSize | 0xF0
        block[5] = 0x00
        block[6] = 0x00

        return block
    }

    public static GlobalColorTable(rgb: RGB[]) {
        return ColorTable.gen(rgb)
    }
}
