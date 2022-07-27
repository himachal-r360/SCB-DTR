import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FlightService } from 'src/app/common/flight.service';
import { MY_DATE_FORMATS } from '../flight-list/flight-list.component';
import { Options } from '@angular-slider/ngx-slider';
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
export class FlightRoundtripListComponent implements OnInit ,AfterViewInit ,OnDestroy {

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
  flightListWithOutFilter: any = [];
  flightReturnListWithOutFilter:any = [];
  topPosToStartShowing = 100;
  flightListMod: any;
  RefundableFaresCount: number = 0;
  nonStopCount: number = 0;
  morningDearptureCount: number = 0;
  foodAllowanceCount: number = 0;
  stopsFilterVal: string = ""
  minPrice: number = 0;
  maxPrice: number = 10000;
  resetMinPrice: number = 0;
  resetMaxPrice: number = 10000;
  minStopOver: number = 0;
  maxStopOver: number = 24;
  airlines: any;
  airportsNameJson: any;
  layOverFilterArr: any;
  isMobile:boolean= false
  math = Math;
  options: Options = {
    floor: 0,
    ceil: 1000,
    translate: (value: number): string => {
      return '';
    }
  };
  optionsStopOver: Options = {
    floor: 0,
    ceil: 24,
    translate: (value: number): string => {
      return '';
    }
  };

  flight_PopularItems = [
    { name: 'Refundable_Fares', active: false, value: 'Refundable-Fares', count: 0 },
    { name: 'non_stop', active: false, value: 'non-stop', count: 0 },
    { name: 'Morning_Departures', active: false, value: 'Morning-Departures', count: 0 },
    { name: 'Meals_Included', active: false, value: 'Meals-Included', count: 0 }
  ]
  flight_Timingsitems = [
    { name: '0_6', active: false, value: '00-06', image: '1.png' },
    { name: '6_12', active: false, value: '06-12', image: '2.png' },
    { name: '12_18', active: false, value: '12-18', image: '3.png' },
    { name: '18_0', active: false, value: '18-00', image: '4.png' }
  ]

  flight_return_Timingsitems = [
    { name: '0_6', active: false, value: '00-06', image: '1.png' },
    { name: '6_12', active: false, value: '06-12', image: '2.png' },
    { name: '12_18', active: false, value: '12-18', image: '3.png' },
    { name: '18_0', active: false, value: '18-00', image: '4.png' }
  ]

  stopsFilteritems = [
    { name: 'no_stops', active: false, value: '<p>No <br> stops</p>' },
    { name: '1_stops', active: false, value: '<p>1 <br> stops</p>' },
    { name: '2plus_stops', active: false, value: '<p>2+ <br> stops</p>' }
  ]
  toggleStopsFilteritems = [
    { name: 'All_Flights', active: true, value: 'All Flights' },
    { name: 'no_stops', active: false, value: 'Non-Stop' },
  ]
  priceSortingFilteritems = [
    { name: 'P_L_H', active: true, value: 'Low to High' ,image: './assets/images/icons/price-l.png', sortValue:'Price'},
    { name: 'P_H_L', active: false, value: 'High to Low' , image:'./assets/images/icons/price-l.png',sortValue:'Price' },
    { name: 'D_E', active: false, value: 'Earliest' , image:'/assets/images/icons/Departure.png',sortValue:'Depart'},
    { name: 'D_L', active: false, value: 'Latest' ,image:'/assets/images/icons/Departure.png',sortValue:'Depart'},
    { name: 'D_Short', active: false, value: 'Shortest' ,image:'./assets/images/icons/clock.png',sortValue:'Duration'},
    { name: 'D_Long', active: false, value: 'Longest',image:'./assets/images/icons/clock.png',sortValue:'Duration'},
    { name: 'A_E', active: false, value: 'Earliest',image:'./assets/images/icons/Arrival.png', sortValue:'Arrival'},
    { name: 'A_L', active: false, value: 'Latest',image:'./assets/images/icons/Arrival.png', sortValue:'Arrival'},
  ]

  priceSortingReturnFilteritems = [
    { name: 'P_L_H', active: true, value: 'Low to High' ,image: './assets/images/icons/price-l.png', sortValue:'Price'},
    { name: 'P_H_L', active: false, value: 'High to Low' , image:'./assets/images/icons/price-l.png',sortValue:'Price' },
    { name: 'D_E', active: false, value: 'Earliest' , image:'/assets/images/icons/Departure.png',sortValue:'Depart'},
    { name: 'D_L', active: false, value: 'Latest' ,image:'/assets/images/icons/Departure.png',sortValue:'Depart'},
    { name: 'D_Short', active: false, value: 'Shortest' ,image:'./assets/images/icons/clock.png',sortValue:'Duration'},
    { name: 'D_Long', active: false, value: 'Longest',image:'./assets/images/icons/clock.png',sortValue:'Duration'},
    { name: 'A_E', active: false, value: 'Earliest',image:'./assets/images/icons/Arrival.png', sortValue:'Arrival'},
    { name: 'A_L', active: false, value: 'Latest',image:'./assets/images/icons/Arrival.png', sortValue:'Arrival'},
  ]
  

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
    this.headerHideShow(null)
    this.getCityList();
    this.getFlightIcon();
    this.getAirpotsList();
    this.setSearchFilterData();
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

