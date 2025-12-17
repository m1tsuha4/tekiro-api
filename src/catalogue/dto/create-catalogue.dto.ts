import { createZodDto } from '@anatine/zod-nestjs';
import z from 'zod';

export const CreateCatalogueSchema = z.object({
  title: z.string().min(1).max(255),
  categoryId: z.string(),
});

export class CreateCatalogueDto extends createZodDto(CreateCatalogueSchema) {}
