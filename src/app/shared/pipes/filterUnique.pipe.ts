import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'filterUnique',
    pure: false
})
export class FilterPipe implements PipeTransform {
    transform(value: any, args?: any): any {
        // Remove the duplicate elements
        
     var  unique = [...new Set(value.map(item => item.partnerName))];
      return unique.length-1;
   
    }
}
