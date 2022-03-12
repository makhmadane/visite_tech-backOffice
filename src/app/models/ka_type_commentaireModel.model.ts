export interface Ika_type_commentaire {
  id?: number;
  commentaire?: any;

  cocher?: any;
}

export class Ka_type_commentaireModel implements Ika_type_commentaire {
  constructor(
    public id?: number,
    public commentaire?: any,

    public cocher?: any,
  ) {}
}
