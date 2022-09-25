import {Pipe, PipeTransform} from '@angular/core';
 
import * as moment from 'moment';


@Pipe({
  name: 'comma'
})
export class CommaPipe implements PipeTransform {

  transform( args: string[]): any {

  console.log(args);
  	
  }
}
