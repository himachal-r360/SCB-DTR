import { Component, OnInit, Input, Output, EventEmitter,Inject,AfterViewInit } from '@angular/core';
import {AppConfig} from '../../configs/app.config';
import { ActivatedRoute, Router,NavigationExtras } from '@angular/router'; 
import { IrctcApiService} from 'src/app/shared/services/irctc.service';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { SimpleGlobal } from 'ng2-simple-global';
import { CommonHelper } from 'src/app/shared/utils/common-helper';
import {EncrDecrService} from 'src/app/shared/services/encr-decr.service';
import { MatDialog,MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TitleCasePipe } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";
import { AppConfigService } from '../../app-config.service';
import { RestapiService} from 'src/app/shared/services/restapi.service';
 import { DeviceDetectorService } from 'ngx-device-detector';
declare var $: any 

export interface DialogData {
  messageData: string;
}
export interface DialogData1 {
	searchfrom: string;
	frmStn: string;
	searchto: string;
	toStn: string;
	trainFrom: string;
	fromStnCode: string;
	trainTo: string;
	toStnCode: string;
}


@Component({
  selector: 'trains-card',
  templateUrl: './trains-card.component.html',
  styleUrls: ['./trains-card.component.scss']
})


export class TrainscardComponent implements OnInit,AfterViewInit {
selectedIndex:number=0;selectedIndexR:number=0;
        template: string = '<div class="app-loading-new"><div class="logo"></div></div>'
        yesbuttonstatus:boolean=false;
        dynamicfaretrain:any;
        searchfrom:any;
        searchto:any;
        trainFrom:any;
        trainTo:any;
        scheduleParam:any;
        scheduleData:any;
        searchParam:any = [];
        searchFareParam:any = [];
        travalfrom: string;
        travalto: string;
        frmStn: string;
        toStn: string;
        journeyDate: string;
        noOfPassenger: number;
        loaderValue = 10;
        @Input('stationsdump') stationsdump;
        @Input('quota') quota;
        trainId: string = '';
        @Input('tag') tag; 
        @Input('repeatBooking') repeatBooking; 
        @Input('repeatBookingData')   repeatBookingData;
        fareData:any = [];
        avlDayList:any=[];
        trainTotalFare:number;
        searchHistory:any = [];
        searchTrainKey:any = [];
        fareDataIssue: boolean=false;
        showAmenities = false;
        showDropping = false;
        showCancellation = false;
        centered = false;
        showSeats = false;
        showFilter = false;
        showDetails = false;
        runflag:boolean = false;
        @Input('train') train;
        @Input('rowvalue') rowvalue: number;
        @Input('fastestTrain') fastestTrain;
        @Input('passParam')  passParam;
        @Input('tagTrain')  tagTrain = false;
        showEMIVal:any;
        showEmiBanner:any;
        cdnUrl: any;
        avlClasses:any = [];
        //@Output() valueChange = new EventEmitter();
        selectedValue: string;
        selectedCar: string;
        seatselected = false;
        showFare=false;
        empty = true;
        showAvailable=false; showAvailableR=false;
        domainName:any;
        listingPageCovidPopup:any;
        states: string[] = [
        'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
        'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
        'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
        'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
        'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
        'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
        'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
        ];
        serviceSettings:any;
        show_earnpoints:boolean = false;
        show_earnpoints_text: any = '';
        AppConfig:any; 
        isMobile;
        showRepeatBooking:number=0;
  constructor(public rest:RestapiService,private spinnerService: NgxSpinnerService,private dialog: MatDialog,private router: Router, private activatedRoute: ActivatedRoute,public irctcService: IrctcApiService,private sg: SimpleGlobal,public commonHelper: CommonHelper,private EncrDecr: EncrDecrService,private appConfigService:AppConfigService,private deviceService: DeviceDetectorService) {
   this.serviceSettings=this.appConfigService.getConfig();
   
   this.listingPageCovidPopup = this.serviceSettings.listingPageCovidPopup;
   this.domainName = this.sg['domainName'];
   this.AppConfig=AppConfig;
 	this.showEmiBanner = this.serviceSettings.PAYSETTINGS[this.sg['domainName']]['IRCTC'].EMI;
 	  this.cdnUrl = environment.cdnUrl+this.sg['assetPath'];
	this.travalfrom = this.activatedRoute.snapshot.queryParamMap.get('searchFrom');
	this.travalto = this.activatedRoute.snapshot.queryParamMap.get('searchTo');
	this.frmStn = this.activatedRoute.snapshot.queryParamMap.get('fromTravelCode');
	this.toStn = this.activatedRoute.snapshot.queryParamMap.get('toTravelCode');
	this.journeyDate = this.activatedRoute.snapshot.queryParamMap.get('departure');
	//this.noOfPassenger= this.activatedRoute.snapshot.queryParamMap.get('noOfPassenger');
	this.show_earnpoints = this.serviceSettings.show_earnpoints;
	this.isMobile = this.deviceService.isMobile();
}

