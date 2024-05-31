function leaveRoom(socketId, userList) {
  return userList.filter(user => user.id !== socketId);
}

module.exports = leaveRoom;