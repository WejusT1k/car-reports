import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    const users = await this.usersService.find(email);
    if (users.length > 0)
      throw new BadRequestException('email is already in use');

    const salt = randomBytes(8).toString('hex');
    const hashPassword = (await scrypt(password, salt, 32)) as Buffer;

    const result = salt + '.' + hashPassword.toString('hex');

    const user = await this.usersService.createUser(email, result);

    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);

    if (!user) throw new NotFoundException('user not found');

    const [salt, hash] = user.password.split('.');

    const hashIncomingPassword = (await scrypt(password, salt, 32)) as Buffer;

    if (hash === hashIncomingPassword.toString('hex')) return user;
    else throw new ForbiddenException('invalid credentials');
  }
}
