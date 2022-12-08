class Board {
    constructor(ctx) {
        this.ctx = ctx;
        this.ctxNext = ctxNext;
        this.ctxSaved = ctxSaved;
        this.init();
    }

    init() {
        this.ctx.canvas.width = COLS * SIZE;
        this.ctx.canvas.height = ROWS * SIZE;

        this.ctx.scale(SIZE, SIZE);
    }

    reset() {
        this.grid = this.resetBoard();

        this.hasSwapped = false;
        this.ctxSaved.clearRect(0, 0, this.ctxSaved.canvas.width, this.ctxSaved.canvas.height);
        this.newPieceGen();
    }

    resetBoard() {
        return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    }

    draw() {
        this.shadow.draw();
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
        this.hasSwapped = false;
    }
    rotate(piece) {
        let p = JSON.parse(JSON.stringify(piece));
        for (let y = 0; y < p.shape.length; ++y) {
            for (let x = 0; x < y; ++x) {
                [p.shape[x][y], p.shape[y][x]] = [p.shape[y][x], p.shape[x][y]];
            }
        }

        // Reverse the order of the columns.
        p.shape.forEach((row) => row.reverse());

        return p;
    }

    swapPiece() {
        if (!this.hasSwapped) {
            if (this.saved) {
                let ID = this.piece.typeId;
                this.piece = new Piece(this.ctx, this.saved.typeId);
                this.piece.setStartingPosition();
                this.saved = new Piece(this.ctxSaved, ID);
                this.saved.setNextStartingPosition();
            } else {
                this.saved = new Piece(this.ctxSaved, this.piece.typeId);
                this.saved.setNextStartingPosition();
                this.newPieceGen();
            }
            this.hasSwapped = true;
            this.ctxSaved.clearRect(0, 0, this.ctxSaved.canvas.width, this.ctxSaved.canvas.height);
            this.saved.draw();
        }
    }

    checkLineClear() {
        let lines = 0;

        this.grid.forEach((row, y) => {
            if (row.every((value) => value > 0)) {
                lines++;

                // remove 1 line
                this.grid.splice(y, 1);

                // add empty line at top
                this.grid.unshift(Array(COLS).fill(0));
            }
        });

        if (lines > 0) {
            switch (lines) {
                case 1:
                    user.score += 100;
                    break;
                case 2:
                    user.score += 300;
                    break;
                case 3:
                    user.score += 500;
                    break;
                case 4:
                    user.score += 800;
                    break;

                default:
                    break;
            }
            user.lines += lines;
            if (user.lines >= LEVEL_THRESHOLD) {
                user.level++;
                user.lines -= LEVEL_THRESHOLD;
                interval = levels[user.level <= levels.length ? user.level : levels.length - 1];
            }
            scoreText.innerHTML = `SCORE: ${user.score}`;
            levelText.innerHTML = `LEVEL: ${user.level}`;
        }
    }

    updateShadow() {
        // When to update shadow:
        // New piece generated (main board)
        // move left/right
        // piece swapped
        // piece rotated
        this.shadow = new Piece(this.ctx, this.piece.typeId, true);
        this.shadow.move({ ...this.piece });
        let pos = moves["ArrowDown"](this.shadow);

        while (this.valid(pos)) {
            this.shadow.move(pos);
            pos = moves["ArrowDown"](this.shadow);
        }
    }

    newPieceGen() {
        this.piece = new Piece(this.ctx, this.next ? this.next.typeId : 25);
        this.piece.setStartingPosition();
        this.updateShadow();
        this.next = new Piece(this.ctxNext, 25);
        this.next.setNextStartingPosition();
        this.ctxNext.clearRect(0, 0, this.ctxNext.canvas.width, this.ctxNext.canvas.height);
        this.next.draw();
    }
}
