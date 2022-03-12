import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";


@Injectable({
  providedIn: "root",
})
export class RoleService {


  constructor(private http: HttpClient) {  }

  getAll() {
    return this.http.get(environment.Localurl + "api/role");
  }

  insert(data) {
    return this.http.post(environment.Localurl + "api/role", data);
  }

  delete(id) {
    return this.http.delete(environment.Localurl + "api/role" + "/" + id);
  }

  getOne(id) {
    return this.http.get(environment.Localurl + "api/role" + "/" + id);
  }

  update(id, data) {
    return this.http.put(environment.Localurl + "api/role" + "/" + id, data);
  }

  

////////////////////////////////////////////////////////////////
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
