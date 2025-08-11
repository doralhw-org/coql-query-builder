import { transformCrmColumnToCamelCase } from './index';

describe("Utility functions", () => {
  describe('transformColumnToCamelCase', () => {
    it('should transform snake_case to camelCase', () => {
      expect(transformCrmColumnToCamelCase('first_name')).toBe('firstName');
      expect(transformCrmColumnToCamelCase('account_owner')).toBe('accountOwner');
      expect(transformCrmColumnToCamelCase('created_time')).toBe('createdTime');
    });

    it('should handle single words', () => {
      expect(transformCrmColumnToCamelCase('name')).toBe('name');
      expect(transformCrmColumnToCamelCase('id')).toBe('id');
    });

    it('should handle multiple underscores', () => {
      expect(transformCrmColumnToCamelCase('custom_field_name')).toBe('customFieldName');
      expect(transformCrmColumnToCamelCase('long_custom_field_name')).toBe('longCustomFieldName');
    });

    it('should handle mixed case input', () => {
      expect(transformCrmColumnToCamelCase('First_Name')).toBe('firstName');
      expect(transformCrmColumnToCamelCase('Customer_ID')).toBe('customerId');
    });

    it('should handle empty strings', () => {
      expect(transformCrmColumnToCamelCase('')).toBe('');
    });

    it("should handle strings with numbers at the end", () => {
      expect(transformCrmColumnToCamelCase('name_456')).toBe('name456');
    });

    it("should handle strings with numbers in the middle", () => {
      expect(transformCrmColumnToCamelCase('Name_123_test_456')).toBe('name123Test456');
    });
  })
})