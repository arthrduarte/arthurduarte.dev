export interface TimelineItem {
  text: string;
  emphasis?: "bold" | "italic";
  link?: string;
}

export interface TimelineEntry {
  date: string;
  items: TimelineItem[];
  images?: string[];
}

const timelineEntries: TimelineEntry[] = [
  {
    date: "December 16, 2025",
    items: [
      {
        text: "Created v1 of this website.",
      },
    ],
  },
  {
    date: "December 14, 2025",
    items: [
      {
        text: "Started my ",
      },
      {
        text: "list of lists.",
        link: "/list-of-lists",
      },
      {
        text: "I have been saving so many different links, resources, articles, videos, and internet stuff for years now. Unfortunately I've lost 2 Twitter accounts and a Facebook account, which I'm sure contained a lot of this stuff. So from now on I'll be collecting the best piece of content I consume and sharing it here. ",
      },
      {
        text: "(Inspired by this tweet)",
        link: "https://x.com/simonsarris/status/2000215694147821921"
      },
    ],
  },
  {
    date: "September 31, 2025",
    items: [
      {
        text: "Started a new project for the landscaping industry with a friend. Not public yet."
      },
    ],
  },
  {
    date: "August 1, 2025",
    items: [
      {
        text: "After two years in Canada, I've moved into my fourth home here. I'm really excited for this next chapter."
      },
    ],
  },
  {
    date: "July 10, 2025",
    items: [
      {
        text: "Over 120 years ago, a crazy 18 year old moved from Castellabate, Italy, to Porto Alegre, Brazil, and built a family there. My dad spent 10 years correcting birth certificates, translating documents from IT to PT, sending updates to a judge, searching for records and now we finally have our italian passports. Thanks dad and Francesco Paolo."
      },
    ],
    images: [
      "/timeline/italiano.jpg",
    ],
  },
  {
    date: "July 5, 2025",
    items: [
      {
        text: "Gave a talk at the \"Eh I\" Summer Vibe Hackathon (Ottawa - July). I was really locked in with my mobile app "
      },
      {
        text: "Farelo.",
        link: "/projects/farelo",
      },
    ],
  },
  {
    date: "July 5, 2025",
    items: [
      {
        text: "The talk was about normal people making money with mobile apps. "
      },
      {
        text: "You can watch it here.",
        link: "https://www.youtube.com/watch?v=0S27A9eAmU8&feature=youtu.be",
      },
    ],
    images: [
      "/timeline/talk.png",
    ],
  },
  {
    date: "June 25, 2025",
    items: [
      {
        text: "Invite me to events in the US. Now I have a visitor visa 😎"
      },
    ],
  },
  {
    date: "June 21, 2025",
    items: [
      {
        text: "Started a new role as a Forward Deployed Engineer at Franchise Frameworks. We're building the growth engine for franchise brands in the US."
      },
    ],
  },
  {
    date: "June 17, 2025",
    items: [
      {
        text: "Graduated 🧑🏼‍🎓! After 2 years (well, 1 and a half), I can confidently say: you will learn more by building stuff on your own than you will by studying to exams. Go to college, have fun, meet new people, build side projects and do the bare minimum to pass."
      },
    ],
    images: [
      "/timeline/graduation.jpeg",
      "/timeline/post-grad.jpg",
    ],
  },
  {
    date: "April 19, 2025",
    items: [
      {
        text: "My contract with Quest (where I was building Maximo, the AI Executive Coach) wasn't renewed."
      },
    ],
  },
  {
    date: "April 16, 2025",
    items: [
      {
        text: "Started a new project called Farelo and decided to put all my energy into it. Initially the idea was to make money with the app, but I quickly pivoted to building the app solely for having something to post and talk about with people. Meeting someone new and pulling up my phone to show the app was always a great ice breaker. Farelo was great and led me to a lot of great conversations, but never went anywhere."
      },
    ],
  },
  {
    date: "February 9, 2025",
    items: [
      {
        text: "Started to build Maximo, the AI Executive Coach. Maximo was awesome. Even though I only worked on it for a few months, I was getting paid to build a completely new technology using modern technologies - ElevenLabs, Cursor, Supabase, Express and Twilio. I literally felt like every single day a new breakthrough was showing up in the AI voice world and Maximo was always benefiting from it."
      },
    ],
  },
  {
    date: "January 09, 2025",
    items: [
      {
        text: "Registered my sole proprietorship company: Arthurian Lab."
      },
    ],
  },
  {
    date: "November 13, 2024",
    items: [
      {
        text: "Volunteered at Saas North with Vignesh! Such a great experience. Got to meet lots of cool folks volunteering and building cool stuff."
      },
    ],
    images: [
      "/timeline/saas-north.jpg",
    ],
  },
  {
    date: "November 10, 2024",
    items: [
      {
        text: "Signed a contract with Quest to basically build cool things with AI and see where it goes."
      },
    ],
  },
  {
    date: "November 8, 2024",
    items: [
      {
        text: "Attended TiEcon Canada 2024. In this event I met Hai (founder of AGI Ventures Canada) for the first time and I remember asking him \"If AI can do everything, how can one get into the job market?\" He said \"Companies don't ower you anything.\" I've been thinking about this ever since.",
      },
    ],
  },
  {
    date: "November 8, 2024",
    items: [
      {
        text: "At TiEcon I also met the founder of Quest, who invited me to join him and build cool things with AI.",
      },
    ],
    images: [
      "/timeline/tiecon.jpg",
    ],
  },
  {
    date: "October 8, 2024",
    items: [
      {
        text: "Started a new role as Assistant Store Manager at Maverick Volleyball Club. I'm called when something breaks or needs to be fixed in Shopify and Quickbooks.",
      },
    ],
  },
  {
    date: "October 7, 2024",
    items: [
      {
        text: "Got a job as as server at a retirement home. Hated every second of it. Quit the next day.",
      },
    ],
  },
  {
    date: "June 1, 2024",
    items: [
      {
        text: "Turning point in my life: I paid BRL$3,000 to join a community of Brazilian developers called Base from Borderless Coding. Full of guys who had the same dream as me and were equally invested in becoming successful developers.",
      },
    ],
  },
  {
    date: "June 1, 2024",
    items: [
      {
        text: "This was a hard decision to make for a few reasons: 1. It was quite a lot of money at the time 2. I was still in school and the tuition was extremely high. Here's the reason I decided to pay for it anyways: I didn't learn anything useful in school and had to learn somewhere else. Today I'd recommend everyone to join this community if you are in the same position as I was in 2024, after spending a lot of time in school and not learning anything useful.",
      },
    ],
  },
  {
    date: "February 9, 2024",
    items: [
      {
        text: "Got my first job in Canada as a server at a convention center. Long hours covering cerimonies and events. Also met some of my closest friends at this place.",
      },
    ],
  },
  {
    date: "February 9, 2024",
    items: [
      {
        text: "Looking back I'm extremely grateful for this job. Got me to see a new part of the working word that I wouldn't have otherwise, which gives me a different perspective about tech roles and office jobs in general.",
      },
    ],
  },
  {
    date: "January 27, 2024",
    items: [
      {
        text: "Became an active member of the International Peer Mentorship Program at Algonquin College, helping new international students settle in Ottawa. Basically passing forward the same advices and help I received when I was a new student.",
      },
    ],
    images: [
      "/timeline/ipm.jpg",
    ],
  },
  {
    date: "January 27, 2024",
    items: [
      {
        text: "Met great folks who became some of my closest friends during this time in college.",
      },
    ],
  },
  {
    date: "September 5, 2023",
    items: [
      {
        text: "First day at Algonquin College.",
      },
    ],
  },
  {
    date: "August 31, 2023",
    items: [
      {
        text: "Moved to Canada at 18 years old. No friends, no family. Definitely among the top 3 most difficult thing I've ever done, but it was a life-changing experience. How many teenagers do you know who took the opportunity to cross the ocean and start life in a new country? ",
      },
    ],
  },
  {
    date: "August 31, 2023",
    items: [
      {
        text: "I like to think of this moment as the beginning of my life. When I realized there was much more to life than the bubble I was born into.",
      },
    ],
  },
];

export default timelineEntries;

