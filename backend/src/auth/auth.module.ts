import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { AuthController } from "./auth.controller.js"
import { AuthService } from "./auth.service.js"
import { AdminAuthGuard } from "./admin-auth.guard.js"

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || "baltena-market-admin-secret-2026",
      signOptions: {
        expiresIn: "1d",
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AdminAuthGuard],
  exports: [JwtModule, AdminAuthGuard],
})
export class AuthModule {}