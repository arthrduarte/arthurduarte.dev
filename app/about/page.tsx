export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-3">
          About Me
        </h1>
      </div>

      <div className="space-y-6 text-gray-700 leading-relaxed">
        <p className="font-bold">
          My Story
        </p>

        <p>
          I'm a software engineer from Brazil who moved to Canada alone at 18. No family, no friends, no plan B. Just me and the belief that I could figure anything out.
        </p>

        <p>
          That move was fundamental. It taught me that real growth comes from doing hard things. No shortcuts. No excuses.
        </p>

        <p className="font-bold">
          What I Do Now
        </p>

        <p>
          I'm a Forward Deployed Engineer at Franchise Frameworks, building the growth engine for franchise brands - and quite literally revolutionizing the industry in the US. I also run Arthurian Lab, my sole proprietorship for freelance work and personal projects.
        </p>

        <p className="font-bold">
          What I Care About
        </p>

        <p>
          Discipline matters. My bio everywhere is "the mind controls the body" and I mean it. I care about the basics: keeping my space clean, growing plants, cooking good food, staying fit. These aren't boring things, in fact they're green flags. They're how you build a life.
        </p>

        <p>
          Building in public beats hiding. I don't spam 100 job applications. I build real things and show them to people. That's way more powerful. I've gotten multiple messages from people offering me opportunities simply because I built an app and shared it with people.
        </p>

        <div className="pt-6 mt-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Get in touch
          </h2>
          <p>
            Feel free to reach out via{" "}
            <a
              href="mailto:tuiduarte@gmail.com"
              className="text-primary hover:underline"
            >
              email
            </a>
            , or connect with me on{" "}
            <a
              href="https://x.com/arthrduarte"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              X
            </a>
            {" "}or{" "}
            <a
              href="https://linkedin.com/in/arthrduarte/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              LinkedIn
            </a>
            . Always happy to chat.
          </p>
        </div>

        <div className="pt-6 mt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">Written by Claude after a web search</p>
        </div>
      </div>
    </div>
  );
}

