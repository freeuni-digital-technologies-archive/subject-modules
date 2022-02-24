/* This program will have Karel run around the racetrack
 * 8 times. */
 
function towall() {
    while(frontIsClear()){
    	move();
    }
} 

function around() {
    for(var i=0; i<4; i++){
        putBall();
        towall();
        turnLeft();
    }
}
 
function start() {
    for(var i=0; i<8; i++){
        around();
    }
    
}
