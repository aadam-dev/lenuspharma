/**
 * Ensures branch data is correct: migrates East Legon → Madina if present,
 * upserts the three canonical branches (Lakeside, Botwe, Madina), and
 * removes any other branches. Safe to run on existing DBs (does not touch products/orders).
 */
import { PrismaClient } from "@prisma/client";
import { BRANCH_SLUGS } from "@lenus/shared";

const prisma = new PrismaClient();

const BRANCH_DATA = {
  [BRANCH_SLUGS.BOTWE_3RD_GATE]: {
    name: "Lenus Pharmacy — Botwe 3rd Gate",
    address: "Ashaley Botwe, 3rd Gate, Near Botwe Junction, Greater Accra",
    phone: "054 832 5792",
    ghanaPostGps: "GA-110-2345",
    lat: 5.6037,
    lng: -0.1876,
  },
  [BRANCH_SLUGS.LAKESIDE_ESTATES]: {
    name: "Lenus Pharmacy — Lakeside Estates",
    address: "Lakeside Estates, Greater Accra",
    phone: "054 832 5793",
    ghanaPostGps: "GA-120-5678",
    lat: 5.6502,
    lng: -0.1756,
  },
  [BRANCH_SLUGS.MADINA]: {
    name: "Lenus Pharmacy — Madina",
    address: "Madina, Greater Accra",
    phone: "054 832 5794",
    ghanaPostGps: "GA-130-7890",
    lat: 5.6861,
    lng: -0.1678,
  },
} as const;

async function main() {
  const updated = await prisma.branch.updateMany({
    where: { slug: "east-legon" },
    data: {
      slug: BRANCH_SLUGS.MADINA,
      name: BRANCH_DATA[BRANCH_SLUGS.MADINA].name,
      address: BRANCH_DATA[BRANCH_SLUGS.MADINA].address,
      phone: BRANCH_DATA[BRANCH_SLUGS.MADINA].phone,
      ghanaPostGps: BRANCH_DATA[BRANCH_SLUGS.MADINA].ghanaPostGps,
      lat: BRANCH_DATA[BRANCH_SLUGS.MADINA].lat,
      lng: BRANCH_DATA[BRANCH_SLUGS.MADINA].lng,
    },
  });
  if (updated.count > 0) {
    console.log("Migrated East Legon → Madina:", updated.count, "branch(es)");
  }

  await prisma.branch.upsert({
    where: { slug: BRANCH_SLUGS.BOTWE_3RD_GATE },
    create: { slug: BRANCH_SLUGS.BOTWE_3RD_GATE, ...BRANCH_DATA[BRANCH_SLUGS.BOTWE_3RD_GATE] },
    update: BRANCH_DATA[BRANCH_SLUGS.BOTWE_3RD_GATE],
  });
  await prisma.branch.upsert({
    where: { slug: BRANCH_SLUGS.LAKESIDE_ESTATES },
    create: { slug: BRANCH_SLUGS.LAKESIDE_ESTATES, ...BRANCH_DATA[BRANCH_SLUGS.LAKESIDE_ESTATES] },
    update: BRANCH_DATA[BRANCH_SLUGS.LAKESIDE_ESTATES],
  });
  await prisma.branch.upsert({
    where: { slug: BRANCH_SLUGS.MADINA },
    create: { slug: BRANCH_SLUGS.MADINA, ...BRANCH_DATA[BRANCH_SLUGS.MADINA] },
    update: BRANCH_DATA[BRANCH_SLUGS.MADINA],
  });

  const deleted = await prisma.branch.deleteMany({
    where: {
      slug: { notIn: [BRANCH_SLUGS.BOTWE_3RD_GATE, BRANCH_SLUGS.LAKESIDE_ESTATES, BRANCH_SLUGS.MADINA] },
    },
  });
  if (deleted.count > 0) {
    console.log("Removed stray branches:", deleted.count);
  }

  const count = await prisma.branch.count();
  console.log("Branches ensured:", count, "— Lakeside, Botwe, Madina");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
