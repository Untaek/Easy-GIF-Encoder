export class Trie {
    public root: TrieNode

    constructor() {
        this.root = new TrieNode(false)
    }
}

class TrieNode {
    public node: TrieNode[]
    public leaf = false
    public index = 0

    constructor(isLeaf: boolean) {
        this.leaf = isLeaf
    }

    public newNode(index: number, leaf: boolean) {
        if (this.node === undefined) {
            this.node = new Array<TrieNode>(256)
        }
        this.node[index] = new TrieNode(leaf)
    }
}
