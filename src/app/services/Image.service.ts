import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";


@Injectable({providedIn: "root"})
export class ImageService {
  constructor(private httpClient: HttpClient) {}

  getData() {
    return this.httpClient.get(environment.Localurl + "image");
  }

  insertData(data) {
    return this.httpClient.post(environment.Localurl + "image", data);
  }

  deleteData(id) {
    return this.httpClient.delete(environment.Localurl + "image/" + id);
  }

  getOneData(id) {
    return this.httpClient.get(environment.Localurl + "image/" + id);
  }

  updateData(id, data) {
    return this.httpClient.put(environment.Localurl + "image/" + id, data);
  }
  getAllImage(id) {
    return this.httpClient.get(
      environment.Localurl + "image/findimagebyId/" + id
    );
  }
  getAllImageDemande(id) {
    return this.httpClient.get(
      environment.Localurl + "image/findimagebyka_demande/" + id
    );
  }




}
