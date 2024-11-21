import React, { useCallback, useEffect, useState } from "react";
import {
  Mic,
  Video,
  MonitorUp,
  PhoneOff,
  MoreVertical,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSocket } from "../../../context/SocketContext";
import { useRouter } from "next/navigation";

const VideoControlls = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoOff, setIsVideoOff] = useState(true);

  const { localStream } = useSocket();

  const { socket } = useSocket();
  const router = useRouter();

  useEffect(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      setIsVideoOff(videoTrack.enabled);
      const audioTrack = localStream.getAudioTracks()[0];
      setIsMuted(audioTrack.enabled);
    }
  }, [localStream]);

  const toggleCamera = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOff(videoTrack.enabled);
    }
  }, [localStream]);

  const toggleMic = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(audioTrack.enabled);
    }
  }, [localStream]);

  const handleMeetingEnd = () => {
    socket?.emit("end-meeting"); // Use a custom event name
    socket?.disconnect(); // Disconnect the socket explicitly
    router.push("/thank-you");
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-center gap-4 bg-gradient-to-t from-black/50 to-transparent">
      <Button
        variant="outline"
        size="icon"
        className="rounded-full bg-background/20 backdrop-blur hover:bg-background/30"
        onClick={toggleMic}
      >
        <Mic className={`h-5 w-5 ${isMuted ? "text-red-500" : "text-white"}`} />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full bg-background/20 backdrop-blur hover:bg-background/30"
        onClick={toggleCamera}
      >
        <Video
          className={`h-5 w-5 ${isVideoOff ? "text-red-500" : "text-white"}`}
        />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full bg-background/20 backdrop-blur hover:bg-background/30"
      >
        <MonitorUp className="h-5 w-5 text-white" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="rounded-full bg-background/20 backdrop-blur hover:bg-background/30"
      >
        <MoreVertical className="h-5 w-5 text-white" />
      </Button>
      <Button
        variant="destructive"
        size="icon"
        className="rounded-full"
        onClick={handleMeetingEnd}
      >
        <PhoneOff className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default VideoControlls;
