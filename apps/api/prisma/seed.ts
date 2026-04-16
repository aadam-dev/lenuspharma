import { PrismaClient, StaffRole } from "@prisma/client";
import { BRANCH_SLUGS, resolveDeliveryFeeGhs } from "@lenus/shared";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function slug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

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
  const adminEmail = process.env.BOOTSTRAP_ADMIN_EMAIL?.toLowerCase().trim();
  const adminPassword = process.env.BOOTSTRAP_ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    const hash = bcrypt.hashSync(adminPassword, 12);
    await prisma.staffUser.upsert({
      where: { email: adminEmail },
      create: {
        email: adminEmail,
        passwordHash: hash,
        name: process.env.BOOTSTRAP_ADMIN_NAME ?? "Lenus Admin",
        role: StaffRole.admin,
      },
      update: {
        passwordHash: hash,
        name: process.env.BOOTSTRAP_ADMIN_NAME ?? "Lenus Admin",
      },
    });
    console.log("Bootstrap admin user:", adminEmail);
  }

  const pharmEmail = process.env.BOOTSTRAP_PHARMACIST_EMAIL?.toLowerCase().trim();
  const pharmPassword = process.env.BOOTSTRAP_PHARMACIST_PASSWORD;
  if (pharmEmail && pharmPassword) {
    const hash = bcrypt.hashSync(pharmPassword, 12);
    await prisma.staffUser.upsert({
      where: { email: pharmEmail },
      create: {
        email: pharmEmail,
        passwordHash: hash,
        name: process.env.BOOTSTRAP_PHARMACIST_NAME ?? "Lead Pharmacist",
        role: StaffRole.pharmacist,
      },
      update: {
        passwordHash: hash,
        name: process.env.BOOTSTRAP_PHARMACIST_NAME ?? "Lead Pharmacist",
      },
    });
    console.log("Bootstrap pharmacist user:", pharmEmail);
  }

  // —— Ensure correct branch data: migrate legacy East Legon → Madina ——
  await prisma.branch.updateMany({
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

  // —— Upsert branches (single source of truth: Lakeside, Botwe, Madina) ——
  const botwe = await prisma.branch.upsert({
    where: { slug: BRANCH_SLUGS.BOTWE_3RD_GATE },
    create: { slug: BRANCH_SLUGS.BOTWE_3RD_GATE, ...BRANCH_DATA[BRANCH_SLUGS.BOTWE_3RD_GATE] },
    update: BRANCH_DATA[BRANCH_SLUGS.BOTWE_3RD_GATE],
  });
  const lakeside = await prisma.branch.upsert({
    where: { slug: BRANCH_SLUGS.LAKESIDE_ESTATES },
    create: { slug: BRANCH_SLUGS.LAKESIDE_ESTATES, ...BRANCH_DATA[BRANCH_SLUGS.LAKESIDE_ESTATES] },
    update: BRANCH_DATA[BRANCH_SLUGS.LAKESIDE_ESTATES],
  });
  const madina = await prisma.branch.upsert({
    where: { slug: BRANCH_SLUGS.MADINA },
    create: { slug: BRANCH_SLUGS.MADINA, ...BRANCH_DATA[BRANCH_SLUGS.MADINA] },
    update: BRANCH_DATA[BRANCH_SLUGS.MADINA],
  });

  // Ensure only the three canonical branches exist (remove any stray/legacy rows)
  await prisma.branch.deleteMany({
    where: {
      slug: { notIn: [BRANCH_SLUGS.BOTWE_3RD_GATE, BRANCH_SLUGS.LAKESIDE_ESTATES, BRANCH_SLUGS.MADINA] },
    },
  });

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  // —— OTC: Pain & Fever ——
  const painFever = [
    { name: "Paracetamol 500mg Tablets (Pack of 20)", price: 8.5, description: "For headache, fever and mild pain. Common OTC in Ghana." },
    { name: "Ibuprofen 400mg Tablets (Pack of 20)", price: 12.0, description: "Anti-inflammatory pain relief." },
    { name: "Paracetamol Syrup 120ml (Children)", price: 15.0, description: "Sugar-free paracetamol for children." },
    { name: "Aspirin 75mg (Low Dose, 30 tablets)", price: 6.0, description: "Low-dose aspirin for cardiovascular support." },
  ];
  for (const p of painFever) {
    await prisma.product.create({
      data: {
        name: p.name,
        slug: slug(p.name),
        description: p.description,
        price: p.price,
        category: "Pain & Fever",
        type: "OTC",
        stock: 150,
      },
    });
  }

  // —— OTC: Vitamins & Supplements ——
  const vitamins = [
    { name: "Vitamin C 1000mg Tablets (30s)", price: 18.0, description: "Immune support and antioxidant." },
    { name: "Multivitamin Daily (30 tablets)", price: 28.0, description: "Daily multivitamin for adults." },
    { name: "Vitamin D3 1000IU (60 softgels)", price: 22.0, description: "Bone health and immunity." },
    { name: "Folic Acid 5mg Tablets (30s)", price: 10.0, description: "Pregnancy and anaemia support." },
    { name: "Iron + Folic Acid (Pregnancy)", price: 14.0, description: "Prenatal supplement." },
    { name: "Zinc 15mg Tablets (30s)", price: 16.0, description: "Immune and wound healing support." },
  ];
  for (const p of vitamins) {
    await prisma.product.create({
      data: {
        name: p.name,
        slug: slug(p.name),
        description: p.description,
        price: p.price,
        category: "Vitamins & Supplements",
        type: "OTC",
        stock: 100,
      },
    });
  }

  // —— OTC: Digestive & Rehydration ——
  const digestive = [
    { name: "ORS (Oral Rehydration Salts) Sachets x 10", price: 12.0, description: "Rehydration for diarrhoea. WHO formula." },
    { name: "Antacid Tablets (Calcium Carbonate) 24s", price: 9.0, description: "Heartburn and indigestion relief." },
    { name: "Metoclopramide 10mg Tablets (10s)", price: 8.0, description: "Nausea and vomiting relief." },
    { name: "Lactobacillus (Probiotic) 10 sachets", price: 25.0, description: "Gut health and diarrhoea recovery." },
  ];
  for (const p of digestive) {
    await prisma.product.create({
      data: {
        name: p.name,
        slug: slug(p.name),
        description: p.description,
        price: p.price,
        category: "Digestive & Rehydration",
        type: "OTC",
        stock: 80,
      },
    });
  }

  // —— OTC: Cough, Cold & Allergy ——
  const coughCold = [
    { name: "Cough Syrup 100ml (Expectorant)", price: 18.0, description: "For dry and chesty cough." },
    { name: "Chlorpheniramine 4mg Tablets (20s)", price: 7.0, description: "Allergy and hay fever relief." },
    { name: "Cetirizine 10mg Tablets (10s)", price: 10.0, description: "Antihistamine for allergies." },
    { name: "Pseudoephedrine 30mg (Decongestant) 12s", price: 11.0, description: "Nasal congestion relief." },
    { name: "Honey & Lemon Cough Drops (Pack)", price: 6.0, description: "Soothing throat relief." },
  ];
  for (const p of coughCold) {
    await prisma.product.create({
      data: {
        name: p.name,
        slug: slug(p.name),
        description: p.description,
        price: p.price,
        category: "Cough, Cold & Allergy",
        type: "OTC",
        stock: 90,
      },
    });
  }

  // —— OTC: First Aid ——
  const firstAid = [
    { name: "Bandages Assorted (Plastic Strips) 40s", price: 14.0, description: "Wound dressing." },
    { name: "Cotton Wool 100g", price: 8.0, description: "Cleaning and dressing." },
    { name: "Antiseptic Solution 100ml", price: 12.0, description: "Wound cleaning." },
    { name: "Hydrogen Peroxide 100ml", price: 9.0, description: "Antiseptic for minor cuts." },
    { name: "First Aid Kit (Basic)", price: 45.0, description: "Basic home first aid kit." },
  ];
  for (const p of firstAid) {
    await prisma.product.create({
      data: {
        name: p.name,
        slug: slug(p.name),
        description: p.description,
        price: p.price,
        category: "First Aid",
        type: "OTC",
        stock: 60,
      },
    });
  }

  // —— OTC: Personal Care & Hygiene ——
  const personalCare = [
    { name: "Hand Sanitizer 500ml (Alcohol-based)", price: 20.0, description: "Hand hygiene." },
    { name: "Hand Sanitizer 100ml (Pocket)", price: 8.0, description: "Portable hand sanitizer." },
    { name: "Antiseptic Soap (Bar) 3-pack", price: 15.0, description: "Germ protection soap." },
    { name: "Surgical Face Masks (50s)", price: 25.0, description: "Disposable face masks." },
    { name: "Cotton Buds 200 tips", price: 5.0, description: "Ear and wound care." },
  ];
  for (const p of personalCare) {
    await prisma.product.create({
      data: {
        name: p.name,
        slug: slug(p.name),
        description: p.description,
        price: p.price,
        category: "Personal Care & Hygiene",
        type: "OTC",
        stock: 120,
      },
    });
  }

  // —— OTC: Skin ——
  const skin = [
    { name: "Hydrocortisone Cream 1% 15g", price: 14.0, description: "Mild eczema and itch relief." },
    { name: "Clotrimazole Cream 1% (Fungal) 20g", price: 12.0, description: "Athlete's foot and ringworm." },
    { name: "Calamine Lotion 100ml", price: 10.0, description: "Itchy skin and rashes." },
    { name: "Petroleum Jelly 50g", price: 6.0, description: "Dry skin and lips." },
    { name: "Sunscreen SPF 30 100ml", price: 35.0, description: "UV protection." },
  ];
  for (const p of skin) {
    await prisma.product.create({
      data: {
        name: p.name,
        slug: slug(p.name),
        description: p.description,
        price: p.price,
        category: "Skin Care",
        type: "OTC",
        stock: 70,
      },
    });
  }

  // —— POM (Prescription Only — order via WhatsApp) ——
  const pomProducts = [
    {
      name: "Amoxicillin 500mg Capsules (21s)",
      slug: "amoxicillin-500mg-capsules-21s-pom",
      description: "Prescription only. Order via WhatsApp with your prescription.",
      price: 38.0,
      category: "Antibiotics",
    },
    {
      name: "Coartem (Artemether-Lumefantrine) 24 tablets",
      slug: "coartem-artemether-lumefantrine-24-tablets-pom",
      description: "Prescription only. For malaria treatment. Order via WhatsApp.",
      price: 55.0,
      category: "Antimalarials",
    },
    {
      name: "Lonart (Artemether-Lumefantrine) 24 tablets",
      slug: "lonart-artemether-lumefantrine-24-tablets-pom",
      description: "Prescription only. Malaria treatment. Order via WhatsApp.",
      price: 48.0,
      category: "Antimalarials",
    },
    {
      name: "Blood Pressure Medication (Amlodipine 5mg) 30s",
      slug: "amlodipine-5mg-30s-pom",
      description: "Prescription only. Hypertension. Order via WhatsApp.",
      price: 25.0,
      category: "Cardiovascular",
    },
    {
      name: "Metformin 500mg Tablets (60s)",
      slug: "metformin-500mg-tablets-60s-pom",
      description: "Prescription only. Type 2 diabetes. Order via WhatsApp.",
      price: 22.0,
      category: "Diabetes",
    },
    {
      name: "Salbutamol Inhaler 100mcg",
      slug: "salbutamol-inhaler-100mcg-pom",
      description: "Prescription only. Asthma relief. Order via WhatsApp.",
      price: 42.0,
      category: "Respiratory",
    },
    {
      name: "Omeprazole 20mg Capsules (28s)",
      slug: "omeprazole-20mg-capsules-28s-pom",
      description: "Prescription only. Gastric reflux. Order via WhatsApp.",
      price: 28.0,
      category: "Digestive",
    },
    {
      name: "Ciprofloxacin 500mg Tablets (10s)",
      slug: "ciprofloxacin-500mg-tablets-10s-pom",
      description: "Prescription only. Antibiotic. Order via WhatsApp.",
      price: 35.0,
      category: "Antibiotics",
    },
  ];

  for (const p of pomProducts) {
    await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        category: p.category,
        type: "POM",
        stock: 40,
      },
    });
  }

  // —— Sample orders for testing (optional) ——
  const paracetamol = await prisma.product.findFirst({ where: { slug: slug("Paracetamol 500mg Tablets (Pack of 20)") } });
  const ors = await prisma.product.findFirst({ where: { slug: slug("ORS (Oral Rehydration Salts) Sachets x 10") } });
  const vitaminC = await prisma.product.findFirst({ where: { slug: slug("Vitamin C 1000mg Tablets (30s)") } });

  if (paracetamol && ors && vitaminC) {
    const feeAccra = resolveDeliveryFeeGhs("Greater Accra");
    await prisma.order.create({
      data: {
        guestName: "Kwame Asante",
        guestPhone: "0244123456",
        guestEmail: "kwame.asante@example.com",
        ghanaPostGps: "GA-110-2346",
        addressLine1: "House 42, Botwe Road",
        area: "Ashaley Botwe",
        region: "Greater Accra",
        consentDataProcessing: true,
        status: "processing",
        paymentStatus: "paid",
        deliveryFee: feeAccra,
        branchId: botwe.id,
        items: {
          create: [
            { productId: paracetamol.id, quantity: 2, priceAtOrder: paracetamol.price },
            { productId: ors.id, quantity: 1, priceAtOrder: ors.price },
          ],
        },
      },
    });

    await prisma.order.create({
      data: {
        guestName: "Abena Mensah",
        guestPhone: "0556789012",
        guestEmail: null,
        ghanaPostGps: "GA-120-5679",
        addressLine1: "Block C, Lakeside Avenue",
        area: "Lakeside Estates",
        region: "Greater Accra",
        consentDataProcessing: true,
        status: "delivered",
        paymentStatus: "paid",
        deliveryFee: feeAccra,
        branchId: lakeside.id,
        items: {
          create: [
            { productId: vitaminC.id, quantity: 1, priceAtOrder: vitaminC.price },
            { productId: paracetamol.id, quantity: 1, priceAtOrder: paracetamol.price },
          ],
        },
      },
    });
  }

  const branchCount = 3;
  const productCount = await prisma.product.count();
  const orderCount = await prisma.order.count();

  console.log("Seeded branches:", branchCount, "—", botwe.name, "|", lakeside.name, "|", madina.name);
  console.log("Seeded products:", productCount, "(OTC + POM)");
  console.log("Seeded sample orders:", orderCount);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
