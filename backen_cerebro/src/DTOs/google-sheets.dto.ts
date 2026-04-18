import {
  ArrayUnique,
  IsArray,
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';

export class SaveGoogleConnectionDto {
  @IsEmail()
  email: string;

  @IsString()
  accessToken: string;

  @IsOptional()
  @IsString()
  refreshToken?: string;

  @IsOptional()
  @IsDateString()
  tokenExpiry?: string;

  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  scope?: string;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  areasAsignadas?: string[];
}

export class UpdateGoogleTokenDto {
  @IsString()
  accessToken: string;

  @IsOptional()
  @IsString()
  refreshToken?: string;

  @IsOptional()
  @IsDateString()
  tokenExpiry?: string;
}

export class UpdateGoogleAreasDto {
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  areasAsignadas: string[];
}
