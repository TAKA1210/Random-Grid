const canvas = document.getElementById('gridCanvas');
const context = canvas.getContext('2d');

let gridSize = 10;
let characters = 'ABCD';  // Default characters
let sequence = characters;
let grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));
let fixedCells = new Set();

function checkSequence() {
    const seqLength = sequence.length;

    // 横のチェック
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j <= gridSize - seqLength; j++) {
            if (grid[i].slice(j, j + seqLength).join('') === sequence) {
                for (let k = 0; k < seqLength; k++) {
                    fixedCells.add(`${i},${j + k}`);
                }
            }
        }
    }

    // 縦のチェック
    for (let j = 0; j < gridSize; j++) {
        for (let i = 0; i <= gridSize - seqLength; i++) {
            if (sequence.split('').every((char, k) => grid[i + k][j] === char)) {
                for (let k = 0; k < seqLength; k++) {
                    fixedCells.add(`${i + k},${j}`);
                }
            }
        }
    }
}

function updateGrid() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (!fixedCells.has(`${i},${j}`)) {
                grid[i][j] = characters[Math.floor(Math.random() * characters.length)];
            }
        }
    }
}

function drawGrid() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // セルサイズと文字の大きさを調整
    const cellSize = Math.floor(Math.min(canvas.width, canvas.height) / gridSize);
    const fontSize = Math.floor(cellSize * 0.6);

    context.font = `${fontSize}px Arial`;

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const color = fixedCells.has(`${i},${j}`) ? 'red' : 'black';
            context.strokeStyle = color;
            context.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize);
            context.fillStyle = color;
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(grid[i][j], j * cellSize + cellSize / 2, i * cellSize + cellSize / 2);
        }
    }
}

function update() {
    const inputCharacters = document.getElementById('characters').value.toUpperCase().trim();
    const inputSize = parseInt(document.getElementById('gridSize').value, 10);
    
    if (inputCharacters.length > 0) {
        characters = inputCharacters;
        sequence = characters;
    }

    if (inputSize > 0) {
        gridSize = inputSize;
    }

    fixedCells.clear();
    grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));
    updateGrid();
    drawGrid();
}

function loop() {
    updateGrid();
    checkSequence();
    drawGrid();
    setTimeout(loop, 500);
}

// 初期化してループを開始
update();
loop();
