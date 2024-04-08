
import { IsString, IsOptional} from 'class-validator';


export class CreateAllergyDto {
    @IsString()
    allergy: string;

    @IsString()
    description?: string;
}

export class UpdateAllergyDto {
    @IsOptional()
    @IsString()
    allergy?: string;

    @IsOptional()
    @IsString()
    description?: string;
}