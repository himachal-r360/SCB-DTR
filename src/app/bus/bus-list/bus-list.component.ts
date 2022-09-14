import { AfterViewInit,Inject, Component, ComponentFactoryResolver, ElementRef, HostListener,  OnDestroy, OnInit, ViewChild,ViewContainerRef,TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BusService } from 'src/app/shared/services/bus.service';
import { Location, ViewportScroller } from '@angular/common';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
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
import { BusHelper } from 'src/app/shared/utils/bus-helper';
import { BusfilterPipe } from 'src/app/shared/pipes/busfilter.pipe';
import { FlightService } from 'src/app/common/flight.service';
import { RestapiService} from 'src/app/shared/services/restapi.service';
import * as moment from 'moment';
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
  providers: [BusfilterPipe],
})
export class BusNewlistComponent implements OnInit, AfterViewInit, OnDestroy {
  dummyForLoader = Array(10).fill(0).map((x,i)=>i);
        rtcFilter = {
        'filterCode': 'rtc',
        'selected': false
        }
        isrtc: boolean = false;
        filterDeparture = [];
        filterArrival = [];
        filterClasses = [];
        filterboardingpoints = [];
        filterdroppingpoints = [];
        filteramenities = [];
        sortBy: string = 'rating';

        busFilterlengthZero :boolean = false;
        tag:any;
        currentRtc: string;
        queryBusData:any;
        searchData: any;
        searchParam: any = [];
        searchParamPreviousDay: any = [];
        searchParamNextDay: any = [];
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
        totalrtcseats: number = 0;
        totalrtc: any = [];
        rtctotal = [];
        departureTimeArr: any = [];
          params: any = [];
        bus_Timingsitems = [
        { name: 'BEFORE-6AM', active: false, value: 'Before 6 AM', image: '1.png' },
        { name: '6AM-12PM', active: false, value: '6 AM - 12 PM', image: '2.png' },
        { name: '12PM-6PM', active: false, value: '12 PM - 6 PM', image: '4.png' },
        { name: 'AFTER-6PM', active: false, value: 'After 6 PM', image: '3.png' }
        ]
        
        bus_TimingsArrivalitems = [
        { name: 'BEFORE-6AM', active: false, value: 'Before 6 AM', image: '1.png' },
        { name: '6AM-12PM', active: false, value: '6 AM - 12 PM', image: '2.png' },
        { name: '12PM-6PM', active: false, value: '12 PM - 6 PM', image: '4.png' },
        { name: 'AFTER-6PM', active: false, value: 'After 6 PM', image: '3.png' }
        ]
        availableClasses: any = [];
        allAvailableClasses: any = [];
        boardingpoints: any = [];
        droppingpoints: any = [];
        allboardingpoints: any = [];
        allamenities: any = [];
        alldroppingpoints: any = [];
        amenities: any = [];
         operators: any = [];
        alloperators: any = [];
        filterOperators: any = [];
        tracksearchObj:any;
        @ViewChild('itemsContainer', { read: ViewContainerRef }) container: ViewContainerRef;
        @ViewChild('item', { read: TemplateRef }) template: TemplateRef<any>;
        pageIndex: number = 11;
        ITEMS_RENDERED_AT_ONCE=10;
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
  datePreviousStatus: boolean;
  constructor(public dialog: MatDialog,public rest:RestapiService,private EncrDecr: EncrDecrService, private appConfigService:AppConfigService, public _styleManager: StyleManagerService,private _busService: BusService, public route: ActivatedRoute, private router: Router, private location: Location, private sg: SimpleGlobal, private scroll: ViewportScroller, public busHelper: BusHelper ,private busfilter: BusfilterPipe,private _flightService: FlightService,  private activatedRoute: ActivatedRoute)  {
     this.cdnUrl = environment.cdnUrl+this.sg['assetPath'];
      this.serviceSettings=this.appConfigService.getConfig();
       this._styleManager.setScript('custom', `assets/js/custom.js`);

   $(window).scroll(function(this) {
        if($(window).scrollTop() + $(window).height() > $(document).height() - 300) {
          $('#endOfPage').trigger('click');
        }
      });
        this.params = this.activatedRoute.snapshot;
     if( this.tag){
        const dialogRef = this.dialog.open(ChromeExtBusDialog, {
        autoFocus: false,
        panelClass: 'alert_covid',
        width:'800px',
        disableClose: true
        });
        this.sortBy='price-low-high';
        }
      
       this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }



