import { Component, OnInit, ViewChild } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { NgxSpinnerService } from "ngx-spinner";
import { Subject } from "rxjs";
import { RoleService } from '../../services/Ka_role.service';
import Swal from "sweetalert2";
import { Ka_roleModel } from "src/app/models/ka_roleModel.model";
import { ActivatedRoute } from "@angular/router";
import { data } from "jquery";
import { ExportService } from "src/app/services/export.service";



@Component({
  selector: "ka_role",
  templateUrl: "./ka_role.component.html",
  styleUrls: ["./ka_role.component.css"],
})
export class ka_roleComponent implements OnInit {

  p: number = 1;
  roles: any[];

  id: any;
  role: Ka_roleModel;
  allDossier=false;


  constructor(
    private roleService: RoleService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private exportService: ExportService,
  ) {}

  ngOnInit() {
    this.spinner.show();
    this.role = new Ka_roleModel();
 
    
    this.LoadTable();

    
  }
  LoadTable() {

    this.roleService.getAll().subscribe((data: any[]) => {
      this.p = 1;
      this.roles = data;
     
      this.spinner.hide();
    });
  }

  delete(id) {
    this.spinner.show();
    
    this.roleService.delete(id).subscribe(
      (data:any) => {
      this.LoadTable();
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: data.message=="SUCCESS"?"Rôle supprimé avec succés":data.message,
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
      this.role = new Ka_roleModel();
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
      this.roleService.update(this.id,this.role).subscribe(
        () => {
        this.LoadTable();
        this.spinner.hide();
        const container = document.getElementById('save-entity');
        container.click();
             Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Rôle mise à jour avec succés',
          background:'white',
          showConfirmButton: false,
          timer: 3000
        });
       
        }, () => {
          this.spinner.hide();
        }
      );
    }else{
      this.roleService.insert(this.role).subscribe(
      ()=>{
        this.LoadTable();
        this.spinner.hide();
        const container = document.getElementById('save-entity');
        container.click();
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Rôle a été ajouté avec succès',
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
    this.roleService.getOne(id).subscribe(
      (data: any) => {
      this.role = data;
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
        A: '#', B: 'Code Role', C: 'Nom Role'
      }, // table header
    ],
    skipHeader: true
  };
  this.roles.filter(a=>a.selectionner==true).forEach(dm => {
    udt.data.push({
      A: dm.id, B: dm.codeRole, C: dm.name, 
    });
  });
  edata.push(udt);
  this.exportService.exportJsonToExcel(edata, 'liste_des_roles');
}

exportToCsv(): void {
  this.exportService.exportToCsv(this.roles.filter(a=>a.selectionner==true), 'liste_des_roles', [
    'id', 'codeRole', 'name',
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
    for(let i=0;i<this.roles.length;i++){
      this.roles[i].selectionner=true;
    }
  }else{
    for(let i=0;i<this.roles.length;i++){
      this.roles[i].selectionner=false;
    }
  }
     
}
}
