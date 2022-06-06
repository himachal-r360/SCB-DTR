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

  header = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
  constructor(private http: HttpClient) { }

  flightList(para: any) {
    let body = JSON.stringify(para)
    return this.http.post(this.flight, body, { headers: this.header })
  }

  getCityList(queryText :any) {
    // return this.http.post(this.city, null,{ headers: this.header })
    return this.http.post(`${this.city}&queryText=${queryText}&` ,null)
    // return this._http.get(`${this.GuestList}?PageIndex=${pageIndex}&PageSize=${pageSize}&checkout=${checkOut}&search=${search}&email=${email}&sortColumn=${sortColumn}&sortDirection=${sortDirection}`);
  }

// 
}
