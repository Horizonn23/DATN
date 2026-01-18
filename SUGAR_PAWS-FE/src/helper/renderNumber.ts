export const formatCurrency = (money: number): string => {
  if (isNaN(money)) return "0";
  const parts = money.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return parts.join(",");
};

export const ensureAbsoluteUrl = (url: string | undefined) => {
  if (!url) return "";
  if (url.startsWith("//")) {
    return `https:${url}`;
  }
  return url;
};
