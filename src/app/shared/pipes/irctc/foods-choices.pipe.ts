import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'foodsChoices'
})
export class FoodsChoicesPipe implements PipeTransform {
  transform(inputvalue: string): string {
    if(inputvalue=="N"){
        return "Non-Veg";
    }else if (inputvalue=="V"){
        return "Veg";
    }else{
        return inputvalue;
    } 
  }
}
