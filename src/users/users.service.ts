import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { UserType, ResponseType } from './types/index';
import { LoginUserDto, CreateUserDto, UpdateUserDto } from './dtos';

@Injectable()
export class UsersService {
  private users: UserType[] = []; // -> just for test

  async create(createUserDto: CreateUserDto): Promise<ResponseType> {
    const userExists = this.users.find(
      (user) => user.username === createUserDto.username,
    );
    if (userExists) {
      return { success: false, message: 'Invalid credentials' };
    }

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
      username: newUser.username,
      email: newUser.email,
      id: newUser.id,
    };
  }

  findAll(): ResponseType {
    return {
      success: true,
      users: this.users,
    };
  }

  findOne(id: string): ResponseType {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      return {
        success: false,
        message: 'Invalid credentials',
      };
    }
    return {
      success: true,
      user: user,
    };
  }

  async update(id: string, updateData: UpdateUserDto): Promise<ResponseType> {
    const userIndex = this.users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return {
        success: false,
        message: 'Invalid credentials',
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
      username: this.users[userIndex].username,
      email: this.users[userIndex].email,
      id: this.users[userIndex].id,
    };
  }

  async login(loginUserDto: LoginUserDto): Promise<ResponseType> {
    const user = this.users.find(
      (user) => user.username === loginUserDto.username,
    );

    if (!user) {
      return { success: false, message: 'Invalid credentials' };
    }

    const match = await bcrypt.compare(loginUserDto.password, user.password);
    if (!match) {
      return { success: false, message: 'Invalid credentials' };
    }

    return {
      success: true,
      message: 'successfully logged in',
      username: user.username,
      email: user.email,
      id: user.id,
    };
  }

  remove(id: string): ResponseType {
    const userExists = this.users.find((user) => user.id === id);
    if (!userExists) {
      return {
        success: false,
        message: 'Invalid credentials',
      };
    }
    this.users = this.users.filter((user) => user.id !== id);
    return {
      success: true,
      message: 'User deleted successfully',
    };
  }
}
