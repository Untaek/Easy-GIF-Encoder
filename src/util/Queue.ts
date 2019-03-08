export class Queue<T> {
    private data: Array<T>
    private front: number = 0
    private rear: number = 0
    private capacity: number = 0

    length: number = 0

    constructor(size: number) {
        this.data = new Array(size)
        this.capacity = size
    }

    push(value: T) {
        this.data[this.rear] = value
        this.rear++
        this.length++
    }

    pop() {
        const data = this.data[this.front]
        this.front++
        this.length--
        return data
    }

    peek() {
        return this.front
    }

    empty() {
        return this.length == 0
    }
}