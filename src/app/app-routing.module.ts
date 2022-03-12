import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { ChangernewpwdComponent } from './changernewpwd/changernewpwd.component';
import { FirstConnectionGuard } from './guards/first_connection.guard';
import { AuthGuard } from './guards/auth.guard';
import { PagesComponent } from './pages/pages.component';
import { UserComponent } from './pages/user/user.component';
import { ka_roleComponent } from './pages/ka_role/ka_role.component';
import { ka_operationComponent } from "./pages/ka_operation/ka_operation.component";
import { ka_profilComponent } from './pages/ka_profil/ka_profil.component';
import { Ka_demandeComponent } from './pages/ka_demande/ka_demande.component';
import { ImportUsersComponent } from "./pages/user/import-users.component";
import { ka_type_commentaireComponent } from "./pages/ka_type_commentaire/ka_type_commentaire.component";
import { KaVersionComponent } from "./pages/ka-version/ka-version.component";
import { KaAgenceComponent } from "./pages/ka-agence/ka-agence.component";




const routes: Routes = [

  { path: "login", component: LoginComponent },

  

  { path: "changernewpwd", canActivate: [FirstConnectionGuard], component: ChangernewpwdComponent },

  { path: '', /*canActivate: [AuthGuard],*/ component: PagesComponent,
    children: [

      { path: "ka_agence", component: KaAgenceComponent },
      { path: "ka_agence/:id",component: KaAgenceComponent },

      { path: "ka_version", component: KaVersionComponent },
      { path: "ka_version/:id",component: KaVersionComponent },

      { path: "ka_demande", component: Ka_demandeComponent },
      { path: 'ka_demande/:arg1/:arg2/:arg3/:arg4/:arg5/:arg6/:arg7/:arg8/:arg9', component: Ka_demandeComponent },
      { path: "ka_demande/:id",component: Ka_demandeComponent },

      { path: "ka_profil", component: ka_profilComponent },

      { path: "ka_type_commentaire", component: ka_type_commentaireComponent },

      { path: "ka_operation", component: ka_operationComponent },

      { path: "ka_role", component: ka_roleComponent },

      { path: "user", component: UserComponent },
      { path: "import-users", component: ImportUsersComponent },

      { path: '**', redirectTo: '/login' }
    ]
  },

  { path: '**', redirectTo: '/login' }

];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
