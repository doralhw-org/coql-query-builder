import { WhereCondition } from "../../types/where";
import { whereClauseBuilder, WhereClauseBuilderArgs } from "./where";

describe("Where Clause Builder", () => {
  it("should build a basic where clause", () => {
    const args: WhereClauseBuilderArgs = {
      where: [
        {
          equals: [{ column: "name" }, { value: "John" }],
        },
      ],
    };

    const result = whereClauseBuilder(args);

    expect(result).toEqual(["where (name = 'John')"]);
  });

  it("should build a where clause with multiple conditions", () => {
    const args: WhereClauseBuilderArgs = {
      where: [
        { equals: [{ column: "name" }, { value: "John" }] },
        { equals: [{ column: "age" }, { value: 30 }] },
      ],
    };

    const result = whereClauseBuilder(args);

    expect(result).toEqual(["where (name = 'John' and (age = 30))"]);
  });

  it("should build a where clause with a not condition", () => {
    const args: WhereClauseBuilderArgs = {
      where: [{ not: { equals: [{ column: "name" }, { value: "John" }] } }],
    };

    const result = whereClauseBuilder(args);

    expect(result).toEqual(["where (name != 'John')"]);
  });

  it("should build a where clause with a not condition and multiple conditions", () => {
    const args: WhereClauseBuilderArgs = {
      where: [
        { not: { equals: [{ column: "name" }, { value: "John" }] } },
        { equals: [{ column: "age" }, { value: 30 }] },
      ],
    };

    const result = whereClauseBuilder(args);

    expect(result).toEqual(["where (name != 'John' and (age = 30))"]);
  });

  it("should build a where clause with a not condition and multiple conditions and a or logic operator", () => {
    const args: WhereClauseBuilderArgs = {
      where: [
        {
          or: [
            { not: { equals: [{ column: "name" }, { value: "John" }] } },
            { equals: [{ column: "age" }, { value: 30 }] },
          ],
        },
      ],
    };

    const result = whereClauseBuilder(args);

    expect(result).toEqual(["where ((name != 'John' or (age = 30)))"]);
  });

  it("should build a where clause with two or conditions", () => {
    const args: WhereClauseBuilderArgs = {
      where: [
        {
          or: [
            { equals: [{ column: "name" }, { value: "John" }] },
            { equals: [{ column: "name" }, { value: "Jane" }] },
            { equals: [{ column: "last_name" }, { value: "Doe" }] },
          ],
        },
        {
          or: [
            { equals: [{ column: "age" }, { value: 30 }] },
            { equals: [{ column: "age" }, { value: 31 }] },
          ],
        },
      ],
    };

    const result = whereClauseBuilder(args);

    expect(result).toEqual([
      "where ((name = 'John' or (name = 'Jane' or (last_name = 'Doe'))) and ((age = 30 or (age = 31))))",
    ]);
  });

  it("should build a where clause including all comparison operators", () => {
    const args: WhereClauseBuilderArgs = {
      where: [
        { equals: [{ column: "name" }, { value: "John" }] },
        { not: { equals: [{ column: "name" }, { value: "Jane" }] } },
        { lessThan: [{ column: "age" }, { value: 30 }] },
        { lessThanOrEqual: [{ column: "age" }, { value: 50 }] },
        { greaterThan: [{ column: "age" }, { value: 18 }] },
        { greaterThanOrEqual: [{ column: "age" }, { value: 40 }] },
        { between: { column: "age", valueRange: [70, 80] } },
        { not: { between: { column: "age", valueRange: [10, 15] } } },
        {
          in: {
            column: "name",
            valueSet: ["John", "Jane"],
          },
        },
        {
          like: {
            column: "name",
            pattern: "John%",
          },
        },
      ],
    };

    const result = whereClauseBuilder(args);

    expect(result).toEqual([
      "where (name = 'John' and (name != 'Jane' and (age < 30 and (age <= 50 and (age > 18 and (age >= 40 and (age between 70 and 80 and (age not between 10 and 15 and (name in ('John', 'Jane') and (name like 'John%'))))))))))",
    ]);
  });

  it("should build a where clause with a raw condition", () => {
    const args: WhereClauseBuilderArgs = {
      where: [{ raw: "1 = 1" }],
    };

    const result = whereClauseBuilder(args);

    expect(result).toEqual(["where (1 = 1)"]);
  });

  it("should build a where clause with a raw condition and multiple conditions", () => {
    const args: WhereClauseBuilderArgs = {
      where: [{ raw: "1 = 1" }, { raw: "2 = 2" }],
    };

    const result = whereClauseBuilder(args);

    expect(result).toEqual(["where (1 = 1 and (2 = 2))"]);
  });

  it("should build a where clause with a batched in condition", () => {
    const args: WhereClauseBuilderArgs = {
      where: [
        {
          in: {
            column: "age",
            valueSet: Array.from({ length: 100 }, (_, i) => i),
          },
        },
      ],
    };

    const result = whereClauseBuilder(args);

    expect(result).toEqual([
      "where (age in (0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49))",
      "where (age in (50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99))",
    ]);
  });

  it("should build a where clause with two batched in conditions", () => {
    const args: WhereClauseBuilderArgs = {
      where: [
        {
          in: {
            column: "age",
            valueSet: Array.from({ length: 100 }, (_, i) => i),
          },
        },
        {
          in: {
            column: "age",
            valueSet: Array.from({ length: 100 }, (_, i) => i + 100),
          },
        },
      ],
    };

    const result = whereClauseBuilder(args);

    expect(result).toEqual([
      "where (age in (0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49) and (age in (100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149)))",
      "where (age in (50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99) and (age in (100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149)))",
      "where (age in (0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49) and (age in (150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199)))",
      "where (age in (50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99) and (age in (150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199)))",
    ]);
  });

  it("should throw an error if the where clause contains more than 25 conditions", () => {
    const args: WhereClauseBuilderArgs = {
      where: Array.from({ length: 26 }, () => ({
        equals: [{ column: "name" }, { value: "John" }],
      })),
    };

    expect(() => whereClauseBuilder(args)).toThrow(
      "Where clause cannot contain more than 25 conditions"
    );
  });

  it("should throw an error if the where clause contains an unknown condition", () => {
    const args: WhereClauseBuilderArgs = {
      where: [{ unknown: { column: "name" } } as unknown as WhereCondition],
    };

    expect(() => whereClauseBuilder(args)).toThrow(
      "Unknown condition: {\"unknown\":{\"column\":\"name\"}}"
    );
  });
});
