import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  flight = environment.url + "api/flightSearch";
  city = environment.url + "elastic/esearch?searchDisplayForm=flights";
  flightListData: any;
  flightListDate:any;
  flightsIcon = "assets/Json/airlines.json";
  airportsNameList ="assets/Json/airports.json";

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

}
