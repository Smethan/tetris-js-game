const canvas = document.querySelector("#board");
const ctx = canvas.getContext("2d");
const canvasNextPiece = document.querySelector("#nextCanvas");
const ctxNext = canvasNextPiece.getContext("2d");
const canvasSavedPiece = document.querySelector("#savedCanvas");
const ctxSaved = canvasSavedPiece.getContext("2d");
const pauseButton = document.querySelector(".pause-button");
const scoreText = document.querySelector("h1");
const levelText = document.querySelector("p");

let requestId;
let time;
let interval;

let user = {
    score: 0,
    level: 0,
    lines: 0,
};

const moves = {
    ArrowLeft: (piece) => ({ ...piece, x: piece.x - 1 }),
    ArrowRight: (piece) => ({ ...piece, x: piece.x + 1 }),
    ArrowDown: (piece) => ({ ...piece, y: piece.y + 1 }),
    " ": (piece) => ({ ...piece, y: piece.y + 1 }),
    ArrowUp: (piece) => board.rotate(piece),
    q: (piece) => ({ ...piece, y: piece.y + 1 }),
};

const initOtherBoards = () => {
    ctxNext.canvas.height = 4 * SIZE;
    ctxNext.canvas.width = 5 * SIZE;
    ctxNext.scale(SIZE, SIZE);
    ctxSaved.canvas.height = 4 * SIZE;
    ctxSaved.canvas.width = 5 * SIZE;
    ctxSaved.scale(SIZE, SIZE);
};

let board = new Board(ctx, ctxNext, ctxSaved);
initOtherBoards();

document.addEventListener("keydown", (event) => {
    console.log(event.key);
    if (moves[event.key]) {
        event.preventDefault();

        let pos = moves[event.key](board.piece);
        if (event.key === " ") {
            while (board.valid(pos)) {
                board.piece.move(pos);
                pos = moves["ArrowDown"](board.piece);
            }
        } else if (event.key === "q") {
            board.swapPiece();
        } else if (board.valid(pos)) {
            board.piece.move(pos);
        }
    }
});

const play = () => {
    board.reset();
    time = { start: 0, elapsed: 0 };
    time.start = performance.now();
    interval = levels[0];
    user.score = 0;
    user.lines = 0;
    user.level = 0;
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
            gameOver();
            return;
        }
    }

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    board.draw();

    requestId = requestAnimationFrame(animate);
};

const gameOver = () => {
    cancelAnimationFrame(requestId);
    ctx.fillStyle = "black";
    ctx.fillRect(1, 3, 8, 1.2);
    ctx.font = "1px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("GAME OVER", 1.8, 4);
};

const pause = () => {
    if (!requestId) {
        pauseButton.innerHTML = "PAUSE";
        pauseButton.style.backgroundColor = "orange";
        animate();
        return;
    }

    cancelAnimationFrame(requestId);
    requestId = null;
    pauseButton.innerHTML = "RESUME";
    pauseButton.style.backgroundColor = "green";

    ctx.fillStyle = "black";
    ctx.fillRect(1, 3, 8, 1.2);
    ctx.font = "1px Arial";
    ctx.fillStyle = "yellow";
    ctx.fillText("PAUSED", 3, 4);
};
