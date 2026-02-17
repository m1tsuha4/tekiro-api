import { createZodDto } from '@anatine/zod-nestjs';
import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const CreateContactSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    address: z.string().min(1),
    purpose: z.string().min(1),
    message: z.string().min(1),
});

export class CreateContactDto extends createZodDto(CreateContactSchema) {
    @ApiProperty({ example: 'John Doe' })
    name: string;

    @ApiProperty({ example: 'john@example.com' })
    email: string;

    @ApiProperty({ example: '08123456789' })
    phone: string;

    @ApiProperty({ example: 'Jalan Raya No. 1' })
    address: string;

    @ApiProperty({ example: 'Inquiry' })
    purpose: string;

    @ApiProperty({ example: 'I want to ask about product X' })
    message: string;
}
