import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { diskStorage } from "multer"
import { extname } from "path"
import { AdminAuthGuard } from "./auth/admin-auth.guard.js"

@Controller("uploads")
export class UploadsController {
  @Post("product-image")
  @UseGuards(AdminAuthGuard)
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads/products",
        filename: (_req, file, callback) => {
          const uniqueName =
            `${Date.now()}-${Math.round(Math.random() * 1e9)}` +
            extname(file.originalname)

          callback(null, uniqueName)
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: (_req, file, callback) => {
        if (!file.mimetype.startsWith("image/")) {
          return callback(new Error("Only image files are allowed"), false)
        }

        callback(null, true)
      },
    }),
  )
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error("No image uploaded")
    }

    return {
      url: `/uploads/products/${file.filename}`,
      filename: file.filename,
    }
  }
}

