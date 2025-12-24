import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInstagramDto } from './dto/create-instagram.dto';
import { UpdateInstagramDto } from './dto/update-instagram.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { basename, join } from 'node:path';
import { existsSync, unlinkSync } from 'node:fs';

@Injectable()
export class InstagramService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createInstagramDto: CreateInstagramDto,
    image?: Express.Multer.File,
  ) {
    return this.prisma.instagram.create({
      data: {
        ...createInstagramDto,
        image: image ? `/uploads/instagram/${image.filename}` : null,
      },
    });
  }

  async findAll() {
    const existingInstagram = await this.prisma.instagram.findMany();
    if (existingInstagram.length === 0) {
      throw new NotFoundException('Instagram not found');
    }
    return existingInstagram;
  }

  async findOne(id: string) {
    const existingInstagram = await this.prisma.instagram.findUnique({
      where: {
        id,
      },
    });
    if (!existingInstagram) {
      throw new NotFoundException('Instagram not found');
    }
    return existingInstagram;
  }

  async update(
    id: string,
    updateInstagramDto: UpdateInstagramDto,
    image?: Express.Multer.File,
  ) {
    const existingInstagram = await this.findOne(id);

    const uploadRoot = join(process.cwd(), 'uploads', 'instagram');
    if (image && existingInstagram.image) {
      const fileName = basename(existingInstagram.image);
      const oldPath = join(uploadRoot, fileName);
      if (existsSync(oldPath)) {
        unlinkSync(oldPath);
      }
    }
    return this.prisma.instagram.update({
      where: {
        id,
      },
      data: {
        ...updateInstagramDto,
        image: image
          ? `/uploads/instagram/${image.filename}`
          : existingInstagram.image,
      },
    });
  }

  async remove(id: string) {
    const existingInstagram = await this.findOne(id);
    const uploadRoot = join(process.cwd(), 'uploads', 'instagram');
    if (existingInstagram.image) {
      const fileName = basename(existingInstagram.image);
      const oldPath = join(uploadRoot, fileName);
      if (existsSync(oldPath)) {
        unlinkSync(oldPath);
      }
    }
    return this.prisma.instagram.delete({
      where: {
        id,
      },
    });
  }
}
