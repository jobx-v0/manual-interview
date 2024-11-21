"use client";
import { useEffect, useState } from "react";
import {
  ChevronRight,
  Github,
  Linkedin,
  Mail,
  Phone,
  GraduationCap,
  Code,
  Globe,
  Twitter,
  Award,
  Activity,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PersonalInformation {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  expected_salary: number;
}

interface Socials {
  github: string;
  linkedin: string;
  website: string;
  twitter: string;
}

interface Award {
  title: string;
}

interface Competition {
  id: string;
  name: string;
  description: string[];
  date: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  start_date: string;
  end_date: string;
  cgpa_or_percentage: number;
  description: string[];
}

interface Experience {
  company: string;
  position: string;
  start_date: string;
  end_date: string | null;
  yearsofexperience: number;
  description: string[];
  currently_working: boolean;
}

interface Project {
  id: string;
  name: string;
  description: string[];
  link: string;
  start_date: string;
  end_date: string;
}

interface Skill {
  skill_name: string;
  skill_proficiency: string;
}

interface PositionOfResponsibility {
  id: string;
  title: string;
  organization: string;
  start_date: string;
  end_date: string;
  description: string[];
}

interface Publication {
  id: string;
  name: string;
  link: string;
  date: string;
}

interface CandidateProfile {
  personal_information: PersonalInformation;
  socials: Socials;
  awards_and_achievements: string[];
  competitions: Competition[];
  courses: string[];
  education: Education[];
  experience: Experience[];
  extra_curricular_activities: string[];
  personal_projects: Project[];
  position_of_responsibility: PositionOfResponsibility[];
  publications: Publication[];
  skills: Skill[];
}

const CandidateProfile = () => {
  const [candidateProfile, setCandidateProfile] =
    useState<CandidateProfile | null>(null);

  // Fetch Candidate Profile from Backend
  const fetchCandidateProfile = async () => {
    try {
      const response = await fetch("http://localhost:8080/profile");
      const data: CandidateProfile = await response.json();
      setCandidateProfile(data);
    } catch (error) {
      console.error("Error fetching candidate profile:", error);
    }
  };

  useEffect(() => {
    fetchCandidateProfile();
  }, []);

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short", // Formats month as 'Jan', 'Feb', etc.
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage
                src="/placeholder.svg"
                alt={`${
                  candidateProfile?.personal_information?.first_name || "User"
                }'s avatar`}
              />
              <AvatarFallback>
                {candidateProfile
                  ? `${candidateProfile.personal_information.first_name[0]}${candidateProfile.personal_information.last_name[0]}`
                  : "UN"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">
                {candidateProfile?.personal_information?.first_name || "User"}{" "}
                {candidateProfile?.personal_information?.last_name || ""}
              </h3>
              <p className="text-sm text-muted-foreground">
                {candidateProfile?.personal_information?.email ||
                  "user@example.com"}
              </p>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="left"
          align="start"
          className="w-[450px] p-0"
        >
          <ScrollArea className="h-[600px]">
            {candidateProfile ? (
              <>
                <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16 border-2 border-white">
                      <AvatarImage
                        src="/placeholder.svg?height=64&width=64"
                        alt={`${candidateProfile.personal_information.first_name}`}
                      />
                      <AvatarFallback>
                        {candidateProfile.personal_information.first_name[0]}
                        {candidateProfile.personal_information.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-xl">
                        {candidateProfile.personal_information.first_name}{" "}
                        {candidateProfile.personal_information.last_name}
                      </h3>
                      <p className="text-sm opacity-90">Full Stack Developer</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <DropdownMenuLabel className="font-semibold text-lg">
                      Contact Information
                    </DropdownMenuLabel>
                    <div className="flex items-center space-x-2 cursor-default px-2 py-1">
                      <Mail className="h-4 w-4" />
                      <span>{candidateProfile.personal_information.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 cursor-default px-2 py-1">
                      <Phone className="h-4 w-4" />
                      <span>{candidateProfile.personal_information.phone}</span>
                    </div>
                  </div>

                  <DropdownMenuSeparator />

                  <div className="space-y-2">
                    <DropdownMenuLabel className="font-semibold text-lg">
                      Education
                    </DropdownMenuLabel>
                    {candidateProfile.education.map((edu) => (
                      <div
                        key={edu.id}
                        className="flex flex-col items-start cursor-default p-2"
                      >
                        <div className="font-medium">{edu.institution}</div>
                        <div className="text-sm text-muted-foreground">
                          {edu.degree} • {formatDate(edu.start_date)} to{" "}
                          {edu.end_date ? formatDate(edu.end_date) : "Present"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          CGPA: {edu.cgpa_or_percentage}
                        </div>
                        {edu.description.length > 0 && (
                          <ul className="text-sm text-muted-foreground">
                            {edu.description.map((desc, index) => (
                              <li key={index}>{desc}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>

                  <DropdownMenuSeparator />

                  <div className="space-y-2">
                    <DropdownMenuLabel className="font-semibold text-lg">
                      Experience
                    </DropdownMenuLabel>
                    {candidateProfile.experience.map((exp, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-start cursor-default p-2"
                      >
                        <div className="font-medium">{exp.company}</div>
                        <div className="text-sm text-muted-foreground">
                          {exp.position} • {formatDate(exp.start_date)} to{" "}
                          {exp.end_date ? formatDate(exp.end_date) : "Present"}
                        </div>
                        <ul className="text-sm text-muted-foreground">
                          {exp.description.map((desc, index) => (
                            <li key={index}>{desc}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <DropdownMenuSeparator />

                  <div className="space-y-2">
                    <DropdownMenuLabel className="font-semibold text-lg">
                      Skills
                    </DropdownMenuLabel>
                    <div className="flex flex-wrap gap-2">
                      {candidateProfile.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill.skill_name} ({skill.skill_proficiency})
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <DropdownMenuSeparator />

                  <div className="space-y-2">
                    <DropdownMenuLabel className="font-semibold text-lg">
                      Awards & Achievements
                    </DropdownMenuLabel>
                    {candidateProfile.awards_and_achievements.map(
                      (award, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 cursor-default px-2 py-1"
                        >
                          <Award className="h-4 w-4" />
                          <span>{award}</span>
                        </div>
                      )
                    )}
                  </div>

                  <DropdownMenuSeparator />

                  <div className="space-y-2">
                    <DropdownMenuLabel className="font-semibold text-lg">
                      Competitions
                    </DropdownMenuLabel>
                    {candidateProfile.competitions.map((competition) => (
                      <div
                        key={competition.id}
                        className="flex flex-col items-start cursor-default p-2"
                      >
                        <div className="font-medium">{competition.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(competition.date)}
                        </div>
                        <ul className="text-sm text-muted-foreground">
                          {competition.description.map((desc, index) => (
                            <li key={index}>{desc}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <DropdownMenuSeparator />

                  <div className="space-y-2">
                    <DropdownMenuLabel className="font-semibold text-lg">
                      Personal Projects
                    </DropdownMenuLabel>
                    {candidateProfile.personal_projects.map((project) => (
                      <div
                        key={project.id}
                        className="flex flex-col items-start cursor-default p-2"
                      >
                        <div className="font-medium">{project.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(project.start_date)} to{" "}
                          {formatDate(project.end_date)}
                        </div>
                        <ul className="text-sm text-muted-foreground">
                          {project.description.map((desc, index) => (
                            <li key={index}>{desc}</li>
                          ))}
                        </ul>
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Project Link
                        </a>
                      </div>
                    ))}
                  </div>

                  <DropdownMenuSeparator />

                  <div className="space-y-2">
                    <DropdownMenuLabel className="font-semibold text-lg">
                      Positions of Responsibility
                    </DropdownMenuLabel>
                    {candidateProfile.position_of_responsibility.map(
                      (position) => (
                        <div
                          key={position.id}
                          className="flex flex-col items-start cursor-default p-2"
                        >
                          <div className="font-medium">{position.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {position.organization} •{" "}
                            {formatDate(position.start_date)} to{" "}
                            {formatDate(position.end_date)}
                          </div>
                          <ul className="text-sm text-muted-foreground">
                            {position.description.map((desc, index) => (
                              <li key={index}>{desc}</li>
                            ))}
                          </ul>
                        </div>
                      )
                    )}
                  </div>

                  <DropdownMenuSeparator />

                  <div className="space-y-2">
                    <DropdownMenuLabel className="font-semibold text-lg">
                      Publications
                    </DropdownMenuLabel>
                    {candidateProfile.publications.map((publication) => (
                      <div
                        key={publication.id}
                        className="flex flex-col items-start cursor-default p-2"
                      >
                        <div className="font-medium">{publication.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(publication.date)}
                        </div>
                        <a
                          href={publication.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Publication Link
                        </a>
                      </div>
                    ))}
                  </div>

                  <DropdownMenuSeparator />

                  <div className="space-y-2">
                    <DropdownMenuLabel className="font-semibold text-lg">
                      Extra-curricular Activities
                    </DropdownMenuLabel>
                    {candidateProfile.extra_curricular_activities?.map(
                      (activity, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 cursor-default px-2 py-1"
                        >
                          <span>{activity}</span>
                        </div>
                      )
                    )}
                  </div>

                  <DropdownMenuSeparator />

                  <div className="space-y-2">
                    <DropdownMenuLabel className="font-semibold text-lg">
                      Socials
                    </DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      {candidateProfile.socials.github && (
                        <a
                          href={candidateProfile.socials.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center"
                        >
                          <Github className="inline-block mr-2 h-4 w-4" />
                          GitHub
                        </a>
                      )}
                      {candidateProfile.socials.linkedin && (
                        <a
                          href={candidateProfile.socials.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center"
                        >
                          <Linkedin className="inline-block mr-2 h-4 w-4" />
                          LinkedIn
                        </a>
                      )}
                      {candidateProfile.socials.website && (
                        <a
                          href={candidateProfile.socials.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center"
                        >
                          <Globe className="inline-block mr-2 h-4 w-4" />
                          Website
                        </a>
                      )}
                      {candidateProfile.socials.twitter && (
                        <a
                          href={candidateProfile.socials.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center"
                        >
                          <Twitter className="inline-block mr-2 h-4 w-4" />
                          Twitter
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-4">Loading...</div>
            )}
          </ScrollArea>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="flex items-center justify-center p-2 hover:bg-accent text-sm font-semibold">
              View Full Resume
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CandidateProfile;
