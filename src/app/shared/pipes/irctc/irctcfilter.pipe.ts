import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment'; 
import { DatePipe } from '@angular/common';
@Pipe({
  name: 'irctcfilter'
})
export class IrctcfilterPipe implements PipeTransform {

  transform(items: any[], filterDeparture: any[],filterArrival: any[], filterClasses: any[], filterTrainTypes: any[], filterFromStations: any[], filterToStations: any[], sortBy: string): any {
   if (!items) return [];
    let filtereditems=items;
    var returnDepart=[];
    let returnArrive=[];
    //Train Types
    filtereditems=  filtereditems.filter(a => {
       return filterTrainTypes.length ? filterTrainTypes.indexOf(a['trainType']) != -1 : filtereditems
    });
   //From Stations
    filtereditems=  filtereditems.filter(a => {
       return filterFromStations.length ? filterFromStations.indexOf(a['fromStnCode']) != -1 : filtereditems
    });

   //To Stations
    filtereditems=  filtereditems.filter(a => {
       return filterToStations.length ? filterToStations.indexOf(a['toStnCode']) != -1 : filtereditems
    });

   //Available Classes
    filtereditems=  filtereditems.filter(a => {
	if (a['avlClasses'] instanceof Array) {
	 return filterClasses.length ? a['avlClasses'].some(r=> filterClasses.indexOf(r) >= 0)  : filtereditems
	} else {
	 return filterClasses.length ? filterClasses.indexOf(a['avlClasses']) != -1 : filtereditems
	}
    });
   //Filter Departure
   
   filtereditems=  filtereditems.filter(a => {
       if(filterDeparture.length){
         filterDeparture.forEach(function (value) {
		var datePipe =new DatePipe('en-US');
       	 	var atime = a['departureTime'];
		switch(value) { 
		case 'BEFORE-6AM': { 
                var startTime=moment.duration('00:00').asMinutes();
		var endTime=moment.duration('06:00').asMinutes();
		var trainDeparture=moment.duration(atime).asMinutes();
                if(trainDeparture >=startTime && trainDeparture <=endTime) returnDepart.push(a['trainNumber'])
                break; 
		} 
		case '6AM-12PM': { 
                var startTime=moment.duration('06:01').asMinutes();
		var endTime=moment.duration('12:00').asMinutes();
		var trainDeparture=moment.duration(atime).asMinutes();
		if(trainDeparture >=startTime && trainDeparture <=endTime) returnDepart.push(a['trainNumber'])
		break;
                } 
		case '12PM-6PM': { 
 		var startTime=moment.duration('12:01').asMinutes();
		var endTime=moment.duration('18:00').asMinutes();
		var trainDeparture=moment.duration(atime).asMinutes();
		if(trainDeparture >=startTime && trainDeparture <=endTime) returnDepart.push(a['trainNumber'])
		break; 
                }
		case 'AFTER-6PM': { 
		 var startTime=moment.duration('18:01').asMinutes();
		var endTime=moment.duration('23:59').asMinutes();
		var trainDeparture=moment.duration(atime).asMinutes();
		if(trainDeparture >=startTime && trainDeparture <=endTime) returnDepart.push(a['trainNumber'])
		break; 
                }
		} 
	 });
       return returnDepart.length > 0 ? returnDepart.indexOf(a['trainNumber']) != -1 : ''
       }else{
	return filtereditems;
       }
	
    });


   //Filter Arrival
   
   
      filtereditems=  filtereditems.filter(a => {
       if(filterArrival.length){
         filterArrival.forEach(function (value) {
		var datePipe =new DatePipe('en-US');
       	 	var atime = a['arrivalTime'];
		switch(value) { 
		case 'BEFORE-6AM': { 
                var startTime=moment.duration('00:00').asMinutes();
		var endTime=moment.duration('06:00').asMinutes();
		var trainArrival=moment.duration(atime).asMinutes();
                if(trainArrival >=startTime && trainArrival <=endTime) returnArrive.push(a['trainNumber'])
                break; 
		} 
		case '6AM-12PM': { 
                var startTime=moment.duration('06:01').asMinutes();
		var endTime=moment.duration('12:00').asMinutes();
		var trainArrival=moment.duration(atime).asMinutes();
		if(trainArrival >=startTime && trainArrival <=endTime) returnArrive.push(a['trainNumber'])
		break;
                } 
		case '12PM-6PM': { 
 		var startTime=moment.duration('12:01').asMinutes();
		var endTime=moment.duration('18:00').asMinutes();
		var trainArrival=moment.duration(atime).asMinutes();
		if(trainArrival >=startTime && trainArrival <=endTime) returnArrive.push(a['trainNumber'])
		break; 
                }
		case 'AFTER-6PM': { 
		 var startTime=moment.duration('18:01').asMinutes();
		var endTime=moment.duration('23:59').asMinutes();
		var trainArrival=moment.duration(atime).asMinutes();
		if(trainArrival >=startTime && trainArrival <=endTime) returnArrive.push(a['trainNumber'])
		break; 
                }
		} 
	 });
       return returnArrive.length > 0 ? returnArrive.indexOf(a['trainNumber']) != -1 : ''
       }else{
	return filtereditems;
       }
	
    });
   
   
   

	//Sorting
	if(sortBy=='leave-late'){
	 filtereditems.sort(function(a, b) {return (moment.duration(b['departureTime']).asMinutes()) -(moment.duration(a['departureTime']).asMinutes()); });
	} else {
        filtereditems.sort(function(a, b) {return (moment.duration(a['departureTime']).asMinutes()) -(moment.duration(b['departureTime']).asMinutes()); });
	} 


    return filtereditems;
  }

}
