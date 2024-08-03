import { Employee } from "../Employee";
import { OrganizationChart } from "../OrganizationChart";

export interface OrganizationChartVisitor {
  Visit(employee: Employee, orgChart: OrganizationChart):void;
  Clear():void;
}