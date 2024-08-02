import { expect, test } from "vitest";
import { Employee } from "../Employee";
import { Id } from "../Id";
import { Name } from "../Name";
import { OrganizationChart } from "../OrganizationChart";
import data from "../correct-employees.json";
import { PrintToConsoleVisitor } from "./PrintToConsoleVisitor";

test("Load from correct-employees.json, must build the structure correcly", ()=>{
  const orgStructure = new OrganizationChart();
  data.forEach(d => {
    const employee = new Employee(new Id(d.id + ""), new Name(d.name), d.managerId ? new Id(d.managerId + "") : null, []);
    orgStructure.Add(employee);
  });

  orgStructure.IsValid;

  const visitor = new PrintToConsoleVisitor();
  orgStructure.Accept(visitor);


})


