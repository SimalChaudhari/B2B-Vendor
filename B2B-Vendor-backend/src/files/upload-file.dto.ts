// // src/files/dto/upload-file.dto.ts
// import { IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';

// export class UploadFileDto {
//   @IsNotEmpty()
//   @IsString()
//   itemId!: string;

//   @IsOptional()
//   @IsArray()
//   @IsString({ each: true }) // Allows an array of strings
//   productImages?: string[];

//   @IsOptional()
//   @IsArray()
//   @IsString({ each: true }) // Allows an array of strings
//   dimensionalFiles?: string[];
// }
