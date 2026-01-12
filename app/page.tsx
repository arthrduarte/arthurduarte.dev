import Image from "next/image";
import { Mail } from "lucide-react";
import Link from "next/link";
import projects from "@/constants/projects";

const XIcon = () => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor">
    <path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const YouTubeIcon = () => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

const socials = [
  { name: "X", href: "https://x.com/arthrduarte", icon: "x" },
  { name: "LinkedIn", href: "https://linkedin.com/in/arthrduarte/", icon: "linkedin" },
  { name: "YouTube", href: "https://youtube.com/@arthrduarte", icon: "youtube" },
  { name: "GitHub", href: "https://github.com/arthrduarte", icon: "github" },
  { name: "Email", href: "mailto:tuiduarte@gmail.com", icon: "mail" },
];

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto p-8 space-y-12">
      {/* Hero Section */}
      <section className="flex flex-col items-start gap-6">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold mb-1 hover:text-primary transition-colors">
                Arthur Duarte
              </h1>
              <div className="flex gap-2">
                {socials.map((social) => (
                  <Link 
                    href={social.href} 
                    key={social.name}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110"
                    aria-label={social.name}
                  >
                    {social.icon === "mail" && <Mail className="h-4 w-4" />}
                    {social.icon === "x" && <XIcon />}
                    {social.icon === "linkedin" && <LinkedInIcon />}
                    {social.icon === "youtube" && <YouTubeIcon />}
                    {social.icon === "github" && <GitHubIcon />}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Image 
            src="/arthur.jpg" 
            alt="Arthur Duarte" 
            width={56} 
            height={56} 
            className="rounded-lg" 
          />
        </div>
        
        <div className="space-y-1 text-foreground text-sm">
          <div className="flex items-start gap-2 -mx-2 px-2 py-1 rounded-sm hover:bg-stone-800/80 transition-colors">
            <span className="text-primary font-mono">&gt;</span>
            <p>Moved to a new country alone at 18</p>
          </div>
          <div className="flex items-start gap-2 -mx-2 px-2 py-1 rounded-sm hover:bg-stone-800/80 transition-colors">
            <span className="text-primary font-mono">&gt;</span>
            <p>Full-time B2B SaaS developing for the franchise industry</p>
          </div>
          <div className="flex items-start gap-2 -mx-2 px-2 py-1 rounded-sm hover:bg-stone-800/80 transition-colors">
            <span className="text-primary font-mono">&gt;</span>
            <p>Part-time B2C apps builder</p>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section>
        <h2 className="text-sm font-semibold mb-3">
          Projects
        </h2>
        <div className="gap-2">
          {projects.map((project) => (
            <Link 
              href={project.links?.website || project.links?.github || project.links?.linkedin || "/projects"} 
              key={project.name}
              target="_blank"
              rel="noopener noreferrer"
              className="flex font-medium text-sm text-stone-400 hover:text-stone-100 hover:bg-stone-800/80 rounded-sm transition-colors -mx-2 px-2 py-1"
            >
              {project.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Writings Section */}
      <section>
        <h2 className="text-sm font-semibold mb-3">
          Writing
        </h2>
        <div className="space-y-1">
          <Link 
            href="/list-of-lists" 
            className="flex font-medium text-sm text-stone-400 hover:text-stone-100 hover:bg-stone-800/80 rounded-sm transition-colors -mx-2 px-2 py-1"
          >
            List of Lists
          </Link>
        </div>
      </section>

      {/* 12x12 Section */}
      <section>
        <h2 className="text-sm font-semibold mb-3">
          12 Projects in 12 Months
        </h2>
        <div className="space-y-1">
          <Link 
            href="/12x12/report-1" 
            className="flex font-medium text-sm text-stone-400 hover:text-stone-100 hover:bg-stone-800/80 rounded-sm transition-colors -mx-2 px-2 py-1"
          >
            Report 1
          </Link>
        </div>
      </section>
    </div>
  )
}