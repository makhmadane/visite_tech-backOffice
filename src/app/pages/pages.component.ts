import { AfterViewInit, Component, OnInit } from "@angular/core";
import { AuthService } from '../services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { User } from '../models/user.model';
import { SessionService } from '../services/session.service';
import { SessionInterface } from '../interfaces/session.interface';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: "pages-app-root",
  templateUrl: "./pages.component.html",
  styleUrls: ["./pages.component.scss"],
})
export class PagesComponent implements OnInit, AfterViewInit {

  DateNow;
  user: User = new User();
  lienBO:boolean=false;
  avatar = "assets/img/avatars/user.png";
  uinfo: SessionInterface | null = null; 
  constructor(
    public authService: AuthService,
    public sessionService: SessionService,
    public router: Router,
    public sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute
    
  ) {
    //window.history.go(0);
  }


  ngOnInit() {
 
    this.uinfo = this.sessionService.parseSession();
    this.DateNow = new Date().getFullYear();
    this.user.username = this.uinfo.username;
    this.user.email = this.uinfo.email;
    this.user.prenom = this.uinfo.prenom;
    this.user.nom = this.uinfo.nom;
    this.user.role = this.uinfo.role;
    
    if(this.uinfo.profils.filter((a)=>a.codeProfil.includes("BO")).length!=0){
      this.lienBO=true;
    }
  }

  ngAfterViewInit() {
    var pageHeader = $(".content-header").find("b");
    var adminForm = $(".admin-form");
    var buttons = adminForm.find(".button");
    var Panel = adminForm.find(".panel");
    setTimeout(function () {
      adminForm.addClass("theme-success");
      Panel.addClass("panel-success");
      pageHeader.addClass("text-success");
      buttons.removeClass().addClass("button btn-success");
    }, 800);
  }

retour(){
  this.router.navigate(['/ka_demande/1']);
  setTimeout( () => this.router.navigate(['/ka_demande']), 100 );
}
  logout() {
    this.authService.logout();
    this.router.navigate(['/login'])
  }
  refresh(): void {
   
    this.router.navigate(['/ka_demande/1']);
    setTimeout( () => this.router.navigate(['/ka_demande']), 100 );

}
  redirection(){
    let id;
    this.activatedRoute.queryParams.subscribe(params => {
      id=  params['id'];
      if(id){
        window.location.href="/#/ka_demande/1";
      }else{
        
        window.location.href="/#/ka_demande";
      }
  });
 
   
  } 


}
