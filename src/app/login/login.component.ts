import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { SessionInterface } from '../interfaces/session.interface';
import { SessionService } from '../services/session.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: any = {};

  constructor(public authService: AuthService, public router: Router, public sessionService: SessionService){ }


  ngOnInit(){  }

  login(){
   
    console.log("cool");
    this.router.navigate(['/ka_demande']);
    /*this.authService.login(this.form).subscribe(
      (data) => {
        const uinfo: SessionInterface = this.sessionService.parseSession();
        if(uinfo){
          this.router.navigate(['/ka_demande']);
        }else{
          this.AlertMessage("Vous n'avez pas de profil. Veuillez contacter votre manageur !!!!");
        }
      },
      err => {
        this.AlertLogin();
      }
    );*/
  }

  AlertLogin() {
    Swal.fire({ 
      title: 'Login ou mot de passe incorrect Veuillez réessayer !!!!',
      confirmButtonColor: "#ff7900",
      confirmButtonText: "Ok",
    }).then(result => {
      if (result.value) {
      } else {
      }
    });
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



}
