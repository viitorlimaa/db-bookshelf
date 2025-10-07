import { ReadingStatus } from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsInt()
  year: number;

  @IsInt()
  @Min(1)
  pages: number;

  @IsNumber({ allowNaN: false })
  @Min(0)
  @Max(5)
  rating: number;

  @IsString()
  @IsNotEmpty()
  synopsis: string;

  // ✅ Agora opcional para PATCH e testes sem URL
  @IsOptional()
  @IsUrl()
  cover?: string;

  @IsInt()
  @Min(0)
  currentPage: number;

  @IsOptional()
  @IsString()
  isbn?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsEnum(ReadingStatus)
  status?: ReadingStatus;

  // ✅ Proteção adicional: só valida array se for fornecido
  @IsOptional()
  @IsArray()
  @ValidateIf((o) => o.genreIds !== undefined)
  @IsInt({ each: true })
  genreIds?: number[];
}
