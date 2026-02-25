import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-family-tree",
});

export const metadata: Metadata = {
  title: "Arthur Duartes Family Tree",
  description: "Private family archive",
};

export default function FamilyLayout({ children }: { children: React.ReactNode }) {
  return (
    <section
      className={`${cormorant.variable} fixed inset-0 z-50 bg-[#F0EBD6] text-[#3A2E1F]`}
      style={{ fontFamily: "var(--font-family-tree)" }}
    >
      {children}
    </section>
  );
}