   ngOnInit(): void {
        this.isMobile = window.innerWidth < 991 ?  true : false;
        this.resetPopups();
        this.gotoTop();
        this.loader = true;
        this.getQueryParamData(null);
         this.headerHideShow(null)
        this.busSearch();
        this.loading = true;
        
        const queryParams = this.activatedRoute.snapshot.queryParams;
        var datePipe = new DatePipe('en-US');
        var previousDay = new Date(this.departure);
        var departureTimestamp = previousDay.setDate(previousDay.getDate() - 1);
        this.departureStr = previousDay.setDate(previousDay.getDate() - 1);
        var departureDateNumber = datePipe.transform(departureTimestamp, 'yyyyMMdd');
        var todayDt = datePipe.transform(new Date(), 'yyyy-MM-dd');
        var todayDateNumber = datePipe.transform(todayDt, 'yyyyMMdd'); 
        if (parseInt(todayDateNumber) > parseInt(departureDateNumber)) { 
        this.datePreviousStatus = false;
        } else {
        this.datePreviousStatus = true;
        }

        this.activatedRoute.queryParams
        .subscribe(params => {
        this.tracksearchObj = { ...params.keys, ...params };
        }
        );

        let trackUrlParams = new HttpParams();
        trackUrlParams.set('current_url', window.location.href)
        trackUrlParams.set('category', 'RedBus')
        trackUrlParams.set('event', 'Search listing1')
        trackUrlParams.set('metadata',this.EncrDecr.set(JSON.stringify(this.tracksearchObj)));

        const track_body: string = trackUrlParams.toString();
        this.rest.trackEvents( track_body).subscribe(result => {});
        
        
    }

    /* Go home btn */
goback() {
  this.router.navigate([this.sg['domainPath']+'/bus']);
 }

  headerHideShow(event:any) {
    this.isMobile = window.innerWidth < 991 ?  true : false;
    if(this.isMobile){
     this._flightService.showHeader(false);
    }else{
    this._flightService.showHeader(true);
    }
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
     this.busSearchCallBack(params);
      localStorage.setItem(environment.busLastSearch,JSON.stringify(params));
        }
        
      continueSearch:any=[];  
        continueSearchBuss:any=[]
    busSearchCallBack(param:any){
      let searchValueAllobj=param;
      let continueSearch:any=localStorage.getItem(environment.continueSearchBus);
      if(continueSearch==null){
        this.continueSearchBuss=[];
      }
      if(continueSearch!=null && continueSearch.length>0){
        this.continueSearchBuss=JSON.parse(continueSearch);
        this.continueSearchBuss=this.continueSearchBuss.filter((item:any)=>{
          if(item.searchFrom!=searchValueAllobj.searchFrom || item.searchTo!=searchValueAllobj.searchTo)
          {
              return item;
          }
        })
      }
      if(this.continueSearchBuss.length>3){
        this.continueSearchBuss=this.continueSearchBuss.slice(0,3);
      }
      this.continueSearchBuss.unshift(searchValueAllobj);// unshift/push - add an element to the beginning/end of an array
      localStorage.setItem(environment.continueSearchBus,JSON.stringify(this.continueSearchBuss));
  }      
        
        resetPopups(){
        $(".modal").hide();
        $("body").removeAttr("style");
        $(".modal-backdrop").remove();
        }

  ngAfterViewInit(): void {

  }
        seatSeletedView = false;
  seatSelected(appt) {
  this.seatSeletedView = appt;
 }
 departureDate: any;departureStr: any;
 previousDay() {
  var datePipe = new DatePipe('en-US');
  var previousDay = new Date(this.departure);
  var departureTimestamp = previousDay.setDate(previousDay.getDate() - 1);
  this.departureStr = previousDay.setDate(previousDay.getDate() - 1);
  var departureDateNumber = datePipe.transform(departureTimestamp, 'yyyyMMdd');
  var departureDateNumberFormat2 = datePipe.transform(departureTimestamp, 'yyyy-MM-dd');
  var todayDt = datePipe.transform(new Date(), 'yyyy-MM-dd');
  var todayDtStr = new Date(todayDt);
  var todayTimestamp = todayDtStr.setDate(todayDtStr.getDate());
  var todayDateNumber = datePipe.transform(todayDt, 'yyyyMMdd');
  if (parseInt(todayDateNumber) >= parseInt(departureDateNumber)) {
   this.datePreviousStatus = false;
   this.departureDate = departureDateNumberFormat2;
   this.searchParamPreviousDay = {
    searchFrom: this.busfrom,
    searchTo: this.busto,
    fromTravelCode: this.fromBusCode,
    toTravelCode: this.toBusCode,
    departure: this.departureDate,
       fromState:this.fromState,
   toState:this.toState
   };
   this.router.navigate([this.sg['domainPath']+'/bus/search/'], {
    queryParams: this.searchParamPreviousDay
   });
  } else {
   this.datePreviousStatus = true;
   this.departureDate = departureDateNumberFormat2;
   this.searchParamPreviousDay = {
    searchFrom: this.busfrom,
    searchTo: this.busto,
    fromTravelCode: this.fromBusCode,
    toTravelCode: this.toBusCode,
    departure: this.departureDate
   };
   this.router.navigate([this.sg['domainPath']+'/bus/search/'], {
    queryParams: this.searchParamPreviousDay
   });
  }
 }

