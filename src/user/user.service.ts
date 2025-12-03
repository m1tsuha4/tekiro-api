import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: {
          email: createUserDto.email,
        },
      });
      if (existingUser) {
        throw new BadRequestException('User already exists');
      }
      const hashPassword = await bcrypt.hash(createUserDto.password, 10);
      return await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          password: hashPassword,
          name: createUserDto.name,
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findAll() {
    try {
      const existingUser = await this.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if (!existingUser) {
        throw new NotFoundException('User not found');
      }
      return existingUser;
    } catch (error) {
      throw new InternalServerErrorException('Failed to find users');
    }
  }

  async findOne(id: string) {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if (!existingUser) {
        throw new NotFoundException('User not found');
      }
      return existingUser;
    } catch (error) {
      throw new InternalServerErrorException('Failed to find user');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: {
          id,
        },
      });
      if (!existingUser) {
        throw new NotFoundException('User not found');
      }
      const emailUser = await this.prisma.user.findUnique({
        where: {
          email: updateUserDto.email,
        },
      });
      if (emailUser && emailUser.id !== id) {
        throw new BadRequestException('Email already exists');
      }
      return await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          email: updateUserDto.email,
          name: updateUserDto.name,
          ...(updateUserDto.password && {
            password: await bcrypt.hash(updateUserDto.password, 10),
          }),
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async remove(id: string) {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: {
          id,
        },
      });
      if (!existingUser) {
        throw new NotFoundException('User not found');
      }
      const user = await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          deletedAt: new Date(),
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
        },
      });
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete user');
    }
  }
}
