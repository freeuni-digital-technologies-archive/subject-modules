const { expect } = require('chai')

module.exports.config = {
    world: {
        width: 2,
        height: 2
    }
}

module.exports.assertions = [
    karel => expect(karel.position).eql({ x: 3, y: 4 }) // whatever
]