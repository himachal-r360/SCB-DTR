import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap ,shareReplay} from 'rxjs/operators';
import {AppConfig} from '../../configs/app.config';
import {getTrains} from '../../shared/interfaces/getTrains';
//import { URLSearchParams } from '@angular/http';
import {getTrainFare} from '../../shared/interfaces/getTrainFare';
import {fareEnqueryMultiplePassengers} from '../../shared/interfaces/fareEnqueryMultiplePassengers';
import {irctcUserStatus} from '../../shared/interfaces/irctcUserStatus';
import {environment} from '../../../environments/environment';
import { Location } from '@angular/common';
import { SimpleGlobal } from 'ng2-simple-global';
import { AppConfigService } from 'src/app/app-config.service';

const hammock = AppConfig.HAMMOCK;
const MAIN_SITE_URL = environment.MAIN_SITE_URL;
const LOCALJSON = environment.LOCALJSON;


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token',
    'charset':'utf-8'
    
  })
};

const config = {
  headers : {
      'Content-Type': 'application/x-www-form-urlencoded'
  }
}

@Injectable({
  providedIn: 'root'
})
export class IrctcApiService {
  private cache$: Observable<Array<any>>;
  endpoint;
  endpoint_irctc;
  domainName;
  hammockUrl;
  serviceSettings;
  constructor(private http: HttpClient,private location:Location,private sg: SimpleGlobal,private appConfigService:AppConfigService) { 
let urlToSplit =this.location.path();
	let unification =urlToSplit.split("/");

	switch (unification[1]) {
	case ('diners'):
        this.domainName='DINERS';
	break;
	case ('infinia'):
        this.domainName='INFINIA';
	break;
	case ('regalia'):
        this.domainName='REGALIA';
	break;
	case ('corporate'):
        this.domainName='CORPORATE';
	break;
	case ('business'):
        this.domainName='BUSINESS';
	break;
	default:
        this.domainName='SMARTBUY';
	break;
	}

  this.endpoint = environment.API_URL[this.domainName];
  this.endpoint_irctc = environment.API_URL_IRCTC[this.domainName];

  this.serviceSettings=this.appConfigService.getConfig();
  this.hammockUrl = this.serviceSettings.HAMMOCK_URL;
  
  }

  getTrains (param): Observable<getTrains> {

      if(LOCALJSON=='true'){
    return this.http.get('assets/data/trainBwStns.json').pipe(map((response: any) => response));
     }else if(hammock=='true'){
	return this.http.post(this.hammockUrl+'trainBwStns', param, config).pipe(map((response: any) => response));
     }else{
     return this.http.post(this.endpoint+'enquiry/trainBwStnsNew', param, config).pipe(map((response: any) => response));
     } 
  }

  getTrainFare (param): Observable<getTrainFare> {
   if(LOCALJSON=='true'){
     return this.http.get('assets/data/fareEnquery.json').pipe(map((response: any) => response));
    }else if(hammock=='true'){
	return this.http.post(this.hammockUrl+'fareEnquery', param, config).pipe(map((response: any) => response));
     }else{
      return this.http.post(this.endpoint+'enquiry/fareEnquery', param, config).pipe(map((response: any) => response));
     }
  }

