class Piece {
    x;
    y;
    color;
    shape;
    ctx;
    typeId;

    constructor(ctx, num = 25) {
        this.ctx = ctx; // canvas2D context
        this.spawn(num);
    }

    spawn(num) {
        this.typeId = num == 25 ? this.getRandom(colors.length - 1) : num;
        this.shape = shapes[this.typeId];
        this.color = colors[this.typeId];
        this.x = this.typeId === 4 ? 4 : 3;
        this.y = 0;
    }

    move(pos) {
        this.x = pos.x;
        this.y = pos.y;
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 0.2;
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

    getRandom(number) {
        return Math.floor(Math.random() * number + 1);
    }
}
