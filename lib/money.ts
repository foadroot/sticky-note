export type AmountRange = { min: number; max: number };

export function formatCurrency(amount: number, currency = "$") {
  return `${currency}${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatPrice(price: AmountRange, currency = "$") {
  if (price.min === price.max) return formatCurrency(price.min, currency);
  return `${formatCurrency(price.min, currency)} - ${formatCurrency(price.max, currency)}`;
}
