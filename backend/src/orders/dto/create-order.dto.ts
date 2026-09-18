import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from "class-validator"
import { Type } from "class-transformer"

export class CreateOrderItemDto {
  @IsInt()
  @Min(1)
  variantId: number

  @IsInt()
  @Min(1)
  quantity: number
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  customerName: string

  @IsString()
  @IsNotEmpty()
  phone: string

  @IsOptional()
  @IsString()
  region?: string

  @IsOptional()
  @IsString()
  city?: string

  @IsOptional()
  @IsString()
  subCity?: string

  @IsOptional()
  @IsString()
  woreda?: string

  @IsOptional()
  @IsString()
  houseNumber?: string

  @IsOptional()
  @IsString()
  address?: string

  @IsOptional()
  @IsString()
  note?: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[]
}
