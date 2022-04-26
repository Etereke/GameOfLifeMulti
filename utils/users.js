const users = []

// Join user to chat
function userJoin(id, username, room, color){
    let grid = new Array(15);
    for(let i = 0; i < grid.length; i++){
      grid[i] = new Array(15);
    for(let j = 0; j < grid[i].length; j++){
      grid[i][j] = 0;
    }
  }
  let ready = false;
  let score = 0;
  const user = {id, username, room, grid, ready, score, color}

  users.push(user);
  return user;
}

// Get the current user
function getCurrentUser(id){
    return users.find(user => user.id === id)
}

function flipUserReady(id){
  getCurrentUser(id).ready = !getCurrentUser(id).ready;
}

// User leaves chat
function userLeave(id){
    const index = users.findIndex(user => user.id === id);
    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}

// Get room users
function getRoomUsers(room){
    return users.filter(user => user.room === room);
}

function getRoomColors(room){
    let users = getRoomUsers(room);//users.filter(user => user.room === room && user.ready === true);
  let colors = [];
  for(const user in users){
    //console.log(readyUsers[user]);
    colors.push(users[user].color);
  }
  return colors;
}

// Get room users size
function countUsers(room){
  return getRoomUsers(room).length;
}

function countReady(room){
  let numOfReady = 0;
  let users = getRoomUsers(room);
  for (const user of users) {
    if(user.ready === true){
      numOfReady++;
    }
  }
  return numOfReady;
}

function addUserGrid(id, playerGrid){
  const index = users.findIndex(user => user.id === id);
  users[index].grid = playerGrid;
}

function resetReadyUsers(room){
  let roomUsers = getRoomUsers(room);
  for(let i = 0; i < roomUsers.length; i++){
    roomUsers[i].ready = false;
  }
}

function resetScores(room){
  let roomUsers = getRoomUsers(room);
  for(let i = 0; i < roomUsers.length; i++){
    roomUsers[i].score = 0;
  }
}


module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
    countUsers,
    countReady,
    addUserGrid,
    flipUserReady, 
    getRoomColors,
    resetReadyUsers,
    resetScores
}