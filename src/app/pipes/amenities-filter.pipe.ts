import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'amenitiesFilter',
  pure: false
})
export class AmenitiesFilterPipe implements PipeTransform {
  transform(items: any[], filter: any): any {
    var filtered = [];
      if (!items || !filter) {
          return items;
      }

      items.forEach(z=>{
        if(filter[z.value] =='1')
        {
          filtered.push(z);
        }
      });

      return filtered;
  }
}
