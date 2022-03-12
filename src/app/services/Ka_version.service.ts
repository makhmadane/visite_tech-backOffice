import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})

export class Ka_versionService {
  constructor(private httpClient: HttpClient) {}

  getData() {
    return this.httpClient.get(environment.Localurl + "api/versionning");
  }

  insertData(data) {
    return this.httpClient.post(environment.Localurl + "api/versionning", data);
  }

  deleteData(id) {
    return this.httpClient.delete(environment.Localurl + "api/versionning/" + id);
  }

  getOneData(id) {
    return this.httpClient.get(environment.Localurl + "api/versionning/" + id);
  }

  updateData(id, data) {

    return this.httpClient.put(environment.Localurl + "api/versionning/" + id, data);
  }


}
