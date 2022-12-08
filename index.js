const canvas = document.querySelector("#board");
const ctx = canvas.getContext("2d");
const canvasNextPiece = document.querySelector("#nextCanvas");
const ctxNext = canvasNextPiece.getContext("2d");

let requestId;
let time;
let interval;

const moves = {
    ArrowLeft: (piece) => ({ ...piece, x: piece.x - 1 }),
    ArrowRight: (piece) => ({ ...piece, x: piece.x + 1 }),
    ArrowDown: (piece) => ({ ...piece, y: piece.y + 1 }),
    ArrowUp: (piece) => board.rotate(piece),
};

const initNextBoard = () => {
    ctxNext.canvas.height = 4 * SIZE;
    ctxNext.canvas.width = 5 * SIZE;
    ctxNext.scale(SIZE, SIZE);
};

let board = new Board(ctx, ctxNext);
initNextBoard();

document.addEventListener("keydown", (event) => {
    if (moves[event.key]) {
        event.preventDefault();

        let pos = moves[event.key](board.piece);
        if (board.valid(pos)) {
            board.piece.move(pos);
        }
    }
});

const play = () => {
    board.reset();
    time = { start: 0, elapsed: 0 };
    time.start = performance.now();
    interval = 800;
    if (requestId) {
        cancelAnimationFrame(requestId);
    }

    animate();
};

const animate = (now = 0) => {
    time.elapsed = now - time.start;
    if (time.elapsed > interval) {
        time.start = now;
        if (!board.downTick()) {
            return;
        }
    }

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    board.draw();

    requestId = requestAnimationFrame(animate);
};
