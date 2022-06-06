import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FlightService } from '../common/flight.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  sub?: Subscription
  flightList:any;
  selectId:any;
  loader = false;
  show = false;
  newDate = new Date();
  cityList:any;

  flightData: any = this._fb.group({
    flightfrom: ["DEL"],
    flightto: ["BLR"],
    flightclass: ["E"],
    flightdefault: ["O"],
    departure: [this.newDate],
    arrival: [""],
    adults: ["1"],
    child: ["0"],
    infants: ["0"],
    travel: ["DOM"]
  })


  // flightData: any = this._fb.group({
  //   depart: ["2022-06-15"],
  //   channel: ["web"],
  //   arrive: [""],
  //   leavingFrom: ["DEL"],
  //   infants: ["0"],
  //   child: ["0"],
  //   goingTo: ["BLR"],
  //   travel: ["DOM"],
  //   classType: ["E"],
  //   defaultType: ["O"],
  //   sortBy: ["asc"],
  //   count_t: ["1"],
  //   adultsq: ["1"]
  // })


  // flightData: any = this._fb.group({
  //   flightfrom: ["DEL"],
  //   flightto: ["BLR"],
  //   flightclass: ["E"],
  //   flightdefault: ["O"],
  //   departure: ["2022-05-31"],
  //   arrival: [":"],
  //   adults: ["1"],
  //   child: ["0"],
  //   infants: ["0"],
  //   travel: ["DOM"],

  // })
  constructor(public router: Router, private _fb: FormBuilder, private _flightService: FlightService) { }

  ngOnInit(): void {
    this.getCityList()
    
  }


  flightSearch() {
    this.loader = true;
    this.sub = this._flightService.flightList(this.flightData.value).subscribe((res: any) => {
      this.loader = false;
      this.show = true;
      this.flightList = res.response.onwardFlights;
      this.selectId = res.response.onwardFlights[0].flightKey;
      console.log(this.selectId , "ID");
      console.log(this.flightList , "flightList responce");
      // this.router.navigate(['flight-list']);
    }, (error) => { console.log(error) });

  }

  getCityList() {
    this.sub = this._flightService.getCityList(this.cityList).subscribe((res: any) => {
      this.cityList = res.hits.hits;
      console.log(this.cityList);
    })
  }


  dataFilter(evt: any) {
    let fromData = document.getElementById('fromVal')
    this.cityList = evt.target.value.trim().toLowerCase();
    this.getCityList()
  }

 
  // search() {
  //     this.router.navigate(['flight-list']);
  // }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
