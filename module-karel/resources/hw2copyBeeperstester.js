const { expect } = require('chai')

function getRandomRange(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomBeepers() {
    const beepersCount = getRandomRange(1,10)
    const beepers = []
    for (let i = 1; i <= beepersCount; i++) {
        beepers.push([5, 1])
    }
    return beepers
}

const beepers = getRandomBeepers()
module.exports.config = {
    world: {
        width: 10,
        height: 10,
        beepers: beepers
    }
}

function beeperCount(karel, x, y) {
    const beeperPresent = karel.world.beepers.filter(e => e.x === x && e.y === y)
    return beeperPresent.length
}

module.exports.assertions = [
    karel => expect(beeperCount(karel, 5, 1)).equal(0, 'no more beepers should be present on 5x1'),
    karel => expect(beeperCount(karel, 6, 1)).equal(beepers.length, 'all beepers should be moved to 6x1'),
    karel => expect(karel.world.beepers.length).equal(beepers.length, 'there should not be any beepers elsewhere')
]
