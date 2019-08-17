class Tetris {
    constructor(canvas) {
        this.scale = 20;
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.context.scale(this.scale, this.scale);
        this.arena = new Arena(this.canvas.width / this.scale, this.canvas.height / this.scale);
        this.player = new Player(this.arena);

        this.colors = [null, '#9F00EE', '#E8E702', '#EFA100', '#150FDB', '#03E8EB', '#03DA01', '#D50001'];
        let lastTime = 0;

        const update = (time = 0) => {
            const deltaTime = time - lastTime;
            lastTime = time;
            this.player.update(deltaTime);
            this.draw();
            requestAnimationFrame(update);
        };

        update();
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
}
