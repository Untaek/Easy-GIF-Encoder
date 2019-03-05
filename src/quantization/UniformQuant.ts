import { BaseQuant, RGB, QuantizationResult } from "./BaseQuant";
import { ColorTable } from "../ColorTable";
import { writeFileSync, appendFileSync } from "fs";

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
    
    static fromBuffer(pixels: Uint8Array, w: number, h: number): QuantizationResult {
        const regions: Region[] = new Array(UniformQuant.COLOR_SPACE).map(() => new Region())
        const indexStream = new Uint8Array(pixels.length / 3)

        for(let i = 0; i < UniformQuant.COLOR_SPACE; i++) {
            regions[i] = new Region()
            regions[i].index = i.toString()
        }

        let r = 0
        let g = 0
        let b = 0
        let index = 0

        for(let i = 0; i < pixels.length; i+=3) {
            r = pixels[i]
            g = pixels[i + 1]
            b = pixels[i + 2]

            index = ~~((r / UniformQuant.rDist) + (g / UniformQuant.gDist * 8) + (b / UniformQuant.bDist * 8 * 4))
            indexStream[~~(i/3)] = index
            regions[index].add(r, g, b)
        }

        regions.forEach(region => region.setAverage())

        return {
            globalColorTable: regions,
            indexStream: indexStream
        }
    }

    static map(pixels: Uint8Array, colorTable: RGB[], w: number, h: number) {}
}