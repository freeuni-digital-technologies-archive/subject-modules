import { expect } from 'chai'
import { Wall } from '../src/wall'
import { C } from '../src/coordinates'

describe('same walls', () => {
    const wall = new Wall(new C(0, 1), new C(1, 1))
    it('exact match', () => {
        expect(wall.same(new C(0, 1), new C(1, 1))).be.true
    })
    it('reverse match', () => {
        expect(wall.same(new C(1, 1), new C(0, 1))).be.true
    })
    it('when it doesn\'t match', () => {
        expect(wall.same(new C(1, 1), new C(2, 1))).be.false
    })
})

describe('line', () => {
    const c1 = new C(0, 0)
    const c2 = new C(0, 3)
    const c3 = new C(3, 0)
    it('return empty array if x or ys don\'t match', () => {
        expect(Wall.line(c2, c3)).eql([])
    })
    it('horizontal line', () => {
        const line = Wall.line(c1, c3)
        const expected = [
            new Wall(new C(0, -1), new C(0, 0)),
            new Wall(new C(1, -1), new C(1, 0)),
            new Wall(new C(2, -1), new C(2, 0))
        ]
        expected.forEach((wall, index) => {
            expect(wall).eql(line[index])
        })
    })
    it('vertical line', () => {
        const line = Wall.line(c1, c2)
        const expected = [
            new Wall(new C(-1, 0), new C(0, 0)),
            new Wall(new C(-1, 1), new C(0, 1)),
            new Wall(new C(-1, 2), new C(0, 2))
        ]
        expected.forEach((wall, index) => {
            expect(wall).eql(line[index])
        })
    })
})

describe('corners', () => {
    it('corners', () => {
        expect(Wall.corners(2, 2)).eql([
            [1, 1],
            [3, 1],
            [1, 3],
            [3, 3]
        ])
    })
})

describe('borders', () => {
    it('borders', () => {
        expect(Wall.borders(2, 2)).length(8)
    })
})