import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
    this.getFlightDetails();
  }


  getFlightDetails(){
    let flightDetailsArrVal:any=localStorage.getItem("flightDetailsArr");
    let param=JSON.parse(flightDetailsArrVal);
      if(param!=null){
        this.flightDetails = param.flights;
        this.selectedVendor = param.priceSummary;  
      }
  }

  calculateEMI(amount: number) {
    return Math.round((amount + (amount * (this.EMI_interest / 100))) / 12);
  }

}
