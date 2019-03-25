export class RGB {
    public red: number = 0
    public green: number = 0
    public blue: number = 0
    public index: number = 0
}

class Hist {
    public count: number
    public colors: []
}

export interface IQuantizationResult {
    globalColorTable: RGB[]
    globalColorTableSize: number // At least 2 up to 8.
    indexStream: Uint8Array
}

export class BaseQuant {
    public static getHistogram(pixels: Uint8Array, dimension: number) {
        for (let i = 0; i < pixels.length; i += dimension) {
            const r = pixels[i]
            const g = pixels[i + 1]
            const b = pixels[i + 2]

            const key = r + (g << 8) + (b << 16)

        }
    }

    public static fromBuffer(buf: Uint8Array, w: number, h: number, dimension: number): IQuantizationResult {
        throw Error("Not implemented!")
    }

    public static map(pixels: Uint8Array, colorTable: RGB[], w: number, h: number) {
        throw Error("Not implemented!")
    }
}
