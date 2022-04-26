const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const {userJoin, getCurrentUser, userLeave, getRoomUsers, countUsers, addUserGrid, countReady, flipUserReady, getRoomColors, resetReadyUsers, resetScores} = require('./utils/users')
const {PLAYER_ROWS, PLAYER_COLS, ROWS, COLS, possibleColors, MAX_GEN} = require('./public/js/constants.js');

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

function countPoints(grid){
  let points = [0, 0, 0, 0];
  for(let i = 0; i < COLS; i++){
    for(let j = 0; j < ROWS; j++){
      if(grid[i][j] > 0){
        points[grid[i][j]-1]++;
      }
    }
  }
  return points;
}


//////////////////////
//Socket.io kezelése//
//////////////////////
io.on('connection', socket =>{
  //Amikor csatlakozik a szobába
   socket.on('joinRoom', ({ username, room }) => {
        //const user = userJoin(socket.id, username, room, colors[countUsers(room)]);
      //let color = io.sockets.adapter.rooms.get(room).availableColors.shift();
    //const user = userJoin(socket.id, username, room, "#000000");
        
     //Megnézzük van-e már 4 játékos, ha nincs akkor csatlakozik
     if(countUsers(room) < 4)
     {
     let colors = getRoomColors(room);
     let color = "#000000";
     for(let i = 0; i < 4; i ++){
       if(colors.includes(possibleColors[i]) === false){
         color = possibleColors[i];
         break;
       }
     }
     //color = io.sockets.adapter.rooms.get(room).availableColors.shift();
     const user = userJoin(socket.id, username, room, color);
     socket.join(room);
     console.log(username + " joined room " + room);
     console.log(getRoomUsers(room));
        //io.sockets.adapter.rooms.get(user.room).availableColors = colors;
          
        // 
        io.to(user.id).emit('color', {
            color: user.color
        });
     
        io.to(user.room).emit('roomUsers', {
            users: getRoomUsers(user.room)
        });
     }
     else {
       console.log("tele");
       socket.emit("full", room);
     }
    });
  //Amikor rákattint a 'Ready' gombra
  socket.on('readyPlayer', (playerGrid) => {
    const user = getCurrentUser(socket.id);
    if (user) {
      addUserGrid(user.id, playerGrid);
      flipUserReady(user.id);
      //console.log('# of ready players: ' + countReady(user.room));
      if(countUsers(user.room) >= 2 && countReady(user.room) == countUsers(user.room)){
        io.sockets.adapter.rooms.get(user.room).fullGrid = createFullGrid(user.room);
        let grid = io.sockets.adapter.rooms.get(user.room).fullGrid;
        let colors = getRoomColors(user.room);
        io.to(user.room).emit('startGame', grid, colors);
        io.sockets.adapter.rooms.get(user.room).currentGen = 0;
        io.sockets.adapter.rooms.get(user.room).interval = setInterval(() => {
          grid = calculateNextGen(grid);
          io.sockets.adapter.rooms.get(user.room).currentGen++;
          let points = countPoints(grid);
          let users = getRoomUsers(user.room);
          for(let i = 0; i < users.length; i++){
            users[i].score = points[i];
          }
          let lostPlayers = 0;
          for(let i = 0; i < points.length; i++){
            if(points[i] == 0) lostPlayers++;
          }
          io.to(user.room).emit('update', grid, getRoomUsers(user.room), io.sockets.adapter.rooms.get(user.room).currentGen++, points);
          if(io.sockets.adapter.rooms.get(user.room).currentGen > MAX_GEN || lostPlayers > 2){
            let maxScore = Math.max(...points);
            let winners = [];
            for(let i = 0; i < users.length; i++){
              if(users[i].score == maxScore){
                winners.push(users[i].username);
              }
            }
            io.to(user.room).emit('gameOver', winners);
            resetReadyUsers(user.room);
            resetScores(user.room);
            clearInterval(io.sockets.adapter.rooms.get(user.room).interval);
          }
        }, 50);
      }
    }
  });

io.of("/").adapter.on("create-room", (room) => {
  //console.log(`room ${room} was created`);
  //io.sockets.adapter.rooms.get(room).availableColors = possibleColors;
});

/*io.of("/").adapter.on("leave-room", (room, id) => {
  //console.log(`socket ${id} has left room ${room}`);
  //const user = userLeave(socket.id);
  //if(user){
  //  console.log(getRoomUsers(room));
    //io.to(user.room).emit('roomUsers', {
    //  users: getRoomUsers(room)
    //});
  }
});*/
io.of("/").adapter.on("delete-room", (room) => {
  //console.log(`room ${room} was deleted`);
});

  
  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id)
    if (user) {
      io.to(user.room).emit('message', formatMessage(user.username, msg))
    }
  })
  
  socket.on('disconnect', () => {
    //room = user.room;
    const user = userLeave(socket.id);
    if(user){
      //console.log(user.room);
      //console.log(io.sockets.adapter.rooms.get(user.room).availableColors);
      
      io.to(user.room).emit('roomUsers', {
              users: getRoomUsers(user.room)
      });
    }
  });
});


const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));