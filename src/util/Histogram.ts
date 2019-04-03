export class Histogram {

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
        return this.getRange(start, end, 0)
    }

    public getGreenRange(start: number, end: number) {
        return this.getRange(start, end, 1)
    }

    public getBlueRange(start: number, end: number) {
        return this.getRange(start, end, 2)
    }

    public getColorsTotal() {
        return this.colors
    }

    private getRange(start: number, end: number, type: number) {
        const func = () => {
            switch (type) {
                case 0: return (val: number) => (val >> 16) & 0xFF
                case 1: return (val: number) => (val >> 8) & 0xFF
                case 2: return (val: number) => (val) & 0xFF
            }
        }

        const f = func()
        let min = 0
        let max = 0

        for (let i = start; i <= end; i++) {
            if (f(i) > 0) { min = i; break }
        }

        for (let i = end; i >= start; i--) {
            if (f(i) > 0) { max = i; break }
        }

        return {
            max, min,
        }
    }

    private init(buf: Uint8Array) {
        for (let i = 0; i < buf.length; i += 3) {
            if (this._hist[this.idx(buf[i], buf[i + 1], buf[i + 2])]) {
                this.colors++
            }
            this._hist[this.idx(buf[i], buf[i + 1], buf[i + 2])]++
        }
    }

    private idx(r: number, g: number, b: number) {
        return (r << 16) + (g << 8) + b
    }
}
