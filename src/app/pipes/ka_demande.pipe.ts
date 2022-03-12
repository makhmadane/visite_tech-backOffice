import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'ka_demande'
})
export class Ka_demandePipe implements PipeTransform {

  transform(tabcom: any,mot:any): any {
    if(mot){
         tabcom=tabcom.filter(a=>
           a.msisdn.indexOf(mot)!=-1 ||
           a.etat.toLowerCase().indexOf(mot.toLowerCase())!=-1 ||
           a.operation.toLowerCase().indexOf(mot.toLowerCase())!=-1 ||
           a.nom.toLowerCase().indexOf(mot.toLowerCase())!=-1||
           a.prenom.toLowerCase().indexOf(mot.toLowerCase())!=-1
         );
     }
    return tabcom;
  }
}

