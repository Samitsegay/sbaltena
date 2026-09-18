import {
  Injectable,
  NotFoundException,
} from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service.js"

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.product.findMany({
      include: {
        category: true,
        variants: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }

  async findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: true,
      },
    })
  }

  async create(data: {
    name: string
    slug: string
    description?: string
    image?: string
    categoryId?: number
    variants?: {
      size: string
      price: number
      stock?: number
    }[]
  }) {
    return this.prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        image: data.image,
        categoryId: data.categoryId,
        variants: data.variants
          ? {
              create: data.variants.map((variant) => ({
                size: variant.size,
                price: variant.price,
                stock: variant.stock ?? 0,
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        variants: true,
      },
    })
  }

  async update(
    id: number,
    data: {
      name?: string
      slug?: string
      description?: string
      image?: string
      categoryId?: number
    },
  ) {
    return this.prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
        variants: true,
      },
    })
  }

  async remove(id: number) {
    return this.prisma.product.delete({
      where: { id },
    })
  }

  async addVariant(
    productId: number,
    data: {
      size: string
      price: number
      stock?: number
    },
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      throw new NotFoundException("Product not found")
    }

    return this.prisma.productVariant.create({
      data: {
        productId,
        size: data.size,
        price: data.price,
        stock: data.stock ?? 0,
      },
    })
  }

  async updateVariant(
    variantId: number,
    data: {
      size?: string
      price?: number
      stock?: number
    },
  ) {
    return this.prisma.productVariant.update({
      where: { id: variantId },
      data,
    })
  }

  async removeVariant(variantId: number) {
    return this.prisma.productVariant.delete({
      where: { id: variantId },
    })
  }
}
