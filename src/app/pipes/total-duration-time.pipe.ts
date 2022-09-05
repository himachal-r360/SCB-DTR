import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'durationTotalTime'
})
export class TotalDurationTimePipe implements PipeTransform {

  // transform(value: unknown, ...args: unknown[]): unknown {
  //   return null;
  // }
  transform(value: any): string {
    var totalOnwardDuration=0;
  
        for (let i = 0; i < value.length; i++) {
        totalOnwardDuration += value[i].duration;
        if (value[i + 1] != null && value[i + 1] != undefined) {
        let obj2Date = new Date(value[i + 1].departureDateTime);
        let obj1Date = new Date(value[i ].arrivalDateTime);
        totalOnwardDuration+= (obj2Date.valueOf() - obj1Date.valueOf()) / 1000;   
        }
  
       }
    let minutes: number = Math.trunc(totalOnwardDuration/60);
    let hours: number = 0;
    let seconds: number = totalOnwardDuration - (minutes*60);

    if (minutes >= 60) {
      hours = Math.trunc(minutes/60);
      minutes = minutes - (hours*60);
    }

    let response: string = "";
    
    if (hours > 0) {
      response = response +  String(hours).padStart(2, '0') + "h ";
    } 

      response = response + String(minutes).padStart(2, '0')+ "m ";

    if (seconds > 0) {
      response = response + seconds + "s";
    }

    return response;
}

}
