import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  // flight = environment.url+"rewards-ws/api/flights/list";
  flight = environment.url + "api/flightSearch";
  city = environment.url + "elastic/esearch?searchDisplayForm=flights";
  flightListData: any;
  flightListDate:any;

  header = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
  constructor(private http: HttpClient) { }

  flightList(para: any) {
    debugger
    let body = JSON.stringify(para)
    return this.http.post(this.flight, body, { headers: this.header })
  }

  getCityList(queryText: any) {
    return this.http.post(`${this.city}&queryText=${queryText}`, null)
  }

  //
}
