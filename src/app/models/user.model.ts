import { IRole } from "./role.model";

export interface IUser {
  id?: number;
  email?: string;
  password?: string;
  username?: string;
  nom?: string;
  prenom?: string;
  photo?: string;
  etat?: boolean;
  role?: String[];
  roles?: IRole[];
  profil?: any;
  typeUser?: any;
  codeAgence?:any;
}

export class User implements IUser {
  constructor(
    public id?: number,
    public email?: string,
    public password?: string,
    public username?: string,
    public nom?: string,
    public prenom?: string,
    public photo?: string,
    public etat?: boolean,
    public role?: String[],
    public roles?: IRole[],
    public profil?:any,
    public typeUser?:any,
    public codeAgence?:any,
  ) {
    this.etat = this.etat || false;
  }
}
