export interface Ika_operation {
  id?: number;
  nomOperation?: any;
  codeOperation?: any;
  cocher?: any;
  selectionner?:boolean;
}
export class Ka_operationModel implements Ika_operation {
  constructor(
    public id?: number,
    public nomOperation?: any,
    public codeOperation?: any,
    public cocher?: any,
    public selectionner=false,
  ) {}
}
