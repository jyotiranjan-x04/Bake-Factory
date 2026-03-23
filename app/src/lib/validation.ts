import { z } from "zod";

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const ownerSetupSchema = z.object({
  fullName: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
  phoneNumber: z.string().min(10),
});

export const bakeryProfileSchema = z.object({
  name: z.string().min(2),
  tagline: z.string().min(4),
  description: z.string().min(10),
  phoneNumber: z.string().min(10),
  whatsappNumber: z.string().min(10),
  locationAddress: z.string().min(4),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  mapsEmbedUrl: z.string().optional(),
  heroTitle: z.string().min(2),
  heroSubtitle: z.string().min(2),
  heroCtaLabel: z.string().min(2),
  heroImageUrl: z.string().optional(),
  bannerImageUrl: z.string().optional(),
});

export const availabilityItemSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  isClosed: z.boolean(),
  openTime: z.string().regex(/^\d{2}:\d{2}$/),
  closeTime: z.string().regex(/^\d{2}:\d{2}$/),
});

export const createOrderSchema = z.object({
  customerName: z.string().min(2),
  customerPhone: z.string().min(10),
  customerEmail: z.string().email().optional(),
  customerAddress: z.string().optional(),
  notes: z.string().optional(),
  customization: z.string().optional(),
  items: z.array(z.object({ productId: z.string(), quantity: z.number().int().min(1) })).min(1),
});

export const createCustomOrderSchema = z.object({
  customerName: z.string().min(2),
  customerPhone: z.string().min(10),
  customerEmail: z.string().email().optional(),
  description: z.string().min(10),
  budget: z.number().int().positive().optional(),
});

export const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(4),
  price: z.number().int().positive(),
  imageUrl: z.string().optional(),
  categoryId: z.string().nullable().optional(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  sortOrder: z.number().int().default(0),
});
