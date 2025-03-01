const rows = 6;
const cols = 7;
let currentPlayer = 1;
let playerNames = ["Player 1", "Player 2"];
const board = [];
const boardElement = document.getElementById('board');
const messageElement = document.getElementById('message');
const restartButton = document.getElementById('restart');

function showPlayerNameDialog(callback) {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.display = 'flex';
    modal.style.flexDirection = 'column';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '1000';

    const dialog = document.createElement('div');
    dialog.style.backgroundColor = 'white';
    dialog.style.padding = '20px';
    dialog.style.borderRadius = '10px';
    dialog.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    dialog.style.textAlign = 'center';
    dialog.style.width = '300px';

    const title = document.createElement('h2');
    title.textContent = 'Enter Player Names';
    dialog.appendChild(title);

    const input1 = document.createElement('input');
    input1.type = 'text';
    input1.placeholder = 'Player 1';
    input1.style.marginBottom = '10px';
    input1.style.width = '100%';
    input1.style.height = '25px';
    dialog.appendChild(input1);

    const input2 = document.createElement('input');
    input2.type = 'text';
    input2.placeholder = 'Player 2';
    input2.style.marginBottom = '10px';
    input2.style.width = '100%';
    input2.style.height = '25px';
    dialog.appendChild(input2);

    const startButton = document.createElement('button');
    startButton.textContent = 'Start Game';
    startButton.style.marginTop = '10px';
    startButton.style.padding = '10px 20px';
    startButton.style.backgroundColor = '#4CAF50';
    startButton.style.color = 'white';
    startButton.style.fontSize = '1.2em';
    startButton.style.border = 'none';
    startButton.style.borderRadius = '5px';
    startButton.style.cursor = 'pointer';
    startButton.style.width = '100%';
    dialog.appendChild(startButton);

    modal.appendChild(dialog);
    document.body.appendChild(modal);

    startButton.addEventListener('click', () => {
        playerNames[0] = input1.value || 'Player 1';
        playerNames[1] = input2.value || 'Player 2';
        modal.remove();
        callback();
    });
}

function createBoard() {
    boardElement.innerHTML = '';
    for (let row = 0; row < rows; row++) {
        board[row] = [];
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            board[row][col] = 0;
            boardElement.appendChild(cell);
        }
    }
}

function animateDisc(row, col, callback) {
    const cellSize = boardElement.firstChild.offsetHeight;
    const disc = document.createElement('div');
    disc.classList.add('disc');
    disc.style.backgroundColor = currentPlayer === 1 ? 'yellow' : 'red';
    disc.style.left = `${col * cellSize}px`;
    boardElement.appendChild(disc);

    let currentY = 0;
    const targetY = row * cellSize;

    function drop() {
        currentY += 10;
        if (currentY >= targetY) {
            currentY = targetY;
            disc.style.top = `${currentY}px`;
            callback();
            return;
        }
        disc.style.top = `${currentY}px`;
        requestAnimationFrame(drop);
    }

    drop();
}

function dropDisc(col) {
    for (let row = rows - 1; row >= 0; row--) {
        if (board[row][col] === 0) {
            board[row][col] = currentPlayer;
            animateDisc(row, col, () => {
                const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
                cell.dataset.player = currentPlayer;
                if (checkWin(row, col)) {
                    messageElement.textContent = `${playerNames[currentPlayer - 1]} wins!`;
                    document.body.classList.add('win');
                    boardElement.style.pointerEvents = 'none';
                    triggerStarAnimation();
                    return;
                }
                currentPlayer = currentPlayer === 1 ? 2 : 1;
                messageElement.textContent = `${playerNames[currentPlayer - 1]}'s turn`;
            });
            return;
        }
    }
}

function checkWin(row, col) {
    const directions = [
        { dr: 0, dc: 1 },
        { dr: 1, dc: 0 },
        { dr: 1, dc: 1 },
        { dr: 1, dc: -1 }
    ];

    for (const { dr, dc } of directions) {
        let count = 1;
        count += countInDirection(row, col, dr, dc);
        count += countInDirection(row, col, -dr, -dc);
        if (count >= 4) return true;
    }
    return false;
}

function countInDirection(row, col, dr, dc) {
    let count = 0;
    let r = row + dr;
    let c = col + dc;
    while (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === currentPlayer) {
        count++;
        r += dr;
        c += dc;
    }
    return count;
}

function triggerStarAnimation() {
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDuration = `${1 + Math.random() * 2}s`;
        document.body.appendChild(star);

        setTimeout(() => {
            star.remove();
        }, 3000);
    }
}

boardElement.addEventListener('click', (e) => {
    const col = e.target.dataset.col;
    if (col !== undefined) {
        dropDisc(parseInt(col));
    }
});

restartButton.addEventListener('click', () => {
    currentPlayer = 1;
    messageElement.textContent = `${playerNames[currentPlayer - 1]}'s turn`;
    boardElement.style.pointerEvents = 'auto';
    document.body.classList.remove('win');
    createBoard();
});

showPlayerNameDialog(() => {
    createBoard();
    messageElement.textContent = `${playerNames[currentPlayer - 1]}'s turn`;
});

// CSS styles for stars
const style = document.createElement('style');
style.textContent = `
.star {
    position: fixed;
    width: 7px;
    height: 7px;
    background-color: white;
    border-radius: 50%;
    pointer-events: none;
    animation: fall 6s linear;
    box-shadow: 0 0 13px white;
}

@keyframes fall {
    0% {
        transform: translateY(-100vh);
        opacity: 1;
    }
    100% {
        transform: translateY(100vh);
        opacity: 0;
    }
}`;
document.head.appendChild(style);