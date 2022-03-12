import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "userFiltre",
})
export class UserPipe implements PipeTransform {
  transform(tabAtelier: any, mot: any): any {
    if (mot) {
      tabAtelier = tabAtelier.filter(
        (a) =>
          
            a.nom.toLowerCase().indexOf(mot.toLowerCase()) != -1 ||
            a.prenom.toLowerCase().indexOf(mot.toLowerCase()) != -1 ||
            a.username.toLowerCase().indexOf(mot.toLowerCase()) != -1  ||
            a.telephone?.toLowerCase().includes(mot.toLowerCase()) ||
            a.contact?.toLowerCase().includes(mot.toLowerCase()) ||
            a.email?.toLowerCase().includes(mot.toLowerCase())
 
      );
     
    
    }

     return tabAtelier;
   
  }
}