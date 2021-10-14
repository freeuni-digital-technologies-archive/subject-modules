const { expect } = require('chai')

module.exports.config = {
    karel: {
        position: [1, 1]
    },
    world: {
        beepers: [[5, 1]],
        walls: []
    }
}

function beeperIsPickedUp(karel) {
    const beeperPresent = karel.world.beepers.filter(e => e.x == 5 && e.y == 1)
    return expect(beeperPresent.length).eql(0, 'კარელმა უნდა აიღოს ბურთი რომელიც 5x1-ზე დევს. ' + karel)
}

module.exports.assertions = [
    karel => beeperIsPickedUp(karel),
    karel => expect(karel.position).eql({ x: 5, y: 1 }, 'კარელი უნდა იყოს 5x1 პოზიციაზე')
]
