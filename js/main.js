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
var gGameisOver = false
var gHintOn = false
var gBestTime = Infinity
var gSafeClicks = 3
var gHintsCount = 3
var gUserMoves = []
var gMegaHint = false
var gMegaSpots = []
var gMegaCount = 2
var gBombsExterminated = 0
var gBombsOnMode
var gBombModeIsOn = false



function onInit() {
    gBoard = createCleanBoard(2)
    renderEmptyBoard(gBoard)


}

function onRightClicked(elCell) {
    if (gGame.flagsCount < 1) return
    if (gGameisOver) return
    const elCellI = +elCell.dataset.i
    const elCellJ = +elCell.dataset.j
    const currCell = gBoard[elCellI][elCellJ]
    if (!currCell.isFlag) gGame.flagsCount--
    else gGame.flagsCount++
    currCell.isFlag = (!currCell.isFlag && currCell.isHiden) ? true : false
    document.querySelector('.flag').innerText = '🚩: ' + gGame.flagsCount
    renderBoard(gBoard, '.board')
}
function onCellClicked(elCell) {
    const elCellI = +elCell.dataset.i
    const elCellJ = +elCell.dataset.j
    if (gGameisOver) return
    if (gBombModeIsOn) {
        gBoard[elCellI][elCellJ].isBomb = true
        gBoard[elCellI][elCellJ].isHiden = false
        gBombsOnMode--
        console.log('gBombsOnMode: ', gBombsOnMode)
        renderBoard(gBoard, '.board')
        if (gBombsOnMode < 1) {
            hideAllBoard(gBoard)
            gBombModeIsOn = false
            console.log(gBombModeIsOn);
        }
        return
    }
    if (gHintOn) {
        gHintOn = false
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
    if (gMegaHint) {
        if (gMegaCount >= 0) {
            gMegaSpots.push(gBoard[elCellI][elCellJ])
            gMegaCount--
            if (gMegaCount === 0) {
                revealMegaHint(gMegaSpots[0].location, gMegaSpots[1].location, gBoard)
                setTimeout(UnRevealMegaHint, 3000, gMegaSpots[0].location, gMegaSpots[1].location, gBoard)
                gMegaHint = false
            }
        }
        return
    }
    gUserMoves.push(elCell)
    var currCell = gBoard[elCellI][elCellJ]
    if (currCell.isFlag) return
    if (currCell.isBomb) {
        if (!currCell.isHiden) return
        currCell.isHiden = false
        gLives--
        renderBoard(gBoard, '.board')
        var audioBomb = new Audio('./sounds/bomb.mp3')
        audioBomb.play()
        document.querySelector('.live').innerText = '😇: ' + gLives

        if (gLives === 0) gameOver()
    }

    if (currCell.nebsCount < 1) {
        if (currCell.isHiden) gGame.shownCount++

        currCell.isHiden = false
        revealNebs(elCellI, elCellJ, gBoard)
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
    gGameisOver = true
    var audio = new Audio('./sounds/game-over.wav')
    audio.play()
    document.querySelector('.modal').style.display = 'block'
    document.querySelector('.timer').innerText = `${gGame.timer}`
    document.querySelector('.live').innerText = '😇: ' + gLives
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
    gGameisOver = false
    gGame.flagsCount = gLevel * 10
    gGame.shownCount = 0
    gEmptyCount = 0
    gLives = 3
    gSafeClicks = 3
    gHintsCount = 3
    gUserMoves = []
    gMegaHint = false
    gMegaSpots = []
    gMegaCount = 2
    gBombsExterminated = 0
    document.querySelector('.exterminator').innerText = 'Exterminator 💣'
    document.querySelector('.mega-hint').classList.remove('dark-mode')
    document.querySelector('.hints').classList.remove('dark-mode')
    document.querySelector('.modal').style.display = 'none'
    document.querySelector('.live').innerText = '😇: ' + gLives
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
        clearInterval(gTimeInterval)
        var audio = new Audio('./sounds/win.wav')
        audio.play()
        gGameisOver = true
    }


}

function onHint(elHint) {
    if (gHintsCount < 1) {
        document.querySelector('.hints').classList.add('dark-mode')
        return
    }
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
    const elCellI = + gUserMoves[gUserMoves.length - 1].dataset.i
    const elCellJ = + gUserMoves[gUserMoves.length - 1].dataset.j
    console.log('gBoard[elCellI][elCellJ]: ', gBoard[elCellI][elCellJ])
    if (gBoard[elCellI][elCellJ].isBomb) {
        gLives++
        document.querySelector('.live').innerText = '😇: ' + gLives
        gBoard[elCellI][elCellJ].isHiden = true
        renderBoard(gBoard, '.board')
    } else if (gBoard[elCellI][elCellJ].nebsCount === 0) {

        undoRevealNebs(elCellI, elCellJ, gBoard)
    } else {
        gBoard[elCellI][elCellJ].isHiden = true
        gGame.shownCount--
        renderBoard(gBoard, '.board')
    }
    gUserMoves.pop()
}

function onDarkMode() {
    document.querySelector('body').classList.toggle('dark-mode')
}

function onMegaHint() {
    if (gMegaSpots.length > 0) return
    gMegaHint = true
    document.querySelector('.mega-hint').classList.add('dark-mode')

}

function onBombExterminator(elDiv) {
    for (var i = 0; i < 300; i++) {
        if (gBombsExterminated > 3) {
            elDiv.innerText = 'Exterminator 💥'
            return
        }
        var randCellI = getRandomIntInclusive(0, gBoard.length - 1)
        var randCellj = getRandomIntInclusive(0, gBoard.length - 1)
        if (gBoard[randCellI][randCellj].isBomb) {
            gBoard[randCellI][randCellj].isBomb = false
            gBombsExterminated++
            renderBoard(gBoard, '.board')
        }
    }
}

function onBombMode() {

    restart()
    switch (gLevel) {
        case 1:
            gBombsOnMode = 3
            break
        case 2:
            gBombsOnMode = 8
            break
        case 3:
            gBombsOnMode = 15
    }
    gBombModeIsOn = true
}
