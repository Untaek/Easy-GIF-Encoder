import { BaseQuant, IQuantizationResult, RGB } from "./BaseQuant"

class Cube extends RGB {

}

export class MedianCut extends BaseQuant {
    public static fromBuffer(buf: Uint8Array, w: number, h: number, dimension: number): IQuantizationResult {
        /**
         * 1. find longest axis
         * 2. find median
         * 3. split
         * 4. repeat
         */
        return undefined
    }

    private static recursive() {

    }
}
