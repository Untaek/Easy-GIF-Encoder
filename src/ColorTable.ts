import { RGB } from "./quantization/BaseQuant";

export class ColorTable {
    colorTable: RGB[]
    idxTable = []
    codeTable = new Map<string, number>()

    clear() {
        this.idxTable = []
        this.codeTable.clear()
    }

    find(code: string | number) {
        return this.codeTable.has(code.toString())
    }

    put(code: string | number) {
        this.codeTable.set(code.toString(), this.idxTable.length)
        this.idxTable.push(code)
    }
}