const rupees = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const dates = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" });

/** Formats an amount in paise as Indian rupees, e.g. 499900 -> "₹4,999". */
export function formatPrice(paise: number): string {
  return rupees.format(paise / 100);
}

export function formatDate(isoDate: string): string {
  return dates.format(new Date(isoDate));
}
