import { CreateInstagramSchema } from './create-instagram.dto';
import { createZodDto } from '@anatine/zod-nestjs';

export const UpdateInstagramSchema = CreateInstagramSchema.partial();

export class UpdateInstagramDto extends createZodDto(UpdateInstagramSchema) {}
