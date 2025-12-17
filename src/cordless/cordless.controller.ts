import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CordlessService } from './cordless.service';
import {
  CreateCordlessDto,
  CreateCordlessSchema,
} from './dto/create-cordless.dto';
import {
  UpdateCordlessDto,
  UpdateCordlessSchema,
} from './dto/update-cordless.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-guard.auth';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';

@Controller('cordless')
export class CordlessController {
  constructor(private readonly cordlessService: CordlessService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  create(
    @Body(new ZodValidationPipe(CreateCordlessSchema))
    createCordlessDto: CreateCordlessDto,
  ) {
    return this.cordlessService.create(createCordlessDto);
  }

  @Get()
  findAll() {
    return this.cordlessService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cordlessService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateCordlessSchema))
    updateCordlessDto: UpdateCordlessDto,
  ) {
    return this.cordlessService.update(id, updateCordlessDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.cordlessService.remove(id);
    return null;
  }
}
