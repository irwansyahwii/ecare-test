import { ApplicationError } from "../ApplicationError";
import { Employee } from "../Employee";
import { OrganizationChart } from "../OrganizationChart";
import { IndirectReportsCountVisitor } from "./IndirectReportsCountVisitor";
import { OrganizationChartVisitor } from "./OrganizationChartVisitor";

const position = { x: 0, y: 0 };
const edgeType = 'smoothstep';

export class ReactFlowVisitor implements OrganizationChartVisitor {

  Clear() {
    this.initialEdges = [];
    this.initialNodes = [];
    
  }

  public initialNodes: any[] = [];
  public initialEdges: any[] = [];

  private _filterName: string = "";
  private _orgChart: OrganizationChart | null = null;
  private _stopRegularVisit: boolean = false;


  public set Filtername(value:string){
    this._filterName =value;
    this._stopRegularVisit = false;
  }

  public get FilterName():string {
    return this._filterName;
  }
  

  GetLabel(node: Employee):string{
    return `${node.Name.toString()} (${node.DirectReports.length}/${node.IndirectReportsCount})`;
  }

  VisitToRoot(start: Employee):void{
    this.initialNodes.push(
      {
        id: start.Id.Value,        
        data: { label: this.GetLabel(start) },
        position,
      }
    )
    if(start.ManagerId){
      this.initialEdges.push({
        id: `e${start.Id.Value}`,
        source: start.ManagerId.Value,
        target: start.Id.Value,
        type: edgeType, animated: true
      })

      const manager = this._orgChart?.GetEmployeeById(start.ManagerId!);
      if(!manager){
        throw new ApplicationError(`Failed to find manager with id: ${start.ManagerId} for employee id:${start.Id}`)
      }
      this.VisitToRoot(manager!);

    }

  }

  Visit(employee: Employee, orgChart: OrganizationChart): void {

    this._orgChart = orgChart;

    if(employee.Name.toString().trim().toLowerCase() === this.FilterName.trim().toLowerCase()){
      this._stopRegularVisit = true;
      this.Clear();      
      this.VisitToRoot(employee);
      return;
    }

    const indirectReportsVisitor = new IndirectReportsCountVisitor();
    indirectReportsVisitor.Visit(employee, orgChart);

    employee.IndirectReportsCount = indirectReportsVisitor.IndirectReportsCount;


    this.initialNodes.push(
      {
        id: employee.Id.Value,        
        data: { label: this.GetLabel(employee) },
        position,
      }
    )
    if(employee.ManagerId){
      this.initialEdges.push({
        id: `e${employee.Id.Value}`,
        source: employee.ManagerId.Value,
        target: employee.Id.Value,
        type: edgeType, animated: true
      })
    }

    employee.DirectReports.forEach(dr => {
      if(!this._stopRegularVisit){
        this.Visit(dr, orgChart);
      }      
    });

  }

}