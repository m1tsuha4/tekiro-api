import { CreateProductSchema } from './create-product.dto';
import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const UpdateProductSchema = CreateProductSchema.partial().extend({
  imagesToDelete: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      // If already an array, return as-is
      if (Array.isArray(val)) return val;
      // If it's a string, try to parse JSON array (Swagger sometimes sends arrays as JSON strings)
      if (typeof val === 'string') {
        const trimmed = val.trim();
        if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
          try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) return parsed;
          } catch (e) {
            // fallthrough to other parsing
          }
        }
        // If comma separated values, split into array
        if (trimmed.includes(',')) {
          return trimmed.split(',').map((s) => s.trim()).filter(Boolean);
        }
        // Single string value -> wrap in array
        return [val];
      }
      return undefined;
    })
    .describe('Image URL or array of image URLs to delete'),
});

export class UpdateProductDto extends createZodDto(UpdateProductSchema) {}
