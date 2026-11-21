// "2026-11-11" → "11 Kasım 2026". Turkish month names, no Intl dependency.
const MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

export function trDate(iso) {
  const [y, m, d] = String(iso).split("-").map(Number);
  return m >= 1 && m <= 12 ? `${d} ${MONTHS[m - 1]} ${y}` : iso;
}
