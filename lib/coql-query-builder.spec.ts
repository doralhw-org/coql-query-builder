import { CoqlQueryBuilder } from "./coql-query-builder";
import { queryBuilder } from "./query-builder";

jest.mock("./query-builder");

describe("COQL Query Builder Class", () => {
  const mockQueryBuilder = jest.mocked(queryBuilder);
  const mockQueryFunction = jest.fn().mockResolvedValue({
    data: [],
    info: {
      count: 0,
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

    expect(records).toEqual([]);
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
      data: [],
      info: {
        count: 0,
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
});
