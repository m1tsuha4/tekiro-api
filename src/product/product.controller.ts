import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UploadedFiles,
} from '@nestjs/common';
import { ProductService } from './product.service';
import {
  CreateProductDto,
  CreateProductSchema,
} from './dto/create-product.dto';
import {
  UpdateProductDto,
  UpdateProductSchema,
} from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-guard.auth';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { UploadImagesInterceptor } from 'src/common/interceptors/multer-config.interceptors';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @UploadImagesInterceptor('products', 3)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        storeUrl: { type: 'string' },
        categoryId: { type: 'string' },
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
      required: ['name', 'description', 'categoryId', 'files'],
    },
  })
  create(
    @Body(new ZodValidationPipe(CreateProductSchema))
    createProductDto: CreateProductDto,
    @UploadedFiles() file: Express.Multer.File[],
  ) {
    return this.productService.create(createProductDto, file);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get('latest')
  findLatest() {
    return this.productService.findLatest();
  }

  @Get(':categoryId')
  findCategory(@Param('categoryId') categoryId: string) {
    return this.productService.findCategory(categoryId);
  }

  @Get('related/:categoryId')
  findRelated(@Param('categoryId') categoryId: string) {
    return this.productService.findRelated(categoryId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @UploadImagesInterceptor('products', 3)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        storeUrl: { type: 'string' },
        categoryId: { type: 'string' },
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateProductSchema))
    updateProductDto: UpdateProductDto,
    @UploadedFiles() file: Express.Multer.File[],
  ) {
    return this.productService.update(id, updateProductDto, file);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.productService.remove(id);
    return null;
  }
}
