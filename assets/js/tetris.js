const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

// Todo change 20, 20 for scale, scale
context.scale(20, 20);

function initializeArena(width, height) {
    const arena = [];
    while (height--) {
        arena.push(new Array(width).fill(0));
    }

    return arena;
}

function createPiece(type) {
    switch (type) {
        case 'T':
            return [[0, 0, 0], [1, 1, 1], [0, 1, 0]];
        case 'O':
            return [[2, 2], [2, 2]];
        case 'L':
            return [[0, 3, 0], [0, 3, 0], [0, 3, 3]];
        case 'J':
            return [[0, 4, 0], [0, 4, 0], [4, 4, 0]];
        case 'I':
            return [[0, 5, 0, 0], [0, 5, 0, 0], [0, 5, 0, 0], [0, 5, 0, 0]];
        case 'S':
            return [[0, 6, 6], [6, 6, 0], [0, 0, 0]];
        case 'Z':
            return [[7, 7, 0], [0, 7, 7], [0, 0, 0]];
    }
}

function draw() {
    drawCanvas();
    drawMatrix(arena, { x: 0, y: 0 });
    drawMatrix(player.piece, player.position);
}

function drawCanvas() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function drawMatrix(matrix, position) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = colors[value];
                context.fillRect(x + position.x, y + position.y, 1, 1);
            }
        });
    });
}

function merge(arena, player) {
    player.piece.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.position.y][x + player.position.x] = value;
            }
        });
    });
}

function arenaSweep() {
    let rowCount = 1;
    outer: for (let y = arena.length - 1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }

        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;

        player.score += rowCount * 10;
        rowCount *= 2;
    }
}

function collide(arena, player) {
    const [piece, position] = [player.piece, player.position];

    for (let y = 0; y < piece.length; ++y) {
        for (let x = 0; x < piece[y].length; ++x) {
            if (piece[y][x] !== 0 && (arena[y + position.y] && arena[y + position.y][x + position.x]) !== 0) {
                return true;
            }
        }
    }

    return false;
}

function playerDrop() {
    player.position.y++;
    if (collide(arena, player)) {
        player.position.y--;
        merge(arena, player);
        playerReset();
        arenaSweep();
        updateScore();
    }
    dropCounter = 0;
}

function playerMove(direction) {
    player.position.x += direction;
    if (collide(arena, player)) {
        player.position.x -= direction;
    }
}

function playerReset() {
    const pieces = 'TOLJISZ';
    player.piece = createPiece(pieces[(pieces.length * Math.random()) | 0]);
    player.position.y = 0;
    player.position.x = ((arena[0].length / 2) | 0) - ((player.piece[0].length / 2) | 0);

    if (collide(arena, player)) {
        arena.forEach(row => row.fill(0));
        player.score = 0;
        updateScore();
    }
}

function playerRotate(direction) {
    const position = player.position.x;
    let offset = 1;
    rotate(player.piece, direction);
    while (collide(arena, player)) {
        player.position.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.piece[0].length) {
            rotate(player.piece, -direction);
            player.position.x = position;
            return;
        }
    }
}

function rotate(matrix, direction) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
    }

    if (direction > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

let dropCounter = 0;
let dropInteval = 1000;
let lastTime = 0;

function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if (dropCounter > dropInteval) {
        playerDrop();
    }

    draw();
    requestAnimationFrame(update);
}

function updateScore() {
    document.getElementById('score').innerText = player.score;
}

const colors = [null, '#9F00EE', '#E8E702', '#EFA100', '#150FDB', '#03E8EB', '#03DA01', '#D50001'];
//todo change numbers by canvas.width/scale, canvas.height/scale
const arena = initializeArena(12, 20);

const player = {
    position: { x: 0, y: 0 },
    piece: null,
    score: 0
};

document.addEventListener('keydown', event => {
    if (event.keyCode === 37) {
        playerMove(-1);
    } else if (event.keyCode === 39) {
        playerMove(1);
    } else if (event.keyCode === 40) {
        playerDrop();
    } else if (event.keyCode === 81) {
        playerRotate(-1);
    } else if (event.keyCode === 87) {
        playerRotate(1);
    }
});

playerReset();
updateScore();
update();
