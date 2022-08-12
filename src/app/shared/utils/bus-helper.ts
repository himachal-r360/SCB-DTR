import { Injectable } from '@angular/core';
import * as moment from 'moment'; 
import { DatePipe } from '@angular/common';

@Injectable()
export class BusHelper {
constructor(   ) {    }

timeDifferMin(startDate: any,endDate: any) {
	var ms=moment(startDate,"YYYY-MM-DDTHH:mm:ss").diff(moment(endDate,"YYYY-MM-DDTHH:mm:ss"));
	var d = moment.duration(ms);
	var s = Math.floor(d.asHours())+'h ' + moment.utc(ms).format("mm")+ 'm';
	return s;
}

getBusTypes(value: any){
 var ac = [];
 var nonAC = [];
 var seater = [];
 var sleeper = [];
 var values = [];
	for (let val of value) {
        if(val.availableSeats > 0 ){
	if(val.ac==true) ac.push('ac');
	if(val.nonAC==true) nonAC.push('nonAC');
	if(val.seater==true) seater.push('Seater');
	if(val.sleeper==true) sleeper.push('Sleeper');
        }
	}

	if(seater.length > 0) values.push({'searchname':'seater','count':seater.length,'type':'SEATER','selected':false});
	if(sleeper.length > 0) values.push({'searchname':'sleeper','count':sleeper.length,'type':'SLEEPER','selected':false});
	if(ac.length > 0) values.push({'searchname':'ac','count':ac.length,'type':'AC','selected':false});
	if(nonAC.length > 0) values.push({'searchname':'nonAC','count':nonAC.length,'type':'NON AC','selected':false});
	
	
	return values;
}

