import { expect, test } from "vitest";
import { Employee } from "../Employee";
import { Id } from "../Id";
import { Name } from "../Name";
import { OrganizationChart } from "../OrganizationChart";
import data from "../correct-employees.json";
import { EmployeeLogger, PrintToConsoleVisitor } from "./PrintToConsoleVisitor";

class ToMemoryLogger implements EmployeeLogger {
  public IndexById:any = {};
  Log(employee: Employee): void {
    this.IndexById[employee.Id.Value] = employee;
  }

}

test("Load from correct-employees.json, must visit all the nodes", ()=>{
  const orgStructure = new OrganizationChart();
  data.forEach(d => {
    const employee = new Employee(new Id(d.id + ""), new Name(d.name), d.managerId ? new Id(d.managerId + "") : null, []);
    orgStructure.Add(employee);
  });

  orgStructure.IsValid;

  const memoryLogger = new ToMemoryLogger();

  const visitor = new PrintToConsoleVisitor(memoryLogger);
  orgStructure.Accept(visitor);

  data.forEach(d => {
    const foundEmployee: Employee = memoryLogger.IndexById[d.id + ""];
    const managerId = foundEmployee.ManagerId ? foundEmployee.ManagerId.Value : null;
    expect(foundEmployee.Id.Value).equals(d.id + "");
    expect(managerId).equals(d.managerId ? d.managerId + "": null);
  })

})


