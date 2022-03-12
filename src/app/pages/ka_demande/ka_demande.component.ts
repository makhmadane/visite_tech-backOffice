import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import Swal from "sweetalert2";
import { DatePipe } from "@angular/common";
import { Ka_demandeService } from '../../services/Ka_demande.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ExportService } from "src/app/services/export.service";
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";


@Component({
  selector: "ka_demande",
  templateUrl: "./ka_demande.component.html",
  styleUrls: ["./ka_demande.component.css"],
  providers: [DatePipe]

})
export class Ka_demandeComponent implements OnInit {
  selectedCreation: any = { startDate: null, endDate: null };
  selectedmodif: any = { startDate: null, endDate: null };
 
  demandeId: number = -1;
  typeOpeartion: string = "";
  p: number = 1;

  typeTrieCr="DESC";
  typeTrieMj="DESC";
  productEmpty = "assets/img/avatars/empty-img.png";

  demandes: any[];

  datedebutCreateSearch:String;
  datefinCreateSearch:String;

  datedebutUpdateSearch:String;
  datefinUpdateSearch:String;

  etatMsisdn:string="";  //MSISDN DEMANDE
  etatVendeur:string="";  //VENDEUR DEMANDE

  typePieces:any[] = [];

  etatdossiers:any[] = [];
  etatdossiersSearch:any[] = []; //ETAT DEMANDE

  typedossiers:any[] = [];
  typedossiersSearch:any[] = []; //OPERATIONS A EFFECTUER

  motifs:any[] = [];
  motifsSearch:any[] = [];

  typeCommentaires:any[] = [];

  cacherFormulaireRecherce: boolean = false;
  cacherListeDemande: boolean = true;

  cacherDetailDemande: boolean = true;
  rechargerInfoDemande: boolean = true;
  
  allDossier=false;

  /* the table reference */
  @ViewChild('listeDemandeSearch') listeDemandeSearch: ElementRef;


  constructor(
    private ka_demandeservice: Ka_demandeService,
    private datePipe: DatePipe,
    private exportService: ExportService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private userService:UserService,
    public router: Router,
  ) {}

  gestionformulairechercher(){
    this.cacherFormulaireRecherce = !this.cacherFormulaireRecherce;
  }

  gestionlistedemande(){
    this.cacherListeDemande = !this.cacherListeDemande;
  }

