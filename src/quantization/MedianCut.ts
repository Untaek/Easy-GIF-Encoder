import { Histogram } from "../util/Histogram"
import { BaseQuant, IQuantizationResult, RGB } from "./BaseQuant"

class Cube {
    public rmin: number
    public rmax: number
    public gmin: number
    public gmax: number
    public bmin: number
    public bmax: number
    public axis: number
    public median: number

    constructor(hist: Histogram, start: number, end: number) {
        const rRange = hist.getRedRange(start, end)
        const gRange = hist.getGreenRange(start, end)
        const bRange = hist.getBlueRange(start, end)

        this.rmin = rRange.min
        this.rmax = rRange.max
        this.gmin = gRange.min
        this.gmax = gRange.max
        this.bmin = bRange.min
        this.bmax = bRange.max
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

        const histogram = new Histogram(buf)
        const cube = new Cube(histogram, 0, histogram.getColorsTotal())

        return undefined
    }

    private static longest(cube: Cube) {
        const r = cube.rmax - cube.rmin
        const g = cube.gmax - cube.gmin
        const b = cube.bmax - cube.bmin

        return r >= g ? (r >= b ? 0 : 2) : (g >= b ? 1 : 2)
    }

    private static median(cube: Cube) {
        if (cube.axis === 0) {

        }
    }

    private static split(cube: Cube) {

    }
}
