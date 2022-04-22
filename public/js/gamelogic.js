canvas = document.getElementById("canvas");
const PLAYER_ROWS = 15, PLAYER_COLS = 15;
const CELL_SIZE = 25

const ROWS = PLAYER_ROWS * 2;
const COLS = PLAYER_COLS * 2;
const PLAYER_CELL_SIZE = 2 * CELL_SIZE;
const CANVAS_WIDTH = COLS * CELL_SIZE;
const CANVAS_HEIGHT = ROWS * CELL_SIZE;

const colors = ["#FF0000", "#0022ff", "#0cf214", "#ffcd03"];
var players = [];

var fps, fpsInterval, startTime, now, then, elapsed;
const FPS = 60;

canvas.setAttribute("width", CANVAS_WIDTH);
canvas.setAttribute("height", CANVAS_HEIGHT);
var ctx = canvas.getContext("2d");




//Pálya inicializálása - játékosoknak, majd azokat egybegyúrni
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
function createFullEmptyGrid(){
  let grid = new Array(COLS);
  for(let i = 0; i < grid.length; i++){
    grid[i] = new Array(ROWS);
    for(let j = 0; j < grid[i].length; j++){
      grid[i][j] = 0;
    }
  }
  return grid;
}
function createFullGrid(){
  let grid = createFullEmptyGrid();
  if(players[0]){
    for(let i = 0; i < PLAYER_COLS; i++){
      for(let j = 0; j < PLAYER_ROWS; j++){
        if(players[0][i][j])
          grid[i][j] = 1;
        else
          grid[i][j] = 0;
      }
    }
  }
  if(players[1]){
    for(let i = 0; i < PLAYER_COLS; i++){
      for(let j = 0; j < PLAYER_ROWS; j++){
        if(players[1][i][j])
          grid[i][j + PLAYER_COLS] = 2;
        else
          grid[i][j + PLAYER_COLS] = 0;
      }
    }
  }
  if(players[2]){
    for(let i = 0; i < PLAYER_COLS; i++){
      for(let j = 0; j < PLAYER_ROWS; j++){
        if(players[2][i][j])
          grid[i + PLAYER_ROWS][j] = 3;
        else
          grid[i + PLAYER_ROWS][j] = 0;
      }
    }
  }
  if(players[3]){
    for(let i = 0; i < PLAYER_COLS; i++){
      for(let j = 0; j < PLAYER_ROWS; j++){
        if(players[3][i][j])
          grid[i + PLAYER_ROWS][j + PLAYER_COLS] = 4;
        else
          grid[i + PLAYER_ROWS][j + PLAYER_COLS] = 0;
      }
    }
  }
  return grid;
}

//Játék logika
function countNeighbors(grid, x, y) {
    let sum = 0;
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        let col = (x + i + COLS) % COLS;
        let row = (y + j + ROWS) % ROWS;
        if(grid[col][row] != 0){
          sum++;
        }
      }
    }
    if(grid[x][y] != 0)
      sum--;
    return sum;
}
function calculateBirthColor(grid, x, y){
  let num = [];
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        let col = (x + i + COLS) % COLS;
        let row = (y + j + ROWS) % ROWS;
        if(grid[col][row] != 0){
          num.push(grid[col][row]);
        }
      }
    }
    if(num[0] == num[1] || num[0] == num[2])
      return num[0];
    else if(num[1] == num[2])
      return num[1];
    else{
      return num[Math.floor(Math.random() * 3)];
    }
}
function calculateNextGen(grid){
  let newGrid = createFullEmptyGrid();
  for(let i = 0; i < COLS; i++){
    for(let j = 0; j < ROWS; j++){
      let neighbours = countNeighbors(grid, i, j);
      if(grid[i][j] != 0){
        if(neighbours < 2 || neighbours > 3){
          newGrid[i][j] = 0;
        }
        else newGrid[i][j] = grid[i][j];
      }
      else{
        if(neighbours == 3){
          newGrid[i][j] = calculateBirthColor(grid, i, j);
        }
      }
    }
  }
  return newGrid;
}



//Rajzolás - külön a játékos, külön a teljes
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

//Végső animáció
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

//Segéd tesztfüggvények
function randomizeGrid(grid){
  for(let i = 0; i < PLAYER_COLS; i++){
      for(let j = 0; j < PLAYER_ROWS; j++){
        if(Math.random() < 0.5){
          grid[i][j] = 1;
        }
      }
  }
}

//Tesztelés
console.log("teszt");
for(let i = 0; i < 4; i++){
  players.push(createPlayerGrid());
}
for(let i = 0; i < 4; i++){
  randomizeGrid(players[i]);
}
let grid = createFullGrid();
startAnimating(grid);

