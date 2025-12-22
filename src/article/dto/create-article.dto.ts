import { createZodDto } from '@anatine/zod-nestjs';
import z from 'zod';

export const CreateArticleSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3).optional(),
  excerpt: z.string().optional(),
  contentHtml: z.string().min(3),
  primaryImage: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  metaTags: z
    .string()
    .optional()
    .transform((value) => (value ? JSON.parse(value) : undefined)),
  publishedAt: z.coerce.date().optional(),
});

export class CreateArticleDto extends createZodDto(CreateArticleSchema) {}
