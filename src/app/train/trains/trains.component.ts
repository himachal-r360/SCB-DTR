import { Component, OnInit,Inject, ChangeDetectorRef, Output,EventEmitter,HostListener,OnDestroy,ViewChild } from '@angular/core';
import { IrctcApiService} from 'src/app/shared/services/irctc.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { trainResponse } from 'src/app/entites/train-response';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { CommonHelper } from 'src/app/shared/utils/common-helper';
import { ActivatedRoute, Router } from '@angular/router'; 
import {environment} from '../../../environments/environment';
import { SimpleGlobal } from 'ng2-simple-global';
import { Location } from '@angular/common';
import {MatBottomSheet, MatBottomSheetRef,MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import { MatTabChangeEvent } from '@angular/material/tabs';
import {APP_CONFIG, AppConfig} from '../../configs/app.config';
import { Title } from '@angular/platform-browser';
import { AppConfigService } from '../../app-config.service';
import { RestapiService} from 'src/app/shared/services/restapi.service';
import { DOCUMENT } from '@angular/common';
import { EncrDecrService } from 'src/app/shared/services/encr-decr.service';
import * as moment from 'moment';
import { FlightService } from 'src/app/common/flight.service';
export interface DialogData {
  animal: string;
  name: string;
}
@Component({
  selector: 'app-trains',
  templateUrl: './trains.component.html',
  styleUrls: ['./trains.component.scss']
})
export class TrainsComponent implements OnInit {

  isMobile:boolean= true;
        dummyForLoader = Array(10).fill(0).map((x,i)=>i);
          domainName:any;
          searchdate:any;
          avltrains:any;
         trainUrl: any;
         ondayavltrains:any;
        cdnUrl: any;
        selectedQuota:any = 'General';
        Sortby: string = "Sort By";
        sortFilterhide: boolean = false;
        domainRedirect: string;
        departureDate: any;
        departureStr: any;
        datePreviousStatus: boolean;
        searchParamPreviousDay: any = [];
        searchParamNextDay: any = [];
        domainPath: string;
        appConfig: any;
        assetPath: string;
        searchParam:any = [];
        trainResponse: trainResponse;
        travalfrom: string;
        travalto: string;
        frmStn: string;
        toStn: string;
        quota:string = 'GN';
        journeyDate: string;
        noOfPassenger: number;
        selected_count:number = 0;
        quotaList:any = [];
        avlQuota:any = [];
        availableClasses:any = [];
        trainTypes:any=[];
        fromStations:any=[];
        toStations:any=[];
        stationsdump:any=[];
        irctcQuota: any=[];
        allfromStations:any=[];
        alltoStations:any=[];
        showFilter=false;
        private trains = [];
        private sortTrains = [];
        showTraveller=false;
        onHide=true;
        animal: string;
        name: string;
        showSortbuy:boolean = false;
        loading:boolean=true; 
           isLogged:Boolean;
                show_earnpoints:boolean = false;
        cardType: any = '';
        c_value: any = '';
        customerInfo:any[];
        saveCard: any;
        custCardsAvailable:Boolean;
        customercards:any;primaryCust:any;
        selectedCardDetails:any;
        selectedCardValue:any;
        customeravailablepoints:any;
        errorMsg0:any=""
        XSRFTOKEN: string;
            response1:any=[];
  tracksearchObj:any;
	states: string[] = [
	'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
	'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
	'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
	'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
	'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
	'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
	'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
	];
	searchDisplayForm: string = 'irctc';
  sortBy:string='leave-early';

	departureTimeFilter: any[]= [{'filterCode':'BEFORE-6AM' ,'filterValue':'Before 6AM','selected':false},
	{'filterCode':'6AM-12PM' ,'filterValue':'6AM - 12PM','selected':false},
	{'filterCode':'12PM-6PM' ,'filterValue':'12AM - 6PM','selected':false},
	{'filterCode':'AFTER-6PM' ,'filterValue':'After 6PM','selected':false}];

arrivalTimeFilter: any[]= [{'filterCode':'BEFORE-6AM' ,'filterValue':'Before 6AM','selected':false},
	{'filterCode':'6AM-12PM' ,'filterValue':'6AM - 12PM','selected':false},
	{'filterCode':'12AM-6PM' ,'filterValue':'12AM - 6PM','selected':false},
	{'filterCode':'AFTER-6PM' ,'filterValue':'After 6PM','selected':false}];

        filterDeparture:any=[];
        filterArrival:any=[];
        filterTrainTypes:any=[];
        filterFromStations:any=[];
        filterToStations:any=[];
        filterClasses:any=[];
        serviceSettings:any;
        checkavlTrainslength:number=0;
        tag:any;
        repeatBooking=false;
        repeatBookingData:any = [];
        passParam:any = [];
    
  constructor(private _flightService: FlightService,@Inject(DOCUMENT) private document: any,public rest:RestapiService,private _bottomSheet: MatBottomSheet,private irctcService: IrctcApiService,
    public dialog: MatDialog,public commonHelper: CommonHelper,  private activatedRoute: ActivatedRoute,private sg: SimpleGlobal, 
    private location: Location,private router: Router,@Inject(APP_CONFIG) appConfig: any,private titleService: Title,private appConfigService:AppConfigService,private EncrDecr: EncrDecrService) { 
      this.serviceSettings=this.appConfigService.getConfig();
      if(this.serviceSettings['new_ui_ux']==0 && this.serviceSettings.DOMAIN_SETTINGS[this.sg['domainName']]['TRAIN']!=1){
     this.router.navigate(['/**']);
   }
   this.domainName = this.sg['domainName'];
   this.appConfig = appConfig;
   this.cdnUrl = environment.cdnUrl+this.sg['assetPath']; 
    this.trainUrl = environment.TRAIN_SITE_URL[this.sg['domainName']];
  
        this.stationsdump =  require('src/assets/data/stations.json');
        this.travalfrom = this.activatedRoute.snapshot.queryParamMap.get('searchFrom');
        this.travalto = this.activatedRoute.snapshot.queryParamMap.get('searchTo');
        this.frmStn = this.activatedRoute.snapshot.queryParamMap.get('fromTravelCode');
        this.toStn = this.activatedRoute.snapshot.queryParamMap.get('toTravelCode');
        this.journeyDate = this.activatedRoute.snapshot.queryParamMap.get('departure');
        this.cdnUrl = environment.cdnUrl+this.sg['assetPath']; 
        this.quota  = this.activatedRoute.snapshot.queryParamMap.get('trainQuota');
  
        this.tag = this.activatedRoute.snapshot.queryParamMap.get('t');

        if( this.tag){
        const dialogRef = this.dialog.open(ChromeExtBusDialog, {
        autoFocus: false,
        panelClass: 'alert_ext',
        width:'800px',
        disableClose: true
        });
        }
        
        this.passParam = {
        service:'Train',
        journeyDate:this.journeyDate,
        frmCode: this.frmStn,
        toCode: this.toStn,
        searchFrom: this.travalfrom.replace(/ *\([^)]*\) */g, ""),
        searchTo: this.travalto.replace(/ *\([^)]*\) */g, ""),
        };

 if(this.sg['domainPath'] != ''){
  this.domainRedirect =  environment.MAIN_SITE_URL +this.domainPath;
  this.trainUrl = environment.TRAIN_SITE_URL[this.sg['domainName']]; 
 }

 // override the route reuse strategy
 this.router.routeReuseStrategy.shouldReuseRoute = function() {
  return false;
 };
 this.assetPath = this.sg['domainPath'];
       
 
   }
   

  ngOnInit() {
     this.titleService.setTitle('Home | IRCTC');
       this.isMobile = window.innerWidth < 991 ?  true : false;
     this.activatedRoute.url.subscribe(url =>{
        this.resetPopups();
        this.moveTop();
        this.loading = true;
      this.headerHideShow(null);
     this.selectedQuota = 'GN';
     this.domainRedirect = environment.MAIN_SITE_URL + this.sg['domainPath'];
     const queryParams = this.activatedRoute.snapshot.queryParams;
     
      this.trainSearchCallBack(queryParams);
      localStorage.setItem('trainLastSearchNew',JSON.stringify(queryParams));
     
     
     var datePipe = new DatePipe('en-US');
     var previousDay = new Date(this.journeyDate);
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
   
   
   setTimeout(() => {
    //Check Laravel Seesion
        if(this.sg['customerInfo']){
         this.customerInfo = this.sg['customerInfo'];
         if(this.customerInfo["org_session"]==1){
         if(this.customerInfo["guestLogin"]==true){
         // this.repeatBooking=false;
             this.XSRFTOKEN = 'NULL';
          this.isLogged=false;
         }else{
         this.isLogged=true;
            this.XSRFTOKEN = this.customerInfo["XSRF-TOKEN"];
          this.rest.updateCardDetails(this.customerInfo);
         if(this.customerInfo['ccustomer'] && this.customerInfo['ccustomer'].points_available && ( this.customerInfo['ccustomer'].points_available!=undefined || this.customerInfo['ccustomer'].points_available!=null))
          this.customeravailablepoints=(Number(this.customerInfo['ccustomer'].points_available)).toLocaleString('en-IN'); 
          //this.initiateCards();
          
          
         }
        }else{
         this.XSRFTOKEN = 'NULL';
         this.isLogged=false;
        } 
    }else {
    this.XSRFTOKEN = 'NULL';
    this.isLogged=false;
     this.document.location.href = environment.MAIN_SITE_URL+'update-csrf';
    }
     }, 50);
    this.getTrains();
     
     let trackUrlParams = new HttpParams()
     .set('current_url', window.location.href)
     .set('category', 'RedBus')
     .set('event', 'Search listing')
     .set('metadata', JSON.stringify(this.tracksearchObj));
     
      const track_body: string = trackUrlParams.toString();
      this.rest.trackEvents( track_body).subscribe(result => {});
       });
  }
  
   moveTop() {
       window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
});
 }
   continueSearchTrain:any=[]
   trainSearchCallBack(param:any){
      let searchValueAllobj=param;
      let continueSearch:any=localStorage.getItem('continueSearchTrain');
      if(continueSearch==null){
        this.continueSearchTrain=[];
      }
      if(continueSearch!=null && continueSearch.length>0){
        this.continueSearchTrain=JSON.parse(continueSearch);
        this.continueSearchTrain=this.continueSearchTrain.filter((item:any)=>{
          if(item.searchFrom!=searchValueAllobj.searchFrom || item.searchTo!=searchValueAllobj.searchTo)
          {
              return item;
          }
        })
      }
      if(this.continueSearchTrain.length>3){
        this.continueSearchTrain=this.continueSearchTrain.slice(0,3);
      }
      this.continueSearchTrain.unshift(searchValueAllobj);// unshift/push - add an element to the beginning/end of an array
      localStorage.setItem('continueSearchTrain',JSON.stringify(this.continueSearchTrain));
  }
 
   headerHideShow(event:any) {
    this.isMobile = window.innerWidth < 991 ?  true : false;
    if(this.isMobile){
     this._flightService.showHeader(false);
    }else{
    this._flightService.showHeader(true);
    }
  }
 
         resetPopups(){
        $(".modal").hide();
        $("body").removeAttr("style");
        $(".modal-backdrop").remove();
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
    this.orderBy('');
  }
  openAvailability()
  {
    var filterDiv = document.getElementById('m_availability_modal');
    if(filterDiv)
    {
      filterDiv.style.display = 'block';
    }

  }

  CloseAvailabilitySection()
  {
    var filterDiv = document.getElementById('m_availability_modal');
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
  	getCardDetails(){ 
		const urlParams = new HttpParams()
		.set('postData', 'XXXXX')
		const body: string = urlParams.toString();
		this.rest.getupdateCardDetails().subscribe(response => {
			if (response.hasOwnProperty('customercards')){
				let customercards = response.customercards;
				this.customercards=customercards;
				if(customercards.length>0){
					this.custCardsAvailable=true;
                                        //get primary card detail
                                        for(let i=0; i<customercards.length; i++){
                                        if(customercards[i].is_primary==1){
                                        this.selectedCardDetails=customercards[i].id;
                                        this.selectedCardValue=customercards[i].card;
                                        //console.log(customercards[i]);
                                        }
                                        }
				}else{
					this.custCardsAvailable=false;
				}
			}else{
				this.custCardsAvailable=false;
			}


		}), (err: HttpErrorResponse) => {
			var message = 'Something went wrong';
			console.log(message);
		};
	}

     
    goTo(path){
     this.router.navigate([this.sg['domainPath']+path]);
    
    }

  previousDay() {
    var datePipe = new DatePipe('en-US');
    var previousDay = new Date(this.journeyDate);
    // console.log(previousDay)
    var departureTimestamp = previousDay.setDate(previousDay.getDate() - 1);
    // console.log(departureTimestamp)
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
      searchFrom: this.travalfrom,
      searchTo: this.travalto,
      fromTravelCode: this.frmStn,
      toTravelCode: this.toStn,
      departure: this.departureDate
     };
     this.router.navigate([this.sg['domainPath']+'trains/list'], {
      queryParams: this.searchParamPreviousDay
     });
    } else {
     this.datePreviousStatus = true;
     this.departureDate = departureDateNumberFormat2;
     this.searchParamPreviousDay = {
      searchFrom: this.travalfrom,
      searchTo: this.travalto,
      fromTravelCode: this.frmStn,
      toTravelCode: this.toStn,
      departure: this.departureDate
     };
     this.router.navigate([this.sg['domainPath']+'trains/list'], {
      queryParams: this.searchParamPreviousDay
     });
    }
   }


   nextDay() {
    var myDate = new Date(this.journeyDate);
    var nextDay = new Date(myDate);
    this.departureStr = nextDay.setDate(myDate.getDate() + 1);
    var datePipe = new DatePipe('en-US');
    this.departureDate = datePipe.transform(this.departureStr, 'yyyy-MM-dd');
    this.searchParamNextDay = {
      searchFrom: this.travalfrom,
      searchTo: this.travalto,
      fromTravelCode: this.frmStn,
      toTravelCode: this.toStn,
      departure: this.departureDate
    };
    this.router.navigate([this.sg['domainPath']+'trains/list'], {
     queryParams: this.searchParamNextDay
    });
   }



  quotaSelect(event: MatTabChangeEvent,mobile){
    $('.check-available').hide();
    if(mobile){
      this.quota =  event.tab.textLabel;
      if(this.quota == "SS"){
        var message =
        'What is LOWER BERTH/Sr. CITIZEN Quota??<br>'+
        'LOWER BERTH/Sr. CITIZEN Quota berths are lower berths earmarked only for male of age 60 years and above/female of age 58 years and above for senior citizens (45 years for lower berth), when traveling alone or two passengers (under mentioned criteria) traveling on one ticket.</br>'+
         'For reservation of pregnant women traveling alone under LOWER BERTH/Sr. CITIZEN Quota, booking facility is available only at Indian Railways Booking counters/Reservation Offices.';
        const dialogRef = this.dialog.open(seniorCitizenDilog, {
           // disableClose: true,
            width: '900px',
            id: 'messageforMliteDialog',
            data: {
                errorDialog: true,
                messageData: message
            }
        });
      }
    }else{
      this.quota = this.selectedQuota;

      if(this.quota == "SS"){
       var message =
        'What is LOWER BERTH/Sr. CITIZEN Quota??<br>'+
        'LOWER BERTH/Sr. CITIZEN Quota berths are lower berths earmarked only for male of age 60 years and above/female of age 58 years and above for senior citizens (45 years for lower berth), when traveling alone or two passengers (under mentioned criteria) traveling on one ticket.</br>'+
         'For reservation of pregnant women traveling alone under LOWER BERTH/Sr. CITIZEN Quota, booking facility is available only at Indian Railways Booking counters/Reservation Offices.';
        const dialogRef = this.dialog.open(seniorCitizenDilog, {
           // disableClose: true,
            width: '900px',
            id: 'messageforMliteDialog',
            data: {
                errorDialog: true,
                messageData: message
            }
        });
      }
      //console.log("web  "+this.quota);
    }
  }
  seniorCitizenconfirm(){
    /*if(event.target.value == 1){
    this.quota = "SS";}else{
      this.quota = event.tab.textLabel;
    }*/
  }
  
  
  sortByDuration() {
    return this.trains.sort((a: any, b: any) => {
    var durationArray1 = a.duration.split(":");
    var durationArray2 = b.duration.split(":");
    var timeInminutesA = Number(durationArray1[0] * 60) + Number(durationArray1[1]) ;
    var timeInminutesB = Number(durationArray2[0] * 60) + Number(durationArray2[1]);
    return ((timeInminutesA < timeInminutesB) ? -1 : ((timeInminutesA >timeInminutesB) ? 1 : 0)); 
    });
  }
  fastestTrain;
 getTrains(){

  this.searchParam = {
      frmStn:this.frmStn,
      journeyDate:this.journeyDate,
      toStn:this.toStn,
      searchFrom: this.travalfrom,
      searchTo: this.travalto,
  };
	var datePipe = new DatePipe('en-US');
  this.searchParam['journeyDate'] = datePipe.transform(this.searchParam['journeyDate'], 'yyyyMMdd');

	let urlParams = new HttpParams()
	.set('frmStn', this.searchParam['frmStn'])
	.set('journeyDate',this.searchParam['journeyDate'])
	.set('searchFrom',this.searchParam['searchFrom'])
	.set('searchTo',this.searchParam['searchTo'])
	.set('toStn', this.searchParam['toStn'] );
  
	const body: string = urlParams.toString();
	this.irctcService.getTrains( body).subscribe(data => {

  this.trainResponse = <trainResponse>data;
  
    this.loading = false;
    if(this.trainResponse.errorcode==1  ) {
        this.selected_count=-1;
        this.sortFilterhide = false;
        
    }else{

      if (typeof this.trainResponse.partnerResponse.trainBtwnStnsList !== 'undefined') 
      {
 	this.checkavlTrainslength = (this.trainResponse.partnerResponse.trainBtwnStnsList).length;
  	if( Array.isArray(this.trainResponse.partnerResponse.trainBtwnStnsList) ){
	this.trainResponse.partnerResponse.trainBtwnStnsList=this.trainResponse.partnerResponse.trainBtwnStnsList;
	}else{
	var tmp=[];
	tmp.push(this.trainResponse.partnerResponse.trainBtwnStnsList);
	this.trainResponse.partnerResponse.trainBtwnStnsList=tmp;
	}

  
          if (this.trainResponse && this.trainResponse.partnerResponse.trainBtwnStnsList.length > 0 && this.trainResponse.errorcode==0 &&   this.trainResponse.partnerResponse.errorMessage !='') 
          {
              this.searchdate = new Date(this.journeyDate).toLocaleString('en-us', {  weekday: 'long' });
              // console.log(this.searchdate);
              this.quotaList=this.trainResponse.partnerResponse.quotaList;
              this.avlQuota = this.commonHelper.getavlablequota(this.quotaList);
              this.avltrains = this.trainResponse.partnerResponse.trainBtwnStnsList;
             //this.ondayavltrains = this.commonHelper.departoncheck(this.avltrains,this.searchdate);
              ///this.trains=this.ondayavltrains;
              this.trains=this.avltrains;
              this.selected_count=this.trainResponse.partnerResponse.trainBtwnStnsList.length;
              this.availableClasses=this.commonHelper.getAvailableClasses(this.trains);
              this.trainTypes=this.commonHelper.getTrainTypes(this.trains);
              this.allfromStations = this.fromStations=this.commonHelper.getStations(this.trains,'fromStnCode',this.stationsdump);
              this.alltoStations = this.toStations=this.commonHelper.getStations(this.trains,'toStnCode',this.stationsdump);
              this.irctcQuota=this.trainResponse.partnerResponse.quotaList.sort(function(a, b) { return a> b });
              this.sortByDuration();
              this.fastestTrain=this.trains[0].trainNumber;
              
          }else{
           var errorMessage="No Trains Found";
           if(typeof this.trainResponse.partnerResponse.errorMessage !== undefined)
              errorMessage=this.trainResponse.partnerResponse.errorMessage;
            alert(errorMessage);
            this.selected_count=-1;
          }
      }else{
            var errorMessage="No Trains Found";
            if(typeof this.trainResponse.partnerResponse.errorMessage !== undefined)
              errorMessage=this.trainResponse.partnerResponse.errorMessage;
            alert(errorMessage);
            this.selected_count=-1;
      }
    }
	},
      (err: HttpErrorResponse) => {
          this.selected_count=-1;
          this.loading = false;
      });

 }
  updateDeparture(appt) {
    
    if(appt.selected) {
    this.filterDeparture.push(appt.filterCode);
    }
    else {
  let index = this.filterDeparture.indexOf(appt.filterCode)
      this.filterDeparture.splice(index, 1);
     
    }
		this.trains = this.trains.filter(g => {return true;});
	}
	
  updateArrival(appt) {
    
    if(appt.selected) {
    this.filterArrival.push(appt.filterCode);
    }
    else {
 let index = this.filterArrival.indexOf(appt.filterCode)
      this.filterArrival.splice(index, 1);
      
    }
		this.trains = this.trains.filter(g => {return true;});
	}

