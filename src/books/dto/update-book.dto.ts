import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';

/**
 * O UpdateBookDto herda todas as propriedades e validadores do CreateBookDto,
 * mas o `PartialType` automaticamente torna cada um deles opcional.
 * * Isso garante que não precisamos reescrever todas as regras de validação
 * e que o DTO funcione perfeitamente para operações de PATCH.
 */
// src/books/dto/update-book.dto.ts
export class UpdateBookDto extends PartialType(CreateBookDto) {}

