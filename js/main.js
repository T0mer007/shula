'use strict'
const EMPTY = ' '
const BOMB = '💣'
const FLAG = '🚩'
var gBoard
const gEmptySpots = []

function onInit() {
    gBoard = createBoard(2)
    renderBoard(gBoard, '.board')
    console.log('gBoard[3][4]: ', gBoard[3][4])

}

function choseLevel(btn) {
    var lvl = +btn.dataset.level
    gBoard = createBoard(lvl)
    renderBoard(gBoard, '.board')
}

function createBoard(level) {
    var height
    var width
    var difficulty
    switch (level) {
        case 1:
            height = 4
            width = 6
            difficulty = 0.25
            break
        case 2:
            height = 7
            width = 10
            difficulty = 0.4
            break
        case 3:
            height = 12
            width = 16
            difficulty = 0.5
    }
    const board = []
    for (var i = 0; i < height; i++) {
        board.push([])
        for (var j = 0; j < width; j++) {
            if (Math.random() > difficulty) {
                board[i][j] = { location: { i, j }, char: EMPTY, isBomb: false, isFlag: false, nebsCount: 0, isHiden: true, isEmpty: true }
            } else {

                board[i][j] = { location: { i, j }, char: BOMB, isBomb: true, isFlag: false, nebsCount: 0, isHiden: false }
            }


        }
    }
    return board
}


function renderBoard(mat, selector) {

    var strHTML = '<table border="0"><tbody>'
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j]
            if (cell.isHiden) {
                cell.char = ' '
                cell.char = (cell.isFlag) ? FLAG : ' '
            } else if (cell.nebsCount > 0) {
                cell.char = cell.nebsCount
            }

            var className = ((i + j) % 2 === 0) ? 'light' : 'dark'
            if (cell.isEmpty) className += ' empty '
            className += ' cell '
            strHTML += `<td data-i=${i} data-j=${j} oncontextmenu="onRightClicked(this);return false;" onclick="onCellClicked(this)" class="${className} ">${cell.char}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}

function onRightClicked(elCell) {
    const elCellI = +elCell.dataset.i
    const elCellJ = +elCell.dataset.j
    const currCell = gBoard[elCellI][elCellJ]
    currCell.isFlag = (!currCell.isFlag && currCell.isHiden) ? true : false
    console.log('currCell: ', currCell)
    renderBoard(gBoard, '.board')



}
function onCellClicked(elCell) {
    const elCellI = +elCell.dataset.i
    const elCellJ = +elCell.dataset.j
    const elCurrCell = gBoard[elCellI][elCellJ]
    if (!elCurrCell.isHiden) return
    if (elCurrCell.isFlag) return
    if (!elCurrCell.isBomb) {
        gEmptySpots.push({ i: elCellI, j: elCellJ })
        var neighborsCount = countNeighbors(gEmptySpots[0].i, gEmptySpots[0].j, gBoard)
        if (neighborsCount > 0) {
            elCurrCell.isHiden = false
            elCurrCell.char = neighborsCount

            renderBoard(gBoard, '.board')

        } else {
            gameOver()
        }
    }
}

// COUNT NEIGHBORS

function countNeighbors(cellI, cellJ, mat) {
    if (!gEmptySpots[0]) return
    var neighborsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= mat[i].length) continue
            var elCurrCell = gBoard[i][j]
            if (mat[i][j].isBomb) {
                neighborsCount++

            }
            // else {
            //     gEmptySpots.push({ i, j })
            //     console.log('gEmptySpots: ',gEmptySpots  )
            // if (neighborsCount > 0 ) {
            //     elCurrCell.isHiden = false
            //     elCurrCell.char = neighborsCount

            //     renderBoard(gBoard, '.board')
            //         // console.log('neighborsCount: ', neighborsCount)
            //         // countNeighbors(gEmptySpots[0].i, gEmptySpots[0].j, gBoard)
            //     }

            // }

        }
    }
return neighborsCount
}


function gameOver() {
    console.log('Game Over! ')
}