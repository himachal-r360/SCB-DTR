import { Component, OnInit } from '@angular/core';
import { FlightService } from 'src/app/common/flight.service';

@Component({
  selector: 'app-flight-detail',
  templateUrl: './flight-detail.component.html',
  styleUrls: ['./flight-detail.component.css']
})
export class FlightDetailComponent implements OnInit {
  flightDetails:any;
  selectedVendor:any;
  flightIcons:any;
  airportsNameJson:any;
  EMI_interest: number = 16;
  EMIAvailableLimit: number = 3000;

  constructor(private _flightService:FlightService) { }

  ngOnInit(): void {
    this.getFlightDetails();
    this.getFlightIcon();
    this.getAirpotsList();
  }

  getFlightDetails(){
    //this._flightService.getFlightDetailsVal()
    // console.log(this._flightService.flightDetailsObservable.subscribe());
    // this.commonService.getShowLoginDashboardStatus().subscribe((dashboardLoginStatus) => {
    //   this.show = dashboardLoginStatus;
    // });
    this._flightService.getFlightDetailsVal().subscribe((param:any)=>{
      debugger
        this.flightDetails = param[0].flights;
        this.selectedVendor = param[1].priceSummary;
        console.log(this.selectedVendor);
        console.log(this.flightDetails , "param");
        
    })
  }

    // Get flight Icons
    getFlightIcon(){
      this._flightService.getFlightIcon().subscribe((res:any)=>{
        this.flightIcons = res;
      })
    }


  // get airport list
  getAirpotsList() {

    this._flightService.getAirportName().subscribe((res:any)=>{
      this.airportsNameJson = res;
      console.log(this.airportsNameJson);
    })
  }

  calculateEMI(amount: number) {
    return Math.round((amount + (amount * (this.EMI_interest / 100))) / 12);
  }

  getLayoverHour(obj1:any, obj2:any)
  {
    let dateHour:any;
    if(obj2!=null || obj2!=undefined)
    {
      
      let obj2Date=new Date(obj2.departureDateTime);
      let obj1Date=new Date(obj1.departureDateTime);
      dateHour=(obj2Date.valueOf()-obj1Date.valueOf())/1000;
        
    }
    return dateHour;
  }

  

}
