const { expect } = require('chai')

function getWorld(size) {
    const beepers = []
    const walls = []

	for(let i=2; i<=size-1; i++){
	 walls.push([[i, 1], [i, 2]]);
	 walls.push([[1, i], [2, i]]);
	 walls.push([[i, size], [i, size-1]]);
	 walls.push([[size-1, i], [size, i]]);
	}


    return {
        width: size,
        height: size,
        beepers: beepers,
        walls: walls
    }
}

/**
 *
 * @returns {number} integer from 1 to 10
 */
function getRandom() {
    return Math.round(Math.random()*10)
}

module.exports.config = [
    {
        world: getWorld(3)
    },
    {
        world: getWorld(5)
    },
    {
        world: getWorld(8)
    },
    {
        world: getWorld(getRandom()+ 3)
    }
]


function beeperCount(karel, x, y) {
    const beeperPresent = karel.world.beepers.filter(e => e.x === x && e.y === y)
    return beeperPresent.length
}

module.exports.assertions = [
    karel => expect(karel.position).eql({ x: 1, y: 1 }, `კარელი უნდა იყოს 1x1 პოზიციაზე`),
    karel => {
		 return expect(beeperCount(karel, karel.world.width, karel.world.height))
			 .equal(8, `ზედა მარჯვენა კუთხეში უნდა იყოს 8 ბურთი`)
    },
    karel => {
		 return expect(beeperCount(karel, karel.world.width, 1))
			 .equal(8, `ქვედა მარჯვენა კუთხეში უნდა იყოს 8 ბურთი`)
    },
    karel => {
		 return expect(beeperCount(karel, 1, karel.world.height))
			 .equal(8, `ზედა მარცხენა კუთხეში უნდა იყოს 8 ბურთი`)
    },
    karel => {
		 return expect(beeperCount(karel, 1, 1))
			 .equal(8, `ქვედა მარცხენა კუთხეში უნდა იყოს 8 ბურთი`)
    },
]
