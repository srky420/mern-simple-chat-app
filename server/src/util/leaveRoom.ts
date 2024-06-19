function leaveRoom(socketId: any, userList: any) {
  return userList.filter((user: any) => user.id !== socketId);
}

export default leaveRoom;
