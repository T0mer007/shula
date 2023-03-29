'use strict'

function createCleanBoard(level) {
    var size = 8
    switch (level) {
        case 1:
            size = 4
            break
        case 2:
            size = 8
            break
        case 3:
            size = 12
    }
    var board = []
    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            board[i][j] = { isFlag: false, char: ' ', isHiden: true }
        }
    }
    return board
}

function createGameBoard(level, elCellI, elCellJ) {
    var size = 8
    var difficulty
    switch (level) {
        case 1:
            size = 4
            difficulty = 0.25
            break
        case 2:
            size = 8
            difficulty = 0.2
            break
        case 3:
            size = 12
            difficulty = 0.35
    }
    const board = []
    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            if (Math.random() > difficulty) {
                board[i][j] = { location: { i, j }, char: EMPTY, isBomb: false, isFlag: false, nebsCount: +0, isHiden: true }
            } else {
                
                board[i][j] = { location: { i, j }, char: BOMB, isBomb: true, isFlag: false, nebsCount: +0, isHiden: true }
            }
            if (i === elCellI && j === elCellJ) {
                board[i][j] = { location: { i, j }, char: EMPTY, isBomb: false, isFlag: false, nebsCount: +0, isHiden: true }
            }
        }
    }
    return board
}

function setBombNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            var currCellNebs = countBombsNeighbors(i, j, board)
            if (!board[i][j].isBomb) {
                board[i][j].nebsCount = currCellNebs
            }
        }
    }
}

function renderEmptyBoard(mat) {
    document.querySelector('.timer').innerText = gGame.timer
    var strHTML = `<table border="0"><tbody>`
    for (var i = 0; i < mat.length; i++) {
        strHTML += `<tr>`
        for (var j = 0; j < mat[0].length; j++) {
            var className = ((i + j) % 2 === 0) ? 'light' : 'dark'
            var cell = (!mat[i][j].isFlag) ? EMPTY : FLAG
            strHTML += `<td data-start=1 data-i=${i} data-j=${j} oncontextmenu="onRightClicked(this);return false" onclick ='onCellClicked(this)' class="cell ${className}">${cell} </td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
}

function renderBoard(mat, selector) {
    var strHTML = '<table border="0"><tbody>'
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j]
            if (!cell.isHiden && cell.isBomb) cell.char = BOMB
            if (cell.isHiden) {
                cell.char = ' '
                cell.char = (cell.isFlag) ? FLAG : ' '
            } else if (cell.nebsCount > 0 && !cell.isBomb) {
                cell.char = cell.nebsCount
            }
            var className = ((i + j) % 2 === 0) ? 'light' : 'dark'
            if (!cell.isHiden) className += ' revealed '
            className += ' cell '
            strHTML += `<td data-i=${i} data-j=${j} oncontextmenu="onRightClicked(this);return false;" onclick="onCellClicked(this)" class="${className} ">${cell.char}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'
    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}

function countBombsNeighbors(cellI, cellJ, mat) {
    if (gBoard[cellI][cellJ].isBomb) return 0
    var neighborsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= mat[i].length) continue
            if (mat[i][j].isBomb) {
                neighborsCount++
            }
        }
    }
    return neighborsCount
}

//random num inclusive

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}


function revealNebs(cellI, cellJ, mat) {

    if (mat[cellI][cellJ].nebsCount > 0) return
    if (mat[cellI][cellJ].isBomb) return
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            // if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= mat[i].length) continue
            if (!mat[i][j].isBomb) {
                var currCell = mat[i][j]
                currCell.isHiden = false
                renderBoard(gBoard, '.board')
                if (gBoard[i][j].nebsCount === 0) {
                    console.log('mat[cellI][cellJ]: ', mat[cellI][cellJ])
                    console.log('currCell.location.i, currCell.location.j: ', currCell.location.i, currCell.location.j)
                    // revealNebs(currCell.location.i, currCell.location.j, mat)
                }
            }
        }
    }
    renderBoard(gBoard, '.board')
}


function revealBombs(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            if (board[i][j].isBomb) board[i][j].isHiden = false
        }
    }
    renderBoard(gBoard, '.board')
}