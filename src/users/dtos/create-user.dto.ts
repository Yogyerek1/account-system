import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(5)
  @MaxLength(30)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  password: string;

  @IsEmail()
  email: string;
}
