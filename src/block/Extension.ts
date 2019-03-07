export class Extension {
    static GraphicControlExtension() {
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
        block[2] = 4
        
        return block
    }
}