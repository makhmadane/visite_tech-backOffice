import { Component, OnInit } from "@angular/core";
import { UserService } from "../../services/user.service";
import { DomSanitizer } from "@angular/platform-browser";
import { NgxSpinnerService } from "ngx-spinner";
import { ExportService } from "src/app/services/export.service";
import { RoleService } from "src/app/services/Ka_role.service";
import { Ka_profilService } from "src/app/services/Ka_profil.service";



@Component({
  selector: "app-import-users",
  templateUrl: "./import-users.component.html",
  styleUrls: ["./import-users.component.css"],
})
export class ImportUsersComponent implements OnInit {

  users: any[] = [];
  avatar = "assets/img/avatars/user.png";
  roles: any[] = [];
  profils: any[] = [];
  constructor(
    private userService: UserService,
    public sanitizer: DomSanitizer,
    private exportService: ExportService,
    private spinner: NgxSpinnerService,
    private roleService: RoleService,
    private profilService: Ka_profilService,
  ) {}


  ngOnInit() {
    this.profil();
    this.role();
    
  }

  onFileChange(ev) {
    this.spinner.show();
    const file = ev.target.files[0];
    this.exportService.convertExcelToJson(file).then(
      (valTab:any[]) =>{
        valTab.forEach( (val:any) => {
          val.etat = 0;
          this.userService.import_en_masse(val).subscribe(
            (dataResponse:any) => {
              val.etat = (dataResponse.status===200) ? 1 : -1
              val.message = dataResponse.message;
              this.users.push(val)
            },
            (errResponse) => {
              val.etat = -1
              val.message = "Echec import. Veuiller reessayer";
              this.users.push(val)
            }
          );
        })
        this.spinner.hide();
      } ,
      (err) => console.error(err)
    );
  }

  role(){
    this.roleService.getAll().subscribe((data: any[]) => {
   
      this.roles = data;
      
     

    });
  }
  exportToExcel(): void {
    const edata: Array<any> = [];
    const udt: any = {
      data: [
        
        { 
          A: 'username', B: 'typeuser', C:'action', D:'email', E:'nom', F:'prenom', G:'role', H:'profils', I:'telephone', J:'contact',K:'adresse',L:'imsi'
        }, // table header
      ],
      skipHeader: true
    };
  
    edata.push(udt);
    this.exportService.exportJsonToExcel(edata, 'liste_des_users');
  }
  profil(){
    this.profilService.getData().subscribe((data: any[]) => {
      this.profils = data;
    });
  }


}
