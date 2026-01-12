import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

export default function Report1Page() {
  return (
    <div className="max-w-2xl mx-auto p-8 space-y-12">
      <div className="space-y-4">
        <Link 
          href="/" 
          className="flex items-center gap-2 font-medium text-sm text-stone-400 hover:text-stone-100 hover:bg-stone-800/80 rounded-sm transition-colors -mx-2 px-2 py-1"
        >
          <ArrowLeftIcon className="h-4 w-4" /> Back to home
        </Link>
        
        <h1 className="text-2xl font-semibold">
          12x12 report 1
        </h1>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">
          What I built
        </h2>
        <div className="space-y-3 text-sm text-stone-300 leading-relaxed">
          <p>
            I&apos;ve been working on my new app called{' '}
            <a
              href="https://finish-line.app/"
              className="underline text-primary hover:text-primary/80 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Finish Line
            </a>
            {' '} - Stop Quitting.
          </p>
          <p>
            This app is my attempt to stop quitting.
          </p>
          <p>
            I&apos;ve been a notorious quitter for the last 5 years of my life - from playing Counter Strike tournaments to business ideas, I have never been able to finish anything meaningful in my life because I simply get too damn bored.
          </p>
          <p>
            So I came up with the idea of doing the &quot;12 startups in 12 months&quot; - but <em>projects</em> instead of <em>startups</em>.
          </p>
          <p>
            Instead of spending months building one idea and getting extremely attached to it (like I did with <a href="https://usefarelo.com/" className="underline text-primary hover:text-primary/80 transition-colors" target="_blank" rel="noopener noreferrer">Farelo</a> in 2025), this year I decided to try multiple things:
          </p>
          <ul className="list-none space-y-2 ml-4">
            <li className="flex items-start gap-2">
              <span className="text-primary font-mono mt-0.5">&gt;</span>
              <span>Build a mobile B2C app</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-mono mt-0.5">&gt;</span>
              <span>Release a ChatGPT app</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-mono mt-0.5">&gt;</span>
              <span>Adventure into the Raspberry PI world</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-mono mt-0.5">&gt;</span>
              <span>Start a web B2B SaaS</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-mono mt-0.5">&gt;</span>
              <span>Contribute to open-source</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-mono mt-0.5">&gt;</span>
              <span>Publish a browser extension</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-mono mt-0.5">&gt;</span>
              <span>and others</span>
            </li>
          </ul>
          <p>
            And my first project idea is <a href="https://finish-line.app/" className="underline text-primary hover:text-primary/80 transition-colors" target="_blank" rel="noopener noreferrer">Finish Line</a>, a mobile app that helps you focus in ONE task instead of trying multiple things at once.
          </p>
          <p>
            See how it connects with my problem?
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">
          The last 10 days
        </h2>
        <div className="space-y-3 text-sm text-stone-300 leading-relaxed">
          <p>
            I came up with the 12x12 idea around Christmas when doing my goals-setting for 2026.
          </p>
          <p>
            Then in 2 days I came up with a few concepts and realized I had too many ideas.
          </p>
          <p>
            Ends up I was washing the dishes and listening to <a href="https://www.youtube.com/watch?v=AY4R2p2i8nM&t=2s" className="underline text-primary hover:text-primary/80 transition-colors" target="_blank" rel="noopener noreferrer">Whop&apos;s podcast with the QUITTR team</a> and realized I could modelate their app into a different niche.
          </p>
          <p>
            That&apos;s when I sat down and though &quot;If I have an issue with not being able to focus in one project, many others face the same problem&quot;.
          </p>
          <p>
            Had a chat with claude.ai, did some research on the best ways to prevent idea surfing, and hammered an extremely lean MVP. The &quot;lean MVP&quot; had actually 3 features, but as I built the app I decided to release it with only one.
          </p>
          <p>
            And it worked! Today (the 11th) I submitted it for review!!! 🥳
          </p>
          <p>
            In 2 weeks I went from idea research to app submission.
          </p>
          <p>
            Crazy quick considering the process with my first mobile app Farelo - if you&apos;ve been following me for the last year, you might remember how much trouble I had with it.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">
          Key learning
        </h2>
        <div className="space-y-3 text-sm text-stone-300 leading-relaxed">
          <p>
            The problem with Farelo was simple: too many features.
          </p>
          <p>
            The app did sooooo many things at once and when I sent the app to review there would always be something to update.
          </p>
          <p>
            I&apos;d say I learned my lesson. Hence why I completely flipped the approach for <a href="https://finish-line.app/" className="underline text-primary hover:text-primary/80 transition-colors" target="_blank" rel="noopener noreferrer">Finish Line</a> and decided to scrap all features, build one, submit for review and then iterate and build more stuff.
          </p>
          <p>
            Because what even is the point of building and building and building and building if your app has no users? LOL
          </p>
          <p>
            But probably the biggest key learning here is that I don&apos;t want to build mobile apps. There are just too many screens, operational systems (well it&apos;s only 2 but then that means you have to test on both), waiting time, etc. With a web app life is so easy and everything just... works?
          </p>
          <p>
            Another learning is to not wait to create tiktok/instagram accounts. As soon as you start coding the project go ahead and 1. buy a domain 2. put up a landing page with waitlist 3. create an email address 4. set tiktok/instagram profiles with the email and start posting from day 1 lol
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">
          What I&apos;d do differently next time
        </h2>
        <div className="space-y-3 text-sm text-stone-300 leading-relaxed">
          <ol className="list-none space-y-3 ml-4">
            <li className="flex items-start gap-3">
              <span className="text-primary font-mono mt-0.5 shrink-0">1.</span>
              <span>
                Don&apos;t fixate on a keyboard issues. If the keyboard isn&apos;t behaving as expected in design 1, just ask the AI to implement the same feature in a different design. In fact just ask the AI to create 3 designs for the same feature and then decide which one is worth keeping.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-mono mt-0.5 shrink-0">2.</span>
              <span>
                I procrastinated the Android submission for 3 days because of the &quot;12 testers&quot; step. With Apple you can just submit the app for review, but for Android you must have 12 people opted in for 14 days to launch the app. So next time I&apos;ll do this step as early as possible so that the 14 days pass by earlier.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-mono mt-0.5 shrink-0">3.</span>
              <span>
                Don&apos;t post two short-videos on the same day. I created the account and 6 days later I posted 3 videos in less than 24h and my views went super down.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-mono mt-0.5 shrink-0">4.</span>
              <span>
                I should have documented the steps in short-form video with my face like MaxBlade says
              </span>
            </li>
          </ol>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">
          What&apos;s next
        </h2>
        <div className="space-y-3 text-sm text-stone-300 leading-relaxed">
          <p>
            Well now there&apos;s nothing much I can do except waiting for App Store review
          </p>
          <p>
            I&apos;ll keep posting tiktoks and reels and building the other features I decided to keep out of the initial MVP!
          </p>
        </div>
      </section>
    </div>
  );
}
