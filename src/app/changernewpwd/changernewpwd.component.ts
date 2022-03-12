import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { SessionInterface } from '../interfaces/session.interface';
import { SessionService } from '../services/session.service';
import { UserService } from '../services/user.service';



@Component({
  selector: 'app-changernewpwd',
  templateUrl: './changernewpwd.component.html',
  styleUrls: ['./changernewpwd.component.scss']
})
export class ChangernewpwdComponent implements OnInit {

  form: any = {};

  constructor(public authService: UserService, public router: Router, public sessionService: SessionService){ }


  ngOnInit(){  }

  changernewpwd(){
    if(this.form.password !== this.form.confirmpassword){
      this.AlertLogin("Veuillez-confirmer le mot de passe");
    }
    else if(this.form.password.trim() === ""){
      this.AlertLogin("Veuillez entrer un mot de passe valide");
    }
    else {
      this.authService.changernewpwd(this.form).subscribe(
        (data) => {
          let uinfo: SessionInterface = this.sessionService.parseSession();
          uinfo.jamaisConnectionAvecNouveauPassword = false;
          this.sessionService.setSession(uinfo);
          this.router.navigate(['/ka_demande'])
        },
        err => {
          this.AlertLogin('Erreur connexion. Veuillez réessayer !!!!');
        }
      );
    }
  }

  AlertLogin(message: string) {
    Swal.fire({ title: message}).then(result => {
      if (result.value) {
      } else {
      }
    });
  }



}
