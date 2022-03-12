import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from 'rxjs';



@Injectable({providedIn: "root"})
export class UserService {

  constructor(private http: HttpClient) {

  }

  statusActiver(id) {
    return this.http.get(environment.Localurl + "api/user/"+id+"/statusactiver");
  }
  statusDescativer(id) {
    return this.http.get(environment.Localurl + "api/user/"+id+"/statusdesactiver");
  }
  statusClotuter(id) {
    return this.http.get(environment.Localurl + "api/user/"+id+"/statuscloturer");
  }

  getAll() {
    return this.http.get(environment.Localurl + "api/user");
  }

  insert(data) {
    return this.http.post(environment.Localurl + "api/user", data);
  }

  delete(id) {
    return this.http.delete(environment.Localurl + "api/user/" + id);
  }

  getOne(id) {
    return this.http.get(environment.Localurl + "api/user/" + id);
  }

  update(id, data) {
    return this.http.put(environment.Localurl + "api/user/" + id, data);
  }

  reinitialiserPassword(id) {
    return this.http.get(environment.Localurl + "api/user/" + id + "/reinitiliserpass");
  }

  
  changernewpwd(body: {username: string, password: string}): Observable<any> {
    return this.http.post(environment.Localurl + 'api/changernewpass', body);
  }


  exportpdf(id): Observable<Blob> {
    return this.http.get(environment.Localurl + "api/exportpdf/" + id + "/user", { responseType: 'blob'});
  }

  import_en_masse(body) {
    return this.http.post(environment.Localurl + "api/user/import_en_masse", body);
  }  


  //////////////////////////////////////
  language = {
    'lengthMenu': 'Afficher _MENU_ lignes par page',
      'zeroRecords': 'Pas de données correspondant',
      'info': 'Affichage de _START_ à _END_ sur _TOTAL_ données',
      'infoEmpty': 'Pas de données disponible',
      'search': 'Rechercher&nbsp;:',
      'infoFiltered': '(filtered from _MAX_ total records)',
      'buttons': {
          'pageLength': {
              '_': "Afficher %d éléments",
              '-1': "Tout afficher"
          }
      },
      'paginate': {
        'first': 'Premier',
        'previous': 'Pr&eacute;c&eacute;dent',
        'next': 'Suivant',
        'last': 'Dernier'
      }
  };


  
}
