import { groupByClauseBuilder } from "./group-by";

describe("Group By Clause Builder", () => {
  it("should return an empty string if the group by is not provided", () => {
    const result = groupByClauseBuilder({ groupBy: undefined });

    expect(result).toBeFalsy();
  });

  it("should build a basic group by clause", () => {
    const result = groupByClauseBuilder({ groupBy: ["name"] });

    expect(result).toEqual("group by name");
  });

  it("should build a group by clause with multiple columns", () => {
    const result = groupByClauseBuilder({ groupBy: ["name", "age"] });

    expect(result).toEqual("group by name, age");
  });

  it("should throw an error if the group by clause is empty", () => {
    expect(() => groupByClauseBuilder({ groupBy: [] })).toThrow(
      "Group by clause cannot be empty"
    );
  });

  it("should throw an error if the group by clause contains more than 4 columns", () => {
    expect(() =>
      groupByClauseBuilder({
        groupBy: Array.from({ length: 5 }, () => "name"),
      })
    ).toThrow("Group by clause cannot contain more than 4 columns");
  });
});
