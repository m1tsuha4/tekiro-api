import { CreateArticleSchema } from './create-article.dto';
import { createZodDto } from '@anatine/zod-nestjs';

export const UpdateArticleSchema = CreateArticleSchema.partial();

export class UpdateArticleDto extends createZodDto(UpdateArticleSchema) {}
