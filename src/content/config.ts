// 1. Import utilities from `astro:content`
import { z, defineCollection } from 'astro:content';

// Define the allowed tag values using an enum
// These should be unique enough so you can use them as CSS classes
export enum Tag {
  SOFTWARE = 'software',
  LANGUAGE = 'language',
  BUSINESS = 'business',
  LOGIC = 'logic',
  PRODUCING = 'producing',
  LIFE = 'life',
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
    image: z.string().optional().default('/spirited-blog.jpg'), // default blog image for og
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
    image: z.string().optional().default('/whisper-music.jpeg'), // default music image for og
  }),
});

// Export a single `collections` object to register our collection(s)
// This key should match your collection directory name in "src/content"
export const collections = {
  blog: blog,
  music: music,
};
