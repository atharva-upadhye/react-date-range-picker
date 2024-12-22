// @vitest-environment jsdom
import { test, expect } from "vitest";
import { printToConsole } from "./functions";

test("Should not crash", () => {
  expect(() => {
    printToConsole("0");
  }).toThrow("0 recieved");
});
