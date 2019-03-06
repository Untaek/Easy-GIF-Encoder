import { RGB } from "../quantization/BaseQuant";

export class ColorTable {
    static gen(rgb: RGB[]) {
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

        const block = new Uint8Array(rgb.length*3)
        
        rgb.forEach((rgb, i) => {
            block[i*3] = rgb.red
            block[i*3+1] = rgb.green
            block[i*3+2] = rgb.blue 
        })

        return block
    }
}