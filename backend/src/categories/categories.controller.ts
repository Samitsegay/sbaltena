import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common"
import { CategoriesService } from "./categories.service.js"
import { AdminAuthGuard } from "../auth/admin-auth.guard.js"

@Controller("categories")
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
  ) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll()
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id)
  }

  @UseGuards(AdminAuthGuard)
  @Post()
  create(
    @Body()
    body: {
      name: string
      slug: string
    },
  ) {
    return this.categoriesService.create(body)
  }

  @UseGuards(AdminAuthGuard)
  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body()
    body: {
      name?: string
      slug?: string
    },
  ) {
    return this.categoriesService.update(id, body)
  }

  @UseGuards(AdminAuthGuard)
  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.categoriesService.remove(id)
  }
}
