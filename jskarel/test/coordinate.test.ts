import { expect } from 'chai'
import { C } from '../src/coordinates'

describe('coordinates', () => {
    const c =  new C(1, 1)
    it('set with numbers', () => {
        expect(c.set(1, 2)).eql(new C(1, 2))
    })
    it('set with another coordinate', () => {
        expect(c.set(new C(1, 1))).eql(new C(1, 1))
    })
    it('move', () => {
        expect(c.move(1, 1)).eql(new C(2, 2))
    })
    it('toString-_-', () => {
        expect(c.toString()).eql(`(2,2)`)
    })
})