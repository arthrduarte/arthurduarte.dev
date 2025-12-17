import projects from "@/constants/projects";
import { Linkedin, Github, Globe } from "lucide-react";

export default function ProjectsPage() {
  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-3">
          Projects
        </h1>
        <p className="text-lg text-gray-600">
          Things I've built and worked on over the years.
        </p>
      </div>

      <div className="space-y-8">
        {projects.map((project, index) => (
          <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
            <div className="flex items-baseline gap-3 mb-2">
              {/* {project.emoji && (
                <span className="text-2xl leading-none">
                  {project.emoji}
                </span>
              )} */}
              <h2 className="text-2xl font-semibold text-gray-900">
                {project.name}
              </h2>
              <span className="text-sm text-gray-500">
                {project.year}
              </span>
              {project.status && (
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    project.status === "active"
                      ? "bg-green-100 text-green-700"
                      : project.status === "hackathon"
                      ? "bg-yellow-100 text-yellow-700"
                      : project.status === "completed"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {project.status}
                </span>
              )}
            </div>
            <p className="text-gray-700 leading-relaxed">
              {project.description}
            </p>
            {project.links && (
              <div className="flex items-center gap-3 mt-3 opacity-25">
                {project.links.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-primary transition-colors"
                    aria-label="GitHub"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                )}
                {project.links.linkedin && (
                  <a
                    href={project.links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-primary transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
                {project.links.website && (
                  <a
                    href={project.links.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-primary transition-colors"
                    aria-label="Website"
                  >
                    <Globe className="h-5 w-5" />
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

