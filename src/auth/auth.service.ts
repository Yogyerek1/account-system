import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

export type JwtPayload = {
  sub: string;
  username: string;
  iat?: number;
  exp?: number;
};

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private jwtService: JwtService) {}

  generateToken(userId: string, username: string): { access_token: string } {
    const payload = { sub: userId, username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  validateToken(token: string): JwtPayload {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      return payload;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        this.logger.warn('Token validation failed: Token has expired');
        throw new UnauthorizedException('Token has expired');
      }

      if (error instanceof JsonWebTokenError) {
        this.logger.warn(
          'Token validation failed: Invalid token signature or malformed token',
        );
        throw new UnauthorizedException('Invalid token');
      }

      this.logger.error('Token validation failed with unexpected error', error);
      throw new UnauthorizedException('Token validation failed');
    }
  }
}
