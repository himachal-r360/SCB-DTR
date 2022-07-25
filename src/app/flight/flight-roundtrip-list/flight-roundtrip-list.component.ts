import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FlightService } from 'src/app/common/flight.service';
import { MY_DATE_FORMATS } from '../flight-list/flight-list.component';
import { SimpleGlobal } from 'ng2-simple-global';
import {environment} from '../../../environments/environment';
@Component({
  selector: 'app-flight-roundtrip-list',
  templateUrl: './flight-roundtrip-list.component.html',
  styleUrls: ['./flight-roundtrip-list.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class FlightRoundtripListComponent implements OnInit {
  cdnUrl: any;
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

  constructor(private _flightService: FlightService, private _fb: FormBuilder, public route: ActivatedRoute, private router: Router,private sg: SimpleGlobal ) { 
    this.cdnUrl = environment.cdnUrl+this.sg['assetPath']; 
  
  }

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
    this.flightDataModify.value.departure = this.flightDataModify.value.departure.getFullYear() + '-' + (this.flightDataModify.value.departure.getMonth() + 1) + '-' + this.flightDataModify.value.departure.getDate();

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

    }, (error) => { console.log(error) });
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

}
