import { io, Socket } from "socket.io-client";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { setRole, setRoomId } from "@/lib/features/ruthiMain/ruthiMainSlice";
import peerService from "@/services/Peer";

interface iSocketContext {
  socket: Socket | null;
  isSocketConnected: boolean;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  joinRoom: (roomId: string) => void;
}

interface CustomTokenJwtPayload {
  id: string;
  role: string;
}

interface CustomMeetingLinkJwtPayload {
  hrUserId: string;
  candidateUserId: string;
  jobId: string;
  roomId: string;
}

export const SocketContext = createContext<iSocketContext | null>(null);

export const SocketContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);
  const dispatch = useDispatch();

  const authToken = sessionStorage.getItem("authToken") || "";
  const meetingLink = sessionStorage.getItem("meetingLink") || "";

  const handleJWTData = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      if (!stream) {
        console.log("Please allow audio and video access!");
        alert("Please allow audio and video access!");
        return;
      }

      const tokenDecoded = jwtDecode<CustomTokenJwtPayload>(authToken);
      const meetingLinkDecoded =
        jwtDecode<CustomMeetingLinkJwtPayload>(meetingLink);

      if (tokenDecoded && meetingLinkDecoded) {
        dispatch(setRole(tokenDecoded.role));
        dispatch(setRoomId(meetingLinkDecoded.roomId));
      }

      setLocalStream(stream);
      stream.getTracks().forEach((track) => {
        peerService.peer.addTrack(track, stream);
      });
    } catch (error) {
      console.error("JWT decode error:", error);
      alert("Invalid session. Please join meeting again.");
    }
  };

  useEffect(() => {
    const backendUrl = "http://localhost:8080/";
    const newSocket = io(backendUrl, {
      auth: {
        token: `Bearer ${authToken}`,
        meetingLink: `${meetingLink}`,
      },
    });

    setSocket(newSocket);

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);

      if (error.message.includes("Unauthorized")) {
        sessionStorage.clear();
      } else {
        alert("Unable to connect to the server. Please try again later.");
      }
    });

    if (authToken) {
      handleJWTData();
    }

    return () => {
      newSocket.disconnect();
    };
  }, [authToken, meetingLink]);

  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => setIsSocketConnected(true);
    const handleDisconnect = () => setIsSocketConnected(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [socket]);

  const joinRoom = useCallback(
    (roomId: string) => {
      socket?.emit("room:join", { roomId });
      socket?.on("error", (error) => alert(error.message));
    },
    [socket]
  );

  const handleUserJoined = useCallback(
    async ({ id }: { id: string }) => {
      if (socket && socket.id !== id) {
        console.log(`SocketId ${id} joined room`);
        setRemoteSocketId(id);
        const offer = await peerService.getOffer();
        console.log(`socketId: ${id} offer: ${offer}`);
        socket.emit("user:call", { to: id, offer });
      }
    },
    [socket]
  );

  const handleIncommingCall = useCallback(
    async (data: { from: string; offer: RTCSessionDescriptionInit }) => {
      const { from, offer } = data;
      if (socket && socket.id !== from) {
        setRemoteSocketId(from);
        console.log(`Incoming Call`, from, offer);
        const answer = await peerService.getAnswer(offer);
        socket.emit("call:accepted", { to: from, ans: answer });
      }
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    if (!localStream) {
      console.error("Local stream is not available.");
      return;
    }

    const existingSenders = peerService.peer.getSenders();

    for (const track of localStream.getTracks()) {
      const isTrackAlreadyAdded = existingSenders.some(
        (sender) => sender.track === track
      );

      if (!isTrackAlreadyAdded) {
        peerService.peer.addTrack(track, localStream);
      }
    }
  }, [localStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }: { from: string; ans: RTCSessionDescriptionInit }) => {
      if (socket && socket.id !== from) {
        peerService.setLocalDescription(ans);
        console.log("Call Accepted!");
        sendStreams();
      }
    },
    [socket, sendStreams]
  );

  useEffect(() => {
    peerService.peer.addEventListener("track", (event) => {
      const remoteStreams = event.streams;
      console.log("Received remote tracks:", remoteStreams);
      if (remoteStreams[0]) {
        setRemoteStream(remoteStreams[0]);
      }
    });
  }, []);

  useEffect(() => {
    socket?.on("user:joined", handleUserJoined);
    socket?.on("incomming:call", handleIncommingCall);
    socket?.on("call:accepted", handleCallAccepted);

    return () => {
      socket?.off("user:joined", handleUserJoined);
      socket?.off("incomming:call", handleIncommingCall);
      socket?.off("call:accepted", handleCallAccepted);
    };
  }, [socket, handleUserJoined, handleIncommingCall, handleCallAccepted]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isSocketConnected,
        localStream,
        remoteStream,
        joinRoom,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("useSocket must be used within a SocketContextProvider");
  }

  return context;
};
