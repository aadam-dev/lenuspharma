import { z } from "zod";

export const createOrderItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

export const createOrderSchema = z.object({
  guestName: z.string().min(1, "Name is required").max(200),
  guestPhone: z.string().min(1, "Phone is required").max(20),
  guestEmail: z.string().email().optional().or(z.literal("")),
  ghanaPostGps: z.string().min(1, "GhanaPostGPS address is required").max(50),
  addressLine1: z.string().min(1, "Address is required").max(500),
  area: z.string().min(1, "Area is required").max(100),
  region: z.string().min(1, "Region is required").max(100),
  consentDataProcessing: z.literal(true, {
    errorMap: () => ({ message: "You must agree to data processing for dispensing" }),
  }),
  items: z.array(createOrderItemSchema).min(1, "At least one item is required"),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const staffLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password is required"),
});

export type StaffLoginInput = z.infer<typeof staffLoginSchema>;

export const adminOrderPatchSchema = z.object({
  status: z
    .enum([
      "pending_payment",
      "paid",
      "awaiting_pharmacist",
      "pharmacist_rejected",
      "processing",
      "dispatched",
      "delivered",
      "cancelled",
    ])
    .optional(),
  branchId: z.string().min(1).optional(),
});

export type AdminOrderPatchInput = z.infer<typeof adminOrderPatchSchema>;

export const pomApprovalSchema = z.object({
  decision: z.enum(["approved", "rejected"]),
  notes: z.string().max(2000).optional(),
});

export type PomApprovalInput = z.infer<typeof pomApprovalSchema>;

export const adminStockPatchSchema = z.object({
  stock: z.number().int().min(0),
});

export type AdminStockPatchInput = z.infer<typeof adminStockPatchSchema>;
