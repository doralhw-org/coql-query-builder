/**
 * Transforms a CRM API Column name to camelCase.
 * 
 * @example
 * ```ts
 * transformCrmColumnToCamelCase("First_Name") // "firstName"
 * transformCrmColumnToCamelCase("Owner.id") // "ownerId"
 * ```
 */
export const transformCrmColumnToCamelCase = (column: string): string => {
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