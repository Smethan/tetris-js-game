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
        this.piece = new Piece(this.ctx);
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

    valid(p) {
        return true;
    }
}
