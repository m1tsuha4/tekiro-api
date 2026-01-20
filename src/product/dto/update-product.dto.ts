import { CreateProductSchema } from './create-product.dto';
import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const UpdateProductSchema = CreateProductSchema.partial().extend({
  imagesToDelete: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      return Array.isArray(val) ? val : [val];
    })
    .describe('Image URL or array of image URLs to delete'),
});

export class UpdateProductDto extends createZodDto(UpdateProductSchema) {}
