import { parseOperand } from "./condition";

describe("Operand Parsing", () => {
  it("should parse a column correctly", () => {
    const result = parseOperand({
      column: "test",
    });

    expect(result).toBe("test");
  });

  it("should parse a string value correctly", () => {
    const result = parseOperand({
      value: "test",
    });

    expect(result).toBe("'test'");
  });

  it("should parse a number value correctly", () => {
    const result = parseOperand({
      value: 123,
    });

    expect(result).toBe("123");
  });

  it("should parse a boolean value correctly", () => {
    const result = parseOperand({
      value: true,
    });

    expect(result).toBe("true");
  });

  it("should parse a null value correctly", () => {
    const result = parseOperand({
      value: null,
    });

    expect(result).toBe("null");
  });

  it("should parse a value surrounded by single quotes correctly", () => {
    const result = parseOperand({
      value: "'test'",
    });

    expect(result).toBe("'test'");
  });
});
