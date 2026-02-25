import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { familyData, getPersonById, formatLifeRange } from "@/lib/family-data";

export const dynamic = "force-static";
export const revalidate = false;

export function generateStaticParams() {
  return familyData.people.map((person) => ({ id: person.id }));
}

export default async function PersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const person = getPersonById(id);

  if (!person) {
    notFound();
  }

  return (
    <div className="h-full overflow-y-auto px-6 py-10 md:px-10">
      <div className="mx-auto w-full max-w-4xl">
        <Link
          href="/family"
          className="mb-8 inline-flex rounded-full border border-[#CE955E]/55 bg-[#FAF6ED] px-4 py-2 text-base hover:bg-[#F0EBD6]"
        >
          Back to Tree
        </Link>

        <section className="rounded-[36px] border border-[#CE955E]/50 bg-[#FAF6ED] p-8 md:p-12">
          <div className="mx-auto mb-8 w-fit rounded-full border-4 border-[#CE955E]/55 p-1">
            <Image
              src={person.portrait}
              alt={person.name}
              width={220}
              height={220}
              className="h-52 w-52 rounded-full object-cover"
              priority
            />
          </div>

          <h1 className="text-center text-5xl font-semibold tracking-wide">{person.name}</h1>
          <p className="mt-4 text-center text-xl text-[#5B4630]">{formatLifeRange(person)}</p>

          <div className="mt-10 space-y-5 text-lg leading-relaxed text-[#3A2E1F]">
            {person.bio.split("\n\n").map((paragraph, index) => (
              <p key={`${person.id}-bio-${index}`}>{paragraph}</p>
            ))}
          </div>

          {person.gallery.length > 0 ? (
            <section className="mt-12">
              <h2 className="mb-5 text-3xl font-semibold">Photo Gallery</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {person.gallery.map((photoPath, index) => (
                  <div
                    key={`${person.id}-gallery-${index}`}
                    className="overflow-hidden rounded-2xl border border-[#CE955E]/35"
                  >
                    <Image
                      src={photoPath}
                      alt={`${person.name} photo ${index + 1}`}
                      width={900}
                      height={1000}
                      className="h-72 w-full object-cover transition duration-300 hover:scale-[1.03]"
                    />
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {person.videos.length > 0 ? (
            <section className="mt-12">
              <h2 className="mb-5 text-3xl font-semibold">Videos</h2>
              <div className="space-y-4">
                {person.videos.map((videoPath, index) => (
                  <video
                    key={`${person.id}-video-${index}`}
                    src={videoPath}
                    controls
                    className="w-full rounded-2xl border border-[#CE955E]/35"
                  />
                ))}
              </div>
            </section>
          ) : null}
        </section>
      </div>
    </div>
  );
}