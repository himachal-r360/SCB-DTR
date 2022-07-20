import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  flight = environment.url + "api/flightSearch";
  city = environment.url + "elastic/esearch?searchDisplayForm=flights";
  flightInfo =  environment.url + "api/flightInfo";
  flightListData: any;
  flightListDate:any;
  flightsIcon = "assets/Json/airlines.json";
  airportsNameList ="assets/Json/airports.json";
  flightDetails:any;
  // private flightDetailsSubject = new BehaviorSubject<any>();
  private flightDetailsSubject = new BehaviorSubject(null);
  flightDetailsObservable = this.flightDetailsSubject.asObservable();
  private travellerDetailsSubject = new BehaviorSubject<any>(null);
  travellerDetailsObservalble= this.travellerDetailsSubject.asObservable();
  headerHideShow:any;



  header = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
  constructor(private http: HttpClient) { }

  flightList(para: any) {
    let body = JSON.stringify(para)
    return this.http.post(this.flight, body, { headers: this.header })
  }

  getCityList(queryText: any) {
    return this.http.post(`${this.city}&queryText=${queryText}`, null)
  }

  getFlightIcon(){
    return this.http.get(this.flightsIcon);
  }

  getAirportName(){
    return this.http.get(this.airportsNameList);
  }

  // setFlightsDetails
  // call from flight list for setting the value
  setFlightsDetails(param: any) {
    this.flightDetailsSubject.next(param) ;
  }
    // call from flight details
  getFlightDetailsVal(): Observable<any> {
    return this.flightDetailsSubject.asObservable();
  }

  // setTravellerDetails(para:any){
  //   this.travellerDetailsSubject.next(para);
  // }

  // getTravellerDetailsVal(): Observable<any> {
  //   return this.travellerDetailsSubject.asObservable();
  // }

  getFlightInfo(param:any)
  {
    return this.http.post(this.flightInfo, param, { headers: this.header })
  }

}
