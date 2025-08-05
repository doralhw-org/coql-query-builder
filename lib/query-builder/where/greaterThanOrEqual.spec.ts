import { GreaterThanOrEqualCondition } from "../../types/where";
import { greaterThanOrEqualConditionBuilder } from "./condition";

describe("Condition Builders - Greater Than Or Equal Condition", () => {
  it("should build a basic greater than or equal condition", () => {
    const condition: GreaterThanOrEqualCondition = {
      greaterThanOrEqual: [{ column: "age" }, { value: 25 }],
    };

    const result = greaterThanOrEqualConditionBuilder({ condition });

    expect(result).toBe("age >= 25");
  });

  it("should build a negated greater than or equal condition", () => {
    const condition: GreaterThanOrEqualCondition = {
      greaterThanOrEqual: [{ column: "age" }, { value: 25 }],
    };

    const result = greaterThanOrEqualConditionBuilder({ condition, not: true });

    expect(result).toBe("age < 25");
  });

  it("should build a greater than or equal condition with two columns", () => {
    const condition: GreaterThanOrEqualCondition = {
      greaterThanOrEqual: [{ column: "age" }, { column: "height" }],
    };

    const result = greaterThanOrEqualConditionBuilder({ condition });

    expect(result).toBe("age >= height");
  });
});
