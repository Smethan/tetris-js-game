const canvas = document.querySelector("#board");
const ctx = canvas.getContext("2d");

ctx.canvas.width = COLS * SIZE;
ctx.canvas.height = ROWS * SIZE;

ctx.scale(SIZE, SIZE);

let board = new Board();

const play = () => {
    board.reset();
    console.table(board.grid);
};
