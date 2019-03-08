import { BaseQuant, IQuantizationResult, RGB } from "./BaseQuant"

class Region extends RGB {
    public count = 0

    public setAverage() {
        if (this.count === 0) {
            return this
        }
        this.red = Math.floor(this.red / this.count)
        this.green = Math.floor(this.green / this.count)
        this.blue = Math.floor(this.blue / this.count)

        return this
    }

    public add(r: number, g: number, b: number) {
        this.red += r
        this.green += g
        this.blue += b
        this.count++
    }
}

export class UniformQuant extends BaseQuant {

    public static fromBuffer(pixels: Uint8Array, w: number, h: number): IQuantizationResult {
        const regions: Region[] = new Array(this.COLOR_SPACE).map(() => new Region())
        const indexStream = new Uint8Array(pixels.length / 3)

        for (let i = 0; i < this.COLOR_SPACE; i++) {
            regions[i] = new Region()
            regions[i].index = i
        }

        let r = 0
        let g = 0
        let b = 0
        let index = 0

        const tbl = new Map<number, number>()

        for (let i = 0; i < pixels.length; i += 3) {
            r = pixels[i]
            g = pixels[i + 1]
            b = pixels[i + 2]

            index =
                ~~(r / this.RED_DIST) +
                ~~(g / this.GREEN_DIST) * this.RED_DIVISION +
                ~~(b / this.BLUE_DIST) * this.RED_DIVISION * this.GREEN_DIVISION

            if (!tbl.has(index)) {
                tbl.set(index, tbl.size)
            }

            indexStream[i / 3] = tbl.get(index)
            regions[tbl.get(index)].add(r, g, b)
        }

        const fittedColorTable = regions
            .filter((val) => val.count)
            .map((val) => val.setAverage())

        const tableSize = (fittedColorTable.length - 1).toString(2).length

        return {
            globalColorTable: fittedColorTable,
            globalColorTableSize: tableSize,
            indexStream,
        }
    }

    private static COLOR_SPACE = 256
    private static RED_DIVISION = 8
    private static GREEN_DIVISION = 8
    private static BLUE_DIVISION = 4

    private static RED_DIST = UniformQuant.COLOR_SPACE / UniformQuant.RED_DIVISION
    private static GREEN_DIST = UniformQuant.COLOR_SPACE / UniformQuant.GREEN_DIVISION
    private static BLUE_DIST = UniformQuant.COLOR_SPACE / UniformQuant.BLUE_DIVISION
}
