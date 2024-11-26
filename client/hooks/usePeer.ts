import { useState, useEffect, useRef } from "react";
import Peer from "peerjs";
import { Socket } from "socket.io-client";

interface UsePeerReturn {
  peer: Peer | null;
  myPeerId: string;
}

const usePeer = (roomId: string, socket: Socket | null): UsePeerReturn => {
  const [peer, setPeer] = useState<Peer | null>(null);
  const [myPeerId, setMyPeerId] = useState<string>("");
  const isPeerSet = useRef(false);

  useEffect(() => {
    if (isPeerSet.current || !roomId || !socket) return;
    isPeerSet.current = true;

    (async function initPeer() {
      const myPeer = new Peer();
      setPeer(myPeer);

      myPeer.on("open", (id: string) => {
        console.log(`Your peer ID is ${id}`);
        setMyPeerId(id);
        socket?.emit("join-room", roomId, id);
        console.log("joined-room");
      });
    })();
  }, [roomId, socket]);

  return {
    peer,
    myPeerId,
  };
};

export default usePeer;
