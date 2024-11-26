"use client";

import React, { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { useSocket } from "../../../context/SocketContext";
import { VideoOff } from "lucide-react";

const LocalUserMedia = () => {
  const { playerHighlighted, localStream } = useSocket();

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef.current.srcObject = localStream; // Attach the stream to the video element
    }
  }, [localStream]); // Re-run if the stream changes

  return (
    <Card className="flex-shrink-0 w-40 h-32 relative overflow-hidden">
      {playerHighlighted?.playing ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        ></video>
      ) : (
        <div className="flex w-full h-full justify-center items-center">
          <VideoOff />
        </div>
      )}
    </Card>
  );
};

export default LocalUserMedia;
