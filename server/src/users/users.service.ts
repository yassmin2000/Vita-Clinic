import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto, VerifyUserDto } from './dto/users.dto';
import { hash } from 'bcrypt';
import * as randomstring from 'randomstring';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(
    dto: CreateUserDto,
    role: Role = 'patient',
    verified: boolean = false,
  ) {
    const user = await this.findByEmail(dto.email);

    if (user) {
      throw new ConflictException('Email already exists');
    }

    const newUser = await this.prisma.user.create({
      data: {
        ...dto,
        role,
        password: await hash(dto.password, 10),
        otp: verified
          ? null
          : randomstring.generate({ length: 8, charset: 'numeric' }),
        isVerified: verified,
      },
    });

    const { password, otp, isVerified, ...result } = newUser;

    return result;
  }

  async verify(dto: VerifyUserDto) {
    const user = await this.findByEmail(dto.email);

    if (!user) {
      throw new ConflictException('Email does not exist');
    }

    if (user.isVerified) {
      throw new ConflictException('Email is already verified');
    }

    if (user.otp !== dto.otp) {
      throw new ConflictException('Invalid OTP');
    }

    const updatedUser = await this.prisma.user.update({
      where: { email: dto.email },
      data: { isVerified: true, otp: null },
    });

    const { password, otp, isVerified, ...result } = updatedUser;

    return result;
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }
}
