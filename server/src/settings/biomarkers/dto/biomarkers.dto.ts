import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateBiomarkerDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNumber()
    minimumValue: number;

    @IsNumber()
    maximumValue: number;

    @IsString()
    unit: string;
}

export class UpdateBiomarkerDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    minimumValue?: number;

    @IsOptional()
    @IsNumber()
    maximumValue?: number;

    @IsOptional()
    @IsString()
    unit?: string;
}