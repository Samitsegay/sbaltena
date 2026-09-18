import "dotenv/config"
import * as bcrypt from "bcrypt"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({
  adapter,
})

async function main() {
  const email = "admin@baltena.com"
  const password = "admin123"

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.admin.upsert({
    where: { email },
    update: {
      name: "Baltena Admin",
      password: hashedPassword,
    },
    create: {
      name: "Baltena Admin",
      email,
      password: hashedPassword,
    },
  })

  console.log("Admin account created")
  console.log("Email:", email)
  console.log("Password:", password)
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
