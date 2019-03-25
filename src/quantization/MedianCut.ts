import { BaseQuant, IQuantizationResult, RGB } from "./BaseQuant"

class Cube extends RGB {
    public bucket: Uint32Array
    public rmin: number
    public rmax: number
    public gmin: number
    public gmax: number
    public bmin: number
    public bmax: number

    constructor(size: number) {
        super()
        this.bucket = new Uint32Array(size)
    }
}

export class MedianCut extends BaseQuant {
    public static fromBuffer(buf: Uint8Array, w: number, h: number, dimension: number): IQuantizationResult {
        /**
         * 1. find longest axis
         * 2. find median
         * 3. split
         * 4. repeat
         */

        const cube = new Cube(buf.length)

        return undefined
    }

    private static recursive(cube: Cube) {}
}
