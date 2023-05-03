import { BadRequestException, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { hashData } from 'src/common/helper/hashData';
import { isUnique } from 'src/common/utils/isUnique';
import { Exclude, Expose } from 'class-transformer';
import { User } from '@prisma/client';
import {
  excludeKeysFromArrayOfObjects,
  excludeProperties,
} from 'src/common/helper/excludeProperties';

@Exclude()
export class UserDto {
  @Expose()
  id: number;

  @Expose()
  username: string;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<any> {
    const { email, username } = data;

    if (!(await isUnique('user', 'username', username))) {
      throw new BadRequestException('Username already taken');
    }

    if (!(await isUnique('user', 'email', email))) {
      throw new BadRequestException('Email address is already taken');
    }

    // Hash password
    const hashedPassword: string = await hashData(data.password);
    data.password = hashedPassword;

    //create user
    const user = await this.prisma.user.create({ data });

    if (user.id) {
      return excludeProperties(user, ['refreshToken', 'password']);
    }
  }

  async findAll(): Promise<any[]> {
    const users = await this.prisma.user.findMany();
    return excludeKeysFromArrayOfObjects(users, ['password', 'refreshToken']);
  }

  async getAll(): Promise<any[]> {
    return await this.prisma.user.findMany();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return this.prisma.$transformer.exclude({
      model: 'User',
      data: user,
      exclude: ['password', 'refreshToken'],
    }) as User;
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { email, username } = updateUserDto;

    if (!(await isUnique('user', 'username', username, id))) {
      throw new BadRequestException('Username already taken');
    }

    if (!(await isUnique('user', 'email', email, id))) {
      throw new BadRequestException('Email address is already taken');
    }

    if (updateUserDto.password) {
      updateUserDto.password = await this.hashData(updateUserDto.password);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    return excludeProperties(user, ['refreshToken', 'password']);
  }

  async remove(id: number) {
    return await this.prisma.user.delete({ where: { id } });
  }

  private hashData(data: string) {
    return argon2.hash(data);
  }
}