   getamenitiesFilter(allamenities: any,filtered: any,selectedValue: any){
	var values = [];
	var values1 = []; 

	for (let val of filtered) {
             if(val.availableSeats > 0 ){
		if(val['amenities'] != null){
		var amenities = val['amenities'].split(','); 
		for(let bt of amenities){
				if(bt != ''){
				let index = values.filter(e => e.amenities === bt); 
				values1.push({'amenities':bt});
			}
		   }
		}
          }
	}
	for (let val of allamenities) {
	let index = values1.filter(e => e.amenities === val.amenities); 
	values.push({'amenities': val.amenities,'total':index.length,'selected':selectedValue.includes(val.amenities)});
	}
	return values;
   }
getBusOperatorsFilter(alloperators: any,filtered: any,selectedOperator: any){

	var values = [];
	var values1 = [];
	for (let val of filtered) {
         if(val.availableSeats > 0 )
	values1.push({'travels':val.travels.toLowerCase().trim()});
	}

	for (let val of alloperators) {
	let index = values1.filter(e => e.travels.toLowerCase().trim() === val.name.toLowerCase().trim()); 
	values.push({'operator':val.operator,'name':val.name,'total':index.length,'selected':selectedOperator.includes(val.operator)});
	}

	return values;
   }

getBoardingpointsFilter(allboardingpoints: any,filtered: any,boarddrop: any,selectedValues: any){
	var values = [];
	var values1 = [];
	for (let val of filtered) {
        if(val.availableSeats > 0 ){
	for(let bt of val[boarddrop]){
	values1.push({'boardingPointName':bt.boardingPointName.trim()});
	}
	}
        }
	for (let val of allboardingpoints) {
	let index = values1.filter(e => e.boardingPointName === val.boardingPointName); 
	values.push({'boardingPointId':val.boardingPointId,'address':val.address,'boardingPointName':val.boardingPointName.trim(),'total':index.length,'selected':selectedValues.includes(val.boardingPointName.toLowerCase().trim())});
	}

	return values;
}

getBusTypesFilterNew(allAvailableClasses:any,value: any,selectedClasses: any){

 var ac = [];
 var nonAC = [];
 var seater = [];
 var sleeper = [];
 var values = [];

 var firstSelected=selectedClasses;

	for (let val of value) {
          if(val.availableSeats > 0 ){
	if(val.ac==true) ac.push('ac');
	if(val.nonAC==true) nonAC.push('nonAC');
	if(val.seater==true) seater.push('Seater');
	if(val.sleeper==true) sleeper.push('Sleeper');
         }
	}

      let seaterCnt = allAvailableClasses.filter(e => e.searchname === "seater"); 
      let sleeperCnt = allAvailableClasses.filter(e => e.searchname === "sleeper"); 
      let acCnt = allAvailableClasses.filter(e => e.searchname === "ac"); 
      let nonacCnt = allAvailableClasses.filter(e => e.searchname === "nonAC"); 

      if(firstSelected.length==1){
        switch (firstSelected[0]) { 
	case 'seater': 
	values.push({'searchname':'seater','count':seaterCnt[0].count,'type':'SEATER','selected':selectedClasses.includes("seater")});
	values.push({'searchname':'sleeper','count':sleeperCnt[0].count,'type':'SLEEPER','selected':selectedClasses.includes("sleeper")});
	values.push({'searchname':'ac','count':ac.length,'type':'AC','selected':selectedClasses.includes("ac")});
	values.push({'searchname':'nonAC','count':nonAC.length,'type':'NON AC','selected':selectedClasses.includes("nonAC")});
 	break;
	case 'sleeper': 
	values.push({'searchname':'seater','count':seaterCnt[0].count,'type':'SEATER','selected':selectedClasses.includes("seater")});
	values.push({'searchname':'sleeper','count':sleeperCnt[0].count,'type':'SLEEPER','selected':selectedClasses.includes("sleeper")});
	values.push({'searchname':'ac','count':ac.length,'type':'AC','selected':selectedClasses.includes("ac")});
	values.push({'searchname':'nonAC','count':nonAC.length,'type':'NON AC','selected':selectedClasses.includes("nonAC")});

 	break;
	case 'ac': 

        values.push({'searchname':'seater','count':seater.length,'type':'SEATER','selected':selectedClasses.includes("seater")});
	values.push({'searchname':'sleeper','count':sleeper.length,'type':'SLEEPER','selected':selectedClasses.includes("sleeper")});
	values.push({'searchname':'ac','count':acCnt[0].count,'type':'AC','selected':selectedClasses.includes("ac")});
	values.push({'searchname':'nonAC','count':nonacCnt[0].count,'type':'NON AC','selected':selectedClasses.includes("nonAC")});

	break;		
	case 'nonAC': 
        values.push({'searchname':'seater','count':seater.length,'type':'SEATER','selected':selectedClasses.includes("seater")});
	values.push({'searchname':'sleeper','count':sleeper.length,'type':'SLEEPER','selected':selectedClasses.includes("sleeper")});
	values.push({'searchname':'ac','count':acCnt[0].count,'type':'AC','selected':selectedClasses.includes("ac")});
	values.push({'searchname':'nonAC','count':nonacCnt[0].count,'type':'NON AC','selected':selectedClasses.includes("nonAC")});

	break;
	}
}else   if(firstSelected.length > 1){

        switch (firstSelected[0]) { 
	case 'seater': 
	values.push({'searchname':'seater','count':seaterCnt[0].count,'type':'SEATER','selected':selectedClasses.includes("seater")});
	values.push({'searchname':'sleeper','count':sleeperCnt[0].count,'type':'SLEEPER','selected':selectedClasses.includes("sleeper")});

        var checkcntSeater=selectedClasses.includes("seater") +selectedClasses.includes("ac")+selectedClasses.includes("nonAC");

	if(checkcntSeater == 2) {
	values.push({'searchname':'ac','count':acCnt[0].count,'type':'AC','selected':selectedClasses.includes("ac")});
	values.push({'searchname':'nonAC','count':nonacCnt[0].count,'type':'NON AC','selected':selectedClasses.includes("nonAC")});
        }else{
	values.push({'searchname':'ac','count':ac.length,'type':'AC','selected':selectedClasses.includes("ac")});
	values.push({'searchname':'nonAC','count':nonAC.length,'type':'NON AC','selected':selectedClasses.includes("nonAC")});
        }


 	break;
	case 'sleeper': 
	values.push({'searchname':'seater','count':seaterCnt[0].count,'type':'SEATER','selected':selectedClasses.includes("seater")});
	values.push({'searchname':'sleeper','count':sleeperCnt[0].count,'type':'SLEEPER','selected':selectedClasses.includes("sleeper")});

  	var checkcntSleeper=selectedClasses.includes("sleeper") +selectedClasses.includes("ac")+selectedClasses.includes("nonAC");

	if(checkcntSleeper == 2) {
	values.push({'searchname':'ac','count':acCnt[0].count,'type':'AC','selected':selectedClasses.includes("ac")});
	values.push({'searchname':'nonAC','count':nonacCnt[0].count,'type':'NON AC','selected':selectedClasses.includes("nonAC")});
        }else{
	values.push({'searchname':'ac','count':ac.length,'type':'AC','selected':selectedClasses.includes("ac")});
	values.push({'searchname':'nonAC','count':nonAC.length,'type':'NON AC','selected':selectedClasses.includes("nonAC")});
        }

 	break;
	case 'ac': 
	var checkcntAc=selectedClasses.includes("ac") +selectedClasses.includes("seater")+selectedClasses.includes("sleeper");
	if(checkcntAc == 2) {
	values.push({'searchname':'seater','count':seaterCnt[0].count,'type':'SEATER','selected':selectedClasses.includes("seater")});
	values.push({'searchname':'sleeper','count':sleeperCnt[0].count,'type':'SLEEPER','selected':selectedClasses.includes("sleeper")});
        }else{
	values.push({'searchname':'seater','count':seater.length,'type':'SEATER','selected':selectedClasses.includes("seater")});
	values.push({'searchname':'sleeper','count':sleeper.length,'type':'SLEEPER','selected':selectedClasses.includes("sleeper")});
        }

	values.push({'searchname':'ac','count':acCnt[0].count,'type':'AC','selected':selectedClasses.includes("ac")});
	values.push({'searchname':'nonAC','count':nonacCnt[0].count,'type':'NON AC','selected':selectedClasses.includes("nonAC")});

	break;		
	case 'nonAC': 

	var checkcntNonAc=selectedClasses.includes("nonAC") +selectedClasses.includes("seater")+selectedClasses.includes("sleeper");
	if(checkcntNonAc == 2) {
	values.push({'searchname':'seater','count':seaterCnt[0].count,'type':'SEATER','selected':selectedClasses.includes("seater")});
	values.push({'searchname':'sleeper','count':sleeperCnt[0].count,'type':'SLEEPER','selected':selectedClasses.includes("sleeper")});
        }else{
	values.push({'searchname':'seater','count':seater.length,'type':'SEATER','selected':selectedClasses.includes("seater")});
	values.push({'searchname':'sleeper','count':sleeper.length,'type':'SLEEPER','selected':selectedClasses.includes("sleeper")});
        }
	values.push({'searchname':'ac','count':acCnt[0].count,'type':'AC','selected':selectedClasses.includes("ac")});
	values.push({'searchname':'nonAC','count':nonacCnt[0].count,'type':'NON AC','selected':selectedClasses.includes("nonAC")});

	break;
	
       }

      }else{
	values.push({'searchname':'seater','count':seater.length,'type':'SEATER','selected':selectedClasses.includes("seater")});
	values.push({'searchname':'sleeper','count':sleeper.length,'type':'SLEEPER','selected':selectedClasses.includes("sleeper")});
	values.push({'searchname':'ac','count':ac.length,'type':'AC','selected':selectedClasses.includes("ac")});
	values.push({'searchname':'nonAC','count':nonAC.length,'type':'NON AC','selected':selectedClasses.includes("nonAC")});
      }


	return values;
}


getBusTypesFilter(value: any,selectedClasses: any){
 var ac = [];
 var nonAC = [];
 var seater = [];
 var sleeper = [];
 var values = [];
	for (let val of value) {
         if(val.availableSeats > 0 ){
	if(val.ac==true) ac.push('ac');
	if(val.nonAC==true) nonAC.push('nonAC');
	if(val.seater==true) seater.push('Seater');
	if(val.sleeper==true) sleeper.push('Sleeper');
	}
        }
	if(seater.length > 0) 
         values.push({'searchname':'seater','count':seater.length,'type':'SEATER','selected':selectedClasses.includes("seater")});
        else
        values.push({'searchname':'seater','count':0,'type':'SEATER','selected':selectedClasses.includes("seater")});

	if(sleeper.length > 0) 
         values.push({'searchname':'sleeper','count':sleeper.length,'type':'SLEEPER','selected':selectedClasses.includes("sleeper")});
         else 
         values.push({'searchname':'sleeper','count':0,'type':'SLEEPER','selected':selectedClasses.includes("sleeper")});


	if(ac.length > 0) 
         values.push({'searchname':'ac','count':ac.length,'type':'AC','selected':selectedClasses.includes("ac")});
         else 
         values.push({'searchname':'ac','count':0,'type':'AC','selected':selectedClasses.includes("ac")});


	if(nonAC.length > 0) 
         values.push({'searchname':'nonAC','count':nonAC.length,'type':'NON AC','selected':selectedClasses.includes("nonAC")});
	 else 
        values.push({'searchname':'nonAC','count':0,'type':'NON AC','selected':selectedClasses.includes("nonAC")});
	
	return values;
}


getBoardingpoints(value: any,boarddrop: any){
// console.log(value);
 var values = [];
 var values1 = [];
	for (let val of value) {
		if(val.availableSeats > 0)
		for(let bt of val[boarddrop]){
			if (bt.boardingPointId instanceof Array) {
			   for (let ttype of val.boardingPointId) 
				values.push({'boardingPointId':ttype,'address':bt.address,'boardingPointName':bt.boardingPointName.trim(),'selected':false});
			} else {
			 values.push({'boardingPointId':bt.boardingPointId,'address':bt.address,'boardingPointName':bt.boardingPointName.trim(),'selected':false});
			}

		}
	}


	for (let val of values) {
		let index = values.filter(e => e.boardingPointName === val.boardingPointName); 
		values1.push({'boardingPointId':val.boardingPointId,'address':val.address,'boardingPointName':val.boardingPointName.trim(),'total':index.length,'selected':false});
	}

//console.log(values);
    // Remove the duplicate elements
  	var prev = {};
	var filteredData = values1.filter( function(arr) {
	  var key = arr.boardingPointName;
	  if (prev[key])
	    return false;
	  return (prev[key] = true);
	});

    filteredData.sort(function(a, b){
		var nameA=a.boardingPointName.toLowerCase(), nameB=b.boardingPointName.toLowerCase()
		//console.log(nameA); console.log('---'+nameB);
    if (nameA < nameB) return -1; 
	if (nameA > nameB) return 1;
	
    return 0 //default return value (no sorting)
		});
    return filteredData;
}

