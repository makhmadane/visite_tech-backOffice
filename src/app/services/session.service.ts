import { Injectable } from "@angular/core";
import { Observable, Subject, of } from "rxjs";
import { SessionInterface } from "../interfaces/session.interface";

const _NAME_SESSION: string = "sessSt-hoazfxdbanbgqpsi";


@Injectable()
export class SessionService {


  m_session$: Observable<SessionInterface>;

  constructor(){
    this.m_session$ = new Subject<SessionInterface>();
  }

  public initSession(){
    this.m_session$ = of<SessionInterface>(this.parseSession());
  }

  public parseSession(): SessionInterface {
    let sessSt = sessionStorage.getItem(_NAME_SESSION);
    return sessSt ? JSON.parse(sessSt) : null;
  }

  public getToken(): any {
    let sessSt = sessionStorage.getItem(_NAME_SESSION);
    return sessSt ? JSON.parse(sessSt).token : null;
  }

  public getSession(): Observable<SessionInterface> {
    let sessSt = sessionStorage.getItem(_NAME_SESSION);
    if (sessSt) {
      this.initSession();
    }
    return this.m_session$;
  }

  public setSession(sessSt: SessionInterface){
    sessionStorage.setItem(_NAME_SESSION, JSON.stringify(sessSt));
  }

  public deleteSession() {
    sessionStorage.removeItem(_NAME_SESSION);
  }


}
