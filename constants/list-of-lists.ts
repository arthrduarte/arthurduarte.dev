export interface Resource {
  title: string;
  url?: string;
  reason?: string;
  hover?: string;
}

export interface Category {
  name: string;
  links: Resource[];
}

const categories: Category[] = [
  {
    name: "Fitness",
    links: [
      { title: "3 Day Workout Plan With Kettlebells and Bodyweight Only", url: "https://www.youtube.com/@bodyweightkettlebells", },
      {
        title: "Natural Hypertrophy",
        url: "https://www.youtube.com/@NaturalHypertrophy/videos",
        reason: "I've been watching NH for quite a long time now. No idea how I first discovered his channel, but his work tremendously changed my perspective on fitness and philosophy. See... I don't know much about this guy's life, and he tries to tells us as little as possible about himself and he focus 100% on the core message of his content.\nWatching his channel you'll find a lot about training and philosophy. No diet, no politics, no bullshit. Just a lot of good information for people training naturally and a lot of good philosophy."

      },
      { title: "Enter the Kettlebell - Pavel Tsatsouline", url: "https://www.youtube.com/@railander" },
      { title: "How I Went From 496 to 807 Testosterone in 3 Months", url: "https://www.youtube.com/@tylermeinhold", hover: "Straight to the point on what to do to increase your testosterone levels naturally." },
      { title: "Joe Rogan Discusses Power of Jump Rope", url: "https://www.youtube.com/@JumpRopeDudes" },
      { title: "Best Rings Workout - 25+ exercises beginner to advanced", url: "https://www.youtube.com/@AbnormalBeings" },
    ]
  },
  {
    name: "Business",
    links: [
      { 
        title: "Social Growth Engineers", 
        url: "https://www.socialgrowthengineers.com/", 
        reason: "These guys were such a great resource when I was first launching my mobile app Farelo. The team is actually pretty active on X and are always posting stuff - def worth checking them out." 
      }, 
      { title: "Karlton Dennis on government's legal playbook on how to pay the least amount of taxes possible", url: "https://www.tiktok.com/@theschoolofhardknocks/video/7371871423247224106?lang=en" },
      {
        title: "The Golden Path to the R$20k/month (for devs)",
        url: "https://igor.marcossi.com/caminho-dourado",
        reason: "Great guide. Igor used to be super active in a brazilian indie hackers community on Discord and a random day I remember seeing this link. It really reasoned with me and I quite often think about it."
      },
      { title: "GymShark CEO on Modern Wisdom podcast", url: "https://youtu.be/QfKwidYQW6M?si=6_jUyUjnmcgqP749" },
      { title: "Great Reads", url: "https://drive.google.com/drive/folders/1eZreo356E7qq5RAgc1ynMsRSlPfmQ58X", hover: "got this from a random guy on X" },
      { title: "How-To-Succeed-At-MrBeast-Production", url: "https://drive.google.com/file/d/1YaG9xpu-WQKBPUi8yQ4HaDYQLUSa7Y3J/view" },
      { title: "Stupid simple resume format", url: "https://gist.github.com/LukeberryPi/b52d2a5715fa3ae2ee0b69c729dcc896", hover: "because sometimes your resume doesnt have to be fancy looking" },
      { title: "The Cold Email Handbook", url: "https://za-zu.com/docs/handbook/cold-email/intro" },
      { title: "Naval's \"How to Get Rich (without getting lucky)\" thread", url: "https://x.com/naval/status/1002103360646823936" },
      { title: "How to do marketing (If you are a Solopreneur who sucks at marketing)", url: "https://docs.google.com/document/d/e/2PACX-1vTFgkhHVLh2MVU05EIdV1feAFZXljeFbRZEvz24Sl3oSUR-m1VwMQlmlAV_n8B2WZQReGcKEwoFjput/pub" },
    ]
  },
  {
    name: "Faith",
    links: [
      { title: "Tack Room Bible Talk", url: "https://www.youtube.com/@TackRoomBibleTalk", reason: "Freaking love this guy, I originally discovered him through his other channel Dry Creek Wrangler School and eventually found out about this secondary channel where he discusses Christianism and the Bible itself. Great role model." },
      { title: "galleries to pull sacred art from", url: "https://x.com/luxangelae/status/1995947323030208612" },
      { title: "When You Don't Want to Serve God (But You Want to Want to)", url: "https://youtu.be/tJA-HgEgyL0?si=w-qVAdqBtPQAhcA6" },
      { title: "Coptic Tattoo Designs", url: "https://archive.org/details/coptictattoodesi0000cars/mode/2up" },
    ]
  },
  {
    name: "Design Engineering",
    links: [
      {
        title: "How do you craft animations that feel right?",
        url: "https://animations.dev/",
        reason: "Emil Kowalski is the guy who made my favorite shadcn component: sonner."
      },
      { title: "Devouring Details", url: "https://devouringdetails.com/" },
      { title: "Interactive SVG Animations", url: "https://www.svg.guide/" },
      { title: "UI Engineering 101 for Designers", url: "https://maven.com/pixeljanitor/uiengineering-101-for-designers" },
      { title: "Refactoring UI", url: "https://www.refactoringui.com/" },
      { title: "Vercel Design Guidelines", url: "https://vercel.com/design/guidelines" },
      { title: "Floguo", url: "https://www.floguo.com/notes/design-engineering" },
    ]
  },
  {
    name: "Software Engineering",
    links: [
      { title: "Prompt Engineering", url: "https://www.kaggle.com/whitepaper-prompt-engineering" },
      { title: "Student to Software Engineer", url: "https://student-to-software-engineer.org/docs/introduction/" },
    ]
  },
  {
    name: "Social Life",
    links: [
      { title: "Become dangerously charismatic", url: "https://www.youtube.com/@JackhopkinsCEO" },
      { title: "how to build a social life from scratch", url: "https://x.com/adele_bloch/status/1998656679756304628" },
      { title: "How to start a serious men's group", url: "https://x.com/cimmerian_v/status/1463182982135500806" },
      { title: "A guide to elevated men's groups", url: "https://open.substack.com/pub/rwbb/p/a-guide-to-elevated-mens-groups?utm_campaign=post-expanded-share&utm_medium=web" },
      { title: "How to host your first house party", url: "https://x.com/nickgraynews/status/1997814999851389249" },
      { title: "The 2-Hour Cocktail Party", url: "https://party.pro/book-readnow/" },
      { title: "Life is a videogame", url: "https://x.com/rawknuckle/status/1898523445496889456?s=20" },
    ]
  },
  {
    name: "Social Media",
    links: [
      { title: "Building an audience through Twitter", url: "https://x.com/justinskycak/status/1997838616945426617" },
      { title: "growing from 0 to 10k followers on twitter in 8 months", url: "https://x.com/jia_seed/status/1958309750539768319" },
    ]
  },
  {
    name: "Self Improvement",
    links: [
      { title: "How to Start a Dopamine Detox", url: "https://www.youtube.com/watch?v=yNP7mdt0FvI" },
      { title: "Everything Starts with a Note-taking System", url: "https://youtu.be/Xw3SkhB4dMk?si=oeo7krARnQmhXVpR" },
      { title: "Brio", url: "https://youtu.be/TRPBY_lxJfE?si=5ELyOGji1He-uD7a" },
      { title: "How To Focus For 12 Hours A Day On Your Purpose", url: "https://thedankoe.com/letters/how-to-focus-for-12-hours-a-day-on-your-purpose/?kuid=65623ebc-bf3c-4a45-906d-e24bc51a5aef&lid=142091" },
      { title: "Self-improvement September 1", url: "https://www.youtube.com/watch?v=U6WWL54IkSg" },
      { title: "Self-improvement September 2", url: "https://www.youtube.com/watch?v=4V0c6F5GARI" },
      { title: "Self-improvement September 3", url: "https://www.youtube.com/watch?v=XH6S_msyZ5E" },
      { title: "Self-improvement September 4", url: "https://www.youtube.com/watch?v=Xr3E0GRFVpE" },
      { title: "How to bend reality", url: "https://youtu.be/gTpXXrOQFNI?si=xhGuN5KDufenEq7L" },
      { title: "Greg Isenberg on \"how to win in your 20s\"", url: "https://x.com/gregisenberg/status/1977805435874029585" },
      { title: "focus on gut health for social dominance", url: "https://scholar.google.ca/scholar?hl=en&as_sdt=0%2C5&q=social+dominance%2C+gut+microbiome&btnG=" },
    ]
  },
  {
    name: "Relationships",
    links: [
      { title: "Charles Darwin on Marriage", url: "https://www.darwinproject.ac.uk/tags/about-darwin/family-life/darwin-marriage#" },
      { title: "Cheat code: The Secret Language of Birthdays", url: "https://x.com/CaudilloNuclear/status/1990851627004117383" },
    ]
  },
  {
    name: "Philosophy",
    links: [
      { title: "Os circuitos de consagração social", url: "https://youtu.be/DeTAKz5Rt28?si=La8LYg2Zg-nuSYwN" },
      { title: "Bruce Lee about life", url: "https://youtu.be/nzQWYHHqvIw?si=N-KiVvuqpOHITapw" },
      { title: "Democracy is a scam and I can prove it", url: "https://youtu.be/D2YiI4ebIuE?si=bvS2N4JLj6lfbu5b" },
      { title: "Brasil: Nivelado por Baixo", url: "https://youtu.be/RCOxk3OpC1A?si=JAucID2BY9VdlG1j" },
    ]
  },
  {
    name: "Books",
    links: [
      { title: "A Library to Build Great Americans, Ages 3-99+", url: "https://educatedandfree.substack.com/p/a-library-to-build-great-americans?r=b8lae" },
      { title: "Livros em domínio público", url: "https://www.baixelivros.com.br/dominio-publico" },
      { title: "Public domain books", url: "https://gutenberg.org/ebooks/categories" },
    ]
  },
  {
    name: "Other",
    links: [
      { title: "How negation works in French", url: "https://www.reddit.com/r/French/comments/s985fz/a_little_guide_to_how_the_negation_works_ne_pas/" },
    ]
  },
];

export default categories;