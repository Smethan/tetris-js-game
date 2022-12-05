class Piece {
    constructor(ctx, shape, color, x, y) {
        this.ctx = ctx; // canvas2D context
        this.shape = shape; //2d array
        this.color = color; // string
        this.x = x; // number
        this.y = y; // number
    }

    move(pos) {
        this.x = pos.x;
        this.y = pos.y;
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.shape.forEach((row, y) => {
            row.forEach((val, x) => {
                if (val > 0) {
                    // this.x and this.y are effectively the root
                    // x and y here are basically offsets to that value
                    this.ctx.fillRect(this.x + x, this.y + y, 1, 1);
                }
            });
        });
    }
}
