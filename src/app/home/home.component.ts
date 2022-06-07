import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FlightService } from '../common/flight.service';
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  sub?: Subscription
  loader = false;
  show = false;
  newDate = new Date();
  cityList: any;
  flightList: any;
  fromFlightList = false;
  toFlightList = false;
  selectedDate?:any;
  cityName:any;
  fromAirpotName:any;
  toAirpotName:any;
  departureDate:any = new Date();
  returnDate:any;

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
    this.getCityList();
    this.selectDate("DepartureDate");



  }

  selectDate(control:string) {
    let dep;
    // $('#'+control).daterangepicker({
    //   format: "yyyy/mm/dd",
    //   startDate: new Date(),
    //   singleDatePicker: true,
    //   //  todayBtn: 1,
    //   autoclose: true,
    // })
    // .datepicker('setDate', dep).on('changeDate', (e: any) => {
    //   dep = this.flightData.value.departure;
    //   dep = e.format()
    //   this.selectDate = dep;
    //   // this.newDate = e.format()
    //   // console.log(this.newDate ,"new date");
    //   // dep = e.format()

    //    console.log(this.selectDate);
    // });
console.log('hi');
    const a=this;
    $('#'+control).daterangepicker({
      singleDatePicker: true,
      showDropdowns: false,
      format: "yyyy/mm/dd",
      startDate: new Date(),
      //  todayBtn: 1,
      autoclose: true,

    }, function(start:any, end:any, label:string) {
      console.log(start._d);
      a.departureDate=start._d;
      console.log(end)
      console.log(label)
    });

    // $('.single-datepicker').datepicker({
    //     format: 'mm/dd/yyyy',
    //     startDate: '02/20/2018',
    // });
  }

  // convertDate(str:any) {
  //   var date = new Date(str),
  //     mnth = ("0" + (date.getMonth() + 1)).slice(-2),
  //     day = ("0" + date.getDate()).slice(-2);
  //   return [date.getFullYear(), mnth, day].join("-");
  // }
  getCityList() {
    this.sub = this._flightService.getCityList(this.cityList).subscribe((res: any) => {
      this.cityList = res.hits.hits;
      console.log(this.cityList);
    })
  }


  fromList(evt: any) {
    this.toFlightList = false;
    this.fromFlightList = true;
    this.cityList = evt.target.value.trim().toLowerCase();
    this.getCityList()
  }

  toList(evt: any) {
    this.fromFlightList = false;
    this.toFlightList = true;
    this.cityList = evt.target.value.trim().toLowerCase();
    this.getCityList()
  }

  selectFromFlightList(para1: any) {
    this.flightData.value.flightfrom = para1.id;
    this.fromAirpotName = para1.airport_name;
    this.fromFlightList = false;
    console.log(para1.id);
  }

  selectToFlightList(para2: any) {
    this.flightData.value.flightto = para2.id;
    this.cityName = para2.city
    this.toAirpotName = para2.airport_name;
    this.toFlightList = false;
    console.log(para2);
    console.log(this.flightData.value.flightto);

  }


  flightSearch() {
    debugger;
    console.log(this.departureDate);
    this.loader = true;
    this.selectedDate = this.flightData.value.departure;
    console.log(this.selectDate);

    this.sub = this._flightService.flightList(this.flightData.value).subscribe((res: any) => {
      this.loader = false;
      this.show = true;
      this.flightList = res.response.onwardFlights;
      this._flightService.flightListData = this.flightList;
      console.log(this.flightList , "flight Search");
      this.router.navigate(['flight-list']);
    }, (error) => { console.log(error) });

  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
