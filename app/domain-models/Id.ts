import { ApplicationError } from "./ApplicationError";

export class Id {
  private _value: string;
  
  public get Value():string{
    return this._value;
  }

  public Equals(otherId: Id):boolean{
    return (this.Value === otherId.Value);
  }
  
  constructor(value: string){
    this._value = value;
    if(!this._value || this._value.trim().length <=0){
      throw new ApplicationError("Id's value is required")
    }
  }

  public get IsEmpty(){
    return this._value.trim().length <= 0;
  }
  public get IsNotEmpty(){
    return this._value.trim().length > 0;
  }

  public toString():string{
    return this._value;
  }
}

