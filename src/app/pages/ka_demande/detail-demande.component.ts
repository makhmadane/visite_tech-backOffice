import { Component, Input, OnInit } from "@angular/core";
import Swal from "sweetalert2";
import { Ka_demandeModel } from '../../models/ka_demandeModel.model';
import { ImageModel } from '../../models/ImageModel.model';
import { Ka_demandeService } from '../../services/Ka_demande.service';
import { SessionInterface } from '../../interfaces/session.interface';
import { SessionService } from '../../services/session.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Output, EventEmitter } from '@angular/core';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { environment } from "src/environments/environment";
import { Ng2ImgMaxService } from "ng2-img-max";
import { DomSanitizer } from "@angular/platform-browser";
import { UserService } from "src/app/services/user.service";


@Component({
  selector: "app-detail-demande",
  templateUrl: "./detail-demande.component.html",
  styleUrls: ["./ka_demande.component.css"],
})
export class DetaildemandeComponent implements OnInit {
  
  @Input() demandeId: number = -1;
  @Input() typedossiers: any[];
  @Input() motifs: any[];
  @Input() typeCommentaires:any[];
  @Input() typeEtats:any[];
  @Input() typePieces:any[];
  @Output() newItemEvent = new EventEmitter<boolean>();
  p: number = 1;
  closeResult: string;
  title = 'appBootstrap';
  collection: any;
  imageObject: ImageModel;
  demandeEmpty = "assets/img/avatars/empty-img.png";
  estVerrouilerParOther: boolean = false;
  uinfo: SessionInterface;
  modalPhoto=false;
  photoModal:any;
  photoRecto:any;
  photoVerso:any;
  photoCourant:any;
  motifCourant:any;
  typeCommantaireCourant:any;
  photoSignature:any;
  historiques:[];

tof:any;
  
  
  constructor(
    private Ka_demandeservice: Ka_demandeService,
    public sessionService: SessionService,
    private spinner: NgxSpinnerService,
    private ng2ImgMax: Ng2ImgMaxService,
    public sanitizer: DomSanitizer,
    private userService:UserService
  ) {}


  public ngOnInit() {
   
   
    this.spinner.show();
    this.uinfo = this.sessionService.parseSession();
    this.collection=new Ka_demandeModel();
    if(this.demandeId !== -1) {
      this.Ka_demandeservice.ouvrirdossier(this.demandeId).subscribe(
      (dataDemande: any) => {
        if(dataDemande.success === true){
          
          this.historiques=dataDemande.historiqueDemande;
          console.log(this.historiques)
          this.responseOneDemande(dataDemande.data);
        }
        this.spinner.hide();
      }, (error) => {
        this.spinner.hide();
      });
    }
  }

  addNewItem(value: boolean) {
    this.newItemEvent.emit(value);
  }
  responseOneDemande(data){
    this.collection = data;
    console.log(data);
    console.log("dane");
    this.photoRecto=this.collection.images.filter((a)=>a.type.toUpperCase().includes("CNI_RECTO"))[0];

    this.photoVerso=this.collection.images.filter((a)=>a.type.toUpperCase().includes("CNI_VERSO"))[0];
   
    this.photoSignature=this.collection.images.filter((a)=>a.type.toUpperCase().includes("SIGNATURE"))[0];
    if(this.collection.verrouilleeParUsername === null){
      this.estVerrouilerParOther = false;
    }else if(this.collection.verrouilleeParUsername !== this.uinfo.username){
      this.estVerrouilerParOther = true;
    } else{
      this.estVerrouilerParOther = false;
    }
  }

  getValues(a,b) {
    ///////////////////////////////
    if(a==="Enregistrer"){
      this.enregistrerdossier();
    }
    if(a==="Archiver"){
      this.archiverdossier();
    }
    if(a==="Valider"){
      this.validerdossier();
    }
    if(a==="Invalider"){
      this.invaliderdossier();
    }
  }

