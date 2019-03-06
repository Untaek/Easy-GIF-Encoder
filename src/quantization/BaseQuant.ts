
export class RGB {
    red: number = 0
    green: number = 0
    blue: number = 0
    index: number = 0
}

export interface QuantizationResult {
    globalColorTable: RGB[]
    indexStream: Uint8Array
}

export class BaseQuant {
    public static fromBuffer(buf: ArrayBuffer, w: number, h: number): QuantizationResult {
        throw Error('Not implemented!')
    }

    public static map(pixels: Uint8Array, colorTable: RGB[], w: number, h: number) {
        throw Error('Not implemented!')
    }

    private toUintArray(pixels: RGB[]) {
        const size = pixels.length * 3
        const buf = new Uint8Array(size)
        for(let i = 0; i < pixels.length; i++) {
            buf[i * 3] = pixels[i].red
            buf[i * 3 + 1] = pixels[i].green
            buf[i * 3 + 2] = pixels[i].blue
        }

        return buf
    }
}