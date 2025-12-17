import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UploadedFile,
} from '@nestjs/common';
import { CatalogueService } from './catalogue.service';
import {
  CreateCatalogueDto,
  CreateCatalogueSchema,
} from './dto/create-catalogue.dto';
import {
  UpdateCatalogueDto,
  UpdateCatalogueSchema,
} from './dto/update-catalogue.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-guard.auth';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { UploadPdfInterceptor } from 'src/common/interceptors/multer-config.interceptors';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';

@Controller('catalogue')
export class CatalogueController {
  constructor(private readonly catalogueService: CatalogueService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @UploadPdfInterceptor('catalogue')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        categoryId: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  create(
    @Body(new ZodValidationPipe(CreateCatalogueSchema))
    createCatalogueDto: CreateCatalogueDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.catalogueService.create(createCatalogueDto, file);
  }

  @Get()
  findAll() {
    return this.catalogueService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catalogueService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @UploadPdfInterceptor('catalogue')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        categoryId: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateCatalogueSchema))
    updateCatalogueDto: UpdateCatalogueDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.catalogueService.update(id, updateCatalogueDto, file);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.catalogueService.remove(id);
    return null;
  }
}
