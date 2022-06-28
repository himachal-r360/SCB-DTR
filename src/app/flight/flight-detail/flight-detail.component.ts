import { Component, DebugNode, OnInit } from '@angular/core';
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
  getsearchVal:any;
  parseSearchVal:any;
  getFlightDetailLocalStorage:any;
  totalDuration:number=0;

  constructor(private _flightService:FlightService) { }

  ngOnInit(): void {
    this.getsearchVal = localStorage.getItem('searchVal');
    this.parseSearchVal = JSON.parse(this.getsearchVal);
    this.getFlightIcon();
    this.getAirpotsList();
    // setTimeout(() => {
    this.getFlightDetails();
    // }, 100);
  }

  getFlightDetails(){
    //this._flightService.getFlightDetailsVal()
    // this.commonService.getShowLoginDashboardStatus().subscribe((dashboardLoginStatus) => {
    //   this.show = dashboardLoginStatus;
    // });
    let flightDetailsArrVal:any=localStorage.getItem("flightDetailsArr");
    let param=JSON.parse(flightDetailsArrVal);
      if(param!=null){
        this.flightDetails = param.flights;
        this.selectedVendor = param.priceSummary;  
        this.durationCalc();
      }

    // this._flightService.getFlightDetailsVal().subscribe((param:any)=>{
    //   if(param!=null){
    //     this.flightDetails = param.flights;
    //     this.selectedVendor = param.priceSummary;  
    //   }
    // })
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
    })
  }

  calculateEMI(amount: number) {
    return Math.round((amount + (amount * (this.EMI_interest / 100))) / 12);
  }

  // getLayoverHour(obj1:any, obj2:any)
  // {
    
  //   let dateHour:any;
  //   if(obj2!=null || obj2!=undefined)
  //   {
      
  //     let obj2Date=new Date(obj2.departureDateTime);
  //     let obj1Date=new Date(obj1.arrivalDateTime);
  //     dateHour=(obj2Date.valueOf()-obj1Date.valueOf())/1000;
        
  //   }
  //   return dateHour;
  // }
  dateHour:any;
  getLayoverHour(obj1:any, obj2:any)
  {
    if(obj2!=null || obj2!=undefined)
    {
      let obj2Date=new Date(obj2.departureDateTime);
      let obj1Date=new Date(obj1.arrivalDateTime);
      this.dateHour=(obj2Date.valueOf()-obj1Date.valueOf())/1000;
    }
  }

  durationCalc(){
    this.totalDuration=0;
    for(let i = 0;i<this.flightDetails.length;i++){
      this.totalDuration+=this.flightDetails[i].duration;
      if(this.flightDetails[i+1]!=null && this.flightDetails[i+1]!=undefined){
        this.getLayoverHour(this.flightDetails[i],this.flightDetails[i+1]);
      }
    }
  }
}
