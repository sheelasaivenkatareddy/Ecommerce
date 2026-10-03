import { describe, expect, it } from "vitest";
import { formatPrice } from "./format";
import { safeRedirectPath } from "./paths";

describe("formatPrice", () => {
  it("formats paise as rupees with Indian digit grouping", () => {
    expect(formatPrice(34_900)).toBe("₹349");
    expect(formatPrice(6_499_000)).toBe("₹64,990");
    expect(formatPrice(12_345_678)).toBe("₹1,23,456.78");
  });
});

describe("safeRedirectPath", () => {
  it("allows paths on this site only", () => {
    expect(safeRedirectPath("/checkout")).toBe("/checkout");
    expect(safeRedirectPath("//evil.example")).toBe("/");
    expect(safeRedirectPath("/\\evil.example")).toBe("/");
    expect(safeRedirectPath("https://evil.example")).toBe("/");
    expect(safeRedirectPath(undefined)).toBe("/");
  });
});
