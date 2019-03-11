export class LZWTrie {
    public root: TrieNode
    public indicator: TrieNode
    public size: number
    public step: number

    constructor() {
        this.root = new TrieNode()
        this.indicator = this.root
        this.size = 0
        this.step = 0
    }

    public newNode(index: number, value?: number) {
        if (this.indicator.node === undefined) {
            this.indicator.node = new Array<TrieNode>(256)
        }

        if (this.indicator.node[index] === undefined) {
            this.indicator.node[index] = new TrieNode(this.indicator)
        }

        this.indicator.node[index].step = this.step

        if (value !== undefined) {
            this.indicator.node[index].index = value
        }
    }

    public clear(target: number) {
        this.size = 0
        this.indicator = this.root.node[target]
        this.step++
    }
}

class TrieNode {
    public node: TrieNode[]
    public leaf = false
    public index = 0
    public parent: TrieNode = null
    public depth = 0
    public step = 0

    constructor(parent?: TrieNode) {
        if (parent) {
            this.parent = parent
            this.depth = this.parent.depth + 1
        }
    }
}
