const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const {userJoin, getCurrentUser, userLeave, getRoomUsers, countUsers, addUserGrid, countReady, flipUserReady} = require('./utils/users')
const {PLAYER_ROWS, PLAYER_COLS, ROWS, COLS, colors, MAX_GEN} = require('./public/js/constants.js');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

///////////////////////////////////////////////////////////
//Játékosok mátrixainak összegyúrása a paraméter szobában//
///////////////////////////////////////////////////////////
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
function createFullGrid(room){
  let grid = createFullEmptyGrid();
  let players = getRoomUsers(room);
  if(players[0]){
    for(let i = 0; i < PLAYER_COLS; i++){
      for(let j = 0; j < PLAYER_ROWS; j++){
        if(players[0].grid[i][j])
          grid[i][j] = 1;
        else
          grid[i][j] = 0;
      }
    }
  }
  if(players[1]){
    for(let i = 0; i < PLAYER_COLS; i++){
      for(let j = 0; j < PLAYER_ROWS; j++){
        if(players[1].grid[i][j])
          grid[i][j + PLAYER_COLS] = 2;
        else
          grid[i][j + PLAYER_COLS] = 0;
      }
    }
  }
  if(players[2]){
    for(let i = 0; i < PLAYER_COLS; i++){
      for(let j = 0; j < PLAYER_ROWS; j++){
        if(players[2].grid[i][j])
          grid[i + PLAYER_ROWS][j] = 3;
        else
          grid[i + PLAYER_ROWS][j] = 0;
      }
    }
  }
  if(players[3]){
    for(let i = 0; i < PLAYER_COLS; i++){
      for(let j = 0; j < PLAYER_ROWS; j++){
        if(players[3].grid[i][j])
          grid[i + PLAYER_ROWS][j + PLAYER_COLS] = 4;
        else
          grid[i + PLAYER_ROWS][j + PLAYER_COLS] = 0;
      }
    }
  }
  return grid;
}
//////////////////
//Játék logikája//
//////////////////
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
//////////////////////
//Socket.io kezelése//
//////////////////////
io.on('connection', socket =>{
  //Amikor csatlakozik a szobába
   socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
        // Send users and room info
        io.to(user.id).emit('roomUsers', {
            color: colors[countUsers(user.room) - 1],
            users: getRoomUsers(user.room)
        })
    })
  //Amikor rákattint a 'Ready' gombra
  socket.on('readyPlayer', (playerGrid) => {
    const user = getCurrentUser(socket.id);
    if (user) {
      addUserGrid(user.id, playerGrid);
      flipUserReady(user.id);
      console.log('# of ready players: ' + countReady(user.room));
      if(countUsers(user.room) >= 2 && countReady(user.room) == countUsers(user.room)){
        io.sockets.adapter.rooms.get(user.room).fullGrid = createFullGrid(user.room);
        let grid = io.sockets.adapter.rooms.get(user.room).fullGrid;
        //io.to(user.room).emit('startGame', fullGrid);
        io.sockets.adapter.rooms.get(user.room).currentGen = 0;
        io.sockets.adapter.rooms.get(user.room).interval = setInterval(() => {
          grid = calculateNextGen(grid);
          io.sockets.adapter.rooms.get(user.room).currentGen++;
          io.to(user.room).emit('update', grid);
          if(io.sockets.adapter.rooms.get(user.room).currentGen > MAX_GEN){
            clearInterval(io.sockets.adapter.rooms.get(user.room).interval);
          }
        }, 50);
      }
    }
    
  });
  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id)
    if (user) {
      io.to(user.room).emit('message', formatMessage(user.username, msg))
    }
  })
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    /*if (user) {
      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      })
    }*/
  });
});


const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));