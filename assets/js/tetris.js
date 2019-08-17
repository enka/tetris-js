class Tetris {
    constructor(canvas) {
        this.scale = 20;
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.context.scale(this.scale, this.scale);
        this.scaledWidht = this.canvas.width / this.scale;
        this.scaledHeight = this.canvas.height / this.scale;
        this.arena = new Arena(this.scaledWidht, this.scaledHeight);
        this.player = new Player(this);

        this.colors = [null, '#9F00EE', '#E8E702', '#EFA100', '#150FDB', '#03E8EB', '#03DA01', '#D50001'];
        this.lastTime = 0;
        this.isPlaying = false;
        this.isGameOver = false;
        this.setControls();

        this.update = this.update.bind(this);
        //this.newGame();
        this.drawTitle();
    }

    draw() {
        this.drawCanvas();
        this.drawMatrix(this.arena.matrix, { x: 0, y: 0 });
        this.drawMatrix(this.player.piece, this.player.position);
    }

    drawCanvas() {
        this.context.fillStyle = '#000';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawMatrix(matrix, position) {
        matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    this.context.fillStyle = this.colors[value];
                    this.context.fillRect(x + position.x, y + position.y, 1, 1);
                }
            });
        });
    }

    drawTitle() {
        this.drawCanvas();
        this.drawText('Tetris JS');
        this.drawSubText('Press ENTER to START');
    }

    drawText(text) {
        this.context.font = '2px Verdana';
        this.context.fillStyle = '#48A';
        this.context.textAlign = 'center';
        this.context.fillText(text, this.scaledWidht / 2, this.scaledHeight / 2);
    }

    drawSubText(text) {
        this.context.font = '1px Verdana';
        this.context.fillStyle = '#48A';
        this.context.textAlign = 'center';
        this.context.fillText(text, this.scaledWidht / 2, this.scaledHeight / 1.8);
    }

    gameOver(score) {
        this.isPlaying = false;
        this.isGameOver = true;
        cancelAnimationFrame(this.gameId);
        this.drawText('Game Over');
        this.drawSubText(`Score: ${score}`);
    }

    setControls() {
        document.addEventListener('keydown', event => {
            if (event.keyCode === 32 && !this.isGameOver) {
                this.pause();
            } else if (event.keyCode === 13 && !this.isPlaying) {
                this.newGame();
            }
        });
    }

    update(time = 0) {
        if (this.isPlaying) {
            const deltaTime = time - this.lastTime;
            this.lastTime = time;
            this.player.update(deltaTime);
            this.draw();
            this.gameId = requestAnimationFrame(this.update);
        }
    }

    pause() {
        if (this.isPlaying) {
            this.isPlaying = false;
            cancelAnimationFrame(this.gameId);
            this.drawText('Pause');
        } else {
            this.isPlaying = true;
            this.update();
        }
    }

    newGame() {
        this.isPlaying = true;
        this.isGameOver = false;
        this.update();
    }
}
