import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/auth.dto';
import { UsersService } from 'src/users/users.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import type { Payload } from 'src/types/payload.type';

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
      phoneNumber: user.phoneNumber,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isSuperAdmin: user.isSuperAdmin,
      avatar: user.avatarURL,
    };

    const EXPIRE_TIME = 5 * 60 * 60 * 1000;

    return {
      user,
      backendTokens: {
        accessToken: await this.jwtService.signAsync(payload, {
          expiresIn: '5h',
          secret: process.env.JWT_SECRET_KEY,
        }),
        refreshToken: await this.jwtService.signAsync(payload, {
          expiresIn: '7d',
          secret: process.env.JWT_REFRESH_TOKEN_KEY,
        }),
        expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
      },
    };
  }

  private async validateUser(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Your credentials are invalid');
    }

    const isSamePassword = await compare(dto.password, user.password);
    if (!isSamePassword) {
      throw new UnauthorizedException('Your credentials are invalid');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Your account is deactivated');
    }

    if (!user.isEmailVerified) {
      throw new ConflictException('Your email is not verified');
    }

    const { password, isEmailVerified, isPhoneVerified, isActive, ...result } =
      user;
    return result;
  }

  async refreshToken(user: Payload) {
    const payload: Payload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      role: user.role,
      isSuperAdmin: user.isSuperAdmin,
      avatar: user.avatar,
    };

    const EXPIRE_TIME = 5 * 60 * 60 * 1000;

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: '5h',
        secret: process.env.JWT_SECRET_KEY,
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: process.env.JWT_REFRESH_TOKEN_KEY,
      }),
      expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
    };
  }
}
