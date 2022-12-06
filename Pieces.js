class Piece {
    constructor(ctx, num = 25) {
        this.ctx = ctx; // canvas2D context
        this.spawn(num);
    }

    spawn(num) {
        this.typeId = num === 25 ? this.getRandom(colors.length - 1) : num;
        this.shape = shapes[this.typeId];
        this.color = colors[this.typeId];
        this.x = 0;
        this.y = 0;
    }

    move(pos) {
        this.x = pos.x;
        this.y = pos.y;
        this.shape = pos.shape;
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.shape.forEach((row, y) => {
            row.forEach((val, x) => {
                if (val > 0) {
                    // this.x and this.y are effectively the root
                    // x and y here are basically offsets to that value
                    // this.ctx.strokeRect(this.x + x, this.y + y, 1, 1);
                    this.ctx.fillRect(this.x + x, this.y + y, 1, 1);
                }
            });
        });
    }
    setStartingPosition() {
        this.x = this.typeId === 4 ? 4 : 3;
    }
    getRandom(number) {
        return Math.floor(Math.random() * number + 1);
    }
}
