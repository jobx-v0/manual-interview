"use client";

import Meeting from "@/components/custom-meeting/Meeting";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  var authToken;
  var meetingLink;

  useEffect(() => {
    authToken = sessionStorage.getItem("authToken");
    meetingLink = sessionStorage.getItem("meetingLink");

    if (!authToken && !meetingLink) {
      router.push("/meeting-error");
    }
  }, []);

  return (
    <>
      {!authToken && !meetingLink && (
        <div className="flex flex-col h-screen w-screen">
          <Meeting />
        </div>
      )}
    </>
  );
}
