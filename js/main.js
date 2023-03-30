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
    flagsCount: 20,
    timer: 0
}
var gEmptyCount = 0
var gLives = 3
var gGameOver = false
var gHintOn = false
var gBestTime = Infinity
function onInit() {
    gBoard = createCleanBoard(2)
    renderEmptyBoard(gBoard)

}


function onRightClicked(elCell) {
    if (gGame.flagsCount < 1) return
    console.log('elCell: ', elCell)
    const elCellI = +elCell.dataset.i
    const elCellJ = +elCell.dataset.j
    const currCell = gBoard[elCellI][elCellJ]
    console.log('currCell: ', currCell)
    if (!currCell.isFlag) gGame.flagsCount--
    else gGame.flagsCount++
    currCell.isFlag = (!currCell.isFlag && currCell.isHiden) ? true : false
    document.querySelector('.flag').innerText = '🚩: ' + gGame.flagsCount
    renderBoard(gBoard, '.board')



}
function onCellClicked(elCell) {
    if (gGameOver) return
    const elCellI = +elCell.dataset.i
    const elCellJ = +elCell.dataset.j
    if (gHintOn) {
        console.log('elCell: ', elCell)
        console.log(gBoard[elCellI][elCellJ])
        revealNebsHint(elCellI, elCellJ, gBoard)
        setTimeout(UnrevealNebs, 3000, elCellI, elCellJ, gBoard)
        return
    }
    /**** if its the first turn *****/
    if (!gGame.isOn) {
        gTimeInterval = setInterval(timer, 1000)
        gBoard = createGameBoard(gLevel, elCellI, elCellJ)
        setBombNegsCount(gBoard)
        renderBoard(gBoard, '.board')
        gGame.isOn = true
        /***** the game starts  *****/
    }

    var currCell = gBoard[elCellI][elCellJ]
    if (currCell.isFlag) return
    if (currCell.isBomb) {
        currCell.isHiden = false
        renderBoard(gBoard, '.board')
        gLives--
        document.querySelector('.live').innerText = 'live left: ' + gLives
        if (gLives === 0) gameOver()
    }

    console.log('gGame.shownCount: ', gGame.shownCount)
    console.log('gEmptyCount: ', gEmptyCount)
    if (currCell.nebsCount < 1) {
        if (currCell.isHiden) gGame.shownCount++
        console.log('gGame.shownCount++: ', gGame.shownCount)
        currCell.isHiden = false
        revealNebs(elCellI, elCellJ, gBoard)
        // return
    }
    if (currCell.nebsCount >= 1) {
        if (currCell.isHiden) gGame.shownCount++
        console.log('gGame.shownCount++: ', gGame.shownCount)
        currCell.isHiden = false
        renderBoard(gBoard, '.board')
    }
    checkVictory(gBoard)
}

function onChosenLevel(btn) {
    var lvl = +btn.dataset.level
    gLevel = lvl
    gGame.flagsCount = gLevel * 10
    restart()

}

function gameOver() {
    clearInterval(gTimeInterval)
    document.querySelector('.timer').innerText = `${gGame.timer}`
    revealBombs(gBoard)
    gLives = 3
    document.querySelector('.modal').style.display = 'block'
    gGame.isOn = false
    console.log(gBoard)
    document.querySelector('.live').innerText = 'live left: ' + gLives
    gGameOver = true
    document.querySelector('.smile-img').src = "pics/sad.jpg"
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
    document.querySelector('.live').innerText = 'live left: ' + gLives
    gGameOver = false
    document.querySelector('.smile-img').src = "pics/smile.jpg"
    gGame.flagsCount = gLevel * 10
    document.querySelector('.flag').innerText = '🚩: ' + gGame.flagsCount
    gGame.shownCount = 0
    gEmptyCount = 0
}

function checkVictory(board) {

    if (gEmptyCount <= gGame.shownCount) {
        document.querySelector('.smile-img').src = "pics/win.jpg"
        gBestTime = (gGame.timer < gBestTime) ? gGame.timer : gBestTime
        localStorage.removeItem("BestTime")
        localStorage.setItem("BestTime", gBestTime)
        document.querySelector('.best').innerText = 'BEST TIME: '+localStorage.getItem("BestTime")
        console.log('localStorage.getItem("BestTime"): ',localStorage.getItem("BestTime") )
        clearInterval(gTimeInterval)
    }


}

function onHint(elHint) {
    if (elHint.dataset.on === 'false') {
        elHint.src = "pics/hint-on.jpg"
        gHintOn = true
        setTimeout(() => {
            gHintOn = false
            elHint.src = "pics/hint-off.jpg"
        }, 3000)
    }

}
