import { expect, test } from "vitest";
import { Employee } from "../Employee";
import { Id } from "../Id";
import { Name } from "../Name";
import { OrganizationChart } from "../OrganizationChart";
import data from "../correct-employees.json";
import forest from "../forest.json";
import { EmployeeLogger, DFSVisitor } from "./DFSVisitor";

class ToMemoryLogger implements EmployeeLogger {
  public IndexById:any = {};
  Log(employee: Employee): void {
    const key = employee.Id.Value;
    if(this.IndexById[key]){
      throw new Error(`Already visited id: ${key}`);
    }
    this.IndexById[key] = employee;

    
  }

}

test("Load from correct-employees.json, must visit all the nodes only once", ()=>{
  const orgStructure = new OrganizationChart();
  data.forEach(d => {
    const employee = new Employee(new Id(d.id + ""), new Name(d.name), d.managerId ? new Id(d.managerId + "") : null, []);
    orgStructure.Add(employee);
  });

  orgStructure.IsValid;

  const memoryLogger = new ToMemoryLogger();

  const visitor = new DFSVisitor(memoryLogger);
  orgStructure.Accept(visitor);

  for(let i = 0 ; i < data.length; i++){
    const d = data[i];
    const foundEmployee: Employee = memoryLogger.IndexById[d.id + ""];
    const managerId = foundEmployee.ManagerId ? foundEmployee.ManagerId.Value : null;
    expect(foundEmployee.Id.Value).equals(d.id + "");
    expect(managerId).equals(d.managerId ? d.managerId + "": null);

  }


})

test("Load from forest.json, must visit all the nodes only once", ()=>{
  const orgStructure = new OrganizationChart();
  forest.forEach(d => {
    const employee = new Employee(new Id(d.id + ""), new Name(d.name), d.managerId ? new Id(d.managerId + "") : null, []);
    orgStructure.Add(employee);
  });

  orgStructure.IsValid;

  const memoryLogger = new ToMemoryLogger();

  const visitor = new DFSVisitor(memoryLogger);
  orgStructure.Accept(visitor);

  for(let i = 0 ; i < forest.length; i++){
    const d = forest[i];
    const foundEmployee: Employee = memoryLogger.IndexById[d.id + ""];
    const managerId = foundEmployee.ManagerId ? foundEmployee.ManagerId.Value : null;
    expect(foundEmployee.Id.Value).equals(d.id + "");
    expect(managerId).equals(d.managerId ? d.managerId + "": null);
  }

})

