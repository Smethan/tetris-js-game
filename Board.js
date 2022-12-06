class Board {
    ctx;
    ctxNext;
    grid;
    piece;
    next;
    requestId;
    time;

    constructor(ctx) {
        this.ctx = ctx;
    }

    reset() {
        this.grid = this.resetBoard();
        this.piece = new Piece(this.ctx, 25);
    }

    resetBoard() {
        return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    }

    draw() {
        this.piece.draw();
        this.drawBoard();
    }

    drawBoard() {
        this.grid.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.ctx.fillStyle = COLORS[value];
                    this.ctx.fillRect(x, y, 1, 1);
                }
            });
        });
    }

    valid(pos) {
        return pos.shape.every((row, ox) => {
            return row.every((value, oy) => {
                let x = pos.x + ox;
                let y = pos.y + oy;
                return value === 0 || (this.insideWalls(x) && this.aboveFloor(y));
            });
        });
    }

    insideWalls(x) {
        return x >= 0 && x < COLS;
    }

    aboveFloor(y) {
        return y < ROWS;
    }
}
