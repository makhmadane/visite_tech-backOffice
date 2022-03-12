export interface Ika_role {
  id?: number;
  name?: any;
  codeRole?: any;
  cocher?: any;
}

export class Ka_roleModel implements Ika_role {
  constructor(
    public id?: number,
    public name?: any,
    public codeRole?: any,
    public cocher?: any,
  ) {}
}
