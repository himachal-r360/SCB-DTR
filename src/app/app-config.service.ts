import { Injectable,Inject} from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse , HttpParams} from '@angular/common/http';
import {environment} from '../environments/environment';
import { Location } from '@angular/common';
import {EncrDecrService} from 'src/app/shared/services/encr-decr.service';
import { RestapiService} from 'src/app/shared/services/restapi.service';
import { DOCUMENT } from '@angular/common';
import { SimpleGlobal } from 'ng2-simple-global';
const config = {
headers : {
    'Content-Type': 'application/x-www-form-urlencoded'
}
}
const param = {}
@Injectable()
export class AppConfigService {
  appConfig:any;
  endpoint:any;
  domainName:any;
  constructor(@Inject(DOCUMENT) private document: any,private http: HttpClient,private location:Location,private EncrDecr: EncrDecrService, public rest:RestapiService,private sg: SimpleGlobal) {
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
  console.log(this.domainName);
  this.endpoint = environment.API_URL[this.domainName];
   }

  loadAppConfig() {
  if(environment.production==true){
   var url:any;
   url='getAngularSettings';
   
   return new Promise((resolve) => {
   
     const urlParams = new HttpParams()
	.set('postData', 'XXXXX')
	const body: string = urlParams.toString();

     this.rest.checkCsrfAuth(body).subscribe(result => {
     if(result.authtoken){
     sessionStorage.setItem("tokenKey", result.authtoken);
     
     
          var customer_cookie = 0;
          if(result.response != undefined){
          var encresponse  = JSON.parse(this.EncrDecr.get(result.response));
          if(encresponse.customer_cookie == 1)customer_cookie = 1;
          }
          if(result.status=='success' || customer_cookie == 1){
             this.sg['customerInfo'] = JSON.parse(this.EncrDecr.get(result.response));
             if(this.sg['customerInfo']["guestLogin"]==true){
              this.sg['card_variant'] = 'Other Credit/Debit Card';
              this.sg['customerLogin'] = false;
             }else{
              this.sg['customerLogin'] = true;
              if (this.sg['customerInfo'].hasOwnProperty('ccustomer')){
                this.sg['customeravailablepoints']=(Number(this.sg['customerInfo']['ccustomer'].points_available)).toLocaleString('en-IN'); 
                if(this.sg['customerInfo']['ccustomer'].card_variant)
                this.sg['card_variant'] = this.sg['customerInfo']['ccustomer'].card_variant;
                else
                 this.sg['card_variant'] = 'Other Credit/Debit Card';
              }else{
               this.sg['customeravailablepoints']="";
                 this.sg['card_variant'] = 'Other Credit/Debit Card';
              }
             }
          }else{
              this.sg['customerInfo'] =[];
              this.sg['customerLogin'] = false;
               this.sg['card_variant'] = 'Other Credit/Debit Card';
          }
     
     
     
     
      this.http.post(this.endpoint+url, param, config)
        .subscribe(config => {
	try {
	this.appConfig =JSON.parse(this.EncrDecr.get(config['result']));
	} catch (error) {
	 window.location.reload();
	}
          resolve(this.appConfig);
        });
        }else{
          this.document.location.href = environment.MAIN_SITE_URL+'update-csrf';
        }
        }, (err: HttpErrorResponse) => {
             this.document.location.href = environment.MAIN_SITE_URL+'update-csrf';
      }); 
        
    });

    }else{
      sessionStorage.setItem("tokenKey", "localUATkey12345");
      
       const urlParams = new HttpParams()
	.set('postData', 'XXXXX')
	const body: string = urlParams.toString();
	 this.rest.checkCsrfAuth(body).subscribe(result => {
	  if(result.authtoken){
	    sessionStorage.setItem("tokenKey", result.authtoken);
          }else{
          this.document.location.href = environment.MAIN_SITE_URL+'update-csrf';
          }
          
          
          var customer_cookie = 0;
          if(result.response != undefined){
          var encresponse  = JSON.parse(this.EncrDecr.get(result.response));
          if(encresponse.customer_cookie == 1)customer_cookie = 1;
          }
          if(result.status=='success' || customer_cookie == 1){
             this.sg['customerInfo'] = JSON.parse(this.EncrDecr.get(result.response));
             if(this.sg['customerInfo']["guestLogin"]==true){
              this.sg['card_variant'] = 'Other Credit/Debit Card';
              this.sg['customerLogin'] = false;
             }else{
              this.sg['customerLogin'] = true;
              if (this.sg['customerInfo'].hasOwnProperty('ccustomer')){
                this.sg['customeravailablepoints']=(Number(this.sg['customerInfo']['ccustomer'].points_available)).toLocaleString('en-IN'); 
                if(this.sg['customerInfo']['ccustomer'].card_variant)
                this.sg['card_variant'] = this.sg['customerInfo']['ccustomer'].card_variant;
                else
                 this.sg['card_variant'] = 'Other Credit/Debit Card';
              }else{
               this.sg['customeravailablepoints']="";
                 this.sg['card_variant'] = 'Other Credit/Debit Card';
              }
             }
          }else{
              this.sg['customerInfo'] =[];
              this.sg['customerLogin'] = false;
               this.sg['card_variant'] = 'Other Credit/Debit Card';
          }
          
          
         }, (err: HttpErrorResponse) => {
             this.sg['customerInfo'] = [];
             this.sg['customerLogin'] = false;
              this.sg['card_variant'] = 'Other Credit/Debit Card';
      });
      
      
    return new Promise((resolve) => {
      this.http.get('/assets/config/appConfig.json')
        .subscribe(config => {
          this.appConfig = config;
          resolve(this.appConfig);
        });
     });
    

    }  
  }

  getConfig() {
    return this.appConfig;
  }
}
