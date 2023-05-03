##  Nestjs Config
Creating a new project with the Nest CLI is recommended for first-time users. We'll continue with this approach in [First Steps](https://docs.nestjs.com/first-steps).

After creating the project we need to make configuration
To use the configuration module in your NestJS application, you need to first install the @nestjs/config package:

```bash
npm install --save @nestjs/config
```

Then, you can import the ConfigModule in your root AppModule:

```javascript
//src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:[`.env.${process.env.NODE_ENV ?? 'production'}`],
    }),
  ],
})
export class AppModule {}
```

In the example above, we've set the isGlobal option to true so that the configuration module is available throughout the entire application. We've also specified two environment files to load, .env.development and .env.production.

Next, you can use the ConfigService to access your application's configuration values:

```javascript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getDatabaseUrl(): string {
    return this.configService.get<string>('DATABASE_URL');
  }
}
```
In the example above, we're using the ConfigService to retrieve the value of the DATABASE_URL configuration variable.

You can also define configuration values in a .env file at the root of your project:

```bash
DATABASE_URL=postgres://localhost:5432/mydb
```
The ConfigService will automatically load these values and make them available to your application.


In the main.js file of your NestJS application, you can access the ConfigService by importing it from the @nestjs/config package and injecting it into your main application instance using the app.use() method. Here's an example:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT');
  await app.listen(port);
}

bootstrap();
```
 

 ## Validation

Nest works well with the class-validator library. we need to install libraries
```bash
npm i --save class-validator class-transformer
```


## Swagger

to install swagger run this command 
```bash 
 npm install --save @nestjs/swagger 
```

## Parse Cookie
Parse Cookie header and populate req.cookies with an object keyed by the cookie names. Optionally you may enable signed cookie support by passing a secret string, which assigns req.secret so it may be used by other middleware. to install run this command below

```bash
npm install cookie-parser
```


## module wrapper for logger
Logging is an important aspect of any application as it allows developers to track errors and debug issues that may arise during development or in production. Winston provides a flexible and customizable logging solution, with features such as log levels, log rotation, and the ability to log to multiple destinations (e.g. console, file, database, etc.).
to install nest-winston plz run this command

```bash
npm install --save nest-winston winston
```


## Multiple Languages (nestjs-i18n)
To install nestjs i18n run this command
```bash
npm install --save nestjs-i18n
```



## Prisma
[Prisma](https://www.prisma.io/) is an open-source ORM for Node.js and TypeScript. It is used as an alternative to writing plain SQL, or using another database access tool such as SQL query builders (like knex.js) or ORMs (like TypeORM and Sequelize). Prisma currently supports PostgreSQL, MySQL, SQL Server, SQLite, MongoDB and CockroachDB (Preview).

Set up Prisma
```bash
npm install -D prisma
```

In the following steps, we'll be utilizing the Prisma CLI. As a best practice, it's recommended to invoke the CLI locally by prefixing it with npx:

Now create your initial Prisma setup using the init command of the Prisma CLI:

```bash
npx prisma init
```
then set your database url in environment variables

```bash
// .env
DATABASE_URL="postgres://myuser:mypassword@localhost:5432/median-db"
```

Understand the Prisma schema
If you open prisma/schema.prisma, you should see the following default schema:

```bash
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Model the data
Now it's time to define the data models for your application. For this tutorial, you will only need an Article model to represent each article on the blog.

Inside the prisma/prisma.schema file, add a new model to your schema named Article:

```bash
// prisma/schema.prisma

model Article {
  id          Int      @id @default(autoincrement())
  title       String   @unique
  description String?
  body        String
  published   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Migrate the database
With the Prisma schema defined, you will run migrations to create the actual tables in the database. To generate and execute your first migration, run the following command in the terminal:

```bash
npx prisma migrate dev --name "init"
```

Check the generated migration file to get an idea about what Prisma Migrate is doing behind the scenes:

```bash
-- prisma/migrations/20220528101323_init/migration.sql

-- CreateTable
CREATE TABLE "Article" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "body" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Article_title_key" ON "Article"("title");
```


### Seed the database
Currently, the database is empty. So you will create a seed script that will populate the database with some dummy data.

Firstly, create a seed file called prisma/seed.ts. This file will contain the dummy data and queries needed to seed your database.
```bash
touch prisma/seed.ts
```

Then, inside the seed file, add the following code:

```bash
// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // create two dummy articles
  const post1 = await prisma.article.upsert({
    where: { title: 'Prisma Adds Support for MongoDB' },
    update: {},
    create: {
      title: 'Prisma Adds Support for MongoDB',
      body: 'Support for MongoDB has been one of the most requested features since the initial release of...',
      description:
        "We are excited to share that today's Prisma ORM release adds stable support for MongoDB!",
      published: false,
    },
  });

  const post2 = await prisma.article.upsert({
    where: { title: "What's new in Prisma? (Q1/22)" },
    update: {},
    create: {
      title: "What's new in Prisma? (Q1/22)",
      body: 'Our engineers have been working hard, issuing new releases with many improvements...',
      description:
        'Learn about everything in the Prisma ecosystem and community from January to March 2022.',
      published: true,
    },
  });

  console.log({ post1, post2 });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
  ```
  You need to tell Prisma what script to execute when running the seeding command. You can do this by adding the prisma.seed key to the end of your package.json file:

### Install and generate Prisma Client
Prisma Client is a type-safe database client that's generated from your Prisma model definition. Because of this approach, Prisma Client can expose CRUD operations that are tailored specifically to your models.
To install Prisma Client in your project, run the following command in your terminal:

```bash
npm install @prisma/client
```

```js
"prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
```

Execute seeding with the following command:

```bash
npx prisma db seed
```


### Create a Prisma service

nside your NestJS application, it is good practice to abstract away the Prisma Client API from your application. To do this, you will create a new service that will contain Prisma Client. This service, called PrismaService, will be responsible for instantiating a PrismaClient instance and connecting to your database.

The Nest CLI gives you an easy way to generate modules and services directly from the CLI. Run the following command in your terminal:

```bash
npx nest generate module prisma
npx nest generate service prisma
```

This should generate a new subdirectory ./src/prisma with a prisma.module.ts and prisma.service.ts file. Update the service file to contain the following code:

```js
// src/prisma/prisma.service.ts

import { INestApplication, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
```

The Prisma module will be responsible for creating a singleton instance of the PrismaService and allow sharing of the service throughout your application. To do this, you will add the PrismaService to the exports array in the prisma.module.ts file:

```js
// src/prisma/prisma.module.ts

import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

Now, any module that imports the PrismaModule will have access to PrismaService and can inject it into its own components/services. This is a common pattern for NestJS applications.


With that out of the way, you are done setting up Prisma! You can now get to work on building the REST API.



#### Help Links
[Nestjs/config](https://javascript.plainenglish.io/nestjs-how-to-store-read-and-validate-environment-variable-using-nestjs-config-40a5fa0702e4)

[validation pipes](https://docs.nestjs.com/pipes)
[nestjs-i18n](https://nestjs-i18n.com/)
[Create Role based Authorization](https://dev.to/dwipr/how-to-create-role-based-authorization-middleware-with-casbin-and-nest-js-52gm)
[Hashing Password](https://www.npmjs.com/package/argon2)
