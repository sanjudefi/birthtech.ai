import {
  IsNumber,
  IsDateString,
  IsOptional,
  IsString,
  IsArray,
  Min,
  Max,
  IsIn,
} from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(9)
  pregnancyMonth?: number;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsNumber()
  @Min(100)
  @Max(250)
  heightCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(200)
  weightKg?: number;

  @IsOptional()
  @IsString()
  @IsIn(['veg', 'non-veg', 'vegan'])
  dietPreference?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allergies?: string[];
}
