import { Component, OnInit } from "@angular/core";
import { UserService } from "../../services/user.service";
import Swal from "sweetalert2";
import { DomSanitizer } from "@angular/platform-browser";
import { saveAs } from "file-saver-es";
import { NgxSpinnerService } from "ngx-spinner";
import { Role } from "src/app/models/role.model";
import { RoleService } from "src/app/services/Ka_role.service";
import { Ka_profilService } from "src/app/services/Ka_profil.service";
import { Ng2ImgMaxService } from "ng2-img-max";
import { User } from "src/app/models/user.model";
import { environment } from "src/environments/environment";
import { Ka_agenceService } from "src/app/services/Ka_agence.service";
import { AgenceModel } from "src/app/models/AgenceModel.model";
import { SessionService } from "src/app/services/session.service";
import { SessionInterface } from "src/app/interfaces/session.interface";
import { ExportService } from "src/app/services/export.service";


@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"],
})
export class UserComponent implements OnInit {
  search="";
  users: any[];
  avatar = "assets/img/avatars/user.png";
  p: number = 1;

  
  id: number;
  typeUsers: String[] = ["interne","externe"];
  selectedTypeUser:any;
  roles: Role[] = [];
  agences: AgenceModel[] = [];
  profils: any[] = [];
  profilsRoles: any[] = [];
  operations: any[] = [];
  
  form: any = {};
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = "";

  user: any;
  selectedAgence: any = null;
  selectedRole: any = null;
  selectedProfils: any[] = [];

  update = false;
  uploadedImage: File;
  uploadedImage2: String;

  imagePreview2: string;
  photo: any;

  photoUpdate: any;

  isRevendeur: boolean = false;
  isSelectionRole: boolean = false;
  uinfo: SessionInterface | null = null; 
  allDossier=false;

  constructor(
    public sanitizer: DomSanitizer,
    private spinner: NgxSpinnerService,
    private userService: UserService,
    private roleService: RoleService,
    private profilService: Ka_profilService,
    private ng2ImgMax: Ng2ImgMaxService,
    private tpService: Ka_agenceService,
    public sessionService: SessionService,
    private exportService: ExportService
  ) {}

  ngOnInit() {
    this.spinner.show();
  
    this.uinfo = this.sessionService.parseSession();
    this.loadUserTable();
    this.loadRoles();
    this. loadAgences() ;
    this.user = new User();
  }

  onOpenModal(admin: any, mode: string): void {

    if(admin=="add"){
      this.isSelectionRole=false;
      this.isRevendeur=false;
      this.selectedTypeUser="Interne";
      this.user = new User();
      this.form={};
      this.photo="";
      this.selectedRole=null;
      this.selectedProfils=[];
      this.isSuccessful = false;
    
    }
  
    const container = document.getElementById('main-container');
  
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if(mode === 'add'){
      const element1:any = document.getElementsByClassName('modal fade modal');
      element1[0].style.top =this.getScrollPercent()/2+"%";
      button.setAttribute('data-target', '#addAdminBySuperadminModal');
  
     
    }
    container?.appendChild(button);
    button.click(); 
  }

  getScrollPercent() {
    var h = document.documentElement,   
    b = document.body,
    st = 'scrollTop',
    sh = 'scrollHeight';
  return (h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight) * 100;
}

