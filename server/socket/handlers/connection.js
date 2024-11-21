const User = require("../../models/User");

const connectionHandler = async (socket, io) => {
  const userId = socket.user?.id || socket.user?._id;

  if (userId) {
    try {
      // Update user with socket ID
      await User.findByIdAndUpdate(userId, { socketId: socket.id });
      console.log(
        `${socket.user?.role} connected: ${userId}, Socket ID: ${socket.id}`
      );
    } catch (error) {
      console.error("Error updating socket ID:", error);
    }
  }

  // Handle disconnection
  socket.on("end-meeting", async () => {
    if (userId && socket.id === (await User.findById(userId)).socketId) {
      try {
        await User.findByIdAndUpdate(userId, { socketId: null });
        console.log(`User disconnected: ${userId}`);
      } catch (error) {
        console.error("Error handling disconnection:", error);
      }
    }
  });
};

module.exports = connectionHandler;
