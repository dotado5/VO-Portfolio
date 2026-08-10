/**
 * Strip HTML tags from a rich-text string, leaving readable plain text.
 * Used for previews/teasers where markup would otherwise show as raw tags.
 */
export const stripHtml = (html: string): string =>
  (html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Formats a date string consistently using UTC to prevent hydration mismatch (SSR vs CSR timezone difference).
 * Example output: "October 24, 2023"
 */
export const formatDateUTC = (value?: string | null): string => {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "";

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return `${months[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
};

/**
 * Formats a date string to "Month Year" using UTC to prevent hydration mismatch.
 * Example output: "October 2023"
 */
export const formatDateMonthYearUTC = (value?: string | null): string => {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "";

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return `${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
};
