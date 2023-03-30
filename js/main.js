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
var gSafeClicks = 3
var gHintsCount = 3
const gUserMoves = []
function onInit() {
    gBoard = createCleanBoard(2)
    renderEmptyBoard(gBoard)


}

function onRightClicked(elCell) {
    if (gGame.flagsCount < 1) return
    const elCellI = +elCell.dataset.i
    const elCellJ = +elCell.dataset.j
    const currCell = gBoard[elCellI][elCellJ]
    if (!currCell.isFlag) gGame.flagsCount--
    else gGame.flagsCount++
    currCell.isFlag = (!currCell.isFlag && currCell.isHiden) ? true : false
    document.querySelector('.flag').innerText = '🚩: ' + gGame.flagsCount
    renderBoard(gBoard, '.board')
}
function onCellClicked(elCell, cellI, cellJ) {
    if (gGameOver) return
    const elCellI = +elCell.dataset.i
    const elCellJ = +elCell.dataset.j
    if (gHintOn) {
        revealNebsHint(elCellI, elCellJ, gBoard)
        setTimeout(UnrevealNebs, 2000, elCellI, elCellJ, gBoard)
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
    gUserMoves.push({ i: elCellI, j: elCellJ })
    var currCell = gBoard[elCellI][elCellJ]
    if (currCell.isFlag) return
    if (currCell.isBomb) {
        currCell.isHiden = false
        renderBoard(gBoard, '.board')
        gLives--
        document.querySelector('.live').innerText = 'live left: ' + gLives
        if (gLives === 0) gameOver()
    }

    if (currCell.nebsCount < 1) {
        if (currCell.isHiden) gGame.shownCount++
        currCell.isHiden = false
        revealNebs(elCellI, elCellJ, gBoard)
        // return
    }
    if (currCell.nebsCount >= 1) {
        if (currCell.isHiden) gGame.shownCount++
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
    revealBombs(gBoard)
    gLives = 3
    gGame.isOn = false
    gGameOver = true
    document.querySelector('.modal').style.display = 'block'
    document.querySelector('.timer').innerText = `${gGame.timer}`
    document.querySelector('.live').innerText = 'live left: ' + gLives
    document.querySelector('.smile-img').src = "pics/sad.jpg"
}

function timer() {
    gGame.timer++
    document.querySelector('.timer').innerText = `${gGame.timer}`
}

function restart() {
    clearInterval(gTimeInterval)
    gBoard = createCleanBoard(gLevel)
    renderEmptyBoard(gBoard)
    gGame.timer = 0
    gGame.isOn = false
    gGameOver = false
    gGame.flagsCount = gLevel * 10
    gGame.shownCount = 0
    gEmptyCount = 0
    gSafeClicks = 3
    gHintsCount = 3
    document.querySelector('.modal').style.display = 'none'
    document.querySelector('.live').innerText = 'live left: ' + gLives
    document.querySelector('.smile-img').src = "pics/smile.jpg"
    document.querySelector('.flag').innerText = '🚩: ' + gGame.flagsCount
    document.querySelector('.sides.left.safe').innerText = 'SAFE CLICK: ' + gSafeClicks
    document.querySelector('.timer').innerText = `${gGame.timer}`
}

function checkVictory(board) {

    if (gEmptyCount <= gGame.shownCount) {
        document.querySelector('.smile-img').src = "pics/win.jpg"
        gBestTime = (gGame.timer < gBestTime) ? gGame.timer : gBestTime
        localStorage.removeItem("BestTime")
        localStorage.setItem("BestTime", gBestTime)
        document.querySelector('.best').innerText = 'BEST TIME: ' + localStorage.getItem("BestTime")
        console.log('localStorage.getItem("BestTime"): ', localStorage.getItem("BestTime"))
        clearInterval(gTimeInterval)
    }


}

function onHint(elHint) {
    if (gHintsCount < 1) return
    if (elHint.dataset.on === 'false') {
        elHint.src = "pics/hint-on.jpg"
        gHintOn = true
        gHintsCount--
        setTimeout(() => {
            gHintOn = false
            elHint.src = "pics/hint-off.jpg"
        }, 2000)
    }

}
function onSafeClick(elDiv) {
    if (gSafeClicks < 1) return
    var randCellI = getRandomIntInclusive(0, gBoard.length - 1)
    var randCellj = getRandomIntInclusive(0, gBoard.length - 1)
    if (!gBoard[randCellI][randCellj].isBomb) {
        gBoard[randCellI][randCellj].isSafe = true
        renderBoard(gBoard, '.board')
        gSafeClicks--
        elDiv.innerText = 'SAFE CLICK: ' + gSafeClicks
        setTimeout(() => {
            gBoard[randCellI][randCellj].isSafe = false
            renderBoard(gBoard, '.board')
        }, 3000)
    } else onSafeClick(gBoard)
}

function onUndo() {
    gUserMoves.pop()

}

function onDarkMode(){
    document.querySelector('body').classList.toggle('dark-mode')
}