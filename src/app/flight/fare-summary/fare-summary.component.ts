import { Component, OnInit } from '@angular/core';
import { FlightService } from 'src/app/common/flight.service';

@Component({
  selector: 'app-fare-summary',
  templateUrl: './fare-summary.component.html',
  styleUrls: ['./fare-summary.component.css']
})
export class FareSummaryComponent implements OnInit {
  flightDetails:any;
  selectedVendor:any;
  EMIAvailableLimit: number = 3000;
  EMI_interest: number = 16;
  BaseFare:any;
  Tax:any;
  TotalFare:any;

  constructor(private _flightService:FlightService) { }

  ngOnInit(): void {
    this.getFlightDetails();
  }


  getFlightDetails(){
    let flightDetailsArrVal:any=localStorage.getItem("flightDetailsArr");
    let param=JSON.parse(flightDetailsArrVal);
      if(param!=null){
        this.flightDetails = param.flights;
        this.selectedVendor = param.priceSummary;
        var onwardFlightFareKey = (param.priceSummary.clearTripFareKey != undefined && param.priceSummary.clearTripFareKey != null  ? param.priceSummary.clearTripFareKey : "");
var body = {
  "docKey": param.docKey,
  "flightKeys": [
    param.flightKey
  ],
  "partnerName": this.selectedVendor.partnerName,
  "onwardFlightFareKey": onwardFlightFareKey,
  "returnFlightFareKey": "",
  "splrtFlight": this.selectedVendor.splrtFareFlight
}
console.log(JSON.stringify(body))
        this.getFlightInfo(body);
      }
  }

  calculateEMI(amount: number) {
    return Math.round((amount + (amount * (this.EMI_interest / 100))) / 12);
  }

  getFlightInfo(param:any)
  {
    this._flightService.getFlightInfo(param).subscribe((res: any) => {
      console.log(res)
      if(res.statusCode ==200)
      {
          this.BaseFare =res.response.comboFare.onwardBaseFare;
          this.Tax =res.response.comboFare.onwardTax;
          this.TotalFare =res.response.comboFare.onwardTotalFare;
      }

    }, (error) => { console.log(error) });

  }

}
