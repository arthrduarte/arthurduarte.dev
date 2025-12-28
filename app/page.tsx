import Image from "next/image";
import { Twitter, Linkedin, Youtube, Mail } from "lucide-react";
import Link from "next/link";
import projects from "@/constants/projects";

const socials = [
  { name: "X", href: "https://x.com/arthrduarte", icon: Twitter },
  { name: "LinkedIn", href: "https://linkedin.com/in/arthrduarte/", icon: Linkedin },
  { name: "YouTube", href: "https://youtube.com/@arthrduarte", icon: Youtube },
  { name: "Email", href: "mailto:tuiduarte@gmail.com", icon: Mail },
];

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto p-8 space-y-12">
      {/* Hero Section */}
      <section className="flex flex-col items-start gap-6">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                Arthur Duarte
              </h1>
              <div className="flex gap-1">
                {socials.map((social) => (
                  <Link 
                    href={social.href} 
                    key={social.name}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={social.name}
                  >
                    <social.icon className="h-4 w-4" />
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
          <div className="flex items-start gap-2">
            <span className="text-primary font-mono">&gt;</span>
            <p>Moved to a new country alone at 18</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-primary font-mono">&gt;</span>
            <p>Full-time B2B SaaS developing for the franchise industry</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-primary font-mono">&gt;</span>
            <p>Part-time B2C apps builder</p>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section>
        <h2 className="text-sm font-semibold text-gray-900 mb-3">
          Projects
        </h2>
        <div className="space-y-2">
          {projects.map((project) => (
            <Link 
              href={project.links?.website || project.links?.github || project.links?.linkedin || "/projects"} 
              key={project.name}
              target="_blank"
              rel="noopener noreferrer"
              className="block -mx-2 px-2 text-sm text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-sm transition-colors"
            >
              {project.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Writings Section */}
      <section>
        <h2 className="text-sm font-semibold text-gray-900 mb-3">
          Writing
        </h2>
        <div className="space-y-1">
          <Link 
            href="/list-of-lists" 
            className="block -mx-2 px-2 text-sm text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-sm transition-colors"
          >
            List of Lists
          </Link>
        </div>
      </section>
    </div>
  )
}