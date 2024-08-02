import { assert } from "vitest";
import { ApplicationError } from "./ApplicationError";
import { Id } from "./Id";
import { Name } from "./Name";

// note for Employee "An Employee may have a manager
// An Employee may have direct report(s)
// An employee having manager may not have any direct report
// An employee not having manager need to have direct report(s)
// An employee not having any direct report, need to have a manager"

export class Employee {
  private _id: Id;
  private _name: Name;
  private _managerId: Id | null;
  private _directReports: Employee[] = [];

  public get Id(): Id {
    return this._id;
  }

  public get Name(): Name {
    return this._name;
  }

  public get ManagerId(): Id | null {
    return this._managerId;
  }

  public get DirectReports(): Employee[] {
    return this._directReports;
  }

  constructor(
    id: Id,
    name: Name,
    managerId: Id | null,
    directReports: Employee[],
  ) {
    this._id = id;
    this._name = name;
    this._managerId = managerId;    

    if (!this.Name) {
      throw new ApplicationError("Name is required");
    }


    directReports.forEach((dr)=> {
      this.AddDirectReport(dr);
    })

  }

  public get IsValid():boolean {
    this._directReports.forEach((dr) => {
      if (!dr.ManagerId) {
        throw new ApplicationError(
          `Direct report ${dr.Name} has different manager id: ${dr.ManagerId}. Employee id: ${this.Id}`,
        );
      }
      if (dr.ManagerId) {
        if (!dr.ManagerId.Equals(this.Id)) {
          throw new ApplicationError(
            `Direct report ${dr.Name} has different manager id: ${dr.ManagerId}. Employee id: ${this.Id}`,
          );
        }
      }

      
    });

    const havingManager: boolean = this.ManagerId !== null ;
    const hasDirectReports: boolean = this.DirectReports.length > 0;
    // console.log('hasDirectReports:', hasDirectReports)
    if (!havingManager) {
      if (!hasDirectReports) {
        throw new ApplicationError(
          "An employee not having manager need to have direct report(s)",
        );
      }
    }

    return true;
  }

  public AddDirectReport(subordinate: Employee) {
    const foundExisting = this.DirectReports.find((e) =>
      e.Id.Equals(subordinate.Id),
    );

    if (foundExisting) {
      throw new ApplicationError(
        `Direct report with id ${subordinate.Id} already exists`,
      );
    }

    subordinate.AssignManager(this);
    this._directReports.push(subordinate);

    assert.isNotNull(subordinate.ManagerId);
    assert.isTrue(subordinate.ManagerId?.Equals(this.Id));
  }

  public AssignManager(manager: Employee) {
    this._managerId = new Id(manager.Id.Value);
  }
}
