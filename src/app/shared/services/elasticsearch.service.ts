import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap ,shareReplay} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import { SimpleGlobal } from 'ng2-simple-global';

const LOCALJSON = environment.LOCALJSON;


const config = {
  headers : {
      'Content-Type': 'application/x-www-form-urlencoded'
      
  }
  }

@Injectable({
  providedIn: 'root'
})
export class ElasticsearchService {
  endpoint;
  domainName;
  constructor(private http: HttpClient,private sg: SimpleGlobal) { 
    this.domainName = this.sg['domainName']
    this.endpoint = environment.API_URL[this.domainName];
    
  }

  esSearch(param){
    if(LOCALJSON=='true'){
    
      switch(param['searchDisplayForm']) { 
        case 'flights': { 
         return this.http.get('assets/data/esSearch-flights.json').pipe(map((response: any) => response));
        break; 
        } 
        case 'hotels': { 
        return this.http.get('assets/data/esSearch-hotels.json').pipe(map((response: any) => response));
        break; 
        } 
        case 'bus': { 
        return this.http.get('assets/data/esSearch-redbus.json').pipe(map((response: any) => response));
        break; 
        } 
        case 'train': { 
               return this.http.get('assets/data/esSearch-train.json').pipe(map((response: any) => response));
        break; 
        }
        case 'shopping': { 
               return this.http.get('assets/data/esSearch-shopping.json').pipe(map((response: any) => response));
        break; 
        }
      }
    }else{
      return this.http.post(this.endpoint+'elastic/search', param, config).pipe(map((response: any) => response));
    
    }
   }
   
}
