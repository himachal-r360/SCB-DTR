import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FlightService } from 'src/app/common/flight.service';
import { MY_DATE_FORMATS } from '../flight-list/flight-list.component';
import { SimpleGlobal } from 'ng2-simple-global';
import {environment} from '../../../environments/environment';
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
  cdnUrl: any;
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
  EMI_interest: number = 16;
  navItemActive:any;
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
  MobileTotalDare:any;
  @ViewChild('itemsContainer', { read: ViewContainerRef }) container: ViewContainerRef;
  @ViewChild('item', { read: TemplateRef }) template: TemplateRef<any>;
  @ViewChild('itemsReturnContainer', { read: ViewContainerRef }) returnContainer: ViewContainerRef;
  @ViewChild('returnItem', { read: TemplateRef }) returnTemplate: TemplateRef<any>;
  pageIndex: number = 26;
  ITEMS_RENDERED_AT_ONCE=25;
  nextIndex=0;

  constructor(private _flightService: FlightService,  public route: ActivatedRoute, private router: Router, private location: Location,private sg: SimpleGlobal  ) {
    this.cdnUrl = environment.cdnUrl+this.sg['assetPath'];
    $(window).scroll(function(this) {
      if($(window).scrollTop() + $(window).height() > $(document).height() - 300) {
      $('#endOfPage').trigger('click');
      $('#endOfReturnPage').trigger('click');
      }
      });
   }

   @HostListener('window:resize', ['$event']) resizeEvent(event: Event) {
    this.isMobile = window.innerWidth < 991 ?  true : false;
  }
  ngOnInit(): void {
  
       this.route.url.subscribe(url =>{
        $(".modal").hide();
        $('body').removeClass( "modal-open" );
         $("body").removeAttr("style");
        $(".modal-backdrop").hide();
        this.gotoTop();
    this.loader = true;
    this.getQueryParamData(null);
    this.headerHideShow(null)
    this.getAirpotsList();
    this.flightSearch();
     });
  }

    private loadData() {
      if (this.pageIndex >= this.flightList.length) {
      return false;
      }else{
      this.nextIndex = this.pageIndex + this.ITEMS_RENDERED_AT_ONCE;
      if(this.nextIndex > this.flightList.length){
      this.nextIndex=this.flightList.length ;
    }
      for (let n = this.pageIndex; n < this.nextIndex ; n++) {
        const context = {
          item: [this.flightList[n]]
          
        };
        this.container.createEmbeddedView(this.template, context);
      }
      this.pageIndex += this.ITEMS_RENDERED_AT_ONCE;
    }
  }

  private loadReturnData() {
    if (this.pageIndex >= this.ReturnflightList.length) {
      return false;
      }else{
      this.nextIndex = this.pageIndex + this.ITEMS_RENDERED_AT_ONCE;
      if(this.nextIndex > this.ReturnflightList.length){
      this.nextIndex=this.ReturnflightList.length ;
      }
      for (let n = this.pageIndex; n < this.nextIndex ; n++) {
        const context = {
          items: [this.ReturnflightList[n]]
        };
        this.returnContainer.createEmbeddedView(this.template, context);
      }
      this.pageIndex += this.ITEMS_RENDERED_AT_ONCE;
    }
  }

  private intialData() {
    for (let n = 0; n <this.ITEMS_RENDERED_AT_ONCE ; n++) {
      const context = {
        item: [this.flightList[n]],
      };
      // console.log(context , "onward");
      
      this.container.createEmbeddedView(this.template, context);
    }
  }
  private intialReturnData() {
    for (let n = 0; n <this.ITEMS_RENDERED_AT_ONCE ; n++) {
    const returnContext = {
        item: [this.ReturnflightList[n]],
      };
      // console.log(returnContext , "return");
      
      this.returnContainer.createEmbeddedView(this.returnTemplate, returnContext);
    
    }
  }





    getQueryParamData(paramObj: any) {
        const params = this.route.snapshot.queryParams;
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

  }



  //Hide show header
  headerHideShow(event:any) {
    this.isMobile = window.innerWidth < 991 ?  true : false;
    if(this.isMobile){
     this._flightService.showHeader(false);
    }else{
    this._flightService.showHeader(true);
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

  flightSearch() {
    this.loader = true;
    let searchObj = (this.searchData);



    this.sub = this._flightService.flightList(searchObj).subscribe((res: any) => {
      this.DocKey = res.response.docKey;
      this.flightList = this.ascPriceSummaryFlighs(res.response.onwardFlights);
      this.ReturnflightList = this.ascPriceSummaryFlighs(res.response.returnFlights);
      this.ReturnflightList.forEach((z:any)=>{
        z.disabled = false
      });
      this._flightService.flightListData = this.flightList;
      this.flightListWithOutFilter = this.flightList;
      this.flightReturnListWithOutFilter = this.ReturnflightList;


        //It is used for getting min and max price.
        if (this.flightList.length > 0) {
          this.minPrice = this.flightList[0].priceSummary[0].totalFare;
          this.maxPrice = this.flightList[this.flightList.length - 1].priceSummary[0].totalFare;
          this.sliderRange(this, this.minPrice, this.maxPrice);
        }

        this.getAirlinelist();
        this.popularFilterFlightData()

    }, (error) => { console.log(error) });
  }


  ascPriceSummaryFlighs(flightsData:any)
  {
    flightsData.filter((flightItem:any,indx:number)=>{

      let priceSummaryArr=flightItem.priceSummary;
      if(priceSummaryArr.length>1){
        priceSummaryArr.sort(function(a, b) {if (a.totalFare === b.totalFare)     {     if (Math.random() < .5) return -1; else return 1;     } else {     return a.totalFare - b.totalFare;  }      });
        flightItem.priceSummary=priceSummaryArr;
      }
    })
    return flightsData;
  }


  gotoTop() {
       window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
});
  }


  ngAfterViewInit(): void {
    setTimeout(() => {
      this.Initslider();
    }, 200);
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
    this.flight_return_Timingsitems.filter((item: any) => { item.active = false; return item; })
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

      this.container.clear();
      this.returnContainer.clear();
      this.intialData();
      this.intialReturnData();
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

  onSelectOnword(flightKey:any,flights:any,item:any,event:any)
  {

    $(".onwardbuttons").removeClass('button-selected-style');
    $(".onwardbuttons").html('Select');
      var selected = event.target as HTMLElement
      if(selected)
      {
        this.isOnwardSelected = true;
        this.isDisplayDetail = true;
        this.isFlightsSelected = true;
        selected.classList.add('button-selected-style')
        selected.innerHTML = 'Selected'
      }
      var onwardSelectedFlight = {flightKey:flightKey,flights:flights,priceSummery:item};
    this.onwardSelectedFlight = onwardSelectedFlight;
    var partner = item.partnerName;
    this.ReturnflightList.forEach((z:any)=>{
        z.priceSummary.forEach((a:any)=>{
          if(a.partnerName == partner)
          {
            a.disabled = false;
          }
          else{
            a.disabled = true;
          }
        });
    });

  }

  onSelectReturn(flightKey:any,flights:any,item:any,event:any)
  {
  if(this.isOnwardSelected == true)
      {
    $(".returnButtons").removeClass('button-selected-style');
    $(".returnButtons").html('Select');
      var selected = event.target as HTMLElement
      if(selected)
      {
        this.isReturnSelected = true;
        selected.classList.add('button-selected-style')
        selected.innerHTML = 'Selected'
      }

        this.isDisplayDetail = true;
        this.isFlightsSelected = true;

      var returnSelectedFlight = {flightKey:flightKey,flights:flights,priceSummery:item}
      this.returnSelectedFlight = returnSelectedFlight;
      }
      else{
        alert('Please choose onward flight.')
      }
  }
  calculateEMI(amount: number) {
    return Math.round((amount + (amount * (this.EMI_interest / 100))) / 12);
  }

  DisplayDetail()
  {
    if(this.isOnwardSelected == true || this.isReturnSelected == true)
    {
      this.isDetailsShow = true;
    }
  }

  changeFareRuleTab(event:any){
    $('.flight-extra-content').hide();
    $('.flight-extra-tabs li a').removeClass('flight-extra-tabs-active');
    var Element = document.getElementById(event.target.dataset['bind']);
    Element!.style.display = 'block';
    event.target.classList.add('flight-extra-tabs-active');
  }
  CloseDetail()
  {
    this.isDetailsShow = false;
  }

  navBarLink(navItem:any){
    this.navItemActive = navItem;
  }


  bookingSummary(onwardSelectedFlight: any, returnSelectedFlight: any) {
        let flightDetailsArr: any = {
        "travel":"DOM",
        "travel_type":"R",
        "docKey": this.DocKey,
        "onwardFlightKey": onwardSelectedFlight.flightKey,
        "returnFlightKey": returnSelectedFlight.flightKey,
        "onwardFlights": onwardSelectedFlight.flights,
        "returnFlights": returnSelectedFlight.flights,
        "onwardPriceSummary": onwardSelectedFlight.priceSummery,
        "returnPriceSummary": returnSelectedFlight.priceSummery,
        "queryFlightData":this.queryFlightData
        };

    let randomFlightDetailKey = btoa(this.DocKey+onwardSelectedFlight.flightKey+returnSelectedFlight.flightKey+onwardSelectedFlight.priceSummery.partnerName+returnSelectedFlight.priceSummery.partnerName);
    sessionStorage.setItem(randomFlightDetailKey, JSON.stringify(flightDetailsArr));
    //this._flightService.setFlightsDetails(flightDetailsArr);
    let url = 'flight-checkout?searchFlightKey=' + randomFlightDetailKey;

    setTimeout(() => {
        this.router.navigateByUrl(url);
        }, 10);

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
    this.priceSortingReturnFilteritems.filter((item:any)=>{
      item.active = false;
      if (item.name == selectedVal) {
        item.active = true;
      }
      return item;
    })
  }
  applySortingMobile() {
    let sortingBtn = document.getElementById('sortMobileFilter');
    if(sortingBtn)
    {
      sortingBtn.style.display = 'none';
    }
    this.popularFilterFlightData();
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
}
