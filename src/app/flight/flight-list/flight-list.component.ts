import { Component,  OnDestroy,  OnInit } from '@angular/core';
import { FlightService } from 'src/app/common/flight.service';
declare var $: any;


@Component({
  selector: 'app-flight-list',
  templateUrl: './flight-list.component.html',
  styleUrls: ['./flight-list.component.css']
})
export class FlightListComponent implements OnInit ,OnDestroy {
  flightList = this._flightService.flightListData; 
  newDate = Date();
  loader = false;
  fromCityName:any;
  toCityName:any;
 flightListDate = this._flightService.flightListDate;
  

  constructor(private _flightService: FlightService) { }

  ngOnInit(): void {
    $(".js-range-slider").ionRangeSlider({
      type: "double",
      min: 0,
      max: 1000,
      from: 200,
      to: 500,
      prefix: "$",
      grid: true
  });

  this.fromCityName = localStorage.getItem('fromCity');
  this.toCityName = localStorage.getItem('toCity');
        
        
  }


  ngOnDestroy(): void {
    localStorage.clear()
  }

}
