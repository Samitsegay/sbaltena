import {
  Injectable,
  UnauthorizedException,
} from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import * as bcrypt from "bcrypt"
import { PrismaService } from "../prisma/prisma.service.js"

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { email },
    })

    if (!admin) {
      throw new UnauthorizedException("Invalid email or password")
    }

    const passwordValid = await bcrypt.compare(
      password,
      admin.password,
    )

    if (!passwordValid) {
      throw new UnauthorizedException("Invalid email or password")
    }

    const token = await this.jwtService.signAsync({
      sub: admin.id,
      email: admin.email,
      role: "admin",
    })

    return {
      access_token: token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    }
  }
}
