class Board {
    reset() {
        this.grid = this.resetBoard();
    }

    resetBoard() {
        return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    }
}
