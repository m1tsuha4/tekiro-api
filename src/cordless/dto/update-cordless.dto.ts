import { CreateCordlessSchema } from './create-cordless.dto';
import { createZodDto } from '@anatine/zod-nestjs';

export const UpdateCordlessSchema = CreateCordlessSchema.partial();

export class UpdateCordlessDto extends createZodDto(UpdateCordlessSchema) {}
