import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap ,shareReplay} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import { Location } from '@angular/common';
const LOCALJSON = environment.LOCALJSON;

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
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
export class BusService {
domainName;
endpoint;
  constructor(private http: HttpClient,private location:Location) {
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

  getBuses(param): Observable<any> {
    if(LOCALJSON=='true')
    return this.http.get('assets/data/busListResponse.json?version='+new Date().getTime());
    else
    return this.http.post(this.endpoint+'BusSearchNew', param, config).pipe(map((response: any) => response));
  }


 getBusSeats (param): Observable<any> {
  if(LOCALJSON=='true')
    return this.http.get('assets/data/BusSeats.json?version='+new Date().getTime());
    else
    return this.http.post(this.endpoint+'BusSeats', param, config).pipe(map((response: any) => response));
  }


  blockbusSeats (param): Observable<any> {

    if(LOCALJSON=='true')
    return this.http.get('assets/data/BlockSeat.json?version='+new Date().getTime());
    else
    return this.http.post(this.endpoint+'blockbusSeats', param, config).pipe(map((response: any) => response));
  }

   saveCheckout (param): Observable<any> {
    return this.http.post(this.endpoint+'saveCheckoutBus', param, config).pipe(map((response: any) => response));
  }
}
