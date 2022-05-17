const PLAYER_ROWS = 15;
const PLAYER_COLS = 15;
const CELL_SIZE = 25
const ROWS = PLAYER_ROWS * 2;
const COLS = PLAYER_COLS * 2;
const PLAYER_CELL_SIZE = 2 * CELL_SIZE;
const CANVAS_WIDTH = COLS * CELL_SIZE;
const CANVAS_HEIGHT = ROWS * CELL_SIZE;
const possibleColors = ["#dc3545", "#0d6efd", "#198754", "#ffc107"];
const MAX_GEN = 1000;

module.exports = {
  PLAYER_ROWS,
  PLAYER_COLS,
  ROWS,
  COLS,
  possibleColors,
  MAX_GEN
}