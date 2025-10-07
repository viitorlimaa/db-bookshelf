// src/books/dto/create-book.dto.ts
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

  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @IsString()
  @IsNotEmpty()
  synopsis: string;

  @IsUrl()
  cover: string;

  @IsInt()
  @Min(0)
  currentPage: number;

  @IsString()
  @IsOptional()
  isbn?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsOptional()
  @IsEnum(ReadingStatus)
  status?: ReadingStatus;

  // Relacionamento com gêneros via IDs
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  genreIds?: number[];
}
