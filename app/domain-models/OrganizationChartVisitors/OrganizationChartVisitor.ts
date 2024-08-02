import { Employee } from "../Employee";

export interface OrganizationChartVisitor {
  Visit(employee: Employee):void;
}