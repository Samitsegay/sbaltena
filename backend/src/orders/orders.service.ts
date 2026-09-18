import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service.js"

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    customerName: string
    phone: string
    region?: string
    city?: string
    subCity?: string
    woreda?: string
    houseNumber?: string
    address?: string
    note?: string
    items: {
      variantId: number
      quantity: number
    }[]
  }) {
    if (!data.customerName?.trim()) {
      throw new BadRequestException("Customer name is required")
    }

    if (!data.phone?.trim()) {
      throw new BadRequestException("Phone number is required")
    }

    if (!data.items?.length) {
      throw new BadRequestException("Order must contain at least one item")
    }

    const variantIds = data.items.map((item) => item.variantId)

    const variants = await this.prisma.productVariant.findMany({
      where: {
        id: {
          in: variantIds,
        },
      },
      include: {
        product: true,
      },
    })

    if (variants.length !== variantIds.length) {
      throw new BadRequestException("One or more products are no longer available")
    }

    let total = 0

    const orderItems = data.items.map((item) => {
      if (item.quantity < 1) {
        throw new BadRequestException("Quantity must be at least 1")
      }

      const variant = variants.find(
        (value) => value.id === item.variantId
      )

      if (!variant) {
        throw new BadRequestException(
          `Variant ${item.variantId} was not found`
        )
      }

      if (variant.stock < item.quantity) {
        throw new BadRequestException(
          `${variant.product.name} (${variant.size}) does not have enough stock`
        )
      }

      const price = Number(variant.price)

      total += price * item.quantity

      return {
        productId: variant.productId,
        productName: variant.product.name,
        size: variant.size,
        quantity: item.quantity,
        price: variant.price,
        variantId: variant.id,
      }
    })

    const orderNumber =
      "BM-" + Date.now().toString().slice(-8)

    const order = await this.prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          customerName: data.customerName.trim(),
          phone: data.phone.trim(),

          region: data.region?.trim() || null,
          city: data.city?.trim() || null,
          subCity: data.subCity?.trim() || null,
          woreda: data.woreda?.trim() || null,
          houseNumber: data.houseNumber?.trim() || null,
          address: data.address?.trim() || null,
          note: data.note?.trim() || null,

          total,
          items: {
            create: orderItems.map((item) => ({
              productId: item.productId,
              productName: item.productName,
              size: item.size,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: true,
        },
      })

      for (const item of orderItems) {
        await tx.productVariant.update({
          where: {
            id: item.variantId,
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        })
      }

      return createdOrder
    })

    return order
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }

  async findOne(orderNumber: string) {
    const order = await this.prisma.order.findUnique({
      where: {
        orderNumber,
      },
      include: {
        items: true,
      },
    })

    if (!order) {
      throw new NotFoundException("Order not found")
    }

    return order
  }

  async updateStatus(id: number, status: string) {
    const allowedStatuses = [
      "pending",
      "processing",
      "fulfilled",
      "cancelled",
    ]

    if (!allowedStatuses.includes(status)) {
      throw new BadRequestException("Invalid order status")
    }

    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
    })

    if (!order) {
      throw new NotFoundException("Order not found")
    }

    return this.prisma.order.update({
      where: {
        id,
      },
      data: {
        status,
      },
      include: {
        items: true,
      },
    })
  }
}
