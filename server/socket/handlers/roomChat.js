const User = require("../../models/User");

const roomChatHandler = (socket, io) => {
  // Handle sending messages
  socket.on("sendMessage", async ({ roomId, message }, callback) => {
    try {
      const timestamp = new Date().toISOString();

      const role = socket?.user?.role;

      // Broadcast message to the room
      io.to(roomId).emit("receiveMessage", {
        sender: role, // or username if available
        message,
        timestamp,
      });

      callback({
        success: true,
        message: "Message sent successfully.",
        data: { sender: role, message, timestamp },
      });
    } catch (error) {
      console.error("Error sending message:", error);
      callback({
        success: false,
        message: "Failed to send message.",
      });
    }
  });
};

module.exports = roomChatHandler;
