import { Employee } from "../Employee";
import { OrganizationChart } from "../OrganizationChart";
import { OrganizationChartVisitor } from "./OrganizationChartVisitor";

export class IndirectReportsCountVisitor implements OrganizationChartVisitor {
  Clear(): void {
    
  }
  public IndirectReportsCount:number = 0;
  Visit(employee: Employee, orgChart: OrganizationChart): void {
    employee.DirectReports.forEach(dr => {
      // this.CountIndirectReports(dr);
      this.VisitTheDirectReports(dr);
    })

    employee.IndirectReportsCount = this.IndirectReportsCount;
  }

  CountIndirectReports(employee: Employee){
    this.IndirectReportsCount++;
    employee.DirectReports.forEach(dr => {
      this.CountIndirectReports(dr);
    })
  }

  VisitTheDirectReports(employee: Employee){
    employee.DirectReports.forEach(dr => {
      this.CountIndirectReports(dr);
    })
  }

}