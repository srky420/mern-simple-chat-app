import express, { Express, Request, Response } from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import leaveRoom from "./util/leaveRoom";
import mongoose from "mongoose";
import { configDotenv } from "dotenv"; 
import authRouter from "./Routes/AuthRoutes";
import MessageModel from "./Models/MessageModel";

configDotenv();
const app: Express = express();
const cookieParser = require('cookie-parser');

// Apply middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/', authRouter);

// Create HTTP server
const server: any = createServer(app);

// Create socket.io server
const io: Server = new Server(server, { 
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Chat variables
const CHAT_BOT: string = 'ChatBot';
let chatRoom: string = '';
let userList: any[] = [];

// When socket connection establishes
io.on('connection', (socket: any) => {
  console.log('User connected ' + socket.id);

  // Socket event listeners
  // Our custom event 'join_room' called when
  // user joins a room, with payload data
  socket.on('join_room', (data: any) => {
    const { username, room } = data;
    socket.join(room); // Join the user to room

    chatRoom = room;
    let __createdtime__ = Date.now();

    // Emit a message to all users for this room
    socket.to(room).emit('receive_message', {
      id: 'chat_bot',
      message: `${username} has joined the chat!`,
      username: CHAT_BOT,
      __createdtime__,
    });

    // Emit welcome message to joined user
    socket.emit('receive_message', {
      id: 'chat_bot',
      username: CHAT_BOT,
      message: `Welcome to the chat, ${username}!`,
      __createdtime__,
    });

    // Save new user to the room and
    // emit an event for all users in that room
    // so they can get new list of users
    userList.push({ id: socket.id, username, room });
    let roomUsersList = userList.filter(user => user.room === chatRoom);
    socket.to(chatRoom).emit('chatroom_users', roomUsersList);
    socket.emit('chatroom_users', roomUsersList);
    console.log(userList);

    // Load messages from DB
    MessageModel.find({ room })
      .sort('__createdtime__')
      .limit(100)
      .then(messages => {
        socket.emit('last_100_messages', JSON.stringify(messages));
      })
      .catch(err => console.error(err));
  });

  // Send message event
  socket.on('send_message', (data: any) => {
    const { username, message, room, __createdtime__ } = data;
    io.in(room).emit('receive_message', data);
    // Create new message in DB
    MessageModel.create({ username, message, room, __createdtime__ })
      .then(res => console.log(res))
      .catch(err => console.error(err));
  });

  // Leave room event
  socket.on('leave_room', (data: any) => {
    const { username, room } = data;
    // Leave room
    socket.leave(room);
    const __createdtime__ = Date.now();
    // Remove user from users list
    userList = leaveRoom(socket.id, userList);
    console.log(userList);

    // Let client know that user has left
    socket.to(room).emit('chatroom_users', userList);
    socket.to(room).emit('receive_message', {
      id: 'chat_bot',
      username: CHAT_BOT,
      message: `${username} has left the chat!`,
      __createdtime__
    });
  });

  // Disconnect event
  socket.on('disconnect', () => {
    console.log('User disconnected from chat');
    const user = userList.find(user => user.id == socket.id);

    // If user is in a chat room, update users list
    // and emit a message
    if (user) {
      userList = leaveRoom(socket.id, userList);
      console.log(userList)
      socket.to(chatRoom).emit('chatroom_users', userList);
      const __createdtime__ = Date.now();
      socket.to(chatRoom).emit('receive_message', {
        id: 'chat_bot',
        username: CHAT_BOT,
        message: `${user.username} has disconnected from the chat!`,
        __createdtime__,
      });
    }
  })
});

// Connect to MongoDB
const MONGO_URI: any = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connection established'))
  .catch(err => console.log(err));

// Listen to PORT 3000
const PORT = process.env.PORT;
server.listen(PORT || 3000, () => console.log('Server is running on port ' + PORT || 3000))

