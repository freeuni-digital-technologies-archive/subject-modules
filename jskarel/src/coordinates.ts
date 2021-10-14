export class C {
    static fromArray(arr: [number, number]): C {
        return new C(arr[0], arr[1])
    }
    constructor(public x: number, public y: number) {
    }
    set(x: number | C, y?: number): C {
        if (typeof(x) == 'number') {
            this.x = x
            this.y = y!
        } else {
            this.x = x.x
            this.y = x.y
        }
        return this
    }
    move(x: number, y: number): C {
        return this.set(this.getNext(x, y))
    }
    getNext(x: number, y: number): C {
        return new C(this.x + x, this.y + y)
    }
    equal(c: C) {
        return this.x == c.x && this.y == c.y
    }
    toString() {
        return `(${this.x},${this.y})`
    }
}
