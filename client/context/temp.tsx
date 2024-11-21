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
    } catch (error) {
      console.error("JWT decode error:", error);
      alert("Invalid session. Please join meeting again.");
      // sessionStorage.clear();
      // window.location.href = "/login";
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

      // Handle specific error cases
      if (error.message.includes("Unauthorized")) {
        // alert("Authentication failed. Please log in again.");

        sessionStorage.clear();
        // window.location.href = "/login"; // Redirect to login or error page
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

    const handleConnect = () => {
      setIsSocketConnected(true);
    };

    const handleDisconnect = () => {
      setIsSocketConnected(false);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    // Cleanup event listeners
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [socket]);

  const joinRoom = async (roomId: string) => {
    try {
      socket?.emit("room:join", { roomId });
    } catch (error) {
      console.error(error);
    }
  };

  const handleUserJoined = useCallback(
    async ({ id }: { id: string }) => {
      setRemoteSocketId(id);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setLocalStream(stream);

      const offer = await peerService.getOffer();
      socket?.emit("user:call", { to: id, offer });
    },
    [socket]
  );

  const handleIncommingCall = useCallback(
    async ({
      from,
      offer,
    }: {
      from: string;
      offer: RTCSessionDescriptionInit;
    }) => {
      setRemoteSocketId(from);
      const ans = await peerService.getAnswer(offer);
      socket?.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    if (!localStream) {
      console.error("Local stream is not available.");
      return;
    }

    const peer = peerService.getPeer();
    const existingTracks = peer.getSenders().map((sender) => sender.track);

    for (const track of localStream.getTracks()) {
      if (!existingTracks.includes(track)) {
        peer.addTrack(track, localStream);
      }
    }
  }, [localStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }: { from: string; ans: RTCSessionDescriptionInit }) => {
      peerService.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peerService.getOffer();
    socket?.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peerService
      .getPeer()
      .addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peerService
        .getPeer()
        .removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({
      from,
      offer,
    }: {
      from: string;
      offer: RTCSessionDescriptionInit;
    }) => {
      const ans = await peerService.getAnswer(offer);
      socket?.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(
    async ({ ans }: { ans: RTCSessionDescriptionInit }) => {
      await peerService.setLocalDescription(ans);
    },
    []
  );

  useEffect(() => {
    peerService.getPeer().addEventListener("track", async (ev) => {
      const incomingStream = ev.streams;
      console.log(incomingStream);

      console.log("GOT TRACKS!!");
      setRemoteStream(incomingStream[0]);
    });
  }, []);

  useEffect(() => {
    socket?.on("user:joined", handleUserJoined);
    socket?.on("incomming:call", handleIncommingCall);
    socket?.on("call:accepted", handleCallAccepted);
    socket?.on("peer:nego:needed", handleNegoNeedIncomming);
    socket?.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket?.off("user:joined", handleUserJoined);
      socket?.off("incomming:call", handleIncommingCall);
      socket?.off("call:accepted", handleCallAccepted);
      socket?.off("peer:nego:needed", handleNegoNeedIncomming);
      socket?.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);

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
