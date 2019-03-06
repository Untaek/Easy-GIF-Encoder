export class Queue<T> {
    private data: Array<T>
    private front: number = 0
    private rear: number = 0
    
    length: number = 0

    constructor(size: number) {
        this.data = new Array(size)
    }

    push(value: T) {
        this.data[this.rear] = value
        this.rear++
        this.length++
        if(this.rear == this.data.length) {
            this.rear = 0
        }
    }

    pop() {
        const data = this.data[this.front]
        this.front++
        this.length--
        if(this.front == this.data.length) {
            this.front = 0
        }

        return data
    }

    peek() {
        return this.front
    }

    empty() {
        return this.length == 0
    }
}