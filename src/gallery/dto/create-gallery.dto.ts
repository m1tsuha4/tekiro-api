import z from "zod";

export const CreateGallerySchema = z.object({
    name: z.string().min(3).max(255),
})

export class CreateGalleryDto {}
