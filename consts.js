"use static";

const COLS = 10;
const ROWS = 20;
const SIZE = 30;

const colors = ["none", "cyan", "blue", "orange", "yellow", "green", "purple", "red"];

const shapes = [
    [],
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    [
        [2, 0, 0],
        [2, 2, 2],
        [0, 0, 0],
    ],
    [
        [0, 0, 3],
        [3, 3, 3],
        [0, 0, 0],
    ],
    [
        [4, 4],
        [4, 4],
    ],
    [
        [0, 5, 5],
        [5, 5, 0],
        [0, 0, 0],
    ],
    [
        [0, 6, 0],
        [6, 6, 6],
        [0, 0, 0],
    ],
    [
        [7, 7, 0],
        [0, 7, 7],
        [0, 0, 0],
    ],
];

[colors, shapes].forEach((item) => Object.freeze(item));
