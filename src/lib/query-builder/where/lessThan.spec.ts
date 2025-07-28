import { LessThanCondition } from "../../types/where";
import { lessThanConditionBuilder } from "./condition";

describe("Condition Builders - Less Than Condition", () => {
  it("should build a basic less than condition", () => {
    const condition: LessThanCondition = {
      lessThan: [{ column: "age" }, { value: 25 }],
    };

    const result = lessThanConditionBuilder({ condition });

    expect(result).toBe("age < 25");
  });

  it("should build a negated less than condition", () => {
    const condition: LessThanCondition = {
      lessThan: [{ column: "age" }, { value: 25 }],
    };

    const result = lessThanConditionBuilder({ condition, not: true });

    expect(result).toBe("age >= 25");
  });

  it("should build a less than condition with two columns", () => {
    const condition: LessThanCondition = {
      lessThan: [{ column: "age" }, { column: "height" }],
    };

    const result = lessThanConditionBuilder({ condition });

    expect(result).toBe("age < height");
  });
});
