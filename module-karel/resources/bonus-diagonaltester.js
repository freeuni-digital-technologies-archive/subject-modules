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

function diagonalBeepers(karel) {
    const w = karel.world.width
    if (w === 1) {
        return karel.world.beepers.length === 1
    }
    for (let i = 1; i <=w; i++) {
        for (let j = 1; j <=w; j++) {
            const first = i
            const second = w + 1 - i
            if (j === first || j === second ) {
                if (beeperCount(karel, i, j) !== 1 || beeperCount(karel, i, j) !== 1) {
                    return false
                }
            } else {
                if (beeperCount(karel, i,j) !== 0) {
                    return false
                }
            }

        }
    }
    return true
}

function message(karel) {
    let msg =  `სამყაროს სიგრძე და სიგანე: ${karel.world.width}.`
    if (karel.world.width === 1) {
        msg = msg + ` პირველ უჯრაზე დევს ${karel.world.beepers.length} ბურთი. `
        if (karel.world.beepers.length > 1) {
            msg = msg + ` ამის შემოწმება შესაძლებელია კოდის დასრულების შემდეგ pickBeeper() გამოძახებით. 
            თუ პირველი გამოძახების შემდეგ ბურთის ნიშანი ისევ არის, ე.ი ერთზე მეტი ბურთი იდო.`
        }
    }
    return msg
}
module.exports.assertions = [
    karel => expect(diagonalBeepers(karel)).equal(true, `${message(karel)}`)
]