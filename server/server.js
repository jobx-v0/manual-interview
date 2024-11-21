const { app, server } = require("./app"); // Import Express and HTTP server
const { initSocket } = require("./socket"); // Import Socket.IO setup

require("./config/db");

// Initialize Socket.IO
initSocket(server);

// Start the server
const port = process.env.PORT || 8090;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
