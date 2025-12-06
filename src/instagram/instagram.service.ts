import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInstagramDto } from './dto/create-instagram.dto';
import { UpdateInstagramDto } from './dto/update-instagram.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InstagramService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createInstagramDto: CreateInstagramDto) {
    return this.prisma.instagram.create({
      data: createInstagramDto,
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

  async update(id: string, updateInstagramDto: UpdateInstagramDto) {
    const existingInstagram = await this.prisma.instagram.findUnique({
      where: {
        id,
      },
    });
    if (!existingInstagram) {
      throw new NotFoundException('Instagram not found');
    }
    return this.prisma.instagram.update({
      where: {
        id,
      },
      data: updateInstagramDto,
    });
  }

  async remove(id: string) {
    const existingInstagram = await this.prisma.instagram.findUnique({
      where: {
        id,
      },
    });
    if (!existingInstagram) {
      throw new NotFoundException('Instagram not found');
    }
    return this.prisma.instagram.delete({
      where: {
        id,
      },
    });
  }
}
