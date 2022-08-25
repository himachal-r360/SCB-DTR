import { ViewportScroller } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, HostListener, OnDestroy, OnInit, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SimpleGlobal } from 'ng2-simple-global';
import { Options } from 'ng5-slider';
import { repeat, Subscription } from 'rxjs';
import { FlightService } from 'src/app/common/flight.service';
import { EncrDecrService } from 'src/app/shared/services/encr-decr.service';
import { RestapiService } from 'src/app/shared/services/restapi.service';
import { environment } from 'src/environments/environment';

declare var $: any;
@Component({
  selector: 'app-flight-multicity',
  templateUrl: './flight-multicity.component.html',
  styleUrls: ['./flight-multicity.component.sass']
})
export class FlightMulticityComponent implements OnInit, AfterViewInit ,OnDestroy {
  cdnUrl: any;
  loader: boolean = false;
  sub?: Subscription;
  searchData: any;
  selectedTrip: number = 0;
  selectedTripData: any;
  flightList: any = [];
  flightListWithOutFilter: any = [];
  WithoutFilterFlightList: any = [];
  dummyForLoader = Array(10).fill(0).map((x, i) => i);
  EMIAvailableLimit: number = 3000;
  EMI_interest: number = 16;
  airportsNameJson: any;
  airlinesNameJson: any;
  airlines: any;
  layOverFilterArr: any;
  partnerFilterArr: any;
  DocKey: any;
  minPrice: number = 0;
  maxPrice: number = 10000;
  resetMinPrice: number = 0;
  resetMaxPrice: number = 10000;
  minStopOver: number = 0;
  maxStopOver: number = 24;
  isMobile: boolean = true;
  math = Math;
  minDate = new Date();
  sector:number = 0;
  SelectedFlightsOnSector:any = [];
  isSelectedSectorFlight:boolean = false;
  TotalFare:number= 0.0;
  BaseFare:number= 0.0;
  Tax:number= 0.0;
  isError:boolean = false;
  ErrorMessage:string = 'Flights overlap with each other.Please change the selection.'
  isAllSelected:boolean =false;
  isLast:boolean =false;
  mobileSelected:any;
  MobileCurrentSector:any;
  TotalPassenger:number = 1;
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
    { name: '0_6', active: false, value: 'Before 6 AM', image: '1.png' },
    { name: '6_12', active: false, value: '6 AM - 12 PM', image: '2.png' },
    { name: '12_18', active: false, value: '12 PM - 6 PM', image: '3.png' },
    { name: '18_0', active: false, value: 'After 6 PM', image: '4.png' }
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
    { name: 'P_H_L', active: false, value: 'High to Low' , image:'./assets/images/icons/price-h.png',sortValue:'Price' },
    { name: 'D_Short', active: false, value: 'Shortest' ,image:'./assets/images/icons/clock.png',sortValue:'Duration'},
    { name: 'D_Long', active: false, value: 'Longest',image:'./assets/images/icons/clock.png',sortValue:'Duration'},
    { name: 'D_E', active: false, value: 'Earliest' , image:'/assets/images/icons/Departure.png',sortValue:'Departure'},
    { name: 'D_L', active: false, value: 'Latest' ,image:'/assets/images/icons/Departure.png',sortValue:'Departure'},
    { name: 'A_E', active: false, value: 'Earliest',image:'./assets/images/icons/Arrival.png', sortValue:'Arrival'},
    { name: 'A_L', active: false, value: 'Latest',image:'./assets/images/icons/Arrival.png', sortValue:'Arrival'},
  ]
  RefundableFaresCount: number = 0;
  nonStopCount: number = 0;
  morningDearptureCount: number = 0;
  foodAllowanceCount: number = 0;


  @ViewChild('itemsContainer', { read: ViewContainerRef }) container: ViewContainerRef;
  @ViewChild('item', { read: TemplateRef }) template: TemplateRef<any>;


  pageIndex: number = 26;
  ITEMS_RENDERED_AT_ONCE = 25;
  nextIndex = 0;

  loadData() {
    if (this.pageIndex >= this.flightList.length) {
      return false;
    } else {
      this.nextIndex = this.pageIndex + this.ITEMS_RENDERED_AT_ONCE;

      if (this.nextIndex > this.flightList.length) {
        this.nextIndex = this.flightList.length;
      }

      for (let n = this.pageIndex; n < this.nextIndex; n++) {
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
    for (let n = 0; n < this.ITEMS_RENDERED_AT_ONCE; n++) {
      if (this.flightList[n] != undefined) {
        const context = {
          item: [this.flightList[n]]
        };

        this.container.createEmbeddedView(this.template, context);
      }

    }
    //this.pageIndex += this.ITEMS_RENDERED_AT_ONCE;
    //  this.gotoTop();
  }

  constructor(private route: ActivatedRoute, private _flightService: FlightService, private EncrDecr: EncrDecrService, private sg: SimpleGlobal, private scroll: ViewportScroller, public rest: RestapiService, private router: Router) {
    this.cdnUrl = environment.cdnUrl + this.sg['assetPath'];
    $(window).scroll(function (this) {
      if ($(window).scrollTop() + $(window).height() > $(document).height() - 300) {
        $('#endOfPage').trigger('click');
      }
    });
  }

  @HostListener('window:resize', ['$event']) resizeEvent(event: Event) {
    this.isMobile = window.innerWidth < 991 ? true : false;
  }
  ngOnInit(): void {
    this.route.url.subscribe(url =>{
    this.loader = true;
    this.isMobile = window.innerWidth < 991 ? true : false;
    this.getQueryParamData();
    this.flightSearch();
    this.getAirpotsNameList();
    });
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.getAirlinesIconList();
      var element = document.getElementById('Sector-area');
      if(element)
      {
        element.style.gridTemplateColumns = 'repeat('+this.searchData.length+',1fr)';
      }
      this.Initslider();
    }, 200);
  }
  getQueryParamData() {
    const urlParam = this.route.snapshot.queryParams;
    this.searchData = urlParam;
    var flightSearchArr = [];
    for (var i = 0; i < 5; i++) // for generating array by object.
    {
      var objKeys = Object.keys(urlParam); // get all object Keys
      var objSearch = {};
      for (var j = 0; j < objKeys.length; j++) {

        if (objKeys[j].indexOf("[" + i + "]") > -1) {
          var objKey = objKeys[j].substring(0, objKeys[j].length - 3);
          var objKeyVal = urlParam[objKeys[j]];
          objSearch[objKey] = objKeyVal;
        }
      }

      if (objSearch != null && objSearch != undefined && Object.keys(objSearch).length) {
        flightSearchArr.push(objSearch); // Add object in array.
      }
    }
    this.searchData = flightSearchArr;
    this.searchData.forEach((z)=>{
      z.isSelected = false;
      z.selectedFlight = null
    });
    this.selectedTripData = this.searchData[0];
    this.TotalPassenger = parseInt(this.selectedTripData.adults) + parseInt(this.selectedTripData.infants) + parseInt(this.selectedTripData.child);

  }

  flightSearch() {
    this.loader = true;
    let searchObj = (this.searchData);
    var element = document.getElementById('Sector-area');
      if(element)
      {
        element.style.gridTemplateColumns = 'repeat('+this.searchData.length+',1fr)';
      }

    this.sub = this._flightService.multicityList(searchObj).subscribe((res: any) => {
      if(res.response.journeys)
      {
        this.WithoutFilterFlightList = res.response.journeys;
        this.flightList = this.ascPriceSummaryFlighs(res.response.journeys[0].sectors);
        this.flightList.forEach((z)=>{
          z.isSelected = false;
        });
        this.flightListWithOutFilter = this.flightList;
        this.DocKey = res.response.docKey;
        this.getAirlinelist();
        if (this.flightList.length > 0) {
          this.GetMinAndMaxPriceForFilter();
          // this.minPrice = this.flightList[0].priceSummary[0].totalFare;
          // this.maxPrice = this.flightList[this.flightList.length - 1].priceSummary[0].totalFare;
           this.sliderRange(this, this.minPrice, this.maxPrice);
         }
        // console.log(this.flightList,"this.flightList");
         this.loader = false;
         this.popularFilterFlightData();

      }
      else{
        this.loader = false;
      }

    }, (error) => {
      this.loader = false;
      console.log(error) });

  }
  ascPriceSummaryFlighs(flightsData: any) {
    flightsData.filter((flightItem: any, indx: number) => {

      let priceSummaryArr = flightItem.priceSummary;
      if (priceSummaryArr.length > 1) {
        priceSummaryArr.sort(function (a, b) { if (a.totalFare === b.totalFare) { if (Math.random() < .5) return -1; else return 1; } else { return a.totalFare - b.totalFare; } });
        flightItem.priceSummary = priceSummaryArr;
      }
    })
    return flightsData;
  }
  activeSelectedTrip(i : number)
  {
    if(i == (this.searchData.length-1) && !this.isAllSelected)
    {
      this.isLast = true;
    }
    else{
      this.isLast = false;
    }
    this.selectedTripData = this.searchData[i];
    this.TotalPassenger = parseInt(this.selectedTripData.adults) + parseInt(this.selectedTripData.infants) + parseInt(this.selectedTripData.child);
    this.selectedTrip = i;
    this.flightList = [];
    this.flightList = this.WithoutFilterFlightList[i].sectors;
    this.flightList.forEach((z)=>{
      if(this.SelectedFlightsOnSector[i])
      {
        if(z.flightKey == this.SelectedFlightsOnSector[i].flightKey)
        {
          z.isSelected = true;
        }
       else{
        z.isSelected = false;
       }
      }
     else{
      z.isSelected = false;
     }
    });
    this.sector = i;
    this.flightListWithOutFilter = this.flightList;
    if(this.isMobile)
    {
      if(this.selectedTripData.isSelected)
      {
        this.isSelectedSectorFlight = true;
      }
      else{
        this.isSelectedSectorFlight = false;
      }
    }
    this.getAirlinelist();
    if (this.flightList.length > 0) {
      this.GetMinAndMaxPriceForFilter();
      // this.minPrice = this.flightList[0].priceSummary[0].totalFare;
      // this.maxPrice = this.flightList[this.flightList.length - 1].priceSummary[0].totalFare;
       this.sliderRange(this, this.minPrice, this.maxPrice);
     }
    this.popularFilterFlightData();
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

  calculateEMI(amount: number) {
    return Math.round((amount + (amount * (this.EMI_interest / 100))) / 12);
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

  // get airline list
  getAirlinesIconList() {
    this._flightService.getFlightIcon().subscribe((res: any) => {
      this.airlinesNameJson = res;

    })
  }

  // get airport list
  getAirpotsNameList() {
    this._flightService.getAirportName().subscribe((res: any) => {
      this.airportsNameJson = res;

    })
  }

  flightCoupons = [];
  getCoupons() {
    const urlParams = { 'client_token': 'HDFC243', 'service_id': '1' };
    var couponParam = {
      postData: this.EncrDecr.set(JSON.stringify(urlParams))
    };

    this.rest.getCouponsByService(couponParam).subscribe(results => {
      if (results.status == "success") {
        this.flightCoupons = results.data;
      }

    });

  }

bookingSummary() {

   let uniqueKey='';


        for (let j = 0; j < this.SelectedFlightsOnSector.length; j++) {
        uniqueKey+=this.SelectedFlightsOnSector[j]['flightKey'];
        }


        let flightDetailsArr: any = {
        "travel": "DOM",
        "travel_type": "M",
        "docKey": this.DocKey,
        "onwardFlightKey": "",
        "returnFlightKey": "",
        "onwardFlights": this.SelectedFlightsOnSector,
        "returnFlights":'' ,
        "onwardPriceSummary": "",
        "returnPriceSummary": '',
        "queryFlightData": this.searchData
    };

   uniqueKey+=this.DocKey;


  let randomFlightDetailKey = btoa(uniqueKey);
  sessionStorage.setItem(randomFlightDetailKey, JSON.stringify(flightDetailsArr));
  let url = 'flight-checkout?searchFlightKey=' + randomFlightDetailKey;

    setTimeout(() => {
      this.router.navigateByUrl(url);
    }, 10);

  }

  getAirlinelist() {
    let airlineNameArr = [];
    let airlinePartnerArr = [];
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
          priceSummary = priceSummaryList[p].totalFare;
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

          let partnerName = priceSummaryList[p].partnerName;
          if (airlinePartnerArr.filter((d: any) => { if (d.partnerName == partnerName) { return d; } }).length < 1) {
            let partnerObj = {
              "partnerName": partnerName,
              "active": false
            };
            airlinePartnerArr.push(partnerObj);
          }
        }
      }
    }
    this.airlines = airlineNameArr;
    this.partnerFilterArr = airlinePartnerArr;
    this.layOverFilterArr = layOverArr;

  }//It is used for searching flights with left side filters.
  popularFilterFlightData() {
    let updatedflightList: any = [];

    let flightListWithOutFilter = this.flightListWithOutFilter;
    const flightListConst = flightListWithOutFilter.map((b: any) => ({ ...b }));
    this.flightList = flightListConst;

    var current_date = new Date(this.selectedTripData.departure),
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

        if (flights.length == 1 && e.flights.length==1) {
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
    // this.flightList = this.airlineFilterFlights(this.flightList);

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

    //Partner Filter
    this.flightList = this.partnerFilterFlights(this.flightList);

    // Layover Filter Flights
    this.flightList = this.layoverFilterFlights(this.flightList);



    if (this.container) {
      this.container.clear();
      this.intialData();
    }
    else {
      this.loader = false;
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
  onMinValueChange(event: any) {
    this.minPrice = event;
    if (this.minPrice != null) {
      if (!this.isMobile) {
        this.popularFilterFlightData();
      }

    }

  }
  onMaxValueChange(event: any) {
    this.maxPrice = event;
    if (this.maxPrice != null) {
      if (!this.isMobile) {
        this.popularFilterFlightData();
      }
    }
    if (!this.isMobile) {
      this.popularFilterFlightData();
    }
  }

  onMinStopOverChange(event: any) {
    this.minStopOver = event;
    if (!this.isMobile) {
      this.popularFilterFlightData();
    }
  }
  onMaxStopOverChange(event: any) {
    this.maxStopOver = event;
    if (!this.isMobile) {
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

  //Filters
  resetAllFilters() {
    this.resetPopularFilter();
    this.resetFlightTimingsFilter();
    this.resetPriceFilter();
    this.resetFlightStopsFilter();
    this.resetAirlineFlightsFilter()
    this.resetStopOverFilter();
    this.resetLayOverFilter();
    this.resetPartnerFlightsFilter();
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
  resetPartnerFlightsFilter() {
    this.partnerFilterArr.filter((item: any) => { item.active = false; return item; })
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
    var current_date = new Date(this.selectedTripData.departure),
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
          //  console.log(d.flights,"d.flights");
          singleFlightTiming = d.flights.filter(function (e: any, indx: number) {
            if (indx == 0) {
              if ((isTimingFilterItems.filter((items: any) => { if (items.active == true && items.name == "0_6") { return items; } }).length > 0) && new Date(e.departureDateTime) > date1 && new Date(e.departureDateTime) < date2) {
                return e;
              }
              else if ((isTimingFilterItems.filter((items: any) => { if (items.active == true && items.name == "6_12") { return items; } }).length > 0) && new Date(e.departureDateTime) > date2 && new Date(e.departureDateTime) < date3) {
                return e;
              }
              else if ((isTimingFilterItems.filter((items: any) => { if (items.active == true && items.name == "12_18") { return items; } }).length > 0) && new Date(e.departureDateTime) > date3 && new Date(e.departureDateTime) < date4) {
                return e;
              }
              else if ((isTimingFilterItems.filter((items: any) => { if (items.active == true && items.name == "18_0") { return items; } }).length > 0) && new Date(e.departureDateTime) > date4 && new Date(e.departureDateTime) < date5) {
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
        flightList = filteredAirlines;
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


  //partner filter
  partnerFilterFlights(flightList: any) {
    if (flightList.length > 0) {
      let partnerArr: any = [];
      partnerArr = this.partnerFilterArr.filter((item: any) => {
        if (item.active == true) {
          return item;
        }
      })

      var filteredAirlines: any[] = [];
      if (partnerArr.length > 0) {
        flightList.forEach((e: any) => {
          var flights = [];
          e.priceSummary.filter((d: any) => {
            if (partnerArr.map(function (x: any) { return x.partnerName; }).indexOf(d.partnerName) > -1) {
              flights.push(d);
            }
          })
          if (flights.length > 0) {
            e.priceSummary = flights;
            filteredAirlines.push(e);
          }
        });
        flightList = filteredAirlines;
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

  show_airline_more: number = 0;
  showmoreAirline() {
    this.show_airline_more = 1;
  }

  show_layover_more: number = 0;
  showmoreLayover() {
    this.show_layover_more = 1;
  }

  // Flight popular filter
  FlightPopularFilterFlightData(popularItems: any) {
    popularItems.active = !popularItems.active;
    if (popularItems.name == "Morning_Departures") {
      this.flight_Timingsitems.filter((item: any) => { if (item.name == "0_6") { item.active = !item.active; return item; } })
    }
    if (popularItems.name == "non_stop") {
      this.stopsFilteritems.filter((item: any) => { if (item.name == "no_stops") { item.active = !item.active; return item; } })
    }
    if (!this.isMobile) {
      this.popularFilterFlightData();
    }
  }
  // Flight Timings Filter
  FlightTimingsFilterFlightData(timingsItems: any) {
    timingsItems.active = !timingsItems.active;
    if (timingsItems.name == "0_6") {
      this.flight_PopularItems.filter((item: any) => { if (item.name == "Morning_Departures") { item.active; return item; } })
    }
    if (!this.isMobile) {
      this.popularFilterFlightData();
    }
  }

  flightAirlineFilterFlightData(airlineItem: any) {
    airlineItem.active = !airlineItem.active;
    if (!this.isMobile) {
      this.popularFilterFlightData();
    }
  }

  flightPartnerFilterFlightData(partnerItem: any) {
    partnerItem.active = !partnerItem.active;
    if (!this.isMobile) {
      this.popularFilterFlightData();
    }
  }
  flightLayoverFilterFlightData(layoverItem: any) {
    layoverItem.active = !layoverItem.active;
    if (!this.isMobile) {
      this.popularFilterFlightData();
    }
  }

  // Flight Stops Filter
  FlightStopsFilterFlightData(FlightStopitem: any) {
    FlightStopitem.active = !FlightStopitem.active;
    if (!this.isMobile) {
      this.popularFilterFlightData();
    }
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

  OpenPartner(i: number) {
    $(".mob-items-book-list").css('display', 'none')
    var SelectedElement = document.getElementById('CompareToFly_' + i);
    if (SelectedElement) {
      SelectedElement.style.display = 'block';
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

  openFlightDetailMobile(i: any, title: any) {
    let flightDetail = document.getElementById('flightDetailMobile_' + i);
    let cancellation: any = document.getElementById('collapseTwo-fd_' + i);
    let baggage: any = document.getElementById('collapseThree-fd_' + i);
    let fareRules: any = document.getElementById('collapsefour-fd_' + i);
    if (flightDetail && title == 'flightdetail') {
      flightDetail.style.display = "block";
    }
    if (cancellation && title == 'cancellation') {
      cancellation.classList.toggle("show");
    }
    if (baggage && title == 'baggagepolicy') {
      baggage.classList.toggle("show");
    }
    if (fareRules && title == 'farerules') {
      fareRules.classList.toggle("show");
    }
  }

  closeFlightDetailMobile(i: any) {
    let element = document.getElementById('flightDetailMobile_' + i);
    if (element) {
      element.style.display = "none";
    }

  }
  openMobileFilterSection() {
    var filterDiv = document.getElementById('sortMobileFilter');
    if (filterDiv) {
      filterDiv.style.display = 'block';
    }

  }

  CloseSortingSection() {
    var filterDiv = document.getElementById('sortMobileFilter');
    if (filterDiv) {
      filterDiv.style.display = 'none';
    }
  }
  onApplyFilter() {
    var filterDiv = document.getElementById('sortMobileFilter');
    if(filterDiv)
    {
      filterDiv.style.display = 'none';
    }
    this.popularFilterFlightData();
  }

  IsTimeDiffLess(flights:any)
  {
   var disable = false;
   if(flights.length > 1)
   {
    for(var i =0 ; i< (flights.length -1); i++)
    {
      var diff = new Date(flights[i+1].departureDateTime).valueOf() -new Date(flights[i].arrivalDateTime).valueOf();
      var diffInHours = diff/1000/60/60;

      if(diffInHours <= 2)
      {
        disable = true;
        break;
      }
    }

   }
   return disable;
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

  onSelect(flightKey:any,flights:any,item:any,event:any)
  {

    $(".BtnOnSelect").removeClass('button-selected-style');
    $(".BtnOnSelect").html('Select');
      var selected = event.target as HTMLElement
      if(selected)
      {
        selected.classList.add('button-selected-style')
        selected.innerHTML = 'Selected'
      }
      this.TotalFare = this.TotalFare + item.totalFare;
      this.BaseFare = this.BaseFare + item.baseFare;
      this.Tax = this.Tax + (item.totalFare-item.baseFare)

      var SelectedFlight = {flightKey:flightKey,flights:flights,priceSummery:item,index:this.sector};
      this.isSelectedSectorFlight = true;
      this.SelectedFlightsOnSector[this.sector] = SelectedFlight;
      this.searchData[this.sector].isSelected = true;
      this.searchData[this.sector].selectedFlight = SelectedFlight;

      var select = this.searchData.filter(z=> {return z.isSelected == true})

      if(select.length == this.searchData.length)
      {
        this.isAllSelected = true;
        this.isLast = false;
      }
      for(var i =0 ; i< (this.SelectedFlightsOnSector.length -1); i++)
      {
        var diff = new Date(this.SelectedFlightsOnSector[i+1].flights[0].departureDateTime).valueOf() -new Date(this.SelectedFlightsOnSector[i].flights[(this.SelectedFlightsOnSector[i].flights.length -1)].arrivalDateTime).valueOf();
        var diffInHours = diff/1000/60/60;

        if(diffInHours <= 2)
        {
          this.isError = true;
          this.ErrorMessage = "Flights overlap with each other.Please change the selection.";
          break;
        }
        else{
          this.isError = false;
        }
      }

  }

  nextFlightSelect()
  {
    this.activeSelectedTrip(this.sector + 1);
  }

  onMobileSelect(flightKey:any,flights:any,item:any,event:any)
  {
    $(".BtnOnSelect").removeClass('button-selected-style');
    $(".BtnOnSelect").html('Select');
      var selected = event.target as HTMLElement
      if(selected)
      {
        selected.classList.add('button-selected-style')
        selected.innerHTML = 'Selected'
      }
    var SelectedFlight = {flightKey:flightKey,flights:flights,priceSummery:item,index:this.sector};
    this.isSelectedSectorFlight = true;
    this.SelectedFlightsOnSector[this.sector] = SelectedFlight;
      this.searchData[this.sector].isSelected = true;
      this.searchData[this.sector].selectedFlight = SelectedFlight;
      this.mobileSelected = SelectedFlight;
      var select = this.searchData.filter(z=> {return z.isSelected == true})
      if(select.length == this.searchData.length)
      {
        this.isAllSelected = true;
        this.isLast = false;
      }
      for(var i =0 ; i< (this.SelectedFlightsOnSector.length -1); i++)
      {
        var diff = new Date(this.SelectedFlightsOnSector[i+1].flights[0].departureDateTime).valueOf() -new Date(this.SelectedFlightsOnSector[i].flights[(this.SelectedFlightsOnSector[i].flights.length -1)].arrivalDateTime).valueOf();
        var diffInHours = diff/1000/60/60;

        if(diffInHours <= 2)
        {
          this.isError = true;
          this.ErrorMessage = "Flights overlap with each other.Please change the selection.";
          break;
        }
        else{
          this.isError = false;
        }
      }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
