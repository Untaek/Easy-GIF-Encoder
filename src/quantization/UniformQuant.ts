import { BaseQuant, RGB } from "./BaseQuant";

class Region extends RGB {
    count = 0
    
    setAverage() {
        if(this.count == 0) {
            return
        }
        this.red = Math.floor(this.red / this.count)
        this.green = Math.floor(this.green / this.count)
        this.blue = Math.floor(this.blue / this.count)
    }

    add(r: number, g: number, b: number) {
        this.red += r
        this.green += g
        this.blue += b
        this.count += 1
    }
}

export class UniformQuant extends BaseQuant {
    
    private static COLOR_SPACE = 256
    private static RED_DIVISION = 8
    private static GREEN_DIVISION = 8
    private static BLUE_DIVISION = 4

    private static rDist = UniformQuant.COLOR_SPACE / UniformQuant.RED_DIVISION
    private static gDist = UniformQuant.COLOR_SPACE / UniformQuant.GREEN_DIVISION
    private static bDist = UniformQuant.COLOR_SPACE / UniformQuant.BLUE_DIVISION
    
    static fromBuffer(pixels: Uint8Array, w: number, h: number): RGB[] {
        
        const regions: Region[] = new Array(UniformQuant.COLOR_SPACE).map(() => new Region())

        for(let i = 0; i < UniformQuant.COLOR_SPACE; i++) {
            regions[i] = new Region()
        }

        let r = 0
        let g = 0
        let b = 0
        let index = 0

        for(let i = 0; i < w; i += 3) {
            for(let j = 0; j < h; j += 3) {
                r = pixels[i * w + j]
                g = pixels[i * w + j + 1]
                b = pixels[i * w + j + 2]

                index = Math.floor((r / UniformQuant.rDist) + (g / UniformQuant.gDist * 8) + (b / UniformQuant.bDist * 8 * 4))

                regions[index].add(r, g, b)
            }
        }

        regions.forEach(region => region.setAverage())
        
        return regions.sort((a, b) => a.count - b.count)
    }

    static map(pixels: Uint8Array, colorTable: RGB[], w: number, h: number) {
        return pixels
    }
}