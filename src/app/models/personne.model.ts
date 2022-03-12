export interface IPersonne {
    id?: number;
    title?: string;
    date?: string;
    firstname?: string;
    email?: string;
    password?: string;
    acceptTerms?: boolean;
  
  }
  
  export class Personne implements IPersonne {
    constructor(public id?: number, public title?: string, public firstname?: string, public date?: string,
        public email?: string,public password?: string,public acceptTerms?: boolean) {}
  }
  