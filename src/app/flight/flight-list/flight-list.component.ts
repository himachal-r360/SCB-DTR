import { Component,  OnInit } from '@angular/core';
import { FlightService } from 'src/app/common/flight.service';
declare var $: any;


@Component({
  selector: 'app-flight-list',
  templateUrl: './flight-list.component.html',
  styleUrls: ['./flight-list.component.css']
})
export class FlightListComponent implements OnInit {
  flightList = this._flightService.flightListData; 
  newDate = Date();
  loader = false;

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
      
      
  }

}
