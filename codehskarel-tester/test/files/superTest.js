const { expect } = require('chai')
module.exports.config = {

}
module.exports.assertions = [
    karel => expect(karel.position).eql({ x: 1, y: 2 }, 'karel should go to 1x2')
]
