import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  hotel = environment.url + "api/hotelSearch";
  city = environment.url + "elastic/esearch?searchDisplayForm=hotels";
  header = new HttpHeaders({'Content-Type': 'application/json' })
  headerHideShow = new BehaviorSubject<Boolean>(true);
  currentHeader = this.headerHideShow.asObservable();
  hotelDetail = environment.url + "api/hotelDetails";
  constructor(private http: HttpClient) { }


  getHotelList(para:any):Observable<any>{
    let body:any = JSON.stringify(para);
    return this.http.post(this.hotel, body, { headers: this.header });
  }

  getHotelCityList(queryText:any){
    return this.http.post(`${this.city}&queryText=${queryText}`, null)
  }

  showHeader(value: boolean) {
    this.headerHideShow.next(value);
  }


  getHotelDetail(param :any):Observable<any>{
    let body:any = JSON.stringify(param);
    console.log(body);
    return this.http.post(this.hotelDetail, body, { headers: this.header });
  }

}