  fareEnqueryMultiplePassengers (param): Observable<fareEnqueryMultiplePassengers> {
    if(LOCALJSON=='true'){
     return this.http.get('assets/data/fareEnqueryMultiplePassengersResponse.json').pipe(map((response: any) => response));
    }else if(hammock=='true'){
	return this.http.post(this.hammockUrl+'fareEnqueryMultiplePassengers', param, config).pipe(map((response: any) => response));
     }else{
  	return this.http.post(this.endpoint+'enquiry/fareEnqueryMultiplePassengers', param, config).pipe(map((response: any) => response));
     }
  }


isIRCTCUser(param): Observable<irctcUserStatus> {
     if(LOCALJSON=='true'){
        return this.http.get('assets/data/isIRCTCUser.json').pipe(map((response: any) => response));
        //    }else if(hammock=='true'){
        // return this.http.post(this.hammockUrl+'userStatus', param, config).pipe(map((response: any) => response));
     }else{
        return this.http.post(this.endpoint_irctc+'trains/user/userStatus', param, config).pipe(map((response: any) => response));
     }
 }
 checkUsername(param): Observable<irctcUserStatus> {
  if(LOCALJSON=='true'){
     return this.http.get('assets/data/checkUsername.json').pipe(map((response: any) => response));
     //    }else if(hammock=='true'){
     // return this.http.post(this.hammockUrl+'userStatus', param, config).pipe(map((response: any) => response));
  }else{
     return this.http.post(this.endpoint_irctc+'trains/user/checkUsername', param, config).pipe(map((response: any) => response));
  }
}

findPin(param): Observable<irctcUserStatus> {
  if(LOCALJSON=='true'){
     return this.http.get('assets/data/pin.json').pipe(map((response: any) => response));
     //    }else if(hammock=='true'){
     // return this.http.post(this.hammockUrl+'userStatus', param, config).pipe(map((response: any) => response));
  }else{
     return this.http.post(this.endpoint_irctc+'trains/user/pin', param, config).pipe(map((response: any) => response));
  }
}
findCity(param): Observable<irctcUserStatus> {
  if(LOCALJSON=='true'){
     return this.http.get('assets/data/city.json').pipe(map((response: any) => response));
     //    }else if(hammock=='true'){
     // return this.http.post(this.hammockUrl+'userStatus', param, config).pipe(map((response: any) => response));
  }else{
     return this.http.post(this.endpoint_irctc+'trains/user/pin', param, config).pipe(map((response: any) => response));
  }
}

findpost(param): Observable<irctcUserStatus> {
  if(LOCALJSON=='true'){
    return this.http.get('assets/data/post.json').pipe(map((response: any) => response));
    //    }else if(hammock=='true'){
    // return this.http.post(this.hammockUrl+'userStatus', param, config).pipe(map((response: any) => response));
 }else{
    return this.http.post(this.endpoint_irctc+'trains/user/pin', param, config).pipe(map((response: any) => response));
 }
}

userRegister(param): Observable<irctcUserStatus> {
  if(LOCALJSON=='true'){
     return this.http.get('assets/data/userRegister.json').pipe(map((response: any) => response));
     //    }else if(hammock=='true'){
     // return this.http.post(this.hammockUrl+'userStatus', param, config).pipe(map((response: any) => response));
  }else{
     return this.http.post(this.endpoint_irctc+'trains/user/userRegister', param, config).pipe(map((response: any) => response));
  }
}
forgotDetails(param): Observable<irctcUserStatus> {
  if(LOCALJSON=='true'){
     return this.http.get('assets/data/forgotDetails.json').pipe(map((response: any) => response));
     //    }else if(hammock=='true'){
     // return this.http.post(this.hammockUrl+'userStatus', param, config).pipe(map((response: any) => response));
  }else{
     return this.http.post(this.endpoint_irctc+'trains/user/forgotDetails', param, config).pipe(map((response: any) => response));
  }
}

forgotPassword(param): Observable<irctcUserStatus> {
  if(LOCALJSON=='true'){
     return this.http.get('assets/data/forgotPassword.json').pipe(map((response: any) => response));
     //    }else if(hammock=='true'){
     // return this.http.post(this.hammockUrl+'userStatus', param, config).pipe(map((response: any) => response));
  }else{
     return this.http.post(this.endpoint_irctc+'trains/user/forgotDetails', param, config).pipe(map((response: any) => response));
  }
}

verifyOTP(param): Observable<irctcUserStatus> {
  if(LOCALJSON=='true'){
     return this.http.get('assets/data/verifyOTP.json').pipe(map((response: any) => response));
     //    }else if(hammock=='true'){
     // return this.http.post(this.hammockUrl+'userStatus', param, config).pipe(map((response: any) => response));
  }else{
     return this.http.post(this.endpoint_irctc+'trains/user/verifyOTP', param, config).pipe(map((response: any) => response));
  }
}
newsandalert(): Observable<irctcUserStatus> {
  if(LOCALJSON=='true'){
     return this.http.get('assets/data/newsandalert.json').pipe(map((response: any) => response));
     //    }else if(hammock=='true'){
     // return this.http.post(this.hammockUrl+'userStatus', param, config).pipe(map((response: any) => response));
  }else{
     return this.http.post(this.endpoint_irctc+'trains/user/newsandalert', config).pipe(map((response: any) => response));
  }
}

isCardValid(param): Observable<any> {
    if(LOCALJSON=='true'){
 	return this.http.get('assets/data/isCardValid.json').pipe(map((response: any) => response));
     }else{
  	return this.http.post(MAIN_SITE_URL +this.sg['domainPath']+'card_validate', param, config).pipe(map((response: any) => response));
     }
 }

private handleError<T> (operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {

    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead

    // TODO: better job of transforming error for user consumption
    console.log(`${operation} failed: ${error.message}`);

    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}

getPnr(param): Observable<any> {
  if(LOCALJSON=='true')
  return this.http.get('assets/data/pnrEnquiry.json?version='+new Date().getTime());
  else
  return this.http.post(this.endpoint_irctc+'enquiry/pnrEnquiry', param, config).pipe(map((response: any) => response));
}
/*--------Boarding station API--------*/
getBoardingStations(param): Observable<any> {
  if(LOCALJSON=='true'){
    return this.http.get('assets/data/boardingStations.json').pipe(map((response: any) => response));
  }
  else{
    return this.http.post(this.endpoint_irctc+'trains/enquiry/boardingStations', param, config).pipe(map((response: any) => response));
  }
}
/*---------END-----*/

/*------trainSchedule--------*/
trainSchedlueDto(param){
    if(LOCALJSON=='true'){
      return this.http.get('assets/data/trainSchedule.json').pipe(map((response:any) => response));
    }
    else{
      return this.http.post(this.endpoint_irctc+'trains/enquiry/trainSchedule', param, config).pipe(map((response:any) => response));
    }
}
/*----END------------*/

/*------fareEnquiry API--------*/
fareEnquiry(param){
  if(LOCALJSON=='true'){
    return this.http.get('assets/data/fareEnquiry.json').pipe(map((response:any) => response));
  }
  else{
    return this.http.post(this.endpoint_irctc+'trains/enquiry/fareEnquiry', param, config).pipe(map((response:any) => response));
  }
}
/*----END------------*/

/*------fareEnquiry API--------*/
countryList(){
  //if(LOCALJSON=='true'){
    return this.http.get(environment.cdnUrl+'data/country.json').pipe(map((response:any) => response));
 // }
 // else{
 //   return this.http.post(this.endpoint_irctc+'trains/user/country', config).pipe(map((response:any) => response));
 // }
}
/*----END------------*/

/*------fareEnquiryForMultiplePassngers API--------*/
fareEnquiryMultiplePassengers(param){
  if(LOCALJSON=='true'){
    return this.http.get('assets/data/fareEnquiryResponse.json').pipe(map((response:any) => response));
  }
  else{
    return this.http.post(this.endpoint_irctc+'trains/enquiry/fareEnquiryMultiplePassengers', param, config).pipe(map((response:any) => response));
  }
}
/*----END------------*/

  saveCheckout (param): Observable<any> {
    return this.http.post(this.endpoint+'saveCheckoutTrain', param, config).pipe(map((response: any) => response));
  }
  getOTP(param): Observable<any>{
    if(LOCALJSON=='true'){
      return this.http.get('assets/data/getSmsEmailOTP.json').pipe(map((response: any) => response));
   }else{
      return this.http.post(this.endpoint_irctc+'trains/user/getSMSEmailOTP', param, config).pipe(map((response: any) => response));
   }
 }
 gettdrDetails(param): Observable<any>{
   if(LOCALJSON=='true'){
     return this.http.get('assets/data/tdr.json').pipe(map((response: any) => response));
   }else{
     return this.http.post(this.endpoint_irctc+'trains/booking/transactionTDRDetails', param, config).pipe(map((response: any) => response));
   }
 }
 tdrReequestDTO(param): Observable<any>{
  if(LOCALJSON=='true'){
    return this.http.get('assets/data/tdrResponse.json').pipe(map((response: any) => response));
  }else{
    return this.http.post(this.endpoint_irctc+'trains/tdr/upload', param, config).pipe(map((response: any) => response));
  }
 }
 tdrhistory(param): Observable<any>{
  if(LOCALJSON=='true'){
    return this.http.get('assets/data/tdrhistory.json').pipe(map((response: any) => response));
  }else{
    return this.http.post(this.endpoint_irctc+'trains/tdr/tdrDetails', param, config).pipe(map((response: any) => response));
  
  }
 }

//  getPostOffice(param): Observable<any>{

//   if(LOCALJSON=='true'){
//     return this.http.get('assets/data/postOffice.json').pipe(map((response: any) => response));
//   }else{
//     return this.http.post(this.endpoint_irctc+'trains/user/pin', param, config).pipe(map((response: any) => response));
  
//   }
//  }

}
