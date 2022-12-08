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
        this.ctxNext = ctxNext;
        this.init();
    }

    init() {
        this.ctx.canvas.width = COLS * SIZE;
        this.ctx.canvas.height = ROWS * SIZE;

        this.ctx.scale(SIZE, SIZE);
    }

    reset() {
        this.grid = this.resetBoard();
        // this.piece = new Piece(this.ctx, 25);
        // this.piece.setStartingPosition();
        // this.next = new Piece(this.ctxNext, 25);
        this.newPieceGen();
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
                    this.ctx.fillStyle = colors[value];
                    this.ctx.fillRect(x, y, 1, 1);
                }
            });
        });
    }

    valid(piece) {
        return piece.shape.every((row, oy) => {
            return row.every((value, ox) => {
                let x = piece.x + ox;
                let y = piece.y + oy;
                return value === 0 || (this.insideWalls(x) && this.aboveFloor(y) && this.occupiedCheck(x, y));
            });
        });
    }

    insideWalls(x) {
        return x >= 0 && x < COLS;
    }

    aboveFloor(y) {
        return y <= ROWS;
    }

    occupiedCheck(x, y) {
        return this.grid[y] && this.grid[y][x] === 0;
    }

    downTick() {
        // runs on every "tick" to move the piece down forcefully
        let pos = moves["ArrowDown"](this.piece);
        if (this.valid(pos)) {
            // if valid, nothing special
            this.piece.move(pos);
        } else {
            // otherwise, freeze the piece and see if there are lines to clear
            this.freezePiece();
            this.checkLineClear();
            if (this.piece.y === 0) {
                // if piece is at the top, its gg
                return false;
            }

            // creates new piece from next piece and makes new next piece
            this.newPieceGen();
        }
        return true;
    }

    freezePiece() {
        this.piece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    // the grid is basically our "terrain", drawn separately from the piece
                    this.grid[y + this.piece.y][x + this.piece.x] = value;
                }
            });
        });
    }

    checkLineClear() {
        this.grid.forEach((row, y) => {
            if (row.every((value) => value > 0)) {
                // remove 1 line
                this.grid.splice(y, 1);

                // add empty line at top
                this.grid.unshift(Array(COLS).fill(0));
            }
        });
    }

    newPieceGen() {
        this.piece = new Piece(this.ctx, this.next ? this.next.typeId : 25);
        this.piece.setStartingPosition();
        this.next = new Piece(this.ctxNext, 25);
        this.next.setNextStartingPosition();
        this.ctxNext.clearRect(0, 0, this.ctxNext.canvas.width, this.ctxNext.canvas.height);
        this.next.draw();
    }
}
