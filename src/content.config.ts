// 1. Import utilities from `astro:content`
import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

// Define the allowed tag values using an enum
// These should be unique enough so you can use them as CSS classes
export enum Tag {
  SOFTWARE = 'software',
  LANGUAGE = 'language',
  BUSINESS = 'business',
  LIFE = 'life',
}

// Define schemas for each collection we'd like to validate.
// We could define more content collections below if we'd like
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    fileName: z.string(),
    title: z.string(),
    pubDate: z.date(),
    description: z.string(),
    duration: z.number(),
    draft: z.boolean().optional(),
    tags: z.array(z.nativeEnum(Tag)).optional(),
    image: z.string().optional().default('/og-blog.png'), // default blog image for og
    resources: z.array(z.object({ title: z.string(), url: z.string(), description: z.string().optional() })).optional(),
  }),
});

// Export a single `collections` object to register our collection(s)
export const collections = {
  blog: blog,
};
