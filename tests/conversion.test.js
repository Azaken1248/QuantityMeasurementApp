import { describe, it, expect } from "@jest/globals";
import { applyConversion, compareValues, performArithmetic } from "../javascript/conversion.js";

describe("applyConversion", () => {
  it("uses factor-based conversion", () => {
    const result = applyConversion(2, { factor: 2.54 });
    expect(result).toBe(5.08);
  });

  it("uses formula-based conversion", () => {
    const result = applyConversion(10, { formula: "(x * 9/5) + 32" });
    expect(result).toBe(50);
  });

  it("throws on invalid number input", () => {
    expect(() => applyConversion(Number.NaN, { factor: 2 })).toThrow("Invalid number");
  });

  it("throws when conversion config is missing", () => {
    expect(() => applyConversion(10, {})).toThrow("No conversion factor or formula provided");
  });
});

describe("compareValues", () => {
  it("returns GREATER when first base value is larger", () => {
    expect(compareValues(2, "m", 100, "cm", 2, 1)).toContain("GREATER");
  });

  it("returns LESS when first base value is smaller", () => {
    expect(compareValues(1, "m", 200, "cm", 1, 2)).toContain("LESS");
  });

  it("returns EQUAL when base values match", () => {
    expect(compareValues(100, "cm", 1, "m", 1, 1)).toContain("EQUAL");
  });

  it("handles invalid inputs gracefully", () => {
    expect(compareValues(Number.NaN, "m", 1, "m", 1, 1)).toContain("Invalid values");
  });
});

describe("performArithmetic", () => {
  it("adds values", () => {
    expect(performArithmetic(10, 5, "+")).toBe(15);
  });

  it("subtracts values", () => {
    expect(performArithmetic(10, 5, "-")).toBe(5);
  });

  it("multiplies values", () => {
    expect(performArithmetic(10, 5, "*")).toBe(50);
  });

  it("divides values", () => {
    expect(performArithmetic(10, 4, "/")).toBe(2.5);
  });

  it("throws on divide-by-zero", () => {
    expect(() => performArithmetic(10, 0, "/")).toThrow("Cannot divide by zero");
  });

  it("throws on unknown operator", () => {
    expect(() => performArithmetic(10, 2, "%")).toThrow("Unknown operator");
  });
});
