import { Component, OnInit,NgModule,ChangeDetectorRef, ElementRef  ,Input,Output, EventEmitter,HostListener,Inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators ,FormsModule,FormControl,FormArray} from '@angular/forms';
import { NgbDateParserFormatter,NgbDateStruct, NgbCalendar,NgbInputDatepicker,NgbDate} from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../environments/environment';
import { RestapiService } from 'src/app/shared/services/restapi.service';
import { EncrDecrService } from 'src/app/shared/services/encr-decr.service';
import { HttpClient, HttpHeaders, HttpErrorResponse , HttpParams} from '@angular/common/http';
import { SimpleGlobal } from 'ng2-simple-global';
import { DOCUMENT } from '@angular/common';
import { AppConfigService } from '../app-config.service';
import { APP_CONFIG, AppConfig} from '../configs/app.config';
import { PayService } from 'src/app/shared/services/pay.service'
import { CommonHelper } from 'src/app/shared/utils/common-helper';
import { CookieService } from 'ngx-cookie-service';
import { ElasticsearchService } from 'src/app/shared/services/elasticsearch.service';
import { ActivatedRoute, Router} from '@angular/router';
import { MatDialog,MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DatePipe } from '@angular/common';
import {MatNativeDateModule, NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import { IrctcApiService } from 'src/app/shared/services/irctc.service';
import { formatDate } from '@angular/common';

declare var require: any;
 declare var $: any;  
export const PICK_FORMATS = {
  parse: {dateInput: {month: 'short', year: 'numeric', day: 'numeric'}},
  display: {
      dateInput: 'input',
      monthYearLabel: {year: 'numeric', month: 'short'},
      dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
      monthYearA11yLabel: {year: 'numeric', month: 'long'}
  }
};


@Component({
  selector: 'app-travel-search',
  templateUrl: './travel-search.component.html',
  styleUrls: ['./travel-search.component.scss'],
})
export class TravelSearchComponent implements OnInit {
        @Input() searchDisplayForm;
        @Input() webView;
        @Input()  showType;
        @Input()  popular;
        @Input()  tab;
       	@Output() closeBottomSheetPop = new EventEmitter<any>();
        
        flightDeparture: any;
        flightReturn:any;
        busDeparture: any;
        trainDeparture:any;

        cdnUrl: any;
        siteUrl:any;
        date: {year: number, month: number};
        serviceSettings:any;
        showFlightPassenger:boolean = false;
        showHotelPassenger:boolean = false;
        showHotelPassengerError:boolean = false;
        fromFlightCityList:boolean = false;
        toFlightCityList:boolean = false;
        hotelCityList:boolean = false;
        fromBusCityList:boolean = false;
        toBusCityList:boolean = false;
        fromTrainCityList:boolean = false;
        toTrainCityList:boolean = false;
        flightFrom:any;
        flightTo:any;
        fromFlightCode:any;
        toFlightCode:any;

        hotelName:any; 
        hotelId:any;  countryId:any; 
        busFrom:any;
        busTo:any;
        fromBusCode:any;
        toBusCode:any;
     
        trainFrom:any;
        trainTo:any;
        fromTrainCode:any;
        toTrainCode:any;
        searchFlightForm: FormGroup;
        searchHotelForm: FormGroup;
        searchBusForm: FormGroup;
        searchTrainForm: FormGroup;
        flightindex: any;hotelindex: any;busindex: any;trainindex: any;
        private lastKeypress = 0;
        private queryText = '';
        searchFlightArray:any = [];
        submittedFlight = false;submittedHotel = false;submittedBus = false;submittedTrain = false;
        expiredDate: any = new Date();
        today: any = new Date();
        validateMessageFlight=false;
        validateMessageBus=false;
        validateMessageTrain=false;
        defaultFlightOptions: any[];
        defaultHotelOptions: any[];
        defaultTrainOptions: any[];
        defaultBusOptions: any[];
        flightFromText;
        flightToText;
        hotelFromText;
        busFromText;
        busToText;
        trainFromText;
        trainToText;	
        flightFromOptions: any[];
        flightToOptions: any[];
        hotelOptions: any[];
        trainFromOptions: any[];
        trainToOptions: any[];
        busFromOptions: any[];
        busToOptions: any[];
        minDate;flightpickermaxDate;buspickermaxDate;trainpickermaxDate;
        minFlightReturnData;
        minDateMlite =  new Date();
        minDateFlightToMlite =  new Date();
        minDateHotelToMlite =  new Date();
        buspickermaxDateMlite;
        trainpickermaxDateMlite;
        hotelpickermaxDateMlite;
        flightpickermaxDateMlite;
        
        buspickerDefaultMlite;
        trainpickerDefaultMlite;
        hotelpickerDefaultFMlite;
        hotelpickerDefaultTMlite;
        flightpickerDefaultFMlite;
         flightpickerDefaultTMlite;
        
        arrowFromkeyLocation = 0;
        arrowTokeyLocation = 0;
        enableEs:boolean=true;
        searchFlightFromHeader:string="Popular Cities";
        searchFlightToHeader:string="Popular Cities";
        searchHotelHeader:string="Popular Cities";
        searchBusFromHeader:string="Popular Cities";
        searchBusToHeader:string="Popular Cities";
        searchTrainFromHeader:string="Popular Cities";
        searchTrainToHeader:string="Popular Cities";
        hotelCheckin: NgbDate | null;
        hotelCheckout: NgbDate | null;
        hoveredDate: NgbDate | null = null;
        searchArray:any = [];
        travelInputText:string="1 Adult, Economy";
        hotelInputText:string="1 Room(s) &  2 Guest(s)";
        showFlightReturn:boolean=false;
        adult_cnt:number=1;
        child_cnt:number=0;
        infant_cnt:number=0;
        adult_label:number=1;
        child_label:number=0;
        infant_label:number=0;
        flightTripType:string="R";
        flightClass:string="E";
        roomCount:number=0;
       DOMAIN_SETTINGS:string;
       
        showMliteHotelForm = false;
        showMliteFlightFromForm = false;
        showMliteFlightToForm = false;
        
        showMliteBusFromForm = false;
        showMliteBusToForm = false;
        showMliteTrainFromForm = false;
        showMliteTrainToForm = false;
        traintab:string="journey";
        quotaList;
        selectedQuota:any = 'GN';
        quota:string = 'GN';
        upcomingFjnData = [
          {"title":"Mumbai to Bangalore","price":"1200","trip":"Round trip"},
          {"title":"Mumbai to Goa","price":"1800","trip":"Round trip"},
          {"title":"Mumbai to Chennai","price":"1200","trip":"Round trip"},
          {"title":"Mumbai to Delhi","price":"2000","trip":"Oneway trip"},
          {"title":"Mumbai to Mangalore","price":"1200","trip":"Round trip"},
          {"title":"Mumbai to Hyderabad","price":"2200","trip":"Round trip"},
        ];
        acronymsData = [
          {"code":"CAN", "desc":"CANCELLED"},
          {"code":"CNF", "desc":"CONFIRM"},
          {"code":"RAC", "desc":"RESERVATION AGAINST CANCELLATION"},
          {"code":"WL", "desc":"WAITLIST"},
          {"code":"GN", "desc":"General"},
          {"code":"PT", "desc":"Premium Tatkal"},
          {"code":"LD", "desc":"Ladies"},
          {"code":"TQ", "desc":"Tatkal"},
          {"code":"GNWL", "desc":"General Waitlist"},
          {"code":"TQWL", "desc":"Tatkal Waitlist"},
          {"code":"RLWL", "desc":"REMOTE LOCATION WAITLIST"},
          {"code":"PQWL", "desc":"POOLED QUOTA WAITLIST"},
          {"code":"RSWL", "desc":"ROAD-SIDE WAITLIST"},
          {"code":"REL", "desc":"RELEASED"},
          {"code":"NR", "desc":"NO ROOM"},
          {"code":"NOSB", "desc":"NO SEAT BERTH"},
          {"code":"WEBCAN	", "desc":"Railway Counter Ticket: Passenger has been cancelled over internet and refund has not been collected."},
          {"code":"WEBCANRF", "desc":"Railway Counter Ticket: Passenger has been cancelled over internet and refund has been collected."},
          {"code":"FBKG", "desc":"Ticket Booked Outside ARP in FT Quota. Seat has not been allotted yet"},
          
        ]
    stationsdump:any=[];
            pnrsubmitted: boolean = false;
        pnrRoute:any;
        PnrDetails:any;
        pnrNo:string;
        errorMessage:string;
        showSearch=true;
        showPnr=true;
        showDetails=false;
        pnrNumber:string;
    redirectPopupTrigger:number=0; redirectPopupPartner;redirectPopupType;redirectPopupUrl;redirectPopupHeader;redirectPopupImpmessage;redirectPopupMessage;redirectPopup;
   redirectPopupTriggerTimestamp;
   constructor(private activatedRoute: ActivatedRoute,private _elRef: ElementRef,private dialog: MatDialog,private router: Router,private es: ElasticsearchService,private formBuilder: FormBuilder,public rest: RestapiService, private EncrDecr: EncrDecrService, private http: HttpClient,private sg: SimpleGlobal,@Inject(DOCUMENT) private document: any,private appConfigService:AppConfigService,private pay: PayService, private commonHelper: CommonHelper,private cookieService: CookieService, public formatter: NgbDateParserFormatter,private calendar: NgbCalendar,public irctc:IrctcApiService, 
  //  private _css: ClipboardService,
    ) { 
       
        this.serviceSettings=this.appConfigService.getConfig();
        this.cdnUrl = environment.cdnUrl;
        this.siteUrl=environment.MAIN_SITE_URL;
        this.DOMAIN_SETTINGS=this.serviceSettings.DOMAIN_SETTINGS[this.sg['domainName']];
        this.enableEs=this.serviceSettings.enableEs;
	this.hotelCheckin = calendar.getToday();
        this.hotelCheckout = calendar.getNext(calendar.getToday(), 'd', 1);
        this.quotaList =AppConfig.IRCTC_List_Quota;

          this.stationsdump =  require('src/assets/data/stations.json');

	if(this.enableEs){
	this.defaultFlightOptions=[
	{"_source":{"city":"New Delhi","airport_code":"DEL","airport_name":"Indira Gandhi Airport"}},
	{"_source":{"city":"Mumbai","airport_code":"BOM","airport_name":"Chatrapati Shivaji Airport"}},
	{"_source":{"city":"Bangalore","airport_code":"BLR","airport_name":"Kempegowda International Airport"}},
	{"_source":{"city":"Goa","airport_code":"GOI","airport_name":"Dabolim Airport"}},
	{"_source":{"city":"Chennai","airport_code":"MAA","airport_name":"Chennai Airport"}},
	{"_source":{"city":"Kolkata","airport_code":"CCU","airport_name":"Netaji Subhas Chandra Bose Airport"}},
	{"_source":{"city":"Hyderabad","airport_code":"HYD","airport_name":"Hyderabad Airport"}},
	];
         
      
	this.defaultHotelOptions= [
	{"_source":{ "city": "Mumbai", "full_content": "Mumbai, Maharashtra,  India","country" :"IN"}} , 
	{"_source":{ "city": "Bangalore", "full_content": "Bangalore, Karnataka,  India","country" :"IN"} }, 
	{"_source":{ "city": "Chennai", "full_content": "Chennai, Tamil Nadu, India","country" :"IN"}} , 
	{"_source":{ "city": "Goa", "full_content": "Goa, India","country" :"IN"}} , 
	{"_source":{ "city": "Kolkata", "full_content": "Kolkata, West Bengal, India","country" :"IN"}} , 
	{"_source":{ "city": "Hyderabad", "full_content": "Hyderabad, Andhra Pradesh,  India","country" :"IN"}} , 
	{"_source":{ "city": "Jaipur", "full_content": "Jaipur, Rajasthan, India","country" :"IN"}},
	{"_source":{ "city": "Cochin", "full_content": "Cochin, Kerala, India","country" :"IN"}}, 
	{"_source":{ "city": "London", "full_content": "London, Greater London, United Kingdom","country" :"GB"}} ,
	{"_source":{ "city": "Dubai", "full_content": "Dubai, Dubai Emirate, United Arab Emirates","country" :"AE"}} ,
	{"_source":{ "city": "Singapore", "full_content": "Singapore, Singapore","country" :"SG"}} ,
	{"_source":{ "city": "Bangkok", "full_content": "Bangkok, Bangkok Province, Thailand","country" :"TH"}} ,
	];
	

	this.defaultTrainOptions=[
	{"_source":{"name":"KSR BENGALURU","id":"0","code":"SBC"}},
	{"_source":{"name":"CHENNAI CENTRAL","id":"0","code":"MAS"}},
	{"_source":{"name":"HYDERABAD DECAN","id":"0","code":"HYB"}},
	{"_source":{"name":"MUMBAI CENTRAL","id":"0","code":"MMCT"}},
	{"_source":{"name":"NEW DELHI","id":"0","code":"NDLS"}},
	{"_source":{"name":"KOLKATA","id":"0","code":"KOAA"}},
	{"_source":{"name":"MANGALURU JN","id":"0","code":"MAJN"}},
	{"_source":{"name":"PUNE JN","id":"0","code":"PUNE"}},
	{"_source":{"name":"Tirupathi","id":"0","code":"TPTY"}},
	{"_source":{"name":"GOHAD ROAD","id":"0","code":"GOA"}}
	];
	
	this.defaultBusOptions=[
	{"_source":{"stateId":"","name":"Bangalore","id":"3","state":"Bangalore"}},
	{"_source":{"stateId":"","name":"Chennai","id":"102","state":"Chennai"}},
	{"_source":{"stateId":"","name":"Tirupathi","id":"1885","state":"Tirupathi"}},
	{"_source":{"stateId":"","name":"Pune","id":"626","state":"Pune"}},
	{"_source":{"stateId":"","name":"Mumbai","id":"649","state":"Mumbai"}},
	{"_source":{"stateId":"","name":"Mangalore","id":"489","state":"Mangalore"}},
	{"_source":{"stateId":"","name":"Kolkata","id":"1308","state":"Kolkata"}},
	{"_source":{"stateId":"","name":"Hyderabad","id":"6","state":"Hyderabad"}},
	{"_source":{"stateId":"","name":"Goa","id":"615","state":"Goa"}},
	{"_source":{"stateId":"","name":"Delhi","id":"1492","state":"Delhi"}}
	];

	}   
	
	this.flightFromOptions= this.defaultFlightOptions;
	this.flightToOptions= this.defaultFlightOptions;
	
	this.hotelOptions= this.defaultHotelOptions;
        
        this.trainFromOptions= this.defaultTrainOptions;
        this.trainToOptions= this.defaultTrainOptions;
        
        this.busFromOptions= this.defaultBusOptions;
        this.busToOptions= this.defaultBusOptions;
	
	
	var CurrentDate = new Date();
	
	this.minDate = {year: CurrentDate.getFullYear(), month: CurrentDate.getMonth()+1, day: CurrentDate.getDate()};
	 this.minFlightReturnData=this.minDate;
	CurrentDate.setDate(CurrentDate.getDate() + 90);
	this.buspickermaxDateMlite= new Date( CurrentDate.getFullYear(), CurrentDate.getMonth()+1, CurrentDate.getDate());
	this.buspickermaxDate = {year: CurrentDate.getFullYear(), month: CurrentDate.getMonth()+1, day: CurrentDate.getDate()};
	
	CurrentDate = new Date();
	CurrentDate.setDate(CurrentDate.getDate() + 365);
		
	this.flightpickermaxDate = {year: CurrentDate.getFullYear(), month: CurrentDate.getMonth()+1, day: CurrentDate.getDate()};
	this.flightpickermaxDateMlite= new Date( CurrentDate.getFullYear(), CurrentDate.getMonth()+1, CurrentDate.getDate());

	CurrentDate = new Date();
	CurrentDate.setDate(CurrentDate.getDate() + 124);
	this.trainpickermaxDate = {year: CurrentDate.getFullYear(), month: CurrentDate.getMonth()+1, day: CurrentDate.getDate()};
	this.trainpickermaxDateMlite =  new Date( CurrentDate.getFullYear(), CurrentDate.getMonth()+1, CurrentDate.getDate());
	
        
      //Flight Form
       this.searchFlightForm = this.formBuilder.group({
        flightClass: [this.flightClass, Validators.required],
        flightTripType: [this.flightTripType, Validators.required],
        flightFrom: ['', Validators.required],
        flightTo: ['', Validators.required],
        fromFlightCode: ['', Validators.required],
        toFlightCode: ['', Validators.required],
        flightDeparture: ['', Validators.required],
        flightReturn:[''],
        adult: [this.adult_cnt, Validators.required],
        child: [this.child_cnt],
        infant: [this.infant_cnt],
	}); 
	
      //Hotel Form
      this.searchHotelForm = this.formBuilder.group({
        hotelName: ['', Validators.required],
        hotelId: ['', Validators.required],
        countryId: ['', Validators.required],
        hotelCheckin: ['', Validators.required],
        hotelCheckout: ['', Validators.required],
        roomCount: [0, Validators.required],
        rooms: new FormArray([])
	}); 
	
    //Bus Form
      this.searchBusForm = this.formBuilder.group({
        busFrom: ['', Validators.required],
        busTo: ['', Validators.required],
        fromBusCode: ['', Validators.required],
        toBusCode: ['', Validators.required],
        busDeparture: ['', Validators.required]
	}); 
	
     //Train Form
      this.searchTrainForm = this.formBuilder.group({
        trainFrom: ['', Validators.required],
        trainTo: ['', Validators.required],
        fromTrainCode: ['', Validators.required],
        toTrainCode: ['', Validators.required],
        trainDeparture: ['', Validators.required],
        trainQuota: ['GN', Validators.required]
	});
	this.selectTripType(this.flightTripType); 	
	
  
   }

  ngOnInit() {
  
          $(document).click(function (e) {
          
                if ($(e.target).hasClass("sb_search")) {
                $(".topsearch-auto").show();
                }  
                if (!$(e.target).hasClass("sb_search")   && $(e.target).parents(".topsearch-auto").length === 0) {
                $(".topsearch-auto").hide();
                }
                
                        if ($(e.target).hasClass("hotelNamePop")) {
                $(".from_citiesPop").show();
                }  
                if (!$(e.target).hasClass("hotelNamePop")   && $(e.target).parents(".from_citiesPop").length === 0) {
                $(".from_citiesPop").hide();
                }

                 if ($(e.target).hasClass("travelInputPop")) {
                $(".travelListHotelPop").show();
                }  
                if (!$(e.target).hasClass("travelInputPop")   && $(e.target).parents(".travelListHotelPop").length === 0) {
                $(".travelListHotelPop").hide();
                }
                
                if ($(e.target).hasClass("travelInputFlightPop")) {
                $(".travelListFlightPop").show();
                }  
                if (!$(e.target).hasClass("travelInputFlightPop")   && $(e.target).parents(".travelListFlightPop").length === 0) {
                $(".travelListFlightPop").hide();
                }
                if ($(e.target).hasClass("flightFromPop")) {
                $(".from_citiesFlightsPop").show();
                }  
                if (!$(e.target).hasClass("flightFromPop")   && $(e.target).parents(".from_citiesFlightsPop").length === 0) {
                $(".from_citiesFlightsPop").hide();
                }

                if ($(e.target).hasClass("flightToPop")) {
                $(".to_citiesFlightPop").show();
                }  
                if (!$(e.target).hasClass("flightToPop")   && $(e.target).parents(".to_citiesFlightPop").length === 0) {
                $(".to_citiesFlightPop").hide();
                }
                   
                
                if ($(e.target).hasClass("busFromPop")) {
                $(".from_cities_bus_pop").show();
                }  
                if (!$(e.target).hasClass("busFromPop")   && $(e.target).parents(".from_cities_bus_pop").length === 0) {
                $(".from_cities_bus_pop").hide();
                }

                if ($(e.target).hasClass("busToPop")) {
                $(".to_cities_bus_pop").show();
                }  
                if (!$(e.target).hasClass("busToPop")   && $(e.target).parents(".to_cities_bus_pop").length === 0) {
                $(".to_cities_bus_pop").hide();
                }
                   
                   
                if ($(e.target).hasClass("trainFromPop")) {
                $(".from_cities_train_pop").show();
                }  
                if (!$(e.target).hasClass("trainFromPop")   && $(e.target).parents(".from_cities_train_pop").length === 0) {
                $(".from_cities_train_pop").hide();
                }

                if ($(e.target).hasClass("trainToPop")) {
                $(".to_cities_train_pop").show();
                }  
                if (!$(e.target).hasClass("trainToPop")   && $(e.target).parents(".to_cities_train_pop").length === 0) {
                $(".to_cities_train_pop").hide();
                }

                
                
        });
  
   this.syncData();
     $( ".bottom-sheet-TravelerContainer" ).addClass( "bottom-sheet-TravelerContainer-"+this.searchDisplayForm );
        if(this.searchDisplayForm=='train'){ 
        if (this.router.url.indexOf('/pnr') > -1) {
        }
        } 
  }
  
  copy(pnrNumber: string){
    // this._css.copy(pnrNumber)
  }

   receiveTabChanges($event){
     this.traintab='pnr';
     this.pnrNumber=$event;
    }
   quotaSelect(event,mobile){
    $('.check-available').hide();
    //if(mobile){
     // this.quota =  event.tab.textLabel;
    //}else{
      this.quota = this.selectedQuota;
   // }
  }

    // convenience getters for easy access to form fields
    get hotelForm() { return this.searchHotelForm.controls; }
    get hotelRooms() { return this.hotelForm.rooms as FormArray; }
    
    roomOperation(oper) {
        let numberOfRooms = (this.roomCount  );
        if(oper=='add'){
        numberOfRooms=numberOfRooms+1;
        }else{
        numberOfRooms=numberOfRooms-1;
        }


        if(numberOfRooms < 5 && numberOfRooms > 0 ){
        this.searchHotelForm.controls["roomCount"].setValue(numberOfRooms);
        this.roomCount=numberOfRooms;
        }else{
        return;
        }
     
      if (this.hotelRooms.length < numberOfRooms) {
           var acnt;
            for (let i = this.hotelRooms.length; i < numberOfRooms; i++) {
             if(i==0) acnt=2; else acnt=1;
            
                this.hotelRooms.push(this.formBuilder.group({
                    hotel_adult: [acnt, Validators.required],
                    hotel_child: [0, [Validators.required]],
                    child_age: new FormArray([])
                }));
            }
        } else {
            for (let i = this.hotelRooms.length; i >= numberOfRooms; i--) {
                this.hotelRooms.removeAt(i);
            }
        }
        
     this.hoteltraveller();
        
    }
  roomAdultOperation(room,oper){
  const controlArray = <FormArray> this.searchHotelForm.get('rooms');
  var currentAdultValue=controlArray.controls[room].get('hotel_adult').value;
  var currentChildValue=controlArray.controls[room].get('hotel_child').value;
  
  if(oper=='add'){
     if((currentAdultValue+currentChildValue) > 4){
    alert("Can add only 5 guests in a room");
    return;
    }
   if(currentAdultValue < 4)
   controlArray.controls[room].get('hotel_adult').setValue(currentAdultValue+1)
   }else{
   if(currentAdultValue > 1)
   controlArray.controls[room].get('hotel_adult').setValue(currentAdultValue-1)
   }
    this.hoteltraveller();
  }

   
   
   hotelRoomsChildAge;
  roomChildOperation(room,oper){
   const controlArray = <FormArray> this.searchHotelForm.get('rooms');
  var currentAdultValue=controlArray.controls[room].get('hotel_adult').value;
  var currentChildValue=controlArray.controls[room].get('hotel_child').value;
  if(oper=='add'){
    if((currentAdultValue+currentChildValue) > 4){
    alert("Can add only 5 guests in a room");
    return;
    }
  
   if(currentChildValue < 3)
   controlArray.controls[room].get('hotel_child').setValue(currentChildValue+1)
   }else{
   if(currentChildValue > 0)
   controlArray.controls[room].get('hotel_child').setValue(currentChildValue-1)
   }
   
    var updatedChildValue=controlArray.controls[room].get('hotel_child').value;
    this.hotelRoomsChildAge= <FormArray> controlArray.controls[room].get('child_age')
   
   if (this.hotelRoomsChildAge.length < updatedChildValue) {
           var acnt;
            for (let i = this.hotelRoomsChildAge.length; i < updatedChildValue; i++) {
             if(i==0) acnt=2; else acnt=1;
            
               this.hotelRoomsChildAge.push(this.formBuilder.group({
                    age: ['', Validators.required],
                }));
            }
        } else {
            for (let i =  this.hotelRoomsChildAge.length; i >= updatedChildValue; i--) {
               this.hotelRoomsChildAge.removeAt(i);
            }
        }
        
 this.hoteltraveller();
  }
 getRooms(): FormArray {
    return this.hotelRooms;
  }
  
  getChildAges(roomid: number): FormArray {
    return this.getRooms()
      .at(roomid)
      .get('child_age') as FormArray;
  }
 
   hoteltraveller() {
    let hotelValue=this.searchHotelForm.value;
        var guestCnt=0;
        for (let i = 0; i < hotelValue.rooms.length; i++) {
        guestCnt += hotelValue.rooms[i]['hotel_adult']+hotelValue.rooms[i]['hotel_child'];
        }
    this.hotelInputText=hotelValue.roomCount+' Room(s) &  '+guestCnt+' Guest(s)';
   
  }
 
  
  selectClass(event){
  this.flightClass=event;
  }
  
  selectTripType(event){
  if(event=='R'){
  this.showFlightReturn=true;
    this.searchFlightForm.controls["flightReturn"].setValidators(Validators.required);
    this.searchFlightForm.controls["flightReturn"].updateValueAndValidity();
  }else{
  this.showFlightReturn=false;
  this.flightReturn=null;
   this.searchFlightForm.controls["flightReturn"].setValue('');
  this.searchFlightForm.controls["flightReturn"].clearValidators();
  this.searchFlightForm.controls["flightReturn"].updateValueAndValidity();         
  }
   this.flightTripType=event;
  }
  
  flightPassengers(passenger,opr){
   
   switch(passenger){
    case 'adult': { 
     switch(opr){
      case 'plus': { 
        var a = this.adult_label;
        if (this.check_traveller_count(1)) {
        var b =this.adult_label + 1;
        if (b < 9) {
        this.adult_label=b;
        $(".adult .minus").removeClass('disabled');
        } else {
        this.adult_label=9;
        $(this).addClass('disabled');
        }
        this.adult_cnt=this.adult_label;
        this.updatetraveller();
        } else {
        this.check_traveller_count_message(1);
        }
      break;
      }
     case 'minus': { 
        var a =this.adult_label;
        var b = (a) - 1;
        if (b > 1) {
        this.adult_label=b;
        $(".adult .plus").removeClass('disabled');
        $(this).removeClass('disabled');
        } else {
        this.adult_label=1;
        $(this).addClass('disabled');
        }
        if (a == this.infant_label) {
        this.infant_label=(a-1);
        this.adult_label=(a-1);
        this.adult_cnt=(a-1);
        }
        this.adult_cnt=this.adult_label;
        this.updatetraveller();
      break;
      }
     } 
    break;
   }
   
  case 'child': { 
     switch(opr){
      case 'plus': { 
          var a = this.child_label;
    if (this.check_traveller_count(1)) {
        var b = (a) + 1;
        if (b < 9) {
            this.child_label=b;
            $(".children .minus").removeClass('disabled');
        } else {
           this.child_label=9;
            $(this).addClass('disabled');
        }
       this.child_cnt=this.child_label;
        this.updatetraveller();
    } else {
        this.check_traveller_count_message(1);
    }
      break;
      }
     case 'minus': { 
    var a = this.child_label;
    var b = (a) - 1;
    if (b > 0) {
        this.child_label=b;
        $(".children .plus").removeClass('disabled');
        $(this).removeClass('disabled');
    } else {
       this.child_label=0;
        $(this).addClass('disabled');
    }
   this.child_cnt=this.child_label;
    this.updatetraveller();
      break;
      }
     } 
    break;
   }
   
  case 'infant': { 
     switch(opr){
      case 'plus': { 
       var a = this.infant_label;
    var adults = this.adult_label;
    if (this.check_traveller_count(2)) {
        var b = (a) + 1;
        if (b <= adults) {
           this.infant_label=b;
            $(".infants .minus").removeClass('disabled');
        }
       this.infant_cnt=this.infant_label;
        this.updatetraveller();
    } else {
        this.check_traveller_count_message(2);
    }
      break;
      }
     case 'minus': { 
          var a = this.infant_label;;
    var b = (a) - 1;
    if (b > 0) {
       this.infant_label=b;
        $(".infants .plus").removeClass('disabled');
        $(this).removeClass('disabled');
    } else {
       this.infant_label=0;
        $(this).addClass('disabled');
    }
   this.infant_cnt=this.infant_label;
    this.updatetraveller();
      break;
      }
     } 
    break;
   }
   }
  }
  
  mliteDatepickerOpened(){
  console.log('opened');
  $("body").css("overflow-x", "visible");
  }
  
  mliteDatepickerClosed(){
       setTimeout(()=>{  
         $("body").css("overflow-x", "hidden");
        }, 100);
   
  }
  
  updatetraveller() {
    var adultcount = (this.adult_cnt);
    var childcount = (this.child_cnt);
    var infantcount = (this.infant_cnt);
    var mFlightClass = this.flightClass;
    var classtype;
    if (mFlightClass == 'E') {
        classtype = "Economy";
    } else if (mFlightClass == 'B') {
        classtype = "Business";
    } else if (mFlightClass == 'F') {
        classtype = "First";
    } else if (mFlightClass == 'P') {
        classtype = "Premium Economy";
    } else {
        classtype = "Economy";
    }
    var travellerCount = adultcount + childcount + infantcount;
    
    if (travellerCount > 1) {
      this.travelInputText=travellerCount + " Travellers" ;
    } else if (travellerCount == 1) {
     this.travelInputText=travellerCount + " Adult";
    }
   
}
  
  
  flightPassengerError;
  check_traveller_count_message(type) {
   var adultCount = (this.adult_cnt);
    var childCount = (this.child_cnt);
    var infantCount = (this.infant_cnt);
    if (type == 1) { //adult and child
        if ((adultCount + childCount + infantCount) >= 9) {
            this.flightPassengerError='Maximum 9 passenger is allowed for flight search.';
        }
    } else {
        if (((adultCount + childCount + infantCount) >= 9) || (adultCount >= 9)) {
            this.flightPassengerError='Maximum 9 passenger is allowed for flight search.';
        } else {
            if ((infantCount >= adultCount)) {
              this.flightPassengerError='Number of Infants cannot exceed the number of Adults.';
            }
        }
    }

}

check_traveller_count(type) {
    var adultCount = (this.adult_cnt);
    var childCount = (this.child_cnt);
    var infantCount = (this.infant_cnt);
    if (type == 1) { //adult and child
        if ((adultCount + childCount + infantCount) >= 9) {
            return false;
        }
        return true;
    } else {
        if ((adultCount + childCount + infantCount) >= 9) {
            return false;
        } else {
            if ((infantCount >= adultCount)) {
                return false;
            }
        }
        return true;
    }
}

  syncData(){
         var lastBusSearch; var lastTrainSearch; var lastFlightSearch; var lastHotelSearch;
        var month = ("0"+(this.today.getMonth()+1)).slice(-2);
        var day = ("0"+this.today.getDate()).slice(-2);
        var date1 = new Date(this.today.getFullYear()+'-'+month+'-'+day).getTime();
         var datePipe =new DatePipe('en-US'); 
         
         
          //Flights
        lastFlightSearch=localStorage.getItem('flightLastSearch');
       const lastFlightSearchValue=JSON.parse(lastFlightSearch);
        if(lastFlightSearchValue){
        this.flightFromText=lastFlightSearchValue.flightFromText;
        this.flightToText=lastFlightSearchValue.flightToText;
        this.flightFrom=lastFlightSearchValue.searchFrom;
        this.flightTo=lastFlightSearchValue.searchTo;
        this.fromFlightCode=lastFlightSearchValue.fromTravelCode;
        this.toFlightCode=lastFlightSearchValue.toTravelCode;
        this.flightClass=lastFlightSearchValue.flightClass;
        this.flightTripType=lastFlightSearchValue.flightTripType;
        this.adult_cnt=parseInt(lastFlightSearchValue.adult_cnt);
        this.child_cnt=parseInt(lastFlightSearchValue.child_cnt);
        this.infant_cnt=parseInt(lastFlightSearchValue.infant_cnt);
        this.adult_label=parseInt(lastFlightSearchValue.adult_cnt);
        this.child_label=parseInt(lastFlightSearchValue.child_cnt);
        this.infant_label=parseInt(lastFlightSearchValue.infant_cnt);
        
        this.selectTripType(this.flightTripType);
        this.selectClass(this.flightClass);
         
        this.searchFlightForm['controls']['flightFrom'].setValue(lastFlightSearchValue.searchFrom);
        this.searchFlightForm['controls']['flightTo'].setValue(lastFlightSearchValue.searchTo);
        this.searchFlightForm['controls']['fromFlightCode'].setValue(lastFlightSearchValue.fromTravelCode);
        this.searchFlightForm['controls']['toFlightCode'].setValue(lastFlightSearchValue.toTravelCode);
        this.searchFlightForm['controls']['flightClass'].setValue(lastFlightSearchValue.flightClass);
        this.searchFlightForm['controls']['flightTripType'].setValue(lastFlightSearchValue.flightTripType);
   
       var date4 = new Date(lastFlightSearchValue.departure).getTime();
       
       if(date1 <= date4){
            this.flightpickerDefaultFMlite=new Date(datePipe.transform(lastFlightSearchValue.departure, 'dd MMM yyyy', 'en-ES'));
        this.searchFlightForm['controls']['flightDeparture'].setValue(datePipe.transform(lastFlightSearchValue.departure, 'dd MMM yyyy', 'en-ES'));
        this.minDateFlightToMlite=new Date(datePipe.transform(lastFlightSearchValue.departure, 'dd MMM yyyy', 'en-ES'));
         this.flightDeparture=this.flightpickerDefaultFMlite;
       }
       
       if(lastFlightSearchValue.rdeparture){
       var date5 = new Date(lastFlightSearchValue.rdeparture).getTime();
       
        if(date1 <= date5){
        this.flightpickerDefaultTMlite=new Date(datePipe.transform(lastFlightSearchValue.rdeparture, 'dd MMM yyyy', 'en-ES'));
        this.searchFlightForm['controls']['flightReturn'].setValue(datePipe.transform(lastFlightSearchValue.rdeparture, 'dd MMM yyyy', 'en-ES'));
         this.flightReturn=new Date(datePipe.transform(lastFlightSearchValue.rdeparture, 'dd MMM yyyy', 'en-ES'));
        }
        
        }
        }else{
        this.flightFromText='DEL, Indira Gandhi Airport';
        this.flightToText='BOM, Chatrapati Shivaji Airport';
        this.flightFrom='New Delhi';
        this.flightTo='Mumbai';
        this.fromFlightCode='DEL';
        this.toFlightCode='BOM';
        this.searchFlightForm['controls']['flightFrom'].setValue('New Delhi');
        this.searchFlightForm['controls']['flightTo'].setValue('Mumbai');
        this.searchFlightForm['controls']['fromFlightCode'].setValue('DEL');
        this.searchFlightForm['controls']['toFlightCode'].setValue('BOM');
        
        }  
        
        
           //Hotels
        lastHotelSearch=localStorage.getItem('hotelLastSearch');
       const lastHotelSearchValue=JSON.parse(lastHotelSearch);
       
        if(lastHotelSearchValue){
        this.hotelFromText=lastHotelSearchValue.hotelName;
        this.hotelName=lastHotelSearchValue.hotelName;
        this.hotelId=lastHotelSearchValue.hotelId;
        this.countryId=lastHotelSearchValue.countryId;
        this.roomCount=parseInt(lastHotelSearchValue.roomCount);
                this.searchHotelForm['controls']['hotelName'].setValue(lastHotelSearchValue.hotelName);
        this.searchHotelForm['controls']['hotelId'].setValue(lastHotelSearchValue.hotelId);
        this.searchHotelForm['controls']['countryId'].setValue(lastHotelSearchValue.countryId);
        this.searchHotelForm['controls']['roomCount'].setValue(lastHotelSearchValue.roomCount);
        
        const jsStartDate = new Date(lastHotelSearchValue.hotelCheckin);
        const jsEndDate = new Date(lastHotelSearchValue.hotelCheckout);
        const stoday = new NgbDate(jsStartDate.getFullYear(), jsStartDate.getMonth() + 1, jsStartDate.getDate());
        const etoday = new NgbDate(jsEndDate.getFullYear(), jsEndDate.getMonth() + 1, jsEndDate.getDate());


        var date8 = new Date(lastHotelSearchValue.hotelCheckin).getTime();
        if(date1 <= date8){
   
        this.hotelpickerDefaultFMlite=new Date(datePipe.transform(lastHotelSearchValue.hotelCheckin, 'dd MMM yyyy', 'en-ES'));
        this.hotelpickerDefaultTMlite=new Date(datePipe.transform(lastHotelSearchValue.hotelCheckout, 'dd MMM yyyy', 'en-ES'));
        this.searchHotelForm['controls']['hotelCheckin'].setValue(datePipe.transform(lastHotelSearchValue.hotelCheckin, 'dd MMM yyyy', 'en-ES'));
         this.searchHotelForm['controls']['hotelCheckout'].setValue(datePipe.transform(lastHotelSearchValue.hotelCheckout, 'dd MMM yyyy', 'en-ES'));
         
         
        this.hotelCheckin = this.hotelpickerDefaultFMlite;
        this.hotelCheckout =  this.hotelpickerDefaultTMlite;
         
        }

        let localRooms=JSON.parse(lastHotelSearchValue.room);
        
           const controlArray = <FormArray> this.searchHotelForm.get('rooms');
           for (let room = 0; room < localRooms.length; room++) {
              this.hotelRooms.push(this.formBuilder.group({
                hotel_adult: [localRooms[room]['hotel_adult'], Validators.required],
                hotel_child: [localRooms[room]['hotel_child'], [Validators.required]],
                child_age: new FormArray([])
              }));
              
              
                let childAgeArray=localRooms[room]['child_age'];
               
                 if (childAgeArray.length >0) {
                var updatedChildValue=controlArray.controls[room].get('hotel_child').value;
                this.hotelRoomsChildAge= <FormArray> controlArray.controls[room].get('child_age')
                    for (let i = 0; i < childAgeArray.length; i++) {
                    
                       this.hotelRoomsChildAge.push(this.formBuilder.group({
                            age: [localRooms[room]['child_age'][i]['age'], Validators.required],
                        }));
                    }
             }
            }
         this.hoteltraveller();
        
        var date6 = new Date(lastHotelSearchValue.hotelCheckin).getTime();
        
        } else{
        
         this.hotelFromText='New Delhi,India';
        this.hotelName='New Delhi,India';
        this.hotelId='New Delhi';
        this.countryId='IN';
        this.roomCount=1;
                this.searchHotelForm['controls']['hotelName'].setValue('New Delhi,India');
        this.searchHotelForm['controls']['hotelId'].setValue('New Delhi');
        this.searchHotelForm['controls']['countryId'].setValue('IN');
        this.searchHotelForm['controls']['roomCount'].setValue(1);
        this.roomOperation('add');
        
        }
        
        
         
        //Bus
        lastBusSearch=localStorage.getItem('busLastSearch');
       const lastBusSearchValue=JSON.parse(lastBusSearch);
        if(lastBusSearchValue){
         this.busFromText=lastBusSearchValue.searchFrom;
         this.busToText=lastBusSearchValue.searchTo;
        this.busFrom=lastBusSearchValue.searchFrom;
        this.busTo=lastBusSearchValue.searchTo;
        this.fromBusCode=lastBusSearchValue.fromTravelCode;
        this.toBusCode=lastBusSearchValue.toTravelCode;
         
        this.searchBusForm['controls']['busFrom'].setValue(lastBusSearchValue.searchFrom);
        this.searchBusForm['controls']['busTo'].setValue(lastBusSearchValue.searchTo);
        this.searchBusForm['controls']['fromBusCode'].setValue(lastBusSearchValue.fromTravelCode);
        this.searchBusForm['controls']['toBusCode'].setValue(lastBusSearchValue.toTravelCode);
   
       var date2 = new Date(lastBusSearchValue.departure).getTime();

        if(date1 <= date2){
        
   
        this.buspickerDefaultMlite=new Date(datePipe.transform(lastBusSearchValue.departure, 'dd MMM yyyy', 'en-ES'));
        this.searchBusForm['controls']['busDeparture'].setValue(datePipe.transform(lastBusSearchValue.departure, 'dd MMM yyyy', 'en-ES'));
         this.busDeparture=new Date(datePipe.transform(lastBusSearchValue.departure, 'dd MMM yyyy', 'en-ES'));

          }
        }  else{
        this.busFromText='Delhi';
         this.busToText='Mumbai';
        this.busFrom='Delhi';
        this.busTo='Mumbai';
        this.fromBusCode=1492;
        this.toBusCode=649;
         
        this.searchBusForm['controls']['busFrom'].setValue('Delhi');
        this.searchBusForm['controls']['busTo'].setValue('Mumbai');
        this.searchBusForm['controls']['fromBusCode'].setValue(1492);
        this.searchBusForm['controls']['toBusCode'].setValue(649);
        }
        //Train
         lastTrainSearch=localStorage.getItem('trainLastSearch');
        const lastTrainSearchValue=JSON.parse(lastTrainSearch);
        if(lastTrainSearchValue){
       
        this.trainFromText=lastTrainSearchValue.fromTravelCode+', '+lastTrainSearchValue.searchFrom;
        this.trainToText=lastTrainSearchValue.toTravelCode+', '+lastTrainSearchValue.searchTo;
        this.trainFrom=lastTrainSearchValue.searchFrom;
        this.trainTo=lastTrainSearchValue.searchTo;
        this.fromTrainCode=lastTrainSearchValue.fromTravelCode;
        this.toTrainCode=lastTrainSearchValue.toTravelCode;
         
        this.searchTrainForm['controls']['trainFrom'].setValue(lastTrainSearchValue.searchFrom);
        this.searchTrainForm['controls']['trainTo'].setValue(lastTrainSearchValue.searchTo);
        this.searchTrainForm['controls']['fromTrainCode'].setValue(lastTrainSearchValue.fromTravelCode);
        this.searchTrainForm['controls']['toTrainCode'].setValue(lastTrainSearchValue.toTravelCode);
        
        if(lastTrainSearchValue.trainQuota){
        this.searchTrainForm['controls']['trainQuota'].setValue(lastTrainSearchValue.trainQuota);
        
        this.selectedQuota=lastTrainSearchValue.trainQuota;
        this.quota = this.selectedQuota;
        }else{
             this.searchTrainForm['controls']['trainQuota'].setValue('GN');
        
        this.selectedQuota='GN';
        this.quota = this.selectedQuota;
        
        }
        
        var date3 = new Date(lastTrainSearchValue.departure).getTime();
        if(date1 <= date3){
    
        this.trainpickerDefaultMlite=new Date(datePipe.transform(lastTrainSearchValue.departure, 'dd MMM yyyy', 'en-ES'));
        this.searchTrainForm['controls']['trainDeparture'].setValue(datePipe.transform(lastTrainSearchValue.departure, 'dd MMM yyyy', 'en-ES'));
        this.trainDeparture=new Date(datePipe.transform(lastTrainSearchValue.departure, 'dd MMM yyyy', 'en-ES'));
        
          }
        } else{
                this.trainFromText='NDLS, NEW DELHI';
        this.trainToText='MMCT, MUMBAI CENTRAL';
        this.trainFrom='NEW DELHI';
        this.trainTo='MUMBAI CENTRAL';
        this.fromTrainCode='NDLS';
        this.toTrainCode='MMCT';
        
           this.selectedQuota='GN';
        this.quota = this.selectedQuota;
         
        this.searchTrainForm['controls']['trainFrom'].setValue('NEW DELHI');
        this.searchTrainForm['controls']['trainTo'].setValue('MUMBAI CENTRAL');
        this.searchTrainForm['controls']['fromTrainCode'].setValue('NDLS');
        this.searchTrainForm['controls']['toTrainCode'].setValue('MMCT');
         this.searchTrainForm['controls']['trainQuota'].setValue('GN');
        
        }
         
       
         this.updatetraveller();  
          
  }	
	
    
        showBlockno = 0;
        showBlock(blockno){
        this.showBlockno=blockno;
        }
  
   setPickerDate(date,service): NgbDateStruct {
        let cuurdate  = date;
        let dateParts1 = cuurdate.split('-');
        let currentdate=dateParts1[0]+"/"+dateParts1[1]+"/"+dateParts1[2];
        let currentstamp = new Date(currentdate).getTime();

        if(service == 'train'){
        let todaydate = new Date();
        let getmaxmonthirctc = new Date(todaydate.setDate(todaydate.getDate() + 124));
        let finaltodayirctc = new Date(getmaxmonthirctc).getTime();
        if(currentstamp > finaltodayirctc){
        this.traindialog();
        }
        }
        if(service=='bus'){
        let todaydate = new Date();
        let getmaxmonthredbus = new Date(todaydate.setDate(todaydate.getDate() + 90));
        let finaltodayredbus = new Date(getmaxmonthredbus).getTime();
        if(currentstamp > finaltodayredbus){
        this.redbusdialog();
        }
        }
        let dateParts = date.split('-');
        return this.formatter.parse(dateParts[0] + "-" + dateParts[1] + "-" + dateParts[2]);
 }
        redbusdialog(){
        const errmsg = [];
        errmsg.push('As per Redbus, you can book for a travel date only 90 days in advance.');
        const message = errmsg;
        let dialogRef = this.dialog.open(ConfirmationDialog, {
        disableClose:true,
        width: '560px',
        data: {messageData: message}
        });
        }
        openDialog(){
        const errmsg = [];
        errmsg.push('IRCTC is down from 11:30PM to 1:00AM for system maintance');
        const message = errmsg;
        let dialogRef = this.dialog.open(ConfirmationDialog, {
        disableClose:true,
        width: '560px',
        data: {messageData: message}
        });
        }
        traindialog(){
        const errmsg = [];
        errmsg.push('As per IRCTC rules, you can book for a travel date only 120 days in advance.');
        const message = errmsg;
        let dialogRef = this.dialog.open(ConfirmationDialog, {
        disableClose:true,
        width: '560px',
        data: {messageData: message}
        });

}
  switchFlightRoutes(){
        var tempSearchFrom= this.searchFlightForm.controls.flightFrom.value;
	var tempFromSearchCode= this.searchFlightForm.controls.fromFlightCode.value;
	var tempSearchTo= this.searchFlightForm.controls.flightTo.value;
	var tempToSearchCode= this.searchFlightForm.controls.toFlightCode.value;
	
	var tempSearchFromText= this.flightFromText;
	var tempSearchToText= this.flightToText;
	
	this.searchFlightForm['controls']['flightTo'].setValue(tempSearchFrom);
	this.searchFlightForm['controls']['toFlightCode'].setValue(tempFromSearchCode);
	this.searchFlightForm['controls']['flightFrom'].setValue(tempSearchTo);
	this.searchFlightForm['controls']['fromFlightCode'].setValue(tempToSearchCode);
	
		
	this.flightFromText= tempSearchToText;
	this.flightToText= tempSearchFromText;
  }
  
    switchBusRoutes(){
        var tempSearchFrom= this.searchBusForm.controls.busFrom.value;
	var tempFromSearchCode= this.searchBusForm.controls.fromBusCode.value;
	var tempSearchTo= this.searchBusForm.controls.busTo.value;
	var tempToSearchCode= this.searchBusForm.controls.toBusCode.value;
	
	var tempSearchFromText= this.busFromText;
	var tempSearchToText= this.busToText;
	
	this.searchBusForm['controls']['busTo'].setValue(tempSearchFrom);
	this.searchBusForm['controls']['toBusCode'].setValue(tempFromSearchCode);
	this.searchBusForm['controls']['busFrom'].setValue(tempSearchTo);
	this.searchBusForm['controls']['fromBusCode'].setValue(tempToSearchCode);
	
		
	this.busFromText= tempSearchToText;
	this.busToText= tempSearchFromText;
  }
  
  
    switchTrainRoutes(){
        var tempSearchFrom= this.searchTrainForm.controls.trainFrom.value;
	var tempFromSearchCode= this.searchTrainForm.controls.fromTrainCode.value;
	var tempSearchTo= this.searchTrainForm.controls.trainTo.value;
	var tempToSearchCode= this.searchTrainForm.controls.toTrainCode.value;
	
	var tempSearchFromText= this.trainFromText;
	var tempSearchToText= this.trainToText;
	
	this.searchTrainForm['controls']['trainTo'].setValue(tempSearchFrom);
	this.searchTrainForm['controls']['toTrainCode'].setValue(tempFromSearchCode);
	this.searchTrainForm['controls']['trainFrom'].setValue(tempSearchTo);
	this.searchTrainForm['controls']['fromTrainCode'].setValue(tempToSearchCode);
	
		
	this.trainFromText= tempSearchToText;
	this.trainToText= tempSearchFromText;
  }
  
  
  
  displayTravel(type){
    if(type==1)
    this.showFlightPassenger = true;
    else
    this.showHotelPassenger = true;
  }
  
  closeTavelPopup(){
    this.showFlightPassenger = false;
    this.showHotelPassenger = false;
  }
  
  
    displayTravelM(type){
      $( ".bottom-sheet-TravelerContainer" ).addClass( "bottom-sheet-TravelerContainer-Full" );
    if(type==1)
    this.showFlightPassenger =true;
    else
    this.showHotelPassenger = true;
   }
   
  onSubmitTrain(service,type){
   
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
        
        dialogRef.afterClosed().subscribe(result => {
        this.onSubmit(service,type);
        });
        
      }else{
      this.onSubmit(service,type);
      }
        
  
  } 
   
  
  onSubmit(service,type) {
        var xss = require("xss");
       var cookieArray=[]; var datePipe =new DatePipe('en-US');   var uDate; var uDateR; var cDate;var cDateR;var cookieDate;
       
        switch(service) { 
        case 'flights': { 
         this.submittedFlight = true;
        if(this.searchFlightForm.controls.fromFlightCode.value==""||this.searchFlightForm.controls.fromFlightCode.value==null)
        {
        this.searchFlightForm['controls']['flightFrom'].setValue('');
        }
        if(this.searchFlightForm.controls.toFlightCode.value==""||this.searchFlightForm.controls.toFlightCode.value==null)
        {
        this.searchFlightForm['controls']['flightTo'].setValue('');	
        }

        if(this.searchFlightForm.controls.fromFlightCode.value==this.searchFlightForm.controls.toFlightCode.value){
        this.validateMessageFlight=true;
        return;
        }else{
        this.validateMessageFlight=false;
        }
        this.showFlightPassenger =false;
        if (this.searchFlightForm.invalid) { 
        return;
        }
        
        
        let myDate =this.searchFlightForm.value.flightDeparture;
        uDate=datePipe.transform(myDate, 'yyyy-MM-dd', 'en-ES');
        cDate=datePipe.transform(myDate, 'dd LLL yyy', 'en-ES');
        
        if(this.searchFlightForm.controls.flightReturn.value!='' && this.searchFlightForm.controls.flightReturn.value!=null){
       let myDate1 =this.searchFlightForm.value.flightReturn;
        uDateR=datePipe.transform(myDate1, 'yyyy-MM-dd', 'en-ES');
        cDateR=datePipe.transform(myDate1, 'dd LLL yyy', 'en-ES');
        }else{
        uDateR='';
        cDateR='';
        }

        
        this.searchArray = {
        searchFrom:xss(this.searchFlightForm.controls.flightFrom.value),
        searchTo:xss(this.searchFlightForm.controls.flightTo.value),
        fromTravelCode:xss(this.searchFlightForm.controls.fromFlightCode.value),
        toTravelCode:xss(this.searchFlightForm.controls.toFlightCode.value),
        departure:xss(uDate),
        cdeparture:xss(cDate),
        rdeparture:xss(uDateR),
        crdeparture:xss(cDateR),
        flightClass:xss(this.searchFlightForm.controls.flightClass.value),
        flightTripType:xss(this.searchFlightForm.controls.flightTripType.value),
        adult_cnt:xss(this.adult_cnt),
        child_cnt:xss(""+this.child_cnt+""),
        infant_cnt:xss(""+this.infant_cnt+""),
        flightFromText:xss(""+this.flightFromText+""),
        flightToText:xss(""+this.flightToText+"")
        };
        
        localStorage.setItem('flightLastSearch', JSON.stringify(this.searchArray));


        // Only for Recent Search

        var search_values_setCookie = [];
        
        search_values_setCookie.push({
          flightfrom:xss(this.searchFlightForm.controls.flightFrom.value).split(' ').join('-'),
          flightto:xss(this.searchFlightForm.controls.flightTo.value).split(' ').join('-'),
          fcode:xss(this.searchFlightForm.controls.fromFlightCode.value),
          tcode:xss(this.searchFlightForm.controls.toFlightCode.value),
          flightdeparture:xss(uDate),
          cdeparture:xss(cDate),
          flightreturn:xss(uDateR),
          crdeparture:xss(cDateR),
          class:xss(this.searchFlightForm.controls.flightClass.value),
          Default:xss(this.searchFlightForm.controls.flightTripType.value),
          adults:xss(this.adult_cnt),
          child:xss(""+this.child_cnt+""),
          infants:xss(""+this.infant_cnt+""),
          t:xss("ZWFybg==")
        });
        
        
        
        if (localStorage.getItem("FlightRecentSearch") != null) {
        var FlightRecentSearch = JSON.parse(window.atob(localStorage.getItem("FlightRecentSearch")));
        for (let cok = 0; cok < FlightRecentSearch.length; cok++) {
             if (FlightRecentSearch[cok]['flightfrom'] == FlightRecentSearch[0].flightfrom && FlightRecentSearch[cok]['flightto'] == FlightRecentSearch[0].flightto && FlightRecentSearch[cok]['flightdeparture'] == FlightRecentSearch[0].flightdeparture && FlightRecentSearch[cok]['class'] == FlightRecentSearch[0].class && FlightRecentSearch[cok]['Default'] == FlightRecentSearch[0].Default) {
                FlightRecentSearch.splice(cok, 1);
            }
     
        }
          search_values_setCookie= FlightRecentSearch.concat(search_values_setCookie)
           if (search_values_setCookie.length >= 3) {
        search_values_setCookie=search_values_setCookie.reverse().slice(0,3).reverse();
        }
        }
        
        
        
        localStorage.setItem('FlightRecentSearch', btoa(JSON.stringify(search_values_setCookie)));
        // Recent Search Ends Here
        
        if(environment.IS_MAIN==1){
        const current = new Date();
        this.redirectPopupTriggerTimestamp=current.getTime();
        this.redirectPopupTrigger=1;
        this.redirectPopup=2;
        this.redirectPopupUrl=environment.MAIN_SITE_URL+'flights/searching?class='+this.flightClass+'&Default='+this.flightTripType+'&flightfrom='+this.searchFlightForm.controls.flightFrom.value+'('+this.searchFlightForm.controls.fromFlightCode.value+')&fcode='+this.searchFlightForm.controls.fromFlightCode.value+'&flightto='+this.searchFlightForm.controls.flightTo.value+' ('+this.searchFlightForm.controls.toFlightCode.value+')&tcode='+this.searchFlightForm.controls.toFlightCode.value+'&flightdeparture='+cDate+'&flightreturn='+cDateR+'&adults='+this.adult_cnt+'&child='+this.child_cnt+'&infants='+this.infant_cnt+'&t=ZWFybg==';
        return;
        }
        
       
       if(this.serviceSettings.flightSearch==1){
       this.router.navigate([this.sg['domainPath']+'flights/listing'], { queryParams: this.searchArray  });
       }else{
   this.document.location.href =environment.MAIN_SITE_URL+'flights/searching?class='+this.flightClass+'&Default='+this.flightTripType+'&flightfrom='+this.searchFlightForm.controls.flightFrom.value+'('+this.searchFlightForm.controls.fromFlightCode.value+')&fcode='+this.searchFlightForm.controls.fromFlightCode.value+'&flightto='+this.searchFlightForm.controls.flightTo.value+' ('+this.searchFlightForm.controls.toFlightCode.value+')&tcode='+this.searchFlightForm.controls.toFlightCode.value+'&flightdeparture='+cDate+'&flightreturn='+cDateR+'&adults='+this.adult_cnt+'&child='+this.child_cnt+'&infants='+this.infant_cnt+'&t=ZWFybg==';
     }
        break; 
        } 
        case 'hotels': { 
        this.submittedHotel = true;
        this.showHotelPassenger = false;
        
        if (this.searchHotelForm.invalid) { 
          if(this.searchHotelForm['controls']['rooms']['status']=="INVALID"){
            this.showHotelPassenger = true;
            this.showHotelPassengerError = true;
       
          }else{
           this.showHotelPassengerError = false;
          } 
        return;
        }
        let myDate =this.searchHotelForm.value.hotelCheckin;
        uDate=datePipe.transform(myDate, 'yyyy-MM-dd', 'en-ES');
        cDate=datePipe.transform(myDate, 'dd LLL yyy', 'en-ES');
        let myDate1 =this.searchHotelForm.value.hotelCheckout;
        uDateR=datePipe.transform(myDate1, 'yyyy-MM-dd', 'en-ES');
        cDateR=datePipe.transform(myDate1, 'dd LLL yyy', 'en-ES');

        let persons=this.searchHotelForm.controls.rooms.value;
        var resultArray = Object.keys(persons).map(function(personNamedIndex){
        let person = persons[personNamedIndex];
        // do something with person
        return person;
        });
        
     
       
       this.searchArray = {
        hotelName:xss(this.searchHotelForm.controls.hotelName.value),
        hotelId:xss(this.searchHotelForm.controls.hotelId.value),
        countryId:xss(this.searchHotelForm.controls.countryId.value),
        hotelCheckin:xss(uDate),
        chotelCheckin:xss(cDate),
        hotelCheckout:xss(uDateR),
        chotelCheckout:xss(cDateR),
        roomCount:xss(this.searchHotelForm.controls.roomCount.value),
        room:xss((JSON.stringify(resultArray)))
        };
        localStorage.setItem('hotelLastSearch', JSON.stringify(this.searchArray));


       // Only for Recent Search
        var search_values_setCookieHotel = []; var search_values_setCookieHotel_temp = {};
        search_values_setCookieHotel_temp['cityname']=xss(this.searchHotelForm.controls.hotelName.value);
        search_values_setCookieHotel_temp['city_id']=xss(this.searchHotelForm.controls.hotelId.value);
        search_values_setCookieHotel_temp['country']=xss(this.searchHotelForm.controls.countryId.value);
        search_values_setCookieHotel_temp['checkin']=xss(uDate);
        search_values_setCookieHotel_temp['checkout']=xss(cDate);
        search_values_setCookieHotel_temp['hotelCheckout']=xss(uDateR);
        search_values_setCookieHotel_temp['chotelCheckout']=xss(cDateR);
        search_values_setCookieHotel_temp['num_rooms']=xss(this.searchHotelForm.controls.roomCount.value);

         for (let a = 0; a < this.searchHotelForm.controls.roomCount.value; a++) {
         search_values_setCookieHotel_temp['numberOfAdults'+(a+1)]=resultArray[a]['hotel_adult'];
         search_values_setCookieHotel_temp['numberOfChildren'+(a+1)]=resultArray[a]['hotel_child'];
         
         for (let c = 0; c < resultArray[a]['child_age'].length; c++) {
          search_values_setCookieHotel_temp['room'+(a+1)+'Child'+(c+1)]=resultArray[a]['child_age'][c]['age'];
         }
         }
        
        search_values_setCookieHotel_temp['t']=xss("ZWFybg==");
        
        search_values_setCookieHotel.push(search_values_setCookieHotel_temp);
        
        

        if (localStorage.getItem("HotelRecentSearch") != null) {
        var HotelRecentSearchResult = JSON.parse(window.atob(localStorage.getItem("HotelRecentSearch")));


        for (let cok = 0; cok < HotelRecentSearchResult.length; cok++) {
        if (HotelRecentSearchResult[cok]['city_id'] == search_values_setCookieHotel[0].city_id && HotelRecentSearchResult[cok]['checkin'] == search_values_setCookieHotel[0].checkin && HotelRecentSearchResult[cok]['checkout'] == search_values_setCookieHotel[0].checkout) {
        HotelRecentSearchResult.splice(cok, 1);
        }
        }
        search_values_setCookieHotel= HotelRecentSearchResult.concat(search_values_setCookieHotel)

        if (search_values_setCookieHotel.length >= 3) {
        search_values_setCookieHotel=search_values_setCookieHotel.reverse().slice(0,3).reverse();
        }
        }
        
        localStorage.setItem('HotelRecentSearch', btoa(JSON.stringify(search_values_setCookieHotel)));
// Recent search ends
        
        let queryParam:string='';  var j=1
        $.each(this.searchHotelForm.controls.rooms.value, function(index,jsonObject){
        queryParam+='numberOfAdults'+j+'='+(jsonObject['hotel_adult'])+'&numberOfChildren'+j+'='+(jsonObject['hotel_child'])+'&';
        
       if(jsonObject['child_age'].length > 0){
         for (let k = 0; k < jsonObject['child_age'].length; k++) {
         queryParam+='room'+j+'Child'+(k+1)+'='+jsonObject['child_age'][k]['age']+'&';
         }
        }
        j++;
        });
        
        
               if(environment.IS_MAIN==1){
        const current = new Date();
        this.redirectPopupTriggerTimestamp=current.getTime();
        this.redirectPopupTrigger=1;
        this.redirectPopup=2;
        this.redirectPopupUrl=environment.MAIN_SITE_URL+'Hotels_lists?cityname='+this.searchArray.hotelName+'&city_id='+this.searchArray.hotelId+'&country='+this.searchArray.countryId+'&hotel_name=&lattitude=&longitude=&hotel_id=&area=&label_name=&checkin='+cDate+'&checkout='+cDateR+'&num_rooms='+this.searchArray.roomCount+'&'+queryParam+'t=ZWFybg==&hotel_search_done=1&hotel_modify=0';
         return;
        }

 this.document.location.href =environment.MAIN_SITE_URL+'Hotels_lists?cityname='+this.searchArray.hotelName+'&city_id='+this.searchArray.hotelId+'&country='+this.searchArray.countryId+'&hotel_name=&lattitude=&longitude=&hotel_id=&area=&label_name=&checkin='+cDate+'&checkout='+cDateR+'&num_rooms='+this.searchArray.roomCount+'&'+queryParam+'t=ZWFybg==&hotel_search_done=1&hotel_modify=0';
       //  console.log(JSON.stringify(this.searchHotelForm.value, null, 4));
        
        break; 
        } 
        case 'bus' : {
        this.submittedBus = true;
         
        if(this.searchBusForm.controls.fromBusCode.value==""||this.searchBusForm.controls.fromBusCode.value==null)
        {
        this.searchBusForm['controls']['busFrom'].setValue('');
        }
        if(this.searchBusForm.controls.toBusCode.value==""||this.searchBusForm.controls.toBusCode.value==null)
        {
        this.searchBusForm['controls']['busTo'].setValue('');	
        }

        if(this.searchBusForm.controls.fromBusCode.value==this.searchBusForm.controls.toBusCode.value){
        this.validateMessageBus=true;
        return;
        }else{
        this.validateMessageBus=false;
        }
         
        if (this.searchBusForm.invalid) { 
        return;
        }
        
        let myDate =this.searchBusForm.value.busDeparture;
        uDate=datePipe.transform(myDate, 'yyyy-MM-dd', 'en-ES');
        cDate=datePipe.transform(myDate, 'dd LLL yyy', 'en-ES');
        cookieDate=datePipe.transform(myDate, 'ddMMyyyy', 'en-ES');

        this.searchArray = {
        searchFrom:xss(this.searchBusForm.controls.busFrom.value),
        searchTo:xss(this.searchBusForm.controls.busTo.value),
        fromTravelCode:xss(this.searchBusForm.controls.fromBusCode.value),
        toTravelCode:xss(this.searchBusForm.controls.toBusCode.value),
        departure:xss(uDate),
        cdeparture:xss(cDate),
        };
        this.expiredDate.setDate( this.expiredDate.getDate() + 30 );
        var searchKey=this.searchArray.fromTravelCode+this.searchArray.toTravelCode+cookieDate;
        const cookieExists: boolean = this.cookieService.check('busSearchN');
        if(cookieExists){       
        var getValue= JSON.parse(this.cookieService.get( 'busSearchN'));
        cookieArray = getValue.filter(a => { return  a['cookieKey'] != searchKey;     });
        if(cookieArray.length > 2)
        cookieArray.shift();
        cookieArray.push({cookieKey:searchKey,cookieValue : this.searchArray});
        }else{
         cookieArray.push({cookieKey:searchKey,cookieValue : this.searchArray});
        }
        localStorage.setItem('busLastSearch', JSON.stringify(this.searchArray));
        
        this.cookieService.delete('busSearchN');
        if(this.serviceSettings.COOKIE_CONSENT_ENABLED){
        const cookieExistsConsent: boolean = this.cookieService.check(this.serviceSettings.cookieName);
        if(cookieExistsConsent){  
        var coval= this.cookieService.get(this.serviceSettings.cookieName);
        if(coval=='1')
        this.cookieService.set( 'busSearchN', JSON.stringify(cookieArray),  this.expiredDate,'/','',true,'Strict'); 
        }
        }else{
         this.cookieService.set( 'busSearchN', JSON.stringify(cookieArray),  this.expiredDate,'/','',true,'Strict');
        }
          $(".close-bottomsheet").trigger( "click" ); 
        
        delete this.searchArray["cdeparture"];
        
                       if(environment.IS_MAIN==1){
        const current = new Date();
        this.redirectPopupTriggerTimestamp=current.getTime();
        this.redirectPopupTrigger=1;
        this.redirectPopup=2;
        this.redirectPopupUrl=environment.ANGULAR_SITE_URL+'bus/search?searchFrom='+this.searchArray['searchFrom']+'&searchTo='+this.searchArray['searchTo']+'&fromTravelCode='+this.searchArray['fromTravelCode']+'&toTravelCode='+this.searchArray['toTravelCode']+'&departure'+this.searchArray['departure'];
        return;
        }
         this.document.location.href =environment.ANGULAR_SITE_URL+'bus/search?searchFrom='+this.searchArray['searchFrom']+'&searchTo='+this.searchArray['searchTo']+'&fromTravelCode='+this.searchArray['fromTravelCode']+'&toTravelCode='+this.searchArray['toTravelCode']+'&departure'+this.searchArray['departure'];
        
        
        break; 
        } 
        case 'train': { 
        this.submittedTrain = true;
        if(this.searchTrainForm.controls.fromTrainCode.value==""||this.searchTrainForm.controls.fromTrainCode.value==null)
        {
        this.searchTrainForm['controls']['trainFrom'].setValue('');
        }
        if(this.searchTrainForm.controls.toTrainCode.value==""||this.searchTrainForm.controls.toTrainCode.value==null)
        {
        this.searchTrainForm['controls']['trainTo'].setValue('');	
        }
        
        
        if (this.searchTrainForm.invalid) { 
        return;
        }

        if(this.searchTrainForm.controls.fromTrainCode.value==this.searchTrainForm.controls.toTrainCode.value){
        this.validateMessageTrain=true;
        return;
        }else{
        this.validateMessageTrain=false;
        }
        

        let myDate =this.searchTrainForm.value.trainDeparture;
        uDate=datePipe.transform(myDate, 'yyyy-MM-dd', 'en-ES');
        cDate=datePipe.transform(myDate, 'dd LLL yyy', 'en-ES');
        cookieDate=datePipe.transform(myDate, 'ddMMyyyy', 'en-ES');

        

        this.searchArray = {
        searchFrom:xss(this.searchTrainForm.controls.trainFrom.value).split(' ').join('-'),
        searchTo:xss(this.searchTrainForm.controls.trainTo.value).split(' ').join('-'),
        fromTravelCode:xss(this.searchTrainForm.controls.fromTrainCode.value),
        toTravelCode:xss(this.searchTrainForm.controls.toTrainCode.value),
        departure:xss(uDate),
        cdeparture:xss(cDate),
        trainQuota:xss(this.searchTrainForm.controls.trainQuota.value),
        };
        this.expiredDate.setDate( this.expiredDate.getDate() + 30 );
        var searchKey=this.searchArray.fromTravelCode+this.searchArray.toTravelCode+cookieDate;
        const cookieExists: boolean = this.cookieService.check('irctcSearchN');
        if(cookieExists){       
        var getValue= JSON.parse(this.cookieService.get( 'irctcSearchN'));
        cookieArray = getValue.filter(a => { return  a['cookieKey'] != searchKey;     });
        if(cookieArray.length > 2)
        cookieArray.shift();
        cookieArray.push({cookieKey:searchKey,cookieValue : this.searchArray});
        }else{
         cookieArray.push({cookieKey:searchKey,cookieValue : this.searchArray});
        }
        localStorage.setItem('trainLastSearch', JSON.stringify(this.searchArray));
        
        this.cookieService.delete('irctcSearchN');
        if(this.serviceSettings.COOKIE_CONSENT_ENABLED){
        const cookieExistsConsent: boolean = this.cookieService.check(this.serviceSettings.cookieName);
        if(cookieExistsConsent){  
        var coval= this.cookieService.get(this.serviceSettings.cookieName);
        if(coval=='1')
        this.cookieService.set( 'irctcSearchN', JSON.stringify(cookieArray),  this.expiredDate,'/','',true,'Strict'); 
        }
        }else{
         this.cookieService.set( 'irctcSearchN', JSON.stringify(cookieArray),  this.expiredDate,'/','',true,'Strict');
        }
          $(".close-bottomsheet").trigger( "click" ); 
        delete this.searchArray["cdeparture"];
        
        
        if(environment.IS_MAIN==1){
        const current = new Date();
        this.redirectPopupTriggerTimestamp=current.getTime();
        this.redirectPopupTrigger=1;
        this.redirectPopup=2;
        this.redirectPopupUrl=environment.ANGULAR_SITE_URL+'train-list?searchFrom='+this.searchArray['searchFrom']+'&searchTo='+this.searchArray['searchTo']+'&fromTravelCode='+this.searchArray['fromTravelCode']+'&toTravelCode='+this.searchArray['toTravelCode']+'&departure'+this.searchArray['departure'];
        return;
        }
        
         this.document.location.href =environment.ANGULAR_SITE_URL+'train-list?searchFrom='+this.searchArray['searchFrom']+'&searchTo='+this.searchArray['searchTo']+'&fromTravelCode='+this.searchArray['fromTravelCode']+'&toTravelCode='+this.searchArray['toTravelCode']+'&departure'+this.searchArray['departure'];
        
     
       
        break; 
        } 
    } 
}


  
  
hideShowForms(device,inputVal,service){ 
  $( ".bottom-sheet-TravelerContainer" ).addClass( "bottom-sheet-TravelerContainer-Full" );
switch(service) { 
   case 'flights': { 
        if(inputVal=='flightFrom'){
        this.fromFlightCityList = true;
        this.toFlightCityList = false;
        this.showFlightPassenger =false;
        if(this.searchFlightForm.controls.flightFrom.value=="")
        this.flightFromOptions= this.defaultFlightOptions;
        this.showMliteFlightFromForm = true;
        
        if(device=='mobile'){
        setTimeout(()=>{  
        $(".flightFrom-"+device).val('');
        $(".flightFrom-"+device).select();
        }, 100);
        }else{
        $(".flightFrom-"+device).focus();
        $(".flightFrom-"+device).select();
        }
        
        }  else if(inputVal=='flightTo'){
        this.fromFlightCityList = false;
        this.toFlightCityList = true;
        this.showFlightPassenger =false;
        if(this.searchFlightForm.controls.flightTo.value=="")
        this.flightToOptions= this.defaultFlightOptions;
          this.showMliteFlightToForm = true;
          
        if(device=='mobile'){
        setTimeout(()=>{  
        $(".flightTo-"+device).val('');
        $(".flightTo-"+device).select();  
        }, 100);
        }else{
        $(".flightTo-"+device).focus();
        $(".flightTo-"+device).select();  
        }
          
        }else{
        this.fromFlightCityList = false;
        this.toFlightCityList = false;
        this.showFlightPassenger =false;
        }
   break; 
   } 
  case 'hotels': { 
     if(inputVal=='hotelName'){
         this.hotelCityList = true;
         this.showMliteHotelForm = true;

        if(device=='mobile'){
        setTimeout(()=>{  
        $(".hotelName-"+device).val('');                       
        $(".hotelName-"+device).focus();
        }, 100);
        }else{
        $(".hotelName-"+device).focus();
        $(".hotelName-"+device).select(); 
        }
         
        }    
   if(inputVal=='hotelCheckin'){
    $('#hotelc_pop').trigger('click');
   }
      break; 
   } 
   case 'bus' : {
        if(inputVal=='busFrom'){
        this.fromBusCityList = true;
        this.toBusCityList = false;
        if(this.searchBusForm.controls.busFrom.value=="")
        this.busFromOptions= this.defaultBusOptions;
           this.showMliteBusFromForm = true;
           
        if(device=='mobile'){
        setTimeout(()=>{  
        $(".busFrom-"+device).val('');
        $(".busFrom-"+device).select(); 
        }, 100);
        }else{
        $(".busFrom-"+device).focus();
        $(".busFrom-"+device).select(); 

        }
           
    
        }
        else if(inputVal=='busTo'){
        this.fromBusCityList = false;
        this.toBusCityList = true;
        if(this.searchBusForm.controls.busTo.value=="")
        this.busToOptions= this.defaultBusOptions;
           this.showMliteBusToForm = true;
           
        if(device=='mobile'){
        setTimeout(()=>{  
        $(".busTo-"+device).val('');
        $(".busTo-"+device).select(); 
        }, 100);
        }else{
        $(".busTo-"+device).focus();
        $(".busTo-"+device).select(); 

        }
           
 
        }else{
        this.fromBusCityList = false;
        this.toBusCityList = false;
        }
   
      break; 
   } 
  case 'train': { 
          if(inputVal=='trainFrom'){
        this.fromTrainCityList = true;
        this.toTrainCityList = false;
        if(this.searchTrainForm.controls.trainFrom.value=="")
        this.trainFromOptions= this.defaultTrainOptions;
           this.showMliteTrainFromForm = true;
           
        if(device=='mobile'){
        setTimeout(()=>{  
        $(".trainFrom-"+device).val('');
        $(".trainFrom-"+device).select();
        }, 100);
        }else{
        $(".trainFrom-"+device).focus();
        $(".trainFrom-"+device).select();
        }
        }
        else if(inputVal=='trainTo'){
        this.fromTrainCityList = false;
        this.toTrainCityList = true;
        if(this.searchTrainForm.controls.trainTo.value=="")

        this.trainToOptions= this.defaultTrainOptions;
           this.showMliteTrainToForm = true;
          if(device=='mobile'){
          setTimeout(()=>{  
           $(".trainTo-"+device).val(''); 
           $(".trainTo-"+device).select(); 
           }, 100);
         }else{
        $(".trainTo-"+device).focus();
        $(".trainTo-"+device).select();  
         }
        }else{
        this.fromTrainCityList = false;
        this.toTrainCityList = false;
        }
  
      break; 
   } 
} 

}

  closeSearchBox() {
        this.fromFlightCityList = false;
        this.toFlightCityList = false;
        this.hotelCityList = false;
        this.fromBusCityList = false;
        this.toBusCityList = false;
        this.fromTrainCityList = false;
        this.toTrainCityList = false; 
        
        this.showMliteHotelForm = false; 
        this.showMliteFlightFromForm = false; 
        this.showMliteFlightToForm = false; 
        this.showMliteBusFromForm = false; 
        this.showMliteBusToForm = false; 
        this.showMliteTrainFromForm = false; 
        this.showMliteTrainToForm = false; 
        this.showHotelPassenger=false;
        
        $( ".bottom-sheet-TravelerContainer" ).removeClass( "bottom-sheet-TravelerContainer-Full" );
  }


  closeSearchBoxHotel(type) {
  
    if(type==2){
        this.submittedHotel=true;
        if (this.searchHotelForm.invalid) { 
          if(this.searchHotelForm['controls']['rooms']['status']=="INVALID"){
            this.showHotelPassenger = true;
            this.showHotelPassengerError = true;
            return;
          }else{
           this.showHotelPassengerError = false;
          } 
       
        }
    }
    
    
    if(type==1){
       /* this.submittedFlight=true;
        if (this.searchFlightForm.invalid) { 
         return;
        }*/
    }
  
        this.fromFlightCityList = false;
        this.toFlightCityList = false;
        this.hotelCityList = false;
        this.fromBusCityList = false;
        this.toBusCityList = false;
        this.fromTrainCityList = false;
        this.toTrainCityList = false; 
        
        this.showMliteHotelForm = false; 
        this.showMliteFlightFromForm = false; 
        this.showMliteFlightToForm = false; 
        this.showMliteBusFromForm = false; 
        this.showMliteBusToForm = false; 
        this.showMliteTrainFromForm = false; 
        this.showMliteTrainToForm = false; 
        this.showHotelPassenger=false;
        this.showFlightPassenger=false;
        
        $( ".bottom-sheet-TravelerContainer" ).removeClass( "bottom-sheet-TravelerContainer-Full" );
  }

  onFromClick(values,service,device) {
       $( ".bottom-sheet-TravelerContainer" ).addClass( "bottom-sheet-TravelerContainer-Full" );
        if(this.enableEs)
        values=values['_source'];
        switch(service) { 
        case 'flights': { 
        this.searchFlightForm['controls']['flightFrom'].setValue(values.city);		
        this.searchFlightForm['controls']['fromFlightCode'].setValue(values.airport_code); 
        this.flightFromText=values.airport_code+', '+values.airport_name; 
        this.flightFromOptions= this.defaultFlightOptions;
        this.closeSearchBox();
        $("#flightTo").select();
        $("#flightTo").focus();
        
        if(device=='mobile'){
        this.showMliteFlightToForm=true;
        }
        
        break; 
        } 
   
        case 'bus' : {
         this.searchBusForm['controls']['busFrom'].setValue(values.name);		
        this.searchBusForm['controls']['fromBusCode'].setValue(values.id); 
        this.busFromText=values.name; 
        this.busFromOptions= this.defaultBusOptions;
         this.closeSearchBox();
        $("#busTo").select();
        $("#busTo").focus();
        
        if(device=='mobile'){
        this.showMliteBusToForm=true;
        }
        break; 
        } 
        case 'train': { 
        this.searchTrainForm['controls']['trainFrom'].setValue(values.name);		
        this.searchTrainForm['controls']['fromTrainCode'].setValue(values.code); 
        this.trainFromText=values.code+', '+values.name; 
        this.trainFromOptions= this.defaultTrainOptions;
        this.closeSearchBox();
        $("#trainTo").select();
        $("#trainTo").focus();
         if(device=='mobile'){
        this.showMliteTrainToForm=true;
        }
        
        break; 
        } 
        } 
	
  }

  onToClick(values,service,device) { 
        if(this.enableEs)
        values=values['_source'];
        switch(service) { 
        case 'flights': { 
        this.searchFlightForm['controls']['flightTo'].setValue(values.city);		
        this.searchFlightForm['controls']['toFlightCode'].setValue(values.airport_code);  
         this.flightToText=values.airport_code+', '+values.airport_name; 
        this.flightToOptions= this.defaultFlightOptions;
        this.closeSearchBox();
        $("#flightDeparture").trigger( "click" );
        
        
        break; 
        } 
        case 'hotels': { 
        this.searchHotelForm['controls']['hotelName'].setValue(values.full_content);		
        this.searchHotelForm['controls']['hotelId'].setValue(values.city);  
        this.searchHotelForm['controls']['countryId'].setValue(values.country);  
        this.hotelFromText=values.full_content; 
        this.hotelOptions= this.defaultHotelOptions;
        this.closeSearchBox();
        
        
        $("#"+device+"HotelFromPicker").trigger( "click" );
        
        break; 
        } 
         case 'bus' : {
        this.searchBusForm['controls']['busTo'].setValue(values.name);		
        this.searchBusForm['controls']['toBusCode'].setValue(values.id);  
        this.busToText=values.name; 
        this.busToOptions= this.defaultBusOptions;
        this.closeSearchBox();
       
        $("#busDeparture").trigger( "click" );
        
        
        
        break; 
        } 
        case 'train': { 
        this.searchTrainForm['controls']['trainTo'].setValue(values.name);		
        this.searchTrainForm['controls']['toTrainCode'].setValue(values.code);  
        this.trainToText=values.code+', '+values.name; 
        this.trainToOptions= this.defaultTrainOptions;
        this.closeSearchBox();
       
        $("#trainDeparture").trigger( "click" );
        
        
        break; 
        } 
        } 	
  }
  EndDateChange(event,service,channel): void {
          var datePipe =new DatePipe('en-US'); 
  if(service=='flight'){
   if(this.flightTripType=='R'){
      this.minDateFlightToMlite=event.value;
      var compare1 = new Date(event.value).getTime();
      var compare2 = new Date(this.flightpickerDefaultTMlite).getTime();
       if(compare1 > compare2){
        this.flightpickerDefaultTMlite=new Date(datePipe.transform(event.value, 'dd MMM yyyy', 'en-ES'));
        this.searchFlightForm['controls']['flightReturn'].setValue(datePipe.transform(event.value, 'dd MMM yyyy', 'en-ES'));
       }
    $("#"+channel+"FlightToPicker").trigger( "click" );
    }
  }
    if(service=='hotel'){
      this.minDateHotelToMlite=event.value;
      var compare1 = new Date(event.value).getTime();
      var compare2 = new Date(this.hotelpickerDefaultTMlite).getTime();
       if(compare1 > compare2){
        this.hotelpickerDefaultTMlite=new Date(datePipe.transform(event.value, 'dd MMM yyyy', 'en-ES'));
        this.searchHotelForm['controls']['hotelCheckout'].setValue(datePipe.transform(event.value, 'dd MMM yyyy', 'en-ES'));
       }
        $("#"+channel+"HotelToPicker").trigger( "click" );
  
  }
  
   
  }
 
   searchAutoComplete($event,service,field,device) { 
   
  
       let keycode = $event.which;
       if($event.keyCode==13){ 
        this.arrowFromkeyLocation=0;
	}else if ($event.keyCode != 40 && $event.keyCode != 38 ){
        this.arrowFromkeyLocation=0;
        if ($event.timeStamp - this.lastKeypress > 0) {
        this.queryText = $event.target.value;
        if(this.queryText && this.queryText.length > 0){
        //Elastic Search
        if(this.enableEs ==true){
        let searchParam = {
        searchDisplayForm: service,
        queryText: this.queryText
        };
        
        this.es.esSearch(searchParam).subscribe(res => {
        //On Enter Key Pressed
         if(keycode==13){
          if(res.hits.total > 0){
                switch(service) { 
                case 'flights': { 
                if(field=='flightFrom'){
                this.flightFromOptions = this.defaultFlightOptions;
                this.onFromClick(res.hits.hits[0],service,device);
                }else{
                this.flightToOptions = this.defaultFlightOptions;
                this.onToClick(res.hits.hits[0],service,device);
                }
                break; 
                } 
                case 'hotels': { 
                this.hotelOptions = this.defaultHotelOptions;
                this.onToClick(res.hits.hits[0],service,device);
                break; 
                } 
                case 'bus' : {
                if(field=='busFrom'){
                this.busFromOptions = this.defaultBusOptions;
                this.onFromClick(res.hits.hits[0],service,device);
                }else{
                this.busToOptions = this.defaultBusOptions;
                this.onToClick(res.hits.hits[0],service,device);
                }
                break; 
                } 
                case 'train': { 
                if(field=='trainFrom'){
                this.trainFromOptions = this.defaultTrainOptions;
                this.onFromClick(res.hits.hits[0],service,device);
                }else{
                this.trainToOptions = this.defaultTrainOptions;
                this.onToClick(res.hits.hits[0],service,device);
                }
                break; 
                } 
          }
         }
       }  
        switch(service) { 
        case 'flights': { 
        if(field=='flightFrom'){
        this.flightFromOptions=res.hits.hits;
        }else{
        this.flightToOptions=res.hits.hits;
        }
        break; 
        } 
        case 'hotels': { 
        this.hotelOptions=res.hits.hits;
        break; 
        } 
        case 'bus' : {
        if(field=='busFrom'){
        this.busFromOptions=res.hits.hits;
        }else{
        this.busToOptions=res.hits.hits;
        }

        break; 
        } 
        case 'train': { 
        var stringified = JSON.stringify(res.hits.hits);
        stringified = stringified.replace(/station_code/g, 'code');
        stringified = stringified.replace(/station_name/g, 'name');

        if(field=='trainFrom'){
        this.trainFromOptions=JSON.parse(stringified);
        }else{
        this.trainToOptions=JSON.parse(stringified);
        }

        break; 
        } 
        }
          
        });
        }

        
       } 
      }  
     }
    }


    selectCheck(searchFrom,searchTo,service){
        let status;
        if(searchFrom != "" && searchTo !='' && searchFrom == searchTo){
        status=true;
        }else{
        status=false;
        }
        switch(service) { 
        case 'flights': { 
        this.validateMessageFlight=status;
        break; 
        } 
        case 'bus' : {
        this.validateMessageBus=status;
        break; 
        } 
        case 'train': { 
        this.validateMessageTrain=status;
        break; 
        } 
        }
    }



  pnrKeyup(){
    this.pnrsubmitted=false;
  }
  
    onPaste(event: ClipboardEvent) {
    let clipboardData = event.clipboardData;
    let pastedText = clipboardData.getData('text');  
    var patt1 = /^[a-zA-Z0-9]*$/g; 
    var result = pastedText.match(patt1);
    if(result==null || result==undefined){
      event.preventDefault();
    }
  }
  
  public findInvalidControls(pnrNo) {
    if(this.pnrNumber==undefined || this.pnrNumber=="" || this.pnrNumber == "0"){
      return "Please enter PNR number"; 
    }
     if(this.pnrNumber.length !=10 ){
      return "PNR Number should be 10 digit numeric number."; 
    }
    
  } 
  
  closeBottomSheet(){
  this.closeBottomSheetPop.emit(1); 
  }
  
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  
  count:number=0;searchTrainKey: string;
  
   onPNRSubmit(){ 
      const message=this.findInvalidControls(this.pnrNumber);
      // this.pnrsubmitted=true;
      if(message){
        this.pnrsubmitted=true;
        this.errorMessage=message;
        this.pnrNumber="";
      }else{           
        let urlParams = new HttpParams()
        .set('pnrnumber', this.pnrNumber);
        
        if(sessionStorage.getItem('-pnr')!=null){
            var PNR=sessionStorage.getItem('-pnr');
            var tempPNR=JSON.parse(atob(PNR));
        }else{
            sessionStorage.setItem('-pnr', btoa(JSON.stringify(this.pnrNumber)));
        }

        //console.log(tempPNR +" ## "+ this.pnrNumber);
        const body:string = urlParams.toString();
   
              const dialogRef2 = this.dialog.open(CaptchaDialog, {
                panelClass: 'm-captch',
                disableClose: true,
              });
              dialogRef2.afterClosed().subscribe(result => {
            
                if(result){
                  this.pnrsubmitted=true;
                    this.irctc.getPnr(body).subscribe(result => {
                      this.PnrDetails = result.partnerResponse;
                      if(result.errorcode==0){
                      
                          if(result.errorDesc=='Sucess'){
                            this.count=this.count+1;
                     
                                  this.pnrsubmitted=true;
                                  this.showDetails=true;
                                  this.errorMessage='';
                          }else{
                            sessionStorage.setItem('-pnr', btoa(JSON.stringify(this.pnrNumber)));
                            this.errorMessage=result.partnerResponse;
                            this.showDetails=true;
                          }
                      }else if(result.errorcode==1){
                        this.pnrsubmitted=true;
                        this.showDetails=true;
                        this.errorMessage = result.partnerResponse;
                      }else{
                        this.pnrsubmitted=true;
                        this.showDetails=false;
                        this.errorMessage='Please enter valid PNR number';
                      }
                  });
                }
              }); 


      }
  }
  
charInput($event){
var keycode = $event.which;
if((keycode >= 33 && keycode <= 47) || (keycode >= 91 && keycode <= 96) || (keycode >= 48 && keycode <= 64) || (keycode == 8377))
{
event.preventDefault();
}
}   

}



