import React, { useEffect, useRef } from "react";

interface iVideoContainer {
  stream: MediaStream | null;
  isLocalStream: boolean;
  isOnCall: boolean;
}

const VideoContainer = ({
  stream,
  isLocalStream,
  isOnCall,
}: iVideoContainer) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    } else if (videoRef.current) {
      videoRef.current.srcObject = null; // Clear the video element if no stream
    }
  }, [stream]);

  return (
    <video
      className="h-full w-full object-cover"
      ref={videoRef}
      autoPlay
      playsInline
      muted={isLocalStream}
    ></video>
  );
};

export default VideoContainer;
