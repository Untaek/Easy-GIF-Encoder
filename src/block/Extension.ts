export class Extension {
    public static GraphicControlExtension() {
        /**
         *      7 6 5 4 3 2 1 0        Field Name                    Type
         *     +---------------+
         *  0  |               |       Extension Introducer          Byte
         *     +---------------+
         *  1  |               |       Graphic Control Label         Byte
         *     +---------------+
         *
         *     +---------------+
         *  0  |               |       Block Size                    Byte
         *     +---------------+
         *  1  |     |     | | |       <Packed Fields>               See below
         *     +---------------+
         *  2  |               |       Delay Time                    Unsigned
         *     +-             -+
         *  3  |               |
         *     +---------------+
         *  4  |               |       Transparent Color Index       Byte
         *     +---------------+
         *
         *     +---------------+
         *  0  |               |       Block Terminator              Byte
         *     +---------------+
         *
         *
         *      <Packed Fields>  =     Reserved                      3 Bits
         *                             Disposal Method               3 Bits
         *                             User Input Flag               1 Bit
         *                             Transparent Color Flag        1 Bit
         *
         */

        const block = new Uint8Array(8)
        block[0] = 0x21
        block[1] = 0xF9
        block[2] = 0x04

        return block
    }

    public static PlainTextExtension(text: string) {
        /**
         *      7 6 5 4 3 2 1 0        Field Name                    Type
         *     +---------------+
         *  0  |               |       Extension Introducer          Byte
         *     +---------------+
         *  1  |               |       Plain Text Label              Byte
         *     +---------------+
         *
         *     +---------------+
         *  0  |               |       Block Size                    Byte
         *     +---------------+
         *  1  |               |       Text Grid Left Position       Unsigned
         *     +-             -+
         *  2  |               |
         *     +---------------+
         *  3  |               |       Text Grid Top Position        Unsigned
         *     +-             -+
         *  4  |               |
         *     +---------------+
         *  5  |               |       Text Grid Width               Unsigned
         *     +-             -+
         *  6  |               |
         *     +---------------+
         *  7  |               |       Text Grid Height              Unsigned
         *     +-             -+
         *  8  |               |
         *     +---------------+
         *  9  |               |       Character Cell Width          Byte
         *     +---------------+
         * 10  |               |       Character Cell Height         Byte
         *     +---------------+
         * 11  |               |       Text Foreground Color Index   Byte
         *     +---------------+
         * 12  |               |       Text Background Color Index   Byte
         *     +---------------+
         *
         *     +===============+
         *     |               |
         *  N  |               |       Plain Text Data               Data Sub-blocks
         *     |               |
         *     +===============+
         *
         *     +---------------+
         *  0  |               |       Block Terminator              Byte
         *     +---------------+
         *
         */

        const block = new Uint8Array(15 + text.length + 1)
        block[0] = 0x21
        block[1] = 0x01
        block[2] = 0x0C
        block[3] = 0x21

        block[block.length - 1] = 0x00

        return block
    }

    public static ApplicationExtension(data: Uint8Array) {
        /**
         *       7 6 5 4 3 2 1 0        Field Name                    Type
         *     +---------------+
         *  0  |               |       Extension Introducer          Byte
         *     +---------------+
         *  1  |               |       Extension Label               Byte
         *     +---------------+
         *
         *     +---------------+
         *  0  |               |       Block Size                    Byte
         *     +---------------+
         *  1  |               |
         *     +-             -+
         *  2  |               |
         *     +-             -+
         *  3  |               |       Application Identifier        8 Bytes
         *     +-             -+
         *  4  |               |
         *     +-             -+
         *  5  |               |
         *     +-             -+
         *  6  |               |
         *     +-             -+
         *  7  |               |
         *     +-             -+
         *  8  |               |
         *     +---------------+
         *  9  |               |
         *     +-             -+
         * 10  |               |       Appl. Authentication Code     3 Bytes
         *     +-             -+
         * 11  |               |
         *     +---------------+
         *
         *     +===============+
         *     |               |
         *     |               |       Application Data              Data Sub-blocks
         *     |               |
         *     |               |
         *     +===============+
         *
         *     +---------------+
         *  0  |               |       Block Terminator              Byte
         *     +---------------+
         */

        const block = new Uint8Array(14 + data.length + 1)
        block[0] = 0x21
        block[1] = 0xFF
        block[2] = 0x0B

        block[block.length - 1] = 0x00

        return block
    }
}
