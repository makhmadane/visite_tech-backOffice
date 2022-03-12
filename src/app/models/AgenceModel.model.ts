export interface IAgence {
  id?: number;
  codeAgence?: any;
  adresse?: any;
  ville?: any;
  nom?: any;


}
export class AgenceModel implements IAgence {
  constructor(
    public id?: number,
    public codeAgence?: any,
    public adresse?: any,
    public ville?: any,
    public nom?: any,
   

  ) {}
}
