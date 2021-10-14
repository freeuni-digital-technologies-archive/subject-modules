const { expect } = require('chai')


function getRandomRange(min, max) {
  return Math.random() * (max - min) + min;
}

function getLineBeepers(cnt){
	const beepers = []
	for (let i = 1; i <= cnt; i++) {
	  beepers.push([i, 1])
	}
	return beepers;
}

function getRandomBeepers() {
    const beepersCount = getRandomRange(1,8)
    return getLineBeepers(beepersCount)
}

const beepers = getRandomBeepers()

module.exports.config = [
    {
        world: {
            width: 10,
            height: 10,
			   beepers: beepers
        },
    },
    {
        world: {
            width: 10,
            height: 10,
			   beepers: getLineBeepers(9)
        },
    },
	 //......
    {
        world: {
            width: 10,
            height: 10,
			   beepers: []
        },
    },
	 //*****.*
    {
        world: {
            width: 10,
            height: 10,
			   beepers: getLineBeepers(5).concat([[7, 1]])
        }
    }
]

function firstNonBeeper(karel) {
	let nonBeeperx = 1
	while(nonBeeperx <= karel.world.width && karel.world.beepers.filter(e => e.x == nonBeeperx && e.y == 1).length == 1){
		nonBeeperx += 1
	}
	return nonBeeperx
}

function posMessage(karel) {
    return `${firstNonBeeper(karel)}x1`
}

module.exports.assertions = [
    karel => expect(karel.position).eql({ x: firstNonBeeper(karel), y: 1 }, `კარელი უნდა იდგეს ${posMessage(karel)}`)
]
