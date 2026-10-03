import { describe, expect, it } from "vitest";
import { fieldErrors, registerSchema, shippingSchema } from "./validation";

const address = {
  name: "Ravi Kumar",
  phone: "9876543210",
  address: "12 MG Road, Indiranagar",
  city: "Bengaluru",
  state: "Karnataka",
  pincode: "560038",
};

describe("shippingSchema", () => {
  it("accepts a valid Indian address", () => {
    expect(shippingSchema.safeParse(address).success).toBe(true);
  });

  it("explains each invalid field", () => {
    const result = shippingSchema.safeParse({ ...address, phone: "12345", pincode: "0123", state: "Atlantis" });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(fieldErrors(result.error)).toEqual({
      phone: "Enter a valid 10-digit mobile number",
      pincode: "Enter a valid 6-digit PIN code",
      state: "Choose a state",
    });
  });
});

describe("registerSchema", () => {
  it("normalises the email address", () => {
    const result = registerSchema.parse({ name: " Asha Rao ", email: " Asha@Example.COM ", password: "Password123" });
    expect(result).toMatchObject({ name: "Asha Rao", email: "asha@example.com" });
  });

  it("requires a password of at least 8 characters", () => {
    const result = registerSchema.safeParse({ name: "Asha Rao", email: "asha@example.com", password: "short" });
    expect(result.success).toBe(false);
  });
});
