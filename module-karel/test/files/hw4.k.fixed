function moveToWall(){
    while(frontIsClear()){
        move();
    }
}

function start(){
    turnLeft();
    moveToWall();
    while(frontIsBlocked()){
        turnRight();
        move();
        turnLeft();
    }
    moveToWall();
    turnRight();
    moveToWall();
}
