import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";
import { sample } from "es-toolkit";
import themeConfig from "./theme.config";

const posts = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "src/posts",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.date().refine((date) => !Number.isNaN(date), {
      message: "Invalid date format",
    }),
    updated: z.date().optional(),
    tags: z.array(z.string()).optional(),
    categories: z.array(z.string()).optional(),
    draft: z.boolean().optional(),
    cover: z.string().default(() => {
      return sample(themeConfig.cover?.covers || []);
    }),
    sticky: z.boolean().optional(),
    link: z.string().optional(),
  }),
});

export const collections = {
  posts,
};
