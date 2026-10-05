import "dotenv/config";
import { PrismaClient, UserRole } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Starting database seed...");

  // =========================================================
  // PASSWORD
  // =========================================================

  const passwordHash = await bcrypt.hash("Password123!", 10);

  // =========================================================
  // USERS
  // =========================================================

  const cuttingSupervisor = await prisma.user.upsert({
    where: {
      email: "supervisor@apparelfow.local",
    },
    update: {},
    create: {
      email: "supervisor@apparelfow.local",
      passwordHash,
      fullName: "Cutting Supervisor",
      role: UserRole.CUTTING_SUPERVISOR,
    },
  });

  const cuttingVerifier = await prisma.user.upsert({
    where: {
      email: "verifier@apparelfow.local",
    },
    update: {},
    create: {
      email: "verifier@apparelfow.local",
      passwordHash,
      fullName: "Cutting Verifier",
      role: UserRole.CUTTING_VERIFIER,
    },
  });

  const sewingSupervisor = await prisma.user.upsert({
    where: {
      email: "sewing@apparelfow.local",
    },
    update: {},
    create: {
      email: "sewing@apparelfow.local",
      passwordHash,
      fullName: "Sewing Supervisor",
      role: UserRole.SEWING_SUPERVISOR,
    },
  });

  console.log("✅ Users created");

  // =========================================================
  // CASUAL BLOUSE RECIPE
  // =========================================================

  const casualBlouse = await prisma.recipe.upsert({
    where: {
      recipeCode: "REC-BL01",
    },
    update: {},
    create: {
      recipeCode: "REC-BL01",
      name: "Casual Blouse",
      category: "Blouse",
      stdFabricYards: 1.8,
      wastageCap: 5.0,
    },
  });

  // =========================================================
  // CROP TOP RECIPE
  // =========================================================

  const cropTop = await prisma.recipe.upsert({
    where: {
      recipeCode: "REC-CT02",
    },
    update: {},
    create: {
      recipeCode: "REC-CT02",
      name: "Crop Top",
      category: "Crop Top",
      stdFabricYards: 1.1,
      wastageCap: 8.0,
    },
  });

  console.log("✅ Recipes created");

  // =========================================================
  // CASUAL BLOUSE COMPONENTS
  // =========================================================

  const blouseComponents = [
    {
      recipeId: casualBlouse.id,
      componentName: "Front Body Panel",
      piecesPerGarment: 1,
    },
    {
      recipeId: casualBlouse.id,
      componentName: "Back Body Panel",
      piecesPerGarment: 1,
    },
    {
      recipeId: casualBlouse.id,
      componentName: "Sleeves (Left & Right)",
      piecesPerGarment: 2,
    },
    {
      recipeId: casualBlouse.id,
      componentName: "Collar & Stand",
      piecesPerGarment: 1,
    },
    {
      recipeId: casualBlouse.id,
      componentName: "Sleeve Cuffs",
      piecesPerGarment: 2,
    },
  ];

  for (const component of blouseComponents) {
    await prisma.recipeComponent.upsert({
      where: {
        recipeId_componentName: {
          recipeId: component.recipeId,
          componentName: component.componentName,
        },
      },
      update: {},
      create: component,
    });
  }

  // =========================================================
  // CROP TOP COMPONENTS
  // =========================================================

  const cropTopComponents = [
    {
      recipeId: cropTop.id,
      componentName: "Front Chest Panel",
      piecesPerGarment: 1,
    },
    {
      recipeId: cropTop.id,
      componentName: "Back Support Panel",
      piecesPerGarment: 1,
    },
    {
      recipeId: cropTop.id,
      componentName: "Neck Binding Strip",
      piecesPerGarment: 1,
    },
    {
      recipeId: cropTop.id,
      componentName: "Hem Elastic Casing",
      piecesPerGarment: 1,
    },
    {
      recipeId: cropTop.id,
      componentName: "Side Strap Accents",
      piecesPerGarment: 2,
    },
  ];

  for (const component of cropTopComponents) {
    await prisma.recipeComponent.upsert({
      where: {
        recipeId_componentName: {
          recipeId: component.recipeId,
          componentName: component.componentName,
        },
      },
      update: {},
      create: component,
    });
  }

  console.log("✅ Recipe components created");

  console.log("\n🎉 Database seed completed!");
  console.log("\nDemo accounts:");
  console.log("----------------------------------------");
  console.log(
    `Cutting Supervisor: ${cuttingSupervisor.email}`
  );
  console.log(
    `Cutting Verifier:   ${cuttingVerifier.email}`
  );
  console.log(
    `Sewing Supervisor:  ${sewingSupervisor.email}`
  );
  console.log("Password: Password123!");
  console.log("----------------------------------------");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });