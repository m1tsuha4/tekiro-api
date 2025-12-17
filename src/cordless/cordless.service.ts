import { Injectable } from '@nestjs/common';
import { CreateCordlessDto } from './dto/create-cordless.dto';
import { UpdateCordlessDto } from './dto/update-cordless.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CordlessService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCordlessDto: CreateCordlessDto) {
    return await this.prisma.cordless.create({ data: createCordlessDto });
  }

  async findAll() {
    const existingCordless = await this.prisma.cordless.findMany();
    if (existingCordless.length === 0) {
      throw new Error('Cordless not found');
    }
    return existingCordless;
  }

  async findOne(id: string) {
    const existingCordless = await this.prisma.cordless.findUnique({
      where: { id },
    });
    if (!existingCordless) {
      throw new Error('Cordless not found');
    }
    return existingCordless;
  }

  async update(id: string, updateCordlessDto: UpdateCordlessDto) {
    const existingCordless = await this.prisma.cordless.findUnique({
      where: { id },
    });
    if (!existingCordless) {
      throw new Error('Cordless not found');
    }
    return await this.prisma.cordless.update({
      where: { id },
      data: updateCordlessDto,
    });
  }

  async remove(id: string) {
    const existingCordless = await this.prisma.cordless.findUnique({
      where: { id },
    });
    if (!existingCordless) {
      throw new Error('Cordless not found');
    }
    return await this.prisma.cordless.delete({ where: { id } });
  }
}
