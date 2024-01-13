// 1. Import utilities from `astro:content`
import { z, defineCollection } from 'astro:content';

// Define the allowed tag values using an enum
export enum Tag {
  SOFTWARE = 'software',
  LANGUAGE = 'language',
  BUSINESS = 'business',
}

// Define schemas for each collection we'd like to validate.
// We could define more content collections below if we'd like
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    fileName: z.string(),
    title: z.string(),
    pubDate: z.string(),
    description: z.string(),
    duration: z.number(),
    draft: z.boolean().optional(),
    tags: z.array(z.nativeEnum(Tag)).optional(),
    image: z.string().optional(),
    life: z.boolean().optional(),
  }),
});

// Define schemas for each collection we'd like to validate.
// We could define more content collections below if we'd like
const music = defineCollection({
  type: 'content',
  schema: z.object({
    fileName: z.string(),
    title: z.string(),
    pubDate: z.string(),
    description: z.string(),
    duration: z.number(),
    draft: z.boolean().optional(),
    tags: z.array(z.nativeEnum(Tag)).optional(),
    image: z.string().optional(),
  }),
});

// Export a single `collections` object to register our collection(s)
// This key should match your collection directory name in "src/content"
export const collections = {
  blog: blog,
  music: music,
};
