import { Employee } from "../Employee";
import { OrganizationChartVisitor } from "./OrganizationChartVisitor";


export interface EmployeeLogger {
  Log(employee: Employee):void;
}

export class LogToConsole implements EmployeeLogger {
  Log(employee: Employee): void {
    console.log(employee.Id, ', managerId:', employee.ManagerId);
  }

}
export class DFSVisitor implements OrganizationChartVisitor {
  private _logger: EmployeeLogger;

  constructor(logger: EmployeeLogger){
    this._logger = logger;
  }
  Clear(): void {
    
  }

  Visit(employee: Employee): void {
    this._logger.Log(employee);    
    employee.DirectReports.forEach(dr => {
      this.Visit(dr);
    })
  }
}