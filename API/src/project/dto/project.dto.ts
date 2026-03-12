import {
  IsString,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  background_story: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsArray()
  @IsString({ each: true })
  skills: string[];

  @IsString()
  @IsNotEmpty()
  problem: string;

  @IsString()
  @IsNotEmpty()
  strategy: string;

  @IsString()
  @IsNotEmpty()
  takeaway: string;

  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsDateString()
  delivery_date: string;
}

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  background_story?: string;

  @IsString()
  @IsOptional()
  role?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skills?: string[];

  @IsString()
  @IsOptional()
  problem?: string;

  @IsString()
  @IsOptional()
  strategy?: string;

  @IsString()
  @IsOptional()
  takeaway?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsDateString()
  @IsOptional()
  delivery_date?: string;
}
