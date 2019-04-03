import { ColorType, Histogram } from "../util/Histogram"
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

        const type = r >= g ? (r >= b ? 0 : 2) : (g >= b ? 1 : 2)
        return ColorType[type]
    }

    private static median(cube: Cube, hist: Histogram) {
        let total = 0
        let medCount = 0
        let min = 0
        let max = 0
        let median = 0

        if (cube.axis === ColorType.R) {
            min = cube.rmin
            max = cube.rmax
        } else if (cube.axis === ColorType.G) {
            min = cube.gmin
            max = cube.gmax
        } else {
            min = cube.bmin
            max = cube.bmax
        }

        for (let i = min; i < max; i++) {
            total += hist.c[cube.axis][i]
        }

        total /= 2

        for (let i = min; i < max; i++) {
            medCount += hist.c[cube.axis][i]
            if (medCount > total) {
                median = i
                break
            }
        }

        return median
    }

    private static split(cube: Cube) {

    }
}
