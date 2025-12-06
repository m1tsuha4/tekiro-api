import { createZodDto } from '@anatine/zod-nestjs';
import { CreateGallerySchema } from './create-gallery.dto';

export const UpdateGallerySchema = CreateGallerySchema.partial();

export class UpdateGalleryDto extends createZodDto(UpdateGallerySchema) {}
