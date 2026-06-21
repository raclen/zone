import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    // 基础信息
    title: z.string(),
    description: z.string().optional(),

    // 时间戳
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),

    // GitHub 元数据
    issueNumber: z.number(),
    issueUrl: z.string().url(),

    // 分类标签
    tags: z.array(z.string()).default([]),

    // 作者信息
    author: z.object({
      name: z.string(),
      avatar: z.string().url().optional(),
    }).default({ name: 'Anhe' }),

    // 状态
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
