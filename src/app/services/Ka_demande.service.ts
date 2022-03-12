import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";



@Injectable({
  providedIn: "root",
})
export class Ka_demandeService {

  constructor(private httpClient: HttpClient) {}


  initialisationSearchDemande(){
    return this.httpClient.get(environment.Localurl + "api/ka_demande/initialisation_search_demande");
  }

  getData() {
    return this.httpClient.get(environment.Localurl + "api/ka_demande");
  }

  listedemande() {
    return this.httpClient.get(environment.Localurl + "api/ka_demande");
  }

  insertData(data) {
    return this.httpClient.post(environment.Localurl + "api/ka_demande", data);
  }

  deleteData(id) {
    return this.httpClient.delete(environment.Localurl + "api/ka_demande/" + id);
  }

  ouvrirdossier(id) {
    return this.httpClient.get(environment.Localurl + "api/ka_demande/" + id + "/ouvrirdossier");
  }
  
/////////////////////////////////////
  validerdossier(id) {

      return this.httpClient.put(environment.Localurl + "api/ka_demande/" + id + "/validerdossier", {});
 
  
  }

////////////////////////////////////
  invaliderdossier(id, data) {
  
      return this.httpClient.put(environment.Localurl + "api/ka_demande/" + id + "/invaliderdossier", {
        motif:data.motif,
        typeCommentaire:data.typeCommentaire,
        commentaire:data.commentaire
      });
 
  
  }

//////////////////////////////////////{}
  
updateEtatImage(id, action, body) {
    return this.httpClient.put(environment.Localurl + "api/ka_demande/" + id + "/image/"+action, body);
}

archiverdossier(id) {
    return this.httpClient.put(environment.Localurl + "api/ka_demande/" + id + "/archiverdossier", {});
  }

  ouvrirdossiersuivant(id) {
    return this.httpClient.get(environment.Localurl + "api/ka_demande/" + id + "/ouvrirdossiersuivant");
  }

  reouvrirdossier(id) {
    return this.httpClient.get(environment.Localurl + "api/ka_demande/" + id + "/reouvrirdossier");
  }

  enregistrerdossier(id, data) {
    return this.httpClient.put(environment.Localurl + "api/ka_demande/" + id + "/enregistrerdossier", {
      motif:data.motif,
      typeCommentaire:data.typeCommentaire,
      commentaire:data.commentaire
    });
  }

  research(type,datedebutcr,datefincr,datedebutm,kdatfinm,etat,motif,msisdn,vendeur) {
    return this.httpClient.get(environment.Localurl + "api/ka_demandeliste/"+type+"/"+datedebutcr+"/"+datefincr+"/"+datedebutm +"/"+datefincr+"/"+etat+"/"+motif+"/"+msisdn+"/"+vendeur);
  }

  researchOneDemande(prenom,nom,telephobe) {
    return this.httpClient.get(environment.Localurl + "api/ka_demandeliste/one/"+prenom+"/"+nom+"/"+telephobe);
  }
  exportpdf(attestationDemande): Observable<Blob> {

    return this.httpClient.get(environment.Localurl + "api/util/download/" + attestationDemande, { responseType: 'blob'});
    }


    downloadPdf(): Observable<Blob> {
      return this.httpClient.get(environment.Localurl + "api/util/download-apk/" + "0.22.apk", { responseType: 'blob'});
      }


}