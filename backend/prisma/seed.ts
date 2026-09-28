/**
 * Seeds the database with the real Huduma360 category/service catalogue (ported from the
 * original static frontend's data.js) plus a few demo accounts so the app is usable immediately.
 *
 * Run with: npm run seed
 */
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "../src/utils/password";
import seedData from "./seed-data.json";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

interface RawCategory {
  id: string;
  name: string;
  icon: string;
  desc: string;
}

interface RawService {
  id: string;
  categoryId: string;
  name: string;
  desc: string;
  fee: number;
  processingTime: string;
  eligibility: string[];
  documents: string[];
  steps: string[];
  popular: boolean;
}

const categories = seedData.CATEGORIES as RawCategory[];
const services = seedData.SERVICES as RawService[];

async function main() {
  console.log(`Seeding ${categories.length} categories and ${services.length} services...`);

  const categoryIdMap = new Map<string, string>(); // original slug -> DB id

  for (const [index, cat] of categories.entries()) {
    const created = await prisma.category.upsert({
      where: { slug: cat.id },
      update: { name: cat.name, description: cat.desc, icon: cat.icon, sortOrder: index },
      create: { slug: cat.id, name: cat.name, description: cat.desc, icon: cat.icon, sortOrder: index },
    });
    categoryIdMap.set(cat.id, created.id);
  }

  for (const svc of services) {
    const categoryId = categoryIdMap.get(svc.categoryId);
    if (!categoryId) {
      console.warn(`Skipping service "${svc.name}" — unknown category "${svc.categoryId}"`);
      continue;
    }
    await prisma.service.upsert({
      where: { slug: svc.id },
      update: {
        categoryId,
        name: svc.name,
        description: svc.desc,
        feeCents: Math.round(svc.fee * 100),
        processingTime: svc.processingTime,
        eligibility: svc.eligibility,
        documents: svc.documents,
        steps: svc.steps,
        isPopular: svc.popular,
      },
      create: {
        slug: svc.id,
        categoryId,
        name: svc.name,
        description: svc.desc,
        feeCents: Math.round(svc.fee * 100),
        processingTime: svc.processingTime,
        eligibility: svc.eligibility,
        documents: svc.documents,
        steps: svc.steps,
        isPopular: svc.popular,
      },
    });
  }

  // Demo accounts so the app is immediately explorable.
  const demoUsers = [
    { email: "admin@huduma360.demo", fullName: "Amina Wanjiru (Admin)", role: "ADMIN" as const, password: "Admin1234" },
    { email: "staff@huduma360.demo", fullName: "Brian Otieno (Staff)", role: "STAFF" as const, password: "Staff1234" },
    { email: "citizen@huduma360.demo", fullName: "Grace Mwikali", role: "USER" as const, password: "Citizen123" },
  ];

  for (const u of demoUsers) {
    const passwordHash = await hashPassword(u.password);
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        fullName: u.fullName,
        passwordHash,
        role: u.role,
        emailVerified: true,
        phone: "0712345678",
        county: "Nairobi",
      },
    });
  }

  console.log("Seed complete. Demo logins:");
  demoUsers.forEach((u) => console.log(`  ${u.role.padEnd(6)} ${u.email} / ${u.password}`));
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
