import { describe, expect, it } from "vitest";

import nextConfig from "@/next.config";

describe("next redirects", () => {
  it("redirects /list-of-lists to /archive", async () => {
    const redirects = await nextConfig.redirects?.();

    expect(redirects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source: "/list-of-lists",
          destination: "/archive",
          permanent: true,
        }),
      ]),
    );
  });
});
