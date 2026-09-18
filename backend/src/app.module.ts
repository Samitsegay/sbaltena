import { Module } from "@nestjs/common"
import { ServeStaticModule } from "@nestjs/serve-static"
import { join } from "path"

import { AppController } from "./app.controller.js"
import { AppService } from "./app.service.js"
import { PrismaModule } from "./prisma/prisma.module.js"
import { AuthModule } from "./auth/auth.module.js"
import { ProductsModule } from "./products/products.module.js"
import { CategoriesModule } from "./categories/categories.module.js"
import { OrdersModule } from "./orders/orders.module.js"
import { UploadsController } from "./uploads.controller.js"

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), "uploads"),
      serveRoot: "/uploads",
    }),

    PrismaModule,
    AuthModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
  ],

  controllers: [
    AppController,
    UploadsController,
  ],

  providers: [
    AppService,
  ],
})
export class AppModule {}
