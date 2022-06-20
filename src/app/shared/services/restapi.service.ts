import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse,HttpParams } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, catchError, tap ,shareReplay} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import { Location } from '@angular/common';
const MAIN_SITE_URL = environment.MAIN_SITE_URL; 
const LOCALJSON = environment.LOCALJSON;
import { SimpleGlobal } from 'ng2-simple-global';

const config = {
headers : {
    'Content-Type': 'application/x-www-form-urlencoded'
}
}


@Injectable({
  providedIn: 'root'
})
export class RestapiService {
  endpoint:any;domainName:any;domainPath:any;
  constructor(private http: HttpClient,private location:Location,private sg: SimpleGlobal) { 
  	let urlToSplit =this.location.path();
	let unification =urlToSplit.split("/");

	switch (unification[1]) {
	case ('diners'):
        this.domainName='DINERS';
         this.domainPath="diners/";
	break;
	case ('infinia'):
        this.domainName='INFINIA';
          this.domainPath="infinia/";
	break;
	case ('regalia'):
        this.domainName='REGALIA';
          this.domainPath="regalia/";
	break;
	case ('corporate'):
        this.domainName='CORPORATE';
          this.domainPath="corporate/";
	break;
	case ('business'):
        this.domainName='BUSINESS';
          this.domainPath="business/";
	break;
	default:
        this.domainName='SMARTBUY';
        this.domainPath="";
	break;
	}
  
  this.endpoint = environment.API_URL[this.domainName];
  
  
  }
  
  impMessage (param): Observable<any> {
   if(LOCALJSON=='true'){
     return this.http.get('assets/data/impMessage.json');
   }else{
	return this.http.post( this.endpoint+'impMessage',param, config).pipe(map((response: any) => response));
    }
 } 

  checkCsrfAuth (param:any):Observable<any> {
    if(LOCALJSON=='true'){
      return this.http.get('assets/data/checckcsrf.json');
    }else{

	return this.http.post(MAIN_SITE_URL+this.domainPath+'check-csrf-with-auth',param, config).pipe(map((response: any) => response));
    }
  }
  getDealsOffers ():Observable<any> {
    if(LOCALJSON=='true'){
      return this.http.get('assets/data/getDealsandoffers.json');
  }  else{
    return this.http.post(this.endpoint+'getDealsandoffers', config).pipe(map((response: any) => response));
  }
  }

  getVouchersList ():Observable<any> {
      return this.http.get('assets/data/voucherslist.json');
  }
  
    verifyDomain ():Observable<any> {
          
        let headers =  {headers: new  HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded'}),  withCredentials: true};
        
     //if(LOCALJSON=='true'){
     // return this.http.get('assets/data/verifyDomain.json');
    // }  else{
    return this.http.post(environment.SUB_SITE_URL+'api/verifyDomain', headers ).pipe(map((response: any) => response));
   // }
  }
 setCookieConsent (param): Observable<any> {
   return this.http.post( this.endpoint+'setCookieConsent',param, config).pipe(map((response: any) => response));
 }

 trackEvents (param): Observable<any> {
   return this.http.post( this.endpoint+'trackEvents',param, config).pipe(map((response: any) => response));
 }

 getNotification (): Observable<any> {
   return this.http.post( this.endpoint+'getnotification','', config).pipe(map((response: any) => response));
 }
 getNotificationPopup (): Observable<any> {
   return this.http.post( this.endpoint+'getnotificationPopup','', config).pipe(map((response: any) => response));
 }

  arr=[];
  private carddetails = new BehaviorSubject(this.arr);
  cartDetails = this.carddetails.asObservable();
  updateCardDetails(message:any) {
    this.carddetails.next(message)
  }
  // Do this instead:
getupdateCardDetails(): Observable<any> {  
  return this.carddetails.asObservable();
}

 
  getBanner (param): Observable<any> {
   if(LOCALJSON=='true'){
     return this.http.get('assets/data/foryou_top_banner.json');
   }else{
	return this.http.post( this.endpoint+'getBanners',param, config).pipe(map((response: any) => response));
    }
 }
  getShoopingProducts (param): Observable<any> {
   if(LOCALJSON=='true'){
     return this.http.get('assets/data/getShoopingProducts.json');
   }else{
	return this.http.post( this.endpoint+'getShoopingProducts',param, config).pipe(map((response: any) => response));
    }
 }
 
   getDeals (param): Observable<any> {
   if(LOCALJSON=='true'){
     return this.http.get('assets/data/getDeals.json');
   }else{
	return this.http.post( this.endpoint+'getDeals',param, config).pipe(map((response: any) => response));
    }
 }

}
