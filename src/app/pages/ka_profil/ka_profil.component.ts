import { Component, OnInit, ViewChild } from "@angular/core";
import Swal from "sweetalert2";
import { DomSanitizer } from "@angular/platform-browser";
import { Ka_profilService } from "../../services/Ka_profil.service";
import { ka_profilModel } from "../../models/ka_profilModel.model";
import { NgxSpinnerService } from "ngx-spinner";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { Ka_operationService } from "src/app/services/Ka_operation.service";
import { ActivatedRoute } from "@angular/router";
import { RoleService } from "src/app/services/Ka_role.service";
import { Ka_operationModel } from "src/app/models/ka_operationModel.model";
import { Ka_roleModel } from "src/app/models/ka_roleModel.model";
import { ExportService } from "src/app/services/export.service";
import { Role } from "src/app/models/role.model";



@Component({
  selector: "ka_profil",
  templateUrl: "./ka_profil.component.html",
  styleUrls: ["./ka_profil.component.css"],
})
export class ka_profilComponent implements OnInit {
  p: number = 1;
  profils: ka_profilModel[];

  mot:any;

  id: any;

  profil: ka_profilModel;

   //
   operations: Ka_operationModel[];
   selected: any[] = [];
   //
   roles: Ka_roleModel[];
   selectedRole:any;
   allDossier=false;

  constructor(
    private ka_profilservice: Ka_profilService,
    public sanitizer: DomSanitizer,
    private spinner: NgxSpinnerService,
    private Ka_profilservice: Ka_profilService,
    private Ka_roleservice: RoleService,
    private Ka_operationservice: Ka_operationService,
    private route: ActivatedRoute,
    private exportService: ExportService
  ) {}

  ngOnInit() {
    this.spinner.show();
    this.Ka_operationservice.getData().subscribe((data: any) => {
      this.operations = data;
      for(let a of data){
        a.cocher=false;
      }
      //
      this.Ka_roleservice.getAll().subscribe((dataRole: Ka_roleModel[]) => {
        this.roles = dataRole;
        this.spinner.hide();

      });
    });
    this.profil=new ka_profilModel();
    
    this.LoadTable();
  }
  LoadTable() {
    this.ka_profilservice.getData().subscribe((data: any[]) => {
      this.p = 1;
      this.profils = data;
      this.spinner.hide();
    });
  }

  delete(id) {
    this.spinner.show();
   
    this.ka_profilservice.deleteData(id).subscribe(
  
      (data:any) => {
        this.LoadTable();
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: data.message=="SUCCESS"?"Profil supprimé avec succés":data.message,
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
      
      this.spinner.hide();
    });
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
  
  insertData() {
   
    this.profil.role=this.selectedRole;
    this.profil.operations=this.selected;
    this.spinner.show();
  
    if (this.id) {
      this.Ka_profilservice.updateData(this.id,this.profil).subscribe(
        () => {
          this.LoadTable();
          this.spinner.hide();
          const container = document.getElementById('save-entity');
          container.click();
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Profil mise à jour avec succès',
            background:'white',
            showConfirmButton: false,
            timer: 3000
          });
        },
        () => {
          this.spinner.hide();
        }
      );
    }else{
      this.Ka_profilservice.insertData(this.profil).subscribe(
        ()=>{
        this.LoadTable();
        this.spinner.hide();
        const container = document.getElementById('save-entity');
        container.click();
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Le profil a été ajouté avec succès',
          background:'white',
          showConfirmButton: false,
          timer: 3000
        });
  
      });
    }
  }
  precedentPage() {
    window.history.back();
  }
  onOpenModal(admin: any, mode: string): void {
    if(admin=="add"){
      this.profil=new ka_profilModel();
      this.selected=[];
      this.selectedRole=[];
    
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
  editerProfil(id){
    this.id=id;
    this.Ka_profilservice.getOneData(id).subscribe((data: ka_profilModel) => {
      this.profil = data;
      this.Ka_operationservice.getData().subscribe((data: Ka_operationModel[]) => {
        this.operations=data;
        this.selected = this.profil.operations

        this.Ka_roleservice.getAll().subscribe((dataRole: Ka_roleModel[]) => {
          this.roles=dataRole;
          this.selectedRole = this.profil.role;
        });
        this.onOpenModal(null, 'add');
        this.spinner.hide();

      });
    });
  }

  ////////////////////////EXPORTS

exportToExcel(): void {
  const edata: Array<any> = [];
  const udt: any = {
    data: [
      { A: 'User Data' }, // title
      { 
        A: '#', B: 'Code Profil', C: 'Nom Profil', D: 'Role',E: 'Operations'
      }, // table header
    ],
    skipHeader: true
  };
  this.profils.filter(a=>a.selectionner==true).forEach(dm => {
    udt.data.push({
      A: dm.id, B: dm.codeProfil, C: dm.name,D: dm.role.name
    });
  });
  edata.push(udt);
  this.exportService.exportJsonToExcel(edata, 'liste_des_profils');
}

exportToCsv(): void {
  this.exportService.exportToCsv(this.profils.filter(a=>
    a.selectionner==true), 'liste_des_profils', [
    'id','name', 'codeProfil', 'roleExcel',
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
    for(let i=0;i<this.profils.length;i++){
      this.profils[i].selectionner=true;
      this.profils[i].roleExcel=this.profils[i].role.name;
    }
  }else{
    for(let i=0;i<this.profils.length;i++){
      this.profils[i].selectionner=false;
      this.profils[i].roleExcel=this.profils[i].role.name;
    }
  }
     
}
}