  loadUserTable() {
    this.userService.getAll().subscribe((resp: any) => {
      this.spinner.hide();
      if(resp.success){
        this.users = resp.data;
        this.p = 1;
      }
      else{
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: resp.message,
          background:'white',
          showConfirmButton: false,
          timer: 3000
        });
      }
    });
  }

  editerUser(id){
    this.id=id;
    this.isSuccessful = false;
    this.update = true;
    this.userService.getOne(this.id).subscribe((resp: any) => {
      this.spinner.hide();
      if(resp.success){
        this.user = resp.data;
        this.onOpenModal(null, 'add');
        this.photoUpdate = this.user.photo;
        this.updateForm(this.user);
      }
      else{
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: resp.message,
          background:'white',
          showConfirmButton: false,
          timer: 3000
        });
      }
    });
  }

  updateForm(user: any): void {
    this.form.id = user.id;
    this.form.photo = user.photo;
    this.form.nom = user.nom;
    this.form.prenom = user.prenom;
    this.form.username = user.username;
    this.form.telephone = user.telephone;
    this.form.contact = user.contact;
    this.form.email = user.email;
    this.form.adresse = user.adresse;
    this.selectedRole = user.role;
    this.selectedTypeUser = user.typeuser;
    this.getValues(this.selectedRole);
    this.selectedProfils = user.profils;
    this.getSelectProfils(this.selectedProfils);
    if(user.role && user.role.name.toLowerCase().includes('vendeur')){
      this.form.imsi = user.vendeur.simVendeur;
      this.form.iccId = user.vendeur.iccId;
      this.isRevendeur = true;
    }
  }

  deleteUser(id) {
    Swal.fire({
      title: "Êtes-vous sûr de vouloir supprimer?",
      showCancelButton: true,
    }).then((result) => {
      if (result.value) {
        this.delete(id);
      }
    });
  }

  delete(id) {
    this.spinner.show();
    this.userService.delete(id).subscribe(() => {
      this.loadUserTable();
    });
  }

  reinitialiserPassword(id){
    this.spinner.show();
    console.log()
    this.userService.reinitialiserPassword(id).subscribe(
      () => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: "Votre mot de passe à été changé avec succès",
          background:'white',
          showConfirmButton: false,
          timer: 3000
        }); 
        this.spinner.hide();
      }
    );
  }

  getColor(country) { 
    switch (country) {
      case true:
        return '#32c832';
      default:
        return '#cd3c14';
    }
  }

  exportpdf(user){
    this.userService.exportpdf(user.id).subscribe(blob => saveAs(blob,user.telephone));
  }

  onSubmit() {
    this.user = this.form;
    this.user.photo = this.photo;
    this.user.role = this.selectedRole;
    this.user.profils = this.selectedProfils;

    this.spinner.show();
    if (this.user.id != null) {
      this.user.typeUser=this.selectedTypeUser;
      
      this.user.codeAgence=this.selectedAgence ? this.selectedAgence.codeAgence : null;
      if (this.photo == null) {
        this.user.photo = this.photoUpdate;
      }
      this.userService.update(this.user.id, this.user).subscribe(
        (data:any) => {
          if(data.status==200){
            this.loadUserTable();
            document.getElementById('save-entity')?.click();
            this.isSuccessful = true;
            this.isSignUpFailed = false;
          }else{
            this.AlertMessage(data.message);
            this.spinner.hide();
          }
         
        },
        (err) => {
          this.AlertMessage("Erreur Interne !!!!");
          this.errorMessage = err.error.message;
          this.isSignUpFailed = true;
          this.spinner.hide();
        }
      );
    } else {
      this.user.typeUser=this.selectedTypeUser;
      this.user.codeAgence=this.selectedAgence ? this.selectedAgence.codeAgence : null;
      this.userService.insert(this.user).subscribe(
        (data:any) => {
          if(data.status==200){
            this.loadUserTable();
            document.getElementById('save-entity')?.click();
            this.isSuccessful = true;
            this.isSignUpFailed = false;
          }else{
            this.AlertMessage(data.message);
            this.spinner.hide();
          }
         
          //this.spinner.hide();
        },
        (err) => {
          this.AlertMessage("Erreur Interne !!!!");
          this.errorMessage = err.error.message;
          this.isSignUpFailed = true;
          this.spinner.hide();
        }
      );
    }
  }

  retour() {
    window.history.back();
  }

  onImageChange(event) {
    let image = event.target.files[0];
    this.ng2ImgMax.resizeImage(image, 140, 140).subscribe(
      (result) => {
        this.uploadedImage = new File([result], result.name);
        this.getImagePreview(this.uploadedImage);
      },
      (error) => {
        console.log("😢 Oh no!", error);
      }
    );
  }

  loadRoles() {
    this.roleService.getAll().subscribe((data: any[]) => {
      this.roles = data;
      this.profilService.getData().subscribe((data: any[]) => {
        this.profils = data;
        this.spinner.hide();
      });
      this.spinner.hide();
    });
  }

  loadAgences() {
    this.tpService.getData().subscribe((data: any[]) => {
      this.agences = data;
      this.spinner.hide();
    });
  }
  
  getSelectProfils($event) {
    this.operations = [];
    for(const profil of $event) {
      for(const op of profil.operations) {
        if(!this.operations.includes(op.nomOperation)){
          this.operations.push(op.nomOperation);
        }
      }
    }
  }

  getValues($event) {
    this.selectedRole = ($event !== undefined) ? $event : null;
    this.isRevendeur = false;
    this.isSelectionRole = false
    this.profilsRoles = [];
    if ((this.selectedRole !== null) && (this.selectedRole.name !== null)){
      this.isSelectionRole = true;
      if(!this.isRevendeur && (this.selectedRole.name.toLowerCase().includes('vendeur'))){
        this.isRevendeur = true;
      }
      for(const p of this.profils) {
        if(this.selectedRole.id===p.role.id){
          this.profilsRoles.push(p);
        }
      }  
    }
  }

  getImagePreview(file: File) {
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const imagePreview: string = reader.result as string;
      this.imagePreview2 = imagePreview;
      this.user.photo = imagePreview;
      this.photo = imagePreview;
    };
    
  }

  urlImage(nameImage:string): string{
    if(nameImage!=null && nameImage!=''){
      let url = nameImage.endsWith(".png") ? (environment.Localurl+'api/util/download/profil/') : 'data:image/png;base64,'
      return url + nameImage;
    }else{ return this.avatar;}
  }

  redirection(){
    window.location.href="/#/ka_demande"
  } 

  AlertMessage(message) {
    Swal.fire({ 
      title: message,
      confirmButtonColor: "#ff7900",
      confirmButtonText: "Ok",
    
    }).then(result => {
      if (result.value) {
      } else {
      }
    });
  }

  clotureUser(id){
    this.userService.statusClotuter(id).subscribe(
      (data:any) => {
        this.loadUserTable();
      },
      (error)=>{
          console.log("Error de Cloture");
      });
    }

  ActiverUser(id){
      this.userService.statusActiver(id).subscribe(
        (data:any) => {
          this.loadUserTable();
        },
        (error)=>{
            console.log("Error de active ");
        });
      }

  DescativeUser(id){
        this.userService.statusDescativer(id).subscribe(
          (data:any) => {
            this.loadUserTable();
          },
          (error)=>{
              console.log("Error de descative ");
          });
    }
    
  alertReinstialisation(id) {
    Swal.fire({
      title: "Etes-vous sûre de vouloir réinstilaliser?",
      showCancelButton: true,
      cancelButtonColor: "black",
      confirmButtonColor: "#ff7900",
      confirmButtonText: "Valider",
      cancelButtonText: "Annuler",
      
    }).then((result) => {
      if (result.value) {
        this.reinitialiserPassword(id);
      }
    });
  }
   ////////////////////////EXPORTS

