const { expect } = require('chai')

/**
 *
 * @returns {number} integer from 1 to 10
 */
function getRandom() {
    return Math.round(Math.random()*10)
}

function getWorld(size, fence_y, door_x) {
    const beepers = []
    const walls = []

	 for (let i = 1; i <= size; i++){
		 if(i==door_x)continue;
		 walls.push([[i, fence_y], [i, fence_y+1]]);
	 }

    return {
        width: size,
        height: size,
        beepers: beepers,
        walls: walls
    }
}


module.exports.config = [
    {
        world: getWorld(10, 2, 4)
    },
    {
        world: getWorld(10, 2, 2)
    },
    {
        world: getWorld(8, 5, 8)
    },
    {
        world: getWorld(15, 12, 12)
    },
    {
        world: getWorld(14, getRandom()+2, getRandom()+2)
    }
]



module.exports.assertions = [
	karel => expect(karel.position).eql({ x: karel.world.width, y: karel.world.height }, 
		`კარელი უნდა იყოს ${karel.world.width}x${karel.world.height} პოზიციაზე`
	),
	karel => expect(karel.direction).eql(0, 
		`კარელი უნდა იხედებოდეს აღმოსავლეთით`
	),
]
