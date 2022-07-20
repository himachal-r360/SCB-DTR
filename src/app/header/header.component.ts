import { Component, OnInit } from '@angular/core';
import { FlightService } from '../common/flight.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private _flightService:FlightService) { }

  ngOnInit(): void {
    this._flightService.headerHideShow = document.getElementById('headerHide');
  }

  
}
