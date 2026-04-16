export const BRANCH_SLUGS = {
  BOTWE_3RD_GATE: "botwe-3rd-gate",
  LAKESIDE_ESTATES: "lakeside-estates",
  MADINA: "madina",
} as const;

export const WHATSAPP_PREFILLED_TEXT =
  "Hi, I'd like to order prescription items from Lenus Pharmacy.";

export const NEPP_REGISTRY_URL =
  "https://gnepplatform.com/providers?type=e-pharmacy";

/** NEPP contact from listing (0548325792) - use 233548325792 for wa.me */
export const WHATSAPP_NUMBER = "233548325792";

export function getWhatsAppUrl(text?: string): string {
  const encoded = encodeURIComponent(
    text ?? WHATSAPP_PREFILLED_TEXT
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}

/** Default delivery fee (GHS) when region not matched */
export const DEFAULT_DELIVERY_FEE_GHS = 15;

/** Region keyword (lowercase) -> delivery fee GHS */
export const DELIVERY_FEE_BY_REGION: Record<string, number> = {
  "greater accra": 12,
  accra: 12,
  tema: 18,
  kasoa: 25,
  "central region": 35,
  ashanti: 40,
  kumasi: 40,
};

export function resolveDeliveryFeeGhs(region: string): number {
  const key = region.trim().toLowerCase();
  return DELIVERY_FEE_BY_REGION[key] ?? DEFAULT_DELIVERY_FEE_GHS;
}

export const LOW_STOCK_THRESHOLD = 10;
