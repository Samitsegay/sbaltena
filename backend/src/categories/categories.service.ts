import { Injectable } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service.js"

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    })
  }

  findOne(id: number) {
    return this.prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            variants: true,
          },
        },
      },
    })
  }

  create(data: { name: string; slug: string }) {
    return this.prisma.category.create({
      data,
    })
  }

  update(
    id: number,
    data: {
      name?: string
      slug?: string
    },
  ) {
    return this.prisma.category.update({
      where: { id },
      data,
    })
  }

  remove(id: number) {
    return this.prisma.category.delete({
      where: { id },
    })
  }
}
