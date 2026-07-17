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
