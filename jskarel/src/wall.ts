import { C } from './coordinates'

export class Wall {
    static fromArray(arr: [C, C]): Wall {
        return new Wall(arr[0], arr[1])
    }
    constructor(
        public first: C,
        public second: C) { }

    /**
     * if the wall is between first and second coordinates.
     */
    same(first: C, second: C): boolean {
        return this.equal(first, second) || this.equal(second, first)
    }

    equal(first: C, second: C): boolean {
        return this.first.equal(first) && this.second.equal(second)
    }

    static horizontalLine(start: C, end: C): Wall[] {
        const edges = []
        const y = start.y
        for (let x = start.x; x < end.x; x++) {
            const first = new C(x, y - 1)
            const second = new C(x, y)
            edges.push(new Wall(first, second))
        }
        return edges
    }

    static verticalLine(start: C, end: C): Wall[] {
        const edges = []
        const x = start.x
        for (let y = start.y; y < end.y; y++) {
            const first = new C(x - 1, y)
            const second = new C(x, y)
            edges.push(new Wall(first, second))
        }
        return edges
    }

    static corners(width: number, height: number): [number, number][] {
        return [
            [1, 1], // lowerLeft
            [width + 1, 1], // lowerRight
            [1, height + 1], // topLeft
            [width + 1, height + 1] // topRight
        ]
    }
    /**
     * @returns line of walls from start until end
     * x or y of both is assumed to be equal, otherwise
     * returns an empty array
     */
    static line(p1: C, p2: C): Wall[] {
        if (p1.x == p2.x) {
            return Wall.verticalLine(p1, p2)
        } else if (p1.y == p2.y) {
            return Wall.horizontalLine(p1, p2)
        }
        return []
    }

    static borders(width: number, height: number): Wall[] {
        const corners = this.corners(width, height).map(C.fromArray)
        let res: Wall[] = []
        corners
            .forEach(p1 => corners
                .forEach(p2 => res = res.concat(this.line(p1, p2))))
        return res
    }
}