 ngAfterViewInit(){
 if(this.tag == this.trainId){
 	$('#train-'+this.tag).css({"border-color": "#f57a7e", 
	"border-width":"1px", 
	"border-style":"solid"});
	
	const itemToScrollTo = document.getElementById("train-"+this.tag );
	// null check to ensure that the element actually exists
	if (itemToScrollTo) {
	window.scrollTo({ top: itemToScrollTo.offsetTop, behavior: 'smooth'});
	}
  }	
 }

  ngOnInit() {

   this.trainId =this.train.trainNumber;
   if(this.repeatBooking==1){
   this.showRepeatBooking=1;
   this.onAvailableR(this.train,this.repeatBookingData['journeyClass'])
   }
   this.showEMIVal=this.rowvalue % 10;
	if( Array.isArray(this.train.avlClasses) ){
	this.avlClasses=this.train.avlClasses;
	}else{
	this.avlClasses[0]=this.train.avlClasses;
	}
    this.searchHistory= {
        travalfrom:this.travalfrom,
        travalto:this.travalto,
        frmStn:this.frmStn,
        journeyDate:this.journeyDate,
        toStn:this.toStn,
        //noOfPassenger:this.noOfPassenger
    };
  }
closeRepeatBooking(){
this.showRepeatBooking=0;
}
  onAvailable(train,avlClass){
    $(".check-available").hide();
    this.showAvailable = true;
    $("#check-available"+train.trainNumber).show();
    this.checkFare(train,avlClass,0);
    this.selectedIndex=0;
  }
  
  onAvailableR(train,avlClass){
    $(".rcheck-available").hide();
    this.showAvailableR = true;
    $("#rcheck-available"+train.trainNumber).show();
    this.checkFare(train,avlClass,1);
    var index = train['avlClasses'].indexOf(avlClass); 
    this.selectedIndexR=index;
    
  }

