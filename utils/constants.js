const PLAYER_ROWS = 15, PLAYER_COLS = 15;
const CELL_SIZE = 25
const ROWS = PLAYER_ROWS * 2;
const COLS = PLAYER_COLS * 2;
const PLAYER_CELL_SIZE = 2 * CELL_SIZE;
const CANVAS_WIDTH = COLS * CELL_SIZE;
const CANVAS_HEIGHT = ROWS * CELL_SIZE;
const colors = ["#FF0000", "#0022ff", "#0cf214", "#ffcd03"];
const FPS = 60;

module.exports = {
  PLAYER_ROWS,
  CELL_SIZE,
  ROWS,
  COLS,
  PLAYER_CELL_SIZE,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  colors,
  FPS
}