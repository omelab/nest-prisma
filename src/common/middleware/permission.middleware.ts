import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class PermissionMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { user } = req;
    // const { permission } = req.params;
    console.log(user);

    // const userRoles = await this.prisma.user.findUnique({
    //   where: { id: user.userId },
    //   include: { roles: { include: { permissions: true } } },
    // }).roles;

    // const hasPermission = userRoles.some((role) =>
    //   role.permissions.some((p) => p.name === permission),
    // );

    // if (!hasPermission) {
    //   return res.status(403).json({ message: 'Forbidden' });
    // }

    next();
  }
}
