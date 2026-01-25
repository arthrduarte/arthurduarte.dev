import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

export default function Report2Page() {
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
          12x12 report 2
        </h1>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">
          What happened
        </h2>
        <div className="space-y-3 text-sm text-stone-300 leading-relaxed">
          <p>
            Finish Line was a flop.
          </p>
          <p>
            There. I said it.
          </p>
          <p>
            Everyone on X talks about how easy it is to launch a B2C mobile app and make money, but I've found it to be quite the opposite.
          </p>
          <p>
            Finish Line wasn't the most appealing product in the block, that's a fact, and I do think I could've put some more love into its design/code - but that'd require more time.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">
          The marketing struggle
        </h2>
        <div className="space-y-3 text-sm text-stone-300 leading-relaxed">
          <p>
            Anyways, we all know the B2C playbook: <strong>post short-form content to blow up on Tiktok/Reels</strong> butttt this didn't work for Finish Line!
          </p>
          <p>
            I aimed for a "David Goggins" discipline niche and my views literally tanked at 700. Not a single video went higher than 800. And I think I know why.
          </p>
          <p>
            I didn't iterate enough.
          </p>
          <p>
            The first week I posted a bunch of different formats, and all got 100-300 views. This means one thing: terrible video, do better. So I kept iterating, until I found a slideshow format that got me 700 views.
          </p>
          <p>
            I thought I had hit jackpot by finding a "good" format so early on, so I doubled down on it.
          </p>
          <p>
            Suddenly I was posting that format every day! Then I found out how to automate the slideshow creation using Claude Code and I started posting twice a day! Then three times a day!
          </p>
          <p>
            But the views didn't go up.
          </p>
          <p>
            So I tried videos!
          </p>
          <p>
            Didn't work, 100 views.
          </p>
          <p>
            So I went back to slideshows with a different angle and images. Also didn't break the 700 views wall.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">
          Moving on
        </h2>
        <div className="space-y-3 text-sm text-stone-300 leading-relaxed">
          <p>
            Unfortunately I'm benching Finish Line and I'm not going to continue with it.
          </p>
          <p>
            And that's ok, after all that's what the 12x12 is all about.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">
          What's next?
        </h2>
        <div className="space-y-3 text-sm text-stone-300 leading-relaxed">
          <p>
            Well I decided to not go into February alone, so I got a buddy of mine from Brazil to work with me for the next project.
          </p>
          <p>
            Same approach as Finish Line: if there's zero signs of traction at all in 30 days we'll just move on and toss that project in the trash.
          </p>
          <p>
            BUT there's a twist this time - we're not building anything before having sales or people interested in the product.
          </p>
          <p>
            In February we're gonna be building an end-to-end quoting system for the trades, and after attending a Clay workshop I realized we can definitely find those people.
          </p>
          <p>
            We're calling it <strong>Alicerce</strong> - meaning <em>Foundation</em> in portuguese.
          </p>
          <p>
            With Alicerce our goal is to help businesses in the trades to streamline their operations. This is my first time doing three things: building for B2B, getting customers before having a product, and having a co-founder.
          </p>
          <p>
            Let's see what God's plans are for Alicerce.
          </p>
        </div>
      </section>
    </div>
  );
}
