import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FlightService } from 'src/app/common/flight.service';
declare var $: any;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit ,OnDestroy {
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
  fromAirpotName:any ='from airport';
  fromCityName :any ='From';
  toCityName:any ='To';
  toAirpotName:any = 'to airport';
  departureDate:any = new Date();
  returnDate:any;
  oneWayDate :any;

  


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

  constructor(public router: Router, private _fb: FormBuilder, private _flightService: FlightService) { }

  ngOnInit(): void {
    this.getCityList();
    this.selectDate("DepartureDate");

  $(document).click(function(e:any){
    var containerLeft = $(".select-root-left");
    if (!$(e.target).closest(containerLeft).length) {
      $(".flight-from-data").addClass("flight-from-hide");
    }
    else{
      $("#fromCitySearch").val('');
      $(".flight-from-data").removeClass("flight-from-hide");
    }

    var containerRight = $(".select-root-right");
    if (!$(e.target).closest(containerRight).length) {
      $(".flight-to-data").addClass("flight-from-hide");
    }
    else{
      $("#toCitySearch").val('');
      $(".flight-to-data").removeClass("flight-from-hide");
    }

    var TravellersDropdown = $(".Travellers-dropdown");
    if (!$(e.target).closest(TravellersDropdown).length) {
      $(".Travellers-dropdown-data").addClass("Travellershide");
    }
    else{
      $(".Travellers-dropdown-data").removeClass("Travellershide");
    }

});

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
    //   // dep = e.format()
    // });
    const a=this;
    $('#'+control).daterangepicker({
      singleDatePicker: true,
      showDropdowns: false,
      format: "yyyy/mm/dd",
      startDate: new Date(),
      //  todayBtn: 1,
      autoclose: true,

    }, function(start:any, end:any, label:string) {
      
      a.departureDate=start._d;
      
    });

    // $('.single-datepicker').datepicker({
    //     format: 'mm/dd/yyyy',
    //     startDate: '02/20/2018',
    // });
  }

  getCityList() {
    this.sub = this._flightService.getCityList(this.cityList).subscribe((res: any) => {
      this.cityList = res.hits.hits;
      
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
    this.fromCityName = para1.city;
    localStorage.setItem('fromCity', this.fromCityName);
    this.fromFlightList = false;

  }

  selectToFlightList(para2: any) {
    this.flightData.value.flightto = para2.id;
    this.cityName = para2.city
    this.toAirpotName = para2.airport_name;
    this.toCityName = para2.city;
    localStorage.setItem('toCity' ,this.toCityName);
    this.toFlightList = false;
   

  }

  flightSearch() {
    

    this.loader = true;
    this.selectedDate = this.flightData.value.departure;
    

    this.sub = this._flightService.flightList(this.flightData.value).subscribe((res: any) => {
      this.loader = false;
      this.show = true;
      this.flightList = res.response.onwardFlights;
      this.oneWayDate = res.responseDateTime;
      
      this._flightService.flightListData = this.flightList;
      this._flightService.flightListDate = this.oneWayDate;
      
      this.router.navigate(['flight-list']);
    }, (error) => { console.log(error) });

  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

}
