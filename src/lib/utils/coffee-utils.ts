/**
 * Format price in INR currency
 */
export function formatPrice(price: number | null | undefined): string {
  if (!price) {
    return "";
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
