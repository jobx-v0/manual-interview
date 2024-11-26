import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const useSocketManager = (authToken: string, meetingLink: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const connected = useRef<boolean>(false);

  useEffect(() => {
    if (connected.current || !authToken || !meetingLink) {
      return;
    }
    const backendUrl = "http://localhost:8080/";
    const newSocket = io(backendUrl, {
      auth: { token: `Bearer ${authToken}`, meetingLink },
    });
    setSocket(newSocket);

    console.log("socket connected id: ", newSocket);

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
      if (error.message.includes("Unauthorized")) {
        sessionStorage.clear();
        localStorage.clear();
      }
    });
    if (newSocket?.connected) {
      connected.current = true;
    }

    return () => {
      newSocket.disconnect();
    };
  }, [authToken, meetingLink]);

  return socket;
};

export default useSocketManager;
