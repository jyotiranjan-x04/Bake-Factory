import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {
  const email = "owner@demo.com";
  const existing = await prisma.owner.findUnique({ where: { email } });
  if (existing) {
    return;
  }

  const passwordHash = await bcrypt.hash("Password@123", 12);

  await prisma.owner.create({
    data: {
      email,
      fullName: "Demo Owner",
      phoneNumber: "9999999999",
      passwordHash,
    },
  });

  await prisma.bakeryProfile.upsert({
    where: { id: "main" },
    create: {
      id: "main",
      name: "Bake Factory",
      tagline: "Premium handcrafted cakes",
      phoneNumber: "9999999999",
      whatsappNumber: "9999999999",
      locationAddress: "123 Bake Street, Demo City",
      description: "We craft celebration cakes with premium ingredients and artistic detailing.",
      heroTitle: "Bake Factory",
      heroSubtitle: "From birthdays to weddings, every cake is a signature masterpiece.",
      heroCtaLabel: "Order Now",
    },
    update: {
      name: "Bake Factory",
      tagline: "Premium handcrafted cakes",
      phoneNumber: "9999999999",
      whatsappNumber: "9999999999",
      locationAddress: "123 Bake Street, Demo City",
      description: "We craft celebration cakes with premium ingredients and artistic detailing.",
      heroTitle: "Bake Factory",
      heroSubtitle: "From birthdays to weddings, every cake is a signature masterpiece.",
      heroCtaLabel: "Order Now",
    },
  });

  const categories = await prisma.$transaction([
    prisma.category.upsert({
      where: { slug: "birthday" },
      update: {},
      create: { name: "Birthday", slug: "birthday", description: "Birthday special cakes", sortOrder: 1 },
    }),
    prisma.category.upsert({
      where: { slug: "wedding" },
      update: {},
      create: { name: "Wedding", slug: "wedding", description: "Elegant wedding cakes", sortOrder: 2 },
    }),
    prisma.category.upsert({
      where: { slug: "custom" },
      update: {},
      create: { name: "Custom", slug: "custom", description: "Tailor-made creations", sortOrder: 3 },
    }),
  ]);

  for (let dayOfWeek = 0; dayOfWeek <= 6; dayOfWeek += 1) {
    await prisma.availabilitySchedule.upsert({
      where: { dayOfWeek },
      create: {
        dayOfWeek,
        isClosed: dayOfWeek === 0,
        openTime: "09:00",
        closeTime: "20:00",
      },
      update: {
        isClosed: dayOfWeek === 0,
        openTime: "09:00",
        closeTime: "20:00",
      },
    });
  }

  await prisma.product.upsert({
    where: { slug: "signature-chocolate-truffle" },
    update: {},
    create: {
      name: "Signature Chocolate Truffle",
      slug: "signature-chocolate-truffle",
      description: "Rich dark chocolate sponge layered with silky truffle ganache.",
      price: 1699,
      imageUrl: "/assets/cakes/chocolate.jpg",
      categoryId: categories[0].id,
      isFeatured: true,
    },
  });

  await prisma.product.upsert({
    where: { slug: "blush-rose-wedding-cake" },
    update: {},
    create: {
      name: "Blush Rose Wedding Cake",
      slug: "blush-rose-wedding-cake",
      description: "Three-tier designer cake finished with handcrafted rose frosting.",
      price: 5499,
      imageUrl: "/assets/cakes/wedding.jpg",
      categoryId: categories[1].id,
      isFeatured: true,
    },
  });

  await prisma.product.upsert({
    where: { slug: "vanilla-berry-celebration" },
    update: {},
    create: {
      name: "Vanilla Berry Celebration",
      slug: "vanilla-berry-celebration",
      description: "Madagascar vanilla sponge with seasonal berries and cream.",
      price: 1899,
      imageUrl: "/assets/cakes/vanilla.jpg",
      categoryId: categories[0].id,
      isFeatured: false,
    },
  });

  await prisma.contentBlock.upsert({
    where: { key: "home_feature_1" },
    update: {},
    create: {
      key: "home_feature_1",
      title: "Luxury Craftsmanship",
      content: "Each cake is designed and handcrafted by expert pastry artists.",
      imageUrl: "/assets/content/feature-1.jpg",
      sortOrder: 1,
    },
  });

  await prisma.contentBlock.upsert({
    where: { key: "home_feature_2" },
    update: {},
    create: {
      key: "home_feature_2",
      title: "Reliable Delivery Timeline",
      content: "Real-time updates from confirmation to ready-for-pickup.",
      imageUrl: "/assets/content/feature-2.jpg",
      sortOrder: 2,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
