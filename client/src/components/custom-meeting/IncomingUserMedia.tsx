import React, { useEffect, useRef } from "react";
import { useSocket } from "../../../context/SocketContext";
import VideoContainer from "./VideoContainer";

const IncomingUserMedia = () => {
  const { remoteStream } = useSocket();

  //   console.log("Incoming Streams Length:", incomingStreams.length);
  //   incomingStreams.forEach((stream, index) =>
  //     console.log(`Stream ${index}:`, stream)
  //   );

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    console.log(remoteStream);
    if (videoRef.current) {
      videoRef.current.srcObject = remoteStream; // Example: Display the first stream
    }
  }, [remoteStream]);

  return (
    <div className="w-full h-full object-cover flex flex-wrap">
      <video
        className="h-full w-full object-cover"
        ref={videoRef}
        autoPlay
        playsInline
        muted={false}
      ></video>
    </div>
  );
};

export default IncomingUserMedia;
