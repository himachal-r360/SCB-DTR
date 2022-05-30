import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  // flight = environment.url+"rewards-ws/api/flights/list";
  flight = "https://smartbuydev.reward360.in/api/flightSearch";
  
  constructor(private http:HttpClient) { }

  flightList(para:any) {
    debugger;
   return this.http.post(this.flight , para) 
  }

}
