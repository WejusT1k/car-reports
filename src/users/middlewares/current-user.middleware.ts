import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { UsersService } from '../users.service';
import { User } from '../user.entity';

interface CustomRequest extends Request {
  session: {
    userId: number;
  } & Request['session'];
  currentUser: User;
}

@Injectable()
export class CurrentuserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(
    req: CustomRequest,
    res: Response,
    next: (error?: NextFunction) => void
  ) {
    const { userId } = req.session || {};
    if (userId) {
      const user = await this.usersService.findOne(userId);
      req.currentUser = user;
    }

    next();
  }
}
