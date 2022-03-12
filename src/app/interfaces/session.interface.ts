export interface SessionInterface {
  token: string | null;
  username: string | null;
  email: string | null;
  prenom: string | null;
  nom: string | null;
  role: any;
  profils: any[] | [];
  jamaisConnectionAvecNouveauPassword: boolean | null;
}
