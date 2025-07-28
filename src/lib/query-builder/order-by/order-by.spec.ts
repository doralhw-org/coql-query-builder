import { orderByClauseBuilder } from "./order-by";

describe("Order By Clause Builder", () => {
  it("should return an empty string if the order by is not provided", () => {
    const result = orderByClauseBuilder({ orderBy: undefined });

    expect(result).toBeFalsy();
  });

  it("should build a basic order by clause", () => {
    const result = orderByClauseBuilder({
      orderBy: [{ column: "name", direction: "asc" }],
    });

    expect(result).toEqual("order by name asc");
  });

  it("should build a basic order by clause with multiple columns", () => {
    const result = orderByClauseBuilder({
      orderBy: [
        { column: "name", direction: "asc" },
        { column: "age", direction: "desc" },
      ],
    });

    expect(result).toEqual("order by name asc, age desc");
  });

  it("should throw an error if the order by clause is empty", () => {
    expect(() => orderByClauseBuilder({ orderBy: [] })).toThrow(
      "Order by clause cannot be empty"
    );
  });

  it("should throw an error if the order by clause contains more than 10 columns", () => {
    expect(() =>
      orderByClauseBuilder({
        orderBy: Array.from({ length: 11 }, () => ({
          column: "name",
          direction: "asc",
        })),
      })
    ).toThrow("Order by clause cannot contain more than 10 columns");
  });
});
