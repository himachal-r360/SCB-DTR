import { AfterViewInit, Component, ComponentFactoryResolver, ElementRef, HostListener,  OnDestroy, OnInit, ViewChild,ViewContainerRef,TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BusService } from 'src/app/shared/services/bus.service';
import { Location, ViewportScroller } from '@angular/common';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { Options } from '@angular-slider/ngx-slider';
import { SELECT_ITEM_HEIGHT_EM } from '@angular/material/select/select';
import { SimpleGlobal } from 'ng2-simple-global';
import {environment} from '../../../environments/environment';
import { StyleManagerService } from 'src/app/shared/services/style-manager.service';
import { AppConfigService } from '../../app-config.service';
import {EncrDecrService} from 'src/app/shared/services/encr-decr.service';
import { DOCUMENT, NgStyle, DecimalPipe, DatePipe } from '@angular/common';
import { formatNumber } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams} from '@angular/common/http';
import { Subscription,Subject } from 'rxjs';
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
  selector: 'app-busnew-list',
  templateUrl: './bus-list.component.html',
  styleUrls: ['./bus-list.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class BusNewlistComponent implements OnInit, AfterViewInit, OnDestroy {
        tag:any;
        queryBusData:any;
        searchData: any;
        searchParam:any;
        busList: any = [];
        busResponse:any;
        newDate = Date();
        loader = false;
        isMobile:boolean=false;
        minPrice: number = 0;
        maxPrice: number = 10000;
        resetMinPrice: number = 0;
        resetMaxPrice: number = 10000;
        math = Math;
        minDate = new Date();
        options: Options = {
        floor: 0,
        ceil: 1000,
        translate: (value: number): string => {
        return '';
        }
        };
        fromBusCode: string;
        toBusCode: string;
        busfrom: string;
        busto: string;
        departure:any;
        fromState:string;
        toState:string;
        cdnUrl: any;
        busListWithOutFilter: any = [];
         busListFullData: any = [];
         loading: boolean = true;
         parentSubject: Subject < Boolean > = new Subject();
         
        bus_Timingsitems = [
        { name: '0_6', active: false, value: 'Before 6 AM', image: '1.png' },
        { name: '6_12', active: false, value: '6 AM - 12 PM', image: '2.png' },
        { name: '12_18', active: false, value: '12 PM - 6 PM', image: '4.png' },
        { name: '18_0', active: false, value: 'After 6 PM', image: '3.png' }
        ]
        
        bus_TimingsArrivalitems = [
        { name: '0_6', active: false, value: 'Before 6 AM', image: '1.png' },
        { name: '6_12', active: false, value: '6 AM - 12 PM', image: '2.png' },
        { name: '12_18', active: false, value: '12 PM - 6 PM', image: '4.png' },
        { name: '18_0', active: false, value: 'After 6 PM', image: '3.png' }
        ]


        @ViewChild('itemsContainer', { read: ViewContainerRef }) container: ViewContainerRef;
        @ViewChild('item', { read: TemplateRef }) template: TemplateRef<any>;

        pageIndex: number = 3;
        ITEMS_RENDERED_AT_ONCE=2;
        nextIndex=0;

        private loadData() {
             if (this.pageIndex >= this.busList.length) {
             return false;
              }else{
             this.nextIndex = this.pageIndex + this.ITEMS_RENDERED_AT_ONCE;
             if(this.nextIndex > this.busList.length){
             this.nextIndex=this.busList.length;
             }

            for (let n = this.pageIndex; n < this.nextIndex ; n++) {
             const context = {
                item: [this.busList[n]]
              };

              this.container.createEmbeddedView(this.template, context);
            }
             this.pageIndex += this.ITEMS_RENDERED_AT_ONCE;

           }

        }


         private intialData() {
            for (let n = 0; n <this.ITEMS_RENDERED_AT_ONCE ; n++) {
              if(this.busList[n] != undefined)
              {
                const context = {
                  item: [this.busList[n]]
                };

                this.container.createEmbeddedView(this.template, context);
              }

            }
        }
   serviceSettings:any;

  constructor(private EncrDecr: EncrDecrService, private appConfigService:AppConfigService, public _styleManager: StyleManagerService,private _busService: BusService, public route: ActivatedRoute, private router: Router, private location: Location, private sg: SimpleGlobal, private scroll: ViewportScroller)  {
     this.cdnUrl = environment.cdnUrl+this.sg['assetPath'];
      this.serviceSettings=this.appConfigService.getConfig();
       this._styleManager.setScript('custom', `assets/js/custom.js`);

    /*   $(window).scroll(function(this) {
        if($(window).scrollTop() + $(window).height() > $(document).height() - 300) {
          $('#endOfPage').trigger('click');
        }
      });*/
      
       /* if( this.tag){
        const dialogRef = this.dialog.open(ChromeExtBusDialog, {
        autoFocus: false,
        panelClass: 'alert_covid',
        width:'800px',
        disableClose: true
        });
        this.sortBy='price-low-high';
        }*/
      
      
      
       this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

@HostListener('window:resize', ['$event']) resizeEvent(event: Event) {
  this.isMobile = window.innerWidth < 991 ?  true : false;
}

ngOnInit(): void {
        this.isMobile = window.innerWidth < 991 ?  true : false;
        this.resetPopups();
        this.gotoTop();
        this.loader = true;
        this.getQueryParamData(null);
        this.busSearch();
this.loading = true;
  }

        getQueryParamData(paramObj: any) {
        const params = this.route.snapshot.queryParams;
        this.queryBusData = params;
        this.searchData = params;
        this.searchParam = params;
        this.fromBusCode = this.searchParam.fromTravelCode;
        this.toBusCode = this.searchParam.toTravelCode;
        this.busfrom = this.searchParam.searchFrom;
        this.busto = this.searchParam.searchTo;
        this.departure = this.searchParam.departure;
        this.tag = this.searchParam.t;
        this.fromState=this.searchParam.fromState;
        this.toState=this.searchParam.toState;
        this.fromState=this.searchParam.fromState;
        this.toState=this.searchParam.toState;

        }
        
        
        resetPopups(){
        $(".modal").hide();
        $("body").removeAttr("style");
        $(".modal-backdrop").remove();
        }

        ngAfterViewInit(): void {
        setTimeout(() => {
        this.Initslider();
        }, 200);
        }



  // Bus Timings Filter
  BusTimingsDepartureFilterBusData(timingsItems: any) {
    timingsItems.active = !timingsItems.active;
    if(!this.isMobile)
    {
    this.popularFilterBusData();
    }
  }
  
  
  BusTimingsArrivalFilterBusData(timingsItems: any) {
    timingsItems.active = !timingsItems.active;
    if(!this.isMobile)
    {
    this.popularFilterBusData();
    }
  }

 //It is used for searching flights with left side filters.
     popularFilterBusData() {
     
        let updatedbusList: any = [];

        let busListWithOutFilter = this.busListWithOutFilter;
        const busListConst = busListWithOutFilter.map((b: any) => ({ ...b }));
        this.busList = busListConst;

        var current_date = new Date(this.departure),
        current_year = current_date.getFullYear(),
        current_mnth = current_date.getMonth(),
        current_day = current_date.getDate();

        var date1 = new Date(current_year, current_mnth, current_day, 0, 1); // 0:01 AM
        var date2 = new Date(current_year, current_mnth, current_day, 6, 1); // 6:01 AM

        updatedbusList = this.busList;

        //Departure Timing Filter Data
        updatedbusList = this.timingDepartureFilterBus(updatedbusList);

        //Arrival Timing Filter Data
        updatedbusList = this.timingArrivalFilterBus(updatedbusList);

   

    this.busList = updatedbusList;
     
     
     
     this.container.clear();
     this.intialData();
  }
  
    //Timing Departure Filter 
  timingDepartureFilterBus(busList: any) {
    this.busList = busList;
    let updatedbusList: any = [];
    let isfilterMorningDepartures: any = false;
    let isfilterFlightTiming = false;
    var current_date = new Date(this.departure),
    current_year = current_date.getFullYear(),
    current_mnth = current_date.getMonth(),
    current_day = current_date.getDate();

    var date1 = new Date(current_year, current_mnth, current_day, 0, 1); // 0:01 AM
    var date2 = new Date(current_year, current_mnth, current_day, 6, 1); // 6:01 AM
    var date3 = new Date(current_year, current_mnth, current_day, 12, 1); // 12:01 PM
    var date4 = new Date(current_year, current_mnth, current_day, 18, 1); // 18:01 PM
    var date5 = new Date(current_year, current_mnth, current_day, 23, 59); // 23:59 PM

    let isTimingFilterItems = this.bus_Timingsitems.filter((item: any) => {
      if (item.active == true) {
        return item;
      }
    })
    if (isTimingFilterItems.length > 0) {
      isfilterFlightTiming = true;
    }
    //Bus Timing Filter
    if (isfilterFlightTiming == true || isfilterMorningDepartures == true) {

      if (busList.length > 0) {
         let singleBusTiming = [];
         singleBusTiming =  busList.filter((d: any , indx: number) => {
             
              if ((isTimingFilterItems.filter((items: any) => { if (items.active == true && items.name == "0_6") { return items; } }).length > 0) && new Date(d.departureTime) > date1 && new Date(d.departureTime) < date2) {
             console.log(1);
              }
              else if ((isTimingFilterItems.filter((items: any) => { if (items.active == true && items.name == "6_12") { return items; } }).length > 0) && new Date(d.departureTime) > date2 && new Date(d.departureTime) < date3) {
                return d;
              }
              else if ((isTimingFilterItems.filter((items: any) => { if (items.active == true && items.name == "12_18") { return items; } }).length > 0) && new Date(d.departureTime) > date3 && new Date(d.departureTime) < date4) {
                return d;
              }
              else if ((isTimingFilterItems.filter((items: any) => { if (items.active == true && items.name == "18_0") { return items; } }).length > 0) && new Date(d.departureTime) > date4 && new Date(d.departureTime) < date5) {
                return d;
              }
            
     
        });
        
        
     if(singleBusTiming.length > 0){
      updatedbusList = singleBusTiming;
      }
        
      }
      
  
    }
    else {
      updatedbusList = busList;
    }

    return updatedbusList;
  }
     //Timing Arrival Filter 
  timingArrivalFilterBus(busList: any) {
    this.busList = busList;
    let updatedbusList: any = [];
    let isfilterMorningDepartures: any = false;
    let isfilterFlightTiming = false;
    var current_date = new Date(this.departure),
    current_year = current_date.getFullYear(),
    current_mnth = current_date.getMonth(),
    current_day = current_date.getDate();

    var date1 = new Date(current_year, current_mnth, current_day, 0, 1); // 0:01 AM
    var date2 = new Date(current_year, current_mnth, current_day, 6, 1); // 6:01 AM
    var date3 = new Date(current_year, current_mnth, current_day, 12, 1); // 12:01 PM
    var date4 = new Date(current_year, current_mnth, current_day, 18, 1); // 18:01 PM
    var date5 = new Date(current_year, current_mnth, current_day, 23, 59); // 23:59 PM

    let isTimingFilterItems = this.bus_TimingsArrivalitems.filter((item: any) => {
      if (item.active == true) {
        return item;
      }
    })
    if (isTimingFilterItems.length > 0) {
      isfilterFlightTiming = true;
    }
    //Bus Timing Filter
    if (isfilterFlightTiming == true || isfilterMorningDepartures == true) {

      if (busList.length > 0) {
         let singleBusTiming = [];
         singleBusTiming =  busList.filter((d: any , indx: number) => {
             console.log(d.arrivalTime);
              if ((isTimingFilterItems.filter((items: any) => { if (items.active == true && items.name == "0_6") { return items; } }).length > 0) && new Date(d.arrivalTime) > date1 && new Date(d.arrivalTime) < date2) {
             console.log(1);
              }
              else if ((isTimingFilterItems.filter((items: any) => { if (items.active == true && items.name == "6_12") { return items; } }).length > 0) && new Date(d.arrivalTime) > date2 && new Date(d.arrivalTime) < date3) {
                return d;
              }
              else if ((isTimingFilterItems.filter((items: any) => { if (items.active == true && items.name == "12_18") { return items; } }).length > 0) && new Date(d.arrivalTime) > date3 && new Date(d.arrivalTime) < date4) {
                return d;
              }
              else if ((isTimingFilterItems.filter((items: any) => { if (items.active == true && items.name == "18_0") { return items; } }).length > 0) && new Date(d.arrivalTime) > date4 && new Date(d.arrivalTime) < date5) {
                return d;
              }
            
     
        });
        
        
     if(singleBusTiming.length > 0){
      updatedbusList = singleBusTiming;
      }
        
      }
      
  
    }
    else {
      updatedbusList = busList;
    }

    return updatedbusList;
  } 


  convertDate(str: any) {
    var date = new Date(str),
      mnth = ('0' + (date.getMonth() + 1)).slice(-2),
      day = ('0' + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join('-');
  }



  applySortingMobile() {

    let body = document.getElementsByTagName('body')[0];
    body.classList.remove("noscroll");
    let sortingBtn = document.getElementById('sortMobileFilter');
    if(sortingBtn)
    {
      sortingBtn.style.display = 'none';
    }
  }

  // Bus popular filter
  BusPopularFilterBusData(popularItems: any) {
    popularItems.active = !popularItems.active;

  }

  resetAllFilters() {
     this.resetBusDepartureTimingsFilter();
     this.resetBusArrivalTimingsFilter();
  }
  resetBusDepartureTimingsFilter() {
    this.bus_Timingsitems.filter((item: any) => { item.active = false; return item; })
    this.popularFilterBusData();
  }

  resetBusArrivalTimingsFilter() {
    this.bus_TimingsArrivalitems.filter((item: any) => { item.active = false; return item; })
    this.popularFilterBusData();
  }

 
  busSearch() {
    this.loader = true;
   this._busService.getBuses((this.searchData)).subscribe(data => {
   this.busResponse =  data;
   
     if (this.busResponse && this.busResponse.forwardTrips && this.busResponse.forwardTrips.length > 0) {
     this.busList = this.busResponse.forwardTrips;
      this.busListWithOutFilter = this.busList;
     this.popularFilterBusData();
       this.loader = false;
        this.loading = false;
     }
   },
   (err: HttpErrorResponse) => {
      this.loader = false;
       this.loading = false;
   });
    
  }



  ngOnDestroy(): void {
        this._styleManager.removeScript('custom');
  }


  ConvertObjToQueryString(obj: any) {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }


  goSearch(){
    this.router.navigate(['/bus']);
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
      }

    }

  }
  onMaxValueChange(event: any) {
    this.maxPrice = event;
    if (this.maxPrice != null) {
      if(!this.isMobile)
      {
      }
    }
    if(!this.isMobile)
    {
    }
  }


  GetMinAndMaxPriceForFilter() {
    if (this.busList.length > 0) {
      this.minPrice = this.busList[0].priceSummary[0].totalFare;
      this.maxPrice = this.busList[0].priceSummary[0].totalFare;
      this.busList.forEach((z: any) => {
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


  gotoTop() {
       window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
});
  }
  

  openMobileFilterSection()
  {
      let body = document.getElementsByTagName('body')[0];
  body.classList.add("noscroll");
    var filterDiv = document.getElementById('sortMobileFilter');
    if(filterDiv)
    {
      filterDiv.style.display = 'block';
    }

  }

  CloseSortingSection()
  {
      let body = document.getElementsByTagName('body')[0];
  body.classList.remove("noscroll");
    var filterDiv = document.getElementById('sortMobileFilter');
    if(filterDiv)
    {
      filterDiv.style.display = 'none';
    }
  }
  onApplyFilter(){
      let body = document.getElementsByTagName('body')[0];
  body.classList.remove("noscroll");
    var filterDiv = document.getElementById('sortMobileFilter');
    if(filterDiv)
    {
      filterDiv.style.display = 'none';
    }
  }


}
