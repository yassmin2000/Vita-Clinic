import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import type { Role } from '@prisma/client';

import { PrismaService } from 'src/prisma.service';
import { OtpService } from 'src/otp/otp.service';
import { LogService } from 'src/log/log.service';

import {
  CreateUserDto,
  GetAllUsersQuery,
  ResendEmailVerificationDto,
  ResendPhoneVerificationDto,
  UpdateAvatarDto,
  UpdatePasswordDto,
  UpdateSettingsDto,
  VerifyUserEmailDto,
  VerifyUserPhoneDto,
} from './dto/users.dto';
import {
  BasicUserDto,
  UpdateUserAvatarResponseDto,
  UpdateUserPasswordResponseDto,
  UpdateUserRoleResponseDto,
  UpdateUserSettingsResponseDto,
  UserDto,
  UserListItemDto,
  UserProfileDto,
  UserReturnDto,
  UserWithEmrDto,
} from './dto/users-response.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private otp: OtpService,
    private logService: LogService,
  ) {}

  async findAll(
    isSuperAdmin: boolean,
    role: Role,
    {
      page = 1,
      limit = 10,
      sex = 'all',
      status = 'all',
      value = '',
      sort = 'createdAt-desc',
    }: GetAllUsersQuery,
  ): Promise<UserListItemDto[]> {
    const names = value.split(' ');
    const mode = 'insensitive' as const;
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
        isEmailVerified: true,
        isActive: isSuperAdmin
          ? status === 'all'
            ? undefined
            : status === 'active'
          : true,
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
        ssn: true,
        isSuperAdmin: true,
        isActive: true,
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
            insurance: true,
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
        {
          isActive: sortField === 'isActive' ? sortOrder : undefined,
        },
      ],
    });
  }

  async findAllList(role: Role): Promise<BasicUserDto[]> {
    return this.prisma.user.findMany({
      where: {
        role,
        isEmailVerified: true,
        isActive: true,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });
  }

  async findById(id: string): Promise<UserWithEmrDto> {
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

  async findByEmail(email: string, skipError?: boolean): Promise<UserDto> {
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

  async findProfileById(
    userId: string,
    isSuperAdmin: boolean,
  ): Promise<UserProfileDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
        isEmailVerified: true,
        isActive: isSuperAdmin ? undefined : true,
      },
      include: {
        speciality: true,
        _count: {
          select: {
            doctorAppointments: true,
            patientAppointments: true,
          },
        },
        emr: {
          select: {
            id: true,
            insurance: true,
            appointments: {
              select: {
                _count: {
                  select: {
                    reports: true,
                    scans: true,
                    prescriptions: true,
                    treatments: true,
                    laboratoryTestResults: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    const profile = {
      id: user.id,
      role: user.role,
      isSuperAdmin: user.isSuperAdmin,
      firstName: user.firstName,
      lastName: user.lastName,
      sex: user.sex,
      specialityId: user.role === 'doctor' ? user.speciality.id : null,
      speciality: user.role === 'doctor' ? user.speciality.name : null,
      address: user.address,
      email: user.email,
      phoneNumber: user.phoneNumber,
      ssn: user.ssn,
      avatarURL: user.avatarURL,
      birthDate: user.birthDate,
      createdAt: user.createdAt,
      isActive: user.isActive,
      emrId: user.role === 'patient' && user.emr ? user.emr.id : null,
      insurance:
        user.role === 'patient' && user.emr ? user.emr.insurance : null,
      appointments:
        user.role === 'doctor'
          ? user._count.doctorAppointments
          : user.role === 'patient'
            ? user._count.patientAppointments
            : 0,
      reports:
        user.role === 'patient' && user.emr
          ? user.emr.appointments.reduce(
              (acc, appointment) => acc + appointment._count.reports,
              0,
            )
          : 0,
      scans:
        user.role === 'patient' && user.emr
          ? user.emr.appointments.reduce(
              (acc, appointment) => acc + appointment._count.scans,
              0,
            )
          : 0,
      prescriptions:
        user.role === 'patient' && user.emr
          ? user.emr.appointments.reduce(
              (acc, appointment) => acc + appointment._count.prescriptions,
              0,
            )
          : 0,
      treatments:
        user.role === 'patient' && user.emr
          ? user.emr.appointments.reduce(
              (acc, appointment) => acc + appointment._count.treatments,
              0,
            )
          : 0,
      laboratoryTestResults:
        user.role === 'patient' && user.emr
          ? user.emr.appointments.reduce(
              (acc, appointment) =>
                acc + appointment._count.laboratoryTestResults,
              0,
            )
          : 0,
    };

    return profile;
  }

  async create(
    dto: CreateUserDto,
    role: Role = 'patient',
    verified: boolean = false,
    userId?: string,
  ): Promise<UserReturnDto> {
    const isEmailExist = await this.findByEmail(dto.email, true);

    if (isEmailExist) {
      throw new ConflictException('Email already exists');
    }

    const isPhoneExist = await this.findByPhone(dto.phoneNumber, true);

    if (isPhoneExist) {
      throw new ConflictException('Phone number already exists');
    }

    const isSSNExist = await this.prisma.user.findUnique({
      where: {
        ssn: dto.ssn,
      },
    });

    if (isSSNExist) {
      throw new ConflictException('SSN already exists');
    }

    const {
      weight,
      height,
      bloodType,
      smokingStatus,
      alcoholStatus,
      drugsUsage,
      insurance,
      ...userDto
    } = dto;

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
      const emr = await this.prisma.electronicMedicalRecord.create({
        data: {
          patientId: newUser.id,
          height,
          weight,
          bloodType,
          smokingStatus,
          alcoholStatus,
          drugsUsage,
        },
      });

      if (insurance) {
        await this.prisma.insurance.create({
          data: {
            ...insurance,
            emrId: emr.id,
          },
        });
      }
    }

    if (!verified) {
      await this.otp.create(
        newUser.id,
        'email',
        newUser.firstName,
        newUser.email,
        newUser.phoneNumber,
      );
    }

    const { password, isEmailVerified, isPhoneVerified, ...result } = newUser;

    if (userId) {
      await this.logService.create({
        userId,
        targetId: newUser.id,
        targetName: `${newUser.firstName} ${newUser.lastName}`,
        type: newUser.role,
        action: 'create',
      });
    }

    return result;
  }

  async deactivate(id: string, userId: string): Promise<BasicUserDto> {
    const user = await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });

    await this.logService.create({
      userId,
      targetId: user.id,
      targetName: `${user.firstName} ${user.lastName}`,
      type: 'user',
      action: 'deactivate',
    });

    return user;
  }

  async activate(id: string, userId: string): Promise<BasicUserDto> {
    const user = await this.prisma.user.update({
      where: { id },
      data: { isActive: true },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });

    await this.logService.create({
      userId,
      targetId: user.id,
      targetName: `${user.firstName} ${user.lastName}`,
      type: 'user',
      action: 'activate',
    });

    return user;
  }

  async changeRole(id: string, role: Role): Promise<UpdateUserRoleResponseDto> {
    return this.prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        role: true,
      },
    });
  }

  async verifyEmail(dto: VerifyUserEmailDto): Promise<UserReturnDto> {
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

  async resendEmailVerification(dto: ResendEmailVerificationDto): Promise<{
    message: string;
  }> {
    const user = await this.findByEmail(dto.email);

    if (user.isEmailVerified) {
      throw new ConflictException('Email is already verified');
    }

    await this.otp.create(
      user.id,
      'email',
      user.firstName,
      user.email,
      user.phoneNumber,
    );

    return { message: 'OTP sent successfully' };
  }

  async verifyPhone(dto: VerifyUserPhoneDto): Promise<UserReturnDto> {
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

  async resendPhoneVerification(dto: ResendPhoneVerificationDto): Promise<{
    message: string;
  }> {
    const user = await this.findByPhone(dto.phoneNumber);

    if (user.isPhoneVerified) {
      throw new ConflictException('Phone number is already verified');
    }

    await this.otp.create(
      user.id,
      'phone',
      user.firstName,
      user.email,
      user.phoneNumber,
    );

    return { message: 'OTP sent successfully' };
  }

  async updateAvatar(
    userId: string,
    updateAvatarDto: UpdateAvatarDto,
  ): Promise<UpdateUserAvatarResponseDto> {
    const user = await this.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        avatarURL: updateAvatarDto.avatarURL,
      },
      select: {
        id: true,
        avatarURL: true,
      },
    });
  }

  async updatePassword(
    userId: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<UpdateUserPasswordResponseDto> {
    const user = await this.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isSamePassword = await compare(
      updatePasswordDto.currentPassword,
      user.password,
    );

    if (!isSamePassword) {
      throw new ConflictException('Current password is incorrect');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        password: await hash(updatePasswordDto.newPassword, 10),
      },
      select: {
        id: true,
      },
    });
  }

  async updateSettings(
    userId: string,
    updateSettingsDto: UpdateSettingsDto,
  ): Promise<UpdateUserSettingsResponseDto> {
    const user = await this.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: updateSettingsDto,
      select: {
        enableDicomCaching: true,
        enableDicomCompression: true,
        enableDicomCleanup: true,
        cleanupDuration: true,
      },
    });
  }
}