 nextDay() {
  var myDate = new Date(this.departure);
  var nextDay = new Date(myDate);
  this.departureStr = nextDay.setDate(myDate.getDate() + 1);
  var datePipe = new DatePipe('en-US');
  this.departureDate = datePipe.transform(this.departureStr, 'yyyy-MM-dd');
  this.searchParamNextDay = {
   searchFrom: this.busfrom,
   searchTo: this.busto,
   fromTravelCode: this.fromBusCode,
   toTravelCode: this.toBusCode,
   departure: this.departureDate,
   fromState:this.fromState,
   toState:this.toState
   
  };
  this.router.navigate([this.sg['domainPath']+'/bus/search/'], {
   queryParams: this.searchParamNextDay
  });
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
        updatedbusList = this.busList;
        updatedbusList=  updatedbusList.filter(a => {  return a.availableSeats > 0 ; });
        //Departure Timing Filter Data
        updatedbusList = this.timingDepartureFilterBus(updatedbusList);

        //Arrival Timing Filter Data
        updatedbusList = this.timingArrivalFilterBus(updatedbusList);

     //PriceFilter
    if (this.busList.length > 0) {
      var min_price = this.minPrice;
      var max_price = this.maxPrice;
      var filteredPrice: any[] = [];
      this.busList.filter((e: any) => {
             if (e.fareDetails[0].baseFare >= min_price && e.fareDetails[0].baseFare <= max_price) {
            filteredPrice.push(e);
          }
              
      });
     
      updatedbusList = filteredPrice;
    }

  //Class Filter
  
  
    updatedbusList =  updatedbusList.filter(a => {
        if(this.filterClasses.length){
        //Only Seater
        if(this.filterClasses.includes("seater")==true && this.filterClasses.includes("sleeper")==false){
        if(this.filterClasses.includes("ac")==true && this.filterClasses.includes("nonAC")==true){
        return a['seater']==true && (a['ac']==true || a['nonAC']==true);
        }else  if(this.filterClasses.includes("ac")==true && this.filterClasses.includes("nonAC")==false){
        return a['seater']==true && (a['ac']==true );
        }else  if(this.filterClasses.includes("ac")==false && this.filterClasses.includes("nonAC")==true){
        return a['seater']==true && (a['nonAC']==true );
        }else{
        return a['seater']==true;
        }
        }
        //Only sleeper
        else if(this.filterClasses.includes("seater")==false && this.filterClasses.includes("sleeper")==true){
        if(this.filterClasses.includes("ac")==true && this.filterClasses.includes("nonAC")==true){
        return a['sleeper']==true && (a['ac']==true || a['nonAC']==true);
        }else  if(this.filterClasses.includes("ac")==true && this.filterClasses.includes("nonAC")==false){
        return a['sleeper']==true && (a['ac']==true );
        }else  if(this.filterClasses.includes("ac")==false && this.filterClasses.includes("nonAC")==true){
        return a['sleeper']==true && (a['nonAC']==true );
        }else{
        return a['sleeper']==true;
        }
        }else{
        if(this.filterClasses.includes("ac")==true && this.filterClasses.includes("nonAC")==true){
        return (a['seater']==true ||a['sleeper']==true  ) && (a['ac']==true || a['nonAC']==true);
        }else  if(this.filterClasses.includes("ac")==true && this.filterClasses.includes("nonAC")==false){
        return (a['seater']==true ||a['sleeper']==true  ) && (a['ac']==true );
        }else  if(this.filterClasses.includes("ac")==false && this.filterClasses.includes("nonAC")==true){
        return (a['seater']==true ||a['sleeper']==true  ) && (a['nonAC']==true );
        }else{
        return (a['seater']==true || a['sleeper']==true  );
        }
        }
        }else{
        return updatedbusList;
        }
        });
  
	//Available Boarding
    updatedbusList=  updatedbusList.filter(a => {
        if(a['boardingTimes'].length > 0){
        var values = [];
        for(var i=0; i<a['boardingTimes'].length; i++){
        var filreslt = this.filterboardingpoints.length ? this.filterboardingpoints.indexOf((a['boardingTimes'][i]['boardingPointName']).toLowerCase().trim()) != -1 : updatedbusList

        if(filreslt)break; 
        }

        return filreslt;
        }else{ return false; }
        });

        //Available Dropping
        updatedbusList=  updatedbusList.filter(a => {
        if(a['droppingTimes'].length > 0){
        var values = [];
        for(var i=0; i<a['droppingTimes'].length; i++){
        var filreslt = this.filterdroppingpoints.length ? a['droppingTimes'][i] && this.filterdroppingpoints.indexOf((a['droppingTimes'][i]['boardingPointName']).toLowerCase().trim()) != -1 : updatedbusList
        if(filreslt)break;
        }
        return filreslt;
        }else{ return false; }
        });

        //Available Operators
        updatedbusList=  updatedbusList.filter(a => {
        return this.filterOperators.length ? this.filterOperators.indexOf(a['travels'].toLowerCase().trim()) != -1 : updatedbusList
        });


        //Available Amenities
        if(this.filteramenities.length){
        updatedbusList=  updatedbusList.filter(a => {
        if(a['amenities'] != null){
        var amenities = a['amenities'].split(','); 
        var filreslt = this.filteramenities.length ? this.containsAny(this.filteramenities,amenities) : updatedbusList
        return filreslt;
        }
        });
        }

   	//Sorting
        if(this.sortBy=='rating'){
        updatedbusList.sort(function(a, b) { return Math.floor(b.rating*100) - Math.floor(a.rating*100);});
        }
        else if(this.sortBy=='price-low-high'){
        updatedbusList.sort(function(a, b) { return a.fareDetails[0].baseFare - b.fareDetails[0].baseFare;});
        }
        else if(this.sortBy=='price-high-low'){
        updatedbusList.sort(function(a, b) { return b.fareDetails[0].baseFare - a.fareDetails[0].baseFare;});
        }
        else if(this.sortBy=='seats-availability'){
        updatedbusList.sort(function(a, b) { return b.availableSeats - a.availableSeats;});
        }
        else if(this.sortBy=='leave-early'){
        updatedbusList.sort(function(a, b) {

        var datePipe =new DatePipe('en-US');
        var atime =  datePipe.transform(a['departureTime'], 'HH:mm');
        var btime =  datePipe.transform(b['departureTime'], 'HH:mm');

        return (moment.duration(atime).asMinutes()) -(moment.duration(btime).asMinutes()); });
        }
        else if(this.sortBy=='leave-late'){
        updatedbusList.sort(function(a, b) {var datePipe =new DatePipe('en-US');
        var atime =  datePipe.transform(a['departureTime'], 'HH:mm');
        var btime =  datePipe.transform(b['departureTime'], 'HH:mm');

        return (moment.duration(btime).asMinutes()) -(moment.duration(atime).asMinutes()); }); 
        } else {
        updatedbusList.sort(function(a, b) { return Math.floor(b.rating*100) - Math.floor(a.rating*100);});
        } 

      this.busList = updatedbusList;
     
     this.container.clear();
     this.intialData();
  }
  
