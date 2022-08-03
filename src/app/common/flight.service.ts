import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable ,EventEmitter} from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
const LOCALJSON = environment.LOCALJSON;
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
  multicitylisting = environment.url + "api/multicitySearch";
  // private flightDetailsSubject = new BehaviorSubject<any>();
  private flightDetailsSubject = new BehaviorSubject(null);
  flightDetailsObservable = this.flightDetailsSubject.asObservable();
  
  
  headerHideShow = new BehaviorSubject<Boolean>(true);
  currentHeader = this.headerHideShow.asObservable();

  header = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
  constructor(private http: HttpClient) { 
  }

   showHeader(value: boolean) {
   console.log(value);
        this.headerHideShow.next(value);
    }


  flightList(para: any) {
    let body = JSON.stringify(para);
     if(LOCALJSON=='true'){
      if(para.flightdefault=='O'){
      return this.http.get('assets/data/flight-onward.json');
      }else{
      return this.http.get('assets/data/flight-return.json');
      }
    }else{
    
    return this.http.post(this.flight, body, { headers: this.header })
    }
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



  getFlightInfo(param:any)
  {
     if(LOCALJSON=='true'){
      return this.http.get('assets/data/flightInfo.json');
    }else{
    
    return this.http.post(this.flightInfo, param, { headers: this.header })
    }
  }
  multicityList(para: any) {
    let body = JSON.stringify(para);
     if(LOCALJSON=='true'){
      
      return this.http.get('assets/data/multicity.json');
     
    }else{
    
    return this.http.post(this.multicitylisting, body, { headers: this.header })
    }
  }

}
