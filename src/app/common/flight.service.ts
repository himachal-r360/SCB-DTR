import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
const LOCALJSON = environment.LOCALJSON;
@Injectable({
  providedIn: 'root'
})
export class FlightService {
  flight = environment.url + "api/list";
  city = environment.url + "elastic/esearch?searchDisplayForm=flights";
  flightInfo = environment.url + "api/info";
  flightInfoMulticity = environment.url + "api/flightInfoMulticity";
  multicityFlight = environment.url + "api/flightSearchMulticity";
  flightListData: any;
  flightListDate: any;
  flightsIcon = "assets/Json/airlines.json";
  airportsNameList ="assets/Json/airports.json";
  countryList = "assets/Json/country.json";
  flightDetails:any;
  multicitylisting = environment.url + "api/flightSearchMulticity";
  // private flightDetailsSubject = new BehaviorSubject<any>();
  private flightDetailsSubject = new BehaviorSubject(null);
  flightDetailsObservable = this.flightDetailsSubject.asObservable();


  headerHideShow = new BehaviorSubject<Boolean>(true);
  currentHeader = this.headerHideShow.asObservable();





  header = new HttpHeaders({
  'Content-Type': 'application/json',
    })
  constructor(private http: HttpClient) {
  }

  showHeader(value: boolean) {
    this.headerHideShow.next(value);
  }


  flightList(para: any) {
    let body = JSON.stringify(para);
    if (LOCALJSON == 'true') {
      if (para.travel == 'INT') {
        if (para.flightdefault == 'O') {
          return this.http.get('assets/data/flight-int-onward.json');
        } else {
          return this.http.get('assets/data/flight-int-return.json');
        }
      } else {
        if (para.flightdefault == 'R') {
         return this.http.get('assets/data/flight-return.json');
        } else {
        return this.http.get('assets/data/flight-onward.json');
         
        }
      }
    } else {
      let headerValue = new HttpHeaders({
        'Content-Type': 'application/json',
         })
      return this.http.post(this.flight, body, { headers: headerValue }).pipe(map((response: any) => response));
    }
  }

  getCityList(queryText: any) {
    return this.http.post(`${this.city}&queryText=${queryText}`, null)
  }

  getFlightIcon() {
    return this.http.get(this.flightsIcon);
  }

  getCountryList(){
    return this.http.get(this.countryList);
  }

  getAirportName() {
    return this.http.get(this.airportsNameList);
  }

  // setFlightsDetails
  // call from flight list for setting the value
  setFlightsDetails(param: any) {
    this.flightDetailsSubject.next(param);
  }
  // call from flight details
  getFlightDetailsVal(): Observable<any> {
    return this.flightDetailsSubject.asObservable();
  }



  getFlightInfo(param: any,searchData:any) {
    if (LOCALJSON == 'true') {
      if(searchData.travel=='DOM'){
        if(searchData.flightdefault=='O')
        return this.http.get('assets/data/flightInfo.json');
        else
        return this.http.get('assets/data/flightInfo-R.json');
      }
        if(searchData.travel=='INT'){
          if(searchData.flightdefault=='O')
        return this.http.get('assets/data/flightInfo-int.json');
        else
        return this.http.get('assets/data/flightInfo-int-R.json');
      }
    
    } else {

      return this.http.post(this.flightInfo, param, { headers: this.header })
    }
  }
  multicityList(para: any) {
    let body = JSON.stringify(para);
     if(LOCALJSON=='true'){
      
      return this.http.get('assets/data/multicity.json');
     
    }else{
    
    return this.http.post(this.multicitylisting, body, { headers: this.header })
    }
  }

  getMulticityList(param:any){
    let body = JSON.stringify(param);
    console.log(body)
    return this.http.post(this.multicityFlight , body , { headers: this.header })
  }
    getFlightInfoMulticity(param: any,searchData:any) {
    if (LOCALJSON == 'true') {
 
        return this.http.get('assets/data/flightInfoMulticity.json');
    
    } else {

      return this.http.post(this.flightInfoMulticity, param, { headers: this.header })
    }
  }

}
