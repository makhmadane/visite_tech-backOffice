
export interface IRole {
  id?: number;
  name?: string;
  selectionner?:boolean;
}

export class Role implements IRole {
  constructor(
      public id?: number,
      public name?: string,
      public selectionner=false,
  ) {}
}
