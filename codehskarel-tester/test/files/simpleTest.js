const { expect } = require('chai')
module.exports.config = {

}
module.exports.assertions = [
    karel => expect(karel.position).eql({ x: 3, y: 1 }, 'karel should go to 3x1')
]
