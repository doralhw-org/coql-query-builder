import { queryBuilder } from "./query-builder";

describe("COQL Query Builder", () => {
  it("should build a basic select query", () => {
    const queries = queryBuilder({
      columns: ["id", "Name"],
      from: "Users",
    });

    expect(queries).toEqual([
      "select id, Name from Users where id is not null",
    ]);
  });

  it("should build a select query with a limit", () => {
    const queries = queryBuilder({
      columns: ["id", "Name"],
      from: "Users",
      limit: { limit: 10 },
    });

    expect(queries).toEqual([
      "select id, Name from Users where id is not null limit 10",
    ]);
  });

  it("should build a select query with a pagination", () => {
    const queries = queryBuilder({
      columns: ["id", "Name"],
      from: "Users",
      pagination: { page: 2, pageSize: 10 },
    });

    expect(queries).toEqual([
      "select id, Name from Users where id is not null limit 10 offset 10",
    ]);
  });

  it("should throw an error if both limit and pagination are provided", () => {
    expect(() =>
      queryBuilder({
        columns: ["id", "Name"],
        from: "Users",
        limit: { limit: 10 },
        pagination: { page: 1, pageSize: 10 },
      })
    ).toThrow(
      "Cannot provide both pagination and limit as they conflict with each other"
    );
  });

  it("should throw an error if limit is provided when there is more than one where clause", () => {
    expect(() =>
      queryBuilder({
        columns: ["id", "Name"],
        from: "Users",
        where: [
          {
            in: {
              column: "id",
              valueSet: Array.from({ length: 1000 }, (_, index) => index),
            },
          },
        ],
        limit: { limit: 10 },
      })
    ).toThrow(
      "Cannot provide pagination or limit when using multiple where clauses"
    );
  });

  it("should throw an error if pagination is provided when there is more than one where clause", () => {
    expect(() =>
      queryBuilder({
        columns: ["id", "Name"],
        from: "Users",
        where: [
          {
            in: {
              column: "id",
              valueSet: Array.from({ length: 1000 }, (_, index) => index),
            },
          },
        ],
        pagination: { page: 1, pageSize: 10 },
      })
    ).toThrow(
      "Cannot provide pagination or limit when using multiple where clauses"
    );
  });

  it("should handle a complex query with multiple where clauses", () => {
    const queries = queryBuilder({
      columns: ["id", "Name", "age"],
      from: "Users",
      where: [
        { equals: [{ column: "name" }, { value: "John" }] },
        {
          between: {
            column: "age",
            valueRange: [20, 100],
          },
        },
        {
          in: {
            column: "id",
            valueSet: Array.from({ length: 100 }, (_, index) => index),
          },
        },
      ],
      orderBy: [
        { column: "id", direction: "asc" },
        { column: "age", direction: "desc" },
      ],
    });

    expect(queries).toEqual([
      "select id, Name, age from Users where (name = 'John' and (age between 20 and 100 and (id in (0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49)))) order by id asc, age desc",
      "select id, Name, age from Users where (name = 'John' and (age between 20 and 100 and (id in (50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99)))) order by id asc, age desc",
    ]);
  });

  it("should handle a complex query with multiple select clauses and where clauses", () => {
    const queries = queryBuilder({
      columns: [
        "id",
        "Name",
        "age",
        ...Array.from({ length: 96 }, (_, index) => `column_${index}`),
      ],
      from: "Users",
      where: [
        { equals: [{ column: "name" }, { value: "John" }] },
        {
          between: {
            column: "age",
            valueRange: [20, 100],
          },
        },
        {
          in: {
            column: "id",
            valueSet: Array.from({ length: 100 }, (_, index) => index),
          },
        },
      ],
      orderBy: [
        { column: "id", direction: "asc" },
        { column: "age", direction: "desc" },
      ],
    });

    expect(queries).toEqual([
      "select id, Name, age, column_0, column_1, column_2, column_3, column_4, column_5, column_6, column_7, column_8, column_9, column_10, column_11, column_12, column_13, column_14, column_15, column_16, column_17, column_18, column_19, column_20, column_21, column_22, column_23, column_24, column_25, column_26, column_27, column_28, column_29, column_30, column_31, column_32, column_33, column_34, column_35, column_36, column_37, column_38, column_39, column_40, column_41, column_42, column_43, column_44, column_45, column_46 from Users where (name = 'John' and (age between 20 and 100 and (id in (0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49)))) order by id asc, age desc",
      "select id, Name, age, column_0, column_1, column_2, column_3, column_4, column_5, column_6, column_7, column_8, column_9, column_10, column_11, column_12, column_13, column_14, column_15, column_16, column_17, column_18, column_19, column_20, column_21, column_22, column_23, column_24, column_25, column_26, column_27, column_28, column_29, column_30, column_31, column_32, column_33, column_34, column_35, column_36, column_37, column_38, column_39, column_40, column_41, column_42, column_43, column_44, column_45, column_46 from Users where (name = 'John' and (age between 20 and 100 and (id in (50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99)))) order by id asc, age desc",
      "select id, column_47, column_48, column_49, column_50, column_51, column_52, column_53, column_54, column_55, column_56, column_57, column_58, column_59, column_60, column_61, column_62, column_63, column_64, column_65, column_66, column_67, column_68, column_69, column_70, column_71, column_72, column_73, column_74, column_75, column_76, column_77, column_78, column_79, column_80, column_81, column_82, column_83, column_84, column_85, column_86, column_87, column_88, column_89, column_90, column_91, column_92, column_93, column_94, column_95 from Users where (name = 'John' and (age between 20 and 100 and (id in (0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49)))) order by id asc, age desc",
      "select id, column_47, column_48, column_49, column_50, column_51, column_52, column_53, column_54, column_55, column_56, column_57, column_58, column_59, column_60, column_61, column_62, column_63, column_64, column_65, column_66, column_67, column_68, column_69, column_70, column_71, column_72, column_73, column_74, column_75, column_76, column_77, column_78, column_79, column_80, column_81, column_82, column_83, column_84, column_85, column_86, column_87, column_88, column_89, column_90, column_91, column_92, column_93, column_94, column_95 from Users where (name = 'John' and (age between 20 and 100 and (id in (50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99)))) order by id asc, age desc",
    ]);
  });

  it("should not add id column if there is a group by clause", () => {
    const queries = queryBuilder({
      columns: ["Name"],
      from: "Users",
      where: [{ equals: [{ column: "name" }, { value: "John" }] }],
      groupBy: ["name"],
    });

    expect(queries).toEqual([
      "select Name from Users where (name = 'John') group by name",
    ]);
  });
});
