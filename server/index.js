const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

// Apply cors middleware
app.use(cors());

// Create HTTP server
const server = http.createServer(app);

// Create socket.io server
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  },
});

// Chat variables
const CHAT_BOT = 'ChatBot';
let chatRoom = '';
let userList = [];

// When socket connection establishes
io.on('connection', (socket) => {
  console.log('User connected ' + socket.id);

  // Socket event listeners
  // Our custom event 'join_room' called when
  // user joins a room, with payload data
  socket.on('join_room', (data) => {
    const { username, room } = data;
    socket.join(room); // Join the user to room

    let __createdtime__ = Date.now();
    // Emit a message to all users for this room
    socket.to(room).emit('receive_message', {
      message: `${username} joined the room!`,
      username: CHAT_BOT,
      __createdtime__,
    });

    // Save new user to the room and
    // emit an event for all users in that room
    // so they can get new list of users
    chatRoom = room;
    userList.push({ id: socket.id, username, room });
    let roomUsersList = userList.filter(user => user.room === room);
    socket.to(room).emit('chatroom_users', roomUsersList);
    socket.emit('chatroom_users', roomUsersList);
    console.log(userList);
  });
});

// Index route
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Listen to PORT 3000
const PORT = process.env.PORT;
server.listen(PORT || 3000, () => console.log('Server is running on port ' + PORT || 3000))

