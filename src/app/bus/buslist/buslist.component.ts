import { Component, OnInit,Inject, ChangeDetectorRef, Output,EventEmitter,HostListener,OnDestroy,ViewChild ,ViewContainerRef,TemplateRef } from '@angular/core';
import { BusService } from 'src/app/shared/services/bus.service';
import { ActivatedRoute, Router } from '@angular/router'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams} from '@angular/common/http';
import { Subscription,Subject } from 'rxjs';
import { SimpleGlobal } from 'ng2-simple-global';
import {APP_CONFIG, AppConfig} from '../../configs/app.config';
import { BusHelper } from 'src/app/shared/utils/bus-helper';
import { BusResponse } from 'src/app/entites/bus-response';
import { DatePipe } from '@angular/common';
import { CommonHelper } from 'src/app/shared/utils/common-helper';
import { Location,PlatformLocation } from '@angular/common';
import {MatBottomSheet, MatBottomSheetRef,MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import { BusfilterPipe } from 'src/app/shared/pipes/busfilter.pipe';
import { ListComponent } from 'src/app/bus/list-card/list-card.component';
import {environment} from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import {DomSanitizer} from '@angular/platform-browser';
import { Title } from '@angular/platform-browser';
import { AppConfigService } from '../../app-config.service';
import { RestapiService} from 'src/app/shared/services/restapi.service';
import { FlightService } from 'src/app/common/flight.service';
import { StyleManagerService } from 'src/app/shared/services/style-manager.service';
import { EncrDecrService } from 'src/app/shared/services/encr-decr.service';
@Component({
 selector: 'app-buslist',
 templateUrl: './buslist.component.html',
 styleUrls: ['./buslist.component.scss'],
 providers: [BusfilterPipe],
})

export class BuslistComponent implements OnInit,OnDestroy {

        isMobile:boolean= true;
        dummyForLoader = Array(10).fill(0).map((x,i)=>i);

        appConfig: any;cdnUrl: any;busUrl: any;
        seatSeletedView = false;
        Sortby: string = "Sort By";
        properties = [BusHelper];
        busResponse: BusResponse;
        busSubscription: Subscription;
        searchParam: any = [];
        searchParamPreviousDay: any = [];
        searchParamNextDay: any = [];
        currentRtc: string;
        submitted = false;
        fromBusCode: string;
        sbResponse: any = [];
        toBusCode: string;
        busfrom: string;
        busto: string;
        responses: any = [];
        departure: string;
        arrival: string;
        selectedboarding: string = '';
        selecteddropping: string = '';
        busResults: any = [];
        busResultsOrg: any = [];
        domainPath: string;
        assetPath: string;
        domainRedirect: string;
        selected_count: boolean = false;
        loading: boolean = true;
        showSortbuy: boolean = false;
        sortBy: string = 'rating';
        BoardingPoint: boolean = false;
        selectedRowId: number = -1;
        availableClasses: any = [];
        allAvailableClasses: any = [];
        boardingpoints: any = [];
        droppingpoints: any = [];
        allboardingpoints: any = [];
        allamenities: any = [];
        alldroppingpoints: any = [];
        amenities: any = [];
        searchBusKey: any = [];
        minValue: number = 0;
        maxValue: number = 10000;
        actualminValue: number = 0;
        actualmaxValue: number = 10000;
        minSeletedPriceValue: number = 0;
        maxSeletedPriceValue: number = 10000;
        departureTimeFilter: any[] = [{
        'filterCode': 'BEFORE-6AM',
        'filterValue': 'Before 6AM',
        'selected': false
        },
        {
        'filterCode': '6AM-12PM',
        'filterValue': '6AM - 12PM',
        'selected': false
        },
        {
        'filterCode': '12PM-6PM',
        'filterValue': '12AM - 6PM',
        'selected': false
        },
        {
        'filterCode': 'AFTER-6PM',
        'filterValue': 'After 6PM',
        'selected': false
        }
        ];

        arrivalTimeFilter: any[] = [{
        'filterCode': 'BEFORE-6AM',
        'filterValue': 'Before 6AM',
        'selected': false
        },
        {
        'filterCode': '6AM-12PM',
        'filterValue': '6AM - 12PM',
        'selected': false
        },
        {
        'filterCode': '12AM-6PM',
        'filterValue': '12AM - 6PM',
        'selected': false
        },
        {
        'filterCode': 'AFTER-6PM',
        'filterValue': 'After 6PM',
        'selected': false
        }
        ];
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
        params: any = [];
        operators: any = [];
        alloperators: any = [];
        filterOperators: any = [];
        searchDisplayForm: string = 'redbus';
        totalrtcseats: number = 0;
        totalrtc: any = [];
        rtctotal = [];
        departureTimeArr: any = [];
        searchArray:any = [];
        expiredDate: any = new Date();
        serviceSettings:any;
        domainName:any;
        tag:any;
        tracksearchObj:any;
        listing_header:boolean = true;
        seating_header:boolean = false;
        busFilterlengthZero :boolean = false;
        option:string='';
        @ViewChild('itemsContainer', { read: ViewContainerRef }) container: ViewContainerRef;
        @ViewChild('item', { read: TemplateRef }) template: TemplateRef<any>;

        pageIndex: number = 26;
        ITEMS_RENDERED_AT_ONCE=25;
        nextIndex=0;

 constructor(public rest:RestapiService,private busService: BusService, public dialog: MatDialog, private router: Router, private location: Location,  private activatedRoute: ActivatedRoute, private http: HttpClient, private changeDetector: ChangeDetectorRef, public commonHelper: CommonHelper, public busHelper: BusHelper, private sg: SimpleGlobal, private formBuilder: FormBuilder, private _bottomSheet: MatBottomSheet, private busfilter: BusfilterPipe, plocation: PlatformLocation, @Inject(APP_CONFIG) appConfig: any,private cookieService: CookieService,private titleService: Title,private appConfigService:AppConfigService,private _flightService: FlightService,public _styleManager: StyleManagerService, private EncrDecr: EncrDecrService) {
  this.serviceSettings=this.appConfigService.getConfig();
  

    if(this.serviceSettings.DOMAIN_SETTINGS[this.sg['domainName']]['BUS']!=1){
     this.router.navigate(['/**']);
   }
  
          let body = document.getElementsByTagName('body')[0];
        body.classList.remove("noscroll"); //remove the class
  
        this.domainName = this.sg['domainName'];
        this.appConfig = appConfig;
        this.cdnUrl = environment.cdnUrl+this.sg['assetPath']; 
        this.busUrl = environment.BUS_SITE_URL[this.sg['domainName']];
        // plocation.onPopState(() => {
        // if (this.seatSeletedView) {
        // this.seatSeletedView = true;
        // let body = document.getElementsByTagName('body')[0];
        // body.classList.remove("noscroll"); //remove the class
        // history.go(1);
        // }
        // });

  
        if( this.tag){
        const dialogRef = this.dialog.open(ChromeExtBusDialog, {
        autoFocus: false,
        panelClass: 'alert_covid',
        width:'800px',
        disableClose: true
        });
        this.sortBy='price-low-high';
        }
  
        this.params = this.activatedRoute.snapshot;
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.assetPath = this.sg['domainPath'];
        this._styleManager.setScript('custom', `assets/js/custom.js`);

        }
        ngOnDestroy(): void {
        this._styleManager.removeScript('custom');
        }

        datePreviousStatus: boolean;
        @HostListener('window:resize', ['$event']) resizeEvent(event: Event) {
        this.isMobile = window.innerWidth < 991 ?  true : false;
        }


ngOnInit(): void {
  this.titleService.setTitle('Home | RedBus');
        this.isMobile = window.innerWidth < 991 ?  true : false;
      //  this.activatedRoute.url.subscribe(url =>{
        this.moveTop();
        this.loading = true;
        this.getQueryParamData(null);
        this.headerHideShow(null)
        this.getBuses();
        this.domainRedirect = environment.MAIN_SITE_URL +this.sg['domainPath']+ this.sg['domainPath'];
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
       // });

  }
  
  
  
          private loadData() {
             if (this.pageIndex >= this.busResultsOrg.length) {
             return false;
              }else{
             this.nextIndex = this.pageIndex + this.ITEMS_RENDERED_AT_ONCE;

             if(this.nextIndex > this.busResultsOrg.length){
             this.nextIndex=this.busResultsOrg.length;
             }

            for (let n = this.pageIndex; n < this.nextIndex ; n++) {
             const context = {
                item: [this.busResultsOrg[n]]
              };

              this.container.createEmbeddedView(this.template, context);
            }
             this.pageIndex += this.ITEMS_RENDERED_AT_ONCE;

           }

        }


         private intialData() {
            for (let n = 0; n <this.ITEMS_RENDERED_AT_ONCE ; n++) {
            
              if(this.busResultsOrg[n] != undefined)
              {
                const context = {
                  item: [this.busResultsOrg[n]]
                };

                this.container.createEmbeddedView(this.template, context);
              }

            }
        }
  
  
  fromState:any;
  toState:any;
  getQueryParamData(paramObj: any) {
        const params = this.activatedRoute.snapshot.queryParams;
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
  headerHideShow(event:any) {
    this.isMobile = window.innerWidth < 991 ?  true : false;
    if(this.isMobile){
     this._flightService.showHeader(false);
    }else{
    this._flightService.showHeader(true);
    }
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
 onFilter() {
  //this.showFilter = !this.showFilter;
  let body = document.getElementsByTagName('body')[0];
  body.classList.add("noscroll"); //add the class
 }

 onTraveller() {
//  this.onHide = false;
 }
 getBuses() {
  this.busSubscription = this.busService.getBuses((this.searchParam)).subscribe(data => {
    this.busResponse = < BusResponse > data;
    this.responses = {
     onwardtrips: this.busResponse['forwardTrips'],
     code: 200,
    };
    this.sbResponse = {
     response: this.responses
    };
    if (!this.busResponse['forwardTrips']) {
     this.selected_count = false;
     this.loading = false;
     return true;
    }
    if (this.sbResponse.response && this.sbResponse.response.code == 200 && this.sbResponse.response.onwardtrips.length !== 0) {
     this.busResults = this.sbResponse.response.onwardtrips;
     this.busResultsOrg=this.busResults;
     //console.log(this.busResults)
     this.availableClasses = this.allAvailableClasses = this.busHelper.getBusTypes(this.busResults);
     this.allboardingpoints = this.boardingpoints = this.busHelper.getBoardingpoints(this.busResults, 'boardingTimes');
     this.alldroppingpoints = this.droppingpoints = this.busHelper.getBoardingpoints(this.busResults, 'droppingTimes');
     this.allamenities = this.amenities = this.busHelper.getamenities(this.busResults);
     var rtcfromlist = this.busResults.filter(e => e.rtc === true);
     var allrtc = this.busHelper.getrtc(rtcfromlist);
     for (const rtc of Object.keys(allrtc).map(itm => allrtc[itm])) {
      var totalavail = 0;
      if (rtc.length > 0) totalavail = rtc.map(item => item.availableSeats).reduce((prev, next) => prev + next);
      rtc[0].totalavail = totalavail;
      this.totalrtc.push(rtc);
      this.rtctotal[rtc[0].lowercase] = false;
     }
     this.alloperators = this.operators = this.busHelper.getBusOperators(this.busResults);
     this.maxValue = Math.max.apply(Math, this.busResults.map(function(item) {
      item.fareDetails.sort(function(a, b) {
       return b.baseFare - a.baseFare
      });
      return item.fareDetails[0].baseFare;
     }));
     this.minValue = Math.min.apply(Math, this.busResults.map(function(item) {
      item.fareDetails.sort(function(a, b) {
       return a.baseFare - b.baseFare
      });
      return item.fareDetails[0].baseFare;
     }));
     //this.options = {floor: this.minValue,ceil: this.maxValue, showSelectionBar: true,translate: (value: number): string => {return ''; } };
     this.minSeletedPriceValue = this.minValue;
     this.maxSeletedPriceValue = this.maxValue;
     this.actualminValue = this.minValue;
     this.actualmaxValue = this.maxValue;
     this.selected_count = true;
     this.loading = false;
    } else {
     this.selected_count = false;
     this.loading = false;
    }
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
    this.moveTop(); 
   },
   (err: HttpErrorResponse) => {
    this.selected_count = false;
    this.loading = false;
   });

 }
 showSeats = false;
 showDetails = false
 showAmenities = false;
 showDropping = false;
 showCancellation = false;
 /* selected: any = "Rating"; */
 selectedOption: any = "Rating";
 selectedOptionNew: any = "rating";
 orderBy(option) {
  this.selectedOptionNew = option;
  if (option == 'rating') {
   this.selectedOption = 'Rating';
   console.log(option);
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
   this.selectedOption = 'Rating';
  }
this.option = option;
	/* console.log(this.option); */
  this.sortBy = option;
  this.showSortbuy = false;
  this.Sortby = "Sorted By";
  this.busResults = this.busResults.filter(g => {
   return true;
  });
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
  }


 filterrtc() {
  var resultrtc = [];
  this.totalrtc = [];
  var rtcfromlist = this.busResults.filter(e => e.rtc === true);
  var allrtc = this.busHelper.getrtc(rtcfromlist);
  for (const rtc of Object.keys(allrtc).map(itm => allrtc[itm])) {
   var totalavail = 0;
   if (rtc.length > 0) totalavail = rtc.map(item => item.availableSeats).reduce((prev, next) => prev + next);
   rtc[0].totalavail = totalavail;
   this.totalrtc.push(rtc);
   this.rtctotal[rtc[0].lowercase] = false;
  }
 }

 updateDeparture(appt) {
  if (appt.selected) {
   this.filterDeparture.push(appt.filterCode);
  } else {
   let index = this.filterDeparture.indexOf(appt.filterCode)
   this.filterDeparture.splice(index, 1);
  }
  this.busResults = this.busResults.filter(g => {
   return true;
  });
  this.updateCommonFilter();
 }

 updateArrival(appt) {
  if (appt.selected) {
   this.filterArrival.push(appt.filterCode);
  } else {
   let index = this.filterArrival.indexOf(appt.filterCode)
   this.filterArrival.splice(index, 1);
  }
  this.busResults = this.busResults.filter(g => {
   return true;
  });
  this.updateCommonFilter();
 }

 updateClassesFilter(appt) {
  if (appt.selected) {
   this.filterClasses.push(appt.searchname);
  } else {
   let index = this.filterClasses.indexOf(appt.searchname)
   this.filterClasses.splice(index, 1);
  }
  this.busResults = this.busResults.filter(g => {
   return true;
  });
  this.updateFilterBusType();
 }

 updateBoardingFilter(appt) {
  if (appt.selected) {
   this.filterboardingpoints.push(appt.boardingPointName.toLowerCase().trim());
  } else {
   let index = this.filterboardingpoints.indexOf(appt.boardingPointName.toLowerCase().trim())
   this.filterboardingpoints.splice(index, 1);
  }
  this.busResults = this.busResults.filter(g => {
   return true;
  });
  var filteredValues = this.busfilter.transform(this.busResults, this.minSeletedPriceValue, this.maxSeletedPriceValue, this.filterDeparture, this.filterArrival, this.filterboardingpoints, this.filterdroppingpoints, this.filterClasses, this.filterOperators, this.filteramenities, this.sortBy);
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
  this.moveTop();
 }

 updateDroppingFilter(appt) {
  if (appt.selected) {
   this.filterdroppingpoints.push(appt.boardingPointName.toLowerCase().trim());
  } else {
   let index = this.filterdroppingpoints.indexOf(appt.boardingPointName.toLowerCase().trim())
   this.filterdroppingpoints.splice(index, 1);
  }
  this.busResults = this.busResults.filter(g => {
   return true;
  });
  var filteredValues = this.busfilter.transform(this.busResults, this.minSeletedPriceValue, this.maxSeletedPriceValue, this.filterDeparture, this.filterArrival, this.filterboardingpoints, this.filterdroppingpoints, this.filterClasses, this.filterOperators, this.filteramenities, this.sortBy);
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
  this.moveTop();
 }

 updateOperatorsFilter(appt) {
  if (appt.selected) {
   this.filterOperators.push(appt.name.toLowerCase().trim());
  } else {
   let index = this.filterOperators.indexOf(appt.name.toLowerCase().trim());
   this.filterOperators.splice(index, 1);
  }
  this.busResults = this.busResults.filter(g => {
   return true;
  });
  var filteredValues = this.busfilter.transform(this.busResults, this.minSeletedPriceValue, this.maxSeletedPriceValue, this.filterDeparture, this.filterArrival, this.filterboardingpoints, this.filterdroppingpoints, this.filterClasses, this.filterOperators, this.filteramenities, this.sortBy);

  
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
  this.moveTop();
 }

 updateamenitiesFilter(appt) {
  if (appt.selected) {
   this.filteramenities.push(appt.amenities);
  } else {
   let index = this.filteramenities.indexOf(appt.amenities)
   this.filteramenities.splice(index, 1);
  }
  this.busResults = this.busResults.filter(g => {
   return true;
  });
  this.updateCommonFilter();
 }

 updateCommonFilter() { 
  var filteredValues = this.busfilter.transform(this.busResults, this.minSeletedPriceValue, this.maxSeletedPriceValue, this.filterDeparture, this.filterArrival, this.filterboardingpoints, this.filterdroppingpoints, this.filterClasses, this.filterOperators, this.filteramenities, this.sortBy);

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
  this.moveTop();
 }

 updateFilterBusType() {
  var filteredValues = this.busfilter.transform(this.busResults, this.minSeletedPriceValue, this.maxSeletedPriceValue, this.filterDeparture, this.filterArrival, this.filterboardingpoints, this.filterdroppingpoints, this.filterClasses, this.filterOperators, this.filteramenities, this.sortBy);

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
  this.moveTop();
 }

 clearDepartureSelection(){
  this.filterDeparture = [];
  this.departureTimeFilter.forEach((item) => {
   item.selected = false;
  });
 }

 clearArrivalTimeSelection(){
  this.filterArrival = [];
  this.arrivalTimeFilter.forEach((item) => {
   item.selected = false;
  });
 }

 clearClassesSelection(){
  this.filterClasses = [];
  this.availableClasses.forEach((item) => {
   item.selected = false;
  });
  
}

clearAmenitiesSelection(){
  this.filteramenities = [];
  this.amenities.forEach((item) => {
   item.selected = false;
  });

  this.moveTop();
  
}

 clearSelectionAll() {
  this.filterDeparture = [];
  this.departureTimeFilter.forEach((item) => {
   item.selected = false;
  });
  this.filterArrival = [];
  this.arrivalTimeFilter.forEach((item) => {
   item.selected = false;
  });
  this.filterClasses = [];
  this.availableClasses.forEach((item) => {
   item.selected = false;
  });
  this.filterOperators = [];
  this.operators.forEach((item) => {
   item.selected = false;
  });
  this.filterboardingpoints = [];
  this.boardingpoints.forEach((item) => {
   item.selected = false;
  });
  this.filterdroppingpoints = [];
  this.droppingpoints.forEach((item) => {
   item.selected = false;
  });
  this.filteramenities = [];
  this.amenities.forEach((item) => {
   item.selected = false;
  });
  this.updateCommonFilter();
  this.moveTop();
 }

 moveTop() {
       window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
});
 }
 seatSelected(appt) {
  this.seatSeletedView = appt;
 }

 parentSubject: Subject < Boolean > = new Subject();
 rtccall(appt) {
  var resultrtc = [];
  this.totalrtc = [];
  var tmprtc = this.rtctotal[appt];
  var rtcfromlist = this.busResults.filter(e => e.rtc === true);
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

 searchboarding(search) {
  var searchkey = 'boardingPointName';
  switch (search.type) {
   case 'boarding':
    {
     var searchfor = this.allboardingpoints;
     var result = this.busHelper.search(search.input, searchfor, searchkey);
     this.boardingpoints = result;
     break;
    }
   case 'dropping':
    {
     var searchfor = this.alldroppingpoints;
     var result = this.busHelper.search(search.input, searchfor, searchkey);
     this.droppingpoints = result;
     break;
    }
   case 'operators':
    {
     var searchfor = this.alloperators;
     var searchkey = 'name';
     var result = this.busHelper.search(search.input, searchfor, searchkey);
     this.operators = result;
     break;
    }
  }
  //this.updateFilter();   
 }

 openSortby(): void {
  let body = document.getElementsByTagName('body')[0];
  body.classList.add("noscroll"); //add the class
  const bottomSheetRef = this._bottomSheet.open(BottomSortbySheet, {
   data: {
    selectedOption: this.selectedOptionNew
   }
  });
  bottomSheetRef.afterDismissed().subscribe(result => {
   this.orderBy(result);
  });
 }

 goback() {
  this.router.navigate([this.sg['domainPath']+'/bus']);
 }
}


@Component({
 selector: 'sortby-sheet',
 templateUrl: './sortby-sheet.html',
})
export class BottomSortbySheet {
 showLi: Boolean = false;
 optionSelected: string;
 domainName:any;
 constructor(private sg: SimpleGlobal,private _bottomSheetRef: MatBottomSheetRef < BottomSortbySheet > , @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
  this.optionSelected = data.selectedOption;
  this.domainName = this.sg['domainName'];
 }

 onNoClick(event: MouseEvent): void {
  let body = document.getElementsByTagName('body')[0];
  body.classList.remove("noscroll"); //remove the class
  this._bottomSheetRef.dismiss();
  event.preventDefault();
 }
 orderBy(appt) {
  let body = document.getElementsByTagName('body')[0];
  body.classList.remove("noscroll"); //remove the class
  this._bottomSheetRef.dismiss(appt);
  event.preventDefault();
 }

 selectLi(option) {
  this.showLi = !this.showLi;
  this.optionSelected = option;
 }
}


@Component({
  templateUrl: 'chrome-popup.html',
 styleUrls: ['./buslist.component.scss'],
})
export class ChromeExtBusDialog {
  domainName:any;
  constructor(
    public dialogRef: MatDialogRef<ChromeExtBusDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,private sg: SimpleGlobal,) { 
      this.domainName = this.sg['domainName']
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
