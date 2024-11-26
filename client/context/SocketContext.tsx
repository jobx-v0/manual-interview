import { Socket } from "socket.io-client";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { jwtDecode } from "jwt-decode";
import Peer, { MediaConnection } from "peerjs";
import { cloneDeep } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { setRole, setRoomId } from "@/lib/features/ruthiMain/ruthiMainSlice";
import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";
import usePeer from "../hooks/usePeer";
import useSocketManager from "../hooks/useSocketManager";

interface Player {
  muted: boolean;
  playing: boolean;
  [key: string]: any;
}

interface Players {
  [id: string]: Player;
}

interface iSocketContext {
  socket: Socket | null;
  peer: Peer | null;
  myPeerId: string;
  localStream: MediaStream | null;
  setPlayers: React.Dispatch<React.SetStateAction<Players>>;
  playerHighlighted: Player | undefined;
  nonHighlightedPlayers: Players;
  toggleAudio: () => void;
  toggleVideo: () => void;
  leaveRoom: () => void;
  availableDevices: MediaDeviceInfo[];
  selectedAudioDevice: string | null;
  selectedOutputDevice: string | null;
  selectedVideoDevice: string | null;
  setAvailableDevices: React.Dispatch<React.SetStateAction<MediaDeviceInfo[]>>;
  setSelectedAudioDevice: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedOutputDevice: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedVideoDevice: React.Dispatch<React.SetStateAction<string | null>>;
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

interface UsersState {
  [userId: string]: MediaConnection;
}

export const SocketContext = createContext<iSocketContext | null>(null);

export const SocketContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const authToken = sessionStorage.getItem("authToken") || "";
  const meetingLink = sessionStorage.getItem("meetingLink") || "";

  const authTokenRef = useRef<string>(
    sessionStorage.getItem("authToken") || ""
  );
  const meetingLinkRef = useRef<string>(
    sessionStorage.getItem("meetingLink") || ""
  );

  const socket = useSocketManager(authToken, meetingLink);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const isLocalStreamSet = useRef(false);

  const dispatch = useDispatch();
  const { roomId } = useSelector((state: RootState) => state.ruthiMain);
  const { myPeerId, peer } = usePeer(roomId, socket);

  const [players, setPlayers] = useState<Players>({});
  const playersCopy = cloneDeep(players);

  const playerHighlighted = playersCopy[myPeerId];
  delete playersCopy[myPeerId];

  const nonHighlightedPlayers = playersCopy;

  const [users, setUsers] = useState<UsersState>({});

  const myPeerIdRef = useRef(myPeerId);

  const router = useRouter();

  const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>(
    []
  );
  const [selectedAudioDevice, setSelectedAudioDevice] = useState<string | null>(
    null
  );
  const [selectedOutputDevice, setSelectedOutputDevice] = useState<
    string | null
  >(null);
  const [selectedVideoDevice, setSelectedVideoDevice] = useState<string | null>(
    null
  );

  useEffect(() => {
    myPeerIdRef.current = myPeerId;
  }, [myPeerId]);

  const handleJWTData = async () => {
    if (!authToken || !meetingLink) return;
    try {
      const tokenDecoded = jwtDecode<CustomTokenJwtPayload>(authToken);
      const meetingLinkDecoded =
        jwtDecode<CustomMeetingLinkJwtPayload>(meetingLink);

      if (tokenDecoded && meetingLinkDecoded) {
        dispatch(setRole(tokenDecoded.role));
        dispatch(setRoomId(meetingLinkDecoded.roomId));
      }
    } catch (error) {
      console.error("JWT decode error:", error);
      alert("Invalid session. Please join meeting again.");
    }
  };

