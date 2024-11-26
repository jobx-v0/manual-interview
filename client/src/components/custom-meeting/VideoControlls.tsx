import React, { useCallback } from "react";
import {
  Mic,
  Video,
  MonitorUp,
  PhoneOff,
  MoreVertical,
  CheckCircle2,
  Volume2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSocket } from "../../../context/SocketContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";

const VideoControlls = () => {
  const {
    localStream,
    toggleAudio,
    toggleVideo,
    playerHighlighted,
    leaveRoom,
    availableDevices,
    selectedAudioDevice,
    selectedVideoDevice,
    selectedOutputDevice,
    setAvailableDevices,
    setSelectedAudioDevice,
    setSelectedVideoDevice,
    setSelectedOutputDevice,
  } = useSocket();

  const audioInputDevices = availableDevices.filter(
    (device) => device.kind === "audioinput"
  );
  const audioOutputDevices = availableDevices.filter(
    (device) => device.kind === "audiooutput"
  );
  const videoDevices = availableDevices.filter(
    (device) => device.kind === "videoinput"
  );

  const handleToggleCamera = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      toggleVideo();
    }
  }, [localStream]);

  const handleToggleMic = useCallback(() => {
    if (localStream) {
      toggleAudio();
    }
  }, [localStream]);

  return (
    <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-center gap-4 bg-gradient-to-t from-black/50 to-transparent">
      <Button
        variant="outline"
        size="icon"
        className="rounded-full bg-background/20 backdrop-blur hover:bg-background/30"
        onClick={handleToggleMic}
      >
        <Mic
          className={`h-5 w-5 ${
            !playerHighlighted?.muted ? "text-red-500" : "text-white"
          }`}
        />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full bg-background/20 backdrop-blur hover:bg-background/30"
        onClick={handleToggleCamera}
      >
        <Video
          className={`h-5 w-5 ${
            playerHighlighted?.playing ? "text-red-500" : "text-white"
          }`}
        />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full bg-background/20 backdrop-blur hover:bg-background/30"
      >
        <MonitorUp className="h-5 w-5 text-white" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-background/20 backdrop-blur hover:bg-background/30"
          >
            <MoreVertical className="h-5 w-5 text-white" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="right"
          align="end"
          className="mb-12 w-56 overflow-hidden rounded-xl border border-border bg-popover p-2 text-popover-foreground shadow-lg"
        >
          <DeviceSubMenu
            icon={Mic}
            label="Microphone"
            devices={audioInputDevices}
            selectedDevice={selectedAudioDevice}
            setSelectedDevice={setSelectedAudioDevice}
          />
          <DeviceSubMenu
            icon={Volume2}
            label="Audio Output"
            devices={audioOutputDevices}
            selectedDevice={selectedOutputDevice}
            setSelectedDevice={setSelectedOutputDevice}
          />
          <DeviceSubMenu
            icon={Video}
            label="Video"
            devices={videoDevices}
            selectedDevice={selectedVideoDevice}
            setSelectedDevice={setSelectedVideoDevice}
          />
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        variant="destructive"
        size="icon"
        className="rounded-full"
        onClick={leaveRoom}
      >
        <PhoneOff className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default VideoControlls;

function DeviceSubMenu({
  icon: Icon,
  label,
  devices,
  selectedDevice,
  setSelectedDevice,
}: {
  icon: React.ElementType;
  label: string;
  devices: MediaDeviceInfo[];
  selectedDevice: string | null;
  setSelectedDevice: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="focus:bg-accent focus:text-accent-foreground focus:outline-none data-[state=open]:bg-orange-200 data-[state=open]:text-accent-foreground flex items-center p-2 rounded-sm cursor-pointer">
        <Icon className="mr-2 h-4 w-4" />
        <span>{label}</span>
        <ChevronRight className="ml-auto h-4 w-4" />
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent className="origin-radial-right w-56 overflow-x-hidden rounded-xl border border-border bg-popover p-2 text-popover-foreground shadow-lg data-[side=right]:animate-in data-[side=right]:fade-in-0 data-[side=right]:slide-in-from-left-1 max-h-[600px] overflow-auto hide-scrollbar">
          <AnimatePresence>
            {devices.map((device, index) => (
              <React.Fragment key={device.deviceId}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <DropdownMenuItem
                    onClick={() => setSelectedDevice(device.deviceId)}
                    className={`${
                      selectedDevice === device.deviceId
                        ? "bg-orange-600 text-white"
                        : "hover:bg-orange-200"
                    } focus:outline-none rounded-md transition-colors duration-200 p-1 cursor-pointer`}
                  >
                    {device.label || `${label} ${index + 1}`}
                  </DropdownMenuItem>
                </motion.div>
                {index < devices.length - 1 && (
                  <hr className="my-1 border-gray-200" />
                )}
              </React.Fragment>
            ))}
          </AnimatePresence>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}
