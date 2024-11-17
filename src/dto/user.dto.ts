import { IsEmail, MinLength, IsEnum, IsOptional } from "class-validator";
import { UserRole } from "./user.entity";

export class CreateUserDto {
  @IsEmail({}, { message: "Invalid email format" })
  email: string;

  @MinLength(6, { message: "Password must be at least 6 characters long" })
  password: string;

  @IsEnum(UserRole, { message: "Invalid role type" })
  @IsOptional()
  role?: UserRole;
}

export class UpdateUserDto {
  @IsEmail({}, { message: "Invalid email format" })
  @IsOptional()
  email?: string;

  @MinLength(6, { message: "Password must be at least 6 characters long" })
  @IsOptional()
  password?: string;

  @IsEnum(UserRole, { message: "Invalid role type" })
  @IsOptional()
  role?: UserRole;
}