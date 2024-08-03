import { OrganizationChart } from "../domain-models/OrganizationChart";
import data from "../domain-models/fake-data/correct-employees.json";
import { Employee } from "../domain-models/Employee";
import { Id } from "../domain-models/Id";
import { Name } from "../domain-models/Name";
import { ReactFlowVisitor } from "../domain-models/OrganizationChartVisitors/ReactFlowVisitor";



export class OrganizationChartStore {
  orgStructure: OrganizationChart = new OrganizationChart();
  visitor: ReactFlowVisitor = new ReactFlowVisitor();

  constructor(){


    data.forEach(d => {
      const employee = new Employee(new Id(d.id + ""), new Name(d.name), d.managerId ? new Id(d.managerId + "") : null, []);
      this.orgStructure.Add(employee);
    });

    this.orgStructure.IsValid;

    this.orgStructure.Accept(this.visitor);

       
  }

  public ApplyFilter(value: string){    
    this.visitor.Filtername = value;   
    
    this.orgStructure.Accept(this.visitor); 
    
    
  }
}

export const orgChartStore = new OrganizationChartStore();