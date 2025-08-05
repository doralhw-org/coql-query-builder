import { EqualsCondition } from "../../types";
import { equalsConditionBuilder } from "./condition";

describe("Condition Builders - Equals Condition", () => {
  it("should build a basic equals condition with string value", () => {
    const condition: EqualsCondition = {
      equals: [{ column: "name" }, { value: "John" }],
    };

    const result = equalsConditionBuilder({ condition });

    expect(result).toBe("name = 'John'");
  });

  it("should build a basic equals condition with number value", () => {
    const condition: EqualsCondition = {
      equals: [{ column: "age" }, { value: 25 }],
    };

    const result = equalsConditionBuilder({ condition });

    expect(result).toBe("age = 25");
  });

  it("should build a basic equals condition with boolean value", () => {
    const condition: EqualsCondition = {
      equals: [{ column: "is_active" }, { value: true }],
    };

    const result = equalsConditionBuilder({ condition });

    expect(result).toBe("is_active = true");
  });

  it("should build a basic equals condition with null value", () => {
    const condition: EqualsCondition = {
      equals: [{ column: "is_active" }, { value: null }],
    };

    const result = equalsConditionBuilder({ condition });

    expect(result).toBe("is_active is null");
  });

  it("should build a negated equals condition with null value", () => {
    const condition: EqualsCondition = {
      equals: [{ column: "is_active" }, { value: null }],
    };

    const result = equalsConditionBuilder({ condition, not: true });

    expect(result).toBe("is_active is not null");
  });

  it("should build a negated equals condition", () => {
    const condition: EqualsCondition = {
      equals: [{ column: "status" }, { value: "active" }],
    };

    const result = equalsConditionBuilder({ condition, not: true });

    expect(result).toBe("status != 'active'");
  });

  it("should build an equals condition comparing two columns", () => {
    const condition: EqualsCondition = {
      equals: [{ column: "first_name" }, { column: "last_name" }],
    };

    const result = equalsConditionBuilder({ condition });

    expect(result).toBe("first_name = last_name");
  });
});
