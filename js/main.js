'use strict'
const EMPTY = ' '
const BOMB = '💣'
const FLAG = '🚩'
var gBoard
var gTimeInterval
var gLevel = 2
const gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    timer: 0
}
var gLives = 3

const gEmptySpots = []

function onInit() {
    gBoard = createCleanBoard(2)
    renderEmptyBoard(gBoard)

}


function onRightClicked(elCell) {
    console.log('elCell: ', elCell)
    const elCellI = +elCell.dataset.i
    const elCellJ = +elCell.dataset.j
    const currCell = gBoard[elCellI][elCellJ]
    console.log('currCell: ', currCell)
    currCell.isFlag = (!currCell.isFlag && currCell.isHiden) ? true : false
    renderBoard(gBoard, '.board')



}
function onCellClicked(elCell) {
    const elCellI = +elCell.dataset.i
    const elCellJ = +elCell.dataset.j
    /**** if its the first turn *****/
    if (!gGame.isOn) {
        gTimeInterval = setInterval(timer, 1000)
        console.log(elCellI, elCellJ);
        gBoard = createGameBoard(gLevel, elCellI, elCellJ)
        console.log(gBoard);
        setBombNegsCount(gBoard)
        renderBoard(gBoard, '.board')
        gGame.isOn = true
        /***** the game starts  *****/
    }
    // gBoard:
    var currCell = gBoard[elCellI][elCellJ]
    console.log('currCell: ', currCell)
    // if (!currCell.isHiden) return
    if (currCell.isFlag) return
    if (currCell.isBomb) {
        currCell.isHiden = false
        renderBoard(gBoard, '.board')
        gLives--
        document.querySelector('.live').innerText = 'live left: ' + gLives
        if (gLives === 0) gameOver()
    }
    if (currCell.nebsCount < 1) {
        currCell.isHiden = false
        revealNebs(elCellI, elCellJ, gBoard)
    }
    if (currCell.nebsCount >= 1) {
        currCell.isHiden = false
        renderBoard(gBoard, '.board')
    }

}

function onChosenLevel(btn) {
    var lvl = +btn.dataset.level
    gLevel = lvl
    restart()
    console.log('gGame.isOn: ', gGame.isOn)
    document.querySelector('.modal').style.display = 'none'

}

function gameOver() {
    console.log('Game Over! ')
    clearInterval(gTimeInterval)
    document.querySelector('.timer').innerText = `${gGame.timer}`
    revealBombs(gBoard)
    gLives = 3
    document.querySelector('.modal').style.display = 'block'
    gGame.isOn = false
    console.log(gBoard)

}

function timer() {
    gGame.timer++
    document.querySelector('.timer').innerText = `${gGame.timer}`
}

function restart() {
    clearInterval(gTimeInterval)
    gGame.timer = 0
    document.querySelector('.timer').innerText = `${gGame.timer}`
    gGame.isOn = false
    gBoard = createCleanBoard(gLevel)
    renderEmptyBoard(gBoard)
    document.querySelector('.modal').style.display = 'none'
}