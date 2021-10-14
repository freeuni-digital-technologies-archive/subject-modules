import { C } from './coordinates'
import { Wall } from './wall'

export interface WorldOpts {
    width?: number
    height?: number
    walls?: any[]
    beepers?: any
}
export class World {
    public width: number
    public height: number
    public walls: Wall[]
    public beepers: C[]
    constructor(opts: WorldOpts = {}) {
        this.width = opts.width || 10
        this.height = opts.height || 10
        this.walls = []
        if (opts.walls) {
            this.addWalls(opts.walls)
        }
        const borders = Wall.borders(this.width, this.height)
        this.walls = this.walls
            .concat(borders)
        this.beepers = []
        if (opts.beepers) {
            this.addBeepers(opts.beepers)
        }
    }

    addBeeper(beeper: C): World {
        this.beepers.push(beeper)
        return this
    }
    addBeepers(indices: any[]): World {
        indices
            .map((beeper: any) =>
                beeper.length ? C.fromArray(beeper) : beeper)
            .forEach(b => this.addBeeper(b))
        return this
    }

    addWall(wall: Wall): World {
        this.walls.push(wall)
        return this
    }

    addWalls(walls: any[]): World {
        walls
            .map(wall => {
                if (wall.length)
                    return Wall.fromArray(wall.map(C.fromArray))
                return wall
            }).forEach(w => this.addWall(w))
        return this
    }
    removeBeeper(c: C): void {
        const index = this.beepers.map(x => x.equal(c)).indexOf(true)
        if (index > -1) {
            this.beepers.splice(index, 1)
        } else {
            throw "no beepers on this corner"
        }
    }

    beepersPresent(c: C): boolean {
        return this.beepersCount(c) > 0
    }

    existsWall(first: C, second: C): boolean {
        const foundWalls = this.walls.filter(wall =>
            wall.same(first, second)
        )
        return foundWalls.length == 1
    }
    beepersCount(c: C): number {
        return this.beepers.filter(b => b.equal(c)).length
    }
}
