export interface Ika_demande {
  id?: number;
  msisdn?: any;
  imsi?: any;
  etat?: any;
  motif?: any;
  operation?: any;
  nom?: any;
  prenom?: any;
  typePiece?: any;
  numeroPiece?: any;
  dateDelivrance?: any;
  commentaire?: any;
  dateNaissance?: any;
  email?: any;
  adresse?: any;
  selectionner?:boolean;
  referenceFacture?: any;

  


  
}
export class Ka_demandeModel implements Ika_demande {
  constructor(
    public id?: number,
    public msisdn?: any,
    public imsi?: any,
    public etat?: any,
    public motif?: any,
    public operation?: any,
    public nom?: any,
    public prenom?: any,
    public typePiece?: any,
    public numeroPiece?: any,
    public dateDelivrance?: any,
    public commentaire?: any,
    public dateNaissance?: any,
    public email?: any,
    public adresse?: any,

    public images?: any,
    
    public modifieePar?: any,
    public modifieeParId?: any,
    public modifieeParUsername?: any,

    public verrouilleePar?: any,
    public verrouilleeParId?: any,
    public verrouilleeParUsername?: any,
    public selectionner=false,
    public referenceFacture?: any
    
  ) {}
}
