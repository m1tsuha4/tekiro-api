import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { basename, join } from 'path';
import { existsSync, unlinkSync } from 'fs';

@Injectable()
export class GalleryService {
  constructor(private readonly prisma: PrismaService) {}
  
  async create(createGalleryDto: CreateGalleryDto, file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    
    const image = `/uploads/gallery/${file.filename}`;
    return this.prisma.gallery.create({
      data: {
        title: createGalleryDto.title,
        image,
      },
    });
  }

  async findAll() {
    const existingGallery = await this.prisma.gallery.findMany({
      select: {
        id: true,
        title: true,
        image: true,
      },
    });
    if (existingGallery.length === 0) {
      throw new NotFoundException('Gallery not found');
    }
    return existingGallery;
  }

  async findOne(id: string) {
    const existingGallery = await this.prisma.gallery.findUnique({
      where: {
        id: id,
      },
    });
    if (!existingGallery) {
      throw new NotFoundException('Gallery not found');
    }
    return existingGallery;
  }

  async update(id: string, updateGalleryDto: UpdateGalleryDto, file?: Express.Multer.File) {
    const existingGallery = await this.prisma.gallery.findUnique({
      where: {
        id: id,
      },
    });
    if (!existingGallery) {
      throw new NotFoundException('Gallery not found');
    }
    const { file: _ignoreFileField, ...rest } = updateGalleryDto as any;
    const updateData: any = { ...rest };
    const uploadRoot = join(process.cwd(), 'uploads');
    let image: string | undefined;
    
    if (file) {
      image = `/uploads/gallery/${file.filename}`;
      updateData.image = image;

      if (existingGallery.image) {
        const filename = basename(existingGallery.image);
        const oldFilePath = join(uploadRoot, 'gallery', filename);
        try {
          if (existsSync(oldFilePath)) {
            unlinkSync(oldFilePath);
          }
        } catch (error) {
          console.error('Error deleting old file:', error);
        }
      }
    }
    return this.prisma.gallery.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string) {
    const existingGallery = await this.prisma.gallery.findUnique({
      where: {
        id: id,
      },
    });
    if (!existingGallery) {
      throw new NotFoundException('Gallery not found');
    }
    const uploadRoot = join(process.cwd(), 'uploads');

    if (existingGallery.image) {
      const filename = basename(existingGallery.image);
      const oldFilePath = join(uploadRoot, 'gallery', filename);
      try {
        if (existsSync(oldFilePath)) {
          unlinkSync(oldFilePath);
        }
      } catch (error) {
        console.error('Error deleting old file:', error);
      }
    }

    return this.prisma.gallery.delete({
      where: { id },
    });
  }
}
