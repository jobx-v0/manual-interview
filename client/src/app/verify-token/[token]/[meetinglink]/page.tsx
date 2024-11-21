"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";

const page = () => {
  const router = useRouter();
  const { token, meetinglink } = useParams<{
    token: string;
    meetinglink: string;
  }>();

  useEffect(() => {
    sessionStorage.setItem("authToken", token);
    sessionStorage.setItem("meetingLink", meetinglink);
    router.push("/");
  }, [token, meetinglink, router]);

  return <div></div>;
};

export default page;
