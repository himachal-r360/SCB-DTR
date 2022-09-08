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
import {EncrDecrService} from 'src/app/shared/services/encr-decr.service';
import { DOCUMENT, NgStyle, DecimalPipe, DatePipe } from '@angular/common';
import { RestapiService} from 'src/app/shared/services/restapi.service';
import { formatNumber } from '@angular/common';
declare var $: any;
declare var bootstrap:any;
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
  showMoreAirline = false;
  showLessAirline = true;
  showLessLayover = true;
  showMoreLayover = false;
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
  maxStopOver: number = 96;
  airlines: any;
  airportsNameJson: any;
  layOverFilterArr: any;
  isMobile:boolean= false
  math = Math;
  EMI_interest: number = 16;
  EMIAvailableLimit: number = 3000;
  navItemActive:any;
  dummyForLoader = Array(10).fill(0).map((x,i)=>i);
  options: Options = {
    floor: 0,
    ceil: 1000,
    translate: (value: number): string => {
      return '';
    }
  };
  optionsStopOver: Options = {
    floor: 0,
    ceil: 96,
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
    { name: '0_6', active: false, value: 'Before 6 AM', image: '1.png' },
    { name: '6_12', active: false, value: '6 AM - 12 PM', image: '2.png' },
    { name: '12_18', active: false, value: '12 PM - 6 PM', image: '4.png' },
    { name: '18_0', active: false, value: 'After 6 PM', image: '3.png' }
  ]

  flight_return_Timingsitems = [
    { name: '0_6', active: false, value: 'Before 6 AM', image: '1.png' },
    { name: '6_12', active: false, value: '6 AM - 12 PM', image: '2.png' },
    { name: '12_18', active: false, value: '12 PM - 6 PM', image: '4.png' },
    { name: '18_0', active: false, value: 'After 6 PM', image: '3.png' }
  ]

  stopsFilteritems = [
    { name: 'no_stops', active: false, value: '<p>Non <br> stop</p>' },
    { name: '1_stops', active: false, value: '<p>1 <br> stop</p>' },
    { name: '2plus_stops', active: false, value: '<p>2+ <br> stops</p>' }
  ]
  toggleStopsFilteritems = [
    { name: 'All_Flights', active: true, value: 'All Flights' },
    { name: 'no_stops', active: false, value: 'Non-Stop' },
  ]
  priceSortingFilteritems = [
    { name: 'P_L_H', active: true, value: 'Low to High' ,image: './assets/images/icons/price-l.png',activeImage:'./assets/images/icons/active_lth.png', sortValue:'Price'},
    { name: 'P_H_L', active: false, value: 'High to Low' , image:'./assets/images/icons/price-h.png',activeImage:'./assets/images/icons/active_htl.png',sortValue:'Price' },
    { name: 'D_Short', active: false, value: 'Shortest' ,image:'./assets/images/icons/clock.png',activeImage:'./assets/images/icons/active_duration.png',sortValue:'Duration'},
    { name: 'D_Long', active: false, value: 'Longest',image:'./assets/images/icons/clock.png',activeImage:'./assets/images/icons/active_duration.png',sortValue:'Duration'},
    { name: 'D_E', active: false, value: 'Earliest' , image:'./assets/images/icons/Departure.png',activeImage:'./assets/images/icons/active_departure.png',sortValue:'Departure'},
    { name: 'D_L', active: false, value: 'Latest' ,image:'./assets/images/icons/Departure.png',activeImage:'./assets/images/icons/active_departure.png',sortValue:'Departure'},
    { name: 'A_E', active: false, value: 'Earliest',image:'./assets/images/icons/Arrival.png',activeImage:'./assets/images/icons/active_arrival.png', sortValue:'Arrival'},
    { name: 'A_L', active: false, value: 'Latest',image:'./assets/images/icons/Arrival.png',activeImage:'./assets/images/icons/active_arrival.png', sortValue:'Arrival'},
  ]

  priceSortingReturnFilteritems = [
    { name: 'P_L_H', active: true, value: 'Low to High' ,image: './assets/images/icons/price-l.png',activeImage:'./assets/images/icons/active_lth.png', sortValue:'Price'},
    { name: 'P_H_L', active: false, value: 'High to Low' , image:'./assets/images/icons/price-h.png',activeImage:'./assets/images/icons/active_htl.png',sortValue:'Price' },
    { name: 'D_Short', active: false, value: 'Shortest' ,image:'./assets/images/icons/clock.png',activeImage:'./assets/images/icons/active_duration.png',sortValue:'Duration'},
    { name: 'D_Long', active: false, value: 'Longest',image:'./assets/images/icons/clock.png',activeImage:'./assets/images/icons/active_duration.png',sortValue:'Duration'},
    { name: 'D_E', active: false, value: 'Earliest' , image:'./assets/images/icons/Departure.png',activeImage:'./assets/images/icons/active_departure.png',sortValue:'Departure'},
    { name: 'D_L', active: false, value: 'Latest' ,image:'./assets/images/icons/Departure.png',activeImage:'./assets/images/icons/active_departure.png',sortValue:'Departure'},
    { name: 'A_E', active: false, value: 'Earliest',image:'./assets/images/icons/Arrival.png',activeImage:'./assets/images/icons/active_arrival.png', sortValue:'Arrival'},
    { name: 'A_L', active: false, value: 'Latest',image:'./assets/images/icons/Arrival.png',activeImage:'./assets/images/icons/active_arrival.png', sortValue:'Arrival'},
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
  pageIndex: number = 101;
  ITEMS_RENDERED_AT_ONCE=100;
  nextIndex=0;

    pageIndexR: number = 101;
  nextIndexR=0;

  constructor(public rest:RestapiService,private EncrDecr: EncrDecrService,private _flightService: FlightService,  public route: ActivatedRoute, private router: Router, private location: Location,private sg: SimpleGlobal  ) {
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
        this.resetPopups();
        this.gotoTop();
    this.loader = true;
    this.getQueryParamData(null);
    this.headerHideShow(null)
    this.getAirpotsList();
        this.getCoupons();
    this.flightSearch();
     });
  }
        resetPopups(){
        $('#flightChange').modal('hide');
        $(".modal").hide();
        $("body").removeAttr("style");
        $(".modal-backdrop").remove();
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

  toggle(event){
   $("#onwardlist_"+event).prop("checked", true);

   if(this.isMobile){
    $('.mob-list-itemsor').removeClass('mob-list-itemsr-selected');
    $('#MobileOnward_'+event).addClass('mob-list-itemsr-selected');
    }

  }
    toggleR(event){
   $("#return_roundlist_"+event).prop("checked", true);

      if(this.isMobile){
    $('.mob-list-itemsrr').removeClass('mob-list-itemsr-selected');
    $('#MobileReturn_'+event).addClass('mob-list-itemsr-selected');
    }
  }

  private loadReturnData() {
    if (this.pageIndexR >= this.ReturnflightList.length) {
      return false;
      }else{
      this.nextIndexR = this.pageIndexR + this.ITEMS_RENDERED_AT_ONCE;
      if(this.nextIndexR > this.ReturnflightList.length){
      this.nextIndexR=this.ReturnflightList.length ;
      }
      for (let n = this.pageIndexR; n < this.nextIndexR ; n++) {
        const context = {
          items: [this.ReturnflightList[n]]
        };
        this.returnContainer.createEmbeddedView(this.template, context);
      }
      this.pageIndexR += this.ITEMS_RENDERED_AT_ONCE;
    }
  }

  private intialData() {
    for (let n = 0; n <this.ITEMS_RENDERED_AT_ONCE ; n++) {
      if(this.flightList[n] != undefined)
    {
      const context = {
        item: [this.flightList[n]],
      };
      // console.log(context , "onward");

      this.container.createEmbeddedView(this.template, context);
    }
    }
  }
  private intialReturnData() {
    for (let n = 0; n <this.ITEMS_RENDERED_AT_ONCE; n++) {
    if(this.ReturnflightList[n] != undefined)
    {
      const returnContext = {
        item: [this.ReturnflightList[n]],
      };
      // console.log(returnContext , "return");

      this.returnContainer.createEmbeddedView(this.returnTemplate, returnContext);

    }

    }
  }

  show_airline_more:number=0;
  showmoreAirline() {
   this.show_airline_more=1;
  }

    show_layover_more:number=0;
  showmoreLayover() {
   this.show_layover_more=1;
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
        this.returnDate = new Date(this.queryFlightData.arrival);
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

flightCoupons=[];
getCoupons(){
const urlParams = {'client_token': 'HDFC243','service_id':'1'};
var couponParam = {
postData:this.EncrDecr.set(JSON.stringify(urlParams))
};

this.rest.getCouponsByService(couponParam).subscribe(results => {
   if(results.status=="success"){
   this.flightCoupons=results.data;
   }

});

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
         this.GetMinAndMaxPriceForFilter();
          //this.minPrice = this.flightList[0].priceSummary[0].totalFare;
         // this.maxPrice = this.flightList[this.flightList.length - 1].priceSummary[0].totalFare;
          this.sliderRange(this, this.minPrice, this.maxPrice);
        }



        this.loader = false;
        this.getAirlinelist();
        this.popularFilterFlightData()

    }, (error) => { console.log(error) });
  }
  GetMinAndMaxPriceForFilter() {

        let oneway_minPrice=0;
        let oneway_maxPrice=0;
        let return_minPrice=0;
        let return_maxPrice=0;

    if (this.flightList.length > 0) {
      oneway_minPrice = this.flightList[0].priceSummary[0].totalFare;
      oneway_maxPrice= this.flightList[0].priceSummary[0].totalFare;
      this.flightList.forEach((z: any) => {
        var temp = z.priceSummary[0].totalFare;
        if (temp < oneway_minPrice) {
          oneway_minPrice = temp;
        }
        if (temp > oneway_maxPrice) {
          oneway_maxPrice = temp;
        }
      });
    }


     if (this.ReturnflightList.length > 0) {
      return_minPrice = this.ReturnflightList[0].priceSummary[0].totalFare;
      return_maxPrice = this.ReturnflightList[0].priceSummary[0].totalFare;
      this.ReturnflightList.forEach((z: any) => {
        var temp = z.priceSummary[0].totalFare;
        if (temp < return_minPrice) {
          return_minPrice = temp;
        }
        if (temp > return_maxPrice) {
          return_maxPrice = temp;
        }
      });
    }

    if(oneway_minPrice < return_minPrice){
     this.minPrice = oneway_minPrice;
    }else{
     this.minPrice = return_minPrice;
    }


    if(oneway_maxPrice < return_maxPrice){
     this.maxPrice = oneway_maxPrice;
    }else{
     this.maxPrice = return_maxPrice;
    }

    this.Initslider();
  }

  ascPriceSummaryFlighs(flightsData:any)
  {
    flightsData.filter((flightItem:any,indx:number)=>{

      let priceSummaryArr=flightItem.priceSummary;
      if(priceSummaryArr.length>1){
        priceSummaryArr.sort(function(a, b) {if (a.totalFare === b.totalFare && a.splrtFareFlight==false  && b.splrtFareFlight==false )     {     if (Math.random() < .5) return -1; else return 1;     } else {     return a.totalFare - b.totalFare;  }      });
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
    this.maxStopOver = 96;
    this.popularFilterFlightData();
  }
  resetLayOverFilter() {
    this.layOverFilterArr.filter((item: any) => { item.active = false; return item; })
    this.popularFilterFlightData();
  }
  resetAllFilters() {
       this.toggleStopsFilteritems = [
    { name: 'All_Flights', active: true, value: 'All Flights' },
    { name: 'no_stops', active: false, value: 'Non-Stop' },
    ];
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
          if (flights.length > 0 && e.flights.length==1 ) {
            this.nonStopCount += 1;
            this.flight_PopularItems.filter((item: any) => {
              if (item.name == "non_stop") {
                item.count = this.nonStopCount
              }
            })
          }
          var flights = e.priceSummary.filter((d: any) => { if (d.splrtFareFlight==false && d.refundStatus == 1) { return d; } }); // Refundable Fares Count
          if (flights.length > 0) {
            this.RefundableFaresCount += 1;
            this.flight_PopularItems.filter((item: any) => {
              if (item.name == "Refundable_Fares") {
                item.count = this.RefundableFaresCount
              }
            })
          }
          var flights = e.priceSummary.filter((d: any) => { if (d.splrtFareFlight==false && d.foodAllowance != null) { return d; } });// Meals Included Count
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
          
                  this.flightList.sort(function(a, b){
                var totalOnwardDuration=0;
                var totalOnwardDurationB=0;
                for (let i = 0; i < a.flights.length; i++) {
                totalOnwardDuration += a.flights[i].duration;
                if (a.flights[i + 1] != null && a.flights[i + 1] != undefined) {
                let obj2Date = new Date(a.flights[i + 1].departureDateTime);
                let obj1Date = new Date(a.flights[i ].arrivalDateTime);
                totalOnwardDuration+= (obj2Date.valueOf() - obj1Date.valueOf()) / 1000;   
                }
                }
                
               for (let i = 0; i < b.flights.length; i++) {
                totalOnwardDurationB += b.flights[i].duration;
                if (b.flights[i + 1] != null && b.flights[i + 1] != undefined) {
                let obj2Date = new Date(b.flights[i + 1].departureDateTime);
                let obj1Date = new Date(b.flights[i ].arrivalDateTime);
                totalOnwardDurationB+= (obj2Date.valueOf() - obj1Date.valueOf()) / 1000;   
                }
                }
              return totalOnwardDuration>totalOnwardDurationB? 1: -1;  
       
        });
          }
          else if (item.name == 'D_Long' && item.active == true) {
          
                  this.flightList.sort(function(a, b){
                var totalOnwardDuration=0;
                var totalOnwardDurationB=0;
                for (let i = 0; i < a.flights.length; i++) {
                totalOnwardDuration += a.flights[i].duration;
                if (a.flights[i + 1] != null && a.flights[i + 1] != undefined) {
                let obj2Date = new Date(a.flights[i + 1].departureDateTime);
                let obj1Date = new Date(a.flights[i ].arrivalDateTime);
                totalOnwardDuration+= (obj2Date.valueOf() - obj1Date.valueOf()) / 1000;   
                }
                }
                
               for (let i = 0; i < b.flights.length; i++) {
                totalOnwardDurationB += b.flights[i].duration;
                if (b.flights[i + 1] != null && b.flights[i + 1] != undefined) {
                let obj2Date = new Date(b.flights[i + 1].departureDateTime);
                let obj1Date = new Date(b.flights[i ].arrivalDateTime);
                totalOnwardDurationB+= (obj2Date.valueOf() - obj1Date.valueOf()) / 1000;   
                }
                }
              return totalOnwardDurationB>totalOnwardDuration? 1: -1;  
       
        });
          
          }
          else if (item.name == 'D_E' && item.active == true) {
            this.flightList.sort((a: any, b: any) => new Date(a.flights[0].departureDateTime).getTime() - new Date(b.flights[0].departureDateTime).getTime());
          }
          else if (item.name == 'D_L' && item.active == true) {
          this.flightList.sort((a: any, b: any) => new Date(b.flights[0].departureDateTime).getTime() - new Date(a.flights[0].departureDateTime).getTime());
          }
          else if (item.name == 'A_E' && item.active == true) {
            this.flightList.sort((a: any, b: any) => new Date(a.flights[a.flights.length-1].arrivalDateTime).getTime() - new Date(b.flights[b.flights.length-1].arrivalDateTime).getTime());
          }
          else if (item.name == 'A_L' && item.active == true) {
            this.flightList.sort((a: any, b: any) => new Date(b.flights[b.flights.length-1].arrivalDateTime).getTime() - new Date(a.flights[a.flights.length-1].arrivalDateTime).getTime());
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
          
           this.ReturnflightList.sort(function(a, b){
                var totalOnwardDuration=0;
                var totalOnwardDurationB=0;
                for (let i = 0; i < a.flights.length; i++) {
                totalOnwardDuration += a.flights[i].duration;
                if (a.flights[i + 1] != null && a.flights[i + 1] != undefined) {
                let obj2Date = new Date(a.flights[i + 1].departureDateTime);
                let obj1Date = new Date(a.flights[i ].arrivalDateTime);
                totalOnwardDuration+= (obj2Date.valueOf() - obj1Date.valueOf()) / 1000;   
                }
                }
                
               for (let i = 0; i < b.flights.length; i++) {
                totalOnwardDurationB += b.flights[i].duration;
                if (b.flights[i + 1] != null && b.flights[i + 1] != undefined) {
                let obj2Date = new Date(b.flights[i + 1].departureDateTime);
                let obj1Date = new Date(b.flights[i ].arrivalDateTime);
                totalOnwardDurationB+= (obj2Date.valueOf() - obj1Date.valueOf()) / 1000;   
                }
                }
              return totalOnwardDuration>totalOnwardDurationB? 1: -1;  
       
        });
          
          }
          else if (item.name == 'D_Long' && item.active == true) {
          
                     this.ReturnflightList.sort(function(a, b){
                var totalOnwardDuration=0;
                var totalOnwardDurationB=0;
                for (let i = 0; i < a.flights.length; i++) {
                totalOnwardDuration += a.flights[i].duration;
                if (a.flights[i + 1] != null && a.flights[i + 1] != undefined) {
                let obj2Date = new Date(a.flights[i + 1].departureDateTime);
                let obj1Date = new Date(a.flights[i ].arrivalDateTime);
                totalOnwardDuration+= (obj2Date.valueOf() - obj1Date.valueOf()) / 1000;   
                }
                }
                
               for (let i = 0; i < b.flights.length; i++) {
                totalOnwardDurationB += b.flights[i].duration;
                if (b.flights[i + 1] != null && b.flights[i + 1] != undefined) {
                let obj2Date = new Date(b.flights[i + 1].departureDateTime);
                let obj1Date = new Date(b.flights[i ].arrivalDateTime);
                totalOnwardDurationB+= (obj2Date.valueOf() - obj1Date.valueOf()) / 1000;   
                }
                }
              return totalOnwardDurationB>totalOnwardDuration? 1: -1;  
       
        });
          
           
          }
          else if (item.name == 'D_E' && item.active == true) {
            this.ReturnflightList.sort((a: any, b: any) => new Date(a.flights[0].departureDateTime).getTime() - new Date(b.flights[0].departureDateTime).getTime());
          }
          else if (item.name == 'D_L' && item.active == true) {
          this.ReturnflightList.sort((a: any, b: any) => new Date(b.flights[0].departureDateTime).getTime() - new Date(a.flights[0].departureDateTime).getTime());
          }
          else if (item.name == 'A_E' && item.active == true) {
            this.ReturnflightList.sort((a: any, b: any) => new Date(a.flights[a.flights.length-1].arrivalDateTime).getTime() - new Date(b.flights[b.flights.length-1].arrivalDateTime).getTime());
          }
          else if (item.name == 'A_L' && item.active == true) {
            this.ReturnflightList.sort((a: any, b: any) => new Date(b.flights[b.flights.length-1].arrivalDateTime).getTime() - new Date(a.flights[a.flights.length-1].arrivalDateTime).getTime());
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
          if(end >0){
        var filteredStopOver: any[] = [];
        this.flightList.forEach((e: any) => {
          var flights = e.flights;
        var totalOnwardDuration = 0;
        for (let i = 0; i < flights.length; i++) {
          totalOnwardDuration += flights[i].duration;
          if (flights[i + 1] != null && flights[i + 1] != undefined) {
          let obj2Date = new Date(flights[i + 1].departureDateTime);
          let obj1Date = new Date(flights[i ].arrivalDateTime);
          totalOnwardDuration+= (obj2Date.valueOf() - obj1Date.valueOf()) / 1000;
          }
        }
        if ((totalOnwardDuration/60)/60 >= start && (totalOnwardDuration/60)/60 <= end) {
          filteredStopOver.push(e);
        }
        });
        this.flightList = filteredStopOver;
                   }else{
       var filteredStopsArr: any[] = [];
        this.flightList.filter((d: any) => {
         if (d.flights.length==1 &&  d.flights[0].stops == 0) {
               filteredStopsArr.push(d);
         }
        });
        this.flightList = filteredStopsArr;

      }
      }
 
      //StopOverFilter return
      if (this.ReturnflightList.length > 0) {
        var start = this.minStopOver;
        var end = this.maxStopOver;
        var filteredStopOver: any[] = [];
          if(end >0){
        this.ReturnflightList.forEach((e: any) => {
          var flights = e.flights;
        var totalOnwardDuration = 0;
        for (let i = 0; i < flights.length; i++) {
          totalOnwardDuration += flights[i].duration;
          if (flights[i + 1] != null && flights[i + 1] != undefined) {
          let obj2Date = new Date(flights[i + 1].departureDateTime);
          let obj1Date = new Date(flights[i ].arrivalDateTime);
          totalOnwardDuration+= (obj2Date.valueOf() - obj1Date.valueOf()) / 1000;
          }
        }
        if ((totalOnwardDuration/60)/60 >= start && (totalOnwardDuration/60)/60 <= end) {
          filteredStopOver.push(e);
        }
        });
        this.ReturnflightList = filteredStopOver;
                   }else{
       var filteredStopsArr: any[] = [];
        this.ReturnflightList.filter((d: any) => {
         if (d.flights.length==1 &&  d.flights[0].stops == 0) {
               filteredStopsArr.push(d);
         }
        });
        this.ReturnflightList = filteredStopsArr;

      }
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
      if(this.flightList.length > 0)
      {
        this.intialData();
      }
      if(this.ReturnflightList.length > 0)
      {
        this.intialReturnData();
      }

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
      //console.log(this.ReturnflightList , "return");
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
      //console.log(this.flight_return_Timingsitems , "this.flight_return_Timingsitems");

      let isTimingFilterItems = this.flight_return_Timingsitems.filter((item: any) => {
        if (item.active == true) {
          return item;
        }
      })
      //console.log(isTimingFilterItems , "isTimingFilterItems");

      if (isTimingFilterItems.length > 0) {
        isfilterFlightTiming = true;
      }
      //Flight Timing Filter
      if (isfilterFlightTiming == true || isfilterMorningDepartures == true) {
        var filteredTimingArr: any[] = [];
        if (returnFlightList.length > 0) {
          //console.log(returnFlightList , "returnFlightList");
          //console.log(date2);
          //console.log(date3);

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
      this.flight_return_Timingsitems.filter((item: any) => { if (item.name == "0_6") { item.active = true; return item; } })
    }
    if (popularItems.name == "non_stop") {
      this.stopsFilteritems.filter((item: any) => { if (item.name == "no_stops") { item.active = true; return item; } })

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
                  "arrivalAirport": this.airportsNameJson[singleFlightList[h].arrivalAirport] ? this.airportsNameJson[singleFlightList[h].arrivalAirport].airport_name : singleFlightList[h].arrivalAirport,
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

         if (d.flights.length==1 && (isStopsFilterItems.filter((item: any) => { if (item.active == true && item.name == "no_stops") { return item; } }).length > 0) &&  d.flights[0].stops == 0) {
               filteredStopsArr.push(d);
         }

        if (d.flights.length==1 && (isStopsFilterItems.filter((item: any) => { if (item.active == true && item.name == "1_stops") { return item; } }).length > 0)&&  d.flights[0].stops == 1) {
               filteredStopsArr.push(d);
         }

         if (d.flights.length==2 && (isStopsFilterItems.filter((item: any) => { if (item.active == true && item.name == "1_stops") { return item; } }).length > 0)) {
               filteredStopsArr.push(d);
         }

         if (d.flights.length > 2 && (isStopsFilterItems.filter((item: any) => { if (item.active == true && item.name == "2plus_stops") { return item; } }).length > 0) ) {
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
  flightChangeDisplay:any;

  flightsChange:any; selectedChange:any; flightKeyChange:any; itemChange:any;eventChange:any;

  onSelectOnwardSplrt:any;
  selectedFromKey:any ;
  onSelectOnword(flightKey:any,flights:any,item:any,priceDump:any,event:any , j:any)
  {
  this.selectedFromKey=j;
    //debugger;
   if(item.partnerName=='Cleartrip'){
   this.onSelectOnwardSplrt= priceDump.filter((item: any) => {
      if(item.partnerName=='Cleartrip' && item.splrtFareFlight==true )
      return item;
    });
    }else{
    this.onSelectOnwardSplrt=[];
    }

     $('.onwardbuttons').removeClass('button-selected-style');  $('.onwardbuttons').html('Select');


        let departureAirportUser=this.searchData.flightfrom;
        let arrivalAirportUser=this.searchData.flightto;

        let departureAirportSelected=flights[0]['departureAirport'];
        let arrivalAirportSelected=flights[flights.length-1]['arrivalAirport'];
        this.flightsChange=flights;
        this.itemChange=item;
        this.flightKeyChange=flightKey;
        this.eventChange=event;

        if (departureAirportSelected != departureAirportUser) {
        this.flightChangeDisplay= "We found more airports near " + this.airportsNameJson[departureAirportUser ].city + ". Cheapest flight at ₹"+formatNumber(item.totalFare,"en-US", "1.0")+" from " + this.airportsNameJson[departureAirportSelected ].airport_name+ ', ' +this.airportsNameJson[departureAirportSelected ].city + ' (' + departureAirportSelected + ')' + ' to ' + this.airportsNameJson[arrivalAirportSelected ].airport_name  + ', ' + this.airportsNameJson[arrivalAirportSelected ].city + ' (' + arrivalAirportSelected + ').';
        $('#flightChangeO').modal('show');
        return;
        }


        if (arrivalAirportSelected != arrivalAirportUser) {
        this.flightChangeDisplay= "We found more airports near " + this.airportsNameJson[arrivalAirportUser ].city + ". Cheapest flight at ₹"+formatNumber(item.totalFare,"en-US", "1.0")+" from " + this.airportsNameJson[arrivalAirportSelected ].airport_name+ ', ' +this.airportsNameJson[arrivalAirportSelected ].city + ' (' + arrivalAirportSelected + ')' + ' to ' + this.airportsNameJson[arrivalAirportSelected ].airport_name  + ', ' + this.airportsNameJson[arrivalAirportSelected ].city + ' (' + arrivalAirportSelected + ').';
        $('#flightChangeO').modal('show');
        return;
        }

    $(".selectedOnwardDiv").removeClass('selected-flight-background');
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

                if(this.isMobile){
        $('.mob-items-book-list-itemso').removeClass('mob-list-itemsr-selected-dark');
          $('#mob-items-book-list-itemso_'+flightKey+'_'+item.partnerName).addClass('mob-list-itemsr-selected-dark');
        }else{
                let selectedOnwardDiv = document.getElementById('selectedOnwardDiv_' + flightKey + "_"+ this.selectedFromKey);
        selectedOnwardDiv.classList.add('selected-flight-background');
        }

      }
      var onwardSelectedFlight = {flightKey:flightKey,flights:flights,priceSummery:item};
    this.onwardSelectedFlight = onwardSelectedFlight;
    var partner = item.partnerName;
    if(this.returnSelectedFlight != null && this.returnSelectedFlight != undefined)
    {
      if(partner != this.returnSelectedFlight.priceSummery.partnerName)
      {
        this.returnSelectedFlight = null;
        this.isReturnSelected = false;
      }
    }
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

    onSelectOnwordContinue(flightKey:any,flights:any,item:any,event:any)
  {

    $('#flightChangeO').modal('hide');
    $(".onwardbuttons").removeClass('button-selected-style');
        $(".selectedOnwardDiv").removeClass('selected-flight-background');
    $(".selected-flight-background").removeClass('selected-flight-background');
    $(".onwardbuttons").html('Select');
      var selected = event.target as HTMLElement
      if(selected)
      {
        this.isOnwardSelected = true;
        this.isDisplayDetail = true;
        this.isFlightsSelected = true;
        selected.classList.add('button-selected-style')
        selected.innerHTML = 'Selected'

        if(this.isMobile){
        $('.mob-items-book-list-itemso').removeClass('mob-list-itemsr-selected-dark');
         $('#mob-items-book-list-itemso_'+flightKey+'_'+item.partnerName).addClass('mob-list-itemsr-selected-dark');
        }else{
        console.log('selectedOnwardDiv_' + flightKey + "_"+ this.selectedFromKey);
                let selectedOnwardDiv = document.getElementById('selectedOnwardDiv_' + flightKey + "_"+ this.selectedFromKey);
        selectedOnwardDiv.classList.add('selected-flight-background');
        }
      }
      var onwardSelectedFlight = {flightKey:flightKey,flights:flights,priceSummery:item};
    this.onwardSelectedFlight = onwardSelectedFlight;
    var partner = item.partnerName;
    if(this.returnSelectedFlight != null && this.returnSelectedFlight != undefined)
    {
      if(partner != this.returnSelectedFlight.priceSummery.partnerName)
      {
        this.returnSelectedFlight = null;
        this.isReturnSelected = false;
      }
    }
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
    flightChangeDisplayR:any;

  flightsChangeR:any; selectedChangeR:any; flightKeyChangeR:any; itemChangeR:any;eventChangeR:any;
  onSelectReturnSplrt:any;
  sumval:any;sumvalold:any;  onward_combofareKey:any;return_combofareKey:any;splrtFlight:boolean=false;
  retrunFlightKey:any;
  onSelectReturn(flightKey:any,flights:any,item:any,priceDump:any,event:any , j:any)
  {
    this.retrunFlightKey = j;
  if(this.isOnwardSelected == true)
      {
        if(item.partnerName=='Cleartrip'){
        this.onSelectReturnSplrt= priceDump.filter((item: any) => {
        if(item.partnerName=='Cleartrip' && item.splrtFareFlight==true )
        return item;
        });
        }else{
        this.onSelectReturnSplrt=[];
        }
        var returnFlightnumbers=[];  var onwardFlightnumbers=[];
        var onwardAirline = this.onwardSelectedFlight.flights[0]['airline'];
        var returnAirline =flights[0]['airline'];
        var splrt_status = 0; var eligibleCombo=0;
        var sumval;

        var get_onward_price_new = this.onwardSelectedFlight.priceSummery.totalFare;
        var selected_price_new = item.totalFare;
        this.sumvalold = parseInt(get_onward_price_new) + parseInt(selected_price_new);


  if(this.onSelectOnwardSplrt.length >0 && this.onSelectReturnSplrt.length>0){

        if (onwardAirline == returnAirline) {
        splrt_status = 1;
        }

        if (onwardAirline == returnAirline && splrt_status == 1) {
        var onward_combofare = this.onSelectOnwardSplrt;
         for (var i = 0; i < flights.length; i++)  {     returnFlightnumbers.push(flights[i]['flightNumber']);  }
         for (var i = 0; i < this.onwardSelectedFlight.flights.length; i++)  {     onwardFlightnumbers.push(this.onwardSelectedFlight.flights[i]['flightNumber']);  }

        if (returnFlightnumbers.length == 1) {
        onward_combofare = onward_combofare.filter(function(a) {
        var clearTripSPLRTComboFlightNO = a.clearTripSPLRTComboFlightNO;
        var ComboFlightNO = clearTripSPLRTComboFlightNO.split(",");
        if (ComboFlightNO.indexOf(returnFlightnumbers[0]) >= 0) {
        return a;
        }
        });

        if (onward_combofare.length > 0) {
        this.onward_combofareKey=onward_combofare[0].clearTripFareKey;
        get_onward_price_new = onward_combofare[0].totalFare;
        eligibleCombo = 1;
        }
        } else {
        onward_combofare = onward_combofare.filter(function(a) {
        var clearTripSPLRTComboFlightNO = a.clearTripSPLRTComboFlightNO;
        var ComboFlightNO = clearTripSPLRTComboFlightNO.split("$");
                var equal = ComboFlightNO.length == returnFlightnumbers.length; // if array sizes mismatches, then we assume, that they are not equal
                if (equal) {
                $.each(ComboFlightNO, function(foo, val) {
                if (!equal) return false;
                if ($.inArray(val, returnFlightnumbers) == -1) {
                equal = false;
                } else {
                equal = true;
                }
                });
                }
        if (equal) {
        return a;
        }
        });
        if (onward_combofare.length > 0) {
         this.onward_combofareKey=onward_combofare[0].clearTripFareKey;
        get_onward_price_new = onward_combofare[0].totalFare;
        eligibleCombo = 1;
        }

        }
        var return_combofare = this.onSelectReturnSplrt;
        var comboairline =this.onwardSelectedFlight.flights[0]['carrier_id'];
        if (comboairline == '6E' || comboairline == 'SG') { eligibleCombo = 1; }

        if (onwardFlightnumbers.length == 1 && eligibleCombo == 1) {
            return_combofare = return_combofare.filter(function(a) {
                var clearTripSPLRTComboFlightNO = a.clearTripSPLRTComboFlightNO;
                var ComboFlightNO = clearTripSPLRTComboFlightNO.split(",");
                if (ComboFlightNO.indexOf(onwardFlightnumbers[0]) >= 0) {
                    return a;
                }
            });
            if (return_combofare.length > 0) {
                this.return_combofareKey=return_combofare[0].clearTripFareKey;
                selected_price_new = return_combofare[0].totalFare;
            }
        } else {
            return_combofare = return_combofare.filter(function(a) {
                var clearTripSPLRTComboFlightNO = a.clearTripSPLRTComboFlightNO;
                var ComboFlightNO = clearTripSPLRTComboFlightNO.split("$");

                var equal = ComboFlightNO.length == onwardFlightnumbers.length; // if array sizes mismatches, then we assume, that they are not equal
                if (equal) {
                $.each(ComboFlightNO, function(foo, val) {
                if (!equal) return false;
                if ($.inArray(val, onwardFlightnumbers) == -1) {
                equal = false;
                } else {
                equal = true;
                }
                });
                }
                if (equal) {
                return a;
                }

            });
            if (return_combofare.length > 0) {
                this.return_combofareKey=return_combofare[0].clearTripFareKey;
                selected_price_new = return_combofare[0].totalFare;
            }


        }
    }

  }

     var sumval_new = parseInt(get_onward_price_new) + parseInt(selected_price_new);
        if (sumval_new < this.sumvalold && onwardAirline == returnAirline && splrt_status == 1) {
         this.splrtFlight=true;
         this.sumval= sumval_new;
        } else {
          this.sumval= this.sumvalold;
        this.onward_combofareKey='';
        this.return_combofareKey='';
        }




        let departureAirportUserR=this.searchData.flightto;
        let arrivalAirportUserR=this.searchData.flightfrom;

        let departureAirportSelectedR=flights[0]['departureAirport'];
        let arrivalAirportSelectedR=flights[flights.length-1]['arrivalAirport'];
        this.flightsChangeR=flights;
        this.itemChangeR=item;
        this.flightKeyChangeR=flightKey;
        this.eventChangeR=event;


       if (departureAirportSelectedR != departureAirportUserR) {
        this.flightChangeDisplayR= "We found more airports near " + this.airportsNameJson[departureAirportUserR ].city + ". Cheapest flight at ₹"+formatNumber(item.totalFare,"en-US", "1.0")+" from " + this.airportsNameJson[departureAirportSelectedR ].airport_name+ ', ' +this.airportsNameJson[departureAirportSelectedR ].city + ' (' + departureAirportSelectedR + ')' + ' to ' + this.airportsNameJson[arrivalAirportSelectedR ].airport_name  + ', ' + this.airportsNameJson[arrivalAirportSelectedR ].city + ' (' + arrivalAirportSelectedR + ').';
        $('#flightChangeR').modal('show');
        return;
        }


        if (arrivalAirportSelectedR != arrivalAirportUserR) {
        this.flightChangeDisplayR= "We found more airports near " + this.airportsNameJson[arrivalAirportUserR ].city + ". Cheapest flight at ₹"+formatNumber(item.totalFare,"en-US", "1.0")+" from " + this.airportsNameJson[arrivalAirportSelectedR ].airport_name+ ', ' +this.airportsNameJson[arrivalAirportSelectedR ].city + ' (' + arrivalAirportSelectedR + ')' + ' to ' + this.airportsNameJson[arrivalAirportSelectedR ].airport_name  + ', ' + this.airportsNameJson[arrivalAirportSelectedR ].city + ' (' + arrivalAirportSelectedR + ').';
        $('#flightChangeR').modal('show');
        return;
        }


       $(".selectedReturnDiv").removeClass('selected-flight-background-return');
    $(".returnButtons").removeClass('button-selected-style');
    $(".returnButtons").html('Select');
      var selected = event.target as HTMLElement
      if(selected)
      {
        this.isReturnSelected = true;
        selected.classList.add('button-selected-style')
        selected.innerHTML = 'Selected'



                if(this.isMobile){
        $('.mob-items-book-list-itemsr').removeClass('mob-list-itemsr-selected-dark');
         $('#mob-items-book-list-itemsr_'+flightKey+'_'+item.partnerName).addClass('mob-list-itemsr-selected-dark');
        }else{
              let selectedReturnDiv =  document.getElementById('selectedReturnDiv_'+flightKey + "_" + this.retrunFlightKey)
        selectedReturnDiv.classList.add('selected-flight-background-return');
        }

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



    onSelectReturnChange(flightKey:any,flights:any,item:any,event:any)
  {
   // debugger
   $('#flightChangeR').modal('hide');
  if(this.isOnwardSelected == true)
      {
           $(".selectedReturnDiv").removeClass('selected-flight-background-return');
    $(".returnButtons").removeClass('button-selected-style');
    $(".selected-flight-background-return").removeClass('selected-flight-background-return');
    $(".returnButtons").html('Select');
      var selected = event.target as HTMLElement
      if(selected)
      {
        this.isReturnSelected = true;
        selected.classList.add('button-selected-style')
        selected.innerHTML = 'Selected'

                if(this.isMobile){
        $('.mob-items-book-list-itemsr').removeClass('mob-list-itemsr-selected-dark');
        $('#mob-items-book-list-itemsr_'+flightKey+'_'+item.partnerName).addClass('mob-list-itemsr-selected-dark');
        }else{
              let selectedReturnDiv =  document.getElementById('selectedReturnDiv_'+flightKey + "_" + this.retrunFlightKey)
        selectedReturnDiv.classList.add('selected-flight-background-return');
        }
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

  DisplayDetail(flightKey:any,flights:any,item:any,event:any,type:string)
  {

      if(type =='onward' && this.isOnwardSelected == false)
      {
      this.onwardSelectedFlight = {flightKey:flightKey,flights:flights,priceSummery:item}
      }
      if(type =='return' && this.isReturnSelected == false){
        this.returnSelectedFlight = {flightKey:flightKey,flights:flights,priceSummery:item}
      }
      this.isDetailsShow = true;

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
        "onwardFlightKey": this.onward_combofareKey? this.onward_combofareKey : onwardSelectedFlight.flightKey,
        "returnFlightKey": this.return_combofareKey? this.return_combofareKey : returnSelectedFlight.flightKey,
        "onwardFlights": onwardSelectedFlight.flights,
        "returnFlights": returnSelectedFlight.flights,
        "splrtFlight": this.splrtFlight,
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