  //Hide show header 
  headerHideShow(event:any) {
    this.isMobile = window.innerWidth < 991 ?  true : false;
    if(this.isMobile){
      this._flightService.headerHideShow = this._flightService.headerHideShow.style.display = "none"; 
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

  ConvertObjToQueryString(obj: any) {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
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
    this.sub = this._flightService.flightList(this.flightDataModify.value).subscribe((res: any) => {
      this.DocKey = res.response.docKey;
      this.flightList = this.ascPriceSummaryFlighs(res.response.onwardFlights);
      this.ReturnflightList = this.ascPriceSummaryFlighs(res.response.returnFlights);
      this._flightService.flightListData = this.flightList;
      this.flightListWithOutFilter = this.flightList;
      this.flightReturnListWithOutFilter = this.ReturnflightList;
        //It is used for getting min and max price.
        if (this.flightList.length > 0) {
          this.minPrice = this.flightList[0].priceSummary[0].totalFare;
          this.maxPrice = this.flightList[this.flightList.length - 1].priceSummary[0].totalFare;
          this.sliderRange(this, this.minPrice, this.maxPrice);
        }
        
        let query: any = sessionStorage.getItem('searchVal');
        let url = "flight-roundtrip?" + decodeURIComponent(this.ConvertObjToQueryString(JSON.parse(query)));
        this.getAirlinelist();
        this.popularFilterFlightData()
        this.location.replaceState(url);
        this.getQueryParamData(JSON.parse(query));

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

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.Initslider();
      $('.selectpicker').selectpicker();
    }, 200);
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

  airlineFilterFlights(flightList: any) {
    if (flightList.length > 0) {
      let airlineArr: any = [];
      airlineArr = [];
      airlineArr = this.airlines.filter((item: any) => {
        if (item.active == true) {
          return item;
        }
      })
      var filteredAirlines: any[] = [];
      if (airlineArr.length > 0) {
        flightList.forEach((e: any) => {
          var flights = [];
          e.flights.filter((d: any) => {
            if (airlineArr.map(function (x: any) { return x.airlineName; }).indexOf(d.airlineName) > -1) {
              flights.push(d);
            }
          })
          if (flights.length > 0) {
            filteredAirlines.push(e);
          }
        });
        if (filteredAirlines.length > 0) {
          flightList = filteredAirlines;
        }
      }

      //Get AirLines Count
      // if (this.airlines.length > 0) {
      //   this.airlines.filter(function (e: any) { e.flighCount = 0; return e; })
      //   for (let j = 0; j < this.airlines.length; j++) {
      //     flightList.forEach((e: any) => {
      //       e.flights.forEach((d: any, indx: number) => {
      //         if (this.airlines[j].airlineName == d.airlineName && indx == 0) {
      //           this.airlines[j].flighCount += 1;
      //         }
      //       })
      //     });
      //   }
      // }
    }
    return flightList;
  }
  airlineFilterFlightsCount(flightList: any,rerurnflightList: any) {
    if (flightList.length > 0 || rerurnflightList.length>0) {
      let allFlightsList = [...flightList,...rerurnflightList];
      //Get AirLines Count
      if (this.airlines.length > 0) {
        this.airlines.filter(function (e: any) { e.flighCount = 0; return e; });
        for (let j = 0; j < this.airlines.length; j++) {
          allFlightsList.forEach((e: any) => {
            e.flights.forEach((d: any, indx: number) => {
              if (this.airlines[j].airlineName == d.airlineName && indx == 0) {
                this.airlines[j].flighCount += 1;
              }
            })
          });
        }
      }
    }
  }
    // Flight Stops Filter
    FlightStopsFilterFlightData(FlightStopitem: any) {
      FlightStopitem.active = !FlightStopitem.active;
      if(!this.isMobile)
      {
        this.popularFilterFlightData();
      }
  
    }

      /* Reset function Start*/
  //It is used for clear filters of Popular filter
  resetPopularFilter() {

    this.flight_PopularItems.filter((item: any) => { item.active = false; return item; })
    this.popularFilterFlightData();
  }
  resetFlightTimingsFilter() {
    this.flight_Timingsitems.filter((item: any) => { item.active = false; return item; })
    this.popularFilterFlightData();
  }
  resetPriceFilter() {
    this.minPrice = this.resetMinPrice;
    this.maxPrice = this.resetMaxPrice;
    this.Initslider();
    this.popularFilterFlightData();
  }
  resetFlightStopsFilter() {
    this.stopsFilteritems.filter((item: any) => { item.active = false; return item; })
    this.popularFilterFlightData();
  }
  resetAirlineFlightsFilter() {
    this.airlines.filter((item: any) => { item.active = false; return item; })
    this.popularFilterFlightData();
  }
  resetStopOverFilter() {
    this.minStopOver = 0;
    this.maxStopOver = 24;
    this.popularFilterFlightData();
  }
  resetLayOverFilter() {
    this.layOverFilterArr.filter((item: any) => { item.active = false; return item; })
    this.popularFilterFlightData();
  }
  resetAllFilters() {
    this.resetPopularFilter();
    this.resetFlightTimingsFilter();
    this.resetPriceFilter();
    this.resetFlightStopsFilter();
    this.resetAirlineFlightsFilter()
    this.resetStopOverFilter();
    this.resetLayOverFilter();
  }

    //It is used for searching flights with left side filters.
    popularFilterFlightData() {
      
      let updatedflightList: any = [];
      let returnUpdatedFlightList:any = [];
      let flightListWithOutFilter = this.flightListWithOutFilter;
      let flightReturnListWithOutFilter = this.flightReturnListWithOutFilter;
      const flightListConst = flightListWithOutFilter.map((b: any) => ({ ...b }));
      const flightListReturnConst = flightReturnListWithOutFilter.map((b:any) =>({...b}));
      
      this.flightList = flightListConst;
      this.ReturnflightList = flightListReturnConst;
  
      var current_date = new Date(this.departureDate),
        current_year = current_date.getFullYear(),
        current_mnth = current_date.getMonth(),
        current_day = current_date.getDate();
  
      var date1 = new Date(current_year, current_mnth, current_day, 0, 1); // 0:01 AM
      var date2 = new Date(current_year, current_mnth, current_day, 6, 1); // 6:01 AM
  
      //Popular Filter Search Data
      updatedflightList = this.popularFilterFlights(this.flightList);
      returnUpdatedFlightList = this.popularFilterFlights(this.ReturnflightList);
      // returnUpdatedFlightList = this.popularFilterReturnFlights(this.ReturnflightList);
  
      //Departing Timing Filter Data
      updatedflightList = this.timingFilterFlights(updatedflightList);
      
      //Return Departing timing filter Data
      returnUpdatedFlightList = this.timingFilterReturnFlights(returnUpdatedFlightList);
      
  
      //Flight Stops Filter
      updatedflightList = this.stopsFilterFlights(updatedflightList);
      returnUpdatedFlightList = this.stopsFilterFlights(returnUpdatedFlightList);
  
      this.flightList = updatedflightList;
      this.ReturnflightList = returnUpdatedFlightList;
  
      //it is used for getting values of count.
      this.RefundableFaresCount = 0;
      this.nonStopCount = 0;
      this.foodAllowanceCount = 0;
      this.morningDearptureCount = 0;
      let allFlightsList = [...this.flightList,...this.ReturnflightList]
      if (allFlightsList.length > 0) {
        allFlightsList.filter((e: any)  => {
          var flights = e.flights.filter((d: any, indx: number) => { if (d.stops == 0 && indx == 0) { return d; } }); // Non-Stop count
          if (flights.length > 0) {
            this.nonStopCount += 1;
            this.flight_PopularItems.filter((item: any) => {
              if (item.name == "non_stop") {
                item.count = this.nonStopCount
              }
            })
          }
          var flights = e.priceSummary.filter((d: any) => { if (d.refundStatus == 1) { return d; } }); // Refundable Fares Count
          if (flights.length > 0) {
            this.RefundableFaresCount += 1;
            this.flight_PopularItems.filter((item: any) => {
              if (item.name == "Refundable_Fares") {
                item.count = this.RefundableFaresCount
              }
            })
          }
          var flights = e.priceSummary.filter((d: any) => { if (d.foodAllowance != null) { return d; } });// Meals Included Count
          if (flights.length > 0) {
            this.foodAllowanceCount += 1;
          }
  
          var flights = e.flights.filter((d: any) => {
  
            if ((this.flight_Timingsitems.filter((item: any) => { if (item.name == "0_6") { return item; } }).length > 0) && new Date(d.departureDateTime) > date1 && new Date(d.departureDateTime) < date2) {
              return e;
            }
          }) // Meals Included Count
  
          if (flights.length > 0) {
            this.morningDearptureCount += 1;
            this.flight_PopularItems.filter((item: any) => {
              if (item.name == "Morning_Departures") {
                item.count = this.morningDearptureCount
              }
            })
          }
        })
  
        //Ascending Descending Order
        this.priceSortingFilteritems.filter((item: any) => {
          if (item.name == 'P_L_H' && item.active == true) {
            this.flightList.sort((a: any, b: any) => a.priceSummary[0].totalFare - b.priceSummary[0].totalFare);
          }
          else if (item.name == 'P_H_L' && item.active == true) {
            this.flightList.sort((a: any, b: any) => b.priceSummary[0].totalFare - a.priceSummary[0].totalFare);
          }
          else if (item.name == 'D_Short' && item.active == true) {
            this.flightList.sort((a: any, b: any) => a.flights[0].duration - b.flights[0].duration);
          }
          else if (item.name == 'D_Long' && item.active == true) {
            this.flightList.sort((a: any, b: any) => b.flights[0].duration - a.flights[0].duration);
          }
          else if (item.name == 'D_E' && item.active == true) {
            this.flightList.sort((a: any, b: any) => new Date(a.flights[0].departureDateTime).getTime() - new Date(b.flights[0].departureDateTime).getTime());
          }
          else if (item.name == 'D_L' && item.active == true) {
          this.flightList.sort((a: any, b: any) => new Date(b.flights[0].departureDateTime).getTime() - new Date(a.flights[0].departureDateTime).getTime());
          }
          else if (item.name == 'A_E' && item.active == true) {
            this.flightList.sort((a: any, b: any) => new Date(a.flights[0].arrivalDateTime).getTime() - new Date(b.flights[0].arrivalDateTime).getTime());
          }
          else if (item.name == 'A_L' && item.active == true) {
            this.flightList.sort((a: any, b: any) => new Date(b.flights[0].arrivalDateTime).getTime() - new Date(a.flights[0].arrivalDateTime).getTime());
          }
        })

        //Ascending Descending return shorting Order
        this.priceSortingReturnFilteritems.filter((item: any) => {
          if (item.name == 'P_L_H' && item.active == true) {
            this.ReturnflightList.sort((a: any, b: any) => a.priceSummary[0].totalFare - b.priceSummary[0].totalFare);
          }
          else if (item.name == 'P_H_L' && item.active == true) {
            this.ReturnflightList.sort((a: any, b: any) => b.priceSummary[0].totalFare - a.priceSummary[0].totalFare);
          }
          else if (item.name == 'D_Short' && item.active == true) {
            this.ReturnflightList.sort((a: any, b: any) => a.flights[0].duration - b.flights[0].duration);
          }
          else if (item.name == 'D_Long' && item.active == true) {
            this.ReturnflightList.sort((a: any, b: any) => b.flights[0].duration - a.flights[0].duration);
          }
          else if (item.name == 'D_E' && item.active == true) {
            this.ReturnflightList.sort((a: any, b: any) => new Date(a.flights[0].departureDateTime).getTime() - new Date(b.flights[0].departureDateTime).getTime());
          }
          else if (item.name == 'D_L' && item.active == true) {
          this.ReturnflightList.sort((a: any, b: any) => new Date(b.flights[0].departureDateTime).getTime() - new Date(a.flights[0].departureDateTime).getTime());
          }
          else if (item.name == 'A_E' && item.active == true) {
            this.ReturnflightList.sort((a: any, b: any) => new Date(a.flights[0].arrivalDateTime).getTime() - new Date(b.flights[0].arrivalDateTime).getTime());
          }
          else if (item.name == 'A_L' && item.active == true) {
            this.ReturnflightList.sort((a: any, b: any) => new Date(b.flights[0].arrivalDateTime).getTime() - new Date(a.flights[0].arrivalDateTime).getTime());
          }
        })
              
      }
      // Airlines Filter
      this.flightList = this.airlineFilterFlights(this.flightList);
      this.ReturnflightList = this.airlineFilterFlights(this.ReturnflightList);
      this.airlineFilterFlightsCount(this.flightList,this.ReturnflightList);
      //StopOverFilter
      if (this.flightList.length > 0) {
        var start = this.minStopOver;
        var end = this.maxStopOver;
        var filteredStopOver: any[] = [];
        this.flightList.forEach((e: any) => {
          var flights = [];
          e.flights.forEach((d: any) => {
            if ((d.duration / 60) / 60 >= start && (d.duration / 60 / 60) <= end) {
              flights.push(d);
            }
          })
          if (flights.length > 0) {
            filteredStopOver.push(e);
          }
        });
        this.flightList = filteredStopOver;
      }

      //StopOverFilter return
      if (this.ReturnflightList.length > 0) {
        var start = this.minStopOver;
        var end = this.maxStopOver;
        var filteredStopOver: any[] = [];
        this.ReturnflightList.forEach((e: any) => {
          var flights = [];
          e.flights.forEach((d: any) => {
            if ((d.duration / 60) / 60 >= start && (d.duration / 60 / 60) <= end) {
              flights.push(d);
            }
          })
          if (flights.length > 0) {
            filteredStopOver.push(e);
          }
        });
        this.ReturnflightList = filteredStopOver;
      }
  
      //PriceFilter
      if (this.flightList.length > 0) {
        var min_price = this.minPrice;
        var max_price = this.maxPrice;
        var filteredPrice: any[] = [];
        this.flightList.filter((e: any) => {
          if (e.priceSummary.length > 0) {
            if (e.priceSummary[0].totalFare >= min_price && e.priceSummary[0].totalFare <= max_price) {
              filteredPrice.push(e);
            }
          }
        });
        this.flightList = filteredPrice;
      }

      //PriceFilter return
      if (this.ReturnflightList.length > 0) {
       var min_price = this.minPrice;
       var max_price = this.maxPrice;
       var filteredPrice: any[] = [];
       this.ReturnflightList.filter((e: any) => {
         if (e.priceSummary.length > 0) {
           if (e.priceSummary[0].totalFare >= min_price && e.priceSummary[0].totalFare <= max_price) {
             filteredPrice.push(e);
           }
         }
       });
       this.ReturnflightList = filteredPrice;
     }
  
      //Airline Filter
      this.flightList = this.airlineFilterFlights(this.flightList);
      this.ReturnflightList = this.airlineFilterFlights(this.ReturnflightList);
  
      // Layover Filter Flights
      this.flightList = this.layoverFilterFlights(this.flightList);
      this.ReturnflightList = this.layoverFilterFlights(this.ReturnflightList);
    }



    Initslider() {
      var $that = this;
      $that.sliderRange($that, $that.minPrice, $that.maxPrice);
    }
  
    sliderRange($that: this, minPrice: number, maxPrice: number) {
      $that.options = {
        floor: minPrice,
        ceil: maxPrice,
        translate: (value: number): string => {
          return '';
        }
      };
      this.resetMinPrice = minPrice;
      this.resetMaxPrice = maxPrice;
    }


  //Popular Filter Flights
  popularFilterFlights(flightList: any) {
    // this.flightList = flightList;
    let updatedflightList = [];
    let isfilterRefundableFares: any = false;
    let isfilterNonStop: any = false;
    let isfilterMealsIncluded: any = false;

    this.flight_PopularItems.filter((item: any) => {
      if (item.active == true && item.name == "Refundable_Fares") { isfilterRefundableFares = true }
      if (item.active == true && item.name == "non_stop") { isfilterNonStop = true }
      if (item.active == true && item.name == "Meals_Included") { isfilterMealsIncluded = true }
    })
    for (let i = 0; i < flightList.length; i++) {
      let singleFlightList = [];
      singleFlightList = flightList[i].flights;

      let isNonStop = false;
      let isRefundableFares = false;
      let isMealsInclude = false;

      if (singleFlightList != null && singleFlightList != undefined) {
        if (isfilterNonStop == true || isfilterRefundableFares == true || isfilterMealsIncluded == true) {
          if (isfilterNonStop == true) {
            if (singleFlightList[0].stops == 0) {
              isNonStop = true;
            }
          }
          if (isfilterRefundableFares == true) {
            if (flightList[i].priceSummary.filter(function (e: any) { if (e.refundStatus == 1) { return e } }).length > 0) {
              isRefundableFares = true;
            }
          }
          if (isfilterMealsIncluded == true) {
            let singleFlightPriceSummaryMeal = []
            singleFlightPriceSummaryMeal = flightList[i].priceSummary.filter(function (e: any) { if (e.foodAllowance != "null") { return e } });
            if (singleFlightPriceSummaryMeal.length > 0) {
              flightList[i].priceSummary = [];
              flightList[i].priceSummary = singleFlightPriceSummaryMeal;
              isMealsInclude = true;
            }
          }
          if (isNonStop == true || isRefundableFares == true || isMealsInclude == true) {
            updatedflightList.push(flightList[i]);
          }
        }
        else {
          updatedflightList.push(flightList[i]);
        }
      }
    }
    return updatedflightList;
  }

    //Popular Filter return Flights
    popularFilterReturnFlights(returnFlightList: any) {
      // this.ReturnflightList = returnFlightList;
      let updatedflightList = [];
      let isfilterRefundableFares: any = false;
      let isfilterNonStop: any = false;
      let isfilterMealsIncluded: any = false;
  
      this.flight_PopularItems.filter((item: any) => {
        if (item.active == true && item.name == "Refundable_Fares") { isfilterRefundableFares = true }
        if (item.active == true && item.name == "non_stop") { isfilterNonStop = true }
        if (item.active == true && item.name == "Meals_Included") { isfilterMealsIncluded = true }
      })
      for (let i = 0; i < returnFlightList.length; i++) {
        let singleFlightList = [];
        singleFlightList = returnFlightList[i].flights;
  
        let isNonStop = false;
        let isRefundableFares = false;
        let isMealsInclude = false;
  
        if (singleFlightList != null && singleFlightList != undefined) {
          if (isfilterNonStop == true || isfilterRefundableFares == true || isfilterMealsIncluded == true) {
            if (isfilterNonStop == true) {
              if (singleFlightList[0].stops == 0) {
                isNonStop = true;
              }
            }
            if (isfilterRefundableFares == true) {
              if (returnFlightList[i].priceSummary.filter(function (e: any) { if (e.refundStatus == 1) { return e } }).length > 0) {
                isRefundableFares = true;
              }
            }
            if (isfilterMealsIncluded == true) {
              let returnFlightPriceSummaryMeal = []
              returnFlightPriceSummaryMeal = returnFlightList[i].priceSummary.filter(function (e: any) { if (e.foodAllowance != "null") { return e } });
              if (returnFlightPriceSummaryMeal.length > 0) {
                returnFlightList[i].priceSummary = [];
                returnFlightList[i].priceSummary = returnFlightPriceSummaryMeal;
                isMealsInclude = true;
              }
            }
            if (isNonStop == true || isRefundableFares == true || isMealsInclude == true) {
              updatedflightList.push(returnFlightList[i]);
            }
          }
          else {
            updatedflightList.push(returnFlightList[i]);
          }
        }
      }
      return updatedflightList;
    }

    //Timing Filter Flights
    timingFilterFlights(flightList: any) {
      //this.flightList = flightList;
      let updatedflightList: any = [];
      let isfilterMorningDepartures: any = false;
      let isfilterFlightTiming = false;
      var current_date = new Date(this.departureDate),
        current_year = current_date.getFullYear(),
        current_mnth = current_date.getMonth(),
        current_day = current_date.getDate();
  
      var date1 = new Date(current_year, current_mnth, current_day, 0, 1); // 0:01 AM
      var date2 = new Date(current_year, current_mnth, current_day, 6, 1); // 6:01 AM
      var date3 = new Date(current_year, current_mnth, current_day, 12, 1); // 12:01 PM
      var date4 = new Date(current_year, current_mnth, current_day, 18, 1); // 18:01 PM
      var date5 = new Date(current_year, current_mnth, current_day, 23, 59); // 23:59 PM
  
      this.flight_PopularItems.filter((item) => {
        if (item.name == "Morning_Departures" && item.active == true) {
          isfilterMorningDepartures = true;
        }
      })
      let isTimingFilterItems = this.flight_Timingsitems.filter((item: any) => {
        if (item.active == true) {
          return item;
        }
      })
      if (isTimingFilterItems.length > 0) {
        isfilterFlightTiming = true;
      }
      //Flight Timing Filter
      if (isfilterFlightTiming == true || isfilterMorningDepartures == true) {
        var filteredTimingArr: any[] = [];
        if (flightList.length > 0) {
          flightList.filter((d: any) => {
            let singleFlightTiming = [];
            singleFlightTiming = d.flights.filter(function (e: any, indx: number) {
              if (indx == 0) {
                if ((isTimingFilterItems.filter((item: any) => { if (item.active == true && item.name == "0_6") { return item; } }).length > 0) && new Date(e.departureDateTime) > date1 && new Date(e.departureDateTime) < date2) {
                  return e;
                }
                else if ((isTimingFilterItems.filter((item: any) => { if (item.active == true && item.name == "6_12") { return item; } }).length > 0) && new Date(e.departureDateTime) > date2 && new Date(e.departureDateTime) < date3) {
                  return e;
                }
                else if ((isTimingFilterItems.filter((item: any) => { if (item.active == true && item.name == "12_18") { return item; } }).length > 0) && new Date(e.departureDateTime) > date3 && new Date(e.departureDateTime) < date4) {
                  return e;
                }
                else if ((isTimingFilterItems.filter((item: any) => { if (item.active == true && item.name == "18_0") { return item; } }).length > 0) && new Date(e.departureDateTime) > date4 && new Date(e.departureDateTime) < date5) {
                  return e;
                }
              }
            });
            if (singleFlightTiming.length > 0) {
              filteredTimingArr.push(d);
            }
          });
        }
        updatedflightList = filteredTimingArr;
      }
      else {
        updatedflightList = flightList;
      }
      return updatedflightList;
    }

    // Return timing flight 
    timingFilterReturnFlights(returnFlightList: any) {
      this.ReturnflightList = returnFlightList;
      let updatedflightList: any = [];
      let isfilterMorningDepartures: any = false;
      let isfilterFlightTiming = false;
      var current_date = new Date(this.returnDate),
        current_year = current_date.getFullYear(),
        current_mnth = current_date.getMonth(),
        current_day = current_date.getDate();
  
      var date1 = new Date(current_year, current_mnth, current_day, 0, 1); // 0:01 AM
      var date2 = new Date(current_year, current_mnth, current_day, 6, 1); // 6:01 AM
      var date3 = new Date(current_year, current_mnth, current_day, 12, 1); // 12:01 PM
      var date4 = new Date(current_year, current_mnth, current_day, 18, 1); // 18:01 PM
      var date5 = new Date(current_year, current_mnth, current_day, 23, 59); // 23:59 PM
  
      this.flight_PopularItems.filter((item) => {
        if (item.name == "Morning_Departures" && item.active == true) {
          isfilterMorningDepartures = true;
        }
      })
      let isTimingFilterItems = this.flight_return_Timingsitems.filter((item: any) => {
        if (item.active == true) {
          return item;
        }
      })
      if (isTimingFilterItems.length > 0) {
        isfilterFlightTiming = true;
      }
      //Flight Timing Filter
      if (isfilterFlightTiming == true || isfilterMorningDepartures == true) {
        var filteredTimingArr: any[] = [];
        if (returnFlightList.length > 0) {
          returnFlightList.filter((d: any) => {
            let singleFlightTiming = [];
            singleFlightTiming = d.flights.filter(function (e: any, indx: number) {
              if (indx == 0) {
                if ((isTimingFilterItems.filter((item: any) => { if (item.active == true && item.name == "0_6") { return item; } }).length > 0) && new Date(e.departureDateTime) > date1 && new Date(e.departureDateTime) < date2) {
                  return e;
                }
                else if ((isTimingFilterItems.filter((item: any) => { if (item.active == true && item.name == "6_12") { return item; } }).length > 0) && new Date(e.departureDateTime) > date2 && new Date(e.departureDateTime) < date3) {
                  return e;
                }
                else if ((isTimingFilterItems.filter((item: any) => { if (item.active == true && item.name == "12_18") { return item; } }).length > 0) && new Date(e.departureDateTime) > date3 && new Date(e.departureDateTime) < date4) {
                  return e;
                }
                else if ((isTimingFilterItems.filter((item: any) => { if (item.active == true && item.name == "18_0") { return item; } }).length > 0) && new Date(e.departureDateTime) > date4 && new Date(e.departureDateTime) < date5) {
                  return e;
                }
              }
            });
            if (singleFlightTiming.length > 0) {
              filteredTimingArr.push(d);
            }
          });
        }
        updatedflightList = filteredTimingArr;
      }
      else {
        updatedflightList = returnFlightList;
      }
      return updatedflightList;
    }

     

  //layover airport filter
  layoverFilterFlights(flightList: any) {
    if (flightList.length > 0) {
      let layoverArr: any = [];
      layoverArr = this.layOverFilterArr.filter((item: any) => {
        if (item.active == true) {
          return item;
        }
      })
      var filteredLayovers: any[] = [];
      if (layoverArr.length > 0) {
        flightList.forEach((e: any) => {
          var flights = [];
          e.flights.filter((d: any) => {
            if (layoverArr.map(function (x: any) { return x.arrivalAirportCode; }).indexOf(d.arrivalAirport) > -1) {
              flights.push(d);
            }
          })
          if (flights.length > 0) {
            filteredLayovers.push(e);
          }
        });
        flightList = filteredLayovers;
      }
    }
    return flightList;
  }

   // Flight popular filter
   FlightPopularFilterFlightData(popularItems: any) {
    popularItems.active = !popularItems.active;
    if (popularItems.name == "Morning_Departures") {
      this.flight_Timingsitems.filter((item: any) => { if (item.name == "0_6") { item.active = !item.active; return item; } })
      this.flight_return_Timingsitems.filter((item: any) => { if (item.name == "0_6") { item.active = !item.active; return item; } })
    }
    if (popularItems.name == "non_stop") {
      this.stopsFilteritems.filter((item: any) => { if (item.name == "non_stop") { item.active = !item.active; return item; } })
    }
    if(!this.isMobile)
    {
      this.popularFilterFlightData();
    }

  }

    // Flight Timings Filter
    FlightTimingsFilterFlightData(timingsItems: any) {
      timingsItems.active = !timingsItems.active;
      if (timingsItems.name == "0_6") {
        this.flight_PopularItems.filter((item: any) => { if (item.name == "Morning_Departures") { item.active; return item; } })
      }
      if(!this.isMobile)
      {
      this.popularFilterFlightData();
      }
    }

    // Flight timing return filter
    FlightTimingsRetrunFilterFlightData(timingsItems: any) {
      timingsItems.active = !timingsItems.active;
      if (timingsItems.name == "0_6") {
        this.flight_return_Timingsitems.filter((item: any) => { if (item.name == "Morning_Departures") { item.active; return item; } })
      }
      if(!this.isMobile)
      {
      this.popularFilterFlightData();
      
      }
    }

    flightAirlineFilterFlightData(airlineItem: any) {
      airlineItem.active = !airlineItem.active;
      if(!this.isMobile)
      {
      this.popularFilterFlightData();
      }
    }

    flightLayoverFilterFlightData(layoverItem: any) {
      layoverItem.active = !layoverItem.active;
      if(!this.isMobile)
      {
      this.popularFilterFlightData();
      }
    }
  

  // get airlines list and lowest price
  getAirlinelist() {
    let airlineNameArr = [];
    let layOverArr = [];
    // let concatFlights:any = []
    let mergeFlightList = [...this.flightList,...this.ReturnflightList];
    // let mergeFlightList = concatFlights.concat(this.flightList,this.ReturnflightList);
    for (let j = 0; j < mergeFlightList.length; j++) {
      let singleFlightList = [];
      singleFlightList = mergeFlightList[j].flights;
      let priceSummaryList = mergeFlightList[j].priceSummary;
      let priceSummary;
      for (let h = 0; h < singleFlightList.length; h++) {
        let airlineName = singleFlightList[h].airlineName;
        let arrivalAirportCode = singleFlightList[h].arrivalAirport
        if (h < singleFlightList.length) {
          if (layOverArr.filter((d: any) => { if (d.arrivalAirportCode == arrivalAirportCode && d.price <= priceSummaryList[0].totalFare) { return d; } }).length < 1) {
            if (this.airportsNameJson != null) {
              let layOverFilterObj = {
                "arrivalAirportCode": arrivalAirportCode,
                "arrivalAirport": this.airportsNameJson[singleFlightList[h].arrivalAirport].airport_name,
                "price": priceSummaryList[0].totalFare,
                "active": false
              };
              layOverArr.push(layOverFilterObj);
            }
          }
        }
        for (let p = 0; p < priceSummaryList.length; p++) {
          priceSummary = priceSummaryList[p].totalFare
          if (airlineNameArr.filter((d: any) => { if (d.airlineName == airlineName) { return d; } }).length < 1) {
            if (airlineNameArr.filter((d: any) => { if (d.priceSummary) { return d; } }).length < 1) {
              let airlineNameObj = {
                "airlineName": airlineName,
                "price": priceSummary,
                "flighCount": 0,
                "active": false
              };
              airlineNameArr.push(airlineNameObj);
            }
          }
        }
      }
    }
    this.airlines = airlineNameArr;
    this.layOverFilterArr = layOverArr;
  }

    //stops Filter Flights
    stopsFilterFlights(flightList: any) {
      this.flightList = flightList;
      let updatedflightList: any = [];
      let isfilterFlightStops = false;
      let isStopsFilterItems = this.stopsFilteritems.filter((item: any) => {
        if (item.active == true) {
          return item;
        }
      })
      if (isStopsFilterItems.length > 0) {
        isfilterFlightStops = true;
      }
      if (isfilterFlightStops == true) {
        var filteredStopsArr: any[] = [];
        if (flightList.length > 0) {
          flightList.filter((d: any) => {
            let singleFlightStops = [];
            singleFlightStops = d.flights.filter(function (e: any, indx: number) {
              if (indx == 0) {
                //0 - no_stops
                if ((isStopsFilterItems.filter((item: any) => { if (item.active == true && item.name == "no_stops") { return item; } }).length > 0) && e.stops == 0) {
                  return e;
                }
                //0 - no_stops
                if ((isStopsFilterItems.filter((item: any) => { if (item.active == true && item.name == "1_stops") { return item; } }).length > 0) && e.stops == 1) {
                  return e;
                }
                //0 - no_stops
                if ((isStopsFilterItems.filter((item: any) => { if (item.active == true && item.name == "2plus_stops") { return item; } }).length > 0) && e.stops > 1) {
                  return e;
                }
              }
            });
            if (singleFlightStops.length > 0) {
              filteredStopsArr.push(d);
            }
          });
        }
        updatedflightList = filteredStopsArr;
      }
      else {
        updatedflightList = flightList;
      }
      return updatedflightList;
    }

    onMinValueChange(event: any) {
      this.minPrice = event;
      if (this.minPrice != null) {
        if(!this.isMobile)
        {
          this.popularFilterFlightData();
        }
  
      }
    }
    onMaxValueChange(event: any) {
      this.maxPrice = event;
      if (this.maxPrice != null) {
        if(!this.isMobile)
        {
        this.popularFilterFlightData();
        }
      }
      if(!this.isMobile)
      {
      this.popularFilterFlightData();
      }
    }
  
    onMinStopOverChange(event: any) {
      this.minStopOver = event;
      if(!this.isMobile)
      {
      this.popularFilterFlightData();
      }
    }
    onMaxStopOverChange(event: any) {
      this.maxStopOver = event;
      if(!this.isMobile)
      {
      this.popularFilterFlightData();
      }
    }
  

    searchNonStop(item: any) {
      this.toggleStopsFilteritems.filter((itemp: any) => {
        itemp.active = false;
        return itemp;
      })
      item.active = !item.active;
      if (item.name == "no_stops" && item.active == true) {
        this.stopsFilteritems.filter((itemp: any) => {
          if (item.name == "no_stops" && itemp.name == "no_stops" && item.active == true) {
            itemp.active = true;
          }
        })
      }
      else if (item.name == "All_Flights") {
        this.stopsFilteritems.filter((itemp: any) => {
          if (itemp.name == "no_stops") {
            itemp.active = false;
          }
        })
      }
      this.popularFilterFlightData();
    }
  
  

  flightAcsDescFilterFlightData(event: any) {
    let selectedVal = event.target.value;
    this.priceSortingFilteritems.filter((item: any) => {
      item.active = false;
      if (item.name == selectedVal) {
        item.active = true;
      }
      return item;
    })
    this.popularFilterFlightData();
  }

  flightAcsDescFilterReturnFlightData(event: any) {
    let selectedVal = event.target.value;
    this.priceSortingReturnFilteritems.filter((item: any) => {
      item.active = false;
      if (item.name == selectedVal) {
        item.active = true;
      }
      return item;
    })
    this.popularFilterFlightData();
  }


    // get airport list
    getAirpotsList() {
      this._flightService.getAirportName().subscribe((res: any) => {
        this.airportsNameJson = res;
      })
    }

    ngOnDestroy(): void {
      this.sub?.unsubscribe();
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
