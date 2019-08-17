class Arena {
    constructor(width, height) {
        const matrix = [];
        while (height--) {
            matrix.push(new Array(width).fill(0));
        }

        this.matrix = matrix;
    }

    clear() {
        this.matrix.forEach(row => row.fill(0));
    }

    collide(player) {
        const [piece, position] = [player.piece, player.position];

        for (let y = 0; y < piece.length; ++y) {
            for (let x = 0; x < piece[y].length; ++x) {
                if (
                    piece[y][x] !== 0 &&
                    (this.matrix[y + position.y] && this.matrix[y + position.y][x + position.x]) !== 0
                ) {
                    return true;
                }
            }
        }

        return false;
    }

    merge(player) {
        player.piece.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    this.matrix[y + player.position.y][x + player.position.x] = value;
                }
            });
        });
    }

    sweep() {
        let rowCount = 1;
        let sweepPoints = 0;
        outer: for (let y = this.matrix.length - 1; y > 0; --y) {
            for (let x = 0; x < this.matrix[y].length; ++x) {
                if (this.matrix[y][x] === 0) {
                    continue outer;
                }
            }

            const row = this.matrix.splice(y, 1)[0].fill(0);
            this.matrix.unshift(row);
            ++y;

            sweepPoints += rowCount * 10;
            rowCount *= 2;
        }

        return sweepPoints;
    }
}
