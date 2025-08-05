import { GreaterThanCondition } from "../../types/where";
import { greaterThanConditionBuilder } from "./condition";

describe("Condition Builders - Greater Than Condition", () => {
  it("should build a basic greater than condition", () => {
    const condition: GreaterThanCondition = {
      greaterThan: [{ column: "age" }, { value: 25 }],
    };

    const result = greaterThanConditionBuilder({ condition });

    expect(result).toBe("age > 25");
  });

  it("should build a negated greater than condition", () => {
    const condition: GreaterThanCondition = {
      greaterThan: [{ column: "age" }, { value: 25 }],
    };

    const result = greaterThanConditionBuilder({ condition, not: true });

    expect(result).toBe("age <= 25");
  });

  it("should build a greater than condition with two columns", () => {
    const condition: GreaterThanCondition = {
      greaterThan: [{ column: "age" }, { column: "height" }],
    };

    const result = greaterThanConditionBuilder({ condition });

    expect(result).toBe("age > height");
  });
});
