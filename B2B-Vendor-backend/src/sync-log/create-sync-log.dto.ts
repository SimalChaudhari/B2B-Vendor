import { IsNotEmpty, IsString, IsInt, IsOptional, Min, IsEnum } from 'class-validator';

export class CreateSyncLogDto {
  @IsNotEmpty()
  @IsString()
  sync_type!: string; // 'orders', 'products', etc.

  @IsOptional()
  @IsInt()
  @Min(0)
  success_count?: number; // Default is 0

  @IsOptional()
  @IsInt()
  @Min(0)
  failed_count?: number; // Default is 0

  @IsOptional()
  @IsInt()
  @Min(0)
  total_count?: number; // Default is 0

  @IsNotEmpty()
  @IsEnum(['success', 'fail'], { message: 'Status must be either success or fail' })
  status!: string; // 'success' or 'fail'
}
