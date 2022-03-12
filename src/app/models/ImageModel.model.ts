export interface IImage {
  id?: number;
  image?: any;
  produit?: any;

  def?: any;
  demande?: any;

}
export class ImageModel implements IImage {
  constructor(
    public id?: number,
    public image?: any,
    public produit?: any,

    public def?: any,
    public demande?: any,

  ) {}
}
