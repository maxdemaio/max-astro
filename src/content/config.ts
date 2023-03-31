// 1. Import utilities from `astro:content`
import { z, defineCollection } from 'astro:content';
// 2. Define a schema for each collection we'd like to validate.
// We could define more content collections below if we'd like
// must have same name as folder
const blog = defineCollection({
  schema: z.object({
    layout: z.string(),
    fileName: z.string(),
    title: z.string(),
    pubDate: z.string(),
    description: z.string(),
    draft: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
  }),
});
// 3. Export a single `collections` object to register your collection(s)
export const collections = {
  blog: blog,
};
