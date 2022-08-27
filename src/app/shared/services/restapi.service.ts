import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse,HttpParams } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, catchError, tap ,shareReplay} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import { Location } from '@angular/common';
const MAIN_SITE_URL = environment.MAIN_SITE_URL; 
const LOCALJSON = environment.LOCALJSON;
const LOCALLOGIN = environment.LOCALLOGIN;

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
  get() {
    throw new Error('Method not implemented.');
  }
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
	case ('regalia_gold'):
        this.domainName='REGALIA GOLD';
          this.domainPath="regalia_gold/";
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
  
  if(LOCALLOGIN=='true'){
   return this.http.get('assets/data/checckcsrf.json');
  }else{
    if(LOCALJSON=='true'){
      return this.http.get('assets/data/checckcsrf.json');
    }else{

	return this.http.post(MAIN_SITE_URL+this.domainPath+'check-csrf-with-auth',param, config).pipe(map((response: any) => response));
    }
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

  getRegaliaGoldList ():Observable<any> {
    return this.http.get('assets/data/regalia_gold.json');
  }
  getMilestoneDetail (param:any):Observable<any> {
        if(LOCALJSON=='true'){
          return this.http.get('assets/data/milestone.json');
          //return this.http.post('http://offers.smartbuylocal.reward360.us/api/get_milestone_details',param, config).pipe(map((response: any) => response));
        }else{
          return this.http.post(this.endpoint+'get_milestone_details',param, config).pipe(map((response: any) => response));
        }
  }
  AvailablePoints(param){
      //console.log(param);
    //return this.http.post(this.endpoint+'availablepoints', param, config).pipe(map((response:any) => response));
    if(LOCALJSON=='true'){
      return this.http.get('assets/data/availablepoints.json').pipe(map((response:any) => response));
    }
    else{
      return this.http.post(this.endpoint+'availablepoints', param, config).pipe(map((response:any) => response));
    }
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
  if(LOCALJSON=='true'){
     return this.http.get('assets/data/getnotificationPopup.json');
   }else{
	return this.http.post( this.endpoint+'getnotificationPopup','', config).pipe(map((response: any) => response));
    }
   
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
 
   validateCoupon (param):Observable<any> {
    if(LOCALJSON=='true'){
      return this.http.get('assets/data/validateCoupon.json');
    }else{
	    return this.http.post( this.endpoint+'coupon/validateCoupon',param, config).pipe(map((response: any) => response));
    }
  }

  validateSBCoupon (param):Observable<any> {
    if(LOCALJSON=='true'){
      return this.http.get('assets/data/SBvalidateCoupon.json');
    }else{
	    return this.http.post( this.endpoint+'coupon/SBvalidateCoupon',param, config).pipe(map((response: any) => response));
    }
  }
  
  removeSBCoupon (param):Observable<any> {
    if(LOCALJSON=='true'){
      return this.http.get('assets/data/removeSBCoupon.json');
    }else{
	    return this.http.post( this.endpoint+'coupon/removeSBCoupon',param, config).pipe(map((response: any) => response));
    }
  }
    getCoupons (param):Observable<any> { 
    if(LOCALJSON=='true'){
      return this.http.get('assets/data/coupon.json');
    }else{
	return this.http.post( this.endpoint+'coupon/getCoupons',param, config).pipe(map((response: any) => response));
    }
  }
  getCustomertravellerInfo(param){
  if(LOCALJSON=='true'){
    return this.http.get('assets/data/getCustomertravellerInfo.json');
  }else{
    return this.http.post( this.endpoint+'getCustomertravellerInfo',param, config).pipe(map((response: any) => response));
  }
} 
  
saveCustomertravellerInfo(param){
  if(LOCALJSON=='true'){
    return this.http.get('assets/data/saveCustomertravellerInfo.json');
  }else{
    return this.http.post( this.endpoint+'saveCustomertravellerInfo',param, config).pipe(map((response: any) => response));
  }
} 

getCustomerGstDetails(param){
  if(LOCALJSON=='true'){
    return this.http.get('assets/data/getCustomerGstDetails.json');
  }else{
    return this.http.post( this.endpoint+'getCustomerGstDetails',param, config).pipe(map((response: any) => response));
  }
} 
  
saveCustomerGstDetails(param){
  if(LOCALJSON=='true'){
    return this.http.get('assets/data/saveCustomerGstDetails.json');
  }else{
    return this.http.post( this.endpoint+'saveCustomerGstDetails',param, config).pipe(map((response: any) => response));
  }
} 

checksavedtravellers(param){
  if(LOCALJSON=='true'){
    return this.http.get('assets/data/savedtravellerResponse.json');
  }
  else{
  return this.http.post( this.endpoint+'getCustomertravellerInfo',param, config).pipe(map((response: any) => response));
  }
} 

  isCardValid(param): Observable<any> {
    if(LOCALJSON=='true')
      return this.http.get('assets/data/isCardValid.json?version='+new Date().getTime());
     else
  	return this.http.post(MAIN_SITE_URL+ this.domainPath+'card_validate', param, config).pipe(map((response: any) => response));

 }
        createItinerary(param,type){
        if(LOCALJSON=='true'){
        if(type=='M')
         return this.http.get('assets/data/ItineraryResponseMulti.json');
         else
        return this.http.get('assets/data/ItineraryResponse.json');
        }
        else{
        return this.http.post( this.endpoint+'createItinerary',param, config).pipe(map((response: any) => response));
        }
} 
  IsDcemiEligible (param):Observable<any> {
    if(LOCALJSON=='true'){
      return this.http.get('assets/data/IsDcemiEligible.json');
    }else{
	return this.http.post( this.endpoint+'IsDcemiEligible',param, config).pipe(map((response: any) => response));
    }
  } 
  
  checkExistingCustomer (param):Observable<any> {
    if(LOCALJSON=='true'){
      return this.http.get('assets/data/checkExistingCustomer.json');
    }else{
	return this.http.post( this.endpoint+'checkExistingCustomer',param, config).pipe(map((response: any) => response));
    }
  }
  
  validateOTPDCEMI (param):Observable<any> {
    if(LOCALJSON=='true'){
      return this.http.get('assets/data/validateOTPDCEMI.json');
    }else{
	return this.http.post( this.endpoint+'validateOTPDCEMI',param, config).pipe(map((response: any) => response));
    }
  }
     getSaveCards (param):Observable<any> {
    if(LOCALJSON=='true'){
      return this.http.get('assets/data/get_pay_saved_cards.json');
    }else{
      return this.http.post( this.endpoint+'get_pay_saved_cards', param, config).pipe(map((response: any) => response));
    }
    
  }
    getCards(param){
  if(LOCALJSON=='true'){
    return this.http.get('assets/data/checckcsrf.json').pipe(map((response:any) => response));
  }else{
    return this.http.post(this.endpoint+'getcustomercard', param, config).pipe(map((response:any) => response));
  }
}
  
 getFlexipayDetails ():Observable<any> {
      return this.http.post(this.endpoint+'get-flexipay-details', config).pipe(map((response: any) => response));  
  }
  getCCEMIDetails ():Observable<any> {
    return this.http.post(this.endpoint+'get-ccemi-details', config).pipe(map((response: any) => response));
  }
  getDCEMIDetails ():Observable<any> {
    return this.http.post(this.endpoint+'get-dcemi-details', config).pipe(map((response: any) => response));
  }
    validatePGData (param):Observable<any> {
     if(LOCALJSON=='true'){
           return this.http.get('assets/data/validatePGData.json');
     }else{
     return this.http.post( this.endpoint+'validatePGDataFlight',param, config).pipe(map((response: any) => response));
     } 
     //return this.http.post( this.endpoint+'validatePGData',param, config).pipe(map((response: any) => response));
  }
   isFlexiPayEligible (param):Observable<any> {
  if(LOCALJSON=='true'){
    return this.http.get('assets/data/isflexipayeligible.json');
  }else{
return this.http.post( this.endpoint+'is_flexipay_eligible',param, config).pipe(map((response: any) => response));
  }
}
flexipayExistingCustomer(param):Observable<any>{
  if(LOCALJSON=='true'){
    return this.http.get('assets/data/flexipayexistingcustomer.json');
  }else{
return this.http.post( this.endpoint+'flexiPay_check_existingcustomer',param, config).pipe(map((response: any) => response));
  }
}
flexipayvalidateOTP(param){
  if(LOCALJSON=='true'){
    return this.http.get('assets/data/flexipayvalidateOTP.json');
  }else{
return this.http.post( this.endpoint+'validate_otp_flexiPay',param, config).pipe(map((response: any) => response));
  }
}

   saveCheckout (param): Observable<any> {
    if(LOCALJSON=='true'){
    return this.http.get('assets/data/saveCheckout.json');
  }else{
    return this.http.post(this.endpoint+'saveCheckoutFlight', param, config).pipe(map((response: any) => response));
    }
  }
  
   suggestHotels (param): Observable<any> {
    if(LOCALJSON=='true'){
     return this.http.get('assets/data/validatePGData.json');
   }else{
    return this.http.post(this.endpoint+'suggest_items', param, config).pipe(map((response: any) => response));
   }
  }
    getCouponsByService (param):Observable<any> { 
    if(LOCALJSON=='true'){
      return this.http.get('assets/data/getCouponsByService.json');
    }else{
	return this.http.post( this.endpoint+'getCouponsByService',param, config).pipe(map((response: any) => response));
    }
  }


  getOrderRetryDetails (param):Observable<any> { 
    if(LOCALJSON=='true'){
      return this.http.get('assets/data/getOrderRetryDetails.json');
    }else{
	return this.http.post( this.endpoint+'orderRetry',param, config).pipe(map((response: any) => response));
    }
  }


  
  getCancellationPolicy(param){
  if(LOCALJSON=='true'){
    return this.http.get('assets/data/getCancellationPolicy.json');
  }
  else{
  return this.http.post( this.endpoint+'farerules',param, config).pipe(map((response: any) => response));
  }
  } 

}
