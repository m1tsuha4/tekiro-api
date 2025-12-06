import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const CreateProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  storeUrl: z.string().optional(),
  categoryId: z.string(),
});

export class CreateProductDto extends createZodDto(CreateProductSchema) {}
