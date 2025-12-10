import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { join, basename } from 'path';
import { existsSync, unlinkSync } from 'fs';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createProductDto: CreateProductDto,
    file?: Express.Multer.File[],
  ) {
    if (!file || file.length === 0) {
      throw new BadRequestException('Atleast One Image is Required');
    }
    const images = file.map((file) => `/uploads/product/${file.filename}`);
    return this.prisma.product.create({
      data: {
        ...createProductDto,
        images,
      },
    });
  }

  async findAll() {
    const existingProduct = await this.prisma.product.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        description: true,
        images: true,
        storeUrl: true,
        categoryId: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (existingProduct.length === 0) {
      throw new NotFoundException('Product not found');
    }
    return existingProduct;
  }

  async findLatest() {
    const latestProduct = await this.prisma.product.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        images: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 16,
    });
    if (latestProduct.length === 0) {
      throw new NotFoundException('Product not found');
    }
    return latestProduct;
  }

  async findOne(id: string) {
    const existingProduct = await this.prisma.product.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        description: true,
        images: true,
        storeUrl: true,
        categoryId: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }
    return existingProduct;
  }

  async findCategory(categoryId: string) {
    const existingProduct = await this.prisma.product.findMany({
      where: {
        categoryId,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        images: true,
      },
      take: 10,
    });
    if (existingProduct.length === 0) {
      throw new NotFoundException('Product not found');
    }
    return existingProduct;
  }

  async findRelated(categoryId: string) {
    const existingProduct = await this.prisma.product.findMany({
      where: {
        categoryId,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        images: true,
      },
      take: 3,
    });
    if (existingProduct.length === 0) {
      throw new NotFoundException('Product not found');
    }
    return existingProduct;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    files?: Express.Multer.File[],
  ) {
    const existingProduct = await this.prisma.product.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    const {
      file: _ignoreFileField,
      files: _ignoreFilesField,
      ...rest
    } = updateProductDto as any;
    const updateData: any = { ...rest };
    const uploadRoot = join(process.cwd(), 'uploads');

    if (files && files.length > 0) {
      const newImages = files.map(
        (file) => `/uploads/product/${file.filename}`,
      );
      updateData.images = newImages;

      if (existingProduct.images && existingProduct.images.length > 0) {
        for (const img of existingProduct.images) {
          const filename = basename(img);
          const oldFilePath = join(uploadRoot, 'product', filename);
          try {
            if (existsSync(oldFilePath)) {
              unlinkSync(oldFilePath);
            }
          } catch (error) {
            console.error('Error deleting old file:', error);
          }
        }
      }
    }
    return this.prisma.product.update({
      where: {
        id,
      },
      data: updateData,
    });
  }

  async remove(id: string) {
    const existingProduct = await this.prisma.product.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    const uploadRoot = join(process.cwd(), 'uploads');
    if (existingProduct.images && existingProduct.images.length > 0) {
      for (const img of existingProduct.images) {
        const filename = basename(img);
        const oldFilePath = join(uploadRoot, 'product', filename);
        try {
          if (existsSync(oldFilePath)) {
            unlinkSync(oldFilePath);
          }
        } catch (error) {
          console.error('Error deleting old file:', error);
        }
      }
    }
    return this.prisma.product.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async search(query: string) {
    const existingProduct = await this.prisma.product.findMany({
      where: {
        deletedAt: null,
        name: {
          contains: query,
        },
      },
      select: {
        id: true,
        name: true,
        images: true,
      },
    });
    if (existingProduct.length === 0) {
      throw new NotFoundException('Product not found');
    }
    return existingProduct;
  }
}
