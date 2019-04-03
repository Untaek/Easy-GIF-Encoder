export class Histogram {
    public c = new Array(3)

    /**
     * For color histogram
     */

    // tslint:disable-next-line: variable-name
    private _hist = new Uint32Array(1 << 24)
    private colors: number = 0

    constructor(buf: Uint8Array) {
        this.init(buf)
    }

    public getCount(r: number, g: number, b: number) {
        return this._hist[this.idx(r, g, b)]
    }

    public getCountRGB(rgb: number) {
        return this._hist[this.idx(rgb >> 16, rgb >> 8 & 0xFF, rgb & 0xFF)]
    }

    public getRedRange(start: number, end: number) {
        return this.getRange(start, end, ColorType.R)
    }

    public getGreenRange(start: number, end: number) {
        return this.getRange(start, end, ColorType.G)
    }

    public getBlueRange(start: number, end: number) {
        return this.getRange(start, end, ColorType.B)
    }

    public getColorsTotal() {
        return this.colors
    }

    private getRange(start: number, end: number, type: ColorType) {
        let max = 0
        let min = 0

        for (let i = start; i <= end; i++) {
            if (this.c[type][i] > 0) { min = i; break }
        }

        for (let i = end; i >= start; i--) {
            if (this.c[type][i] > 0) { max = i; break }
        }

        return {
            max, min,
        }
    }

    private init(buf: Uint8Array) {
        for (let i = 0; i < 3; i++) {
            this.c[i] = new Uint32Array(255)
        }

        for (let i = 0; i < buf.length; i += 3) {
            this._hist[this.idx(buf[i], buf[i + 1], buf[i + 2])]++
            this.c[0][buf[i]]++
            this.c[1][buf[i + 1]]++
            this.c[2][buf[i + 2]]++
        }
    }

    private idx(r: number, g: number, b: number) {
        return (r << 16) + (g << 8) + b
    }
}

export enum ColorType {
    R, G, B,
}
