import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UploadedFile } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { CreateGalleryDto, CreateGallerySchema } from './dto/create-gallery.dto';
import { UpdateGalleryDto, UpdateGallerySchema } from './dto/update-gallery.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-guard.auth';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { UploadImageInterceptor } from 'src/common/interceptors/multer-config.interceptors';

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @UploadImageInterceptor('gallery')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  create(@Body(new ZodValidationPipe(CreateGallerySchema)) createGalleryDto: CreateGalleryDto, @UploadedFile() file: Express.Multer.File) {
    return this.galleryService.create(createGalleryDto, file);
  }

  @Get()
  findAll() {
    return this.galleryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.galleryService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @Patch(':id')
  @UploadImageInterceptor('gallery')
  update(@Param('id') id: string, @Body(new ZodValidationPipe(UpdateGallerySchema)) updateGalleryDto: UpdateGalleryDto, @UploadedFile() file: Express.Multer.File) {
    return this.galleryService.update(id, updateGalleryDto, file);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.galleryService.remove(id);
    return null;
  }
}
