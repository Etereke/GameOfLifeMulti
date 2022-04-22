const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PLAYER_ROWS = 15, PLAYER_COLS = 15;
const ROWS = PLAYER_ROWS * 2;
const COLS = PLAYER_COLS * 2;

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));
var userNum = 0;
var players = [];
var fullGrid;
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


io.on('connection', socket =>{
  console.log("test");
  socket.on('joined', (playerGrid) => {
    userNum++;
    players.push(playerGrid);
    console.log('# of players: ' + userNum);
    if(userNum >= 4){
      fullGrid = createFullGrid();
      io.emit('startGame', fullGrid);
      setInterval(() => {
        fullGrid = calculateNextGen(fullGrid);
        io.emit('update', fullGrid);
      }, 50);
    }
  });
});


const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
//app.listen(PORT, () => console.log(`Server running on port ${PORT}`));