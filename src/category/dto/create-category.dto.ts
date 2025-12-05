import { createZodDto } from '@anatine/zod-nestjs';
import z from 'zod';

export const CreateCategorySchema = z.object({
  name: z.string().min(3).max(255),
  image: z.string().optional(),
});

export class CreateCategoryDto extends createZodDto(CreateCategorySchema) {}
