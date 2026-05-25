import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { InstagramController } from './instagram.controller';
import { InstagramService } from './instagram.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [HttpModule, PrismaModule],
  controllers: [InstagramController],
  providers: [
    InstagramService,
  ],
})
export class InstagramModule {}