  getSchedule(val){
    this.scheduleParam = {
      "journeyDate": this.journeyDate.replace(/-/g, ""),
      "startingStationCode": this.frmStn,
      "trainNo": val
  };
    this.irctcService.trainSchedlueDto(this.scheduleParam).subscribe(resp => {
     
        this.scheduleData = (resp.partnerResponse);
       
    });

  }
  sleeprblock(){
    const errmsg = [];
    errmsg.push('Booking is not allowed during this time: 11:00 AM to 11:15 AM'); 
  const message = errmsg;
   let dialogRef = this.dialog.open(ConfirmationDialogclose, {
     width: '560px',
     data: {messageData: message}
 });
  }
limitSeats:string='';
checkFare(train,avlClass,type){ 
   this.spinnerService.show();
  var time = new Date();
    var hour = time.getHours().toString();
    var min = time.getMinutes().toString();
        if(min.length==1)
        min='0'+min;
        if(hour.length==1)
        hour='0'+hour;
  var cuurnttime = hour+min;
var actualtime = parseInt(cuurnttime);
if(actualtime>=parseInt(AppConfig.blocktimings.morningSleeperBlockStart) && actualtime <= parseInt(AppConfig.blocktimings.morningSleeperBlockEnd)){
this.sleeprblock();
this.showAvailable = false;
}else{

  this.avlDayList=[];
  this.fareDataIssue=false;
	this.searchFareParam = {
	"frmStn": train.fromStnCode,
	"journeyClass": avlClass,
  "journeyDate":  this.journeyDate,
	"journeyQuota": this.quota,
	"paymentEnqFlag": "N",
	"toStn": train.toStnCode,
	"trainNo": train.trainNumber
  };
  
	var datePipe =new DatePipe('en-US');
        this.searchFareParam['journeyDate'] = datePipe.transform(this.searchFareParam['journeyDate'], 'yyyyMMdd');
	const urlParams = new HttpParams()
	.set('frmStn', this.searchFareParam['frmStn'])
	.set('journeyClass', this.searchFareParam['journeyClass'])
	.set('journeyDate', this.searchFareParam['journeyDate'])
	.set('journeyQuota',this.searchFareParam['journeyQuota'])
	.set('paymentEnqFlag',"N")
	.set('trainNo',this.searchFareParam['trainNo'])
	.set('toStn', this.searchFareParam['toStn']);
  let body: string = urlParams.toString();
  
 
         this.irctcService.getTrainFare( body).subscribe(response => {
          this.spinnerService.hide();
         let data=JSON.parse(this.EncrDecr.get(response.result ));
         if(data.errorcode==0){
         this.fareData=(data.partnerResponse);
        if(typeof this.fareData.avlDayList !== "undefined") {
        
       	if( Array.isArray(this.fareData.avlDayList) ){
	this.avlDayList=this.fareData.avlDayList.sort(function(a, b) { return a.availablityDate - b.availablityDate });
	}else{
	this.avlDayList[0]=this.fareData.avlDayList;
	}
	
	if(type==1){
	if(this.avlDayList[0].availablityType!=0 && this.avlDayList[0].availablityType!=4 && this.avlDayList[0].availablityType!=5 && this.avlDayList[0].availablityType!=8224 && this.avlDayList[0].availablityType!=3){
	let status=this.avlDayList[0].availablityStatus;
	status=status.replace("AVAILABLE-", "");
	this.limitSeats='Hurry! Only '+Math.round(status)+' '+avlClass+' seats left';
	}
	
	}
        
         this.trainTotalFare=this.fareData.totalFare;
         
        if(this.show_earnpoints){
        let service_value=this.serviceSettings.savingCalculator;
         let cardType=this.sg['card_variant'];
        var c_value=service_value[cardType]['Rail booking'];
        this.show_earnpoints_text=this.commonHelper.get_service_earn_points(String(cardType),(this.trainTotalFare),c_value);
        }
         
         }else{
 	 this.avlDayList=[];
         this.fareDataIssue=true;
         }
         }else{
	 this.fareData=data;
         this.avlDayList=[];
         this.fareDataIssue=true;
         }

         let trackUrlParams = new HttpParams()
         .set('current_url', window.location.href)
         .set('category', 'IRCTC')
         .set('event', 'Check availability')
         .set('metadata',this.EncrDecr.set(JSON.stringify(JSON.stringify(data.partnerResponse))));
         
         const track_body: string = trackUrlParams.toString();
         this.rest.trackEvents( track_body).subscribe(result => {});

	},
      (err: HttpErrorResponse) => {
        this.fareDataIssue=true;
        const errorMessage = [];
       });

      
 }

}

 
 openDialog(){
   const errmsg = [];
   errmsg.push('Booking is not allowed during this time: 11:45 PM to 00:15 AM'); 
 const message = errmsg;
  let dialogRef = this.dialog.open(ConfirmationDialogclose, {
    width: '560px',
    data: {messageData: message}
});
 }
 openDialogtatkal(){
  const errmsg = [];
  errmsg.push('Booking not allowed during tatkal timings i.e 10:15 AM to 11:15 AM');
const message = errmsg;
 let dialogRef = this.dialog.open(ConfirmationDialogclose, {
   width: '560px',
   data: {messageData: message}
});
}
openDialogmorning(){
  const errmsg = [];
  errmsg.push('Booking is not allowed during this time: 8:00 AM to 8:15 AM.');
const message = errmsg;
 let dialogRef = this.dialog.open(ConfirmationDialogclose, {
   width: '560px',
   data: {messageData: message}
});
}
 openDialog2(train,avlDay,avlClass){

 let dialogRef = this.dialog.open(ConfirmationDialog, {
  disableClose: true,
  width: '615px',
  panelClass: 'different-route',
	data: {
	searchfrom: this.searchfrom,
	frmStn:this.searchHistory.frmStn,
	searchto:this.searchto,
	toStn:this.searchHistory.toStn,
	trainFrom:this.trainFrom,
	fromStnCode:train.fromStnCode,
	trainTo:this.trainTo,
	toStnCode:train.toStnCode
          }
});
dialogRef.afterClosed().subscribe(result => {
 if(result){
 	  let navigationExtras: NavigationExtras = {
	  queryParams: { 'searchTrainKey': this.searchTrainKey }
	};
   this.router.navigate([this.sg['domainPath']+`train/checkout`], navigationExtras)
  //this.router.navigate([this.sg['domainPath']+`train/checkout/`,{searchTrainKey:this.searchTrainKey}]);
  }
  this.bookNow(train,avlDay,avlClass)
});
}

openCovidHealthpopup(train,avlDay,avlClass){
  this.searchfrom = this.stationsdump[this.searchHistory.frmStn];
  this.searchto = this.stationsdump[this.searchHistory.toStn];
  this.trainFrom = this.stationsdump[train.fromStnCode]; 
  this.trainTo = this.stationsdump[train.toStnCode];
  this.dynamicfaretrain = train.trainType;
  this.searchTrainKey = btoa(train.fromStnCode+train.toStnCode+avlDay.availablityDate+this.quota+avlClass+train.trainNumber+train.departureTime
    +train.arrivalTime+train.trainName);

  
  if(this.listingPageCovidPopup == 1){
  let dialogRef = this.dialog.open(covidDialog, {
    
    disableClose: true,
    width: '800px',
    autoFocus: false,
    hasBackdrop: true
    
  });

 
  dialogRef.afterClosed().subscribe(result => {
    
    if(result){
      if(this.searchfrom != this.trainFrom || this.searchto != this.trainTo){
        this.openDialog2(train,avlDay,avlClass);
      }else{
        this.bookNow(train,avlDay,avlClass);
      }
    }else{
      this.router.navigate([this.sg['domainPath']+`/train`]);
    }
   });
  }else{
    if(this.searchfrom != this.trainFrom || this.searchto != this.trainTo){
      this.openDialog2(train,avlDay,avlClass);
    }else{
      this.bookNow(train,avlDay,avlClass);
    }
  }
}


openDialog3(){
  const errmsg = [];
  errmsg.push('AC class booking is not allowed during this time: 10:00 AM to 10:15 AM');
const message = errmsg;
 let dialogRef = this.dialog.open(ConfirmationDialogclose, {
   width: '560px',
   data: {messageData: message}
});
}
openDialog4(){
  const errmsg = [];
  errmsg.push('Sleeper booking not allowed at tatkal timings i.e 11:00 AM to 11:15 AM');
const message = errmsg;
 let dialogRef = this.dialog.open(ConfirmationDialogclose, {
   width: '560px',
   data: {messageData: message}
});
}

// tatkalDialog(){
//   const errmsg = [];
//   errmsg.push('Booking not allowed at tatkal timings i.e 10:15 AM to 11:15 AM');
// const message = errmsg;
//  let dialogRef = this.dialog.open(ConfirmationDialogclose, {
//    width: '560px',
//    data: {messageData: message}
// });
// }

bookNow(train,avlDay,avlClass){
  
	var postData = {
	searchHistory:this.searchHistory,
	selectedTrain:train,
	selectedAvailablityFare:avlDay ,
	journeyClass:avlClass,
	journeyQuota:this.quota,
	fareData:this.fareData,
  };
  this.searchfrom = this.stationsdump[this.searchHistory.frmStn];
  this.searchto = this.stationsdump[this.searchHistory.toStn];
  this.trainFrom = this.stationsdump[train.fromStnCode]; 
  this.trainTo = this.stationsdump[train.toStnCode];
  this.dynamicfaretrain = train.trainType;
     var time = new Date();
    var hour = time.getHours().toString();
    var min = time.getMinutes().toString();

        if(min.length==1)
        min='0'+min;
        if(hour.length==1)
        hour='0'+hour;

  var cuurnttime = hour+min
  var actualtime = parseInt(cuurnttime)



	this.searchTrainKey = btoa(train.fromStnCode+train.toStnCode+avlDay.availablityDate+this.quota+avlClass+train.trainNumber+train.departureTime
  +train.arrivalTime+train.trainName);
  sessionStorage.setItem( this.searchTrainKey,JSON.stringify(postData));
  sessionStorage.setItem("searchTrainKey",this.searchTrainKey);


  if(actualtime >= parseInt(AppConfig.blocktimings.generaltktblockingstart) && actualtime <= parseInt(AppConfig.blocktimings.generaltktblockingend)){
    this.openDialogmorning(); 
  }
  else if(actualtime >= parseInt(AppConfig.blocktimings.agentBookingblockstart) && actualtime <= parseInt(AppConfig.blocktimings.agentBookingblockend)){
    this.openDialog();
  }
  
  else if((this.quota =='TQ' && actualtime >= parseInt(AppConfig.blocktimings.morningACblockingStart) && actualtime <= parseInt(AppConfig.blocktimings.morningACblockingEnd)) && (avlClass == "1A" || avlClass == "2A" || avlClass == "3A" || avlClass == "EC" || avlClass == "CC")){
    this.openDialog3();
  }
  else if(((this.quota =='TQ' && actualtime >= parseInt(AppConfig.blocktimings.morningSleeperBlockStart) && actualtime <= parseInt(AppConfig.blocktimings.morningSleeperBlockEnd)) && (avlClass == "SL"))){
    this.openDialog4();
  }
  else if(this.searchfrom != this.trainFrom || this.searchto != this.trainTo){
      // this.openDialog2(train);
  }
  else{
  
	  let navigationExtras: NavigationExtras = {
	  queryParams: { 'searchTrainKey': this.searchTrainKey }
	};
  this.router.navigate([this.sg['domainPath']+`train/checkout`], navigationExtras)
  }
  let trackUrlParams = new HttpParams()
.set('current_url', window.location.href)
.set('category', 'IRCTC')
.set('event', 'Train Booking')
.set('metadata',this.EncrDecr.set(JSON.stringify(JSON.stringify(postData))));

const track_body: string = trackUrlParams.toString();
this.rest.trackEvents( track_body).subscribe(result => {});
}

}

