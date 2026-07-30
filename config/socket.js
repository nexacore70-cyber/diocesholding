let io;

const initializeSocket = (socketIo) => {
  io = socketIo;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io has not been initialized.");
  }

  return io;
};

module.exports = {
  initializeSocket,
  getIO,
};