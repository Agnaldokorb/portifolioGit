import { slugify } from "./utils";

describe("slugify", () => {
  it("normalizes text for public project URLs", () => {
    expect(slugify("Portfolio Next.js + Supabase")).toBe(
      "portfolio-next-js-supabase",
    );
  });
});
