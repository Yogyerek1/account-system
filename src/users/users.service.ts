import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { UserType } from './types/user';
import { LoginUserDto, CreateUserDto, UpdateUserDto } from './dtos';

@Injectable()
export class UsersService {
  private users: UserType[] = []; // -> just for test

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser: UserType = {
      id: uuidv4(),
      ...createUserDto,
      password: hashedPassword,
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

  async update(id: string, updateData: UpdateUserDto) {
    const userIndex = this.users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    const updatedData = updateData.password
      ? { ...updateData, password: await bcrypt.hash(updateData.password, 10) }
      : updateData;

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updatedData,
      updatedAt: new Date(),
    } as UserType;

    return {
      success: true,
      message: 'User updated successfully',
      data: this.users[userIndex],
    };
  }

  login(loginUserDto: LoginUserDto) {
    return loginUserDto;
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
