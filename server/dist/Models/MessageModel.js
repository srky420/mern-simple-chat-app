"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define schema
const messageSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        maxlength: 50,
    },
    avatar: {
        type: String,
        required: false,
    },
    message: {
        type: String,
        required: true,
        maxlength: 1200,
    },
    room: {
        type: String,
        required: true,
        maxlength: 50,
    },
    __createdtime__: {
        type: Date,
        default: Date.now(),
    },
});
// Create model
const MessageModel = (0, mongoose_1.model)("Message", messageSchema);
exports.default = MessageModel;
