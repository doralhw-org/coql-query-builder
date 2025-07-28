import { selectClauseBuilder, SelectClauseBuilderArgs } from "./select";

describe("Select Clause Builder", () => {
  it("should build a basic select clause", () => {
    const query: SelectClauseBuilderArgs = {
      columns: ["id", "Name"],
      from: "Users",
    };

    const result = selectClauseBuilder(query);

    expect(result).toEqual(["select id, Name from Users"]);
  });

  it("should build a select clause with an alias", () => {
    const query: SelectClauseBuilderArgs = {
      columns: [
        { column: "user_id", alias: "id" },
        { column: "user_name", alias: "Name" },
      ],
      from: "Users",
    };

    const result = selectClauseBuilder(query);

    expect(result).toEqual([
      "select user_id as id, user_name as Name from Users",
    ]);
  });

  it("should add id column to the query if it is not present", () => {
    const query: SelectClauseBuilderArgs = {
      columns: ["Name"],
      from: "Users",
    };

    const result = selectClauseBuilder(query);

    expect(result).toEqual(["select id, Name from Users"]);
  });

  it("should ignore empty column aliases", () => {
    const query: SelectClauseBuilderArgs = {
      columns: [
        { column: "user_id", alias: "" },
        { column: "user_name", alias: "   " },
      ],
      from: "Users",
    };

    const result = selectClauseBuilder(query);

    expect(result).toEqual(["select id, user_id, user_name from Users"]);
  });

  it("should throw an error if id column is aliased", () => {
    const query: SelectClauseBuilderArgs = {
      columns: [{ column: "id", alias: "user_id" }],
      from: "Users",
    };

    expect(() => selectClauseBuilder(query)).toThrow(
      "The id column cannot be aliased"
    );
  });

  it("should detect when a column is aliased to id and not add id column to the query", () => {
    const query: SelectClauseBuilderArgs = {
      columns: [{ column: "user_id", alias: "id" }],
      from: "Users",
    };

    const result = selectClauseBuilder(query);

    expect(result).toEqual(["select user_id as id from Users"]);
  });

  it("should build multiple select clauses when columns are more than 50", () => {
    const query: SelectClauseBuilderArgs = {
      columns: Array.from({ length: 175 }, (_, i) => `column_${i}`),
      from: "Users",
    };

    const result = selectClauseBuilder(query);

    const generateExpectedQuery = (offset: number, limit = 49) => {
      return `select id, ${Array.from(
        { length: limit },
        (_, i) => `column_${i + offset}`
      ).join(", ")} from Users`;
    };

    const expectedFirstQuery = generateExpectedQuery(0);
    const expectedSecondQuery = generateExpectedQuery(49);
    const expectedThirdQuery = generateExpectedQuery(98);
    const expectedFourthQuery = generateExpectedQuery(147, 28);

    expect(result).toEqual([
      expectedFirstQuery,
      expectedSecondQuery,
      expectedThirdQuery,
      expectedFourthQuery,
    ]);
  });

  it("should throw an error if no columns are provided", () => {
    const query: SelectClauseBuilderArgs = {
      columns: [],
      from: "Users",
    };

    expect(() => selectClauseBuilder(query)).toThrow(
      "Columns to select are required."
    );
  });

  it("should not throw an error if the id column is aliased and there is a group by clause in the query", () => {
    const query: SelectClauseBuilderArgs = {
      columns: [{ column: "id", alias: "user_id" }],
      from: "Users",
      groupByClauseExists: true,
    };

    const result = selectClauseBuilder(query);

    expect(result).toEqual(["select id as user_id from Users"]);
  });

  it("should not add an id column if there is a group by clause in the query", () => {
    const query: SelectClauseBuilderArgs = {
      columns: ["Name"],
      from: "Users",
      groupByClauseExists: true,
    };

    const result = selectClauseBuilder(query);

    expect(result).toEqual(["select Name from Users"]);
  });
});
