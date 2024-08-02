import { Employee } from "../Employee";
import { OrganizationChartVisitor } from "./OrganizationChartVisitor";

export class PrintToConsoleVisitor implements OrganizationChartVisitor {
  Visit(employee: Employee): void {
    console.log(employee.Id, ', managerId:', employee.ManagerId);
    employee.DirectReports.forEach(dr => {
      this.Visit(dr);
    })
  }
}