 bustiming(startDate: any) {
	var ms=moment(startDate,"YYYY-MM-DDTHH:mm:ss");
	return ms;
}

sortfare(items: any){
	var filteredData = items;
	filteredData.sort(function(a, b){return a.totalFare-b.totalFare});
    return filteredData[0].totalFare;
}

//Separating Lower and Upper Decks
getBusDecks(items: any,mobile){ 

	var values:any = [];
	var UD = [];
	var LD = [];
	var pricesplit = [];
 
        var select1; var select2;

         if(mobile == true){ select1='row'; select2='column'; }else{select1='column'; select2='row';}


	var Lower = items.filter(a => { return a.zIndex==0 });
	var Upper = items.filter(a => { return a.zIndex==1 });


	var splitPrice= items.reduce(function(result, current) {
	if(current.available==true){
	result[current.baseFare] = result[current.baseFare] || [];
	result[current.baseFare].push(current);
	}
	return result;
	}, {});

	for (let key in splitPrice) {
	let value = splitPrice[key];
	pricesplit.push({'seattotal':value.length,'fare':parseInt(key), 'actfare':key});
	}

	Lower.sort(function (a, b) {
	return a[select1]-b[select1];
	});

	Upper.sort(function (a, b) {
	return a[select1]-b[select1];
	});



	var LowerLD= Lower.reduce(function(result, current) {
	result[current[select2]] = result[current[select2]] || [];
	result[current[select2]].push(current);
	return result;
	}, []);

	var UpperLD= Upper.reduce(function(result, current) {
	result[current[select2]] = result[current[select2]] || [];
	result[current[select2]].push(current);
	return result;
	}, []);
 


     var maxLower= Lower.reduce((max, p) => p[select1] > max ? p[select1] : max, Lower[0][select1]);
    var maxLowerEmpty= maxLower;

 if(mobile == true){
 if(Lower[0]['row'] !=0){maxLowerEmpty=maxLower-1;}
}

    for(let i=0; i < LowerLD.length; i++){
      if (typeof LowerLD[i] === "undefined") {
        var tmpLd = [];
	for(let j=0; j <= maxLowerEmpty; j++){
	  tmpLd.push([]);
	
	}
         if(i!=0)
 	LD.push(tmpLd);
      }else{

	var tmpLd = [];
	for(let j=0; j <= maxLower; j++){
	    var f=LowerLD[i].filter(a => {  if (typeof a === "undefined") { return []; }else {return a[select1]==j;} });
	   if (f.length > 0)  {  
		f[0].seattype = 'noseat'; f[0].newseattype = '';
		if(f[0].available == false)f[0].seattype = 'booked';
		if(f[0].available == true){ f[0].seattype = 'available'; f[0].newseattype = 'selected'  }
		if(f[0].ladiesSeat == true) f[0].seattype = f[0].seattype+'Ladies';
			
		var seat = '';
		if(f[0].length == 1 && f[0].width == 1)  var seat = 'Seat'; 
		else if(f[0].length == 2 && f[0].width == 1) var seat = 'Sleeper'; 	
		else if(f[0].length == 1 && f[0].width == 2) var seat = 'SleeperV'; 
		
		f[0].seattype = f[0].seattype+seat;
		f[0].newseattype = f[0].newseattype+seat;


		tmpLd.push(f[0]);
		} else { 
 		if(mobile == true){
                 if(j !=0)
		 tmpLd.push([]);
                }else{
 		tmpLd.push([]);
               }
	     }
	 }
	  LD.push(tmpLd);

      }
     }


if(Upper.length > 0) {
	var maxUpper= Upper.reduce((max, p) => p[select1] > max ? p[select1] : max, Upper[0][select1]);
	var maxUpperEmpty= maxUpper;


	if(mobile == true){
	if(Upper[0]['row'] !=0){maxUpperEmpty=maxUpper-1;}
	}
    for(let i=0; i < UpperLD.length; i++){
      if (typeof UpperLD[i] === "undefined") {
        var tmpUd = [];
	for(let j=0; j <= maxUpperEmpty; j++){
	  tmpUd.push([]);
	
	}
        if(i!=0)
 	UD.push(tmpUd);
      }else{

	var tmpUd = [];
	for(let j=0; j <= maxUpper; j++){
	    var f=UpperLD[i].filter(a => {  if (typeof a === "undefined") { return []; }else {return a[select1]==j;} });
	   if (f.length > 0)  { 
f[0].seattype = 'noseat'; f[0].newseattype = '';
		if(f[0].available == false)f[0].seattype = 'booked';
		if(f[0].available == true){ f[0].seattype = 'available'; f[0].newseattype = 'selected'  }
		if(f[0].ladiesSeat == true) f[0].seattype = f[0].seattype+'Ladies';
			
		var seat = '';
		if(f[0].length == 1 && f[0].width == 1)  var seat = 'Seat'; 
		else if(f[0].length == 2 && f[0].width == 1) var seat = 'Sleeper'; 	
		else if(f[0].length == 1 && f[0].width == 2) var seat = 'SleeperV'; 
		
		f[0].seattype = f[0].seattype+seat;
		f[0].newseattype = f[0].newseattype+seat;
 
		tmpUd.push(f[0]);
		} else { 
               if(mobile == true){
                 if(j !=0)
		 tmpUd.push([]);
                }else{
 		tmpUd.push([]);
               }
	     }
	 }
	  UD.push(tmpUd);

      }
     }
  }
  // console.log(UpperLD);
//console.log(UD);


	values={
		'LowerDesk':LD,
		'UpperDesk':UD,
		'pricesplit':pricesplit
	};

	return values;

}

seatdetails(value: any){
 var seats = [];
 var totalseats = 1;
 var seatfaretotal:any=[];
 var selseats = '';
 var newarray = [];
 var arrcnt = -1;
 var test_array=[1,2,3];
//console.log(seats);
	for (let val of value) {
		var fare = Math.round(val.fare * 100);
		if(!seats[fare]){
		    seats[fare] = [];
		    arrcnt++;
		  }
		seats[fare]['arrcnt'] = arrcnt; 
		seats[fare]['fare'] = val.fare;
		seats[fare]['baseFare'] = val.baseFare;		//console.log(arrcnt); 
		seats[fare]['serviceTaxAbsolute'] = val.serviceTaxAbsolute;
		if(seats[fare]['selseats'] != undefined){
				seats[fare]['selseats'] = val.name+","+seats[fare]['selseats'];
				seats[fare]['totalseats'] = totalseats + parseInt(seats[fare]['totalseats']); 
				//seats[fare]['seatfaretotal'] = parseInt(fare) + parseInt(seats[fare]['seatfaretotal']); 
				seats[fare]['seatfaretotal'] = (val.fare) + (seats[fare]['seatfaretotal']); 
				seats[fare]['totalbaseFare'] = (val.baseFare) + (seats[fare]['totalbaseFare']);
				seats[fare]['totalServTax'] = (val.serviceTaxAbsolute) + (seats[fare]['totalServTax']);
				newarray[fare] = seats[fare];
		}else{ 
     		if(arrcnt != 0 || arrcnt == 0){
          seats[fare]['selseats'] = val.name;             
        }else{                          
          seats[fare]['selseats'] = val.name+",";
        }
			//seats[fare]['selseats'] = val.name; 
			//seats[fare]['seatfaretotal'] = parseInt(fare);
			seats[fare]['seatfaretotal'] = (val.fare);
			seats[fare]['totalbaseFare'] =  (val.baseFare);
			seats[fare]['totalServTax'] = (val.serviceTaxAbsolute);
			seats[fare]['totalseats'] = totalseats;
			seats[fare]['test_array'] = test_array;
			newarray[fare] = seats[fare];
			}
	}
return newarray;
}


getBusOperators(value: any){
	
	var values = [];
	   for (let val of value) {
			let index = value.filter(e => e.travels.toLowerCase().trim() === val.travels.toLowerCase().trim() && val.availableSeats > 0); 
			values.push({'operator':val.operator,'name':val.travels,'total':index.length,'selected':false});
		}

		var prev = {};
		var filteredData = values.filter( function(arr) {
			var key = (arr.operator+arr.name).toLowerCase().trim();
		  if (prev[key])
			return false;
		  return (prev[key] = true);
		});
	
		filteredData.sort(function(a, b){return a.operator-b.operator});

		return filteredData;
   }

