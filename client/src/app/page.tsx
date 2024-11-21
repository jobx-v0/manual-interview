"use client";

import Meeting from "@/components/custom-meeting/Meeting";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const authToken = sessionStorage.getItem("authToken");
  const meetingLink = sessionStorage.getItem("meetingLink");

  useEffect(() => {
    if (!authToken && !meetingLink) {
      router.push("/meeting-error");
    }
  }, []);

  return (
    <>
      {!authToken && !meetingLink ? null : (
        <div className="flex flex-col h-screen w-screen">
          <Meeting />
        </div>
      )}
    </>
  );
}
