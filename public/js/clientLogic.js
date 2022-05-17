
canvas = document.getElementById("canvas");
canvas.setAttribute("width", CANVAS_WIDTH);
canvas.setAttribute("height", CANVAS_HEIGHT);
ctx = canvas.getContext("2d");
var activePlayers = 0;
var playersTable = document.getElementById("players");
var currGenSpan = document.getElementById("curr_gen");
document.getElementById("max_gen").innerHTML = MAX_GEN;
var readyBtn = document.getElementById("readyBtn");
var resetBtn = document.getElementById("resetBtn");
var colors = [];
var playerColor = "#000000";
var myGrid = createPlayerGrid();
var playerClassList = ["p-3 mb-2 bg-danger text-white", "p-3 mb-2 bg-primary text-white", "p-3 mb-2 bg-success text-white", "p-3 mb-2 bg-warning text-dark"];

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

function newGame(){
  resetBtn.removeEventListener('click', newGame);
  resetBtn.hidden = true;
  readyBtn.hidden = false;
  readyBtn.addEventListener('click', sendGrid);
  canvas.addEventListener('click', handleClick);
  drawPlayer(myGrid);
}

//Tesztelés
const socket = io();

//randomizeGrid(myGrid);
drawPlayer(myGrid);
socket.emit('joinRoom', {username, room});
canvas.addEventListener('click', handleClick);
readyBtn.addEventListener('click', sendGrid);


socket.on('startGame', (fullGrid, playerColors) => {
  //players = playerList;
  //let grid = createFullGrid();
  readyBtn.hidden = true;
  colors = playerColors;
  drawFull(fullGrid);
  //startAnimating(grid);
});
socket.on('roomUsers', (users) => {
  playersTable.innerHTML = "";
  users = users.users;
  for (let i = 0; i < users.length; i++) {
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    const myArray = playerClassList[i].split(" ");
    for(valami of myArray) {
      td.classList.add(valami);
    }
    td.innerHTML = users[i].username;
    let span = document.createElement("span");
    span.setAttribute("id", users[i].username);
    span.innerHTML = "0";
    td.appendChild(span);
    tr.appendChild(td);
    playersTable.appendChild(tr);
    
    /*
<tr>
                  <td id="red" class="p-3 mb-2 bg-danger text-white">Mark</td> 
                  <td \>
                  <td id="blue" class="p-3 mb-2 bg-primary text-white">Otto</td>
                </tr>
                <tr>
                  <td id="green" class="p-3 mb-2 bg-success text-white">Jacob</td>
                  <td \>
                  <td id="yellow" class="p-3 mb-2 bg-warning text-dark">Thornton</td>
                </tr>
    */
  }
});
socket.on('color',({ color }) => {
    playerColor = color;
});

socket.on('full',( room ) => {
  alert('A(z) ' + room + ' szoba tele van!');
  location.href = 'index.html';

});

socket.on('gameOver',( winners ) => {
  resetBtn.hidden = false;
  resetBtn.addEventListener('click', newGame);
  if(winners.length == 1){
    alert('The winner is ' + winners[0] + '!');
  }
  else if(winners.length <= 4){
    str = 'Tie between the following players: ';
    for(let i = 0; i < winners.length; i++){
      str+=winners[i] + ' ';
    }
    alert(str);
  }
  else{
    alert('Ennek nem kéne megtörténnie, nem tudom hogy jutottunk ebbe az ágba lol');
  }

});


socket.on('update', (fullGrid, users, curr_gen, points) => {
  drawFull(fullGrid);
  //users = users.users;
  currGenSpan.innerHTML = curr_gen;
  for(let i = 0; i < users.length; i++){
    span = document.getElementById(users[i].username);
    span.innerHTML = points[i];
  }
  /*for (const user of users) {
    span = document.getElementById(user.username);
    span.innerHTML = user.score;
  }*/
});