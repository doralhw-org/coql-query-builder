import { InCondition } from "../../types/where";
import { inConditionBuilder } from "./condition";

describe("Condition Builders - In Condition", () => {
  it("should build a basic in condition", () => {
    const condition: InCondition = {
      in: {
        column: "age",
        valueSet: [18, 30, 45],
      },
    };

    const result = inConditionBuilder({ condition, not: false });

    expect(result).toBe("age in (18, 30, 45)");
  });

  it("should build a not in condition", () => {
    const condition: InCondition = {
      in: {
        column: "age",
        valueSet: [18, 30, 45],
      },
    };

    const result = inConditionBuilder({ condition, not: true });

    expect(result).toBe("age not in (18, 30, 45)");
  });

  it("should handle string values correctly", () => {
    const condition: InCondition = {
      in: {
        column: "name",
        valueSet: ["Alice", "Bob", "Charlie"],
      },
    };

    const result = inConditionBuilder({ condition, not: false });

    expect(result).toBe("name in ('Alice', 'Bob', 'Charlie')");
  });

  it("should handle the maximum number of values in a value set", () => {
    const condition: InCondition = {
      in: {
        column: "age",
        valueSet: Array.from({ length: 50 }, (_, i) => i),
      },
    };

    const result = inConditionBuilder({ condition, not: false });

    expect(result).toBe(
      "age in (0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49)"
    );
  });

  it("should throw an error if the value set is empty", () => {
    const condition: InCondition = {
      in: {
        column: "age",
        valueSet: [],
      },
    };

    expect(() => inConditionBuilder({ condition, not: false })).toThrow(
      "In condition value set is empty"
    );
  });

  it("should batch the value set if it is too large", () => {
    const condition: InCondition = {
      in: {
        column: "age",
        valueSet: Array.from({ length: 80 }, (_, i) => i),
      },
    };

    const result = inConditionBuilder({ condition, not: false });

    expect(result).toEqual([
      "age in (0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49)",
      "age in (50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79)",
    ]);
  });

  it("should throw an error if the value set is too large when performing a negated in condition", () => {
    const condition: InCondition = {
      in: {
        column: "age",
        valueSet: Array.from({ length: 51 }, (_, i) => i),
      },
    };

    expect(() => inConditionBuilder({ condition, not: true })).toThrow(
      "In condition value set batching is not supported for not in operator, either reduce the number of values in the value set below 50 or use the in operator instead."
    );
  });
});
