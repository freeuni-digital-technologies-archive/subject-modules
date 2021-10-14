import { expect } from 'chai'
import { Karel } from '../src'
import { Wall } from '../src/wall'
import { C } from '../src/coordinates'

describe('superkarel movement', () => {
    const karel = new Karel({})
    it('going in cicle', () => {
        karel.turnLeft()
        karel.move()
        expect(karel.position).eql(new C(1, 2))
        expect(karel.leftIsClear()).be.false
		  karel.turnRight()
		  karel.turnAround()
		  karel.turnAround()
        expect(karel.leftIsClear()).be.true
        expect(karel.facingEast()).be.true
		  karel.move()
        expect(karel.position).eql(new C(2, 2))
		  karel.turnRight()
		  karel.move()
        expect(karel.position).eql(new C(2, 1))
        expect(karel.frontIsClear()).be.false
		  karel.turnRight()
		  karel.move()
        expect(karel.position).eql(new C(1, 1))
    })
    it('turning around', () => {
        expect(karel.frontIsClear()).be.false
		  karel.turnAround()
        expect(karel.frontIsClear()).be.true
		  karel.move()
        expect(karel.position).eql(new C(2, 1))
    })
})
