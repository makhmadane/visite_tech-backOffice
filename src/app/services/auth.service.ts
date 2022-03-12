import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { SessionService } from './session.service';
import { map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: "root",
})
export class AuthService {

  public _url: string = environment.Localurl + "api/auth/";

  constructor(private http: HttpClient, private sessionService: SessionService) {  }


  login(body: {username: string, password: string}): Observable<any> {
    return this.http.post(this._url + 'signinweb', body).pipe(
      tap((resp:any) => {
        if(resp.status == 200){
          const auth = resp.data;
          this.sessionService.setSession({
            token: auth.token, username: auth.username,
            email: auth.email, prenom: auth.prenom,
            nom: auth.nom, role: auth.role, profils: auth.profils,
            jamaisConnectionAvecNouveauPassword: auth.jamaisConnectionAvecNouveauPassword
          });
        }
      }),
      map(res => {
        return res;
      })
    )
  }

  logout(): void {
    this.sessionService.deleteSession();
    this.http.get(environment.Localurl + 'api/logout');
  }



}
