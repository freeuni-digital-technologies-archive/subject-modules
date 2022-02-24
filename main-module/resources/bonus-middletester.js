const { expect } = require('chai')

function getRandomWidth() {
    return Math.round(Math.random()*10) + 10
}
const w = getRandomWidth()
module.exports.config = [
    {
        world: {
            width: 1,
            height: 1
        },
    },
    // {
    //     world:  {
    //         width: 1,
    //         height: w
    //     }
    // },
    // {
    //     world: {
    //         width: w,
    //         height: 1
    //     }
    // },
    {
        world: {
            width: w,
            height: w
        }
    },
    {
        world: {
            width: w +1,
            height: w + 1
        }
    }
]

function beeperCount(karel, x, y = 1) {
    const beeperPresent = karel.world.beepers.filter(e => e.x === x && e.y === y)
    return beeperPresent.length
}

function middleBeeper(karel) {
    const w = karel.world.width
    if (w % 2 === 1)
        return beeperCount(karel, (w + 1)/2) === 1
    return beeperCount(karel, w/2) === 1 || beeperCount(karel, w/2 + 1) === 1
}

function message(karel) {
    return `სამყაროს სიგანე: ${karel.world.width}`
}
module.exports.assertions = [
    karel => expect(karel.world.beepers.length).equal(1, `სამყაროში უნდა იყოს ერთი ბურთი. ${message(karel)}`),
    karel => expect(middleBeeper(karel)).equal(true, `შუა წერტილში უნდა იყოს ბურთი. ${message(karel)}`)
]