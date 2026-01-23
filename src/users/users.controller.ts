import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('new')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('getAll')
  findAll() {
    return this.usersService.findAll();
  }

  @Get('getById/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(Number(id));
  }

  @Delete('remove/:id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(Number(id));
  }
}
