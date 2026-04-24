import {
  IsString,
  IsOptional,
  IsBoolean,
  IsObject,
  ValidateNested,
  IsNumber,
  Min,
  Max,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
export class CoordenadasDto {
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  lng: number;
}

export class UbicacionDto {
  @IsString()
  direccion: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CoordenadasDto)
  coordenadas?: CoordenadasDto;
}

export class CreateInstalacionDto {
  @IsString()
  nombre_instalacion: string;

  @IsString()
  nombre_registrador: string;

  @IsObject()
  @ValidateNested()
  @Type(() => UbicacionDto)
  ubicacion: UbicacionDto;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  foto?: string;

  @IsString()
  responsable: string;

  @IsOptional()
  @IsArray()
  personal_asignado?: string[];

  @IsOptional()
  @IsBoolean()
  activa?: boolean;

  @IsString()
  creado_por: string;
}

export class UpdateInstalacionDto {
  @IsOptional()
  @IsString()
  nombre_instalacion?: string;

  @IsOptional()
  @IsString()
  nombre_registrador?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UbicacionDto)
  ubicacion?: UbicacionDto;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  foto?: string;

  @IsOptional()
  @IsString()
  responsable?: string;

  @IsOptional()
  @IsArray()
  personal_asignado?: string[];

  @IsOptional()
  @IsBoolean()
  activa?: boolean;
}

export class CreateAreaInstalacionDto {
  @IsString()
  nombre_area: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsString()
  id_instalacion: string;

  @IsString()
  creado_por: string;
}

export class UpdateAreaInstalacionDto {
  @IsOptional()
  @IsString()
  nombre_area?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
