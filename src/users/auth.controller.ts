import { Controller, Post, Delete, Patch, Body, Param } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, LoginUserDto } from './dtos/index';
import { UsersService } from './users.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete('remove/:id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