updateAvailableClassFilter(appt) {
    if(appt.selected) {
     this.filterClasses.push(appt.classCode);
    }
    else {
 let index = this.filterClasses.indexOf(appt.classCode)
      this.filterClasses.splice(index, 1);
     
    }
  this.trains = this.trains.filter(g => {return true;});
  }
updateTrainTypeFilter(appt) {
    if(appt.selected) {
     this.filterTrainTypes.push(appt.trainTypeCode);
    }
    else {
 let index = this.filterTrainTypes.indexOf(appt.trainTypeCode)
      this.filterTrainTypes.splice(index, 1);
     
    }
  this.trains = this.trains.filter(g => {return true;});
  }


 updateFromStationFilter(appt) {
    if(appt.selected) {
    this.filterFromStations.push(appt.stationCode);
    }
    else {
  let index = this.filterFromStations.indexOf(appt.stationCode)
      this.filterFromStations.splice(index, 1);
     
    }
  this.trains = this.trains.filter(g => {return true;});
  }

 updateToStationFilter(appt) {
    if(appt.selected) {
     this.filterToStations.push(appt.stationCode);
    }
    else {
 let index = this.filterToStations.indexOf(appt.stationCode)
      this.filterToStations.splice(index, 1);
     
    }
  this.trains = this.trains.filter(g => {return true;});
  }
  updateTosSelectedQuota(appt) {
    this.selectedQuota = appt.quotaCode;
    this.quotaSelect(appt.quotaCode,false);
  //   if(appt.selected) {
  //    this.selectedQuota = appt.quotaCode;
  //   }
  //   else {
  //   let index = this.selectedQuota.indexOf(appt.quotaCode)
  //     this.selectedQuota.splice(index, 1);
     
  //   }
  // this.trains = this.trains.filter(g => {return true;});
  }

  searchboarding(search){

    var searchkey = 'stationName';
    switch(search.type) { 
      case 'boarding': { 
        var searchfor = this.allfromStations;
        var result = this.commonHelper.search(search.input,searchfor,searchkey); 
        this.fromStations = result;
         break; 
      } 
      case 'dropping': { 
        var searchfor = this.alltoStations;
        var result = this.commonHelper.search(search.input,searchfor,searchkey);
        this.toStations = result;
         break; 
      } 
     
    }
   }
   goback() {
    this.location.back();
  }
  selectedOption: any = "Early Departure";
  selectedOptionNew: any = "Early Departure";
  selected:any="leave-early";
  option: string = '';
   orderBy(option) {

    this.selectedOptionNew = option;
    if (option == 'leave-early') {
      this.selectedOption = 'Early Departure';
    } else if (option == 'leave-late') {
      this.selectedOption = 'Late Depature';
    }
    this.option = option;
    this.sortBy=option;
    this.showSortbuy=false;
    this.Sortby = "Sorted By"; 
    this.trains = this.trains.filter(g => {
      return true;
    });
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

  clearSelectionAll(){
    this.filterDeparture = [];
    this.departureTimeFilter.forEach((item) => {   item.selected = false; });
    this.filterArrival = [];
    this.arrivalTimeFilter.forEach((item) => {   item.selected = false; });
    this.filterClasses = [];
    this.availableClasses.forEach((item) => {   item.selected = false; });
    this.filterTrainTypes = [];
    this.trainTypes.forEach((item) => {   item.selected = false; });
    this.filterFromStations = [];
    this.fromStations.forEach((item) => {   item.selected = false; });
    this.filterToStations = [];
    this.toStations.forEach((item) => {   item.selected = false; });
    }

  
  onFilter(){
    this.showFilter=!this.showFilter;
    this.showSortbuy = !this.showSortbuy;

  }
  onTraveller(){
    this.showTraveller=true;
    this.onHide=false;
  }
    
  openDialog(): void {
    let body = document.getElementsByTagName('body')[0];
    body.classList.add("noscroll"); //add the class
    const bottomSheetRef = this._bottomSheet.open(BottomSortbySheet, {
     disableClose: true,
     panelClass: 'sort_bottom_sheet',
      data: {name: this.name}
    });
    bottomSheetRef.afterDismissed().subscribe(result => {
      this.orderBy(result);
     });
  }

  openDialogFilter(): void {
    let body = document.getElementsByTagName('body')[0];
    body.classList.add("noscroll"); //add the class
    const bottomSheetRef = this._bottomSheet.open(BottomFilterSheet, {
     disableClose: true,
     panelClass: 'filter_bottom_sheet',
     data: {name: this.name}

    });
    // bottomSheetRef.afterDismissed().subscribe(result => {
    //   this.orderBy(result);
    //  });
  }
}
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog-component.html',
})
export class BottomSortbySheet {
  showLi: Boolean = false;
  optionSelected: string;
  constructor(
    private _bottomSheetRef: MatBottomSheetRef <BottomSortbySheet> , @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    ) {this.optionSelected = data.selectedOption;}

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
  event.preventDefault()
  }

  selectLi(option) {
    this.showLi = !this.showLi;
    this.optionSelected = option;
   }

}

@Component({
  selector: 'app-dialog-filter',
  templateUrl: './dialog-filterComponent.html',
})
export class BottomFilterSheet {
  optionSelected: string;
  constructor(
    private _bottomSheetRef: MatBottomSheetRef <BottomFilterSheet> , @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    ) {

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
    event.preventDefault()
    }

}

@Component({
  templateUrl: 'seniorCitizenDilog.html',
})
export class seniorCitizenDilog {
  constructor(public dialogTravel: MatDialogRef < seniorCitizenDilog > , @Inject(MAT_DIALOG_DATA) public data: any) {}
  ngOnInit(){}
  seniorCitizenconfirm() { 
      this.dialogTravel.close();
  }
  
}



@Component({
  templateUrl: 'chrome-popup.html',
  styleUrls: ['./trains.component.scss']
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
