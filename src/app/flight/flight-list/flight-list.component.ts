import { AfterViewInit, Component, ComponentFactoryResolver, ElementRef, HostListener,  OnDestroy, OnInit, ViewChild,ViewContainerRef,TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FlightService } from 'src/app/common/flight.service';
import { Location, ViewportScroller } from '@angular/common';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { Options } from '@angular-slider/ngx-slider';
import { SELECT_ITEM_HEIGHT_EM } from '@angular/material/select/select';
import { SimpleGlobal } from 'ng2-simple-global';
import {environment} from '../../../environments/environment';
import { StyleManagerService } from 'src/app/shared/services/style-manager.service';
import { AppConfigService } from '../../app-config.service';
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
 enableVAS: number = 0;
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
  isMobile:boolean= true;
   loaderValue = 10;
   dummyForLoader = Array(10).fill(0).map((x,i)=>i);

  @ViewChild('bookingprocess') bookingprocess: any;
  @ViewChild('toCityInput') toCityInput!: ElementRef;


  refundFilterStatus: boolean = false;
  flightListWithOutFilter: any = [];
  flightListFullData: any = [];
  
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
  math = Math;
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
    { name: 'P_L_H', active: true, value: 'Low to High' ,image: './assets/images/icons/price-l.png', sortValue:'Price'},
    { name: 'P_H_L', active: false, value: 'High to Low' , image:'./assets/images/icons/price-l.png',sortValue:'Price' },
    { name: 'D_E', active: false, value: 'Earliest' , image:'/assets/images/icons/Departure.png',sortValue:'Depart'},
    { name: 'D_L', active: false, value: 'Latest' ,image:'/assets/images/icons/Departure.png',sortValue:'Depart'},
    { name: 'D_Short', active: false, value: 'Shortest' ,image:'./assets/images/icons/clock.png',sortValue:'Duration'},
    { name: 'D_Long', active: false, value: 'Longest',image:'./assets/images/icons/clock.png',sortValue:'Duration'},
    { name: 'A_E', active: false, value: 'Earliest',image:'./assets/images/icons/Arrival.png', sortValue:'Arrival'},
    { name: 'A_L', active: false, value: 'Latest',image:'./assets/images/icons/Arrival.png', sortValue:'Arrival'},
  ]
  cdnUrl: any;
  
          @ViewChild('itemsContainer', { read: ViewContainerRef }) container: ViewContainerRef;
        @ViewChild('item', { read: TemplateRef }) template: TemplateRef<any>;	 

        pageIndex: number = 1;
        ITEMS_RENDERED_AT_ONCE=25;
        nextIndex=0;
        
        private loadData() {
             if (this.pageIndex >= this.flightList.length) {
             return false;
              }else{
             this.nextIndex = this.pageIndex + this.ITEMS_RENDERED_AT_ONCE;
             
             if(this.nextIndex > this.flightList.length){
             this.nextIndex=this.flightList.length;
             }
             
            for (let n = this.pageIndex; n < this.nextIndex ; n++) {
             const context = {
                item: [this.flightList[n]]
              };
              
              this.container.createEmbeddedView(this.template, context);
            }
             this.pageIndex += this.ITEMS_RENDERED_AT_ONCE;
            
           }
        
           //$('.scrollToTop').trigger('click');
        }
        
        
         private intialData() {
            for (let n = 0; n <this.ITEMS_RENDERED_AT_ONCE ; n++) {
             const context = {
                item: [this.flightList[n]]
              };
              
              this.container.createEmbeddedView(this.template, context);
            }
            //this.pageIndex += this.ITEMS_RENDERED_AT_ONCE;
            //  this.gotoTop();
        }
   serviceSettings:any;     
  enableFlightServices:any;
  
  constructor( private appConfigService:AppConfigService, public _styleManager: StyleManagerService,private _flightService: FlightService, public route: ActivatedRoute, private router: Router, private location: Location, private sg: SimpleGlobal, private scroll: ViewportScroller)  {
     this.cdnUrl = environment.cdnUrl+this.sg['assetPath']; 
      this.serviceSettings=this.appConfigService.getConfig();
      this.enableFlightServices= this.serviceSettings.poweredByPartners['flights'];
       this._styleManager.setStyle('bootstrap-select', `assets/css/bootstrap-select.min.css`);
       this._styleManager.setScript('bootstrap-select', `assets/js/bootstrap-select.min.js`);
       this._styleManager.setScript('custom', `assets/js/custom.js`);
       
               $(window).scroll(function(this) {
        if($(window).scrollTop() + $(window).height() > $(document).height() - 300) {
        $('#endOfPage').trigger('click');
        }
        });
            this.router.routeReuseStrategy.shouldReuseRoute = function() {
	return false;
	};
  }
  
@HostListener('window:resize', ['$event'])

