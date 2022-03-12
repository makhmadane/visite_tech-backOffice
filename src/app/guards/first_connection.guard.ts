import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { SessionService } from "../services/session.service";
import { SessionInterface } from '../interfaces/session.interface';


@Injectable()
export class FirstConnectionGuard implements CanActivate {


  constructor(private router: Router ,private sessionService: SessionService) {}


  canActivate() {
    const uinfo: SessionInterface = this.sessionService.parseSession();
    if(uinfo && uinfo.role && (uinfo.jamaisConnectionAvecNouveauPassword === true)) {
      if (uinfo.role.codeRole==="S") {
        this.sessionService.deleteSession();
        this.router.navigate(["/login"]);
        return false;
      }
      else{
        return true;
      }
    } else {
      this.sessionService.deleteSession();
      this.router.navigate(["/login"]);
      return false;
    }
  }


}
