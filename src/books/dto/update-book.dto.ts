
/**
 * O UpdateBookDto herda todas as propriedades e validadores do CreateBookDto,
 * mas o `PartialType` automaticamente torna cada um deles opcional.
 * * Isso garante que não precisamos reescrever todas as regras de validação
 * e que o DTO funcione perfeitamente para operações de PATCH.
 */
// src/books/dto/update-book.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';
import { IsOptional, IsNumber, IsString, IsArray } from 'class-validator';
import { ReadingStatus } from '@prisma/client';

export class UpdateBookDto extends PartialType(CreateBookDto) {
  @IsOptional()
  @IsArray()
  genreIds?: number[];

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsNumber()
  year?: number;

  @IsOptional()
  @IsNumber()
  pages?: number;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsString()
  synopsis?: string;

  @IsOptional()
  @IsString()
  cover?: string;

  @IsOptional()
  @IsString()
  status?: ReadingStatus;
}