  ngOnInit() {
   
   var newDate = new Date(Date.now());  
    
    this.datedebutCreateSearch = this.datePipe.transform(newDate, 'yyyy-MM-dd');
    this.datefinCreateSearch = this.datePipe.transform(Date.now(), 'yyyy-MM-dd');

    this.datedebutUpdateSearch = this.datePipe.transform(newDate, 'yyyy-MM-dd');
    this.datefinUpdateSearch = this.datePipe.transform(Date.now(), 'yyyy-MM-dd');

    this.ka_demandeservice.initialisationSearchDemande().subscribe((data: any) => {
      if(data.success){
        this.motifs = data.data.motifList;
        this.typedossiers = data.data.operationLists;
        this.etatdossiers = data.data.etatDemandeList;
        this.typeCommentaires = data.data.typeCommentaireList;
        this.typePieces = data.data.typePieceList;
        this.research();  
      }
      else{
        this.spinner.hide();
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: data.message,
          background:'white',
          showConfirmButton: false,
          timer: 3000
        });
      }
    });

  }

  initialisationSearchDemande(){
    var newDate = new Date(Date.now() - 3*24*60*60*1000); 
    this.datedebutCreateSearch = this.datePipe.transform(newDate, 'yyyy-MM-dd');
    this.datefinCreateSearch = this.datePipe.transform(newDate, 'yyyy-MM-dd');
    //
    this.datedebutUpdateSearch = this.datePipe.transform(newDate, 'yyyy-MM-dd');
    this.datefinUpdateSearch = this.datePipe.transform(newDate, 'yyyy-MM-dd');
  }

  getOperationLabelle(codeOperation){
    return this.typedossiers.filter(type => type.codeOperation === codeOperation)[0]?.nomOperation;
  }

  research() {
 
   
    console.log(this.datedebutCreateSearch);
    console.log(this.datefinCreateSearch);
    console.log(this.etatMsisdn);
    console.log(this.etatVendeur);
    console.log(this.selectedmodif);
    console.log(this.typedossiersSearch);
    console.log(this.motifsSearch);
    console.log("dane lo");
  
    this.spinner.show();
    this.allDossier=false;
    let valeurMotif = "null";
    let valeurMsisdn = "null";
    let valeurVendeur = "null";
 

      if(this.etatVendeur.length===0){
        valeurVendeur=null;
      }
      else{
        valeurVendeur=this.etatVendeur;
      }
  
      if(this.etatMsisdn.length===0){
        valeurMsisdn=null;
      }
      else{
        valeurMsisdn=this.etatMsisdn;
      }
    if(this.motifsSearch.length==0){
      valeurMotif = "null"
    }
    else{
      valeurMotif="";
      for(let a of this.motifsSearch){
        valeurMotif = valeurMotif+a.nomMotif+"_";
      }
    }

    let valeurEtat = "null"
    if(this.etatdossiersSearch.length==0){
      valeurEtat = "null"
    }
    else{
      valeurEtat="";
      for(let a of this.etatdossiersSearch){
        valeurEtat = valeurEtat+a.codeEtatDemande+"_";
      }
    }

    let valeurtypedossier = "null"
    if(this.typedossiersSearch.length == 0){
      valeurtypedossier = "null"
    }
    else{
      valeurtypedossier = "";
      for(let a of this.typedossiersSearch){
        valeurtypedossier = valeurtypedossier+a.codeOperation+"_";
      }
    }
    let valeurmsisdn = ""
    if(this.etatMsisdn.length==0){
      valeurmsisdn = "null"
    }
    else{
      valeurmsisdn = this.etatMsisdn;
    }
    this.cacherListeDemande = false
    this.ka_demandeservice.research(
      valeurtypedossier, this.datedebutCreateSearch,
      this.datefinCreateSearch, this.datedebutUpdateSearch,
      this.datefinUpdateSearch, valeurEtat, valeurMotif,valeurMsisdn,valeurVendeur
    ).subscribe(
      (data: any) => {
        this.router.navigate(['/ka_demande/'+this.datedebutCreateSearch+'/'+
        this.datefinCreateSearch+'/'+this.datedebutUpdateSearch+'/'+
        this.datefinUpdateSearch+'/'+valeurVendeur+'/'+valeurMsisdn+'/'+valeurMotif+'/'+valeurtypedossier+'/'+valeurEtat]);
        if(data.success){
          setTimeout( () => {
            this.cacherListeDemande = false;
            this.demandes = data.data
            this.spinner.hide();
          }, 500)
        }
        else{
          this.spinner.hide();
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: data.message,
            background:'white',
            showConfirmButton: false,
            timer: 3000
          });
        }
      }, error => {
        this.spinner.hide();
      }
    );
  }

