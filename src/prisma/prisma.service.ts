import { Injectable } from '@nestjs/common';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../../generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const adapter = new PrismaBetterSqlite3({
      url: process.env.DATABASE_URL,
    });

    super({
      adapter,
    });
  }

  async onModuleInit() {
    try {
      console.log('Trying to connect Prisma to DB...');
      await this.$connect();
      console.log('Prisma connected to DB successfully');
    } catch (err) {
      console.error('Prisma failed to connect to DB');
      console.error(err);
      throw err;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
