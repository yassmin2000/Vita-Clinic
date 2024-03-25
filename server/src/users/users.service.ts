import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
  CreateUserDto,
  ResendEmailVerificationDto,
  ResendPhoneVerificationDto,
  VerifyUserEmailDto,
  VerifyUserPhoneDto,
} from './dto/users.dto';
import { hash } from 'bcrypt';
import * as randomstring from 'randomstring';
import { Role } from '@prisma/client';
import { OtpService } from 'src/otp/otp.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private otp: OtpService,
  ) {}

  async create(
    dto: CreateUserDto,
    role: Role = 'patient',
    verified: boolean = false,
  ) {
    const isEmailExist = await this.findByEmail(dto.email);

    if (isEmailExist) {
      throw new ConflictException('Email already exists');
    }

    const isPhoneExist = await this.findByPhone(dto.phoneNumber);

    if (isPhoneExist) {
      throw new ConflictException('Phone number already exists');
    }

    const newUser = await this.prisma.user.create({
      data: {
        ...dto,
        role,
        password: await hash(dto.password, 10),
        isEmailVerified: verified,
        isPhoneVerified: verified,
      },
    });

    if (!verified) {
      await this.otp.create(newUser.id, 'email');
    }

    const { password, isEmailVerified, isPhoneVerified, ...result } = newUser;

    return result;
  }

  async verifyEmail(dto: VerifyUserEmailDto) {
    const user = await this.findByEmail(dto.email);

    if (!user) {
      throw new ConflictException('Email does not exist');
    }

    if (user.isEmailVerified) {
      throw new ConflictException('Email is already verified');
    }

    const otp = await this.prisma.otp.findUnique({
      where: {
        userId: user.id,
        otp: dto.otp,
        type: 'email',
        expiryDate: {
          gte: new Date(),
        },
      },
    });

    if (!otp) {
      throw new ConflictException('Invalid OTP');
    }

    await this.prisma.otp.delete({
      where: {
        id: otp.id,
      },
    });

    const updatedUser = await this.prisma.user.update({
      where: { email: dto.email },
      data: { isEmailVerified: true },
    });

    const { password, isEmailVerified, isPhoneVerified, ...result } =
      updatedUser;

    return result;
  }

  async resendEmailVerification(dto: ResendEmailVerificationDto) {
    const user = await this.findByEmail(dto.email);

    if (!user) {
      throw new ConflictException('Email does not exist');
    }

    if (user.isEmailVerified) {
      throw new ConflictException('Email is already verified');
    }

    await this.otp.create(user.id, 'email');

    return { message: 'OTP sent successfully' };
  }

  async verifyPhone(dto: VerifyUserPhoneDto) {
    const user = await this.findByPhone(dto.phoneNumber);

    if (!user) {
      throw new ConflictException('Phone number does not exist');
    }

    if (user.isPhoneVerified) {
      throw new ConflictException('Phone number is already verified');
    }

    const otp = await this.prisma.otp.findUnique({
      where: {
        userId: user.id,
        otp: dto.otp,
        type: 'phone',
        expiryDate: {
          gte: new Date(),
        },
      },
    });

    if (!otp) {
      throw new ConflictException('Invalid OTP');
    }

    await this.prisma.otp.delete({
      where: {
        id: otp.id,
      },
    });

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: { isPhoneVerified: true },
    });

    const { password, isEmailVerified, isPhoneVerified, ...result } =
      updatedUser;

    return result;
  }

  async resendPhoneVerification(dto: ResendPhoneVerificationDto) {
    const user = await this.findByPhone(dto.phoneNumber);

    if (!user) {
      throw new ConflictException('Phone number does not exist');
    }

    if (user.isPhoneVerified) {
      throw new ConflictException('Phone number is already verified');
    }

    await this.otp.create(user.id, 'phone');

    return { message: 'OTP sent successfully' };
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByPhone(phone: string) {
    return await this.prisma.user.findUnique({
      where: { phoneNumber: phone },
    });
  }

  async findById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }
}