exportToExcel(): void {
  const edata: Array<any> = [];
  const udt: any = {
    data: [
      { A: 'User Data' }, // title
      { 
        A: '#', B: 'Nom', C: 'Prenom', D: 'Telephone',E: 'Contact',F: 'Username',G: 'Email',H: 'Etat'
      }, // table header
    ],
    skipHeader: true
  };
  this.users.filter(a=>a.selectionner==true).forEach(dm => {
    udt.data.push({
      A: dm.id, B: dm.nom, C: dm.prenom,D: dm.telephone,E: dm.contact,F: dm.username,G: dm.email,H: dm.etat
    });
  });
  edata.push(udt);
  this.exportService.exportJsonToExcel(edata, 'liste_des_users');
}

exportToCsv(): void {
  this.exportService.exportToCsv(this.users.filter(a=>a.selectionner==true), 'liste_des_users', [
    'id','nom', 'prenom', 'telephone','contact','username','email','etat'
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

selectionnerAll(){
  this.allDossier=!this.allDossier;
  if(this.allDossier==true){
    for(let i=0;i<this.users.length;i++){
      this.users[i].selectionner=true;
 
    }
  }else{
    for(let i=0;i<this.users.length;i++){
      this.users[i].selectionner=false;
    }
  }
     
}

changeEtat(p){
  p.selectionner=!p.selectionner;
}

  
}

