/**
 * Format a date to a readable string format
 * @param date The date to format
 * @returns A formatted date string
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

/**
 * Format a date with time to a readable string format
 * @param date The date to format
 * @returns A formatted date and time string
 */
export const formatDateTime = (date: Date): string => {
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Checks if a date is in the past
 * @param date The date to check
 * @returns True if the date is in the past
 */
export const isDatePast = (date: Date): boolean => {
  return date < new Date();
};

/**
 * Get the remaining days between the current date and a future date
 * @param date The future date
 * @returns The number of days remaining, or 0 if the date is in the past
 */
export const getRemainingDays = (date: Date): number => {
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();

  if (diffTime <= 0) return 0;

  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
