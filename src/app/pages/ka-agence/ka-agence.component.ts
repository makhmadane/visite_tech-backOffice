import { Component, OnInit, ViewChild } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { NgxSpinnerService } from "ngx-spinner";
import Swal from "sweetalert2";
import { ActivatedRoute } from "@angular/router";
import { ExportService } from "src/app/services/export.service";
import { Ka_agenceService } from "src/app/services/Ka_agence.service";
import { AgenceModel } from "src/app/models/AgenceModel.model";


@Component({
  selector: 'app-ka-agence',
  templateUrl: './ka-agence.component.html',
  styleUrls: ['./ka-agence.component.css']
})
export class KaAgenceComponent implements OnInit {

  
  p: number = 1;
  tps: any[];

  id: any;
  tp:AgenceModel;
  allDossier=false;


  constructor(
    private tpService: Ka_agenceService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private exportService: ExportService,
  ) {}

  ngOnInit() {
    this.spinner.show();
    this.tp = new AgenceModel();
 
    
    this.LoadTable();

    
  }
  LoadTable() {

    this.tpService.getData().subscribe((data: any[]) => {
      this.p = 1;
      this.tps = data;
      this.spinner.hide();
    });
  }

  delete(id) {
    this.spinner.show();
    
    this.tpService.deleteData(id).subscribe(
      (data:any) => {
      this.LoadTable();
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: data.message=="SUCCESS"?"Agence supprimé avec succés":data.message,
        background:'white',
        showConfirmButton: false,
        timer: 3000
      });
    },
    (e:any)=>{
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: e.message,
        background:'white',
        showConfirmButton: false,
        timer: 3000
      });
    }
    );
  }

  deleteSupprimer(id) {
    Swal.fire({
      title: "Etes-vous sûre de vouloir supprimer?",
      showCancelButton: true,
      cancelButtonColor: "black",
      confirmButtonColor: "#ff7900",
      confirmButtonText: "Valider",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.value) {
        this.delete(id);
      }
    });
  }

  onOpenModal(admin: any, mode: string): void {
    if(admin=="add"){
      this.tp = new AgenceModel();
    }
  
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if(mode === 'add'){
      button.setAttribute('data-target', '#addAdminBySuperadminModal');

      const element1:any = document.getElementsByClassName('modal fade modal');
      element1[0].style.top = "5%";
    }
    container?.appendChild(button);
    button.click();
  
   
   
  }

  insertData() {
    this.spinner.show();
    if (this.id){
      this.tpService.updateData(this.id,this.tp).subscribe(
        () => {
        this.LoadTable();
        this.spinner.hide();
        const container = document.getElementById('save-entity');
        container.click();
             Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Agence mise à jour avec succés',
          background:'white',
          showConfirmButton: false,
          timer: 3000
        });
       
        }, () => {
          this.spinner.hide();
        }
      );
    }else{
      this.tpService.insertData(this.tp).subscribe(
      ()=>{
        this.LoadTable();
        this.spinner.hide();
        const container = document.getElementById('save-entity');
        container.click();
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Agence a été ajouté avec succès',
          background:'white',
          showConfirmButton: false,
          timer: 3000
        });
      }, () => {
      
      });
    }
  }
  editerRole(id){
    this.id=id;
    this.tpService.getOneData(id).subscribe(
      (data: any) => {
      this.tp = data;
      this.onOpenModal(null, 'add');
    }, () => {
      this.spinner.hide();
    });
  }
  precedentPage() {
    window.history.back();
  }
/////////////////////////EXPORTS

exportToExcel(): void {
  const edata: Array<any> = [];
  const udt: any = {
    data: [
      { A: 'User Data' }, // title
      { 
        A: '#', B: 'Code Commentaire', C: 'Adresse', D: 'Ville'
      }, // table header
    ],
    skipHeader: true
  };
  this.tps.filter(a=>a.selectionner==true).forEach(dm => {
    udt.data.push({
      A: dm.id, B: dm.codeAgence, C: dm.adresse,D: dm.ville
    });
  });
  edata.push(udt);
  this.exportService.exportJsonToExcel(edata, 'liste_des_agences');
}

exportToCsv(): void {
  this.exportService.exportToCsv(this.tps.filter(a=>a.selectionner==true), 'liste_des_agences', [
    'id', 'codeAgence','adresse','ville',
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

changeEtat(p){
  p.selectionner=!p.selectionner;
}

selectionnerAll(){
  this.allDossier=!this.allDossier;
  if(this.allDossier==true){
    for(let i=0;i<this.tps.length;i++){
      this.tps[i].selectionner=true;
    }
  }else{
    for(let i=0;i<this.tps.length;i++){
      this.tps[i].selectionner=false;
    }
  }
     
}

}
