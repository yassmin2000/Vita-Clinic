import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { hash } from 'bcrypt';
import type { Role } from '@prisma/client';

import { PrismaService } from 'src/prisma.service';
import { OtpService } from 'src/otp/otp.service';

import {
  CreateUserDto,
  GetAllUsersQuery,
  ResendEmailVerificationDto,
  ResendPhoneVerificationDto,
  VerifyUserEmailDto,
  VerifyUserPhoneDto,
} from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private otp: OtpService,
  ) {}

  async findAll(
    role: Role,
    {
      page = 1,
      limit = 10,
      sex = 'all',
      value = '',
      sort = 'createdAt-desc',
    }: GetAllUsersQuery,
  ) {
    const names = value.split(' ');
    const mode = 'insensitive' as 'insensitive';
    const [sortField, sortOrder] = sort.split('-') as [string, 'desc' | 'asc'];

    const nameConditions = names.flatMap((name) => [
      {
        firstName: {
          contains: name,
          mode,
        },
      },
      {
        lastName: {
          contains: name,
          mode,
        },
      },
    ]);

    return this.prisma.user.findMany({
      where: {
        role,
        sex: sex === 'all' ? undefined : sex,
        OR: [
          ...nameConditions,
          {
            email: {
              contains: value,
              mode,
            },
          },
        ],
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        avatarURL: true,
        birthDate: true,
        sex: true,
        isSuperAdmin: true,
        speciality: {
          select: {
            id: true,
            name: true,
          },
        },
        emr: {
          select: {
            id: true,
            bloodType: true,
          },
        },
        address: true,
        createdAt: true,
        updatedAt: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [
        {
          firstName: sortField === 'name' ? sortOrder : undefined,
        },
        {
          lastName: sortField === 'name' ? sortOrder : undefined,
        },
        {
          birthDate: sortField === 'birthDate' ? sortOrder : undefined,
        },
        {
          createdAt: sortField === 'createdAt' ? sortOrder : undefined,
        },
      ],
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        emr: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string, skipError?: boolean) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (skipError) {
      return user;
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByPhone(phone: string, skipError?: boolean) {
    const user = await this.prisma.user.findUnique({
      where: { phoneNumber: phone },
    });

    if (skipError) {
      return user;
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(
    dto: CreateUserDto,
    role: Role = 'patient',
    verified: boolean = false,
  ) {
    const isEmailExist = await this.findByEmail(dto.email, true);

    if (isEmailExist) {
      throw new ConflictException('Email already exists');
    }

    const isPhoneExist = await this.findByPhone(dto.phoneNumber, true);

    if (isPhoneExist) {
      throw new ConflictException('Phone number already exists');
    }

    const { weight, height, bloodType, ...userDto } = dto;

    if (role === 'doctor' && !dto.specialityId) {
      throw new UnprocessableEntityException(
        'Speciality ID is required for doctor role',
      );
    }

    if (dto.specialityId) {
      const speciality = await this.prisma.speciality.findUnique({
        where: {
          id: dto.specialityId,
        },
      });

      if (!speciality) {
        throw new NotFoundException('Speciality not found');
      }
    }

    const newUser = await this.prisma.user.create({
      data: {
        ...userDto,
        role,
        isSuperAdmin: false,
        password: await hash(dto.password, 10),
        isEmailVerified: verified,
        isPhoneVerified: verified,
      },
    });

    if (role === 'patient') {
      await this.prisma.electronicMedicalRecord.create({
        data: {
          patientId: newUser.id,
          height,
          weight,
          bloodType,
        },
      });
    }

    if (!verified) {
      await this.otp.create(newUser.id, 'email');
    }

    const { password, isEmailVerified, isPhoneVerified, ...result } = newUser;

    return result;
  }

  async changeRole(id: string, role: Role) {
    return this.prisma.user.update({
      where: { id },
      data: { role },
    });
  }

  async verifyEmail(dto: VerifyUserEmailDto) {
    const user = await this.findByEmail(dto.email);

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

    if (user.isEmailVerified) {
      throw new ConflictException('Email is already verified');
    }

    await this.otp.create(user.id, 'email');

    return { message: 'OTP sent successfully' };
  }

  async verifyPhone(dto: VerifyUserPhoneDto) {
    const user = await this.findByPhone(dto.phoneNumber);

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

    if (user.isPhoneVerified) {
      throw new ConflictException('Phone number is already verified');
    }

    await this.otp.create(user.id, 'phone');

    return { message: 'OTP sent successfully' };
  }
}