ngOnInit(): void {
    this.isMobile = window.innerWidth < 991 ?  true : false;
    this.loader = true;
    this.getQueryParamData(null);
    this.headerHideShow(null)
    this.getAirpotsList();
    this.flightSearch();

  }

  getQueryParamData(paramObj: any) {

      this.route.queryParams
        .subscribe((params: any) => {
          this.queryFlightData = params;
            this.searchData = params;
          this.fromContryName = this.queryFlightData.fromContry;
          this.toContryName = this.queryFlightData.toContry;
          
          
        this.fromCityName = this.queryFlightData.fromCity; 
        this.toCityName = this.queryFlightData.toCity;
        this.departureDate = new Date(this.queryFlightData.departure);
        this.flightClassVal = this.queryFlightData.flightclass;
        this.adultsVal = this.queryFlightData.adults;
        this.childVal = this.queryFlightData.child;
        this.infantsVal = this.queryFlightData.infants;
        this.fromAirpotName = this.queryFlightData.fromAirportName;
        this.toAirpotName = this.queryFlightData.toAirportName;
        this.flightTimingfrom = this.queryFlightData.flightfrom
        this.flightTimingto = this.queryFlightData.flightto
        this.totalPassenger =   parseInt(this.adultsVal) +     parseInt(this.childVal) +   parseInt(this.infantsVal);
    
          
        });
    

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
    }, 200);
  }




  // get airport list
  getAirpotsList() {
    this._flightService.getAirportName().subscribe((res: any) => {
      this.airportsNameJson = res;

    })
  }
  show_airline_more:number=0;
  showmoreAirline() {
   this.show_airline_more=1;
  }
  
    show_layover_more:number=0;
  showmoreLayover() {
   this.show_layover_more=1;
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

  //sorting in mobile version
  flightSortingMobile(val:any) {
    let selectedVal = val;
    this.priceSortingFilteritems.filter((item: any) => {
      item.active = false;
      if (item.name == selectedVal) {
        item.active = true;
      }
      return item;
    });
  }

  applySortingMobile() {
    let sortingBtn = document.getElementById('sortMobileFilter');
    if(sortingBtn)
    {
      sortingBtn.style.display = 'none';
    }
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
    if(!this.isMobile)
    {
      this.popularFilterFlightData();
    }
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

     this.container.clear();
     this.intialData();

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
       // if (filteredAirlines.length > 0) {
          flightList = filteredAirlines;
       // }
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

 flightFromVal:any;
  flightSearch() {
    
    this.loader = true;
    let searchObj = (this.searchData);
    this.sub = this._flightService.flightList(searchObj).subscribe((res: any) => {
      this.loader = false;
      this.DocKey = res.response.docKey;
      // this.flightList = res.response.onwardFlights;
      this.flightList = this.ascPriceSummaryFlighs(res.response.onwardFlights);
      this.oneWayDate = res.responseDateTime;
      this._flightService.flightListData = this.flightList;
      this.flightListWithOutFilter = this.flightList;
      this.flightListFullData =   res.response.onwardFlights;
      //It is used for getting min and max price.
      if (this.flightList.length > 0) {
        this.minPrice = this.flightList[0].priceSummary[0].totalFare;
        this.maxPrice = this.flightList[this.flightList.length - 1].priceSummary[0].totalFare;
        this.sliderRange(this, this.minPrice, this.maxPrice);
      }
      this.getAirlinelist();
      this.popularFilterFlightData();

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
    /*let flightDetailsArr: any = { "flights": flights, "priceSummary": selected, "docKey": this.DocKey, "flightKey": flightKey,"queryFlightData":this.queryFlightData};*/
    
       let flightDetailsArr: any = { 
        "travel":"DOM",
        "travel_type":"O",
        "docKey": this.DocKey,
        "onwardFlightKey": flightKey,
        "returnFlightKey": '',
        "onwardFlights": flights,
        "returnFlights":'' ,
        "onwardPriceSummary": selected, 
        "returnPriceSummary": '', 
        "queryFlightData":this.queryFlightData
        };
    
    
    let randomFlightDetailKey = btoa(this.DocKey+flightKey+selected.partnerName);
    let url = 'flight-checkout?searchFlightKey=' + randomFlightDetailKey;
   
        setTimeout(() => {
                this.router.navigateByUrl(url);
                }, 10);  

  }



  gotoTop() {
       window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
});
  }
  OpenPartner(i:number)
  {
        $(".mob-items-book-list").css('display','none')
        var SelectedElement = document.getElementById('CompareToFly_'+i);
        if(SelectedElement)
        {
          SelectedElement.style.display = 'block';
        }
  }

  headerHideShow(event:any) {
    this.isMobile = window.innerWidth < 991 ?  true : false;
    if(this.isMobile){
     this._flightService.showHeader(false);
    }else{
    this._flightService.showHeader(true);
    }
  }
  openMobileFilterSection()
  {
    var filterDiv = document.getElementById('sortMobileFilter');
    if(filterDiv)
    {
      filterDiv.style.display = 'block';
    }

  }

  CloseSortingSection()
  {
    var filterDiv = document.getElementById('sortMobileFilter');
    if(filterDiv)
    {
      filterDiv.style.display = 'none';
    }
  }
  onApplyFilter(){
    var filterDiv = document.getElementById('sortMobileFilter');
    if(filterDiv)
    {
      filterDiv.style.display = 'none';
    }
    this.popularFilterFlightData();
  }

  
  openFlightDetailMobile(i:any,title:any){
      let flightDetail = document.getElementById('flightDetailMobile_' + i);
      let cancellation:any = document.getElementById('collapseTwo-fd_'+ i);
      let baggage:any = document.getElementById('collapseThree-fd_'+ i);
      let fareRules:any = document.getElementById('collapsefour-fd_'+ i);
      if(flightDetail && title == 'flightdetail') {
        flightDetail.style.display = "block";
      }
      if(cancellation && title == 'cancellation'){
        cancellation.classList.toggle("show");
      }
      if(baggage && title == 'baggagepolicy') {
        baggage.classList.toggle("show");
      }
      if(fareRules && title == 'farerules'){
        fareRules.classList.toggle("show");
      }
  }

  closeFlightDetailMobile(i:any){
    let element = document.getElementById('flightDetailMobile_' + i);
    if(element) {
      element.style.display = "none";
    }
    
  }

}