   /* selected: any = "Rating"; */
 selectedOption: any = "Price (Low to High)";
 selectedOptionNew: any = "price-low-high";
      showSortbuy: boolean = false;
  option:string='';
 orderBy(option) {
        this.selectedOptionNew = option;
        if (option == 'rating') {
        this.selectedOption = 'Rating';
        } else if (option == 'price-low-high') {
        this.selectedOption = 'Price (Low to High)';
        } else if (option == 'price-high-low') {
        this.selectedOption = 'Price (High to Low)';
        } else if (option == 'leave-early') {
        this.selectedOption = 'Leave Early';
        } else if (option == 'leave-late') {
        this.selectedOption = 'Leave Late';
        } else if (option == 'seats-availability') {
        this.selectedOption = 'Seats Availability';
        } else {
        this.selectedOption = 'Price (Low to High)';
        }
        this.option = option;
        this.sortBy = option;
     this.popularFilterBusData();
 } 
  
        containsAny(source: any,target: any)
        {
        var result = source.filter(function(item){ return target.indexOf(item) > -1});   
        return (result.length > 0 && source.length == result.length);  
        } 
  
    //Timing Departure Filter 
  timingDepartureFilterBus(busList: any) {
        this.busList = busList;
        let updatedbusList: any = [];
        let isfilterBusTiming = false;
        var datePipe =new DatePipe('en-US');
        var zero_time=moment.duration('00:00').asMinutes();
        var six_time=moment.duration('06:00').asMinutes();
        var six_time1=moment.duration('06:01').asMinutes();
        var twelve_time=moment.duration('12:00').asMinutes();
        var twelve_time1=moment.duration('12:01').asMinutes();
        var eighteen_time=moment.duration('18:00').asMinutes();
        var eighteen_time1=moment.duration('18:01').asMinutes();
        var endTime=moment.duration('23:59').asMinutes();

    let isTimingFilterItems = this.bus_Timingsitems.filter((item: any) => {
      if (item.active == true) {
        return item;
      }
    })
    
    
        if (isTimingFilterItems.length > 0) {
        this.filterDeparture=[];
        for(var i =0 ; i< (isTimingFilterItems.length); i++){
        this.filterDeparture.push(isTimingFilterItems[i]['name']);
        }
        isfilterBusTiming = true;
        }else{
        this.filterDeparture=[];
        }
    
    //Bus Timing Filter
    if (isfilterBusTiming == true ) {
      if (busList.length > 0) {
         let singleBusTiming = [];
         
         singleBusTiming =  busList.filter((d: any , indx: number) => {
        if ((isTimingFilterItems.filter((items: any) => { if (items.active == true && items.name == "BEFORE-6AM") { return items; } }).length > 0) && moment.duration(datePipe.transform(d.departureTime, 'HH:mm')).asMinutes() >=zero_time &&  moment.duration(datePipe.transform(d.departureTime, 'HH:mm')).asMinutes() <=six_time) {
        return d;
        }else if ((isTimingFilterItems.filter((items: any) => { if (items.active == true && items.name == "6AM-12PM") { return items; } }).length > 0) && moment.duration(datePipe.transform(d.departureTime, 'HH:mm')).asMinutes() >=six_time1 &&  moment.duration(datePipe.transform(d.departureTime, 'HH:mm')).asMinutes() <=twelve_time) {
        return d;
        }else  if ((isTimingFilterItems.filter((items: any) => { if (items.active == true && items.name == "12PM-6PM") { return items; } }).length > 0) && moment.duration(datePipe.transform(d.departureTime, 'HH:mm')).asMinutes() >=twelve_time1 &&  moment.duration(datePipe.transform(d.departureTime, 'HH:mm')).asMinutes() <=eighteen_time) {
        return d;
        }else if ((isTimingFilterItems.filter((items: any) => { if (items.active == true && items.name == "AFTER-6PM") { return items; } }).length > 0) && moment.duration(datePipe.transform(d.departureTime, 'HH:mm')).asMinutes() >=eighteen_time1 &&  moment.duration(datePipe.transform(d.departureTime, 'HH:mm')).asMinutes() <=endTime) {
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
     //Timing Arrival Filter       busFilterlengthZero :boolean = false;
  timingArrivalFilterBus(busList: any) {
        this.busList = busList;
        let updatedbusList: any = [];
        let isfilterBusTiming = false;
        var datePipe =new DatePipe('en-US');
        var zero_time=moment.duration('00:00').asMinutes();
        var six_time=moment.duration('06:00').asMinutes();
        var six_time1=moment.duration('06:01').asMinutes();
        var twelve_time=moment.duration('12:00').asMinutes();
        var twelve_time1=moment.duration('12:01').asMinutes();
        var eighteen_time=moment.duration('18:00').asMinutes();
        var eighteen_time1=moment.duration('18:01').asMinutes();
        var endTime=moment.duration('23:59').asMinutes();

    let isTimingFilterItems = this.bus_TimingsArrivalitems.filter((item: any) => {
      if (item.active == true) {
        return item;
      }
    })


        if (isTimingFilterItems.length > 0) {
        this.filterArrival=[];
        for(var i =0 ; i< (isTimingFilterItems.length); i++){
        this.filterArrival.push(isTimingFilterItems[i]['name']);
        }
        isfilterBusTiming = true;
        }else{
        this.filterArrival=[];
        }

    //Bus Timing Filter
    if (isfilterBusTiming == true ) {

      if (busList.length > 0) {
         let singleBusTiming = [];
         singleBusTiming =  busList.filter((d: any , indx: number) => {
         
        if ((isTimingFilterItems.filter((items: any) => { if (items.active == true && items.name == "BEFORE-6AM") { return items; } }).length > 0) && moment.duration(datePipe.transform(d.arrivalTime, 'HH:mm')).asMinutes() >=zero_time &&  moment.duration(datePipe.transform(d.arrivalTime, 'HH:mm')).asMinutes() <=six_time) {
        return d;
        }else if ((isTimingFilterItems.filter((items: any) => { if (items.active == true && items.name == "6AM-12PM") { return items; } }).length > 0) && moment.duration(datePipe.transform(d.arrivalTime, 'HH:mm')).asMinutes() >=six_time1 &&  moment.duration(datePipe.transform(d.arrivalTime, 'HH:mm')).asMinutes() <=twelve_time) {
        return d;
        }else  if ((isTimingFilterItems.filter((items: any) => { if (items.active == true && items.name == "12PM-6PM") { return items; } }).length > 0) && moment.duration(datePipe.transform(d.arrivalTime, 'HH:mm')).asMinutes() >=twelve_time1 &&  moment.duration(datePipe.transform(d.arrivalTime, 'HH:mm')).asMinutes() <=eighteen_time) {
        return d;
        }else if ((isTimingFilterItems.filter((items: any) => { if (items.active == true && items.name == "AFTER-6PM") { return items; } }).length > 0) && moment.duration(datePipe.transform(d.arrivalTime, 'HH:mm')).asMinutes() >=eighteen_time1 &&  moment.duration(datePipe.transform(d.arrivalTime, 'HH:mm')).asMinutes() <=endTime) {
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
     this.resetPriceFilter();
     this.resetBusTypeFilter();
     this.resetBoardingFilter();
     this.resetDroppingFilter();
     this.resetOperFilter();
     this.resetAmenitiesFilter();
  }
  resetBoardingFilter(){
    this.filterboardingpoints=[];
    this.boardingpoints.forEach((item) => {        item.selected = false;        });
    this.popularFilterBusData();
  }
  resetDroppingFilter(){
    this.filterdroppingpoints=[];
    this.droppingpoints.forEach((item) => {        item.selected = false;        });
    this.popularFilterBusData();
  
  }
  resetAmenitiesFilter(){
     this.filteramenities=[];
    this.amenities.forEach((item) => {        item.selected = false;        });
    this.popularFilterBusData();
  }
  resetOperFilter(){
    this.filterOperators=[];
    this.operators.forEach((item) => {        item.selected = false;        });
    this.popularFilterBusData();
  }

  
  resetBusDepartureTimingsFilter() {
    this.bus_Timingsitems.filter((item: any) => { item.active = false; return item; })
    this.popularFilterBusData();
  }
  
    resetBusTypeFilter() {
        this.filterClasses = [];
        this.availableClasses.forEach((item) => {
        item.selected = false;
        });
     this.popularFilterBusData();
  }
  

  resetBusArrivalTimingsFilter() {
    this.bus_TimingsArrivalitems.filter((item: any) => { item.active = false; return item; })
    this.popularFilterBusData();
  }
  
    resetPriceFilter() {
    this.minPrice = this.resetMinPrice;
    this.maxPrice = this.resetMaxPrice;
    this.Initslider();
    this.popularFilterBusData();
  }

 searchboarding(search,input) {
  var searchkey = 'boardingPointName';
  switch (search) {
   case 'boarding':
    {
     var searchfor = this.allboardingpoints;
     var result = this.busHelper.search(input, searchfor, searchkey);
     this.boardingpoints = result;
     break;
    }
   case 'dropping':
    {
     var searchfor = this.alldroppingpoints;
     var result = this.busHelper.search(input, searchfor, searchkey);
     this.droppingpoints = result;
     break;
    }
   case 'operators':
    {
     var searchfor = this.alloperators;
     var searchkey = 'name';
     var result = this.busHelper.search(input, searchfor, searchkey);
     this.operators = result;
     break;
    }
  }
  //this.updateFilter();   
 }
 updateClassesFilter(appt) {
  if (appt.selected) {
   this.filterClasses.push(appt.searchname);
  } else {
   let index = this.filterClasses.indexOf(appt.searchname)
   this.filterClasses.splice(index, 1);
  }
  this.updateFilterBusType();
  this.popularFilterBusData();
 }
  updateFilterBusType() {
  var filteredValues = this.busfilter.transform(this.busList, this.minPrice, this.maxPrice, this.filterDeparture, this.filterArrival, this.filterboardingpoints, this.filterdroppingpoints, this.filterClasses, this.filterOperators, this.filteramenities, this.sortBy);

  this.busFilterlengthZero = false;
  if(filteredValues.length ==0 ) this.busFilterlengthZero = true; 

  this.allAvailableClasses = this.availableClasses = this.busHelper.getBusTypesFilterNew(this.allAvailableClasses, filteredValues, this.filterClasses);
  this.operators = this.busHelper.getBusOperatorsFilter(this.alloperators, filteredValues, this.filterOperators);
  this.boardingpoints = this.busHelper.getBoardingpointsFilter(this.allboardingpoints, filteredValues, 'boardingTimes', this.filterboardingpoints);
  this.droppingpoints = this.busHelper.getBoardingpointsFilter(this.alldroppingpoints, filteredValues, 'droppingTimes', this.filterdroppingpoints);
  this.amenities = this.busHelper.getamenitiesFilter(this.allamenities, filteredValues, this.filteramenities);
  
  var rtcfromlist = filteredValues.filter(e => e.rtc === true);
  var allrtc = this.busHelper.getrtc(rtcfromlist);
  for (const rtc of Object.keys(allrtc).map(itm => allrtc[itm])) {
   var totalavail = 0;
   if (rtc.length > 0) totalavail = rtc.map(item => item.availableSeats).reduce((prev, next) => prev + next);
   rtc[0].totalavail = totalavail;
   this.totalrtc.push(rtc);
   this.rtctotal[rtc[0].lowercase] = false;
  }
 
  this.filterrtc();
  this.gotoTop();
 }

  updateBoardingFilter(appt) {
  if (appt.selected) {
   this.filterboardingpoints.push(appt.boardingPointName.toLowerCase().trim());
  } else {
   let index = this.filterboardingpoints.indexOf(appt.boardingPointName.toLowerCase().trim())
   this.filterboardingpoints.splice(index, 1);
  }

  var filteredValues = this.busfilter.transform(this.busList, this.minPrice, this.maxPrice, this.filterDeparture, this.filterArrival, this.filterboardingpoints, this.filterdroppingpoints, this.filterClasses, this.filterOperators, this.filteramenities, this.sortBy);
  this.availableClasses = this.busHelper.getBusTypesFilter(filteredValues, this.filterClasses);
  this.operators = this.busHelper.getBusOperatorsFilter(this.alloperators, filteredValues, this.filterOperators);
  this.droppingpoints = this.busHelper.getBoardingpointsFilter(this.alldroppingpoints, filteredValues, 'droppingTimes', this.filterdroppingpoints);
  this.amenities = this.busHelper.getamenitiesFilter(this.allamenities, filteredValues, this.filteramenities);
  var rtcfromlist = filteredValues.filter(e => e.rtc === true);
  var allrtc = this.busHelper.getrtc(rtcfromlist);
  for (const rtc of Object.keys(allrtc).map(itm => allrtc[itm])) {
   var totalavail = 0;
   if (rtc.length > 0) totalavail = rtc.map(item => item.availableSeats).reduce((prev, next) => prev + next);
   rtc[0].totalavail = totalavail;
   this.totalrtc.push(rtc);
   this.rtctotal[rtc[0].lowercase] = false;
  }
  this.filterrtc();
    this.popularFilterBusData();
  this.gotoTop();
 }
 
  updateDroppingFilter(appt) {
  if (appt.selected) {
   this.filterdroppingpoints.push(appt.boardingPointName.toLowerCase().trim());
  } else {
   let index = this.filterdroppingpoints.indexOf(appt.boardingPointName.toLowerCase().trim())
   this.filterdroppingpoints.splice(index, 1);
  }

  var filteredValues = this.busfilter.transform(this.busList, this.minPrice, this.maxPrice, this.filterDeparture, this.filterArrival, this.filterboardingpoints, this.filterdroppingpoints, this.filterClasses, this.filterOperators, this.filteramenities, this.sortBy);
  this.availableClasses = this.busHelper.getBusTypesFilter(filteredValues, this.filterClasses);
  this.operators = this.busHelper.getBusOperatorsFilter(this.alloperators, filteredValues, this.filterOperators);
  this.boardingpoints = this.busHelper.getBoardingpointsFilter(this.allboardingpoints, filteredValues, 'boardingTimes', this.filterboardingpoints);
  this.amenities = this.busHelper.getamenitiesFilter(this.allamenities, filteredValues, this.filteramenities);
  var rtcfromlist = filteredValues.filter(e => e.rtc === true);
  var allrtc = this.busHelper.getrtc(rtcfromlist);
  for (const rtc of Object.keys(allrtc).map(itm => allrtc[itm])) {
   var totalavail = 0;
   if (rtc.length > 0) totalavail = rtc.map(item => item.availableSeats).reduce((prev, next) => prev + next);
   rtc[0].totalavail = totalavail;
   this.totalrtc.push(rtc);
   this.rtctotal[rtc[0].lowercase] = false;
  }
  this.filterrtc();
     this.popularFilterBusData();
  this.gotoTop();
 }
 updateOperatorsFilter(appt) {
  if (appt.selected) {
   this.filterOperators.push(appt.name.toLowerCase().trim());
  } else {
   let index = this.filterOperators.indexOf(appt.name.toLowerCase().trim());
   this.filterOperators.splice(index, 1);
  }

  var filteredValues = this.busfilter.transform(this.busList, this.minPrice, this.maxPrice, this.filterDeparture, this.filterArrival, this.filterboardingpoints, this.filterdroppingpoints, this.filterClasses, this.filterOperators, this.filteramenities, this.sortBy);

  
  this.availableClasses = this.busHelper.getBusTypesFilter(filteredValues, this.filterClasses);


  this.boardingpoints = this.busHelper.getBoardingpointsFilter(this.allboardingpoints, filteredValues, 'boardingTimes', this.filterboardingpoints);


  this.droppingpoints = this.busHelper.getBoardingpointsFilter(this.alldroppingpoints, filteredValues, 'droppingTimes', this.filterdroppingpoints);
  this.amenities = this.busHelper.getamenitiesFilter(this.allamenities, filteredValues, this.filteramenities);


  var rtcfromlist = filteredValues.filter(e => e.rtc === true);
  var allrtc = this.busHelper.getrtc(rtcfromlist);
  for (const rtc of Object.keys(allrtc).map(itm => allrtc[itm])) {
   var totalavail = 0;
   if (rtc.length > 0) totalavail = rtc.map(item => item.availableSeats).reduce((prev, next) => prev + next);
   rtc[0].totalavail = totalavail;
   this.totalrtc.push(rtc);
   this.rtctotal[rtc[0].lowercase] = false;
  }
  this.filterrtc();
   this.popularFilterBusData();
  this.gotoTop();
 }
 updateamenitiesFilter(appt) {
  if (appt.selected) {
   this.filteramenities.push(appt.amenities);
  } else {
   let index = this.filteramenities.indexOf(appt.amenities)
   this.filteramenities.splice(index, 1);
  }

  this.updateCommonFilter();
 }

 updateCommonFilter() { 
  var filteredValues = this.busfilter.transform(this.busList, this.minPrice, this.maxPrice, this.filterDeparture, this.filterArrival, this.filterboardingpoints, this.filterdroppingpoints, this.filterClasses, this.filterOperators, this.filteramenities, this.sortBy);

  this.busFilterlengthZero = false;
  if(filteredValues.length ==0 ) this.busFilterlengthZero = true; 

  this.allAvailableClasses = this.availableClasses = this.busHelper.getBusTypesFilter(filteredValues, this.filterClasses);
  this.operators = this.busHelper.getBusOperatorsFilter(this.alloperators, filteredValues, this.filterOperators);
  this.boardingpoints = this.busHelper.getBoardingpointsFilter(this.allboardingpoints, filteredValues, 'boardingTimes', this.filterboardingpoints);
  this.droppingpoints = this.busHelper.getBoardingpointsFilter(this.alldroppingpoints, filteredValues, 'droppingTimes', this.filterdroppingpoints);
  this.amenities = this.busHelper.getamenitiesFilter(this.allamenities, filteredValues, this.filteramenities);
  var rtcfromlist = filteredValues.filter(e => e.rtc === true);
  var allrtc = this.busHelper.getrtc(rtcfromlist);
  for (const rtc of Object.keys(allrtc).map(itm => allrtc[itm])) {
   var totalavail = 0;
   if (rtc.length > 0) totalavail = rtc.map(item => item.availableSeats).reduce((prev, next) => prev + next);
   rtc[0].totalavail = totalavail;
   this.totalrtc.push(rtc);
   this.rtctotal[rtc[0].lowercase] = false;
  }
  this.filterrtc();
     this.popularFilterBusData();
  this.gotoTop();
 }

  serverIssue:number=0;
 
  busSearch() {
    this.loader = true;
   this._busService.getBuses((this.searchData)).subscribe(data => {
   this.busResponse =  data;
   
     if (this.busResponse && this.busResponse.forwardTrips && this.busResponse.forwardTrips.length > 0) {
     this.busList = this.busResponse.forwardTrips;
      this.busListWithOutFilter = this.busList;
      
      
        var rtcfromlist = this.busList.filter(e => e.rtc === true);
        var allrtc = this.busHelper.getrtc(rtcfromlist);
        for (const rtc of Object.keys(allrtc).map(itm => allrtc[itm])) {
        var totalavail = 0;
        if (rtc.length > 0) totalavail = rtc.map(item => item.availableSeats).reduce((prev, next) => prev + next);
        rtc[0].totalavail = totalavail;
        this.totalrtc.push(rtc);
        this.rtctotal[rtc[0].lowercase] = false;
        }
      
      
      
      
        this.availableClasses = this.allAvailableClasses = this.busHelper.getBusTypes(this.busList);
        this.allboardingpoints = this.boardingpoints = this.busHelper.getBoardingpoints(this.busList, 'boardingTimes');
        this.alldroppingpoints = this.droppingpoints = this.busHelper.getBoardingpoints(this.busList, 'droppingTimes');
        this.allamenities = this.amenities = this.busHelper.getamenities(this.busList);

        this.alloperators = this.operators = this.busHelper.getBusOperators(this.busList);
        this.maxPrice = Math.max.apply(Math, this.busList.map(function(item) {
        item.fareDetails.sort(function(a, b) {
        return b.baseFare - a.baseFare
        });
        return item.fareDetails[0].baseFare;
        }));
        
        
        
        this.minPrice = Math.min.apply(Math, this.busList.map(function(item) {
        item.fareDetails.sort(function(a, b) {
        return a.baseFare - b.baseFare
        });
        return item.fareDetails[0].baseFare;
        }));
        

    this.sliderRange(this, this.minPrice, this.maxPrice);
    
        //calculation to get minimum departure date; to be displayed in RTC list 
    var tmpRtc = this.totalrtc;
    for (var i = 0; i < tmpRtc.length; i++) {
      tmpRtc[i].sort(function(a, b) {
        return (new Date(a.departureTime).getTime()) - (+new Date(b.departureTime).getTime());
      });
      this.departureTimeArr.push({
        minTime: tmpRtc[i][0]['departureTime']
      });
    }
    this.filterrtc(); 
    
    
   this.serverIssue=0;
     this.popularFilterBusData();
       this.loader = false;
        this.loading = false;
     }else{
      this.loader = false;
      this.loading = false;
     this.serverIssue=1;
     }
   },
   (err: HttpErrorResponse) => {
    this.serverIssue=1;
      this.loader = false;
       this.loading = false;
   });
    
  }
 rtccall(appt) {
  var resultrtc = [];
  this.totalrtc = [];
  var tmprtc = this.rtctotal[appt];
  var rtcfromlist = this.busList.filter(e => e.rtc === true);
  var allrtc = this.busHelper.getrtc(rtcfromlist);
  for (const rtc of Object.keys(allrtc).map(itm => allrtc[itm])) {
   var totalavail = 0;
   if (rtc.length > 0) totalavail = rtc.map(item => item.availableSeats).reduce((prev, next) => prev + next);
   rtc[0].totalavail = totalavail;
   this.totalrtc.push(rtc);
   this.rtctotal[rtc[0].lowercase] = false;
  }
  this.parentSubject.next(false);
  if (tmprtc != true)
   this.rtctotal[appt] = !this.rtctotal[appt];
  if (tmprtc == true)
   this.currentRtc = '';
  else
   this.currentRtc = appt;
 }

 filterrtc() {
  var resultrtc = [];
  this.totalrtc = [];
  var rtcfromlist = this.busList.filter(e => e.rtc === true);
  var allrtc = this.busHelper.getrtc(rtcfromlist);
  for (const rtc of Object.keys(allrtc).map(itm => allrtc[itm])) {
   var totalavail = 0;
   if (rtc.length > 0) totalavail = rtc.map(item => item.availableSeats).reduce((prev, next) => prev + next);
   rtc[0].totalavail = totalavail;
   this.totalrtc.push(rtc);
   this.rtctotal[rtc[0].lowercase] = false;
  }
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
       this.popularFilterBusData();
      }

    }

  }
  onMaxValueChange(event: any) {
    this.maxPrice = event;
    if (this.maxPrice != null) {
      if(!this.isMobile)
      {
      this.popularFilterBusData();
      }
    }
    if(!this.isMobile)
    {
    this.popularFilterBusData();
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
    this.popularFilterBusData();
  }
}
@Component({
  templateUrl: 'chrome-popup.html',
 styleUrls: ['./bus-list.component.scss'],
})
export class ChromeExtBusDialog {
  domainName:any;
  constructor(
    public dialogRef: MatDialogRef<ChromeExtBusDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,private sg: SimpleGlobal) { 
      this.domainName = this.sg['domainName']
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

}


