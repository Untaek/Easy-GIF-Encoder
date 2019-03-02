import { ColorTable } from "./ColorTable";

export class TableBasedImage {
    static ImageDescriptor() {
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

    }

    static ImageData() {
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

    static LocalColorTable() {
        return ColorTable.gen()
    }
}