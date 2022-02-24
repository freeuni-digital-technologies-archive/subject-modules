const { expect } = require('chai')

function getRandomWorld() {
    const w = Math.round(Math.random(2, 10)) + 1
    return {
        width: w,
        height: w
    }
}

module.exports.config = [
    {
        world: getRandomWorld()
    },
    {
        world: {
            width: 1,
            height: 1
        }
    }

]

module.exports.assertions = [
    karel => expect(karel.world.beepers.length).equal(karel.world.width, 'all corners on first line should have a beeper (2 versions)')
]