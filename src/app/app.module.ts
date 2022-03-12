import { CommonModule, HashLocationStrategy, LocationStrategy } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule, Injectable, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";
import * as $ from "jquery";
import { HttpClientModule, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS, HttpErrorResponse, HttpEvent, HttpHeaderResponse, HttpSentEvent, HttpProgressEvent, HttpResponse, HttpUserEvent } from '@angular/common/http';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import Swal from 'sweetalert2';
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";

import { NgxPaginationModule } from "ngx-pagination";

import { Ka_profilPipe } from './pipes/ka_profil.pipe';
import { Ka_operationPipe } from './pipes/ka_operation.pipe';
import { Ka_demandePipe } from './pipes/ka_demande.pipe';
import { SessionService } from './services/session.service';
import { FirstConnectionGuard } from "./guards/first_connection.guard";
import { AuthGuard } from './guards/auth.guard';
import { PagesComponent } from './pages/pages.component';
import { ChangernewpwdComponent } from './changernewpwd/changernewpwd.component';

import { Ng2ImgMaxModule } from 'ng2-img-max';
import { NgSelectModule } from '@ng-select/ng-select';


import { ka_roleComponent } from './pages/ka_role/ka_role.component';
import { ka_operationComponent } from "./pages/ka_operation/ka_operation.component";
import { UserComponent } from './pages/user/user.component';
import { ImportUsersComponent } from "./pages/user/import-users.component";
import { ka_profilComponent } from './pages/ka_profil/ka_profil.component';
import { Ka_demandeComponent } from './pages/ka_demande/ka_demande.component';

// Import library module
import { NgxSpinnerModule } from "ngx-spinner";
import { DataTablesModule } from "angular-datatables";

import { DetaildemandeComponent } from "./pages/ka_demande/detail-demande.component";
import { ExportService } from "./services/export.service";
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgxBootstrapConfirmModule } from 'ngx-bootstrap-confirm';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ka_type_commentaireComponent } from "./pages/ka_type_commentaire/ka_type_commentaire.component";
import { KaVersionComponent } from './pages/ka-version/ka-version.component';
import { KaAgenceComponent } from "./pages/ka-agence/ka-agence.component";
import { UserPipe } from "./pages/user/user.pipe";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { Router } from "@angular/router";

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private sessionService: SessionService,private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>>  {
    let authReq = req;
    const token = this.sessionService.getToken();
    if (token != null) {
      authReq = req.clone({ headers: req.headers
        .set(TOKEN_HEADER_KEY,'Bearer ' + token) 
        .set("Access-Control-Allow-Origin",'*')
        .set( 'X-Content-Type-Options', 'nosniff')
        .set('X-Frame-Options','Deny')
      });
      
     
    }
    return next.handle(authReq)
    .pipe(
      tap(event => {
     
        if (event instanceof HttpResponse) {
         
          if(event.body.status==504 || event.body.status==511 ){
            this.AlertMessage(event.body.message);
          }
       
     
        }
      }),
      catchError( (
      error: HttpErrorResponse) => {
        console.log("dane");
        console.log(error);
      if (error.status === 401) {
        this.AlertMessage("Votre connexion au serveur a expiré.Veuillez vous connecter!!!");
      }
     
      return throwError(error);
  }));
  
  }
  AlertMessage(message) {
    Swal.fire({ 
      title: message,
      confirmButtonColor: "#ff7900",
      confirmButtonText: "Ok",
    
    }).then(result => {
      if (result.value) {
        this.sessionService.deleteSession();
        this.router.navigate(["/login"]);
        
      } else {
      }
    });
  }
}

@NgModule({
  declarations: [
    AppComponent,

    LoginComponent,
    ChangernewpwdComponent,

    PagesComponent,

    UserComponent,
    ImportUsersComponent,

    Ka_demandeComponent,
   
    DetaildemandeComponent,

    ka_profilComponent,

    ka_operationComponent,

    ka_roleComponent,

    ka_type_commentaireComponent,
    
    Ka_demandePipe,
    Ka_operationPipe,
    Ka_profilPipe,
    KaVersionComponent,
    KaAgenceComponent,
    UserPipe
   
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    Ng2ImgMaxModule,
    NgxPaginationModule,
    NgSelectModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    DataTablesModule,
    NgxDaterangepickerMd.forRoot(),
    NgxBootstrapConfirmModule,
    NgbModule,
    NgxImageZoomModule ,
    Ng2ImgMaxModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    SessionService,
    FirstConnectionGuard,
    AuthGuard,
    ExportService,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
