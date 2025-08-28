import { CoqlQueryBuilder } from "./coql-query-builder";
import { queryBuilder } from "./query-builder";

jest.mock("./query-builder");

describe("COQL Query Builder Class", () => {
  const mockQueryBuilder = jest.mocked(queryBuilder);
  const mockQueryFunction = jest.fn().mockResolvedValue({
    data: [{ id: "1", First_Name: "John" }],
    info: {
      count: 1,
      more_records: false,
    },
  });

  beforeEach(() => {
    jest.clearAllMocks();

    mockQueryBuilder.mockReturnValue(["select id, First_Name from users"]);
  });

  it("should return a basic select query with no metadata", async () => {
    const builder = new CoqlQueryBuilder({
      queryFunction: mockQueryFunction,
    });

    const records = await builder.select({
      columns: ["id", "First_Name"],
      from: "users",
    });

    expect(records).toEqual([{ id: "1", First_Name: "John" }]);
  });

  it("should deduplicate records", async () => {
    mockQueryFunction.mockResolvedValueOnce({
      data: [{ id: "1", First_Name: "John", Email: "john@example.com" }],
      info: {
        count: 1,
        more_records: false,
      },
    });
    mockQueryFunction.mockResolvedValueOnce({
      data: [{ id: "1", Mobile: "1234567890" }],
      info: {
        count: 1,
        more_records: false,
      },
    });

    mockQueryBuilder.mockReturnValue([
      "select id, First_Name, Email from users",
      "select id, Mobile from users",
    ]);

    const builder = new CoqlQueryBuilder({
      queryFunction: mockQueryFunction,
    });

    // Mocking workaround when we exceed 50 columns selected
    const records = await builder.select({
      columns: ["id", "First_Name", "Email", "Mobile"],
      from: "users",
    });

    expect(records).toEqual([
      {
        id: "1",
        First_Name: "John",
        Email: "john@example.com",
        Mobile: "1234567890",
      },
    ]);
  });

  it("should return a basic select query with metadata", async () => {
    const builder = new CoqlQueryBuilder({
      queryFunction: mockQueryFunction,
    });

    const records = await builder.select(
      {
        columns: ["id", "First_Name"],
        from: "users",
      },
      {
        includeMetadata: true,
      }
    );

    expect(records).toEqual({
      data: [{ id: "1", First_Name: "John" }],
      info: {
        count: 1,
        more_records: false,
      },
    });
  });

  it("should deduplicate records with metadata", async () => {
    mockQueryFunction.mockResolvedValueOnce({
      data: [
        { id: "1", First_Name: "John", Email: "john@example.com" },
        { id: "2", First_Name: "Bessy", Email: "bessy@example.com" },
      ],
      info: {
        count: 1,
        more_records: false,
      },
    });
    mockQueryFunction.mockResolvedValueOnce({
      data: [
        { id: "1", Mobile: "1234567890" },
        { id: "2", Mobile: "1234567890" },
      ],
      info: {
        count: 1,
        more_records: false,
      },
    });

    mockQueryBuilder.mockReturnValue([
      "select id, First_Name, Email from users",
      "select id, Mobile from users",
    ]);

    const builder = new CoqlQueryBuilder({
      queryFunction: mockQueryFunction,
    });

    // Mocking workaround when we exceed 50 columns selected
    const records = await builder.select(
      {
        columns: ["id", "First_Name", "Email", "Mobile"],
        from: "users",
      },
      {
        includeMetadata: true,
      }
    );

    expect(records).toEqual({
      data: [
        {
          id: "1",
          First_Name: "John",
          Email: "john@example.com",
          Mobile: "1234567890",
        },
        {
          id: "2",
          First_Name: "Bessy",
          Email: "bessy@example.com",
          Mobile: "1234567890",
        },
      ],
      info: {
        count: 2,
        more_records: false,
      },
    });
  });

  it("should return built single query from query builder", () => {
    const builder = new CoqlQueryBuilder({
      queryFunction: mockQueryFunction,
    });

    const queries = builder.buildQuery({
      columns: ["id", "First_Name"],
      from: "users",
    });

    expect(queries).toEqual(["select id, First_Name from users"]);
  });

  it("should return built multiple queries from query builder", () => {
    const mockQueries = [
      "select id, First_Name from users",
      "select id, First_Name from users where (First_Name = 'John')",
    ];

    mockQueryBuilder.mockReturnValue(mockQueries);

    const builder = new CoqlQueryBuilder({
      queryFunction: mockQueryFunction,
    });

    const queries = builder.buildQuery({
      columns: ["id", "First_Name"],
      from: "users",
      where: [
        {
          equals: [{ column: "First_Name" }, { value: "John" }],
        },
      ],
    });

    expect(queries).toEqual(mockQueries);
  });

  it("should return an empty array when no results are returned", async () => {
    mockQueryFunction.mockResolvedValue("");

    const builder = new CoqlQueryBuilder({
      queryFunction: mockQueryFunction,
    });

    const records = await builder.select({
      columns: ["id", "First_Name"],
      from: "users",
    });

    expect(records).toEqual([]);
  });

  it("should return an empty array when no results are returned with metadata", async () => {
    mockQueryFunction.mockResolvedValue("");

    const builder = new CoqlQueryBuilder({
      queryFunction: mockQueryFunction,
    });

    const records = await builder.select(
      {
        columns: ["id", "First_Name"],
        from: "users",
      },
      {
        includeMetadata: true,
      }
    );

    expect(records).toEqual({
      data: [],
      info: {
        count: 0,
        more_records: false,
      },
    });
  });

  it("should ignore empty string results when deduplicating", async () => {
    mockQueryFunction.mockResolvedValueOnce("");
    mockQueryFunction.mockResolvedValueOnce({
      data: [{ id: "2", First_Name: "John" }],
      info: {
        count: 1,
        more_records: false,
      },
    });

    mockQueryBuilder.mockReturnValue([
      "select id, First_Name from users where id in (1)",
      "select id, First_Name from users where id in (2)",
    ]);

    const builder = new CoqlQueryBuilder({
      queryFunction: mockQueryFunction,
    });

    const records = await builder.select({
      columns: ["id", "First_Name"],
      from: "users",
    });

    expect(records).toEqual([{ id: "2", First_Name: "John" }]);
  });

  it("should ignore empty string results when deduplicating with metadata", async () => {
    mockQueryFunction.mockResolvedValueOnce("");
    mockQueryFunction.mockResolvedValueOnce({
      data: [{ id: "2", First_Name: "John" }],
      info: {
        count: 1,
        more_records: false,
      },
    });

    mockQueryBuilder.mockReturnValue([
      "select id, First_Name from users where id in (1)",
      "select id, First_Name from users where id in (2)",
    ]);

    const builder = new CoqlQueryBuilder({
      queryFunction: mockQueryFunction,
    });

    const records = await builder.select(
      {
        columns: ["id", "First_Name"],
        from: "users",
      },
      {
        includeMetadata: true,
      }
    );

    expect(records).toEqual({
      data: [{ id: "2", First_Name: "John" }],
      info: {
        count: 1,
        more_records: false,
      },
    });
  });
});
