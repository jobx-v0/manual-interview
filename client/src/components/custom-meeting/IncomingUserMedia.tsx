import React from "react";
import ReactPlayer from "react-player";
import { UserSquare2, VolumeX } from "lucide-react";

const IncomingUserMedia = ({
  url,
  muted,
  playing,
}: {
  url: string;
  muted: boolean | undefined;
  playing: boolean | undefined;
}) => {
  return (
    <div className="relative w-full h-full flex flex-wrap ">
      <div
        className={`${
          muted ? "blur-sm" : ""
        } w-full h-full absolute inset-0 z-0`}
      >
        {playing ? (
          <ReactPlayer
            url={url}
            muted={muted}
            playing={playing}
            width="100%"
            height="100%"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <UserSquare2 size={150} />
          </div>
        )}
      </div>
      {muted && (
        <div className="absolute inset-0 flex items-center justify-center">
          <VolumeX className="text-white w-12 h-12" />
        </div>
      )}
    </div>
  );
};

export default IncomingUserMedia;
