import { BetweenCondition } from "../../types/where";
import { betweenConditionBuilder } from "./condition";

describe("Condition Builders - Between Condition", () => {
  it("should build a between condition", () => {
    const condition: BetweenCondition = {
      between: {
        column: "age",
        valueRange: [18, 30],
      },
    };

    const result = betweenConditionBuilder({ condition, not: false });

    expect(result).toBe("age between 18 and 30");
  });

  it("should build a not between condition", () => {
    const condition: BetweenCondition = {
      between: {
        column: "age",
        valueRange: [18, 30],
      },
    };

    const result = betweenConditionBuilder({ condition, not: true });

    expect(result).toBe("age not between 18 and 30");
  });

  it("should handle string values correctly", () => {
    const condition: BetweenCondition = {
      between: {
        column: "name",
        valueRange: ["Alice", "Bob"],
      },
    };

    const result = betweenConditionBuilder({ condition, not: false });

    expect(result).toBe("name between 'Alice' and 'Bob'");
  });

  it("should throw an error if the operands are of different types", () => {
    const condition: BetweenCondition = {
      between: {
        column: "score",
        valueRange: [50, "high"],
      },
    };

    expect(() => betweenConditionBuilder({ condition, not: false })).toThrow(
      "Between condition operands must be of the same type"
    );
  });
});
