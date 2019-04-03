import { Histogram } from "../util/Histogram"
import { BaseQuant, IQuantizationResult, RGB } from "./BaseQuant"

class Cube {
    public rmin: number
    public rmax: number
    public gmin: number
    public gmax: number
    public bmin: number
    public bmax: number
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
}
