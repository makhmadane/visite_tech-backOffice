export interface IVersion {
  id?: number;
  dateCreation?: any;
  version?: any;
  lien?: any;
  application?: any;
  required?: any;

}
export class VersionModel implements IVersion {
  constructor(
    public id?: number,
    public dateCreation?: any,
    public version?: any,
    public lien?: any,
    public application?: any,
    public required?: any,

  ) {}
}
