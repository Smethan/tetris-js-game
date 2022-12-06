const canvas = document.querySelector("#board");
const ctx = canvas.getContext("2d");

ctx.canvas.width = COLS * SIZE;
ctx.canvas.height = ROWS * SIZE;

ctx.scale(SIZE, SIZE);

let requestId;

const moves = {
    ArrowLeft: (pos) => ({ ...pos, x: pos.x - 1 }),
    ArrowRight: (pos) => ({ ...pos, x: pos.x + 1 }),
    ArrowDown: (pos) => ({ ...pos, y: pos.y + 1 }),
    Spacebar: (pos) => ({ ...pos, y: pos.y + 1 }),
};

let board = new Board(ctx);

document.addEventListener("keydown", (event) => {
    if (moves[event.key]) {
        event.preventDefault();

        let pos = moves[event.key](board.piece);
        if (event.key === "Spacebar") {
            while (board.valid(pos)) {
                board.piece.move(pos);
                pos = moves["ArrowDown"](board.piece);
            }
        } else if (board.valid(pos)) {
            board.piece.move(pos);
        }
    }
});

const play = () => {
    board.reset();
    if (requestId) {
        cancelAnimationFrame(requestId);
    }

    animate();
    // console.table(board.grid);
};

const animate = (now = 0) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    board.draw();
    requestId = requestAnimationFrame(animate);
};
