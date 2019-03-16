export class RGB {
    public red: number = 0
    public green: number = 0
    public blue: number = 0
    public index: number = 0
}

export interface IQuantizationResult {
    globalColorTable: RGB[]
    globalColorTableSize: number // At least 2 up to 8.
    indexStream: Uint8Array
}

export class BaseQuant {
    public static fromBuffer(buf: Uint8Array, w: number, h: number, dimension: number): IQuantizationResult {
        throw Error("Not implemented!")
    }

    public static map(pixels: Uint8Array, colorTable: RGB[], w: number, h: number) {
        throw Error("Not implemented!")
    }
}
