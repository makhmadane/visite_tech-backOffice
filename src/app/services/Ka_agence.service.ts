import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})

export class Ka_agenceService {
  constructor(private httpClient: HttpClient) {}

  getData() {
    return this.httpClient.get(environment.Localurl + "api/agence");
  }

  insertData(data) {
    return this.httpClient.post(environment.Localurl + "api/agence", data);
  }

  deleteData(id) {
    return this.httpClient.delete(environment.Localurl + "api/agence/" + id);
  }

  getOneData(id) {
    return this.httpClient.get(environment.Localurl + "api/agence/" + id);
  }

  updateData(id, data) {

    return this.httpClient.put(environment.Localurl + "api/agence/" + id, data);
  }


}
