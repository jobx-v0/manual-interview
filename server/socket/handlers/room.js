const User = require("../../models/User");
const Job = require("../../models/Job");

const roomHandler = (socket, io) => {
  socket.on("join-room", (roomId, userId) => {
    console.log(`a new user ${userId} joined room ${roomId}`);
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-connected", userId);
  });

  socket.on("user-toggle-audio", (userId, roomId) => {
    console.log(`user-toggle-audio id: ${userId}`);
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-toggle-audio", userId);
  });

  socket.on("user-toggle-video", (userId, roomId) => {
    console.log(`user-toggle-video id: ${userId}`);
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-toggle-video", userId);
  });

  socket.on("user-leave", (userId, roomId) => {
    console.log(`user-leave id: ${userId}`);
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-leave", userId);
  });

  // socket.on("room:join", (data) => {
  //   const { roomId } = data;
  //   io.to(roomId).emit("user:joined", { id: socket.id });
  //   socket.join(roomId);
  //   console.log(`Socket ID: ${socket.id} joined room: ${roomId}`);

  //   // io.to(socket.id).emit("room:join", data);
  // });

  // socket.on("user:call", ({ to, offer }) => {
  //   console.log(`offer: ${offer} to: ${to}`);

  //   io.to(to).emit("incomming:call", { from: socket.id, offer });
  // });

  // socket.on("call:accepted", ({ to, ans }) => {
  //   console.log("call:accepted to: ", to, "ans: ", ans);
  //   io.to(to).emit("call:accepted", { from: socket.id, ans });
  // });

  // socket.on("peer:nego:needed", ({ to, offer }) => {
  //   console.log("peer:nego:needed", offer);
  //   io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  // });

  // socket.on("peer:nego:done", ({ to, ans }) => {
  //   console.log("peer:nego:done", ans);
  //   io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  // });

  socket.on("getJobDetails", async (data, callback) => {
    try {
      const jobId = socket?.meetingDetails?.jobId;

      if (!jobId) {
        return callback({
          success: false,
          message: "Job ID is missing.",
          data: null,
        });
      }

      // Fetch only the required fields
      const jobDoc = await Job.findById(jobId).select(
        "title description employment_type location skills_required experience_required company_name company_logo"
      );

      if (!jobDoc) {
        return callback({
          success: false,
          message: "Job not found.",
          data: null,
        });
      }

      callback({
        success: true,
        message: "Job fetched successfully.",
        data: {
          job: jobDoc,
        },
      });
    } catch (error) {
      console.error("Error fetching job details:", error);
      callback({
        success: false,
        message: "An error occurred while fetching the job details.",
        data: null,
      });
    }
  });
};

module.exports = roomHandler;
