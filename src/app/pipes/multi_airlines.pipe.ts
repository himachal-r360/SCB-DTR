import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'multiairlines'
})
export class MultiAirlinesPipe implements PipeTransform {

  transform(value: any): any {
    var airline_array:any=[];
        const unique = (value, index, self) => {
        return self.indexOf(value) === index
        }

        for (let i = 0; i < value.length; i++) {
        airline_array.push(value[i].airline);

        }
        const airline_unique =airline_array.filter(unique);
        if(airline_unique.length > 1){
        return airline_unique;
        }else{
        return airline_unique
        }

}

}
