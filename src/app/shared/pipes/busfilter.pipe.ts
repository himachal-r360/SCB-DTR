import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment'; 
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'busfilter'
})
export class BusfilterPipe implements PipeTransform {

    transform(items: any[],minSeletedPriceValue:number,maxSeletedPriceValue:number,filterDeparture: any[],filterArrival: any[],filterboardingpoints: any[],filterdroppingpoints: any[],filterClasses:any[],filteroperators:any[],filteramenities:any[],sortBy: string): any {
   if (!items) return [];
    let filtereditems=items;
    let returnDepart = [];
    let returnArrival = [];
    let availclass = [];
    let returnArrive;

//

	//Available Seats
    filtereditems=  filtereditems.filter(a => {  return a.availableSeats > 0 ; });

	  filtereditems = filtereditems.filter(a => {
	for(var i=0; i<a['fareDetails'].length; i++){
	 return	a['fareDetails'][i]['totalFare'] >=minSeletedPriceValue && a['fareDetails'][i]['baseFare'] <= maxSeletedPriceValue;
	}
    });
	//Available Boarding
    filtereditems=  filtereditems.filter(a => {
 	if(a['boardingTimes'].length > 0){
	 var values = [];
	for(var i=0; i<a['boardingTimes'].length; i++){
	var filreslt = filterboardingpoints.length ? filterboardingpoints.indexOf((a['boardingTimes'][i]['boardingPointName']).toLowerCase().trim()) != -1 : filtereditems

       if(filreslt)break; 
	}

	return filreslt;
 }else{ return false; }
    });

	//Available Dropping
    filtereditems=  filtereditems.filter(a => {
        if(a['droppingTimes'].length > 0){
	 var values = [];
	for(var i=0; i<a['droppingTimes'].length; i++){
	var filreslt = filterdroppingpoints.length ? a['droppingTimes'][i] && filterdroppingpoints.indexOf((a['droppingTimes'][i]['boardingPointName']).toLowerCase().trim()) != -1 : filtereditems
	if(filreslt)break;
	}
	return filreslt;
       }else{ return false; }
    });


    	//Available Classes

        
	    filtereditems=  filtereditems.filter(a => {

		if(filterClasses.length){


              //Only Seater
              if(filterClasses.includes("seater")==true && filterClasses.includes("sleeper")==false){
                 if(filterClasses.includes("ac")==true && filterClasses.includes("nonAC")==true){
		  return a['seater']==true && (a['ac']==true || a['nonAC']==true);
                 }else  if(filterClasses.includes("ac")==true && filterClasses.includes("nonAC")==false){
		  return a['seater']==true && (a['ac']==true );
                 }else  if(filterClasses.includes("ac")==false && filterClasses.includes("nonAC")==true){
		  return a['seater']==true && (a['nonAC']==true );
                 }else{
                    return a['seater']==true;
                 }
                
              }
             //Only sleeper
             else if(filterClasses.includes("seater")==false && filterClasses.includes("sleeper")==true){
 		if(filterClasses.includes("ac")==true && filterClasses.includes("nonAC")==true){
		  return a['sleeper']==true && (a['ac']==true || a['nonAC']==true);
                 }else  if(filterClasses.includes("ac")==true && filterClasses.includes("nonAC")==false){
		  return a['sleeper']==true && (a['ac']==true );
                 }else  if(filterClasses.includes("ac")==false && filterClasses.includes("nonAC")==true){
		  return a['sleeper']==true && (a['nonAC']==true );
                 }else{
                    return a['sleeper']==true;
                 }

              }else{

                 if(filterClasses.includes("ac")==true && filterClasses.includes("nonAC")==true){
		  return (a['seater']==true ||a['sleeper']==true  ) && (a['ac']==true || a['nonAC']==true);
                 }else  if(filterClasses.includes("ac")==true && filterClasses.includes("nonAC")==false){
		  return (a['seater']==true ||a['sleeper']==true  ) && (a['ac']==true );
                 }else  if(filterClasses.includes("ac")==false && filterClasses.includes("nonAC")==true){
		  return (a['seater']==true ||a['sleeper']==true  ) && (a['nonAC']==true );
                  }else{
                    return (a['seater']==true || a['sleeper']==true  );
                 }
              }
 

		}else{
		 return filtereditems;
		}
		 
	     });


	//Available Operators
    filtereditems=  filtereditems.filter(a => {
       return filteroperators.length ? filteroperators.indexOf(a['travels'].toLowerCase().trim()) != -1 : filtereditems
   });



   //Available Amenities
   if(filteramenities.length){
    filtereditems=  filtereditems.filter(a => {
	if(a['amenities'] != null){
		var amenities = a['amenities'].split(','); 
		 var filreslt = filteramenities.length ? this.containsAny(filteramenities,amenities) : filtereditems
                 return filreslt;
	}
   });

  /* filtereditems=  filtereditems.filter(a => {
	var values = [];
	if(a['amenities'] != null){
	var amenities = a['amenities'].split(','); 
   for(var i=0; i<amenities.length; i++){
		 
   var filreslt = filteramenities.length ? filteramenities.indexOf(amenities[i]) != -1 : filtereditems
   if(filreslt)break;
   }
   return filreslt;
	}
   });*/
}


  //Filter Departure
	filtereditems=  filtereditems.filter(a => {
       if(filterDeparture.length){
         filterDeparture.forEach(function (value) {

		var datePipe =new DatePipe('en-US');
       	 	var atime =  datePipe.transform(a['departureTime'], 'HH:mm');
		switch(value) { 
		case 'BEFORE-6AM': { 
                var startTime=moment.duration('00:00').asMinutes();
		var endTime=moment.duration('06:00').asMinutes();
		var trainDeparture=moment.duration(atime).asMinutes();
                if(trainDeparture >=startTime && trainDeparture <=endTime) returnDepart.push(a['id'])
                break; 
		} 
		case '6AM-12PM': { 
                var startTime=moment.duration('06:01').asMinutes();
		var endTime=moment.duration('12:00').asMinutes();
		var trainDeparture=moment.duration(atime).asMinutes();
		if(trainDeparture >=startTime && trainDeparture <=endTime) returnDepart.push(a['id'])
		break;
                } 
		case '12PM-6PM': { 
 		var startTime=moment.duration('12:01').asMinutes();
		var endTime=moment.duration('18:00').asMinutes();
		var trainDeparture=moment.duration(atime).asMinutes();
		if(trainDeparture >=startTime && trainDeparture <=endTime) returnDepart.push(a['id'])
		break; 
                }
		case 'AFTER-6PM': { 
		 var startTime=moment.duration('18:01').asMinutes();
		var endTime=moment.duration('23:59').asMinutes();
		var trainDeparture=moment.duration(atime).asMinutes();
		if(trainDeparture >=startTime && trainDeparture <=endTime) returnDepart.push(a['id'])
		break; 
                }
		} 
	 });
       return returnDepart.length > 0 ? returnDepart.indexOf(a['id']) != -1 : ''
       }else{
	return filtereditems;
       }
	
    });

//Filter arrival time
	filtereditems=  filtereditems.filter(a => {
       if(filterArrival.length){
         filterArrival.forEach(function (value) {

		var datePipe =new DatePipe('en-US');
       	 	var atime =  datePipe.transform(a['arrivalTime'], 'HH:mm');
		switch(value) { 
		case 'BEFORE-6AM': { 
                var startTime=moment.duration('00:00').asMinutes();
		var endTime=moment.duration('06:00').asMinutes();
		var trainDeparture=moment.duration(atime).asMinutes();
                if(trainDeparture >=startTime && trainDeparture <=endTime) returnArrival.push(a['id'])
                break; 
		} 
		case '6AM-12PM': { 
                var startTime=moment.duration('06:01').asMinutes();
		var endTime=moment.duration('12:00').asMinutes();
		var trainDeparture=moment.duration(atime).asMinutes();
		if(trainDeparture >=startTime && trainDeparture <=endTime) returnArrival.push(a['id'])
		break;
                } 
		case '12PM-6PM': { 
 		var startTime=moment.duration('12:01').asMinutes();
		var endTime=moment.duration('18:00').asMinutes();
		var trainDeparture=moment.duration(atime).asMinutes();
		if(trainDeparture >=startTime && trainDeparture <=endTime) returnArrival.push(a['id'])
		break; 
                }
		case 'AFTER-6PM': { 
		 var startTime=moment.duration('18:01').asMinutes();
		var endTime=moment.duration('23:59').asMinutes();
		var trainDeparture=moment.duration(atime).asMinutes();
		if(trainDeparture >=startTime && trainDeparture <=endTime) returnArrival.push(a['id'])
		break; 
                }
		} 
	 });
       return returnArrival.length > 0 ? returnArrival.indexOf(a['id']) != -1 : ''
       }else{
	return filtereditems;
       }
	
    });



	//Sorting
	if(sortBy=='rating'){
		filtereditems.sort(function(a, b) { return Math.floor(b.rating*100) - Math.floor(a.rating*100);});
		}
	else if(sortBy=='price-low-high'){
	filtereditems.sort(function(a, b) { return a.fareDetails[0].baseFare - b.fareDetails[0].baseFare;});
	}
	else if(sortBy=='price-high-low'){
	filtereditems.sort(function(a, b) { return b.fareDetails[0].baseFare - a.fareDetails[0].baseFare;});
	}
	else if(sortBy=='seats-availability'){
	filtereditems.sort(function(a, b) { return b.availableSeats - a.availableSeats;});
	}
	else if(sortBy=='leave-early'){
	 filtereditems.sort(function(a, b) {

		var datePipe =new DatePipe('en-US');
       	 	var atime =  datePipe.transform(a['departureTime'], 'HH:mm');
		var btime =  datePipe.transform(b['departureTime'], 'HH:mm');

	 return (moment.duration(atime).asMinutes()) -(moment.duration(btime).asMinutes()); });
	}
	else if(sortBy=='leave-late'){
	 filtereditems.sort(function(a, b) {var datePipe =new DatePipe('en-US');
       	 	var atime =  datePipe.transform(a['departureTime'], 'HH:mm');
		var btime =  datePipe.transform(b['departureTime'], 'HH:mm');

	 return (moment.duration(btime).asMinutes()) -(moment.duration(atime).asMinutes()); }); 
	} else {
       // filtereditems.sort(function(a, b) {return (moment.duration(a['departureTime']).asMinutes()) -(moment.duration(b['departureTime']).asMinutes()); });
	   filtereditems.sort(function(a, b) { return Math.floor(b.rating*100) - Math.floor(a.rating*100);});
	} 

	//filtereditems.sort(function(a, b) { return b.rtc - a.rtc;});

    return filtereditems;
  }


containsAny(source: any,target: any)
{
    var result = source.filter(function(item){ return target.indexOf(item) > -1});   
    return (result.length > 0 && source.length == result.length);  
}  

}
