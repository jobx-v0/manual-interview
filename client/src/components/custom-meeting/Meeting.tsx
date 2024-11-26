"use client";

import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2 } from "lucide-react";
import RoomChat from "./RoomChat";
import EngagementScore from "./EngagementScore";
import Notes from "./Notes";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import CandidateProfile from "./CandidateProfile";
import { useSocket } from "../../../context/SocketContext";
import { addChat } from "@/lib/features/roomChat/roomChatSlice";
import { useRouter } from "next/navigation";
import JobDetails from "./JobDetails";
import LocalUserMedia from "./LocalUserMedia";
import VideoControlls from "./VideoControlls";
import IncomingUserMedia from "./IncomingUserMedia";

interface ChatMessage {
  sender: string;
  message: string;
  timestamp: string;
}

export default function Meeting() {
  const { socket, nonHighlightedPlayers } = useSocket();
  const dispatch = useDispatch();
  const router = useRouter();

  const { role, roomId } = useSelector((state: RootState) => state.ruthiMain);

  useEffect(() => {
    if (!socket || !roomId) return;

    socket?.on("receiveMessage", (data: ChatMessage) => {
      if (role !== data.sender) {
        dispatch(addChat(data));
      }
    });

    return () => {
      socket?.off("receiveMessage");
    };
  }, [socket, roomId, dispatch]);

  return (
    <div className="flex h-screen bg-background">
      {/* Left Section - Video */}
      <div className="flex-1 relative">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10 bg-gradient-to-b from-black/50 to-transparent">
          <JobDetails />
        </div>

        {/* Main Video */}
        <div className="h-full bg-muted">
          {/* <IncomingUserMedia /> */}
          {Object.keys(nonHighlightedPlayers).map((playerId) => {
            const { url, muted, playing } = nonHighlightedPlayers[playerId];
            return (
              <IncomingUserMedia
                key={playerId}
                url={url}
                muted={muted}
                playing={playing}
              />
            );
          })}

          {/* Video Controls */}
          <VideoControlls />

          {/* Participants Strip */}
          <div className="absolute bottom-24 left-0 right-0 p-4 flex gap-2 overflow-x-auto">
            <LocalUserMedia />
          </div>
        </div>
      </div>

      {/* Right Section - Info Panel */}
      <div className="w-96 bg-gray-50">
        <Tabs defaultValue="chat" className="h-full flex flex-col">
          <div className="flex-1">
            {role === "admin" ? (
              <>
                <div className="p-4 space-y-4 border-b">
                  <CandidateProfile />
                </div>
              </>
            ) : null}

            <TabsList
              className={`w-full justify-start px-4 pt-2 bg-transparent ${
                role !== "admin" ? "pt-6" : null
              }`}
            >
              <TabsTrigger value="chat" className="flex-1">
                Room Chat
              </TabsTrigger>
              {role === "admin" ? (
                <>
                  <TabsTrigger value="notes" className="flex-1">
                    Notes
                  </TabsTrigger>
                  <TabsTrigger value="scores" className="flex-1">
                    Scores
                  </TabsTrigger>
                </>
              ) : null}
              <TabsTrigger value="info" className="flex-1">
                More Info
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="chat"
              className="flex-1 flex flex-col px-4 bg-white"
            >
              <RoomChat role={role} roomId={roomId} />
            </TabsContent>

            <TabsContent
              value="notes"
              className="flex-1 flex flex-col px-2 bg-white"
            >
              <div className="h-full">
                <Notes />
              </div>
            </TabsContent>

            <TabsContent value="scores" className="flex-1 flex flex-col px-4">
              <div className="p-4 shadow-md rounded-md">
                <EngagementScore />
              </div>
            </TabsContent>

            <TabsContent value="info" className="flex-1 p-4 bg-white">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Meeting Info</h3>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Duration: 45 minutes
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Participants: 4
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Tasks</h3>
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Task {i + 1} completed</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
