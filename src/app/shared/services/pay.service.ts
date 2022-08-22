import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { AppConfig } from 'src/app/configs/app.config';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError, tap ,shareReplay } from 'rxjs/operators';
import { SimpleGlobal } from 'ng2-simple-global';

const CACHE_SIZE = 1;
const endpoint = environment.API_URL;
const MAIN_SITE_URL = environment.MAIN_SITE_URL;
const LOCALJSON = environment.LOCALJSON;

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
  })
};

const config1 = {
    headers : {
        'Content-Type': 'application/json'
    }
}
const config = {
  headers : {
      'Content-Type': 'application/x-www-form-urlencoded'
  }
  }
@Injectable({
  providedIn: 'root'
})
export class PayService {
  domainName;
  endpoint;
  private cache$: Observable<Array<any>>;
  constructor(private http: HttpClient,private location:Location,private sg: SimpleGlobal) { 

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
    break; }
    this.endpoint = environment.API_URL[this.domainName];
  }
  availablePoints(param){
      //console.log(param);
    //return this.http.post(this.endpoint+'availablepoints', param, config).pipe(map((response:any) => response));
    if(LOCALJSON=='true'){
      return this.http.get('assets/data/availablepoints.json').pipe(map((response:any) => response));
    }
    else{
      return this.http.post(this.endpoint+'availablepoints', param, config).pipe(map((response:any) => response));
    }
  }
  primaPointscheck(param){
    return this.http.get('assets/data/availablepoints.json').pipe(map((response:any) => response)); 
  }
  pointsRedemption(param){
    //return this.http.post(this.endpoint+'pointsredemption', param, config).pipe(map((response:any) => response));
    if(LOCALJSON=='true'){
      return this.http.get('assets/data/redeemPoints.json').pipe(map((response:any) => response));
    }else{
      return this.http.post(this.endpoint+'pointsredemption', param, config).pipe(map((response:any) => response));
    }
  }
  voucherRedemption(param){
    //console.log(param);
    //return this.http.post(this.endpoint+'voucherredemption', param, config).pipe(map((response:any) => response));
    if(LOCALJSON=='true'){
      return this.http.get('assets/data/voucherCheck.json').pipe(map((response:any) => response));
    }else{
      return this.http.post(this.endpoint+'voucherredemption', param, config).pipe(map((response:any) => response));
    }
  }
  resendRedemptionOtp(param){
    if(LOCALJSON=='true'){
      return this.http.get('assets/data/resendredemptionotp.json').pipe(map((response:any) => response));
    }else{
      return this.http.post(this.endpoint+'resendredemptionotp', param, config).pipe(map((response:any) => response));
    }
  }
  updateavaliablepoints(){
    if(LOCALJSON=='true'){
      return this.http.get('assets/data/updateavaliablepoints.json').pipe(map((response:any) => response));
    }else{
      return this.http.get(this.endpoint+'updateavaliablepoints').pipe(map((response:any) => response));
    }
  }
  checkNonSpcOffer(param){
    if(LOCALJSON=='true'){
      return this.http.get('assets/data/check_non_spc_offer.json').pipe(map((response:any) => response));
    }else{
      return this.http.post(this.endpoint+'check_non_spc_offer', param, config1).pipe(map((response:any) => response));
    }
  }

  // async checkNonSpcOffer(param){
  //     let response = await this.http.post(this.endpoint+'check_non_spc_offer', param, config).toPromise(); 
  //     return JSON.stringify(response);
  //     //return this.http.post(this.endpoint+'check_non_spc_offer', param, config).pipe(map((response:any) => response));
  // }

  applyNonSpcOffer(param){
    if(LOCALJSON=='true'){
      return this.http.get('assets/data/update_non_spc_offer.json').pipe(map((response:any) => response));
    }else{
      return this.http.post(this.endpoint+'update_non_spc_offer', param, config1).pipe(map((response:any) => response));
    }
  }

  getcustomercardpoints(param){
    //console.log(param);
 // return this.http.post(this.endpoint+'getcustomercardpoints', param, config).pipe(map((response:any) => response));
  if(LOCALJSON=='true'){
    return this.http.get('assets/data/availablepoints.json').pipe(map((response:any) => response));
  }else{
    return this.http.post(this.endpoint+'getcustomercardpoints', param, config).pipe(map((response:any) => response));
  }
}
  generateVoucherOtp(param){
    
  if(LOCALJSON=='true'){
    return this.http.get('assets/data/generateOtp.json').pipe(map((response:any) => response));
  }else{
    return this.http.post(this.endpoint+'generateVoucherOtp', param, config).pipe(map((response:any) => response));
  }
}

checkNonSpcCardElligible(param){
  if(LOCALJSON=='true'){
    return this.http.get('assets/data/check_non_spc_card_offer.json').pipe(map((response:any) => response));
  }else{
    return this.http.post(this.endpoint+'check_updated_non_spc_offer', param, config1).pipe(map((response:any) => response));
  }
}

availablePointsDUMMYRESPONSE(param){
  return this.http.get('assets/data/availablepoints.json').pipe(map((response:any) => response));
}


}