  invaliderdossier() {
    this.spinner.show();
    const dataInvaldation = {
      operation:this.collection.operation,
      motif: (this.collection.motif === null) ? this.collection.motif : this.collection.motif.nomMotif,
      typeCommentaire: (this.collection.typeCommentaire === null) ? this.collection.typeCommentaire : this.collection.typeCommentaire.commentaire,
      commentaire:this.collection.commentaire
    }
    this.Ka_demandeservice.invaliderdossier(this.demandeId, dataInvaldation).subscribe(
      (dataDemande: any) => {
        this.spinner.hide();  
        if(dataDemande.success === true){
          this.responseOneDemande(dataDemande.data);
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Dossier invalidé avec succés',
            background:'white',
            showConfirmButton: false,
            timer: 3000
          });
        } else{
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Echec rejet Dossier : ' + dataDemande.message,
            background:'white',
            showConfirmButton: false,
            timer: 3000
          });
        }
        document.getElementById('rejet-demande-form')?.click();
      }, (error) => {
        this.spinner.hide();  
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Echec rejet Dossier',
          background:'white',
          showConfirmButton: false,
          timer: 3000
        });
        document.getElementById('rejet-demande-form')?.click();
      }
    );
  }

  archiverdossier() {
    this.spinner.show();
    this.Ka_demandeservice.archiverdossier(this.demandeId).subscribe(
      (dataDemande: any) => {
        this.spinner.hide();
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: "Dossier archivé avec succés",
          background:'white',
          showConfirmButton: false,
          timer: 3000
        });
        this.spinner.hide();
        if(dataDemande.success === true){
          this.responseOneDemande(dataDemande.data);
        }  
      }, (error) => {
        this.spinner.hide();
      }
    ); 
  }

  enregistrerdossier() {
    this.spinner.show();
    const dataInvaldation = {
      operation:this.collection.operation,
      typeCommentaire: (this.collection.typeCommentaire === null) ? this.collection.typeCommentaire : this.collection.typeCommentaire.commentaire,
      commentaire:this.collection.commentaire
    }
    this.Ka_demandeservice.enregistrerdossier(this.demandeId, dataInvaldation).subscribe(
      (dataDemande: any) => {
        this.spinner.hide();
        if(dataDemande.success === true){
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: "Dossier enregistré avec succés",
            background:'white',
            showConfirmButton: false,
            timer: 3000
          });
          this.responseOneDemande(dataDemande.data);
          document.getElementById('save-demande-form')?.click();
        }  
      }, (error) => {
        this.spinner.hide();  
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Echec enregistrement Dossier',
          background:'white',
          showConfirmButton: false,
          timer: 3000
        });
        document.getElementById('save-demande-form')?.click();
      }
    ); 
  }

   compressImage(src, newX, newY) {
    return new Promise((res, rej) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        const elem = document.createElement('canvas');
        elem.width = newX;
        elem.height = newY;
        const ctx = elem.getContext('2d');
        ctx.drawImage(img, 0, 0, newX, newY);
        const data = ctx.canvas.toDataURL();
        res(data);
      }
      img.onerror = error => rej(error);
    })
  }

  validerdossier() {
    this.spinner.show();
    this.Ka_demandeservice.validerdossier(this.demandeId).subscribe(
      (dataDemande: any) => {
        this.spinner.hide();
        if(dataDemande.historiqueDemande !== null){
          this.historiques=dataDemande.historiqueDemande;
        }
        if(dataDemande.success === true){
          this.responseOneDemande(dataDemande.data);
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: "Dossier validé avec succés",
            background:'white',
            showConfirmButton: false,
            timer: 3000
          });  
        } else {
          this.responseOneDemande(dataDemande.data);
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: "Echec validation Dossier : " + dataDemande.message,
            background:'white',
            showConfirmButton: false,
            timer: 3000
          });  
        } 
      }, (error) => {
        this.spinner.hide();
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: "Echec validation Dossier",
          background:'white',
          showConfirmButton: false,
          timer: 3000
        });  
    }
    );
  }

  suivantPage() {
    this.Ka_demandeservice.ouvrirdossiersuivant(this.demandeId).subscribe(
      (dataDemande: any) => {
        this.spinner.hide();
        if(dataDemande && (dataDemande.success === true)){
          this.demandeId = dataDemande.data.id;
          this.responseOneDemande(dataDemande.data);
        }
        else{
          this.spinner.hide();
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title:  dataDemande.message,
            background:'white',
            showConfirmButton: false,
            timer: 3000
          });
        }
      }, (error) => {
        this.spinner.hide();
      }
    );
  }
  
  reouvrirDemande() {
    this.spinner.show()
    this.Ka_demandeservice.reouvrirdossier(this.demandeId).subscribe(
      (dataDemande: any) => {
        this.spinner.hide();
        if(dataDemande && (dataDemande.success === true)){
          this.responseOneDemande(dataDemande.data);
        }
      }, (error) => {
        this.spinner.hide();
      }
    );
  }

  onOpenModal(admin: any, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if(mode === 'add'){
      button.setAttribute('data-target', '#addAdminBySuperadminModal');
    }
    if(mode === 'save'){
      button.setAttribute('data-target', '#saveAdminBySuperadminModal');
    }
    if(mode === 'histo'){
      button.setAttribute('data-target', '#histoAdminBySuperadminModal');
    }
    if(mode === 'rejet'){
      this.motifCourant=admin.motif;
      this.typeCommantaireCourant=admin.typeCommentaire;
      button.setAttribute('data-target', '#rejetAdminBySuperadminModal');
      this.photoCourant= admin;
     // this.motifCourant.nomMotif;
     // this.typeCommantaireCourant.commentaire;
      
    
    }
    container?.appendChild(button);
    button.click();
    if(mode === 'add' || mode === 'save' || mode === 'rejet' || mode === 'histo'){
      const element1:any = document.getElementsByClassName('modal fade modal');
      element1[0].style.top = "40%";
      element1[1].style.top = "40%";
      element1[2].style.top = "30%";
      element1[3].style.top =this.getScrollPercent()/2+"%";
      const element:any = document.getElementsByClassName('modal-backdrop in');
      element[0].style.opacity = "0";
    }
   
  }

  getScrollPercent() {
      var h = document.documentElement,   
      b = document.body,
      st = 'scrollTop',
      sh = 'scrollHeight';
    return (h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight) * 100;
  }
  
  changephoto(a){
    if(a=="CNI_VERSO"){
      this.photoModal=this.collection.images.filter((a)=>a.type==="CNI_RECTO")[0];
    }else{
      this.photoModal=this.collection.images.filter((a)=>a.type==="CNI_VERSO")[0];
    }
  }

  ismodalPhoto(p){
    this.photoModal=p;
    this.modalPhoto=!this.modalPhoto;
  }

  isrejetPhoto(photo:any){
      if(this.motifCourant!=null){
        photo.motif=this.motifCourant.nomMotif;
      }
      if(this.typeCommantaireCourant!=null){
        photo.typeCommentaire=this.typeCommantaireCourant.commentaire;
      }
    this.spinner.show();
    photo.etat=-1;
    let a={
      "motif":photo.motif,
      "typeCommentaire":photo.typeCommentaire
    }
    this.Ka_demandeservice.updateEtatImage(photo.id,"rejeter",a).subscribe(
      (dataImage: any) => {
        document.getElementById('rejet-demande-form1')?.click();
        
        this.spinner.hide();  
      }, (error) => {
        this.spinner.hide();  
      }
    );
   
    this.modalPhoto=!this.modalPhoto;
  }

  precedentPage() {
    window.history.back();
  }
  
  isvalidePhoto(photo:any){
    this.spinner.show();
    photo.etat=1;
    this.Ka_demandeservice.updateEtatImage(photo.id,"valider",{}).subscribe(
      (dataImage: any) => {
        this.spinner.hide();  
      }, (error) => {
        this.spinner.hide();  
      }
    );
    //this.onOpenModal(null, 'add');
    this.modalPhoto=!this.modalPhoto;
  }

  closeRectoVerso(){
    this.modalPhoto=!this.modalPhoto;
  }

  getOperationLabelle(codeOperation){
    return this.typedossiers.filter(type => type.codeOperation === codeOperation)[0]?.nomOperation;
  }

  onImageChange(url,name) {
    this.ng2ImgMax.resizeImage(this.dataURLtoFile(url, name), 200, 200).subscribe(
      result => {
        this.getImagePreview(new File([result], result.name));
      },
      error => {
       
      }
    );
    }

    getImagePreview(file: File) {
      const reader: FileReader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.tof = reader.result;
      };
    }

  urlImage(nameImage:string): string{
    let url = nameImage.endsWith(".png") ? (environment.Localurl+'api/util/download/') : 'data:image/png;base64,'
    const toDataURL = url => fetch(url)
    .then(response => response.blob())
    .then(blob => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
   }));

    return url + nameImage;



  
    
  }

  
 dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
    u8arr[n] = bstr.charCodeAt(n);
    }
  return new File([u8arr], filename, {type:mime});
 }
 exportpdf(attestationDemande){
  this.Ka_demandeservice.exportpdf(attestationDemande).subscribe(blob => {
    const fileUrl = URL.createObjectURL(blob);
   //window.open(environment.UrlStockage + "api/util/download/" + attestationDemande);
    window.open(fileUrl, '_blank');
    //saveAs(blob)
  
  });
  
  
  }

  getOriginalEtat(libelle){   
    if(libelle === undefined){ return ""; }
    const type = this.typeEtats.filter((a)=>a.codeEtatDemande.toLowerCase()===libelle.toLowerCase());
    return ((type !== null) && (type.length>0)) ? type[0].nom: libelle;
  }
 
 
  getNomTypePiece(codeTypePiece){   
    if(codeTypePiece === undefined){ return ""; }
    const type = this.typePieces.filter((a)=>a.code.toLowerCase()===codeTypePiece.toLowerCase());
    return ((type !== null) && (type.length>0)) ? type[0].nom: codeTypePiece;
}


  

  
}

