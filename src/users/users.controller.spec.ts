import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { AuthService } from './auth.service';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) =>
        Promise.resolve({
          id,
          email: 'test@gmail.com',
          password: '12345'
        } as User),
      find: (email: string) =>
        Promise.resolve([
          {
            id: 1,
            email,
            password: '12345'
          } as User
        ])
      // remove: () => {},
      // update: () => {}
    };
    fakeAuthService = {
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      }
      // signup: (email: string, password: string) => {}
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return user by id', async () => {
    const user = controller.findUser('1');

    expect(user).toBeDefined();
  });

  it('should throw error if user was not found', async () => {
    fakeUsersService.findOne = () => null;

    await expect(controller.findUser(null)).rejects.toThrow(NotFoundException);
  });

  it('should return list of users by email', async () => {
    const users = await controller.findAllUsers('test@gmail.com');

    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('test@gmail.com');
  });

  it('should update session object and return user after signin', async () => {
    const session = { userId: -10 };
    const user = await controller.signIn(
      { email: 'test@gmail.com', password: '12345' },
      session
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(user.id);
  });
});
