"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const leaveRoom_1 = __importDefault(require("./util/leaveRoom"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = require("dotenv");
const AuthRoutes_1 = __importDefault(require("./Routes/AuthRoutes"));
const MessageModel_1 = __importDefault(require("./Models/MessageModel"));
(0, dotenv_1.configDotenv)();
const app = (0, express_1.default)();
const cookieParser = require("cookie-parser");
const corsOptions = {
    origin: ["https://mern-simple-chat-app.vercel.app", "http://localhost:5173"],
    optionsSuccessStatus: 200, // For legacy browser support
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true,
};
// Apply middleware
app.use((0, cors_1.default)(corsOptions));
app.options('*', (0, cors_1.default)(corsOptions));
app.use(express_1.default.static("public"));
app.use(express_1.default.json());
app.use(cookieParser());
app.use("/", AuthRoutes_1.default);
// Create HTTP server
const server = (0, http_1.createServer)(app);
// Create socket.io server
const io = new socket_io_1.Server(server, {
    cors: {
        origin: ["https://mern-simple-chat-app.vercel.app", "http://localhost:5173"],
        methods: ["GET", "PUT", "POST", "DELETE"],
        credentials: true
    },
});
// Chat variables
const CHAT_BOT = "ChatBot";
let chatRoom = "";
let userList = [];
// When socket connection establishes
io.on("connection", (socket) => {
    console.log("User connected " + socket.id);
    // Socket event listeners
    // Our custom event 'join_room' called when
    // user joins a room, with payload data
    socket.on("join_room", (data) => {
        const { user, room } = data;
        socket.join(room); // Join the user to room
        chatRoom = room;
        let __createdtime__ = Date.now();
        // Emit a message to all users for this room
        socket.to(room).emit("receive_message", {
            id: "chat_bot",
            message: `${user.username} has joined the chat!`,
            username: CHAT_BOT,
            avatar: "",
            __createdtime__,
        });
        // Emit welcome message to joined user
        socket.emit("receive_message", {
            id: "chat_bot",
            username: CHAT_BOT,
            message: `Welcome to the chat, ${user.username}!`,
            avatar: "",
            __createdtime__,
        });
        // Save new user to the room and
        // emit an event for all users in that room
        // so they can get new list of users
        userList.push(Object.assign(Object.assign({ id: socket.id }, user), { room }));
        let roomUsersList = userList.filter((user) => user.room === chatRoom);
        socket.to(chatRoom).emit("chatroom_users", roomUsersList);
        socket.emit("chatroom_users", roomUsersList);
        console.log(userList);
        // Load messages from DB
        MessageModel_1.default.find({ room })
            .sort("__createdtime__")
            .limit(100)
            .then((messages) => {
            socket.emit("last_100_messages", JSON.stringify(messages));
        })
            .catch((err) => console.error(err));
    });
    // Send message event
    socket.on("send_message", (data) => {
        const { username, message, room, avatar, __createdtime__ } = data;
        io.in(room).emit("receive_message", data);
        // Create new message in DB
        MessageModel_1.default.create({ username, message, room, avatar, __createdtime__ })
            .then((res) => console.log(res))
            .catch((err) => console.error(err));
    });
    // Leave room event
    socket.on("leave_room", (data) => {
        const { user, room } = data;
        // Leave room
        socket.leave(room);
        const __createdtime__ = Date.now();
        // Remove user from users list
        userList = (0, leaveRoom_1.default)(socket.id, userList);
        console.log(userList);
        // Let client know that user has left
        socket.to(room).emit("chatroom_users", userList);
        socket.to(room).emit("receive_message", {
            id: "chat_bot",
            username: CHAT_BOT,
            message: `${user.username} has left the chat!`,
            __createdtime__,
        });
    });
    // Disconnect event
    socket.on("disconnect", () => {
        console.log("User disconnected from chat");
        const user = userList.find((user) => user.id == socket.id);
        // If user is in a chat room, update users list
        // and emit a message
        if (user) {
            userList = (0, leaveRoom_1.default)(socket.id, userList);
            console.log(userList);
            socket.to(chatRoom).emit("chatroom_users", userList);
            const __createdtime__ = Date.now();
            socket.to(chatRoom).emit("receive_message", {
                id: "chat_bot",
                username: CHAT_BOT,
                message: `${user.username} has disconnected from the chat!`,
                __createdtime__,
            });
        }
    });
});
// Home route check
app.get('/', (req, res) => {
    res.send("Hello World");
});
// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI;
mongoose_1.default
    .connect(MONGO_URI)
    .then(() => console.log("MongoDB connection established"))
    .catch((err) => console.log(err));
// Listen to PORT 3000
const PORT = process.env.PORT;
server.listen(PORT || 3000, () => console.log("Server is running on port " + PORT || 3000));
module.exports = app;
