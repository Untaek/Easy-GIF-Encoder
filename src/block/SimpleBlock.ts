export class SimpleBlock {
    public static Header() {
        /**
         *    7 6 5 4 3 2 1 0        Field Name                    Type
         *   +---------------+
         * 0 |               |       Signature                     3 Bytes
         *   +-             -+       ('GIF')
         * 1 |               |
         *   +-             -+
         * 2 |               |
         *   +---------------+
         * 3 |               |       Version                       3 Bytes
         *   +-             -+       ('87a' or '89a')
         * 4 |               |
         *   +-             -+
         * 5 |               |
         *   +---------------+
         */

        /**
         *  ['G', 'I', 'F', '8', '9', 'a']
         */
        return new Uint8Array([71, 73, 70, 56, 57, 97])
    }

    public static Trailer() {
        /**
         *    7 6 5 4 3 2 1 0        Field Name                    Type
         *   +---------------+
         * 0 |               |       GIF Trailer                   Byte
         *   +---------------+
         */

        return new Uint8Array([0x3B])
    }

    public static BlockTerminator() {
        /**
         *    7 6 5 4 3 2 1 0        Field Name                    Type
         *   +---------------+
         * 0 |               |       Block Terminator              Byte
         *   +---------------+
         */

        return new Uint8Array([0])
    }
}
