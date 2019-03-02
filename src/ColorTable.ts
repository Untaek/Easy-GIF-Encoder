export class ColorTable {
    static gen() {
        /**
         *      7 6 5 4 3 2 1 0        Field Name                    Type
         *     +===============+
         *  0  |               |       Red 0                         Byte
         *     +-             -+
         *  1  |               |       Green 0                       Byte
         *     +-             -+
         *  2  |               |       Blue 0                        Byte
         *     +-             -+
         *  3  |               |       Red 1                         Byte
         *     +-             -+
         *     |               |       Green 1                       Byte
         *     +-             -+
         * up  |               |
         *     +-   . . . .   -+       ...
         * to  |               |
         *     +-             -+
         *     |               |       Green 255                     Byte
         *     +-             -+
         * 767 |               |       Blue 255                      Byte
         *     +===============+
         */
        return new Int8Array(768)
    }
}