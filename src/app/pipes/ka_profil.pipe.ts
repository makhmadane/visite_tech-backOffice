import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ka_profil'
})

export class Ka_profilPipe implements PipeTransform {

  transform(tabcom: any,mot:any): any {

    if(mot){
         tabcom=tabcom.filter(a=>
           a.codeProfil.toLowerCase().indexOf(mot.toLowerCase())!=-1 ||
           a.name.toLowerCase().indexOf(mot.toLowerCase())!=-1
         );
     }
    return tabcom;
  }
}

