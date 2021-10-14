function return() {
    repeat(3) {
        putBeeper()
    }
}

function main() {
    repeat(2) {
        move()
    }
    turnLeft()
    repeat(2) {
        move()
    }
    turnLeft()
    return()
}