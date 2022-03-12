import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class Ka_operationService {

  constructor(private httpClient: HttpClient) {}


  getData() {
    return this.httpClient.get(environment.Localurl + "api/ka_operation");
  }

  insertData(data) {
    return this.httpClient.post(environment.Localurl + "api/ka_operation", data);
  }

  deleteData(id) {
    return this.httpClient.delete(environment.Localurl + "api/ka_operation/" + id);
  }

  getOneData(id) {
    return this.httpClient.get(environment.Localurl + "api/ka_operation/" + id);
  }

  updateData(id, data) {
    return this.httpClient.put(environment.Localurl + "api/ka_operation/" + id, data);
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
