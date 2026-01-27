import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type JwtPayload = {
  userId: string;
  username: string;
};

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest<{ user: JwtPayload }>();
    return request.user;
  },
);
