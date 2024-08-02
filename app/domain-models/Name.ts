import { ApplicationError } from "./ApplicationError";

export class Name {
  private _value: string;

  constructor(value: string){
    this._value = value;

    if(!this._value || this._value.trim().length < 3){
      throw new ApplicationError("Name length must be at least 3 characters")
    }

  }

  public toString():string{
    return this._value;
  }

}