const { Server } = require("socket.io");
const { authSocketMiddleware } = require("./middleware");
const connectionHandler = require("./handlers/connection");
const roomHandler = require("./handlers/room");
const notesHandler = require("./handlers/notes");
const roomChatHandler = require("./handlers/roomChat");

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // Adjust for production
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  console.log("Socket server is running...");
  // Apply authentication middleware
  io.use(authSocketMiddleware);

  // Handle connections
  io.on("connection", (socket) => {
    connectionHandler(socket, io);
    roomHandler(socket, io);
    roomChatHandler(socket, io);
    const role = socket.user?.role;
    if (role === "admin") {
      notesHandler(socket, io);
    }
  });

  return io;
};

module.exports = { initSocket };
