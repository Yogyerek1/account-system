import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  generateToken(userId: string, username: string): { access_token: string } {
    const payload = { sub: userId, username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  validateToken(token: string): any {
    try {
      return this.jwtService.verify(token);
    } catch {
      return null;
    }
  }
}
