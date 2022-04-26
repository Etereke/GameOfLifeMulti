const PLAYER_ROWS = 15;
const PLAYER_COLS = 15;
const CELL_SIZE = 25
const ROWS = PLAYER_ROWS * 2;
const COLS = PLAYER_COLS * 2;
const PLAYER_CELL_SIZE = 2 * CELL_SIZE;
const CANVAS_WIDTH = COLS * CELL_SIZE;
const CANVAS_HEIGHT = ROWS * CELL_SIZE;
const possibleColors = ["#FF0000", "#0022ff", "#0cf214", "#ffcd03"];
const MAX_GEN = 3000;

module.exports = {
  PLAYER_ROWS,
  PLAYER_COLS,
  ROWS,
  COLS,
  possibleColors,
  MAX_GEN
}