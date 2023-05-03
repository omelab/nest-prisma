import { INestApplication, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  get $transformer() {
    return this.$transformer;
  }
}

// export class PrismaService {
//   public client: PrismaClient = new PrismaClient();

//   get $transaction() {
//     return this.client.$transaction;
//   }

//   get $executeRaw() {
//     return this.client.$executeRaw;
//   }

//   get $connect() {
//     return this.client.$connect;
//   }

//   get $disconnect() {
//     return this.client.$disconnect;
//   }

//   get $transformer() {
//     return this.$transformer;
//   }
// }
