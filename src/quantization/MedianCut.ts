import { ColorType, Histogram } from "../util/Histogram"
import { Queue } from "../util/queue"
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
    public level: number
    private hist: Histogram

    constructor(hist?: Histogram, start?: number, end?: number) {
        if (hist) {
            const rRange = hist.getRedRange(start || 0, end || 255)
            const gRange = hist.getGreenRange(start || 0, end || 255)
            const bRange = hist.getBlueRange(start || 0, end || 255)

            this.rmin = rRange.min
            this.rmax = rRange.max
            this.gmin = gRange.min
            this.gmax = gRange.max
            this.bmin = bRange.min
            this.bmax = bRange.max
            this.hist = hist
            this.level = 0
        }
    }

    public split() {
        this.longest()
        this.setMedian()

        const cubeA = new Cube()
        const cubeB = new Cube()
        Object.assign(cubeA, this)
        Object.assign(cubeB, this)

        cubeA.level++
        cubeB.level++
        cubeA.shrink()
        cubeB.shrink()

        switch (this.axis) {
            case ColorType.R:
                cubeA.rmax = this.median
                cubeB.rmin = this.median
                break
            case ColorType.G:
                cubeA.gmax = this.median
                cubeB.gmin = this.median
                break
            case ColorType.B:
                cubeA.bmax = this.median
                cubeB.bmin = this.median
                break
        }

        return {
            cubeA, cubeB,
        }
    }

    private longest() {
        const r = this.rmax - this.rmin
        const g = this.gmax - this.gmin
        const b = this.bmax - this.bmin
        this.axis = r >= g ? (r >= b ? 0 : 2) : (g >= b ? 1 : 2)
    }

    private setMedian() {
        let total = 0
        let medCount = 0
        let min = 0
        let max = 0
        let median = 0

        if (this.axis === ColorType.R) {
            min = this.rmin
            max = this.rmax
        } else if (this.axis === ColorType.G) {
            min = this.gmin
            max = this.gmax
        } else {
            min = this.bmin
            max = this.bmax
        }

        for (let i = min; i < max; i++) {
            total += this.hist.c[this.axis][i]
        }

        total /= 2

        for (let i = min; i < max; i++) {
            medCount += this.hist.c[this.axis][i]
            if (medCount > total) {
                median = i
                break
            }
        }

        this.median = median
    }

    private shrink() {
        const r = this.hist.getRedRange(this.rmin, this.rmax)
        const g = this.hist.getGreenRange(this.gmin, this.gmax)
        const b = this.hist.getBlueRange(this.bmin, this.bmax)

        this.rmin = r.min
        this.rmax = r.max
        this.gmin = g.min
        this.gmax = g.max
        this.bmin = b.min
        this.bmax = b.max
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

        const MAX_CUBES = 256
        const colorMap = new Uint32Array(1 << 24)
        const histogram = new Histogram(buf, dimension)
        const cube = new Cube(histogram)
        const cubes = new Queue<Cube>(256)
        const colors: RGB[] = []
        cubes.push(cube)

        while (cubes.length < MAX_CUBES) {
            const { cubeA, cubeB } = cubes.pop().split()
            cubes.push(cubeA)
            cubes.push(cubeB)
        }

        while (!cubes.empty()) {
            const c = cubes.pop()
            const rgb = new RGB()
            let rsum = 0
            let gsum = 0
            let bsum = 0
            let sumcnt = 0

            for (let i = c.rmin; i < c.rmax; i++) {
                for (let j = c.gmin; j < c.gmax; j++) {
                    for (let k = c.bmin; k < c.bmax; k++) {
                        const cnt = histogram.getCount(i, j, k)
                        if (cnt) {
                            rsum += i
                            gsum += j
                            bsum += k
                            sumcnt++
                            colorMap[(i << 16) + (j << 8) + k] = colors.length
                        }
                    }
                }
            }

            rgb.red = ~~(rsum / sumcnt)
            rgb.green = ~~(gsum / sumcnt)
            rgb.blue = ~~(bsum / sumcnt)
            rgb.index = colors.length

            colors.push(rgb)
        }

        const nb = new Uint8Array(buf.length / 4)
        for (let i = 0; i < buf.length; i += dimension) {
            const r = buf[i]
            const g = buf[i + 1]
            const b = buf[i + 2]

            nb[i / dimension] = colorMap[(r << 16) + (g << 8) + b]
        }

        return {
            globalColorTable: colors,
            globalColorTableSize: 8,
            indexStream: nb,
        }
    }
}
