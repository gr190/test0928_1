const BOARD_SIZE = 8;
const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;

let board = [];
let currentPlayer = BLACK;
let gameOver = false;

function initializeBoard() {
    board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(EMPTY));
    const mid = BOARD_SIZE / 2;
    board[mid-1][mid-1] = WHITE;
    board[mid-1][mid] = BLACK;
    board[mid][mid-1] = BLACK;
    board[mid][mid] = WHITE;
}

function renderBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.onclick = () => makeMove(i, j);
            if (board[i][j] !== EMPTY) {
                const disc = document.createElement('div');
                disc.className = `disc ${board[i][j] === BLACK ? 'black' : 'white'}`;
                cell.appendChild(disc);
            }
            boardElement.appendChild(cell);
        }
    }
    updateScore();
    updateStatus();
}

function updateScore() {
    let blackCount = 0;
    let whiteCount = 0;
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (board[i][j] === BLACK) blackCount++;
            if (board[i][j] === WHITE) whiteCount++;
        }
    }
    document.getElementById('black-score').textContent = `黒: ${blackCount}`;
    document.getElementById('white-score').textContent = `白: ${whiteCount}`;
}

function updateStatus() {
    const statusElement = document.getElementById('status');
    if (gameOver) {
        const blackCount = board.flat().filter(cell => cell === BLACK).length;
        const whiteCount = board.flat().filter(cell => cell === WHITE).length;
        if (blackCount > whiteCount) {
            statusElement.textContent = '黒の勝利!';
        } else if (whiteCount > blackCount) {
            statusElement.textContent = '白の勝利!';
        } else {
            statusElement.textContent = '引き分け!';
        }
    } else {
        statusElement.textContent = `現在の手番: ${currentPlayer === BLACK ? '黒' : '白'}`;
    }
}

function isValidMove(row, col, player) {
    if (board[row][col] !== EMPTY) return false;

    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
    ];

    for (const [dx, dy] of directions) {
        let x = row + dx;
        let y = col + dy;
        let flipped = false;

        while (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) {
            if (board[x][y] === EMPTY) break;
            if (board[x][y] === player) {
                if (flipped) return true;
                break;
            }
            flipped = true;
            x += dx;
            y += dy;
        }
    }

    return false;
}

function makeMove(row, col) {
    if (gameOver || !isValidMove(row, col, currentPlayer)) return;

    board[row][col] = currentPlayer;

    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
    ];

    for (const [dx, dy] of directions) {
        let x = row + dx;
        let y = col + dy;
        const toFlip = [];

        while (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) {
            if (board[x][y] === EMPTY) break;
            if (board[x][y] === currentPlayer) {
                for (const [fx, fy] of toFlip) {
                    board[fx][fy] = currentPlayer;
                }
                break;
            }
            toFlip.push([x, y]);
            x += dx;
            y += dy;
        }
    }

    currentPlayer = 3 - currentPlayer;
    if (!canMove(currentPlayer)) {
        currentPlayer = 3 - currentPlayer;
        if (!canMove(currentPlayer)) {
            gameOver = true;
        }
    }

    renderBoard();
}

function canMove(player) {
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (isValidMove(i, j, player)) {
                return true;
            }
        }
    }
    return false;
}

initializeBoard();
renderBoard();
