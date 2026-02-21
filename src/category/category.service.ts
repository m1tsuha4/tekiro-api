import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { join, basename } from 'path';
import { existsSync, unlinkSync } from 'fs';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    file?: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const existingCategory = await this.prisma.category.findUnique({
      where: {
        name: createCategoryDto.name,
      },
    });
    if (existingCategory) {
      throw new BadRequestException('Category already exists');
    }
    const image = `/uploads/category/${file.filename}`;
    return this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
        image,
      },
    });
  }

  async findAll() {
    const existingCategory = await this.prisma.category.findMany({
      where: {
        deletedAt: null,
        NOT: {
          id: 'cmlvva2qz00000ip8ypkzh2gp',
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
      },
    });
    if (existingCategory.length === 0) {
      throw new NotFoundException('Category not found');
    }
    return existingCategory;
  }

  async findOne(id: string) {
    const existingCategory = await this.prisma.category.findUnique({
      where: {
        id: id,
        deletedAt: null,
      },
    });
    if (!existingCategory) {
      throw new NotFoundException('Category not found');
    }
    return existingCategory;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    file?: Express.Multer.File,
  ) {
    const existingCategory = await this.prisma.category.findUnique({
      where: {
        id: id,
      },
    });
    if (!existingCategory) {
      throw new NotFoundException('Category not found');
    }
    const existingCategoryName = await this.prisma.category.findUnique({
      where: {
        name: updateCategoryDto.name,
      },
    });
    if (existingCategoryName && existingCategoryName.id !== id) {
      throw new BadRequestException('Category name already exists');
    }

    const { file: _ignoreFileField, ...rest } = updateCategoryDto as any;
    const updateData: any = { ...rest };
    const uploadRoot = join(process.cwd(), 'uploads');
    let image: string | undefined;

    if (file) {
      image = `/uploads/category/${file.filename}`;
      updateData.image = image;

      if (existingCategory.image) {
        const filename = basename(existingCategory.image);
        const oldFilePath = join(uploadRoot, 'category', filename);
        try {
          if (existsSync(oldFilePath)) {
            unlinkSync(oldFilePath);
          }
        } catch (error) {
          console.error('Error deleting old file:', error);
        }
      }
    }
    return this.prisma.category.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string) {
    const existingCategory = await this.prisma.category.findUnique({
      where: {
        id: id,
      },
    });
    if (!existingCategory) {
      throw new NotFoundException('Category not found');
    }
    const uploadRoot = join(process.cwd(), 'uploads');

    if (existingCategory.image) {
      const filename = basename(existingCategory.image);
      const oldFilePath = join(uploadRoot, 'category', filename);
      try {
        if (existsSync(oldFilePath)) {
          unlinkSync(oldFilePath);
        }
      } catch (error) {
        console.error('Error deleting old file:', error);
      }
    }

    return this.prisma.category.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
