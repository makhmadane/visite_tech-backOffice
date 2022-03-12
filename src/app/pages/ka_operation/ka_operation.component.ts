import { Component, OnInit } from "@angular/core";
import Swal from "sweetalert2";
import { DomSanitizer } from "@angular/platform-browser";
import { Ka_operationService } from "../../services/Ka_operation.service";

import { Ka_operationModel } from "../../models/ka_operationModel.model";
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute } from "@angular/router";
import { ExportService } from "src/app/services/export.service";



@Component({
  selector: "ka_operation",
  templateUrl: "./ka_operation.component.html",
  styleUrls: ["./ka_operation.component.css"],
})
export class ka_operationComponent implements OnInit {
  p: number = 1;
  operations: Ka_operationModel[];

  mot:any;

  id: any;
  opration: Ka_operationModel;
  allDossier=false;
  constructor(
    private ka_operationservice: Ka_operationService,
    private route: ActivatedRoute,
    public sanitizer: DomSanitizer,
    private spinner: NgxSpinnerService,
    private exportService: ExportService,
  ) {}

  ngOnInit() {
    this.spinner.show();
    this.opration=new Ka_operationModel();
    this.LoadTable();
  }
  LoadTable() {
      this.ka_operationservice.getData().subscribe((data: any[]) => {
        this.p = 1;
        this.operations = data;
        this.spinner.hide();
      }, () => {
        this.spinner.hide();
      });
  }

  deleteId(id) {
    Swal.fire({
      title: "Êtes-vous sûr de vouloir supprimer?",
      showCancelButton: true,
      cancelButtonColor: "black",
      confirmButtonColor: "#ff7900",
      confirmButtonText: "Valider",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.value) {
        this.delete(id);
        // handle Confirm button click
        // result.value will contain `true` or the input value
      } else {
        // handle dismissals
        // result.dismiss can be 'cancel', 'overlay', 'esc' or 'timer'
      }
    });
  }

 delete(id) {
    this.spinner.show();
    this.ka_operationservice.deleteData(id).subscribe(
      (data:any) => {
        this.LoadTable();
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: data.message=="SUCCESS"?"Opération supprimé avec succés":data.message,
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
       // this.delete(id);
        // handle Confirm button click
        // result.value will contain `true` or the input value
      } else {
        // handle dismissals
        // result.dismiss can be 'cancel', 'overlay', 'esc' or 'timer'
      }
    });
  }
  
 
  onOpenModal(admin: any, mode: string): void {
    if(admin=="add"){
      this.opration=new Ka_operationModel();
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
    if (this.id) {
      this.ka_operationservice.updateData(this.id,this.opration).subscribe(
        () => {
          this.LoadTable();
          this.spinner.hide();
          const container = document.getElementById('save-entity');
          container.click();
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Operation mise à jour avec succés',
            background:'white',
            showConfirmButton: false,
            timer: 3000
          });
        },
        () => {
          this.spinner.hide()
        }
      );
    }else{
      this.ka_operationservice.insertData(this.opration).subscribe(
        ()=>{
          this.LoadTable();
          this.spinner.hide();
          const container = document.getElementById('save-entity');
          container.click();
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Opération a été ajouté avec succès',
            background:'white',
            showConfirmButton: false,
            timer: 3000
          });
      }, () => {
        this.spinner.hide();
      });
    }
  }

  editerOperation(id){
    this.id=id;
    this.ka_operationservice.getOneData(id).subscribe((data: any) => {
      this.opration = data;
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
        A: '#', B: 'Code Operation', C: 'Nom Operation'
      }, // table header
    ],
    skipHeader: true
  };
  this.operations.filter(a=>a.selectionner==true).forEach(dm => {
    udt.data.push({
      A: dm.id, B: dm.codeOperation, C: dm.nomOperation, 
    });
  });
  edata.push(udt);
  this.exportService.exportJsonToExcel(edata, 'liste_des_operations');
}

exportToCsv(): void {
  this.exportService.exportToCsv(this.operations.filter(a=>a.selectionner==true), 'liste_des_operations', [
    'id', 'codeOperation', 'nomOperation',
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
    for(let i=0;i<this.operations.length;i++){
      this.operations[i].selectionner=true;
    }
  }else{
    for(let i=0;i<this.operations.length;i++){
      this.operations[i].selectionner=false;
    }
  }
     
}
}
