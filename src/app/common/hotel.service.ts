import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  hotel = environment.url + "api/hotelSearch";
  header = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded' })
  
  constructor(private http: HttpClient) { }


  getHotelList(para:any){
    let body = JSON.stringify(para);
    return this.http.post(this.hotel, body, { headers: this.header });
  }


}
