import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  // flight = environment.url+"rewards-ws/api/flights/list";
<<<<<<< HEAD
  flight = environment.url+"api/flightSearch";
  header = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'})
=======
  flight = "https://smartbuydev.reward360.in/api/flightSearch";
  
>>>>>>> d169ad19846d683d6cc3e4bc822e16d1fa159eb8
  constructor(private http:HttpClient) { }

  flightList(para:any) {

    console.log(JSON.stringify(para))
   return this.http.post(this.flight , para,{headers:this.header})
  }

}
