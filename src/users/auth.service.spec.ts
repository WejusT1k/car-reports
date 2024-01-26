import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException
} from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((u) => u.email === email);
        return Promise.resolve(filteredUsers);
      },
      createUser: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 99999),
          email,
          password
        } as User;
        users.push(user);
        return Promise.resolve(user);
      }
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService
        }
      ]
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return user with salted and hashed password', async () => {
    const user = await service.signup('test@gmail.com', '12345');

    expect(user.password).not.toEqual('12345');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('should throw error if user sign up with email which is already in use', async () => {
    await service.signup('test@gmail.com', '12345');

    await expect(service.signup('test@gmail.com', '12345')).rejects.toThrow(
      BadRequestException
    );
  });

  it('should throw error if user sign in with unused email', async () => {
    await expect(service.signin('test@gmail.com', '12345')).rejects.toThrow(
      NotFoundException
    );
  });

  it('should throw error if user provide invalid password', async () => {
    await service.signup('test@test.com', '123456');

    await expect(service.signin('test@test.com', '12345')).rejects.toThrow(
      ForbiddenException
    );
  });

  it('should return user if correct password is provided', async () => {
    await service.signup('aasdas@asd.test', '12345');

    const user = await service.signin('aasdas@asd.test', '12345');
    expect(user).toBeDefined();
  });
});
