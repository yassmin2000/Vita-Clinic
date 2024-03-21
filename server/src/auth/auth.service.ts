import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/auth.dto';
import { UsersService } from 'src/users/users.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Payload } from 'src/types/payload.type';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto);

    const payload: Payload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      avatar: user.avatarURL,
    };

    const EXPIRE_TIME = 5 * 60 * 60 * 1000;

    return {
      user,
      backendTokens: {
        accessToken: await this.jwtService.signAsync(payload, {
          expiresIn: '5h',
          secret: process.env.jwtSecretKey,
        }),
        refreshToken: await this.jwtService.signAsync(payload, {
          expiresIn: '7d',
          secret: process.env.jwtRefreshTokenKey,
        }),
        expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
      },
    };
  }

  async validateUser(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isSamePassword = await compare(dto.password, user.password);
    if (!isSamePassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('Email is not verified');
    }

    const { password, otp, isVerified, ...result } = user;
    return result;
  }

  async refreshToken(user: any) {
    const payload = {
      username: user.username,
      sub: user.sub,
    };

    const EXPIRE_TIME = 5 * 60 * 60 * 1000;

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: '5h',
        secret: process.env.jwtSecretKey,
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: process.env.jwtRefreshTokenKey,
      }),
      expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
    };
  }
}
