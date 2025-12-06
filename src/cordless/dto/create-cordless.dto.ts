import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";

export const CreateCordlessSchema = z.object({
    title: z.string().min(3).max(100),
    description: z.string().min(3).max(1000),
    link: z.string().url(),
})

export class CreateCordlessDto extends createZodDto(CreateCordlessSchema) {}
