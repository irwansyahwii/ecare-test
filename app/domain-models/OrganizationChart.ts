import { ApplicationError } from "./ApplicationError";
import { Employee } from "./Employee";
import { Id } from "./Id";
import { OrganizationChartVisitor } from "./OrganizationChartVisitors/OrganizationChartVisitor";

export class OrganizationChart {
  private _tree: Employee[] = [];
  private _indexById:any = {};
  private _flatStructure: Employee[] = [];

  public get FlatStructure():Employee[]{
    return this._flatStructure;
  }

  public get Tree():Employee[] {
    return this._tree;
  }

  public GetEmployeeById(id: Id): Employee | null{    
    return this._indexById[id.Value] || null;
  }

  public Add(employee: Employee):void{
    if(this._indexById[employee.Id.Value]){
      throw new ApplicationError(`Employee already exists with id: ${employee.Id}`);
    }else{
      this._indexById[employee.Id.Value] = employee;
    }
    if(employee.ManagerId === null){
      this._tree.push(employee);
    }else{
      const manager: Employee = this._indexById[employee.ManagerId.Value];
      manager.AddDirectReport(employee);
    }
    this._flatStructure.push(employee);
  }

  public get IsValid():boolean{
    
    if(this._tree.length > 1){
      throw new ApplicationError("Only one root node is allowed");
    }
    for(let i = 0; i < this._flatStructure.length; i++){
      this._flatStructure[i].IsValid
    }

    return true;
  }

  public Accept(visitor: OrganizationChartVisitor):void{
    visitor.Visit(this.Tree[0], this);
  }
}