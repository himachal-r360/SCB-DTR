import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import {AppConfig} from '../../configs/app.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, catchError, tap ,shareReplay} from 'rxjs/operators';
import { Location } from '@angular/common';
interface RequestResponse {
  result: string
}

const config = {
headers : {
    'Content-Type': 'application/x-www-form-urlencoded'
}
} 


@Injectable({
  providedIn: 'root'
})


export class EncrDecrService {
  domainName:any;
  endpoint:any;
  constructor( private httpClient: HttpClient,private location:Location) { 
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
  
  
  }
//The set method is use for encrypt the value.
  set( value){
  let keys=  sessionStorage.getItem("tokenKey");
    if (sessionStorage.getItem('tokenKey')!.length == 0 || keys=='RELOAD') {
      window.location.reload();
    }else{
    var key = CryptoJS.enc.Utf8.parse(keys);
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
    {
        mode: CryptoJS.mode.ECB,
    });

    return encrypted.toString();
    }
  }

  //The get method is use for decrypt the value.
  get( value){
    let keys=  sessionStorage.getItem("tokenKey");
    if (sessionStorage.getItem('tokenKey')!.length == 0 || keys=='RELOAD') {
     window.location.reload();
     }else{
    var key = CryptoJS.enc.Utf8.parse(keys);
    var decrypted = CryptoJS.AES.decrypt(value, key, {
        mode: CryptoJS.mode.ECB,
    });
    try {
    return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
    // window.location.reload();
    }
    }
  }
  

  
}