export interface DialogData {
  messageData: string;
}
@Component({
  selector: 'confirmation-dialog',
  templateUrl: './dialog.html',
})
export class ConfirmationDialog {
    constructor(public dialogRef: MatDialogRef<ConfirmationDialog>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    onYesClick(): void {
      this.dialogRef.close(true);
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
  selector: 'dialogforcaptcha',
  templateUrl: 'captchaDialog.html'
})
export class CaptchaDialog {
  siteKey:any; serviceSettings:any;
  formDialog: FormGroup;
  submitted: boolean=false;
  size:any;lang:any;theme:any;type:any;
  constructor(public dialogRef1: MatDialogRef<CaptchaDialog>,@Inject(MAT_DIALOG_DATA) public data: DialogData, @Inject(APP_CONFIG) appConfig: any,private appConfigService:AppConfigService) {}
  
    ngOnInit(){
        this.serviceSettings=this.appConfigService.getConfig();
        this.siteKey=this.serviceSettings.SITEKEY;  
        this.size="Normal";
        this.lang="en";
        this.theme="Light";
        this.type="Image";

        const formDialog: FormGroup = new FormGroup({});
        formDialog.addControl('captcha', new FormControl('', [Validators.required]));
        this.formDialog = formDialog;
    }

    submitCaptcha(){
      
      this.submitted=true;
      if (this.formDialog.invalid){
        return;
      }else{
        this.dialogRef1.close(true);
      }
    }

}


