import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MaxLength(1000)
  caption!: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  video?: string;
}