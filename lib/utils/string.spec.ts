import { transformZohoColumnToCamelCase } from './index';

describe("Utility functions", () => {
  describe('transformColumnToCamelCase', () => {
    it('should transform snake_case to camelCase', () => {
      expect(transformZohoColumnToCamelCase('first_name')).toBe('firstName');
      expect(transformZohoColumnToCamelCase('account_owner')).toBe('accountOwner');
      expect(transformZohoColumnToCamelCase('created_time')).toBe('createdTime');
    });

    it('should handle single words', () => {
      expect(transformZohoColumnToCamelCase('name')).toBe('name');
      expect(transformZohoColumnToCamelCase('id')).toBe('id');
    });

    it('should handle multiple underscores', () => {
      expect(transformZohoColumnToCamelCase('custom_field_name')).toBe('customFieldName');
      expect(transformZohoColumnToCamelCase('long_custom_field_name')).toBe('longCustomFieldName');
    });

    it('should handle mixed case input', () => {
      expect(transformZohoColumnToCamelCase('First_Name')).toBe('firstName');
      expect(transformZohoColumnToCamelCase('Customer_ID')).toBe('customerId');
    });

    it('should handle empty strings', () => {
      expect(transformZohoColumnToCamelCase('')).toBe('');
    });

    it("should handle strings with numbers at the end", () => {
      expect(transformZohoColumnToCamelCase('name_456')).toBe('name456');
    });

    it("should handle strings with numbers in the middle", () => {
      expect(transformZohoColumnToCamelCase('Name_123_test_456')).toBe('name123Test456');
    });
  })
})