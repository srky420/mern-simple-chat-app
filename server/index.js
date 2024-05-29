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
    origin: 'http://localhost:5173/',
    methods: ['GET', 'POST']
  },
});

// When socket connection establishes
io.on('connection', (socket) => {
  console.log('User connected ' + socket.id);

  // Socket event listeners

});

// Index route
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Listen to PORT 3000
const PORT = process.env.PORT;
server.listen(PORT || 3000, () => console.log('Server is running on port ' + PORT || 3000))

