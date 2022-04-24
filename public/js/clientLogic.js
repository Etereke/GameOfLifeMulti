canvas = document.getElementById("canvas");
canvas.setAttribute("width", CANVAS_WIDTH);
canvas.setAttribute("height", CANVAS_HEIGHT);
var ctx = canvas.getContext("2d");
var playerColor = "#000000";

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})
////////////////////////////////////
//Játékosnak üres mátrix készítése//
////////////////////////////////////
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
////////////////////////
//Kirajzoló függvények//
////////////////////////
function drawPlayer(grid){
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  let y = 0;
  for (let row of grid) {
      let x = 0;
      for (let col of row) {
          ctx.beginPath();
          ctx.rect(x, y, PLAYER_CELL_SIZE, PLAYER_CELL_SIZE);
          if (col == 1) {
              ctx.fillStyle = playerColor;
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
///////////////////////////////////////////////////////////////
//Mátrix randomizálása - teszteléshez, esetleg később feature//
///////////////////////////////////////////////////////////////
function randomizeGrid(grid){
  for(let i = 0; i < PLAYER_COLS; i++){
      for(let j = 0; j < PLAYER_ROWS; j++){
        if(Math.random() < 0.5){
          grid[i][j] = 1;
        }
      }
  }
}

/////////////////////////////////////////////////////
//Játékos tudja kattintással feltölteni a  mátrixát//
/////////////////////////////////////////////////////
function handleClick(e) {
    coordX = Math.floor(e.offsetX/PLAYER_CELL_SIZE);
    coordY = Math.floor(e.offsetY/PLAYER_CELL_SIZE);
    
    if(myGrid[coordY][coordX] == 0)
      myGrid[coordY][coordX] = 1;
    else
      myGrid[coordY][coordX] = 0;
    drawPlayer(myGrid);
}
function sendGrid(){
  socket.emit('readyPlayer', myGrid);
  canvas.removeEventListener('click', handleClick);
  document.getElementById("readyBtn").removeEventListener('click', sendGrid);
}


//Tesztelés
const socket = io();
let myGrid = createPlayerGrid();
//randomizeGrid(myGrid);
drawPlayer(myGrid);
socket.emit('joinRoom', {username, room});
canvas.addEventListener('click', handleClick);
document.getElementById("readyBtn").addEventListener('click', sendGrid);


/*socket.on('startGame', (fullGrid) => {
  //players = playerList;
  //let grid = createFullGrid();
  drawFull(fullGrid);
  //startAnimating(grid);
});*/
socket.on('roomUsers',({ color, users }) => {
    playerColor = color;
    console.log(users);
});
socket.on('update', (fullGrid) => {
  drawFull(fullGrid);
});