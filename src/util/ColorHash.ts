export class ColorHash {
    /**
     * For color histogram
     */
    public count: number
    public func1: (val1: number) => number
    public func2: (val2: number) => number

    private data = new Uint32Array(1 << 16)

    public add(r: number, g: number, b: number) {
        const org = r + (g << 8) + (b << 16)
        const key1 = this.func1(org)
    }

    public getCount(r: number, g: number, b: number) {

    }

    public sortAESC() {

    }
}
