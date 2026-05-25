import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateInstagramDto } from './dto/create-instagram.dto';
import { UpdateInstagramDto } from './dto/update-instagram.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import Axios from 'axios';
import { basename, join } from 'node:path';
import { existsSync, unlinkSync } from 'node:fs';

@Injectable()
export class InstagramService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

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

  async findAll(after?: string) {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

    if (!accessToken) {
      throw new InternalServerErrorException(
        'INSTAGRAM_ACCESS_TOKEN environment variable not set',
      );
    }

    if (!process.env.INSTAGRAM_USER_ID) {
      throw new InternalServerErrorException(
        'INSTAGRAM_USER_ID environment variable not set',
      );
    }

    const params: Record<string, any> = {
      fields:
        'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp',
      limit: 10,
      access_token: accessToken,
    };

    if (after && after.trim() !== '' && after !== 'undefined' && after !== 'null') {
      params.after = after;
    }

    try {
      const response = await Axios.get(
        `https://graph.facebook.com/v23.0/${process.env.INSTAGRAM_USER_ID}/media`,
        {
          params,
        },
        );

      const transformedData = response.data.data.map(
        (item: any) => ({
          id: item.id,
          title: item.caption,
          link: item.permalink,
          image:
            item.media_type === 'VIDEO'
              ? item.thumbnail_url
              : item.media_url,
          created_at: item.timestamp,
        }),
      );

      return {
        data: transformedData,
        paging: response.data.paging,
      };
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || 'Failed to fetch Instagram posts';
      console.error('Instagram API Error:', error.response?.data);

      throw new InternalServerErrorException(errorMessage);
    }
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
