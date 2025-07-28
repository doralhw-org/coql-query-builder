import { LessThanOrEqualCondition } from "../../types/where";
import { lessThanOrEqualConditionBuilder } from "./condition";

describe("Condition Builders - Less Than Or Equal Condition", () => {
  it("should build a basic less than or equal condition", () => {
    const condition: LessThanOrEqualCondition = {
      lessThanOrEqual: [{ column: "age" }, { value: 25 }],
    };

    const result = lessThanOrEqualConditionBuilder({ condition });

    expect(result).toBe("age <= 25");
  });

  it("should build a negated less than or equal condition", () => {
    const condition: LessThanOrEqualCondition = {
      lessThanOrEqual: [{ column: "age" }, { value: 25 }],
    };

    const result = lessThanOrEqualConditionBuilder({ condition, not: true });

    expect(result).toBe("age > 25");
  });

  it("should build a less than or equal condition with two columns", () => {
    const condition: LessThanOrEqualCondition = {
      lessThanOrEqual: [{ column: "age" }, { column: "height" }],
    };

    const result = lessThanOrEqualConditionBuilder({ condition });

    expect(result).toBe("age <= height");
  });
});
