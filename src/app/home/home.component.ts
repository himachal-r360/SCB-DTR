import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { FlightService } from '../common/flight.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  cityList = { name:"banglore"}


  flightData: any = this._fb.group({
    flightfrom: ["DEL"],
    flightto:["BLR"],
    flightclass:["E"],
    flightdefault:["O"],
    departure:["2022-05-31"],
    arrival:[""],
    adults:["1"],
    child:["0"],
    infants:["0"],
    travel:["DOM"]
  })

  constructor(public router:Router , private _fb: FormBuilder, private _flightService:FlightService) { }

  ngOnInit(): void {
  }


  flightSearch() {
    this._flightService.flightList(this.flightData.value).subscribe((res:any) => {
      console.log(res)
    },(error)=>{console.log(error)});
  }


  // search() {
  //     this.router.navigate(['flight-list']);
  // }

}
