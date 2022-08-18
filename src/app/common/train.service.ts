import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
const LOCALJSON = environment.LOCALJSON;
@Injectable({
  providedIn: 'root'
})
export class TrainService {
  flight = environment.url + "api/trainSearch";
  city = environment.url + "elastic/esearch?searchDisplayForm=trains";
  trainInfo = environment.url + "api/trainInfo";
  trainListData: any;
  trainListDate: any;
  flightsIcon = "assets/Json/airlines.json";
  airportsNameList ="assets/Json/airports.json";
  countryList = "assets/Json/country.json";
  trainDetails:any;
  // private flightDetailsSubject = new BehaviorSubject<any>();
  private flightDetailsSubject = new BehaviorSubject(null);
  flightDetailsObservable = this.flightDetailsSubject.asObservable();


  headerHideShow = new BehaviorSubject<Boolean>(true);
  currentHeader = this.headerHideShow.asObservable();

  
  
  

  header = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
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
        if (para.flightdefault == 'O') {
          return this.http.get('assets/data/flight-onward.json');
        } else {
          return this.http.get('assets/data/flight-return.json');
        }
      }
    } else {

      return this.http.post(this.flight, body, { headers: this.header })
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

      return this.http.post(this.trainInfo, param, { headers: this.header })
    }
  }

}
