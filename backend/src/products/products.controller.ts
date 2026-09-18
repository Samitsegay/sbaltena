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
import { ProductsService } from "./products.service.js"
import { AdminAuthGuard } from "../auth/admin-auth.guard.js"

@Controller("products")
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
  ) {}

  @Get()
  findAll() {
    return this.productsService.findAll()
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.productsService.findOne(id)
  }

  @UseGuards(AdminAuthGuard)
  @Post()
  create(@Body() body: any) {
    return this.productsService.create(body)
  }

  @UseGuards(AdminAuthGuard)
  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: any,
  ) {
    return this.productsService.update(id, body)
  }

  @UseGuards(AdminAuthGuard)
  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.productsService.remove(id)
  }

  @UseGuards(AdminAuthGuard)
  @Post(":id/variants")
  addVariant(
    @Param("id", ParseIntPipe) id: number,
    @Body()
    body: {
      size: string
      price: number
      stock?: number
    },
  ) {
    return this.productsService.addVariant(id, body)
  }

  @UseGuards(AdminAuthGuard)
  @Patch("variants/:variantId")
  updateVariant(
    @Param("variantId", ParseIntPipe) variantId: number,
    @Body()
    body: {
      size?: string
      price?: number
      stock?: number
    },
  ) {
    return this.productsService.updateVariant(variantId, body)
  }

  @UseGuards(AdminAuthGuard)
  @Delete("variants/:variantId")
  removeVariant(
    @Param("variantId", ParseIntPipe) variantId: number,
  ) {
    return this.productsService.removeVariant(variantId)
  }
}
