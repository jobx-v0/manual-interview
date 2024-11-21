"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useSocket } from "../../../context/SocketContext";
import VideoContainer from "./VideoContainer";

const LocalUserMedia = () => {
  const { localStream } = useSocket();

  useEffect(() => {}, []);

  return (
    <Card className="flex-shrink-0 w-40 h-32 relative overflow-hidden">
      <VideoContainer
        stream={localStream}
        isLocalStream={true}
        isOnCall={false}
      />
    </Card>
  );
};

export default LocalUserMedia;
