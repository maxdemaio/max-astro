// 1. Import utilities from `astro:content`
import { z, defineCollection } from 'astro:content';

// Define schemas for each collection we'd like to validate.
// We could define more content collections below if we'd like
const blog = defineCollection({
  schema: z.object({
    fileName: z.string(),
    title: z.string(),
    pubDate: z.string(),
    description: z.string(),
    draft: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
  }),
});

// Export a single `collections` object to register our collection(s)
// This key should match your collection directory name in "src/content"
export const collections = {
  blog: blog,
};
