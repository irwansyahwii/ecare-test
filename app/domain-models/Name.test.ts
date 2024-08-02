import { expect, test } from "vitest";
import { ApplicationError } from "./ApplicationError";
import { Name } from "./Name";

test("Name length must be at least 3 characters", () => {
  expect(() => new Name("")).toThrow(
    new ApplicationError("Name length must be at least 3 characters"),
  );
  expect(() => new Name("12")).toThrow(
    new ApplicationError("Name length must be at least 3 characters"),
  );

  expect(() => new Name("123")).not.toThrow(
    new ApplicationError("Name length must be at least 3 characters"),
  );
});
