export interface Ika_profil {
  id?: number;
  codeProfil?: any;
  name?: any;
  cocher?: any;
  role?:any;
  operations?:any[];
  selectionner?:boolean;
  roleExcel?:any;
}
export class ka_profilModel implements Ika_profil {
  constructor(
    public id?: number,
    public codeProfil?: any,
    public name?: any,
    public cocher?: any,
    public role?:any,
    public operations?:any[],
    public selectionner=false,
    public roleExcel?:any,
  ) {}
}
