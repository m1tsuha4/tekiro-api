import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { InstagramService } from './instagram.service';
import {
  CreateInstagramDto,
  CreateInstagramSchema,
} from './dto/create-instagram.dto';
import {
  UpdateInstagramDto,
  UpdateInstagramSchema,
} from './dto/update-instagram.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-guard.auth';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { UploadImageInterceptor } from 'src/common/interceptors/multer-config.interceptors';

@Controller('instagram')
export class InstagramController {
  constructor(private readonly instagramService: InstagramService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiConsumes('multipart/form-data')
  @UploadImageInterceptor('instagram')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Instagram Caption' },
        link: { type: 'string', example: 'https://www.instagram.com/' },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  create(
    @Body(new ZodValidationPipe(CreateInstagramSchema))
    createInstagramDto: CreateInstagramDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.instagramService.create(createInstagramDto, file);
  }

  @Get()
  findAll() {
    return this.instagramService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.instagramService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UploadImageInterceptor('instagram')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Instagram Caption' },
        link: { type: 'string', example: 'https://www.instagram.com/' },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateInstagramSchema))
    updateInstagramDto: UpdateInstagramDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.instagramService.update(id, updateInstagramDto, file);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.instagramService.remove(id);
    return null;
  }
}
