import { limitClauseBuilder, paginationClauseBuilder } from "./limit";

describe("Limit Clause Builder", () => {
  it("should return an empty string if the limit is not provided", () => {
    const result = limitClauseBuilder({ limit: undefined });

    expect(result).toBeFalsy();
  });

  it("should build a basic limit clause", () => {
    const result = limitClauseBuilder({ limit: { limit: 10 } });

    expect(result).toEqual("limit 10");
  });

  it("should build a basic limit clause with offset", () => {
    const result = limitClauseBuilder({ limit: { limit: 10, offset: 10 } });

    expect(result).toEqual("limit 10 offset 10");
  });

  it("should throw an error if the limit is less than 1", () => {
    expect(() => limitClauseBuilder({ limit: { limit: 0 } })).toThrow(
      "Limit cannot be less than 1"
    );
  });

  it("should throw an error if the limit is greater than 2000", () => {
    expect(() => limitClauseBuilder({ limit: { limit: 2001 } })).toThrow(
      "Limit cannot be greater than 2000"
    );
  });

  it("should throw an error if the sum of limit and offset is greater than 100000", () => {
    expect(() =>
      limitClauseBuilder({ limit: { limit: 1, offset: 100000 } })
    ).toThrow("Sum of limit and offset cannot be greater than 100000");
  });
});

describe("Pagination Clause Builder", () => {
  it("should return an empty string if the pagination is not provided", () => {
    const result = paginationClauseBuilder({ pagination: undefined });

    expect(result).toBeFalsy();
  });

  it("should build a basic pagination clause", () => {
    const result = paginationClauseBuilder({
      pagination: { page: 1, pageSize: 10 },
    });

    expect(result).toEqual("limit 10");
  });

  it("should build a pagination clause with offset", () => {
    const result = paginationClauseBuilder({
      pagination: { page: 2, pageSize: 10 },
    });

    expect(result).toEqual("limit 10 offset 10");
  });
});
