const { expect } = require('chai')

function getRandomBeepers(x) {
    const beepersCount = Math.round(Math.random(2, 10) * 10) + 1
    const beepers = []
    for (let i = 1; i <= beepersCount; i++) {
        beepers.push([x, 1])
    }
    return beepers
}

const x = getRandomBeepers(2)
const y = getRandomBeepers(3)
module.exports.config = {
    world: {
        width: 10,
        height: 10,
        beepers: x.concat(y)
    }
}

function beeperCount(karel, x, y) {
    const beeperPresent = karel.world.beepers.filter(e => e.x === x && e.y === y)
    return beeperPresent.length
}

module.exports.assertions = [
    karel => expect(beeperCount(karel, 2, 1)).equal(0, 'no more beepers should be present on 2x1'),
    karel => expect(beeperCount(karel, 3, 1)).equal(0, 'no more beepers should be present on 3x1'),
    karel => expect(beeperCount(karel, 4, 1)).equal(x.length * y.length, `correctly find multiple of ${x.length}*${y.length}`)
]