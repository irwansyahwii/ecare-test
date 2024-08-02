import { expect, test } from "vitest";
import { ApplicationError } from "./ApplicationError";
import { Employee } from "./Employee";
import { Id } from "./Id";
import { Name } from "./Name";
import data from "./correct-employees.json";
import faultyData from "./faulty-employees.json";
import anotherFaultyData from "./another-faulty-employees.json";

test("Name is required", () => {
  expect(
    () =>{
      const emp =new Employee(undefined as any, undefined as any, undefined as any, []);
      emp.IsValid;
    }
      ,
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
      {
        const emp = new Employee(new Id("1"), new Name("Irwan"), null, [
          new Employee(new Id("1"), new Name("Juki"), new Id("1"), []),
          ]);
        emp.IsValid;
      },
  ).not.throws();
});

test("An Employee must have direct report with the correct manager id", () => {
    const emp = new Employee(new Id("1"), new Name("Irwan"), null, [
      new Employee(new Id("1"), new Name("Juki"), new Id("1=2"), []),
    ])
    emp.IsValid;

    expect(emp.DirectReports[0].ManagerId?.Value).equals(emp.Id.Value);

});

test("An employee having manager may not have any direct report", () => {
  expect(
    () => {
      const emp = new Employee(new Id("1"), new Name("Irwan"), new Id("2"), []);
      emp.IsValid;
    },
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
      {
        const emp = new Employee(new Id("1"), new Name("Irwan"), null, [
          new Employee(new Id("1"), new Name("Juki"), new Id("1"), []),
        ]);

        emp.IsValid;
      },
  ).not.throws();
});

//TODO: This business rule overlap with another business rule
// test('An employee not having any direct report, need to have a manager', ()=>{
//   expect(()=> {
//     const emp = new Employee(new Id("1"), new Name("Irwan"), null, []);

//     emp.IsValid;
//   }).not.throws()
// })
