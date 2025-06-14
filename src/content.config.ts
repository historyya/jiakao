import { defineCollection, z } from "astro:content";
import { glob, file } from "astro/loaders";

const subject = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/subject",
  }),
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
  }),
});

export const collections = { subject };