/////////////////////////////////////////////////////////
  precedentPage() {
    this.cacherDetailDemande = true;
    this.research();
  }

  ouvrirDemande(id:number, operation:string){

    this.demandeId = id;  
    this.typeOpeartion = this.getOperationLabelle(operation);
    this.cacherDetailDemande = false;
   
  }

  suivantPage() {
    this.ka_demandeservice.ouvrirdossiersuivant(this.demandeId).subscribe(
      (dataDemande: any) => {
        this.rechargerInfoDemande = false
        if( dataDemande && (dataDemande.success === true)){
          this.demandeId = dataDemande.data.id
          this.typeOpeartion = this.getOperationLabelle(dataDemande.data.operation);
          setTimeout( () => {
            this.rechargerInfoDemande = true
            this.spinner.hide();
          }, 500)
        }
        else{
          this.rechargerInfoDemande = true
          this.spinner.hide();
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: "CA_DISTRI " + dataDemande.message,
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
    this.ka_demandeservice.reouvrirdossier(this.demandeId).subscribe(
      (dataDemande: any) => {
        this.rechargerInfoDemande = false
        if( dataDemande && (dataDemande.success === true)){
          this.demandeId = dataDemande.data.id
          this.typeOpeartion = this.getOperationLabelle(dataDemande.data.operation);
          setTimeout( () => {
            this.rechargerInfoDemande = true
            this.spinner.hide();
          }, 500)
        }
        else{
          this.rechargerInfoDemande = true
          this.spinner.hide();
        }
      }, (error) => {
        this.spinner.hide();
      }
    );
  }
      
  /////////////////////////EXPORTS
  exportToExcel(): void {
    const edata: Array<any> = [];
    const udt: any = {
      data: [
        { A: 'User Data' }, // title
        { 
          A: '#', B: 'Type', C: 'Source', D: 'N° Tél', E: 'imsi', 
          F: 'Nom du client', G: 'Vendeur', H: 'Emis le', I: 'Reçu le' , J: 'Mise a jour le' 
          , K: 'Date de Naissance' , L: 'Lieu de Naissance' ,M: 'Etat',N: 'Commentaire',O: 'Motif'
        }, // table header
      ],
      skipHeader: true
    };
    this.demandes.filter(a=>a.selectionner==true).forEach(dm => {
      udt.data.push({
        A: dm.id, B: dm.operation, C: dm.source, D: dm.msisdn, E: dm.imsi, 
        F: dm.prenom + " " + dm.nom, G: dm.creeParUsername, H: dm.dateCreation, 
        I: dm.dateRecu,  J: dm.dateModification,  K: dm.dateNaissance, L: dm.lieuNaissance,M:dm.etat,
        N:dm.commentaire,O:dm.motif
        
      });
    });
    edata.push(udt);
    this.exportService.exportJsonToExcel(edata, 'liste_des_demandes');
  }

  exportToCsv(): void {
    this.exportService.exportToCsv(this.demandes.filter(a=>a.selectionner==true), 'liste_des_demandes', [
      'id', 'operation', 'source', 'msisdn', 'imsi', 'prenom', 'nom', 
      'creeParUsername', 'dateCreation', 'dateRecu'
    ]);
  }

  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('impressionDemande').innerHTML;
    popupWin = window.open("", "ZoneImpr", "height=680, width=980,toolbar=0, menubar=0, scrollbars=1, resizable=1,status=0, location=0, left=10, top=10");
    popupWin.document.write(`
      <html>
        <head>
          <style>
            form{
              border: none;
            }
            .ticket {
              border: 0px solid black;

            }
            fieldset.ticket{
              border: none;
              margin: 0 auto; text-align:center;
            }
            fieldset.info_ticket{
              margin: 0 auto; text-align:left;
            }
            hr {
              width : 40%;
            }
          </style>
        </head>
        <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }
  ////

  datesUpdatedCreation(){
    if(this.selectedCreation.startDate!=null){
      
      this.datedebutCreateSearch = this.datePipe.transform(this.selectedCreation.startDate.toDate(),"yyyy-MM-dd");
      this.datefinCreateSearch = this.datePipe.transform(this.selectedCreation.endDate.toDate(),"yyyy-MM-dd") ;
    }
  


    
  }

  datesUpdatedModif(){
    if(this.selectedmodif.startDate!=null){
      this.datedebutUpdateSearch =this.datePipe.transform(this.selectedmodif.startDate.toDate(),"yyyy-MM-dd") ;
      this.datefinUpdateSearch = this.datePipe.transform(this.selectedmodif.endDate.toDate(),"yyyy-MM-dd");
    }
  }

  getColor(country) { (2)
    switch (country) {
      case 'NA':
        return '#527edb';
      case 'IDENTIF':
        return '#f16e00';
      case 'SWAP':
        return '#a885d8';
    }
  }

  changeEtat(p){
    p.selectionner=!p.selectionner;
  }

  selectionnerAll(){
    this.allDossier=!this.allDossier;
    if(this.allDossier==true){
      for(let i=0;i<this.demandes.length;i++){
        this.demandes[i].selectionner=true;
      }
    }else{
      for(let i=0;i<this.demandes.length;i++){
        this.demandes[i].selectionner=false;
      }
    }
      
  }

  addItem(newItem: boolean) {
    this.cacherDetailDemande=true;
    this.research();  

  }
  trieDemandeDateCreation(){  
    if(this.typeTrieCr=="DESC"){
      this.typeTrieCr="ASC";
      this.demandes =this.demandes.sort(function(a, b) {
        return  new Date(b.dateRecu).getTime() - new Date(a.dateRecu).getTime() ;
      });
    }else{
      this.typeTrieCr="DESC";
      this.demandes =this.demandes.sort(function(a, b) {
        return  new Date(a.dateRecu).getTime() - new Date(b.dateRecu).getTime() ;
      });
    }
   
  }

  trieDemandeDateMiseAjour(){  
    if(this.typeTrieMj=="DESC"){
      this.typeTrieMj="ASC";
      this.demandes =this.demandes.sort(function(a, b) {
        return  new Date(b.dateModification).getTime() - new Date(a.dateModification).getTime() ;
      });
    }else{
      this.typeTrieMj="DESC";
      this.demandes =this.demandes.sort(function(a, b) {
        return  new Date(a.dateModification).getTime() - new Date(b.dateModification).getTime() ;
      });
    }
   
  }
  exportpdf(demande){
    this.userService.exportpdf(demande.attestationDemande).subscribe(blob => saveAs(blob));
    }

    downloadPdf(){
      this.ka_demandeservice.downloadPdf().subscribe(blob => saveAs(blob));
    }

    getOriginalEtat(libelle){
      return this.etatdossiers.filter((a)=>a.codeEtatDemande.toLowerCase()===libelle.toLowerCase())[0].nom;
  }
 
}
