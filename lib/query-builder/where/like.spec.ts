import { LikeCondition } from "../../types/where";
import { likeConditionBuilder } from "./condition";

describe("Condition Builders - Like Condition", () => {
  it("should build a basic like condition", () => {
    const condition: LikeCondition = {
      like: {
        column: "name",
        pattern: "John%",
      },
    };

    const result = likeConditionBuilder({ condition, not: false });

    expect(result).toBe("name like 'John%'");
  });

  it("should build a not like condition", () => {
    const condition: LikeCondition = {
      like: {
        column: "name",
        pattern: "%John%",
      },
    };

    const result = likeConditionBuilder({ condition, not: true });

    expect(result).toBe("name not like '%John%'");
  });
});
