import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserType } from './types/user';

@Injectable()
export class UsersService {
  private users: UserType[] = []; // -> just for test

  create(createUserDto: CreateUserDto) {
    const newUser: UserType = {
      id: this.users.length + 1,
      ...createUserDto,
      createdAt: new Date(),
    };

    this.users.push(newUser);

    return {
      message: 'User created successfully',
      data: newUser,
    };
  }

  findAll() {
    return this.users;
  }

  findOne(id: number) {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      return { message: 'User not found' };
    }
    return user;
  }

  update(id: number) {
    return id;
  }

  remove(id: number) {
    const userExists = this.users.find((user) => user.id === id);

    if (!userExists) {
      return { message: 'User not found' };
    }

    this.users = this.users.filter((user) => user.id !== id);

    return { message: 'User deleted' };
  }
}
