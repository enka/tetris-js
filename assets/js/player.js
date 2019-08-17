class Player {
    constructor(arena) {
        this.arena = arena;
        this.position = { x: 0, y: 0 };
        this.piece = null;
        this.score = 0;

        this.dropCounter = 0;
        this.dropInteval = 1000;

        this.setControls();
        this.updateScore(this.score);
        this.reset();
    }

    createPiece(type) {
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

    drop() {
        this.position.y++;
        if (this.arena.collide(this)) {
            this.position.y--;
            this.arena.merge(this);
            this.reset();
            this.score += this.arena.sweep();
            this.updateScore(this.score);
        }
        this.dropCounter = 0;
    }

    move(direction) {
        this.position.x += direction;
        if (this.arena.collide(this)) {
            this.position.x -= direction;
        }
    }

    reset() {
        const pieces = 'TOLJISZ';
        this.piece = this.createPiece(pieces[(pieces.length * Math.random()) | 0]);
        this.position.y = 0;
        this.position.x = ((this.arena.matrix[0].length / 2) | 0) - ((this.piece[0].length / 2) | 0);

        if (this.arena.collide(this)) {
            this.arena.clear();
            this.score = 0;
            this.updateScore(this.score);
        }
    }

    rotate(direction) {
        const position = this.position.x;
        let offset = 1;
        this.rotateMatrix(this.piece, direction);
        while (this.arena.collide(this)) {
            this.position.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > this.piece[0].length) {
                this.rotateMatrix(this.piece, -direction);
                this.position.x = position;
                return;
            }
        }
    }

    rotateMatrix(matrix, direction) {
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

    setControls() {
        document.addEventListener('keydown', event => {
            if (event.keyCode === 37) {
                this.move(-1);
            } else if (event.keyCode === 39) {
                this.move(1);
            } else if (event.keyCode === 40) {
                this.drop();
            } else if (event.keyCode === 81) {
                this.rotate(-1);
            } else if (event.keyCode === 87) {
                this.rotate(1);
            }
        });
    }

    update(deltaTime) {
        this.dropCounter += deltaTime;
        if (this.dropCounter > this.dropInteval) {
            this.drop();
        }
    }

    updateScore(score) {
        document.getElementById('score').innerText = score;
    }
}
