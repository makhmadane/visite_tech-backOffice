import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'ka_operation'
})

export class Ka_operationPipe implements PipeTransform {

  transform(tabcom: any,mot:any): any {
    if(mot){
      tabcom=tabcom.filter(a=>
        a.nomOperation.toLowerCase().indexOf(mot.toLowerCase())!=-1 ||
        a.codeOperation.toLowerCase().indexOf(mot.toLowerCase())!=-1
      );
    }
    return tabcom;
  }
}

