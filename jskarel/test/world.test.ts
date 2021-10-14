import { expect } from 'chai' 
import { World } from '../src/world'
import { Wall } from '../src/wall'
import { C } from '../src/coordinates'

describe('create new world', () => {
    it('defaults', () => {
        const world = new World()
        expect(world.width).eql(10)
        expect(world.height).eql(10)
        expect(world.beepers).length(0)
    })
    
    it('create default walls', () => {      
        const world = new World({
            width: 2,
            height: 2,
        })
        expect(world.walls).length(8)
    })
    it('pass wall array of Wall objects or [][]', () => {
        const world = new World({
            width: 2,
            height: 2,
            walls: [
                new Wall(new C(1, 1), new C(2, 1)),
                [[1, 1], [1, 2]]
            ]
        })
        expect(world.walls).length(10)
    })
    it('default beepers (empty)', () => {
        expect(new World().beepers).length(0)
    })
    it('pass beepers as [][] or C[]', () => {
        const world = new World({
            beepers: [
                new C(1, 1),
                [2, 1]
            ]
        })
        expect(world.beepers).eql([
            new C(1, 1),
            new C(2, 1)
        ])
    })
})

describe('world functions', () => {
    const world = new World({
        beepers: [[1, 1]]
    })
    it('beepers present', () => {
        const beeper = new C(1, 1)
        expect(world.beepersPresent(beeper)).eql(true)
        world.removeBeeper(beeper)
        expect(world.beepersPresent(beeper)).eql(false)
        expect(() => world.removeBeeper(beeper)).throws("no beepers on this corner")
    })
    it('exists wall', () => {
        expect(world.existsWall(new C(1, 1), new C(0, 1))).be.true
    })
    
})