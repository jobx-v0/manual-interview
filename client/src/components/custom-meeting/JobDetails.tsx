"use client";

import React, { useEffect, useState } from "react";
import { useSocket } from "../../../context/SocketContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Clock } from "lucide-react";

interface JobDetails {
  title: string;
  description: string;
  employment_type: string;
  location: string;
  skills_required: string[];
  experience_required: string;
  company_name: string;
  company_logo: string;
}

export default function JobDetails() {
  const { socket } = useSocket();
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!socket) return;

    socket.emit("getJobDetails", {}, (response: any) => {
      if (response.success) {
        setJobDetails(response.data.job);
      } else {
        setError(response.message || "Failed to fetch job details.");
      }
    });
  }, [socket]);

  if (error) {
    return <p className="text-destructive text-center mt-4">{error}</p>;
  }

  if (!jobDetails) {
    return (
      <p className="text-muted-foreground text-center mt-4">
        Loading job details...
      </p>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-3 cursor-pointer">
          <div>
            <h1 className="text-lg font-semibold text-white text-shadow">
              {jobDetails.title}
            </h1>
            <p className="text-sm text-white/80 text-shadow-sm">
              {jobDetails.company_name}
            </p>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-full max-w-md p-0 h-[500px] overflow-y-auto"
        side="right"
        align="start"
      >
        <CardHeader className="pb-4">
          <div className="flex items-center">
            <img
              src={jobDetails.company_logo}
              alt={`${jobDetails.company_name} Company Logo`}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="ml-4">
              <h2 className="text-2xl font-bold">{jobDetails.title}</h2>
              <p className="text-muted-foreground">{jobDetails.company_name}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm">{jobDetails.description}</p>

          <div>
            <h3 className="font-semibold mb-2">Details:</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Briefcase className="w-4 h-4 mr-2" />
                <span className="text-sm">
                  Employment Type: {jobDetails.employment_type}
                </span>
              </li>
              <li className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-sm">Location: {jobDetails.location}</span>
              </li>
              <li className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-sm">
                  Experience Required: {jobDetails.experience_required}
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Skills Required:</h3>
            <div className="flex flex-wrap gap-2">
              {jobDetails.skills_required.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </PopoverContent>
    </Popover>
  );
}