@Component({
  selector: 'confirmation-dialog',
  templateUrl: './dialog.html',
  styleUrls: ['./trains-card.component.scss'],
})
export class ConfirmationDialog {
 cdnUrl: any;
 domainName:any;
    constructor(public dialogRef: MatDialogRef<ConfirmationDialog>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData1,private sg: SimpleGlobal) {
       this.cdnUrl = environment.cdnUrl+this.sg['assetPath'];
       this.domainName = this.sg['domainName'];
       
      }

    onYesClick(): void {
      this.dialogRef.close(true);
    }
    onNoClick(): void{
      this.dialogRef.close(false);
    }
}

@Component({
  selector: 'confirmation-dialog2',
  templateUrl: './dialog2.html',
  styleUrls: ['./trains-card.component.scss'],
})
export class ConfirmationDialogclose {
    constructor(public dialogRef: MatDialogRef<ConfirmationDialog>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    onYesClick(): void {
      this.dialogRef.close(true);
    }
}

@Component({
  templateUrl: './covid-alert-popup.html',
  styleUrls: ['./trains-card.component.scss'],
})
export class covidDialog {
    constructor(public dialogRef: MatDialogRef<covidDialog>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    onYesClick(): void {
      this.dialogRef.close(true);
    }
    onNoClick(): void{
      this.dialogRef.close(false);
    }

}
