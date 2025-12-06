import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCatalogueDto } from './dto/create-catalogue.dto';
import { UpdateCatalogueDto } from './dto/update-catalogue.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Category } from 'src/category/entities/category.entity';
import { basename, join } from 'path';
import { existsSync, unlinkSync } from 'fs';

@Injectable()
export class CatalogueService {
  constructor(private readonly prisma: PrismaService){}
  
  async create(createCatalogueDto: CreateCatalogueDto, file?: Express.Multer.File) {
    if(!file){
      throw new BadRequestException('File is Required');
    }
    const fileUrl = `/uploads/catalogue/${file.filename}`;
    return this.prisma.catalogue.create({
      data: {
        ...createCatalogueDto,
        file: fileUrl,
      },
    });
  }

  async findAll() {
    const existingCatalogue = await this.prisma.catalogue.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        title: true,
        file: true,
        categoryId: true,
        category: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        }
      },
    });
    if (existingCatalogue.length === 0) {
      throw new NotFoundException('Catalogue not found');
    }
    return existingCatalogue;
  }

  async findOne(id: string) {
    const existingCatalogue = await this.prisma.catalogue.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      select: {
        id: true,
        title: true,
        file: true,
        categoryId: true,
        category: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        }
      },
    });
    if (!existingCatalogue) {
      throw new NotFoundException('Catalogue not found');
    }
    return existingCatalogue;
  }

  async update(id: string, updateCatalogueDto: UpdateCatalogueDto, file?: Express.Multer.File) {
    const existingCatalogue = await this.prisma.catalogue.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });
    if (!existingCatalogue) {
      throw new NotFoundException('Catalogue not found');
    }
    const {
      file: _ignoreFileField,
      ...rest
    } = updateCatalogueDto as any;
    const updateData: any = { ...rest };
    const uploadRoot = join(process.cwd(), 'uploads');
    if (file) {
      const fileUrl = `/uploads/catalogue/${file.filename}`;
      updateData.fileUrl = fileUrl;

      if (existingCatalogue.file && existingCatalogue.file.length > 0) {
        const filename = basename(existingCatalogue.file);
        const oldFilePath = join(uploadRoot, 'catalogue', filename);
        try {
          if (existsSync(oldFilePath)) {
            unlinkSync(oldFilePath);
          }
        } catch (error) {
          console.error('Error deleting old file:', error);
        }
      }
    }
    return this.prisma.catalogue.update({
      where: {
        id,
      },
      data: updateData,
    });
  }

  async remove(id: string) {
    const existingCatalogue = await this.prisma.catalogue.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });
    if (!existingCatalogue) {
      throw new NotFoundException('Catalogue not found');
    }
    const uploadRoot = join(process.cwd(), 'uploads');
    if (existingCatalogue.file && existingCatalogue.file.length > 0) {
      const filename = basename(existingCatalogue.file);
      const oldFilePath = join(uploadRoot, 'catalogue', filename);
      try {
        if (existsSync(oldFilePath)) {
          unlinkSync(oldFilePath);
        }
      } catch (error) {
        console.error('Error deleting old file:', error);
      }
    }
    return this.prisma.catalogue.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
