import { test, expect } from "vitest";
import { DEVELOPER_NAME } from "./constants";
test("DEVELOPER_NAME", () => {
  expect(DEVELOPER_NAME).toBe("Atharva Upadhye");
});
