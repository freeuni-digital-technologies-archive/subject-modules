import { expect } from 'chai'
import { Karel } from '../src'
import { Wall } from '../src/wall'
import { C } from '../src/coordinates'

describe('karel constructor', () => {
    it('defaults and tostring', () => {
        const karel = new Karel()
        expect(karel.position).eql({ x: 1, y: 1 })
        expect(karel.direction).eql(0)
        expect(karel.toString()).eql('Karel is on position (1,1), coordinates of beepers: , world: 10x10')
    })
    it('custom position', () => {
        const karel = new Karel({
            position: { x: 2, y: 1 }
        })
        expect(karel.position).eql({ x: 2, y: 1 })
    })
    it('custom position from array', () => {
        expect(new Karel({ position: [2, 1] }).position).eql({ x: 2, y: 1 })
    })
})

describe('karel movement', () => {
    const karel = new Karel({})
    it('moving once', () => {
        karel.move()
        expect(karel.position).eql(new C(2, 1))
    })
    it('change direction and move', () => {
        karel.turnLeft()
        karel.move()
        expect(karel.position).eql(new C(2, 2))
        karel.turnLeft()
        karel.turnLeft()
        karel.turnLeft()
        karel.move()
        expect(karel.position).eql(new C(3, 2))
    })

    it('position change', () => {
        expect(karel.setPosition(4, 5).position).eql(new C(4, 5))
    })

    it('direction change', () => {
        karel.direction = 0
        karel.setPosition(1, 1)
        karel.turnLeft()
        expect(karel.leftIsClear()).be.false
    })
})

describe('karel beepers', () => {
    const world = {
        width: 5,
        height: 5,
        beepers: [new C(2, 1)]
    }
    const karel = new Karel({ world: world })
    it('beepers present', () => {
        console.log(karel.world.beepers)
        expect(karel.noBeepersPresent()).be.true
        karel.move()
        expect(karel.beepersPresent()).be.true
    })
    it('add and pick beepers', () => {
        karel.putBeeper()
        karel.pickBeeper()
        karel.pickBeeper()
        expect(() => karel.pickBeeper()).to.throw("no beepers on this corner")
    })
})

describe('walls', () => {
    const world = {
        width: 3,
        height: 3
    }

    const karel = new Karel({
        world: world
    })
    it('karel cannot move past walls', () => {
        karel.move()
        karel.move()
        expect(() => karel.move()).to.throw("there is a wall in front of Karel")
        expect(karel.position).eql(new C(3, 1))
    })
    it('another check for vertical walls', () => {
        karel.turnLeft()
        karel.move()
        karel.move()
        expect(karel.position).eql(new C(3, 3))
        expect(() => karel.move()).to.throw("there is a wall in front of Karel")
    })
    it('walls can be within the world as well', () => {
        karel.world.addWall(new Wall(new C(3, 3), new C(2, 3)))
        karel.turnLeft()
        expect(karel.frontIsBlocked()).be.true
        expect(() => karel.move()).to.throw("there is a wall in front of Karel")
    })
})

describe('world bug', () => {
    it('simple case', () => {
        const karel = new Karel({
            world: {
                width: 3,
                height: 3,
                beepers: [[2, 1], [2, 1]]
            }
        })
        karel.move()
        karel.pickBeeper()
        expect(karel.world.beepers).length(1)
        karel.move()
        karel.putBeeper()
        expect(karel.world.beepers).length(2)
        expect(karel.beepersPresent()).true
    })
    let tries = 0
    it('finish infinite run', async (done) => {
        const karel = new Karel({
            world: {
                width: 3,
                height: 3,
                beepers: [[2, 1], [2, 1]]
            }
        })
        karel.move()
        while (karel.beepersPresent()) {
            tries++
            // await new Promise(r => setTimeout(() => r(), 100))
            karel.pickBeeper()
            karel.move()
            karel.putBeeper()
            expect(karel.beepersPresent()).be.true
            karel.turnLeft()
            karel.turnLeft()
            // console.log("beepersm: ", karel.world.beepers)
            karel.move()
            karel.turnLeft()
            karel.turnLeft()
            expect(karel.world.beepersPresent(karel.position))
        }
        expect(tries).equal(2)
        done()
    }).timeout(4000)

})