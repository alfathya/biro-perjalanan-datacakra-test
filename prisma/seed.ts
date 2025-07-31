import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const adminEmail = process.env.ADMIN_EMAIL || "admin@mlakumulu.com";
  
  const password = await bcrypt.hash(adminPassword, 10);

  const existingAdmin = await prisma.user.findFirst({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        password,
        firstName: "Super",
        lastName: "Admin",
        role: Role.admin,
        isActive: true,
      },
    });

    console.log("Admin user created");
  } else {
    console.log("Admin already exists");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
