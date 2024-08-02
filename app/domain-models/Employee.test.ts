import { expect, test } from "vitest";
import { ApplicationError } from "./ApplicationError";
import { Employee } from "./Employee";
import { Id } from "./Id";
import { Name } from "./Name";

test("Name is required", () => {
  expect(
    () =>
      new Employee(undefined as any, undefined as any, undefined as any, []),
  ).toThrow(new ApplicationError("Name is required"));
});

test("An Employee may have a manager", () => {
  expect(
    () => new Employee(new Id("1"), new Name("Irwan"), new Id("adasda"), []),
  ).not.throws();
});

test("An Employee may have direct report(s)", () => {
  expect(
    () =>
      new Employee(new Id("1"), new Name("Irwan"), null, [
        new Employee(new Id("1"), new Name("Juki"), new Id("1"), []),
      ]),
  ).not.throws();
});

test("An Employee must not have direct report with different manager id", () => {
  expect(
    () =>
      new Employee(new Id("1"), new Name("Irwan"), null, [
        new Employee(new Id("1"), new Name("Juki"), new Id("1=2"), []),
      ]),
  ).toThrow(
    new ApplicationError(
      "Direct report Juki has different manager id: 1=2. Employee id: 1",
    ),
  );
});

test("An employee having manager may not have any direct report", () => {
  expect(
    () => new Employee(new Id("1"), new Name("Irwan"), new Id("2"), []),
  ).not.throws();
  expect(
    () =>
      new Employee(new Id("1"), new Name("Irwan"), new Id("2"), [
        new Employee(new Id("1"), new Name("Juki"), new Id("1"), []),
      ]),
  ).not.throws();
});

test("An employee not having manager need to have direct report(s)", () => {
  expect(
    () =>
      new Employee(new Id("1"), new Name("Irwan"), null, [
        new Employee(new Id("1"), new Name("Juki"), new Id("1"), []),
      ]),
  ).not.throws();
});

//TODO: This business rule overlap with another business rule
// test('An employee not having any direct report, need to have a manager', ()=>{
//   expect(()=> new Employee(new Id("1"), new Name("Irwan"), null, [])).not.throws()
// })
