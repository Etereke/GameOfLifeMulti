canvas = document.getElementById("canvas");
const PLAYER_ROWS = 15, PLAYER_COLS = 15;
const CELL_SIZE = 25
const ROWS = PLAYER_ROWS * 2;
const COLS = PLAYER_COLS * 2;
const PLAYER_CELL_SIZE = 2 * CELL_SIZE;
const CANVAS_WIDTH = COLS * CELL_SIZE;
const CANVAS_HEIGHT = ROWS * CELL_SIZE;
const colors = ["#FF0000", "#0022ff", "#0cf214", "#ffcd03"];
canvas.setAttribute("width", CANVAS_WIDTH);
canvas.setAttribute("height", CANVAS_HEIGHT);
var ctx = canvas.getContext("2d");

function createPlayerGrid(){
  let grid = new Array(PLAYER_COLS);
  for(let i = 0; i < grid.length; i++){
    grid[i] = new Array(PLAYER_ROWS);
    for(let j = 0; j < grid[i].length; j++){
      grid[i][j] = 0;
    }
  }
  return grid;
}

function drawPlayer(grid){
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  let y = 0;
  for (let row of grid) {
      let x = 0;
      for (let col of row) {
          ctx.beginPath();
          ctx.rect(x, y, PLAYER_CELL_SIZE, PLAYER_CELL_SIZE);
          if (col == 1) {
              ctx.fillStyle = "#000000";
              ctx.fill();
          }
          ctx.stroke();
          x += PLAYER_CELL_SIZE;
      }
      y += PLAYER_CELL_SIZE;
  }
}
function drawFull(grid){
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  let y = 0;
  for (let row of grid) {
      let x = 0;
      for (let col of row) {
          ctx.beginPath();
          ctx.rect(x, y, CELL_SIZE, CELL_SIZE);
          if (col != 0) {
              ctx.fillStyle = colors[col - 1];
              ctx.fill();
          }
          ctx.stroke();
          x += CELL_SIZE;
      }
      y += CELL_SIZE;
  }
}
function randomizeGrid(grid){
  for(let i = 0; i < PLAYER_COLS; i++){
      for(let j = 0; j < PLAYER_ROWS; j++){
        if(Math.random() < 0.5){
          grid[i][j] = 1;
        }
      }
  }
}
function fullGrid(grid){
  for(let i = 0; i < PLAYER_COLS; i++){
      for(let j = 0; j < PLAYER_ROWS; j++){
          grid[i][j] = 1;
      }
  }
}
function animate (grid) {
    requestAnimationFrame(function(){
        animate(grid);
});
    // calc elapsed time since last loop
    now = Date.now();
    elapsed = now - then;
    // if enough time has elapsed, draw the next frame
    if (elapsed > fpsInterval) {
        // Get ready for next frame by setting then=now, but also adjust for your
        // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
        then = now - (elapsed % fpsInterval);
        // Put your drawing code here
        drawFull(grid);
  let next = calculateNextGen(grid);
  grid = next;
  }   
}

function startAnimating(grid) {
    fpsInterval = 5000 / FPS;
    then = Date.now();
    startTime = then;
    animate(grid);
}

/*module.exports = {
  PLAYER_ROWS,
  CELL_SIZE,
  ROWS,
  COLS,
  PLAYER_CELL_SIZE,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  colors
}*/


//Tesztelés
const socket = io();
let myGrid = createPlayerGrid();
randomizeGrid(myGrid);
//fullGrid(myGrid);
drawPlayer(myGrid);
socket.emit('joined', myGrid);
socket.on('startGame', (fullGrid) => {
  //players = playerList;
  //let grid = createFullGrid();
  drawFull(fullGrid);
  //startAnimating(grid);
});
socket.on('update', (fullGrid) => {
  drawFull(fullGrid);
})