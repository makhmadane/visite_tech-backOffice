import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class Ka_motifService {
  constructor(private httpClient: HttpClient) {}

  getData() {
    return this.httpClient.get(environment.Localurl + "api/ka_motif");
  }

  insertData(data) {
    return this.httpClient.post(environment.Localurl + "api/ka_motif", data);
  }

  deleteData(id) {
    return this.httpClient.delete(environment.Localurl + "api/ka_motif/" + id);
  }

  getOneData(id) {
    return this.httpClient.get(environment.Localurl + "api/ka_motif/" + id);
  }

  updateData(id, data) {

    return this.httpClient.put(environment.Localurl + "api/ka_motif/" + id, data);
  }


}