  useEffect(() => {
    if (!authTokenRef || !meetingLinkRef) {
      router.push("/meeting-error");
      return;
    }
    handleJWTData();
  }, [authTokenRef, meetingLinkRef]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        setAvailableDevices(devices);

        const defaultAudioDevice = devices.find(
          (device) => device.kind === "audioinput"
        );
        const defaultVideoDevice = devices.find(
          (device) => device.kind === "videoinput"
        );
        const defaultOutputDevice = devices.find(
          (device) => device.kind === "audiooutput"
        );

        if (defaultAudioDevice)
          setSelectedAudioDevice(defaultAudioDevice.deviceId);
        if (defaultVideoDevice)
          setSelectedVideoDevice(defaultVideoDevice.deviceId);
        if (defaultOutputDevice)
          setSelectedOutputDevice(defaultOutputDevice.deviceId);

        console.log("Available devices:", devices);
      } catch (err) {
        console.error("Error fetching devices:", err);
      }
    };

    fetchDevices();
  }, []);

  useEffect(() => {
    if (!selectedOutputDevice) return;

    const audioElements = document.querySelectorAll("audio");
    audioElements.forEach((audio) => {
      if ("setSinkId" in audio) {
        (audio as HTMLMediaElement)
          .setSinkId(selectedOutputDevice)
          .then(() => {
            console.log(
              `Audio output routed to device: ${selectedOutputDevice}`
            );
          })
          .catch((err) => {
            console.error("Error setting sink ID:", err);
          });
      } else {
        console.warn("setSinkId is not supported in this browser.");
      }
    });
  }, [selectedOutputDevice]);

  const updateStream = async () => {
    try {
      // Stop existing tracks
      localStream?.getTracks().forEach((track) => track.stop());

      // Define new constraints based on selected devices
      const constraints: MediaStreamConstraints = {
        audio: selectedAudioDevice
          ? { deviceId: { exact: selectedAudioDevice } }
          : true,
        video: selectedVideoDevice
          ? { deviceId: { exact: selectedVideoDevice } }
          : true,
      };

      // Get new media stream
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);

      // Update localStream
      setLocalStream(newStream);

      console.log("Updated local stream with selected devices.");

      // Replace tracks in PeerJS connections
      Object.values(users).forEach((connection) => {
        connection.peerConnection.getSenders().forEach((sender) => {
          if (sender.track?.kind === "audio") {
            const newAudioTrack = newStream.getAudioTracks()[0];
            if (newAudioTrack) sender.replaceTrack(newAudioTrack);
          }
          if (sender.track?.kind === "video") {
            const newVideoTrack = newStream.getVideoTracks()[0];
            if (newVideoTrack) sender.replaceTrack(newVideoTrack);
          }
        });
      });

      // Notify connected peers about the updated stream
      Object.keys(players).forEach((peerId) => {
        if (peerId !== myPeerId) {
          const call = peer?.call(peerId, newStream);
          call?.on("stream", (remoteStream) => {
            setPlayers((prev) => ({
              ...prev,
              [peerId]: { url: remoteStream, muted: true, playing: true },
            }));
          });
        }
      });
    } catch (err) {
      console.error("Error updating stream:", err);
    }
  };

  useEffect(() => {
    // Update stream whenever a device is selected or changed
    if (selectedAudioDevice || selectedVideoDevice) {
      updateStream();
    }
  }, [selectedAudioDevice, selectedVideoDevice]);

  // useEffect(() => {
  //   if (isLocalStreamSet.current) return;
  //   isLocalStreamSet.current = true;

  //   (async function initStream() {
  //     try {
  //       const stream = await navigator.mediaDevices.getUserMedia({
  //         audio: true,
  //         video: true,
  //       });
  //       console.log("Setting your stream");
  //       setLocalStream(stream);
  //     } catch (e) {
  //       console.error("Error in media navigator", e);
  //     }
  //   })();
  // }, []);

  useEffect(() => {
    const handleUserConnected = (newUser: string) => {
      if (!socket || !peer || !localStream) return;

      // Check if the user is already in the meeting
      if (users[newUser]) {
        console.log(
          `User ${newUser} is already connected. Ignoring duplicate connection.`
        );
        return;
      }

      console.log(`User connected in room with userId ${newUser}`);
      const call = peer.call(newUser, localStream);

      call.on("stream", (incomingStream) => {
        console.log(`Incoming stream from ${newUser}`);

        // Check again before saving the stream
        setPlayers((prev) => {
          if (prev[newUser]) {
            console.log(
              `Duplicate stream detected for ${newUser}. Skipping update.`
            );
            return prev;
          }
          return {
            ...prev,
            [newUser]: {
              url: incomingStream,
              muted: true,
              playing: true,
            },
          };
        });

        setUsers((prev) => {
          if (prev[newUser]) {
            console.log(
              `Duplicate user detected for ${newUser}. Skipping update.`
            );
            return prev;
          }
          return {
            ...prev,
            [newUser]: call,
          };
        });
      });
    };

    socket?.on("user-connected", handleUserConnected);

    return () => {
      socket?.off("user-connected", handleUserConnected);
    };
  }, [peer, socket, localStream]);

  useEffect(() => {
    if (!peer || !localStream) return;

    peer.on("call", (call) => {
      const { peer: callerId } = call;

      // Check if the callerId already exists in the users state
      if (users[callerId]) {
        console.log(`Duplicate call detected from ${callerId}. Ignoring.`);
        return;
      }

      call.answer(localStream);

      call.on("stream", (incomingStream) => {
        console.log(`Incoming stream from ${callerId}`);

        // Check again in the players state before updating
        setPlayers((prev) => {
          if (prev[callerId]) {
            console.log(
              `Duplicate stream detected for ${callerId}. Skipping update.`
            );
            return prev;
          }
          return {
            ...prev,
            [callerId]: {
              url: incomingStream,
              muted: true,
              playing: true,
            },
          };
        });

        setUsers((prev) => {
          if (prev[callerId]) {
            console.log(
              `Duplicate user detected for ${callerId}. Skipping update.`
            );
            return prev;
          }
          return {
            ...prev,
            [callerId]: call,
          };
        });
      });
    });

    return () => {
      peer.off("call");
    };
  }, [peer, localStream, users]);

  useEffect(() => {
    if (!localStream || !myPeerId) return;

    console.log(
      `Setting my stream for peer ID and appending to players: ${myPeerId}`
    );

    setPlayers((prev) => {
      // Check if the myPeerId is already in the players state
      if (prev[myPeerId]) {
        console.log(
          `Stream for peer ID ${myPeerId} is already set. Skipping update.`
        );
        return prev;
      }

      return {
        ...prev,
        [myPeerId]: {
          url: localStream,
          muted: true,
          playing: true,
        },
      };
    });
  }, [myPeerId, setPlayers, localStream]);

  const leaveRoom = () => {
    socket?.emit("user-leave", myPeerId, roomId);
    console.log("leaving room", roomId);
    peer?.disconnect();
    router?.push("/thank-you");
  };

  const toggleAudio = () => {
    const currentPeerId = myPeerIdRef.current;
    if (!currentPeerId) {
      console.error("Peer ID not available");
      return;
    }

    console.log(`I toggled my audio id ${currentPeerId}`);
    console.log(`Players are: `);
    Object.keys(players).map((playerId) => {
      console.log("playerId: ", playerId, "Details: ", players[playerId]);
    });

    if (currentPeerId) {
      setPlayers((prev) => {
        const copy = cloneDeep(prev);
        if (!copy[currentPeerId]) {
          console.error(`Player with id ${currentPeerId} does not exist.`);
          return prev;
        }
        copy[currentPeerId].muted = !copy[currentPeerId].muted;
        return { ...copy };
      });
      socket?.emit("user-toggle-audio", currentPeerId, roomId);
    }
  };

  const toggleVideo = () => {
    const currentPeerId = myPeerIdRef.current;
    if (!currentPeerId) {
      console.error("Peer ID not available");
      return;
    }

    console.log(`I toggled my video id ${currentPeerId}`);
    console.log(`Players are: `);
    Object.keys(players).map((playerId) => {
      console.log("playerId: ", playerId, "Details: ", players[playerId]);
    });

    if (currentPeerId) {
      setPlayers((prev) => {
        const copy = cloneDeep(prev);
        if (!copy[currentPeerId]) {
          console.error(`Player with id ${currentPeerId} does not exist.`);
          return prev;
        }
        copy[currentPeerId].playing = !copy[currentPeerId].playing;

        if (copy[currentPeerId].playing) {
          updateStream();
        }

        return { ...copy };
      });
      socket?.emit("user-toggle-video", currentPeerId, roomId);
    }
  };

  useEffect(() => {
    if (!socket) return;
    const handleToggleAudio = (userId: string) => {
      console.log(`user with id ${userId} toggled audio`);
      setPlayers((prev) => {
        const copy = cloneDeep(prev);
        console.log(prev);
        copy[userId].muted = !copy[userId].muted;
        return { ...copy };
      });
    };

    const handleToggleVideo = (userId: string) => {
      console.log(`user with id ${userId} toggled video`);
      setPlayers((prev) => {
        const copy = cloneDeep(prev);
        console.log(copy[userId]);
        copy[userId].playing = !copy[userId].playing;
        return { ...copy };
      });
    };

    const handleUserLeave = (userId: string) => {
      console.log(`user ${userId} is leaving the room`);
      users[userId]?.close();
      const playersCopy = cloneDeep(players);
      delete playersCopy[userId];
      setPlayers(playersCopy);
    };

    socket.on("user-toggle-audio", handleToggleAudio);
    socket.on("user-toggle-video", handleToggleVideo);
    socket.on("user-leave", handleUserLeave);
    return () => {
      socket.off("user-toggle-audio", handleToggleAudio);
      socket.off("user-toggle-video", handleToggleVideo);
      socket.off("user-leave", handleUserLeave);
    };
  }, [players, setPlayers, socket, users]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        peer,
        myPeerId,
        localStream,
        setPlayers,
        nonHighlightedPlayers,
        playerHighlighted,
        toggleAudio,
        toggleVideo,
        leaveRoom,
        availableDevices,
        selectedAudioDevice,
        selectedOutputDevice,
        selectedVideoDevice,
        setAvailableDevices,
        setSelectedAudioDevice,
        setSelectedOutputDevice,
        setSelectedVideoDevice,
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
