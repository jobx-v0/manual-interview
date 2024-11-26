const jwt = require("jsonwebtoken");

const authSocketMiddleware = (socket, next) => {
  const token = socket.handshake.auth.token;
  const meetingLink = socket.handshake.auth.meetingLink;

  if (!token || !token.startsWith("Bearer ")) {
    return next(new Error("Unauthorized - Token missing or invalid format"));
  }

  const extractedToken = token.substring(7);

  try {
    const tokenDecoded = jwt.verify(
      extractedToken,
      process.env.JWT_TOKEN_SECRET_KEY
    );

    const meetingLinkDecoded = jwt.verify(
      meetingLink,
      process.env.JWT_TOKEN_SECRET_KEY
    );

    if (tokenDecoded.role === "admin") {
      if (tokenDecoded.id !== meetingLinkDecoded.hrUserId) {
        return next(
          new Error("Unauthorized - You are not the HR of this meeting")
        );
      }
    } else {
      if (tokenDecoded.id !== meetingLinkDecoded.candidateUserId) {
        return next(
          new Error("Unauthorized - You are not the user of this meeting")
        );
      }
    }

    socket.meetingDetails = meetingLinkDecoded;
    socket.user = tokenDecoded;
    next();
  } catch (error) {
    next(new Error("Unauthorized - Invalid token"));
  }
};

module.exports = { authSocketMiddleware };
