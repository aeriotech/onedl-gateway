import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { UserController } from './user.controller';

jest.mock('@prisma/client');

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController, PrismaService],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Create user', () => {
    it('should create a new user and return the object', async () => {
      const registerDto: RegisterDto = {
        username: 'thetestuser',
        email: 'testuser@thetestuniverse.com',
        password: 'theAmazingTestPassword123',
        firstName: 'Test',
        lastName: 'User',
      };

      const user = await controller.register(registerDto);

      expect(user).toEqual({
        username: registerDto.username,
        email: registerDto.email,
        role: Role.USER,
      });
    });
  });
});
