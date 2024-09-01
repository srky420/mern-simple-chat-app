"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function leaveRoom(socketId, userList) {
    return userList.filter((user) => user.id !== socketId);
}
exports.default = leaveRoom;
