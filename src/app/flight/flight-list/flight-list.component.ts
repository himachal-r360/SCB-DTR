import { AfterViewInit, Component, ElementRef, HostListener, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { retry, Subscription, timeInterval, window } from 'rxjs';
import { FlightService } from 'src/app/common/flight.service';
import { DOCUMENT, Location, ViewportScroller } from '@angular/common';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { Options } from '@angular-slider/ngx-slider';
import { SELECT_ITEM_HEIGHT_EM } from '@angular/material/select/select';
import { SimpleGlobal } from 'ng2-simple-global';
import {environment} from '../../../environments/environment';
import { StyleManagerService } from 'src/app/shared/services/style-manager.service';
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

declare var $: any;

@Component({
  selector: 'app-flight-list',
  templateUrl: './flight-list.component.html',
  styleUrls: ['./flight-list.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class FlightListComponent implements OnInit, AfterViewInit, OnDestroy {
  flightList: any = [];
  newDate = Date();
  loader = false;
  fromCityName: any;
  toCityName: any;
  depart: any;
  flightClassVal: any;
  adultsVal: any;
  childVal: any;
  infantsVal: any;

  sub?: Subscription;
  show = false;
  SearchCityName: any;
  cityList: any;
  fromFlightList = false;
  toFlightList = false;
  selectedDate?: any;
  cityName: any;
  fromAirpotName: any = 'from airport';
  toAirpotName: any = 'to airport';
  searchData: any;
  EMIAvailableLimit: number = 3000;
  EMI_interest: number = 16;
  departureDate: any;
  returnDate: any;
  oneWayDate: any;
  // flightListDate = this._flightService.flightListDate;
  flightListDate: any;
  totalPassenger: number = 1;
  disableParent: boolean = false;
  disablechildren: boolean = false;
  disableinfants: boolean = false;
  flightTimingfrom: any;
  flightTimingto: any;
  viewFare = false;
  showMoreAirline = false;
  showLessAirline = true;
  showLessLayover = true;
  showMoreLayover = false;
  hideShowModal = false;
  showScroll?:boolean;
  topPosToStartShowing = 100;
  flightListMod: any;
  RefundableFaresCount: number = 0;
  nonStopCount: number = 0;
  morningDearptureCount: number = 0;
  foodAllowanceCount: number = 0;
  stopsFilterVal: string = ""
  DocKey: any;
  loaderValue = 10;
  @ViewChild('bookingprocess') bookingprocess: any;
  @ViewChild('toCityInput') toCityInput!: ElementRef;
  @HostListener("window:scroll", [])

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
  refundFilterStatus: boolean = false;
  flightListWithOutFilter: any = [];
  minPrice: number = 0;
  maxPrice: number = 10000;
  resetMinPrice: number = 0;
  resetMaxPrice: number = 10000;
  minStopOver: number = 0;
  maxStopOver: number = 24;
  airlines: any;
  flightIcons: any;
  airportsNameJson: any;
  layOverFilterArr: any;
  queryFlightData: any;
  fromContryName: any;
  toContryName: any;
  minDate = new Date();
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
    { name: 'P_L_H', active: true, value: 'Price Low to High' },
    { name: 'P_H_L', active: false, value: 'Price High to Low' },
    { name: 'D_E', active: false, value: 'Depart Earliest' },
    { name: 'D_L', active: false, value: 'Depart Latest' },
    { name: 'D_Short', active: false, value: 'Duration Shortest'},
    { name: 'D_Long', active: false, value: 'Duration Longest'},
    { name: 'A_E', active: false, value: 'Arrival Earliest'},
    { name: 'A_L', active: false, value: 'Arrival Latest'},
  ]
  cdnUrl: any;
  constructor(  public _styleManager: StyleManagerService,private _flightService: FlightService, private _fb: FormBuilder, public route: ActivatedRoute, private router: Router, private location: Location, private sg: SimpleGlobal)  {
     this.cdnUrl = environment.cdnUrl+this.sg['assetPath']; 
  
       this._styleManager.setStyle('bootstrap-select', `assets/css/bootstrap-select.min.css`);
       this._styleManager.setScript('bootstrap-select', `assets/js/bootstrap-select.min.js`);
       this._styleManager.setScript('custom', `assets/js/custom.js`);
       
  }
  ngOnInit(): void {

    this.loader = true;
    this.getQueryParamData(null);
    this.flightList = this._flightService.flightListData;
    this.getCityList();
    //this.getFlightIcon();
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

  flightDetailsTab(obj: any, value: string, indx: number) {
    var dashboard_menu_type = value;
    $('.flight-extra-content').hide();
    $('.flight-extra-tabs li a').removeClass('flight-extra-tabs-active');
    $('#' + dashboard_menu_type + "_" + indx).show();
    $("#CompareToFly_" + indx + " a[value=" + value + "]").addClass("flight-extra-tabs-active");
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.Initslider();
      //$('.selectpicker').selectpicker();
    }, 200);
  }
  setSearchFilterData() {
    this.searchData = sessionStorage.getItem('searchVal');
    let searchObj = JSON.parse(this.searchData);
    this.fromCityName = searchObj.fromCity; //searchObj.flightfrom;
    this.toCityName = searchObj.toCity;//localStorage.getItem('toCity');
    this.departureDate = new Date(searchObj.departure);

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
    this.totalPassenger =
      parseInt(this.adultsVal) +
      parseInt(this.childVal) +
      parseInt(this.infantsVal);
  }

  getCityList() {
    this.sub = this._flightService
      .getCityList(this.SearchCityName)
      .subscribe((res: any) => {
        this.cityList = res.hits.hits;
      });
  }

  // Get flight Icons
  getFlightIcon() {
    this._flightService.getFlightIcon().subscribe((res: any) => {
      this.flightIcons = res;
    })
  }

  // get airport list
  getAirpotsList() {
    this._flightService.getAirportName().subscribe((res: any) => {
      this.airportsNameJson = res;

    })
  }

  showmoreAirline() {
    this.showLessAirline = false
    this.showMoreAirline = true;
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


  convertDate(str: any) {
    var date = new Date(str),
      mnth = ('0' + (date.getMonth() + 1)).slice(-2),
      day = ('0' + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join('-');
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

  // Flight popular filter
  FlightPopularFilterFlightData(popularItems: any) {
    popularItems.active = !popularItems.active;
    if (popularItems.name == "Morning_Departures") {
      this.flight_Timingsitems.filter((item: any) => { if (item.name == "0_6") { item.active = !item.active; return item; } })
    }
    if (popularItems.name == "non_stop") {
      this.stopsFilteritems.filter((item: any) => { if (item.name == "non_stop") { item.active = !item.active; return item; } })
    }
    this.popularFilterFlightData();
  }
  // Flight Timings Filter
  FlightTimingsFilterFlightData(timingsItems: any) {
    timingsItems.active = !timingsItems.active;
    if (timingsItems.name == "0_6") {
      this.flight_PopularItems.filter((item: any) => { if (item.name == "Morning_Departures") { item.active; return item; } })
    }
    this.popularFilterFlightData();
  }

  flightAirlineFilterFlightData(airlineItem: any) {
    airlineItem.active = !airlineItem.active;
    this.popularFilterFlightData();
  }
  flightLayoverFilterFlightData(layoverItem: any) {
    layoverItem.active = !layoverItem.active;
    this.popularFilterFlightData();
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
  /* Reset function end*/

  // Flight Stops Filter
  FlightStopsFilterFlightData(FlightStopitem: any) {
    FlightStopitem.active = !FlightStopitem.active;
    this.popularFilterFlightData();
  }

  //It is used for searching flights with left side filters.
  popularFilterFlightData() {

    let updatedflightList: any = [];

    let flightListWithOutFilter = this.flightListWithOutFilter;
    const flightListConst = flightListWithOutFilter.map((b: any) => ({ ...b }));
    this.flightList = flightListConst;

    var current_date = new Date(this.departureDate),
      current_year = current_date.getFullYear(),
      current_mnth = current_date.getMonth(),
      current_day = current_date.getDate();

    var date1 = new Date(current_year, current_mnth, current_day, 0, 1); // 0:01 AM
    var date2 = new Date(current_year, current_mnth, current_day, 6, 1); // 6:01 AM

    //Popular Filter Search Data
    updatedflightList = this.popularFilterFlights(this.flightList);

    //Timing Filter Data
    updatedflightList = this.timingFilterFlights(updatedflightList);

    //Flight Stops Filter
    updatedflightList = this.stopsFilterFlights(updatedflightList);

    this.flightList = updatedflightList;

    //it is used for getting values of count.
    this.RefundableFaresCount = 0;
    this.nonStopCount = 0;
    this.foodAllowanceCount = 0;
    this.morningDearptureCount = 0;
    if (this.flightList.length > 0) {
      this.flightList.filter((e: any) => {
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
    }

    // Airlines Filter
    this.flightList = this.airlineFilterFlights(this.flightList);

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

    //Airline Filter
    this.flightList = this.airlineFilterFlights(this.flightList);

    // Layover Filter Flights
    this.flightList = this.layoverFilterFlights(this.flightList);


  }

  //Popular Filter Flights
  popularFilterFlights(flightList: any) {

    this.flightList = flightList;
    let updatedflightList = [];
    let isfilterRefundableFares: any = false;
    let isfilterNonStop: any = false;
    let isfilterMealsIncluded: any = false;

    this.flight_PopularItems.filter((item: any) => {
      if (item.active == true && item.name == "Refundable_Fares") { isfilterRefundableFares = true }
      if (item.active == true && item.name == "non_stop") { isfilterNonStop = true }
      if (item.active == true && item.name == "Meals_Included") { isfilterMealsIncluded = true }
    })
    for (let i = 0; i < this.flightList.length; i++) {
      let singleFlightList = [];
      singleFlightList = this.flightList[i].flights;

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
            if (this.flightList[i].priceSummary.filter(function (e: any) { if (e.refundStatus == 1) { return e } }).length > 0) {
              isRefundableFares = true;
            }
          }
          if (isfilterMealsIncluded == true) {
            let singleFlightPriceSummaryMeal = []
            singleFlightPriceSummaryMeal = this.flightList[i].priceSummary.filter(function (e: any) { if (e.foodAllowance != "null") { return e } });
            if (singleFlightPriceSummaryMeal.length > 0) {
              this.flightList[i].priceSummary = [];
              this.flightList[i].priceSummary = singleFlightPriceSummaryMeal;
              isMealsInclude = true;
            }
          }
          if (isNonStop == true || isRefundableFares == true || isMealsInclude == true) {
            updatedflightList.push(this.flightList[i]);
          }
        }
        else {
          updatedflightList.push(this.flightList[i]);
        }
      }
    }
    return updatedflightList;
  }

  //Timing Filter Flights
  timingFilterFlights(flightList: any) {
    this.flightList = flightList;
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

  // Airline Filter Flights
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
      if (this.airlines.length > 0) {
        this.airlines.filter(function (e: any) { e.flighCount = 0; return e; })
        for (let j = 0; j < this.airlines.length; j++) {
          flightList.forEach((e: any) => {
            e.flights.forEach((d: any, indx: number) => {
              if (this.airlines[j].airlineName == d.airlineName && indx == 0) {
                this.airlines[j].flighCount += 1;
              }
            })
          });
        }
      }
    }
    return flightList;
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
  // get airlines list and lowest price

  getAirlinelist() {
    let airlineNameArr = [];
    let layOverArr = [];
    for (let j = 0; j < this.flightList.length; j++) {
      let singleFlightList = [];
      singleFlightList = this.flightList[j].flights;
      let priceSummaryList = this.flightList[j].priceSummary;
      let priceSummary;
      for (let h = 0; h < singleFlightList.length; h++) {
        let airlineName = singleFlightList[h].airlineName
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

    let searchValue = this.flightDataModify.value;
    this.flightDataModify.value.departure = this.flightDataModify.value.departure.getFullYear() + '-' + (this.flightDataModify.value.departure.getMonth() + 1) + '-' + this.flightDataModify.value.departure.getDate();

    let otherSearchValueObj = { 'fromAirportName': this.fromAirpotName, 'toAirportName': this.toAirpotName, 'toCity': this.toCityName, 'fromCity': this.fromCityName, 'fromContry': this.fromContryName, 'toContry': this.toContryName }

    let searchValueAllobj = Object.assign(searchValue, otherSearchValueObj);
    sessionStorage.setItem('searchVal', JSON.stringify(searchValueAllobj));
    this.sub = this._flightService.flightList(this.flightDataModify.value).subscribe((res: any) => {
      this.loader = false
      this.DocKey = res.response.docKey;
      this.flightList = res.response.onwardFlights;
      this.oneWayDate = res.responseDateTime;
      this._flightService.flightListData = this.flightList;
      this.flightListWithOutFilter = this.flightList;

      //It is used for getting min and max price.
      if (this.flightList.length > 0) {
        this.minPrice = this.flightList[0].priceSummary[0].totalFare;
        this.maxPrice = this.flightList[this.flightList.length - 1].priceSummary[0].totalFare;
        this.sliderRange(this, this.minPrice, this.maxPrice);
      }
      let query: any = sessionStorage.getItem('searchVal');
      let url = "flight-list?" + decodeURIComponent(this.ConvertObjToQueryString(JSON.parse(query)));
      this.getAirlinelist();
      this.popularFilterFlightData()

      this.location.replaceState(url);
      this.getQueryParamData(JSON.parse(query));

    }, (error) => { console.log(error) });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
            
        this._styleManager.removeStyle('bootstrap-select');
        this._styleManager.removeScript('bootstrap-select');
        this._styleManager.removeScript('custom');
  }
  HideShowCompareToFly(i: number, fromCall: string, j: number) {
    if (fromCall == "fare-details") {
      $("[id*=CompareToFly_]").addClass("flight-details-box-hide");
      var element = document.getElementById('CompareToFly_' + i);
      if (element?.classList.contains('flight-details-box-hide')) {
        element.classList.remove('flight-details-box-hide');
      } else {
        element?.classList.add('flight-details-box-hide');
      }
      $('#CompareToFly_' + i + ' .flight-details,#CompareToFly_' + i + ' .fare-details').removeClass("extra-active").hide();
      $('.hidefares,.hideflight_details').addClass('d-none');
      $('.viewfares,.viewflight_details').removeClass('d-none');
      $('.flight-details-box').addClass('flight-details-box-hide');
      $('#CompareToFly_' + i).removeClass('flight-details-box-hide');
      $('#CompareToFly_' + i + ' .fare-details').addClass("extra-active").show();
      $('#flight_list_' + i + ' #viewfares_' + i).addClass('d-none');
      $('#flight_list_' + i + ' #hidefares_' + i).removeClass('d-none');
    }
    else if (fromCall == "flight-details") {
      $('#FlightDetails_' + i + '_' + j).removeClass('flight-details-box-hide');
      $('#FlightDetails_' + i + '_' + j + " .flight-details").addClass("extra-active").show();
      $('#viewflight_details_' + i + '_' + j).addClass('d-none');
      $('#hideflight_details_' + i + '_' + j).removeClass('d-none');
    }
  }
  hideFarebutton(i: number, fromCall: string, j: number) {
    if (fromCall == "fare-details") {
      $('.flight-details-box').addClass('flight-details-box-hide');
      $('#flight_list_' + i + ' #hidefares_' + i).addClass('d-none');
      $('#flight_list_' + i + ' #viewfares_' + i).removeClass('d-none');
      $('#CompareToFly_' + i).addClass('flight-details-box-hide');
      $('#CompareToFly_' + i + ' .fare-details').removeClass("extra-active").hide();
    }
    else if (fromCall == "flight-details") {
      $('#hideflight_details_' + i + '_' + j).addClass('d-none');
      $('#viewflight_details_' + i + '_' + j).removeClass('d-none');
      $('#FlightDetails_' + i + '_' + j).addClass('flight-details-box-hide');
      $('#FlightDetails_' + i + '_' + j + ' .fare-details').removeClass("extra-active").hide();
    }
  }

  ConvertObjToQueryString(obj: any) {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }

  calculateEMI(amount: number) {
    return Math.round((amount + (amount * (this.EMI_interest / 100))) / 12);
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
  onMinValueChange(event: any) {
    this.minPrice = event;
    if (this.minPrice != null) {
      this.popularFilterFlightData();
    }
  }
  onMaxValueChange(event: any) {
    this.maxPrice = event;
    if (this.maxPrice != null) {
      this.popularFilterFlightData();
    }
    this.popularFilterFlightData();
  }

  onMinStopOverChange(event: any) {
    this.minStopOver = event;
    this.popularFilterFlightData();
  }
  onMaxStopOverChange(event: any) {
    this.maxStopOver = event;
    this.popularFilterFlightData();
  }

  GetMinAndMaxPriceForFilter() {
    if (this.flightList.length > 0) {
      this.minPrice = this.flightList[0].priceSummary[0].totalFare;
      this.maxPrice = this.flightList[0].priceSummary[0].totalFare;
      this.flightList.forEach((z: any) => {
        var temp = z.priceSummary[0].totalFare;
        if (temp < this.minPrice) {
          this.minPrice = temp;
        }
        if (temp > this.maxPrice) {
          this.maxPrice = temp;
        }
      });
      this.Initslider();
    }
    else {
      this.minPrice = 0;
      this.maxPrice = 10000;
    }
  }

  getLayoverHour(obj1: any, obj2: any) {
    let dateHour: any;
    if (obj2 != null || obj2 != undefined) {
      let obj2Date = new Date(obj2.departureDateTime);
      let obj1Date = new Date(obj1.arrivalDateTime);
      dateHour = (obj2Date.valueOf() - obj1Date.valueOf()) / 1000;
    }
    return dateHour;
  }

  bookingSummary(flights: any, selected: any, flightKey: any) {
    let flightDetailsArr: any = { "flights": flights, "priceSummary": selected, "docKey": this.DocKey, "flightKey": flightKey,"queryFlightData":this.queryFlightData};
    let randomFlightDetailKey = this.getRandomString(44);
    sessionStorage.setItem(randomFlightDetailKey, JSON.stringify(flightDetailsArr));
    this._flightService.setFlightsDetails(flightDetailsArr);
    let url = 'flight-checkout?searchFlightKey=' + randomFlightDetailKey;
        this.router.navigateByUrl(url);
    /*
    const myInterval =setInterval(()=>{
      this.loaderValue = this.loaderValue + 10;
      if(this.loaderValue == 110)
      {
        clearInterval(myInterval);
        $('#bookingprocess').modal('hide');
        let url = 'flight-checkout?searchFlightKey=' + randomFlightDetailKey;
        this.router.navigateByUrl(url);
      }
    },10)*/
  }


// get rendom string value
  getRandomString(length: any) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random()*charactersLength));
    }
    return result;
  }


  gotoTop() {
   // this.scroll.scrollToPosition([0,0]);
  }

  
}
