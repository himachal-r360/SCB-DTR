import { Component, NgModule, OnInit, Input, Output, EventEmitter,Inject, ViewChild, ElementRef, HostListener,AfterViewInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BusHelper } from 'src/app/shared/utils/bus-helper';
import { BusService } from 'src/app/shared/services/bus.service';
import { BusResponse } from 'src/app/entites/bus-response'
import { ActivatedRoute, Router,NavigationExtras } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse , HttpParams } from '@angular/common/http';
import { SimpleGlobal } from 'ng2-simple-global';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent} from '@angular/material/tabs';
import { Subject } from 'rxjs';
import {EncrDecrService} from 'src/app/shared/services/encr-decr.service';
import {APP_CONFIG, AppConfig} from '../../configs/app.config';
import {environment} from '../../../environments/environment';
import { AppConfigService } from '../../app-config.service';
import * as moment from 'moment'; 
import { CommonHelper } from 'src/app/shared/utils/common-helper';
import { event } from 'jquery';
import { RestapiService} from 'src/app/shared/services/restapi.service';

export interface DialogData {
 messageData: string;
 redirectUrl: number;
}
@Component({
 selector: 'list-component',
 templateUrl: './list-card.component.html',
 styleUrls: ['./list-card.component.scss']
})

export class ListComponent implements OnInit,AfterViewInit {
 @Input()
 parentSubject: Subject < any > ;
 cdnUrl: any;
 appConfig: any;
 public show: boolean = true;
 blockResponse: BusResponse;
 totBaseFare: any;
 totServtax: any;
 loading: boolean = true;
 showAmenities = false;
 showDropping = false;
 showSeatLayout = false;
 showCancellation = false;
 seatstatus: boolean = false;
 BoardingPoint: boolean = false;
 rtcseatlayout: boolean = false;
 bookButtonDisable: boolean = true;
 selectedboarding: string = '';
 selecteddropping: string = '';
 centered = false;
 showSeats = false;
 showFilter = false;
 showDetails = false;
 showError = false;
 seatinfo = false;
 seatinfo1=false;
 busId: string = '';
 @Input('bus') bus; 
  @Input('tag') tag; 
 showrow: boolean = false;
 @Input('rowvalue') rowvalue: number;
 @Input('departure') departure;
  totalFareBus: boolean = false;
  mlite_passengerError: boolean = false;
  mlite_seatError: boolean = false;
 @Input() set isrtc(p: boolean) {
  this.busId=this.bus.id;
  if (this.bus.rtc == false) {
   this.showrow = true;
  } else if (this.bus.rtc == true) {
   this.showrow = p;
  }
 };
 @Output() seatSelected = new EventEmitter();
 @Input() params: any = [];
 selectedValue: string;
 selectedCar: string;
 seatselected = false;
 showFare = false;
 showBoardDrop = false;
 empty = true;
 domainPath: string;
 totalUpperDeck: Boolean = false;
 rtcseatcall = false;
 totalLowerDeck: number = 0;
 totalfare: number = 0;
 searchBusKey: any = [];
 busamenities: any = [];
 busboardingpoints: any = [];
 busdroppingpoints: any = [];
 pricesplit: any = [];
 states: string[] = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
 ];
 seatResponse: BusResponse;
 searchParam: any = [];
 Lowerdecks: any = [];
 Upperdecks: any = [];
 seatlayout: number = -1;
 selectdetails: any = [];
 boardingtimes: any = [];
 droppingtimes: any = [];
 selecteddeck: string;
 amenitiesStatus: Boolean;
 showErrorBoarding: Boolean = false;
 showErrorDropping: Boolean = false;
 public show_dialog: boolean = false;
 public button2_name: any = 'CONTINUE';
 public buttonstatus: boolean = false;
 maxSeatMessage: any;
 searchArray:any;
 showEmiBanner:any;
 showEMIVal:any;
 searchDate:any;
 boardingtimings:any;
 nextDayFlag:boolean = false;
 show_earnpoints:boolean = false;
 show_earnpoints_text: any = '';
 serviceSettings:any;
 domainName:any;
 tracksearchObj:any;
 seating_header:boolean = true;
 seatTypeMliteData:boolean = false;


 constructor(public rest:RestapiService,private activatedRoute: ActivatedRoute, public busHelper: BusHelper, public busService: BusService, private router: Router, private sg: SimpleGlobal, private dialog: MatDialog, @Inject(DOCUMENT) private document: any, private EncrDecr: EncrDecrService, @Inject(APP_CONFIG) appConfig: any,private appConfigService:AppConfigService, private commonHelper: CommonHelper) {
 this.serviceSettings=this.appConfigService.getConfig();
 this.domainName = this.sg['domainName'];
  this.appConfig = appConfig;
this.cdnUrl = environment.cdnUrl+this.sg['assetPath'];
  this.showEmiBanner = this.serviceSettings.PAYSETTINGS[this.sg['domainName']]['RedBus'].EMI;
  this.show_earnpoints = this.serviceSettings.show_earnpoints;
  
  // override the route reuse strategy
  this.router.routeReuseStrategy.shouldReuseRoute = function() {
   return false;
  };
 }
 strokeWidth: 2;
 ngOnInit() {
 
 
  if(moment(this.bus.doj).format("YYYY-MM-DD") != moment(this.bus.departureTime).format("YYYY-MM-DD")){
    this.nextDayFlag = true;
  }
  this.showEMIVal=this.rowvalue % 10;
  if (this.bus.rtc == false) {
   this.showrow = true;
  } else if (this.bus.rtc == true && this.isrtc == true) {
   this.showrow = true;
  }
  this.CancellationPolicies();
  this.selecteddeck = 'lower';
  this.selected = 0;
  $(".seat-layout").hide();
  $(".amenities-list").hide();

  this.parentSubject.subscribe(event => {
   //console.log(event);
   this.showAmenities = false;
   this.showCancellation = false;
   this.showDropping = false;
   this.showSeatLayout = false;
  });
  
         if(this.show_earnpoints){
        let service_value=this.serviceSettings.savingCalculator;
        let cardType=this.sg['card_variant'];
        var c_value=service_value[cardType]['Bus'];
        this.show_earnpoints_text=this.commonHelper.get_service_earn_points(String(cardType),(this.bus.fareDetails[0].baseFare),c_value);
        }
  
 }
 ngAfterViewInit(){
 if(this.tag == this.busId){
 	$('#bus-'+this.tag).css({"border-color": "#f57a7e", 
	"border-width":"1px", 
	"border-style":"solid"});
	
	
	const itemToScrollTo = document.getElementById("bus-"+this.tag );
	// null check to ensure that the element actually exists
	if (itemToScrollTo) {
	window.scrollTo({ top: itemToScrollTo.offsetTop, behavior: 'smooth'});
	}
  }	
 }
 

 ngOnDestroy() {}
 selected: any = 0;
 dropPointActive:boolean=false; 
 boardPointActive: boolean = true;
 changeTab(selectAfterAdding: boolean) {
  
  if (selectAfterAdding) {
   this.selected = 1;
   this.dropPointActive = true;
   this.boardPointActive = false;
  } else {
   this.selected = 0;
  }
 }
 pressBoardPoint(){
  this.dropPointActive = false;
  this.boardPointActive = true;
 }
 tabSelectionChanged(event) {
  this.selected = event;
 }

 moveTop() {
  let scrollToTop = window.setInterval(() => {
   let pos = window.pageYOffset;
   if (pos > 0) {
    window.scrollTo(0, pos - 20); // how far to scroll on each step
   } else {
    window.clearInterval(scrollToTop);
   }
  }, 16);

 }

 onAmenities(allamenities: any, bus_id, mobile) {
  // $(".seat-layout").hide();
  // $(".amenities-list").hide();
  this.busamenities = [];
  //this.showAmenities = !this.showAmenities; 
  if (mobile) {
   this.showAmenities = false;
  } else {
   this.showAmenities = !this.showAmenities;
   this.rtcseatcall = false;
  }
  this.showDropping = false;
  this.showCancellation = false;
  this.showSeats = false;
  this.showSeatLayout = false;
  //this.rtcseatcall = false;
  if (allamenities != null) {
   var amenities = allamenities.split(',');
   for (let bt of amenities) {
    if (bt != '') {
     this.busamenities.push(bt);
    }
   }
  }
 }

 onDropping(board, dropp) {
  this.boardingtimes = [];
  this.droppingtimes = [];
  this.showAmenities = false;
  this.showDropping = !this.showDropping;
  this.showCancellation = false;
  this.showSeats = false;
  this.showSeatLayout = false;
  //this.rtcseatcall = false;
  //console.log(board);
  for (let b of board) {
	let calculateB=this.converttime(b.time,this.bus.doj);
	b.ctime = calculateB['ctime'];
	b.nextday = calculateB['nextday'];
   this.boardingtimes.push(b);
   
  }

  for (let b of dropp) {
	let calculateB=this.converttime(b.time,this.bus.doj);
	b.ctime = calculateB['ctime'];
	b.nextday = calculateB['nextday'];
   this.droppingtimes.push(b);
  }

 }
 converttime(time,doj) {
  var timings = [];
  var hr = Math.floor(time / 60);
  if (hr > 23) var hrs = '0' + (hr - 24);
  else hrs = hr + '';
  var min = String(time - Math.floor(time / 60) * 60);
  if (min.length == 1) {
   var vmin = ':0' + min;
    var vmin1 = '0' + min;
  } else {
   var vmin = ':' + min;
    var vmin1 = '0' + min;
  }
  var hrm = hrs + vmin;
  
  var newTime = moment(doj).add('h', hr).add('m', vmin1);
	if(moment(doj).format("YYYY-MM-DD") != newTime.format("YYYY-MM-DD")){
	timings['ctime']=hrm;
  var date = newTime.format("DD/MM/YYYY");
  timings['nextday'] = moment(date, 'DD-MM-YYYY')
	}else{
	timings['ctime']=hrm;
	timings['nextday']='';
  }
  //return hrm;
  return timings;
 }

 retvalues: any = [];
 onCancellation(mobile) {
  $(".seat-layout").hide();
  this.retvalues = [];
  this.showAmenities = false;
  this.showDropping = false;
  this.showCancellation = !this.showCancellation;
  this.showSeats = false;
  this.showSeatLayout = false;
  this.CancellationPolicies();
  if (mobile) {
   this.rtcseatcall = true;
  } else {
   this.rtcseatcall = false;
  }
 }
 CancellationPolicies() {
  //this.rtcseatcall = false;
  var value = this.bus.cancellationPolicies;
  var fares = this.bus.fareDetails;
  var values = value.slice().reverse();

  for (let val of values) {
   var percent = '';
   for (let fare of fares) {
    var dedamt = val.amount;
    if (val.amountType == 'Percentage') {
     // dedamt =  Math.round((fare.totalFare * val.amount)/100); 
     dedamt = Math.round((fare.baseFare * val.amount) / 100);
    }
    percent = percent + dedamt + '/';
   }
   val.cancharges = percent.slice(0, -1);
   this.retvalues.push(val);
  }
 }
 HideSeats(tripId, rowvalue, bus, mobile = false) {
  this.showSeatLayout = false;
  this.maxSeatMessage = "";
  this.rtcseatcall = false;
 }
 showSeatsFilter(id,tab_id){
   var tab_content = "#seat-"+id+'-'+tab_id;
    $('.tab-pane-seat-'+id).removeClass("active show");
   $(tab_content).addClass("active show");
 }

 onSeats(tripId, rowvalue, bus, mobile = false) {
  $('#collapseExample_'+tripId).hide();
 // $('.seat-layout').removeClass('active');
 // this.showSeatLayout=false;
  this.loading = true;
  this.showAmenities = false;
  this.showCancellation = false;
  this.showDropping = false;
  this.maxSeatMessage = "";
  this.selected = 0;
  this.totalfare = 0;
  this.seatdetails = [];
  this.selectedseats = [];
 
  //this.showSeats = !this.showSeats;
  this.onDropping(bus.boardingTimes, bus.droppingTimes);
  if (mobile == false) {
   this.showSeatLayout = true;
   this.showDropping = false;
   this.showCancellation = false;
   this.showAmenities = false;
  }
  var searchParam1 = this.searchParam;
  this.searchParam = {
   tripId: tripId,
  };
  if (bus.rtc == false || this.rtcseatcall == true) {
   if (this.rtcseatcall == true) {
    this.searchParam.bpId = searchParam1.bpId;
    this.searchParam.dpId = searchParam1.bpId;
    this.searchParam.busApiProvider = 'RedBus';
   }
   this.busService.getBusSeats(JSON.stringify(this.searchParam)).subscribe(data => {
     let dData = JSON.parse(this.EncrDecr.get(data.result));
     this.seatResponse = < BusResponse > dData;
     if (this.seatResponse.tripDetails != undefined) {
      var Decks = this.busHelper.getBusDecks(this.seatResponse.tripDetails.seats, mobile);
      this.Lowerdecks = Decks.LowerDesk;
      this.Upperdecks = Decks.UpperDesk;
      this.totalLowerDeck = this.Lowerdecks.length;
      if (this.Upperdecks.length > 0) {
       this.totalUpperDeck = true;
      } else {
       this.totalUpperDeck = false;
      }
      this.pricesplit = Decks.pricesplit;
      if (mobile == true) {
       this.showBoardDrop = false;
       this.Lowerdecks = this.busHelper.reversearray(this.Lowerdecks);
       this.Upperdecks = this.busHelper.reversearray(this.Upperdecks);
      }
      
      let trackUrlParams = new HttpParams()
      .set('current_url', window.location.href)
      .set('category', 'RedBus')
      .set('event', 'Show Seats')
      .set('metadata',JSON.stringify(this.seatResponse));
      
       const track_body: string = trackUrlParams.toString();
       this.rest.trackEvents( track_body).subscribe(result => {});

     } else {
      var message = 'Something went wrong';
      if (this.blockResponse != undefined) var message = this.blockResponse.errorMessage;
      const dialogRef = this.dialog.open(ConfirmationDialog, {
       width: '600px',
       disableClose: true,
       id: 'messageforMliteDialog',
       data: {
        messageData: message,
        redirectUrl: 1
       }
      });
     }
     this.loading = false;
    },
    (err: HttpErrorResponse) => {
     this.loading = false;
     this.seatlayout = -1;
     var message = 'Something went wrong';
     if (this.blockResponse != undefined) var message = this.blockResponse.errorMessage;
     const dialogRef = this.dialog.open(ConfirmationDialog, {
      width: '600px',
      disableClose: true,
      id: 'messageforMliteDialog',
      data: {
       messageData: message,
       redirectUrl: 1
      }
     });
    });
   this.show_dialog = !this.show_dialog;
  } else {
   this.loading = false;
   this.showBoardDrop = true;
  }
  this.seatlayout = rowvalue;
 }

 onDetails(tripId, rowvalue, bus) {
  $('.mlist-header').removeClass('fixed-top');
  let body = document.getElementsByTagName('body')[0];
  body.classList.add("noscroll"); //add the class  
  var mobile = true;
  this.onSeats(tripId, rowvalue, bus, mobile);
  this.selecteddeck = 'lower';
  this.onAmenities(bus.amenities, bus.id, mobile);
  if (bus.rtc == false || this.rtcseatcall == true) {
   this.showDetails = true;
   this.seatSelected.emit(this.showDetails);
   this.showAmenities = false;
   this.showDropping = false;
  }
 }
 onCloseDetail(){
           let body = document.getElementsByTagName('body')[0];
        body.classList.remove("noscroll"); //remove the class
        
        
   $('.mlist-header').addClass('fixed-top');
  this.showDetails = false;
    this.showAmenities = false;
   this.showDropping = false;
 }
 active() {
  this.empty = !this.empty;
  this.seatselected = !this.seatselected;
  this.showAmenities = false;
 }
 openBottomSheet() {
  this.showFare = !this.showFare;
 }
 
 goback() {
  this.showDetails = false;
  this.seatSelected.emit(this.showDetails);
  let body = document.getElementsByTagName('body')[0];
  body.classList.remove("noscroll"); //remove the class
  this.searchArray = {
    searchFrom: this.activatedRoute.snapshot.queryParamMap.get('searchFrom'),
    searchTo: this.activatedRoute.snapshot.queryParamMap.get('searchTo'),
    fromTravelCode: this.activatedRoute.snapshot.queryParamMap.get('fromTravelCode'),
    toTravelCode: this.activatedRoute.snapshot.queryParamMap.get('toTravelCode'),
    departure: this.activatedRoute.snapshot.queryParamMap.get('departure'),
   };
   this.router.navigate(['/bus/search/'], {
    queryParams: this.searchArray
   });
 }

 openAmentiesmlite()
 {
   var filterDiv = document.getElementById('Mobileamenities');
   if(filterDiv)
   {
     filterDiv.style.display = 'block';
   }

 }
 rotate: boolean = false;
 showBusDetails(amenities,id,mobile){
 this.showAmenities = true;
 $('#collapseExample_'+id).toggle();
 this.rotate = !this.rotate;
  this.onAmenities(amenities, id, mobile);
 }
 
 closeAmenitiesmlite()
 {
   var filterDiv = document.getElementById('Mobileamenities');
   if(filterDiv)
   {
     filterDiv.style.display = 'none';
   }

 }

 openBoardingDroping(tripid: string, busdetails, rowvalue) {
  var searchparam = this.searchParam;
  if (searchparam.seatdetails != undefined) {
   if (busdetails.rtc === true && this.rtcseatcall === true) {
    var mobile = true;
    this.onSubmitSeats(tripid, busdetails, rowvalue, mobile);
   }
   if (!this.seatdetails.length) {
   /*  var messageSelectSeat = 'Please select seat(s)'; */
    this.mlite_seatError = true;
    /* const dialogRef = this.dialog.open(ConfirmationDialog, {
     id: 'messageforMliteDialog',
     data: {
      messageData: messageSelectSeat,
      redirectUrl: 0
     }
    });*/
    return true; 
   }
   this.showBoardDrop = !this.showBoardDrop;
   this.showDetails = false;
   this.seatSelected.emit(this.showDetails);
  } else {
   //this.showError = true;
   var messageSelectSeat = 'Please select seat(s)';
   this.mlite_seatError = true;
   /* var messageSelectSeat = 'Please select seat(s)';
   const dialogRef = this.dialog.open(ConfirmationDialog, {
    id: 'messageforMliteDialog',
    data: {
     messageData: messageSelectSeat,
     redirectUrl: 0
    }
   });
   return true; */
  }
 
 }
 selectedseats: any = [];
 tripIdcheck: number = 0;
 seatdetails = [];
 maxSeatMessageStatus: boolean = false;
 selectseat(seat: any, tripId: any, maxseats: number, mobile) {
  this.maxSeatMessage = "";
  this.seatstatus = !this.seatstatus;
  this.totalFareBus = true;
  if (this.tripIdcheck == 0 || this.tripIdcheck != tripId) {
   this.selectedseats = [];
   this.tripIdcheck = tripId;
  }

  let index = this.selectedseats.indexOf(seat); //Check Whether array exists(Seat Selected) already
  if (index != -1) {
   this.selectedseats.splice(index, 1);
   this.maxSeatMessage = "";
   this.maxSeatMessageStatus = false;
  } else {
   if (this.selectedseats.length == maxseats) {
    this.maxSeatMessage = 'You have finished the booking limit. you can add only ' + maxseats + ' travellers';
    this.maxSeatMessageStatus = true;
    if (mobile == true) {
      this.mlite_passengerError = true ;
     /* let body = document.getElementsByTagName('body')[0];
     body.classList.remove("noscroll"); //remove the class
     var messageMaxSeat = 'You can book up to ' + maxseats + ' passengers on a single ticket2';
     const dialogRef = this.dialog.open(ConfirmationDialog, {
      id: 'messageforMliteDialog',
      panelClass: 'messageforMlitePanel',
       backdropClass: 'messageforMliteBackdrop',
      data: {
       messageData: messageMaxSeat,
       redirectUrl: 0
      }
     }); */
    }
    return true;
   } else {
    this.maxSeatMessageStatus = false;
    this.mlite_seatError = false;

   }
   this.maxSeatMessage = "";
  
   this.selectedseats.push(seat); //REmove If Seat Selected Else Push inside array
  }
  var seatdetailss = this.busHelper.seatdetails(this.selectedseats);
  var seatdetails1 = [];
  var test = [];
  var totalnew = 0;
  var totalfare = 0;
  var totBaseFare = 0;
  var totServtax = 0;
  for (let seaat of seatdetailss) {
   if (seaat != undefined) {
    seatdetails1.push({
     'baseFare': seaat.baseFare,
     'totalbaseFare': seaat.totalbaseFare,
     'totalServTax': seaat.totalServTax,
     'fare': seaat.fare,
     'selseats': seaat.selseats.split(","),
     'seatfaretotal': seaat.seatfaretotal,
     'totalseats': seaat.totalseats,
     'newData': seaat.test_array
    });this.searchParam
    totalfare = totalfare + seaat.seatfaretotal;
    totBaseFare = totBaseFare + seaat.totalbaseFare;
    totServtax = totServtax + seaat.totalServTax;this.searchParam
   }
  }
  this.totalfare = totalfare;
  this.totBaseFare = totBaseFare;
  this.totServtax = totServtax;
  this.searchParam.seatdetails = this.seatdetails;
  this.seatdetails = seatdetails1;
  console.log(this.seatdetails);
    
  
 if(this.show_earnpoints){
let service_value=this.serviceSettings.savingCalculator;
 let cardType=this.sg['card_variant']
var c_value=service_value[cardType]['Bus'];
this.show_earnpoints_text=this.commonHelper.get_service_earn_points(String(cardType),(this.totalfare),c_value);
}
  
  
  
  if (this.seatdetails.length > 0) {
   this.BoardingPoint = true;
  } else {
   this.BoardingPoint = false;
  }
  this.mlite_passengerError = false;
  /*let trackUrlParams = new HttpParams()
	.set('current_url', window.location.href)
	.set('category', 'RedBus')
	.set('event', 'Block Seat')
	.set('metadata','{"seat_name":"'+JSON.stringify(this.selectedseats)+'","total_seats":"'+this.selectedseats.length+'","total_fare":"'+totalfare+'"}');
  
	 const track_body: string = trackUrlParams.toString();
	 this.rest.trackEvents( track_body).subscribe(result => {});*/

  this.showError = false;
 }

 Boardingdroping(type, id, tripid: string) {
  var oldsearchparam = this.searchParam;

  if (oldsearchparam.tripId == tripid) {
   if ((type == 'boarding' && oldsearchparam.bpId != id) || (type == 'dropping' && oldsearchparam.dpId != id)) {
    this.rtcseatcall = false;
   }
  }
  if (type == 'boarding') {
   this.selectedboarding = id;
   this.searchParam.bpId = id;
   
  }
  if (type == 'dropping') {
   this.selecteddropping = id;
   this.searchParam.dpId = id;
   this.bookButtonDisable = false;

  
  }
  
  this.showError = false;
 }
 onSeatInfo() {
  this.seatinfo = true;
 }
 onSeatInfo2(){
  this.seatinfo1 = true;
 }
 hideOverlay1(){
  this.seatinfo1 = false;
 }
 hideOverlay(){
  this.seatinfo = false;
 }
 public onValChange(val: string) {
  this.selecteddeck = val;
 }

 seatTypeShow(){
  this.seatTypeMliteData = true;
 }
 seatTypeClose(){
  this.seatTypeMliteData = false;
 }

 onSubmitSeats(tripid: string, busdetails, rowvalue, mobile) {
 var xss = require("xss");
  var searchparam = this.searchParam;
  if (busdetails.rtc == false || this.rtcseatcall == true) {
   if (searchparam.tripId == tripid && searchparam.bpId != undefined && searchparam.dpId != undefined && this.seatdetails.length) {
    var busdetails = busdetails
    var postData = {
     boarding: xss(this.selectedboarding),
     dropping: xss(this.selecteddropping),
     seats: this.seatdetails,
     seatdetails: this.selectedseats,
     tripid: xss(this.tripIdcheck),
     fromTravelCode: xss(this.params.queryParamMap.get('fromTravelCode')),
     toTravelCode: xss(this.params.queryParamMap.get('toTravelCode')),
     searchFrom: xss(this.params.queryParamMap.get('searchFrom')),
     searchTo: xss(this.params.queryParamMap.get('searchTo')),  
     fromState: xss(this.params.queryParamMap.get('fromState')),
     toState: xss(this.params.queryParamMap.get('toState')),
     departure: xss(this.params.queryParamMap.get('departure')),
     busdetails: busdetails,
     seatResponse:this.seatResponse
    };
    this.searchBusKey = btoa(this.tripIdcheck + this.selectedboarding + this.selecteddropping);
    sessionStorage.setItem(this.searchBusKey, JSON.stringify(postData));
    this.button2_name = "Processing...";
    this.buttonstatus = true;
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove("noscroll"); //remove the class
    
	let navigationExtras: NavigationExtras = {
	queryParams: { 'searchBusKey': this.searchBusKey }
	};
	this.router.navigate([this.sg['domainPath']+`bus/checkout`], navigationExtras);
    

   } else {
    this.showError = true;
    this.showErrorBoarding = true;
    this.showErrorDropping = true;
    return true;
   }
  } else {
   if (searchparam.tripId == tripid && searchparam.bpId != undefined && searchparam.dpId != undefined) {
    this.rtcseatcall = true;
    this.onSeats(searchparam.tripId, rowvalue, busdetails, mobile);
    if (mobile == true) {
     this.onDetails(searchparam.tripId, rowvalue, busdetails);
    }
   } else {
    this.showError = true;
    this.showErrorBoarding = true;
    this.showErrorDropping = true;
    return true;
   }
  }

  let trackUrlParams = new HttpParams()
	.set('current_url', window.location.href)
	.set('category', 'RedBus')
	.set('event', 'Selected Bus Details')
	.set('metadata',JSON.stringify(busdetails));
  
	 const track_body: string = trackUrlParams.toString();
	 this.rest.trackEvents( track_body).subscribe(result => {});

 }
}
@Component({
 selector: 'confirmation-dialog',
 templateUrl: 'dialog.html',
})
export class ConfirmationDialog {
 rUrl: any;
 searchArray: any;
 constructor(
  public dialogRef: MatDialogRef < ConfirmationDialog > ,
  @Inject(MAT_DIALOG_DATA) public data: DialogData, private router: Router, private activatedRoute: ActivatedRoute,private sg: SimpleGlobal) {
  this.rUrl = data.redirectUrl
 }

 onYesClick(): void {
  this.dialogRef.close(true);
  if (this.rUrl == 1) {
   let body = document.getElementsByTagName('body')[0];
   body.classList.remove("noscroll"); //remove the class

   this.searchArray = {
    searchFrom: this.activatedRoute.snapshot.queryParamMap.get('searchFrom'),
    searchTo: this.activatedRoute.snapshot.queryParamMap.get('searchTo'),
    fromTravelCode: this.activatedRoute.snapshot.queryParamMap.get('fromTravelCode'),
    toTravelCode: this.activatedRoute.snapshot.queryParamMap.get('toTravelCode'),
    departure: this.activatedRoute.snapshot.queryParamMap.get('departure'),
   };
   this.router.navigate([this.sg['domainPath']+'/bus/search/'], {
    queryParams: this.searchArray
   });
  }
 }
}