   getamenities(value:any){
	var values = [];
	var allamen = []; 
	for (let val of value) {
		if(val['amenities'] != null){
		var amenities = val['amenities'].split(','); 

		for(let bt of amenities){
				if(bt != ''){
				let index = values.filter(e => e.amenities === bt); 
				values.push({'amenities':bt,'total':index.length,'selected':false});
			}
		}
		}

	}
	for(let ind of values){
		let index = values.filter(e => e.amenities === ind.amenities); 
		allamen.push({'amenities':ind.amenities,'total':index.length,'selected':false});
	}
//console.log(values); 
//console.log(values);
    // Remove the duplicate elements
  	var prev = {};
	var filteredData = allamen.filter( function(arr) {
	  var key = arr.amenities;
	  if (prev[key])
	    return false;
	  return (prev[key] = true);
	});

    filteredData.sort(function(a, b){return a.amenities-b.amenities});
    return filteredData;

   }

   search(input,filtereditems,searchkey){

	filtereditems=  filtereditems.filter(a => {
		var nameA=a[searchkey].toLowerCase(), input1=input.toLowerCase()
		return input1.length ? nameA.search(input1) != -1 : filtereditems
	});
	return filtereditems;
   }

reversearray(items:any){
	var values:any = [];
	for(let val of items){
		values.push(val.reverse());
	}
return values;

}

getrtc(rtc){
	var returnrtc=[];
	var timearr:string[] = [];
	for(let val of rtc){
		var travels1 = val.travels.toLowerCase();
		var travels = travels1.trim();
		// console.log(travels)

		var depTime = 	val.departureTime;

		if(!returnrtc[travels] && !returnrtc[depTime]){
			returnrtc[travels] = [];
		  }
			val.lowercase = travels;

			returnrtc[travels].push(val);
	}
	return returnrtc;
	}

getBoarding(boardingTimes,departureTime){
   let res= boardingTimes.filter(g => {
  return this.converttime(g.time)==departureTime ; });
  if(res.length> 0)
  return res[0]['location'];
  else
  return '';

}

getDropping(droppingTimes,arrivalTime){

   let res1= droppingTimes.filter(g => {
  return this.converttime(g.time)==arrivalTime ; });

  if(res1.length> 0)
  return res1[0]['location'];
  else
  return '';

}

 converttime(time){
      var hr = Math.floor(time / 60);
      if(hr > 23) var hrs = '0'+(hr - 24);  else hrs = hr+''; 
      var min = String(time -   Math.floor(time / 60) * 60); 
      if(min.length == 1){var vmin = ':0'+min; } 
      else {var vmin = ':'+min; } 
      var hrm = this.leftPad(hrs,2) + this.leftPad(vmin,0); 
      return hrm; 
  }
leftPad(value, length) { 
    return ('0'.repeat(length) + value).slice(-length); 
}


}
