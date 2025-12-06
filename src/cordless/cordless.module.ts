import { Module } from '@nestjs/common';
import { CordlessService } from './cordless.service';
import { CordlessController } from './cordless.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [CordlessController],
  providers: [CordlessService],
  imports: [PrismaModule],
})
export class CordlessModule {}
