
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FlightService } from 'src/app/common/flight.service';
import { MY_DATE_FORMATS } from '../flight-list/flight-list.component';
import { Location, ViewportScroller } from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-flight-roundtrip-list',
  templateUrl: './flight-roundtrip-list.component.html',
  styleUrls: ['./flight-roundtrip-list.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class FlightRoundtripListComponent implements OnInit {

  @ViewChild('toCityInput') toCityInput!: ElementRef;

  flightList: any = [];
  ReturnflightList: any = [];
  flightIcons: any;
  loader:boolean = false;
  searchData: any;
  fromAirpotName: any = 'from airport';
  toAirpotName: any = 'to airport';
  flightTimingfrom: any;
  flightTimingto: any;
  sub?: Subscription;
   fromCityName: any;
  toCityName: any;
  fromContryName: any;
  toContryName: any;
  queryFlightData: any;
  departureDate: any;
  returnDate: any;
  flightClassVal: any;
  adultsVal: any;
  childVal: any;
  infantsVal: any;
  totalPassenger: number = 1;
  DocKey: any;
  disableParent: boolean = false;
  disablechildren: boolean = false;
  disableinfants: boolean = false;
  fromFlightList = false;
  toFlightList = false;
  SearchCityName: any;
  cityList: any;
  cityName: any;
  minDate = new Date();

  isFlightsSelected: boolean = false;
  isDisplayDetail :boolean = false;
  isOnwardSelected: boolean = false;
  isReturnSelected: boolean = false;
  isDetailsShow: boolean = false;
  onwardSelectedFlight :any;
  returnSelectedFlight:any;

  flightDataModify: any = this._fb.group({
    flightfrom: [],
    flightto: [],
    flightclass: [],
    flightdefault: ['O'],
    departure: [],
    arrival: [''],
    adults: [],
    child: [],
    infants: [],
    travel: ['DOM'],
  });

  constructor(private _flightService: FlightService, private _fb: FormBuilder, public route: ActivatedRoute, private router: Router, private location: Location  ) { }

  ngOnInit(): void {
    this.loader = true;
    this.getQueryParamData(null);
    this.setSearchFilterData();
    this.getFlightIcon();
    this.flightSearch();
  }

  getQueryParamData(paramObj: any) {
    if (paramObj != null && paramObj != undefined) {
      this.queryFlightData = paramObj;
      this.fromContryName = this.queryFlightData.fromContry;
      this.toContryName = this.queryFlightData.toContry;
      sessionStorage.setItem('searchVal', JSON.stringify(paramObj));

    }
    else {
      this.route.queryParams
        .subscribe((params: any) => {
          this.queryFlightData = params;
          this.fromContryName = this.queryFlightData.fromContry;
          this.toContryName = this.queryFlightData.toContry;
          sessionStorage.setItem('searchVal', JSON.stringify(params));

        });
    }
  }

  setSearchFilterData() {
    this.searchData = sessionStorage.getItem('searchVal');
    let searchObj = JSON.parse(this.searchData);
    this.fromCityName = searchObj.fromCity; //searchObj.flightfrom;
    this.toCityName = searchObj.toCity;//localStorage.getItem('toCity');
    this.departureDate = new Date(searchObj.departure);
    this.returnDate = new Date(searchObj.arrival);
    this.flightClassVal = searchObj.flightclass;
    this.adultsVal = searchObj.adults;
    this.childVal = searchObj.child;
    this.infantsVal = searchObj.infants;
    this.fromAirpotName = searchObj.fromAirportName;//localStorage.getItem('fromAirportName');
    this.toAirpotName = searchObj.toAirportName;//localStorage.getItem('toAirportName');
    this.flightTimingfrom = searchObj.flightfrom
    this.flightTimingto = searchObj.flightto

    this.flightDataModify.value.flightfrom = searchObj.flightfrom;
    this.flightDataModify.value.flightto = searchObj.flightto;
    this.flightDataModify.value.departure = new Date(this.departureDate);
    this.flightDataModify.value.flightclass = this.flightClassVal;
    this.flightDataModify.value.adults = searchObj.adults;
    this.flightDataModify.value.child = this.childVal;
    this.flightDataModify.value.infants = this.infantsVal;
    this.flightDataModify.value.arrival = searchObj.arrival;
    this.totalPassenger =
      parseInt(this.adultsVal) +
      parseInt(this.childVal) +
      parseInt(this.infantsVal);
  }
  flightSearch() {
    this.loader = true;
    this.searchData = sessionStorage.getItem('searchVal');
    let searchObj = JSON.parse(this.searchData);
    if (
      this.flightDataModify.value.flightfrom == null ||
      this.flightDataModify.value.flightfrom == undefined
    ) {
      this.flightDataModify.value.flightfrom = searchObj.flightfrom;
    }
    if (
      this.flightDataModify.value.flightto == null ||
      this.flightDataModify.value.flightto == undefined
    ) {
      this.flightDataModify.value.flightto = searchObj.flightto;
    }
    if (
      this.flightDataModify.value.departure == null ||
      this.flightDataModify.value.departure == undefined
    ) {
      this.flightDataModify.value.departure = searchObj.departure;
    }

    if (
      this.flightDataModify.value.arrival == null ||
      this.flightDataModify.value.arrival == undefined
    ) {
      this.flightDataModify.value.arrival = searchObj.arrival;
    }

    let searchValue = this.flightDataModify.value;

    this.flightDataModify.value.departure = this.departureDate.getFullYear() + '-' + (this.departureDate.getMonth() + 1) + '-' + this.departureDate.getDate();
    this.flightDataModify.value.arrival = this.returnDate.getFullYear() + '-' + (this.returnDate.getMonth() + 1) + '-' + this.returnDate.getDate();

    let otherSearchValueObj = { 'fromAirportName': this.fromAirpotName, 'toAirportName': this.toAirpotName, 'toCity': this.toCityName, 'fromCity': this.fromCityName, 'fromContry': this.fromContryName, 'toContry': this.toContryName }

    let searchValueAllobj = Object.assign(searchValue, otherSearchValueObj);
    sessionStorage.setItem('searchVal', JSON.stringify(searchValueAllobj));
    console.log(this.flightDataModify.value);
    this.sub = this._flightService.flightList(this.flightDataModify.value).subscribe((res: any) => {
      console.log(res);
      this.DocKey = res.response.docKey;
      this.flightList = this.ascPriceSummaryFlighs(res.response.onwardFlights);
      console.log(this.flightList)
      this.ReturnflightList = this.ascPriceSummaryFlighs(res.response.returnFlights);
      this._flightService.flightListData = this.flightList;
      let query: any = sessionStorage.getItem('searchVal');
      let url = "flight-roundtrip?" + decodeURIComponent(this.ConvertObjToQueryString(JSON.parse(query)));
      this.location.replaceState(url);
      this.getQueryParamData(JSON.parse(query));

    }, (error) => { console.log(error) });
  }

  ConvertObjToQueryString(obj: any) {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }

  ascPriceSummaryFlighs(flightsData:any)
  {
    flightsData.filter((flightItem:any,indx:number)=>{

      let priceSummaryArr=flightItem.priceSummary;
      if(priceSummaryArr.length>1){
        priceSummaryArr.sort((a: any, b: any) => a.totalFare - b.totalFare);
        flightItem.priceSummary=priceSummaryArr;
      }
    })
    return flightsData;
  }

  // Get flight Icons
  getFlightIcon() {
    this._flightService.getFlightIcon().subscribe((res: any) => {
      this.flightIcons = res;
    })
  }

  increaseAdult() {
    if (parseInt(this.flightDataModify.value.adults) < 9) {
      this.flightDataModify
        .get('adults')
        .setValue(parseInt(this.flightDataModify.value.adults) + 1);
      this.totalPassenger =
        parseInt(this.flightDataModify.value.adults) +
        parseInt(this.flightDataModify.value.child) +
        parseInt(this.flightDataModify.value.infants);
      if (this.totalPassenger == 9) {
        this.disableParent = true;
        this.disablechildren = true;
        this.disableinfants = true;
      }
    }
  }

  decreaseAdult() {
    if (parseInt(this.flightDataModify.value.adults) > 1) {
      this.flightDataModify
        .get('adults')
        .setValue(parseInt(this.flightDataModify.value.adults) - 1);
      this.totalPassenger =
        parseInt(this.flightDataModify.value.adults) +
        parseInt(this.flightDataModify.value.child) +
        parseInt(this.flightDataModify.value.infants);
      if (this.totalPassenger < 9) {
        this.disableParent = false;
        this.disablechildren = false;
        if (
          parseInt(this.flightDataModify.value.infants) ==
          parseInt(this.flightDataModify.value.adults)
        ) {
          this.disableinfants = true;
        } else {
          this.disableinfants = false;
        }
      }
    }
  }

  increaseChild() {
    if (parseInt(this.flightDataModify.value.child) < 9) {
      this.flightDataModify
        .get('child')
        .setValue(parseInt(this.flightDataModify.value.child) + 1);
      this.totalPassenger =
        parseInt(this.flightDataModify.value.adults) +
        parseInt(this.flightDataModify.value.child) +
        parseInt(this.flightDataModify.value.infants);
      if (this.totalPassenger == 9) {
        this.disableParent = true;
        this.disablechildren = true;
        this.disableinfants = true;
      }
    }
  }



  decreaseChild() {
    if (parseInt(this.flightDataModify.value.child) > 0) {
      this.flightDataModify
        .get('child')
        .setValue(parseInt(this.flightDataModify.value.child) - 1);
      this.totalPassenger =
        parseInt(this.flightDataModify.value.adults) +
        parseInt(this.flightDataModify.value.child) +
        parseInt(this.flightDataModify.value.infants);
      if (this.totalPassenger < 9) {
        this.disableParent = false;
        this.disablechildren = false;
        if (
          parseInt(this.flightDataModify.value.infants) ==
          parseInt(this.flightDataModify.value.adults)
        ) {
          this.disableinfants = true;
        } else {
          this.disableinfants = false;
        }
      }
    }
  }

  increaseInfant() {
    if (
      parseInt(this.flightDataModify.value.infants) <
      parseInt(this.flightDataModify.value.adults)
    ) {
      if (parseInt(this.flightDataModify.value.infants) < 9) {
        this.flightDataModify
          .get('infants')
          .setValue(parseInt(this.flightDataModify.value.infants) + 1);
        this.totalPassenger =
          parseInt(this.flightDataModify.value.adults) +
          parseInt(this.flightDataModify.value.child) +
          parseInt(this.flightDataModify.value.infants);
        if (this.totalPassenger == 9) {
          this.disableParent = true;
          this.disablechildren = true;
          this.disableinfants = true;
        } else {
          if (
            parseInt(this.flightDataModify.value.infants) ==
            parseInt(this.flightDataModify.value.adults)
          ) {
            this.disableinfants = true;
          } else {
            this.disableinfants = false;
          }
        }
      }
    }
  }

  decreaseInfant() {
    if (parseInt(this.flightDataModify.value.infants) > 0) {
      this.flightDataModify
        .get('infants')
        .setValue(parseInt(this.flightDataModify.value.infants) - 1);
      this.totalPassenger =
        parseInt(this.flightDataModify.value.adults) +
        parseInt(this.flightDataModify.value.child) +
        parseInt(this.flightDataModify.value.infants);
      if (this.totalPassenger < 9) {
        this.disableParent = false;
        this.disablechildren = false;
        this.disableinfants = false;
      }
    }
  }
  fromList(evt: any) {
    this.toFlightList = false;
    this.fromFlightList = true;
    this.SearchCityName = evt.target.value.trim().toLowerCase();
    this.getCityList();
  }

  toList(evt: any) {
    this.fromFlightList = false;
    this.toFlightList = true;
    this.SearchCityName = evt.target.value.trim().toLowerCase();
    this.getCityList();
  }

  getCityList() {
    this.sub = this._flightService
      .getCityList(this.SearchCityName)
      .subscribe((res: any) => {
        this.cityList = res.hits.hits;
      });
  }

  selectFromFlightList(para1: any) {
    this.flightDataModify.value.flightfrom = para1.id;
    this.fromAirpotName = para1.airport_name;
    this.fromCityName = para1.city;
    this.fromContryName = para1.country;
    this.fromFlightList = false;
    setTimeout(() => {
      let toCityDivElement = document.getElementById("toCityDiv");
      toCityDivElement?.click();
      this.toCityInput.nativeElement.focus();
    }, 50);
  }

  selectToFlightList(para2: any) {
    this.flightDataModify.value.flightto = para2.id;
    this.cityName = para2.city;
    this.toAirpotName = para2.airport_name;
    this.toCityName = para2.city;
    this.toContryName = para2.country;
    this.toFlightList = false;
    setTimeout(() => {
      let datePickerOpen = document.getElementById("datePickerOpen");
      datePickerOpen?.click();
    }, 50);
  }

  swap() {
    var FromData = {
      flightFrom: this.flightDataModify.value.flightfrom,
      fromAirpotName: this.fromAirpotName,
      fromCityName: this.fromCityName,
    };
    this.flightDataModify.value.flightfrom = this.flightDataModify.value.flightto;
    this.fromAirpotName = this.toAirpotName;
    this.fromCityName = this.toCityName;
    localStorage.setItem('fromCity', this.toCityName);
    this.flightDataModify.value.flightto = FromData.flightFrom;
    this.toAirpotName = FromData.fromAirpotName;
    this.toCityName = FromData.fromCityName;
    localStorage.setItem('toCity', FromData.fromCityName);
  }

  //mat date picker
  currentPeriodClicked(datePicker: any) {
    let date = datePicker.target.value
    if (date) {
      setTimeout(() => {
        let openTravellers = document.getElementById('openTravellers')
        openTravellers?.click();
      }, 50);
    }
  }

  onwardRadioChange(i:number,event:any)
  {
    var div = document.getElementById('CompareToFly_'+i);
    if(div)
    {
      if(event.target.checked)
      {
        div.classList.remove('flight-from-hide');
      }
      else{
        div.classList.add('flight-from-hide');
      }
    }
  }
  CheckOnwardRedio(i:number){
    var div = document.getElementById('CompareToFly_'+i);
    if(div)
    {
      if(!div.classList.contains('flight-from-hide'))
      {
        $('#onwardlist_'+i).prop('checked',false)
      }
      else{
        $('#onwardlist_'+i).prop('checked',true)
      }
    }
  }

  onReturnRadioChange(i:number,event:any)
  {
    var div = document.getElementById('Return_CompareToFly_'+i);
    if(div)
    {
      if(event.target.checked)
      {
        div.classList.remove('flight-from-hide');
      }
      else{
        div.classList.add('flight-from-hide');
      }
    }
  }
  CheckreturnRedio(i:number){
    var div = document.getElementById('Return_CompareToFly_'+i);
    if(div)
    {
    if(!div.classList.contains('flight-from-hide'))
    {
      $('#return_roundlist_'+i).prop('checked',false)
    }
    else{
      $('#return_roundlist_'+i).prop('checked',true)
    }
  }
  }

  onSelectOnword(flights:any,item:any,event:any)
  {
    var onwardSelectedFlight = {flights:flights,priceSummery:item};
    this.onwardSelectedFlight = onwardSelectedFlight;
    $(".onwardbuttons").removeClass('button-selected-style');
    $(".onwardbuttons").html('Select');
      var selected = event.target as HTMLElement
      if(selected)
      {
        selected.classList.add('button-selected-style')
        selected.innerHTML = 'Selected'
      }
  }

  onSelectReturn(flights:any,item:any,event:any)
  {
    var returnSelectedFlight = {flights:flights,priceSummery:item}
    this.returnSelectedFlight = returnSelectedFlight;
    $(".returnButtons").removeClass('button-selected-style');
    $(".returnButtons").html('Select');
      var selected = event.target as HTMLElement
      if(selected)
      {
        selected.classList.add('button-selected-style')
        selected.innerHTML = 'Selected'
      }
  }
}
