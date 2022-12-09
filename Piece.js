class Piece {
    constructor(ctx, num = 25, isShadow = false) {
        this.ctx = ctx; // canvas2D context
        this.spawn(num, isShadow);
    }

    // piece creation function, you can pass number and isShadow to it to modify properties
    spawn(num, isShadow) {
        this.typeId = num === 25 ? this.getRandom(colors.length - 1) : num;
        this.shape = shapes[this.typeId];
        this.color = isShadow ? "grey" : colors[this.typeId];
        this.x = 0;
        this.y = 0;
    }

    // move piece
    move(pos) {
        this.x = pos.x;
        this.y = pos.y;
        this.shape = pos.shape;
    }

    // draw piece on board
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
    // set piece starting position
    // mostly left over from trying to debug collision, can't be bothered to remove
    setStartingPosition() {
        this.x = this.typeId === 4 ? 4 : 3;
    }

    // set next piece starting position
    // this one is actually required to make things look nice
    setNextStartingPosition() {
        if (this.typeId === 4) {
            this.x = 1.5;
        } else if (this.typeId === 1) {
            this.x = 0.5;
        } else {
            this.x = 1;
        }

        this.y = 1;
    }

    // random function, for selecting random piece
    getRandom(number) {
        return Math.floor(Math.random() * number + 1);
    }
}
