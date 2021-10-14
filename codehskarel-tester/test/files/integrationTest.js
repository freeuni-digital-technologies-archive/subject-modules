const { expect } = require('chai')

module.exports.config = {
    karel: {
        position: [2, 2]
    },
    world: {
        beepers: [[3, 3]]
    }
}

module.exports.assertions = [
    karel => expect(karel.position).eql({x: 3, y: 3}, 'karel should finish on 3x3'),
    karel => expect(karel.world.beepers).length(0, 'all beepers should be picked up'),
    karel => expect(karel.position).eql({x: 2, y:2}, 'karel should finish on 2x2')
]