import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common"
import { OrdersService } from "./orders.service.js"
import { CreateOrderDto } from "./dto/create-order.dto.js"
import { AdminAuthGuard } from "../auth/admin-auth.guard.js"

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() data: CreateOrderDto) {
    return this.ordersService.create(data)
  }

  @Get()
  @UseGuards(AdminAuthGuard)
  findAll() {
    return this.ordersService.findAll()
  }

  @Get(":orderNumber")
  findOne(@Param("orderNumber") orderNumber: string) {
    return this.ordersService.findOne(orderNumber)
  }

  @Patch(":id/status")
  @UseGuards(AdminAuthGuard)
  updateStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body("status") status: string
  ) {
    return this.ordersService.updateStatus(id, status)
  }
}
