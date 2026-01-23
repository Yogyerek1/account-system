import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserType } from './types/user';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  private users: UserType[] = []; // -> just for test

  create(createUserDto: CreateUserDto) {
    const newUser: UserType = {
      id: uuidv4(),
      ...createUserDto,
      createdAt: new Date(),
    };
    this.users.push(newUser);
    return {
      success: true,
      message: 'User created successfully',
      data: newUser,
    };
  }

  findAll() {
    return {
      success: true,
      data: this.users,
    };
  }

  findOne(id: string) {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }
    return {
      success: true,
      data: user,
    };
  }

  update(id: string, updateData: UpdateUserDto) {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return {
        success: false,
        message: 'User not found',
      };
    }
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updateData,
      updatedAt: new Date(),
    } as UserType;
    return {
      success: true,
      message: 'User updated successfully',
      data: this.users[userIndex],
    };
  }

  remove(id: string) {
    const userExists = this.users.find((user) => user.id === id);
    if (!userExists) {
      return {
        success: false,
        message: 'User not found',
      };
    }
    this.users = this.users.filter((user) => user.id !== id);
    return {
      success: true,
      message: 'User deleted successfully',
    };
  }
}
