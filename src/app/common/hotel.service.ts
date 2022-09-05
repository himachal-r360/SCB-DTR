import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  hotel = environment.url + "api/hotelSearch";
  header = new HttpHeaders({'Content-Type': 'application/json' })

  constructor(private http: HttpClient) { }


  getHotelList(para:any):Observable<any>{
    let body:any = JSON.stringify(para);
    return this.http.post(this.hotel, body, { headers: this.header });
  }


}
