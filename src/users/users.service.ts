import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ResponseType } from './types/index';
import { LoginUserDto, CreateUserDto, UpdateUserDto } from './dtos';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession } from 'mongoose';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<ResponseType> {
    const session: ClientSession = await this.userModel.startSession();
    session.startTransaction();

    try {
      const userExists = await this.userModel
        .findOne({
          username: createUserDto.username,
        })
        .session(session);

      if (userExists) {
        await session.abortTransaction();
        await session.endSession();
        return { success: false, message: 'Invalid credentials' };
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const newUser = await this.userModel.create(
        [
          {
            username: createUserDto.username,
            email: createUserDto.email,
            password: hashedPassword,
          },
        ],
        { session },
      );

      await session.commitTransaction();
      await session.endSession();

      return {
        success: true,
        message: 'User created successfully',
        username: newUser[0].username,
        email: newUser[0].email,
        id: newUser[0]._id.toString(),
      };
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw error;
    }
  }

  async findAll(): Promise<ResponseType> {
    const users = await this.userModel.find().select('-password').exec();

    return {
      success: true,
      users: users,
    };
  }

  async findOne(id: string): Promise<ResponseType> {
    const user = await this.userModel.findById(id).select('-password').exec();

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

  async update(
    id: string,
    updateData: UpdateUserDto,
    currentUserId: string,
  ): Promise<ResponseType> {
    if (id !== currentUserId) {
      return {
        success: false,
        message: 'You can only update your own profile',
      };
    }

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updateUser = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .select('-password')
      .exec();

    if (!updateUser) {
      return {
        success: false,
        message: 'Invalid credentials',
      };
    }

    return {
      success: true,
      message: 'User updated successfully',
      username: updateUser.username,
      email: updateUser.email,
      id: updateUser._id.toString(),
    };
  }

  async login(loginUserDto: LoginUserDto): Promise<ResponseType> {
    const user = await this.userModel
      .findOne({
        username: loginUserDto.username,
      })
      .exec();

    if (!user) {
      return { success: false, message: 'Invalid credentials' };
    }

    const match = await bcrypt.compare(loginUserDto.password, user.password);

    if (!match) {
      return { success: false, message: 'Invalid credentials' };
    }

    const token = this.authService.generateToken(
      user._id.toString(),
      user.username,
    );

    return {
      success: true,
      message: 'successfully logged in',
      username: user.username,
      email: user.email,
      id: user._id.toString(),
      access_token: token.access_token,
    };
  }

  async remove(id: string, currentUserId: string): Promise<ResponseType> {
    if (id !== currentUserId) {
      return {
        success: false,
        message: 'You can only delete your own profile',
      };
    }

    const result = await this.userModel.findByIdAndDelete(id).exec();

    if (!result) {
      return {
        success: false,
        message: 'Invalid credentials',
      };
    }

    return {
      success: true,
      message: 'User deleted successfully',
    };
  }
}
