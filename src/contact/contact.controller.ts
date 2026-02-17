import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MailService } from '../mail/mail.service';
import { CreateContactDto } from './dto/create-contact.dto';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
    constructor(private readonly mailService: MailService) { }

    @Post('contact-us')
    @ApiOperation({ summary: 'Send contact email' })
    @ApiResponse({ status: 201, description: 'Email sent successfully.' })
    async sendContactEmail(@Body() createContactDto: CreateContactDto) {
        const { name, email, phone, address, purpose, message } = createContactDto;

        const subject = `New Contact Form Submission: ${purpose}`;
        const html = `
      <h3>New Contact Form Submission</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Address:</strong> ${address}</p>
      <p><strong>Purpose:</strong> ${purpose}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

        await this.mailService.sendMail(
            'tekirotools.indonesia@gmail.com',
            subject,
            html,
        );

        return { message: 'Email sent successfully' };
    }
}
