import { World } from './world'
import { WorldOpts } from './world'
import { C } from './coordinates'

const Directions: [number, number][] = [
    [1, 0], // east
    [0, 1], // north
    [-1, 0], // west
    [0, -1], // south
]

interface KarelOpts {
    world?: WorldOpts
    direction?: number
    position?: any
}

export class Karel {
    public world: World
    public direction: number
    public position: C
    constructor(opts: KarelOpts = {}) {
        this.world = new World(opts.world)
        this.direction = opts.direction || 0
        if (opts.position) {
            this.position = opts.position[0] ? C.fromArray(opts.position) : opts.position
        } else {
            this.position = new C(1, 1)
        }
    }
    setPosition(x: number, y: number) {
        this.position.set(x, y)
        return this
    }
    getDirection(d: number = 1): number {
        return (this.direction + d) % (Directions.length)
    }
    turnLeft(): void {
        this.direction = this.getDirection()
    }
    turnRight(): void {
        this.direction = this.getDirection(3)
    }
    turnAround(): void {
        this.direction = this.getDirection(2)
    }
    move(): void {
        const direction = Directions[this.direction]
        if (this.frontIsClear()) {
            this.position = this.position.getNext(...direction)
        } else {
            throw "there is a wall in front of Karel"
        }
    }
    nextCorner(direction: [number, number]): C {
        return this.position.getNext(...direction)
    }
    pickBeeper(): void {
        this.world.removeBeeper(this.position)
    }
    putBeeper(): void {
        this.world.addBeeper(this.position)
    }
    toString() {
        return `Karel is on position ${this.position}, coordinates of beepers: ${this.world.beepers}, world: ${this.world.width}x${this.world.height}`
    }
    frontIsClear(directionIndex = this.direction): boolean {
        const direction = Directions[directionIndex]
        return !this.world.existsWall(this.position, this.nextCorner(direction))
    }
    beepersPresent(): boolean {
        return this.world.beepersPresent(this.position)
    }
    noBeepersPresent(): boolean {
        return !this.beepersPresent()
    }
    frontIsBlocked(): boolean {
        return !this.frontIsClear()
    }
    leftIsClear(): boolean {
        return this.frontIsClear(this.getDirection())
    }
    rightIsClear(): boolean {
        return this.frontIsClear(this.getDirection(3))
    }
    facingEast(): boolean {
        return this.direction == 0
    }
    facingNorth(): boolean {
        return this.direction == 1
    }
    facingWest(): boolean {
        return this.direction == 2
    }
    facingSouth(): boolean {
        return this.direction == 3
    }
}
