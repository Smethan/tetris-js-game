class Board {
    constructor(ctx) {
        this.ctx = ctx;
        this.ctxNext = ctxNext;
        this.ctxSaved = ctxSaved;
        this.init();
    }

    // inits board canvas
    init() {
        this.ctx.canvas.width = COLS * SIZE;
        this.ctx.canvas.height = ROWS * SIZE;

        this.ctx.scale(SIZE, SIZE);
    }

    // resets board state
    reset() {
        this.grid = this.resetBoard();

        this.hasSwapped = false;
        this.ctxSaved.clearRect(0, 0, this.ctxSaved.canvas.width, this.ctxSaved.canvas.height);
        this.newPieceGen();
    }

    // resets the background to 0
    resetBoard() {
        return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    }

    // main draw call for piece
    draw() {
        // draw shadow first so it appears under the main piece
        this.shadow.draw();
        this.piece.draw();
        this.drawBoard();
    }

    // draws the frozen pieces/background
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

    // checks if given piece position is valid
    valid(piece) {
        // this right here caused me 4 hours of pain
        return piece.shape.every((row, oy) => {
            return row.every((value, ox) => {
                let x = piece.x + ox;
                let y = piece.y + oy;
                return value === 0 || (this.insideWalls(x) && this.aboveFloor(y) && this.occupiedCheck(x, y));
            });
        });
    }

    // Collision checks

    insideWalls(x) {
        return x >= 0 && x < COLS;
    }

    aboveFloor(y) {
        return y <= ROWS;
    }

    occupiedCheck(x, y) {
        return this.grid[y] && this.grid[y][x] === 0;
    }

    // main loop

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

    // freeze piece into background (grid) for collision
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

    // rotate piece via array transposition
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

    // swap saved and currently controlled piece
    swapPiece() {
        // check if you have recently swapped piece, to prevent infinite stalling
        if (!this.hasSwapped) {
            // check if there is already something in the saved board
            if (this.saved) {
                // if so, swap the pieces by creating new pieces with each others id
                let ID = this.piece.typeId;
                this.piece = new Piece(this.ctx, this.saved.typeId);
                this.piece.setStartingPosition();
                this.saved = new Piece(this.ctxSaved, ID);
                this.saved.setNextStartingPosition();
            } else {
                // otherwise, move current piece to saved board and create new piece
                this.saved = new Piece(this.ctxSaved, this.piece.typeId);
                this.saved.setNextStartingPosition();
                this.newPieceGen();
            }
            // set swapped flag
            this.hasSwapped = true;
            // redraw saved board and piece, since it has been changed
            this.ctxSaved.clearRect(0, 0, this.ctxSaved.canvas.width, this.ctxSaved.canvas.height);
            this.saved.draw();
        }
    }

    // check if lines should be cleared and add to score
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
            // if lines, give user points
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
            // increments user lines
            user.lines += lines;
            if (user.lines >= LEVEL_THRESHOLD) {
                // increase difficulty
                user.level++;
                user.lines -= LEVEL_THRESHOLD;
                // this is really complicated, mostly to catch edge cases
                // basically allows infinite play by forcing levels to the max if you are too high level
                interval = levels[user.level <= levels.length ? user.level : levels.length - 1];
            }

            // update html
            scoreText.innerHTML = `SCORE: ${user.score}`;
            levelText.innerHTML = `LEVEL: ${user.level}`;
        }
    }

    // Update shadow piece to bottom of board
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

    // create new pieces
    newPieceGen() {
        // first, create new piece of the type in the next box
        this.piece = new Piece(this.ctx, this.next ? this.next.typeId : 25);
        this.piece.setStartingPosition();
        // update shadow so that it changes to the new piece
        this.updateShadow();
        // create new next piece
        // 25 is the code for random piece, completely arbitrary
        this.next = new Piece(this.ctxNext, 25);
        this.next.setNextStartingPosition();
        // clear next canvas to prepare for next piece, draw next piece
        this.ctxNext.clearRect(0, 0, this.ctxNext.canvas.width, this.ctxNext.canvas.height);
        this.next.draw();
    }
}
