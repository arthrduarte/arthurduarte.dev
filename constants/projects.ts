export interface Project {
  name: string;
  emoji?: string;
  description: string;
  year: string;
  status?: "active" | "archived" | "completed" | "hackathon";
  links?: {
    github?: string;
    linkedin?: string;
    website?: string;
  };
}

const projects: Project[] = [
  {
    name: "Farelo",
    emoji: "🍪",
    description: "Strava for cooking. Farelo is a social cookbook, powered by AI and designed for home cooks.",
    year: "2025",
    status: "active",
    links: {
      website: "https://usefarelo.com",
      github: "https://github.com/arthrduarte/farelo-mobile",
      linkedin: "https://www.linkedin.com/posts/arthrduarte_my-app-just-went-live-on-the-app-store-activity-7349579600298999808-KkCE/"
    }
  },
  {
    name: "Vaza AI",
    emoji: "🌍",
    description: "Vaza uses AI to figure out exactly which visa you need and builds a step-by-step plan for your move. It basically handles all the confusing legal paperwork so you can just focus on starting your new life in a different country.",
    year: "2025",
    status: "hackathon",
    links: {
      website: "https://hb-02-2025-vaza.vercel.app/",
      github: "https://github.com/arthrduarte/vaza",
    }
  },
  {
    name: "Boardroom",
    emoji: "🏆",
    description: "Boardroom is a hackathon-winner AI-powered simulation platform for business discussions and decision-making.",
    year: "2025",
    status: "hackathon",
    links: {
      github: "https://github.com/arthrduarte/boardroom",
      linkedin: "https://www.linkedin.com/posts/arthrduarte_my-team-just-placed-1st-in-a-hackathon-activity-7318296533852950529-qsTA"
    }
  },
  {
    name: "Maximo",
    emoji: "🤖",
    description: "AI Executive Coach built with ElevenLabs, Cursor, Supabase, Express and Twilio. A voice-first AI product that evolved with the rapid advancements in AI voice technology.",
    year: "2025",
    status: "archived",
    links: {
      github: "https://github.com/arthrduarte/maximo",
      linkedin: "https://www.linkedin.com/posts/arthrduarte_i-built-an-ai-executive-coach-who-remembers-activity-7341666235635408900-mDG-/"
    }
  },
];

export default projects;

