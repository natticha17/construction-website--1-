import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function formatPriceToMillion(price: number | string): string {
  const numPrice = typeof price === "string" ? Number(price.replace(/,/g, "")) : price
  if (isNaN(numPrice)) return "0"

  // Convert to million
  const millionPrice = numPrice / 1000000

  // Format with 2 decimal places, removing unnecessary zeros (e.g., 1.50 -> 1.5)
  return new Intl.NumberFormat("th-TH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(millionPrice)
}
