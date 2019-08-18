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
        this.isGameOver = true;
        this.isPaused = false;

        this.update = this.update.bind(this);
        this.setControls();
        this.setTouchControls();
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
        this.context.font = '2px Arial';
        this.context.fillStyle = '#4386A8';
        this.context.textAlign = 'center';
        this.context.fillText(text, this.scaledWidht / 2, this.scaledHeight / 2);
    }

    drawSubText(text) {
        this.context.font = '1px Arial';
        this.context.fillStyle = '#4386A8';
        this.context.textAlign = 'center';
        this.context.fillText(text, this.scaledWidht / 2, this.scaledHeight / 1.8);
    }

    gameOver(score) {
        this.isGameOver = true;
        this.drawText('Game Over');
        this.drawSubText(`Score: ${score}`);
        cancelAnimationFrame(this.gameId);
    }

    setControls() {
        document.addEventListener('keydown', event => {
            if (!this.isGameOver && !this.isPaused) {
                if (event.keyCode === 37) {
                    this.player.move(-1);
                } else if (event.keyCode === 39) {
                    this.player.move(1);
                } else if (event.keyCode === 40) {
                    this.player.drop();
                } else if (event.keyCode === 81) {
                    this.player.rotate(-1);
                } else if (event.keyCode === 87) {
                    this.player.rotate(1);
                } else if (event.keyCode === 32) {
                    this.togglePause();
                }
            } else if (this.isGameOver && event.keyCode === 13) {
                this.newGame();
            } else if (this.isPaused && event.keyCode === 32) {
                this.togglePause();
            }
        });
    }

    setTouchControls() {
        const mc = new Hammer(this.canvas);

        mc.get('swipe').set({
            direction: Hammer.DIRECTION_ALL,
            threshold: 1,
            velocity: 0.1
        });

        mc.on('swipedown swipeleft swiperight tap press', ev => {
            if (!this.isGameOver && !this.isPaused) {
                switch (ev.type) {
                    case 'swipeleft':
                        this.player.move(-1);
                        break;
                    case 'swiperight':
                        this.player.move(1);
                        break;
                    case 'tap':
                        this.player.rotate(1);
                        break;
                    case 'swipedown':
                        this.player.drop();
                        break;
                    case 'press':
                        this.togglePause();
                        break;
                }
            } else if (this.isGameOver && ev.type === 'tap') {
                this.newGame();
            } else if (this.isPaused && ev.type === 'press') {
                this.togglePause();
            }
        });
    }

    update(time = 0) {
        if (!this.isGameOver) {
            const deltaTime = time - this.lastTime;
            this.lastTime = time;
            this.player.update(deltaTime);
            this.draw();
            this.gameId = requestAnimationFrame(this.update);
        }
    }

    updateScore(score) {
        document.getElementById('score').innerText = score;
    }

    togglePause() {
        if (this.isPaused) {
            this.isPaused = false;
            this.update();
        } else {
            this.isPaused = true;
            cancelAnimationFrame(this.gameId);
            this.drawText('Pause');
        }
    }

    newGame() {
        this.isGameOver = false;
        this.isPaused = false;
        this.update();
    }
}
