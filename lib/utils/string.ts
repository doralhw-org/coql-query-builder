/**
 * Transforms a Zoho API Column name to camelCase.
 * 
 * @example
 * ```ts
 * transformZohoColumnToCamelCase("First_Name") // "firstName"
 * transformZohoColumnToCamelCase("Owner.id") // "ownerId"
 * ```
 */
export const transformZohoColumnToCamelCase = (column: string): string => {
  return column
    .replace(/\./g, '_')
    .split('_')
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase();
      }

      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');
}; 