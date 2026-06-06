import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await hash("admin123!", 12);
  const admin = await db.user.upsert({
    where: { email: "admin@nie-danmark.dk" },
    update: {},
    create: {
      email: "admin@nie-danmark.dk",
      name: "NIE Danmark Admin",
      password: adminPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });

  // Create test customer
  const customerPassword = await hash("kunde123!", 12);
  const customer = await db.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "Test Kunde",
      password: customerPassword,
      role: "CUSTOMER",
      emailVerified: new Date(),
    },
  });

  // Create test application
  const application = await db.application.upsert({
    where: { id: "test-application-1" },
    update: {},
    create: {
      id: "test-application-1",
      userId: customer.id,
      status: "PROCESSING",
      fullName: "Test Kunde",
      email: "test@example.com",
      phone: "+4512345678",
      dateOfBirth: new Date("1985-06-15"),
      passportNumber: "DK12345678",
      address: "Testvej 1",
      city: "Aarhus",
      postalCode: "8000",
      country: "Danmark",
      paymentStatus: "PAID",
      amount: 210,
      currency: "EUR",
    },
  });

  await db.statusHistory.create({
    data: {
      applicationId: application.id,
      status: "RECEIVED",
      note: "Ansøgning modtaget",
      changedBy: admin.id,
    },
  });

  await db.statusHistory.create({
    data: {
      applicationId: application.id,
      status: "PROCESSING",
      note: "Dokumenter kontrolleret og godkendt. Sagen er nu under behandling.",
      changedBy: admin.id,
    },
  });

  console.log("Database seeded successfully!");
  console.log(`Admin: admin@nie-danmark.dk / admin123!`);
  console.log(`Kunde: test@example.com / kunde123!`);
}

main()
  .catch(console.error)
  .finally(async () => await db.$disconnect());
