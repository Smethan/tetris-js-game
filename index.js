const canvas = document.querySelector("#board");
const ctx = canvas.getContext("2d");
const canvasNextPiece = document.querySelector("#nextCanvas");
const ctxNext = canvasNextPiece.getContext("2d");
const canvasSavedPiece = document.querySelector("#savedCanvas");
const ctxSaved = canvasSavedPiece.getContext("2d");
const pauseButton = document.querySelector(".pause-button");
const playButton = document.querySelector(".play-button");
const scoreText = document.querySelector("h1");
const levelText = document.querySelector("p");

let requestId;
let time;
let interval;

// user object, holds score and level
// lines is used to check if we should make game harder
// refer to checkLineClear
let user = {
    score: 0,
    level: 0,
    lines: 0,
};

// moves array
// contains keys and an anonymous function that makes changes to the
// piece objects coordinates
const moves = {
    ArrowLeft: (piece) => ({ ...piece, x: piece.x - 1 }),
    ArrowRight: (piece) => ({ ...piece, x: piece.x + 1 }),
    ArrowDown: (piece) => ({ ...piece, y: piece.y + 1 }),
    " ": (piece) => ({ ...piece, y: piece.y + 1 }),
    ArrowUp: (piece) => board.rotate(piece),
    q: (piece) => ({ ...piece, y: piece.y + 1 }),
};

// initializes the "next" board and "saved" board
const initOtherBoards = () => {
    ctxNext.canvas.height = 4 * SIZE;
    ctxNext.canvas.width = 5 * SIZE;
    ctxNext.scale(SIZE, SIZE);
    ctxSaved.canvas.height = 4 * SIZE;
    ctxSaved.canvas.width = 5 * SIZE;
    ctxSaved.scale(SIZE, SIZE);
};

// create main board and initialize other boards
let board = new Board(ctx, ctxNext, ctxSaved);
initOtherBoards();

// input event listener
document.addEventListener("keydown", (event) => {
    if (moves[event.key]) {
        event.preventDefault();

        let pos = moves[event.key](board.piece);
        // first make sure to check for hard drop key
        if (event.key === " ") {
            // keep moving down until we reach an invalid position
            while (board.valid(pos)) {
                board.piece.move(pos);
                pos = moves["ArrowDown"](board.piece);
            }
        } else if (event.key === "q") {
            board.swapPiece();
            board.updateShadow();
        } else if (board.valid(pos)) {
            board.piece.move(pos);
            board.updateShadow();
        }
    }
});

// start game function
const play = () => {
    // resets board, time, and user properties
    board.reset();
    time = { start: 0, elapsed: 0 };
    time.start = performance.now();
    interval = levels[0];
    user.score = 0;
    user.lines = 0;
    user.level = 0;
    // set button style in case of a start from game over
    playButton.innerHTML = "PLAY";
    playButton.style.backgroundColor = "green";
    if (requestId) {
        // cancel any queued animation frames
        cancelAnimationFrame(requestId);
    }

    // run main game loop
    animate();
};

// main game loop
const animate = (now = 0) => {
    // this is a timer for doing a forced down move and collision check
    time.elapsed = now - time.start;
    if (time.elapsed > interval) {
        time.start = now;
        // cause game over if board.downTick returns false, which happens if
        // you have a piece at y == 0
        if (!board.downTick()) {
            gameOver();
            return;
        }
    }

    // clear and re draw board
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    board.draw();

    // request animation frame recursively
    requestId = requestAnimationFrame(animate);
};

// end game state
const gameOver = () => {
    cancelAnimationFrame(requestId);
    ctx.fillStyle = "black";
    ctx.fillRect(1, 3, 8, 1.2);
    ctx.font = "1px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("GAME OVER", 1.8, 4);
    playButton.innerHTML = "RESTART";
    playButton.style.backgroundColor = "red";
};

// pause and unpause
const pause = () => {
    // if paused
    if (!requestId) {
        // change button back to pause colors
        pauseButton.innerHTML = "PAUSE";
        pauseButton.style.backgroundColor = "orange";
        // unpause game
        animate();
        // stop function execution
        return;
    }

    // else, stop animation frame
    cancelAnimationFrame(requestId);
    // set requestId to null to indicate pause and not gameOver
    requestId = null;
    // change button
    pauseButton.innerHTML = "RESUME";
    pauseButton.style.backgroundColor = "green";

    // draw some stuff on board to indicate pause

    ctx.fillStyle = "black";
    ctx.fillRect(1, 3, 8, 1.2);
    ctx.font = "1px Arial";
    ctx.fillStyle = "yellow";
    ctx.fillText("PAUSED", 3, 4);
};
