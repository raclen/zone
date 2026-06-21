import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import config from "@/config";

export const BLOG_PATH = "src/content/blog";

const authorSchema = z
  .union([
    z.string(),
    z.object({
      name: z.string(),
      avatar: z.string().url().optional(),
    }),
  ])
  .default({ name: config.site.author });

const baseBlogSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  issueNumber: z.number().optional(),
  issueUrl: z.string().url().optional(),
  tags: z.array(z.string()).default([]),
  author: authorSchema,
  draft: z.boolean().default(false),
});

const posts = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${BLOG_PATH}` }),
  schema: baseBlogSchema.transform(data => {
    const description =
      data.description
        ?.replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 180) || data.title;

    return {
      ...data,
      author: typeof data.author === "string" ? data.author : data.author.name,
      pubDatetime: data.pubDate,
      modDatetime: data.updatedDate ?? null,
      description,
      tags: data.tags.length > 0 ? data.tags : ["随笔"],
    };
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${BLOG_PATH}` }),
  schema: baseBlogSchema,
});

export const collections = { posts, blog };
