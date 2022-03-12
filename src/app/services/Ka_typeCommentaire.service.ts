import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})

export class Ka_typeCommentaireService {
  constructor(private httpClient: HttpClient) {}

  getData() {
    return this.httpClient.get(environment.Localurl + "api/typecommentaire");
  }

  insertData(data) {
    return this.httpClient.post(environment.Localurl + "api/typecommentaire", data);
  }

  deleteData(id) {
    return this.httpClient.delete(environment.Localurl + "api/typecommentaire/" + id);
  }

  getOneData(id) {
    return this.httpClient.get(environment.Localurl + "api/typecommentaire/" + id);
  }

  updateData(id, data) {

    return this.httpClient.put(environment.Localurl + "api/typecommentaire/" + id, data);
  }


}
