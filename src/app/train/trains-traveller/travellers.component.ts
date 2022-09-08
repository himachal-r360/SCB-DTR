import { Component, OnInit, NgModule, ChangeDetectorRef, ElementRef, Inject, ɵConsole, Input, Output, EventEmitter } from '@angular/core';
import { CountdownConfig, CountdownEvent } from 'ngx-countdown';
import { FormControl } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SimpleGlobal } from 'ng2-simple-global';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { DOCUMENT, NgStyle, DecimalPipe, DatePipe } from '@angular/common';
import { APP_CONFIG, AppConfig } from '../../configs/app.config';
import * as moment from 'moment';
import { EncrDecrService } from 'src/app/shared/services/encr-decr.service';
import { RestapiService } from 'src/app/shared/services/restapi.service';
import { Location } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { IrctcApiService } from 'src/app/shared/services/irctc.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import {MatBottomSheet, MatBottomSheetRef,MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import { fareEnqueryMultiplePassengers } from 'src/app/shared/interfaces/fareEnqueryMultiplePassengers';
import { environment } from '../../../environments/environment';
import { NgbDateParserFormatter, NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { CommonHelper } from 'src/app/shared/utils/common-helper';
import { NgxSpinnerService } from "ngx-spinner";
import { Title } from '@angular/platform-browser';
import { AppConfigService } from '../../app-config.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import { type } from 'os';
import alertify from 'alertifyjs';
import { FlightService } from 'src/app/common/flight.service';

@Component({
    selector: 'app-travellerstrain',
    templateUrl: './travellers.component.html',
    styleUrls: ['./travellers.component.scss']
})
export class TrainsTravellerComponent implements OnInit {
    steps:number=1;
      completedSteps = 1;
    childBerthMandatory:any;
    serviceId:string='IRCTC';
    template: string = '<div class="app-loading-new"><div class="logo"></div></div>'
    optChildBerthprimary: any;
    journeyDateactual: any;
    journeyDateactualstr: any;
    journeyArrivalDate: any;
    showFareSummary = false;
    validateUser: boolean = true;
    passengerReservationChoice: number = 99;
    travelInsuranceOpted: boolean = false;
    travelInsuranceEnabled: string = 'true';
    cdnUrl: any;
    ctype: string = 'irctc';
    stationParam: any; userIdParam: any;
    gstshow = false;
    addshow = false;
    hideDelay = new FormControl(2000);
    showFilter = false;
    totalFare: number = 0;
    totalTicketFare: number = 0;
    searchTrainKey: string;
    coupon_id: any;
    intialTotalFare: number = 0;
    indexCoupon: any;
    coupon_name: any;
    coupon_code: any;
    remove_Coupon: any;
    send_RemoveCouponDetail: any;
    coupon_amount: number = 0;
    REWARD_CUSTOMERID: string;
    REWARD_EMAILID: string;
    REWARD_MOBILE: string;
    REWARD_CUSTOMERNAME: string;
    REWARD_TITLE:string;
    fareData: any = [];
    savedCards: any = [];
    defaultPrimary: number = 0;
    gstSelected: boolean = false;
    appConfig: any;
    domainPath: string;
    domainRedirect: string;
    continueStatus: boolean = false; buttonstatus: boolean = false;
    public Button_loading: any = 'Processing...';
    response: any = [];
    IRCTCUserError: any;
    userValidError: boolean = false;
    stationNames: any;
    scheduleParam: any;
    reqData: any;
    traindate: any;
    fromstn: any;
    tostn: any;
    trainnumber: any;
    selectclass: any;
    scheduletime: any;
    journeyClass: any;
    journeyQuota: any;
    fareEnquiryArr: any;
    fareEnqResponse: [];
    fareResponse: [];
    gstDetails: any = [];
    passengerForm: FormGroup;
    idForm: FormGroup;
    submitted = false;
    submittedUserInfoForm = false;
    irctcRegister : boolean = false;
    passengerData: any = [];
   // patternName = /^[A-z]*$|^[A-z]+\s[A-z]*$/
    patternName = /^(?:(?!.*[ ]{2})(?!(?:.*[']){2})(?!(?:.*[-]){2})(?:[a-zA-Z0-9 \p{L}'-]{3,48}$))$/;
    emailPattern = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    gstpattern :any;
    documentPattern = /^(?!^0+$)[a-zA-Z0-9]{3,20}$/;
    coachNoPattern = /^(([a-zA-Z]{1})([0-9]{1,3}))/;
    //coachNoPattern= /^([a-zA-Z])([0-9]{1,3})/;
    travellers = []; children = [];
    travellersArray = []; 
    childrenArray = [];
    
    travellersArrayM = []; 
    childrenArrayM = [];
    
    travellersFilledArray = [];    infanttravellersFilledArray = [];
    
    seniorCitizenStatus: boolean = false;
    seniorCitizenStatusAddMore: any[] = [false];
    applicableBerthTypes: any[];
    foodChoiceEnabled: boolean; foodDetails: any[];
    country: any = [];
    countries: any;
    defaultCountry: String;
    showTravelDocument: boolean = false;
    defaultCountryArr: any[] = ["IN"];
    showTravelDocumentAddMore: boolean[] = [false];
    maxPassengers: number;
    maxInfants: number;
    minNameLength: number;
    maxNameLength: number;
    minPassportLength: number;
    maxPassportLength: number;
    maxChildAge: number;
    minPassengerAge: number;
    maxPassengerAge: number;
    srctzWomenAge: number;
    srctzMenAge: number;
    srctzTransgenderAge: number;
    ageValidError: any;
    childAgeValidError: any[] = [];
    error: number = 0;
    IRCTCUserId: any;
    selected: boolean = false;
    trackByTraveller: any;
    trackByChild: any;
    seniorCitizenEnabled: boolean = false;
    gender: string;
    genderSelect: string;
    optChildBerthStatus: Boolean = false;
    optChildBerthStatusArr: Boolean[] = [false];
    optBedRollStatus: boolean;
    seniorCitizenApplicable: boolean = false;
    concessionalMsg: string = '';
    forgoConcession: boolean;
    concessionOpted: boolean;
    seniorCitizenEnabledArr: boolean[] = [false];
    seniorCitizenApplicableArr: boolean[] = [false];
    genderArr: string[] = [];
    genderSelectArr: string[] = [];
    ageValidErrorArr: any[] = [];
    age: Number;
    deviceID: any;
    deviceModel: any;
    osType: any;
    wsUserLogin: string;
    travellerListArray: any[] = [];
    travelDocCardNoArr: any[] = [];
    travelDocArr: any[] = [];
    optChildBerthArr: any[] = [];
    optBedRollArr: any[] = [];
    MealPreferenceArr: any[] = [];
    baseFare: number;
    cateringCharge: number;
    dynamicFare: number;
    otherCharge: number;
    serviceTax: number;
    reservationCharge: number;
    superfastCharge: number;
    tatkalFare: number;
    totalConcession: number;
    totalFareRes: number;
    travelInsuranceCharge: number;
    travelInsuranceServiceTax: number;
    wpServiceCharge: number;
    wpServiceTax: number;
    totalCollectibleAmount: any;
    totalCollectibleAmountFromPartnerResponse: any;
    couponapplyamount:any;
    clientTransactionId: string;
    orderReferenceNumber: string;
    enqClass: any;
    from: any;
    to: any;
    quota: any;
    trainName: any;
    trainNo: any;
    timeStamp: any;
    insuredPsgnCount: number;
    arrivalTime: any;
    departureTime: any;
    deviceInfo: any;
    travel_ins_charge: Number = 0;
    travel_ins_charge_tax: Number; bedRollCharge: Number; TOTAL_bedRollCharge: Number;
    wp_charge: Number = 0;
    wp_charge_tax: Number = 0;
    concession: Number = 0;
    convenience_fee: number = 0;
    convienceChargesEnable: boolean = true;
    convienceChargesEnabledValue: number = 0;
    campiagn_agent_charges: number = 0;
    agent_charges: number = 0;
    pgCharges: number = 0;
    pgChargesNetbanking: number = 0;
    invokeBookingParam: any;
    responseInvokeBooking: any = [];
    defaultBoardingStation: any = [];
    trainDateStr: string;
    irctcData: any = [];
    seacthResult: any = [];
    fareEnqueryMultiplePassengers: any = [];
    passengerContactData: any = []; contactDetails: any = [];
    XSRFTOKEN: string;
    showgst: boolean = true;
    masterBerth: any[];
    masterFood: any[];
    ladiesQuotaTrue: boolean=false;
    stationsdump: any[];
    fromstnDesc: string;
    tostnDesc: string;
    IsDcemiEligibleFlag: boolean = false;  
    whatsappFeature: number = 0;
    availFlag: number = 0;
    forgoFiftyFlag: number = 0;
    forgoFullFlag: number = 0;
    availFlag1: number = 0;
    forgoFiftyFlag1: number = 0;
    forgoFullFlag1: number = 0;
    showoffer:boolean=false;
    isFlexipayEligibleFlag:boolean = false;
    flexipaysummry:boolean;
    flexiDiscount:any;
    flexiIntrest:any;
    showFlexipay:boolean=false;
    successusers:any[];
    userfiltervalue:any[];
    tenure:any;
    citySelect:any;
    enableGST:any; 
    serviceSettings:any;
    traveldate:any;
    boardingstnName:any;
    saveTravllerShow:boolean=false;
    travellerlist:any;
    adulttravellerlist:any;
    infanttravellerlist:any;
    checkPaxCount:any;checkinfantPaxCount:any;
    savePaxcount:any=0;
    savecustomerResp:any;
    GSTList:any=[];
    GSTListLength:any;
    selectedGST:any=[];
    checkedGST:any=[];
    disableCheckbox:any = [];
    disableCheckboxInfant:any = [];
    selectedCheckbox:any=[];
    selectedCheckboxInfant:any=[];
    travellersArrayLength:any;
     getGSTShow:Boolean=false;
     modalcheckedvalue:any = []; modalcheckedvalueInfant:any = [];
     gstmodalcheckedvalue:any = false;
     isCheckedGST:any=[];
     domainName:any;
    postOfficeAPIresponse:any;
    postofficeList :any;
    postofficeErrormsg:any;
    isDestAddressrequired:any;
    showDestAddressBox:any;
    trainItenararyCovidPopup:any;
    urlparam:any;
    cityList:any;
    pincodeError:any;
    state:any;
    cityResp;any;
    destState:any;
    destpincodeError:any;
    foreignPassDOBArr:any[]=[];
    isExpanded:boolean = false;
    isAdultExpanded:boolean = false;
    isInfantExpanded:boolean = false;
    isGstExpanded:boolean = false;
     enablesavedTraveller:number=0;
     customerInfo:any;
       isMobile:boolean= true;
       
         isCollapseBasefare: boolean = false;
  isCollapseDiscount: boolean = false;
  isCollapse: boolean = false;
    trainDetails: boolean = true;
       
    constructor(private el: ElementRef,private _flightService: FlightService,private modalService:NgbModal,private spinnerService: NgxSpinnerService, private _decimalPipe: DecimalPipe, public _irctc: IrctcApiService, private EncrDecr: EncrDecrService, public rest: RestapiService, private cookieService: CookieService, private dialog: MatDialog, _formBuilder: FormBuilder, private deviceService: DeviceDetectorService, private _bottomSheet: MatBottomSheet, private location: Location, @Inject(DOCUMENT) private document: any, private sg: SimpleGlobal, private activatedRoute: ActivatedRoute, private router: Router, public commonHelper: CommonHelper,private titleService: Title,private appConfigService:AppConfigService) {
        this.serviceSettings=this.appConfigService.getConfig();
        this.domainRedirect = environment.MAIN_SITE_URL + this.sg['domainPath'];
        this.domainName = this.sg['domainName'];
        this.trainItenararyCovidPopup = this.serviceSettings.trainItenararyCovidPopup;

        if (this.serviceSettings.DOMAIN_SETTINGS[this.sg['domainName']]['TRAIN'] != 1) {
            this.router.navigate([ '/**']);
        }
        this.stationsdump = require('src/assets/data/stations.json');
        this.epicFunction();
        this.cdnUrl = environment.cdnUrl + this.sg['assetPath'];
        this.whatsappFeature =this.serviceSettings.whatsappFeature;
        this.enableGST = this.serviceSettings.enableSavedGST;
        this.enablesavedTraveller = this.serviceSettings.enablesavedTraveller;
    }

    ngOnInit() {
         this.titleService.setTitle('Home | IRCTC');
        var datePipe = new DatePipe('en-US');
        this.masterBerth = AppConfig.IRCTC_Berth;
        this.masterFood = AppConfig.IRCTC_Food;

     this.activatedRoute.url.subscribe(url =>{
     this.gotoTop();
       this.resetPopups();
      this.steps = 1;
      this.isMobile = window.innerWidth < 991 ? true : false;
      if (this.isMobile) {
        this._flightService.showHeader(false);
      } else {
        this._flightService.showHeader(true);
      }
           
     
        this.searchTrainKey = this.activatedRoute.snapshot.queryParamMap.get('searchTrainKey');
        
        this.seacthResult = JSON.parse(sessionStorage.getItem(this.searchTrainKey));
        
        console.log(this.seacthResult);
        
        let jdate=this.seacthResult.selectedAvailablityFare.availablityDate.split("-").reverse().join("-");
     
        this.journeyDateactual =  datePipe.transform(jdate, 'yyyy-MM-dd', 'en-ES');
        this.journeyDateactualstr = datePipe.transform(this.journeyDateactual, 'yyyyMMdd', 'en-ES');
        
	var myDate=datePipe.transform(this.journeyDateactual, 'yyyy-MM-dd', 'en-ES')+" "+this.seacthResult.selectedTrain.departureTime+":00";
        let durationDump=this.seacthResult.selectedTrain.duration;
	var duration = durationDump.split(":");
         this.journeyArrivalDate=moment(myDate).add(duration[0], 'hours').add(duration[1], 'minutes').format('YYYY/MM/DD hh:mm:ss');
        
        this.totalTicketFare = this.seacthResult.fareData.totalFare;
        this.baseFare = this.seacthResult.fareData.baseFare;
        this.serviceTax = this.seacthResult.fareData.serviceTax;
        this.reservationCharge = this.seacthResult.fareData.reservationCharge;
        this.superfastCharge = this.seacthResult.fareData.superfastCharge;
        this.dynamicFare = this.seacthResult.fareData.dynamicFare
        this.travel_ins_charge_tax = 0; //by default travel insurance will not be selected
        this.travel_ins_charge = 0;

        this.wp_charge = this.seacthResult.fareData.wpServiceCharge;
        this.wp_charge_tax = this.seacthResult.fareData.wpServiceTax;
        this.concession = this.seacthResult.fareData.totalConcession;
        //this.pgCharges = ((Number(this.seacthResult.fareData.totalCollectibleAmount) + Number(this.convenience_fee) + Number(this.travel_ins_charge)) * Number(this.serviceSettings.PGCHARGES[25]['CYBER'] / 100));
        this.totalCollectibleAmount = Number(this.seacthResult.fareData.totalCollectibleAmount) + Number(this.convenience_fee) + Number(this.travel_ins_charge);
	this.totalCollectibleAmountFromPartnerResponse=this.totalCollectibleAmount;

        /*** SESSION */
        sessionStorage.removeItem("coupon_amount");

        setTimeout(() => {
    //Check Laravel Seesion
        if(this.sg['customerInfo']){
		if(sessionStorage.getItem("channel")=="payzapp"){
		 var customerInfo = this.sg['customerInfo'];
		 this.customerInfo=customerInfo;
		this.XSRFTOKEN = customerInfo["XSRF-TOKEN"];
		setTimeout(function() { this.validateUser = false;}.bind(this), 1000);
		this.REWARD_CUSTOMERID = '0000';
		this.REWARD_EMAILID = '';
		this.REWARD_MOBILE = '';
		this.REWARD_CUSTOMERNAME = '';
		}else{
		  var customerInfo = this.sg['customerInfo'];
		   this.customerInfo=customerInfo;
             if(customerInfo["org_session"]==1){
            // console.log(customerInfo)
              setTimeout(function () { this.validateUser = false; }.bind(this), 1000);
             if(customerInfo["guestLogin"]==true){
                this.REWARD_CUSTOMERID = customerInfo["id"];
                this.XSRFTOKEN = customerInfo["XSRF-TOKEN"];
                this.IsDcemiEligibleFlag=true;
                this.isFlexipayEligibleFlag=true;
                this.enablesavedTraveller=0;
             }else{
                this.REWARD_CUSTOMERID = customerInfo["id"];
                this.REWARD_EMAILID = customerInfo["email"];
                this.REWARD_MOBILE = customerInfo["mobile"];
                this.REWARD_TITLE = customerInfo["title"];

                this.REWARD_CUSTOMERNAME = customerInfo["firstname"] + " " + customerInfo["lastname"];
                this.XSRFTOKEN = customerInfo["XSRF-TOKEN"];

                const urlSearchParams = new HttpParams()
                    .set('customerid', customerInfo["id"])
                    .set('programName', this.sg['domainName']);
                let body: string = urlSearchParams.toString();

                this.passengerForm.patchValue({
                    passengerName: '',
                    passengerLastName0: customerInfo["lastname"],
                    passengerMobile: customerInfo["mobile"],
                    passengerEmail: customerInfo["email"]
                });

                //Check Dc Emi Eligible
                if(this.serviceSettings.PAYSETTINGS[this.sg['domainName']][this.serviceId].DEBIT_EMI==1){
                var checkEligibleParams = {
                    'client_token': 'HDFC243',
                    'mobile': customerInfo["mobile"],
                };
                var postCheckEligibleParam = {
                    postData: this.EncrDecr.set(JSON.stringify(checkEligibleParams))
                };

                this.rest.IsDcemiEligible(postCheckEligibleParam).subscribe(results => {
                    if (results.result) {
                        let result = JSON.parse(this.EncrDecr.get(results.result));
                        this.IsDcemiEligibleFlag = result.eligible; 
                    }
                });
               }
               

                var saveCardPostParam = {
                    "customerid": customerInfo["id"],
                    "programName": this.sg['domainName']
                };

                var saveCardParam = {
                    postData: this.EncrDecr.set(JSON.stringify(saveCardPostParam))
                };


                this.rest.getSaveCards(saveCardParam).subscribe(data => {
                    let cardData = data;
                    let newCardArr = [];
       this.savedCards = data;

                    
                });

                //check flexipay eligible
               if(this.serviceSettings.PAYSETTINGS[this.sg['domainName']][this.serviceId].FLEXI_PAY==1){
                var eligibleparam = {
                 'mobile': customerInfo["mobile"] 
                }
                var postEligibleParam = {
                 postData: this.EncrDecr.set(JSON.stringify(eligibleparam))
             };
             this.rest.isFlexiPayEligible(postEligibleParam).subscribe(results => {
                 let resp = JSON.parse(this.EncrDecr.get(results.result));
                 this.isFlexipayEligibleFlag = resp.status;
                
             })
            }
            if(this.enablesavedTraveller == 1){
                this.checksavedtraveller();
              }
              if(this.enableGST==1){
                this.getCustomerGstDetails();
              }
             }
            } else {
                setTimeout(function () { this.validateUser = false; }.bind(this), 1000);
                this.REWARD_CUSTOMERID = '0000';
                this.REWARD_EMAILID = '';
                this.REWARD_MOBILE = '';
                this.REWARD_CUSTOMERNAME = '';
                this.XSRFTOKEN = 'NULL';
                if (environment.localInstance == 0)
                    this.document.location.href = environment.MAIN_SITE_URL + this.sg['domainPath'] + 'check-login';
            }
          }  
        
          }else{
            setTimeout(function () { this.validateUser = false; }.bind(this), 1000);
            this.REWARD_CUSTOMERID = '0000';
            this.REWARD_EMAILID = '';
            this.REWARD_MOBILE = '';
            this.REWARD_CUSTOMERNAME = '';
            this.XSRFTOKEN = 'NULL';
            if (environment.localInstance == 0)
                this.document.location.href = environment.MAIN_SITE_URL + this.sg['domainPath'] + 'check-login';
          }
  
    }, 50);

        /***SESSION ends */

        const userGroup: FormGroup = new FormGroup({});

        userGroup.addControl('userID', new FormControl('', [Validators.required, Validators.pattern("^[0-9a-zA-Z_]+$"), Validators.minLength(2)]));
        userGroup.addControl('boardingStation', new FormControl('', [Validators.required]));
        this.idForm = userGroup;

        /***SESSION ends */
        const jobGroup: FormGroup = new FormGroup({});
        jobGroup.addControl('destAddressOne',new FormControl(''));
        jobGroup.addControl('destAddressTwo',new FormControl(''));
        jobGroup.addControl('destAddressThree',new FormControl(''));
        jobGroup.addControl('destAddressPin',new FormControl(''));
        jobGroup.addControl('destAddressState',new FormControl(''));
        jobGroup.addControl('destAddressCity',new FormControl(''));
        jobGroup.addControl('destAddressPost',new FormControl(''));
      
        
       
        jobGroup.addControl('saveTraveller',new FormControl(''));
        jobGroup.addControl('passengerAutoUpgradation', new FormControl(0));
        jobGroup.addControl('AdditionalPreference', new FormControl(0));
        jobGroup.addControl('vikalpInSpecialTrainsAccomFlag', new FormControl(''));
        jobGroup.addControl('foreignPassengerDOB0', new FormControl(''));

        jobGroup.addControl('passengerReservationCh', new FormControl(''));
        jobGroup.addControl('coachId', new FormControl(''));
        
        jobGroup.addControl('passengerMobile', new FormControl(this.REWARD_MOBILE));
        jobGroup.addControl('passengerEmail', new FormControl(this.REWARD_EMAILID));
        jobGroup.addControl('whatsappFlag', new FormControl('1'));
        jobGroup.addControl('passengerAgree', new FormControl());
        jobGroup.addControl('travelInsurence', new FormControl(''));
        jobGroup.addControl('gstNumber', new FormControl());
        jobGroup.addControl('gstBusinessName', new FormControl());
        jobGroup.addControl('gstAddress', new FormControl());
        jobGroup.addControl('gstCity', new FormControl());
        jobGroup.addControl('gstPincode', new FormControl());
        jobGroup.addControl('gstState', new FormControl());
        

        jobGroup.addControl('saveGST', new FormControl('1'));
        this.passengerForm = jobGroup;
     
        this.seniorCitizenStatus = false;
        this.boardingStations();
        this.getTrains();

        //get last IRCTC USER ID from cookie
        if (this.cookieService.get('user') != "") {
            var userId = this.cookieService.get('user');
            this.IRCTCUserId = JSON.parse(atob(userId));
        }
       }); 
        
    }
    
      isCollapseShow(identifyCollpase) {

    if (identifyCollpase == 'BaseFare') {
      this.isCollapseBasefare = !this.isCollapseBasefare;
   
    } else if (identifyCollpase == 'discount') {
      this.isCollapseDiscount = !this.isCollapseDiscount;
    } else {
      this.isCollapse = !this.isCollapse;
    }

  }
    
    expandItems() {
        if(this.isExpanded == false){
          this.isExpanded = true;
        }else if(this.isExpanded == true){
          this.isExpanded = false;
        }
      }
    expandItemsAdult() {
        if(this.isAdultExpanded == false){
          this.isAdultExpanded = true;
        }else if(this.isAdultExpanded == true){
          this.isAdultExpanded = false;
        }
      }
     expandItemsInfant() {
        if(this.isInfantExpanded == false){
          this.isInfantExpanded = true;
        }else if(this.isInfantExpanded == true){
          this.isInfantExpanded = false;
        }
      }
      gstExpandItems() {
        if(this.isGstExpanded == false){
          this.isGstExpanded = true;
        }else if(this.isGstExpanded == true){
          this.isGstExpanded = false;
        }
      }
    convertToUpperCase($event) {
        $event.target.value = $event.target.value.toUpperCase();
    }

    epicFunction() {
        this.deviceInfo = this.deviceService.getDeviceInfo();
        const isMobile = this.deviceService.isMobile();
        const isTablet = this.deviceService.isTablet();
        const isDesktopDevice = this.deviceService.isDesktop();
        this.deviceID = this.deviceInfo.device;
        this.osType = this.deviceInfo.os;
        if (isMobile == true) {
            this.deviceModel = 'mobile';
        } else if (isTablet == true) {
            this.deviceModel = 'tablet';
        } else if (isDesktopDevice == true) {
            this.deviceModel = 'desktop';
        }

    }
isPaynowClicked:boolean=false;
continuePayment(){
//console.log($(".accordion-button[aria-expanded='true']").attr("id"));return;
switch ($(".accordion-button[aria-expanded='true']").attr("id")) {
        case 'tab-savedCards':
        $('.btn-pay-saved-card').trigger('click');
        break;
        case 'tab-testPg':
        $('.btn-pay-test').trigger('click');
        break;   
        case 'tab-payzapp':
        $('.btn-pay-payz').trigger('click');
        break;  
        case 'tab-netBanking':
        $('.btn-pay-netbanking').trigger('click');
        break;  
        case 'tab-ccdcCards':
        if($(".addCardTab[aria-selected='true']").attr("aria-selected"))
        $('.btn-pay-card').trigger('click');

        if($(".addRupayTab[aria-selected='true']").attr("aria-selected"))
        $('.btn-pay-rupay').trigger('click');

        break;  

        case 'tab-emi': 
        if($(".ccemiTab[aria-selected='true']").attr("aria-selected"))
        $('.btn-pay-emi-cc').trigger('click');
         
         
        break;  
          
          
         case 'tab-testPg': 
        $('.btn-pay-test').trigger('click');
        break;  
      }

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
    
saveTravellerConsent(){
  alertify.alert('I give consent to Reward360 to store personal information which I am entering on my own accord to facilitate convenience in future for quick data entry while undertaking transaction completion across all/diverse merchant offering on Reward360 hosted platform. This information includes Title, First Name, Last Name, Date of Birth, Mobile Number, Gender, Email ID, Passport Details and GST details. I understand that this information is not being stored by HDFC Bank under any facility and HDFC Bank will not be held responsible should any issue arise related to this data storage.').setHeader('<b>Save this traveller for your future travel</b>') ;
}

saveGSTConsent(){
  alertify.alert('I give consent to Reward360 to store personal information which I am entering on my own accord to facilitate convenience in future for quick data entry while undertaking transaction completion across all/diverse merchant offering on Reward360 hosted platform. This information includes Title, First Name, Last Name, Date of Birth, Mobile Number, Gender, Email ID, Passport Details and GST details. I understand that this information is not being stored by HDFC Bank under any facility and HDFC Bank will not be held responsible should any issue arise related to this data storage.').setHeader('<b>Save this GST for your future travel</b>') ;
}
    searchParam: any; trainResponse: any; vikalpInSpecialTrainsAccomFlag: boolean;
    getTrains() {
        this.traindate = this.seacthResult.searchHistory.journeyDate;
        this.trainDateStr = this.traindate.replace(/-/g, "");
        this.fromstn = this.seacthResult.selectedTrain.fromStnCode;
        this.tostn = this.seacthResult.selectedTrain.toStnCode;
        this.fromstnDesc = this.stationsdump[this.fromstn];
        this.tostnDesc = this.stationsdump[this.tostn];


        let urlParams = new HttpParams()
            .set('frmStn', this.fromstn)
            .set('journeyDate', this.trainDateStr)
            .set('toStn', this.tostn)
            .set('searchFrom', this.fromstn)
            .set('searchTo', this.tostn) ;

        const body: string = urlParams.toString();
 	this.spinnerService.show();
        this._irctc.getTrains(body).subscribe(data => {
         this.spinnerService.hide();
            this.trainResponse = data;

            if (this.trainResponse.errorcode == 1) {
            } else {
                if (typeof this.trainResponse.partnerResponse.trainBtwnStnsList !== 'undefined') {
                    if (this.trainResponse && this.trainResponse.partnerResponse.trainBtwnStnsList.length > 0 && this.trainResponse.errorcode == 0 && this.trainResponse.partnerResponse.errorMessage != '') {
                        var vikalpInSpecialTrainsAccomFlag = this.trainResponse.partnerResponse.vikalpInSpecialTrainsAccomFlag;
                        //this.vikalpInSpecialTrainsAccomFlag=vikalpInSpecialTrainsAccomFlag;
                        if (vikalpInSpecialTrainsAccomFlag == "true") {
                            this.vikalpInSpecialTrainsAccomFlag = true;
                        } else if (vikalpInSpecialTrainsAccomFlag == "false") {
                            this.vikalpInSpecialTrainsAccomFlag = false;
                        }
                    }
                }
            }
        });
    }
    /*--------------------------------------BOOKING INFORMATION SECTION starts------------------------------------------------------------------***/
    errorInvalid: number = 1;
    expiredDate: any = new Date();

    checkpassword(){
         // let message = "";
         let passportdialog = this.dialog.open(userIDforgot, {
            disableClose: true,
            width: '600px',
            // data: { messageData: message, }
        });
        passportdialog.afterClosed().subscribe(result => {
            if(result == 0){
                this.resetPassword();
            }else if(result == 1){
                this.gotoTop();
                this.completedSteps = 2;
                this.steps = 2;
            }
             
        });
    }



  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
    goBack() {
    this.resetPopups();
    this.router.navigateByUrl('/');
  }  

    moveTab(page) {
    this.gotoTop();
    if(page<4){
    this.totalCollectibleAmount=this.totalCollectibleAmountFromPartnerResponse;
    this.coupon_amount=0;
    }

 

    if (page <= this.completedSteps) {
      this.steps = page;
      this.completedSteps = page;
    }
  }
  
  bookingSessionExpires(e: CountdownEvent) {

    if (e.action == 'done') {
   //  $('#bookingprocessExpires').modal('show');
    }
  }

    submitBookingInfo() {
       
         if (this.idForm.invalid ) {
         return;
         }else{
        var IRCTCUserId = this.idForm.controls['userID']['value'];
        this.spinnerService.show();
        if (IRCTCUserId != "" && IRCTCUserId != undefined && IRCTCUserId != null) {
            //set IRCTC userid in cookie
            this.expiredDate.setDate(this.expiredDate.getDate() + 90);
            this.cookieService.set('user', btoa(JSON.stringify(IRCTCUserId)), this.expiredDate, '/','',true);

            this.userIdParam = {
                "userLoginId": IRCTCUserId
            };
            var userIdParamPost = {
                postData: this.EncrDecr.set(JSON.stringify(this.userIdParam))
            };

            var userIdParamStr = JSON.stringify(userIdParamPost);

            this._irctc.isIRCTCUser(userIdParamStr).subscribe(data => {
                this.response = data;
                this.spinnerService.hide();
                if (this.response.partnerResponse.status) {
                   
                var indexofsearchValue = AppConfig.successusers.indexOf(this.response.partnerResponse.status)

                    if(indexofsearchValue !== -1) { //**VALID & VERIFIED USER */
                        this.wsUserLogin = this.response.partnerResponse.userId;
                        this.userValidError = false;
                        this.errorInvalid = 0;
                        this.passengerForm.clearValidators();
                        this.passengerForm.updateValueAndValidity();
                        this.checkpassword();

                    let trackUrlParams = new HttpParams()
                    .set('current_url', window.location.href)
                    .set('category', 'IRCTC')
                    .set('event', 'Booking Review')
                    .set('metadata',JSON.stringify(this.EncrDecr.set(JSON.stringify(this.response.partnerResponse.userId))));

                    const track_body: string = trackUrlParams.toString();
                    this.rest.trackEvents( track_body).subscribe(result => {});

                    } else if (indexofsearchValue == -1) {//**NOT VERIFIED USER */
                        this.IRCTCUserError = "User not verified.Please re-enter";
                        this.userValidError = true;
                        this.submittedUserInfoForm = false;
                        this.errorInvalid = 1;
                    } else {
                        this.IRCTCUserError = "User not verified.Please re-enter";
                        this.userValidError = true;
                        this.submittedUserInfoForm = false;
                        this.errorInvalid = 1;
                    }
                } else if (this.response.partnerResponse.error) {
                    this.IRCTCUserError = this.response.partnerResponse.error;
                    this.userValidError = true;
                    this.submittedUserInfoForm = false;
                    this.errorInvalid = 1;
                } else {
                    this.IRCTCUserError = "User not valid.Please re-enter";
                    this.userValidError = true;
                    this.submittedUserInfoForm = false;
                    this.errorInvalid = 1;
                }
                this.validateBookingInfoForm();
            }, (err: HttpErrorResponse) => {
                this.spinnerService.hide();
                var message = 'Please check your internet connection !';
                const dialogRef = this.dialog.open(ConfirmationDialog, {
                    disableClose: true,
                    width: '600px',
                    id: 'messageforMliteDialog',
                    data: {
                        errorDialog: true,
                        messageData: message
                    }
                });
                this.userValidError = true;
                this.submittedUserInfoForm = false;
                this.errorInvalid = 1;
            });
        } else {
            this.spinnerService.hide();
            this.userValidError = true;
            this.submittedUserInfoForm = false;
            this.errorInvalid = 1;
            this.validateBookingInfoForm();
        }
      this.resetFormValidation();
      }
    }
    validateBookingInfoForm() {
    
        this.submittedUserInfoForm = true;
        //alert(this.idForm.invalid +" ### "+ this.errorInvalid);
        if (this.idForm.invalid || this.errorInvalid == 1) {
            this.moveTop();
            return;
        } else {
            this.errorInvalid = 0;
            this.getfareEnquiry();
        }
    }

    boardingStations() {
       
        this.traindate = this.seacthResult.searchHistory.journeyDate;
        this.fromstn = this.seacthResult.selectedTrain.fromStnCode;
        this.tostn = this.seacthResult.selectedTrain.toStnCode;
        this.trainnumber = this.seacthResult.selectedTrain.trainNumber;
        this.selectclass = this.seacthResult.journeyClass;
        this.trainName = this.seacthResult.selectedTrain.trainName;
        this.arrivalTime = this.seacthResult.selectedTrain.arrivalTime;
        this.departureTime = this.seacthResult.selectedTrain.departureTime;
        this.scheduletime = this.seacthResult.selectedTrain.departureTime;
        this.cateringCharge = this.seacthResult.fareData.cateringCharge
        this.enqClass = this.seacthResult.journeyClass;
        this.quota = this.seacthResult.journeyQuota;
        if (this.quota == "LD") {
            this.ladiesQuotaTrue = true;
        } else {
            this.ladiesQuotaTrue = false;
        }
        this.trainDateStr = this.traindate.replace(/-/g, "");

        this.stationParam = {
            "frmStn": this.fromstn,
            "journeyClass": this.selectclass,
            "journeyDate": this.trainDateStr,
            "toStn": this.tostn,
            "trainNo": this.trainnumber
        };
         this.spinnerService.show();
        var stationParamStr = JSON.stringify(this.stationParam);
        this._irctc.getBoardingStations(stationParamStr).subscribe(resp => {
            
	if( Array.isArray(resp.partnerResponse.boardingStationList) ){
	this.stationNames = resp.partnerResponse.boardingStationList;
	}else{
	var tmp=[];
	tmp.push(resp.partnerResponse.boardingStationList);
	this.stationNames=tmp;
	}
            
            
            this.defaultBoardingStation = this.stationNames[0]['stnNameCode'];
            this.trainSchedlue(this.defaultBoardingStation);
             this.spinnerService.hide();
        }, (err: HttpErrorResponse) => {
            var message = 'Something went wrong';
            this.dialog.open(ErrorDialog, {
                disableClose: true,
                id: 'messageforMliteDialog',
                data: {
                    messageData: message,
                    backSearchData: this.seacthResult.searchHistory
                }
            });
             this.spinnerService.hide();
        });
    }
        travelDuration:any;
    trainSchedlue(stationName) {
    
        if (stationName != '') {
            let stationCode = stationName.split(" - ");
            this.scheduleParam = {
                "journeyDate": this.trainDateStr,
                "startingStationCode": stationCode[1],
                "trainNo": this.trainnumber
            };
            var scheduleParamStr = JSON.stringify(this.scheduleParam);
            this._irctc.trainSchedlueDto(scheduleParamStr).subscribe(resp => {
               
                let reqjson = (resp);
                this.reqData = reqjson.partnerResponse.stationList;
                for (let appViewState of this.reqData) {
                    let stationCode = stationName.split(" - "); //get the station Code from station Name
                    if (appViewState.stationCode == stationCode[1]) {
                         var filtered = this.reqData.filter(a => a.stationCode == this.fromstn);
                        this.scheduletime = appViewState.departureTime;
                        //let trainrunningdayCount = Number(this.reqData[0].dayCount);
                        let trainrunningdayCount = Number(filtered[0]['dayCount']);
                        let selecteddayCount = Number(appViewState.dayCount);
                        
                        let convDate:any = moment(this.journeyDateactual);
                        this.boardingstnName =  stationCode[0];
                        let differenceDate = selecteddayCount - trainrunningdayCount;
                        if(differenceDate==0){this.traveldate = new Date(convDate)
                        }
                        else{
                            this.traveldate = new Date(convDate.add(differenceDate,'d'));  
                        }
                        
    
                var startTime = moment(moment(this.traveldate).format('DD-MM-YYYY')+' '+this.scheduletime, 'DD-MM-YYYY hh:mm');
                var endTime = moment(moment(this.journeyArrivalDate).format('DD-MM-YYYY')+' '+this.arrivalTime, 'DD-MM-YYYY hh:mm');
                

                var duration = moment.duration(endTime.diff(startTime));
                var hours = duration.asMinutes();
                this.travelDuration= Math.floor(hours / 60)+' hrs '+hours % 60+' mins';
  
                        
                    }
                }
            });
        }
    }

    /*------------------------------BOOKING INFORMATION SECTION ends-------------------------------------------------------*/

    /** ---------------------------------TRAVELLER INFORMATION SECTION begins-----------------------------------------------------------------***/
    /*special char & number & rupee symbol ( Rs.)*/
    flInput($event) {
        var keycode = $event.which;
        if ((keycode >= 33 && keycode <= 47) || (keycode >= 91 && keycode <= 96) || (keycode >= 48 && keycode <= 64) || (keycode == 8377)) {
            event.preventDefault();
        }
    }
    disableEsc($event) {
        var keycode = $event.which;
        if (keycode == 27) {
            event.preventDefault();
        }
    }
    /*number input */
    numberInput($event) {
        var keycode = $event.which;
        if (!(keycode >= 48 && keycode <= 57)) {
            event.preventDefault();
        }
    }
    AvoidSpace($event) {
        var keycode = $event.which;
        if (keycode == 32)
            event.preventDefault();
    }
    /*special char & rupee symbol ( Rs.)*/
    specialcharInput($event) {
        var keycode = $event.which;
        if ((keycode >= 33 && keycode <= 47) || (keycode >= 91 && keycode <= 96) || (keycode >= 58 && keycode <= 64) || (keycode >= 123 && keycode <= 126) || (keycode == 8377)) {
            event.preventDefault();
        }
    }
    specialcharInputAddress($event) {
        var keycode = $event.which;
        if ((keycode >= 33 && keycode <= 34) || (keycode >= 36 && keycode <= 43) || (keycode >= 60 && keycode <= 64) || (keycode >= 91 && keycode <= 96) || (keycode >= 123 && keycode <= 126) || (keycode == 8377) || (keycode == 8364) || (keycode == 128) || (keycode == 163) ||
            (keycode == 165)) {
            event.preventDefault();
        }
    }
    /*special char and small characters & rupee symbol ( Rs.)*/
    specialCharandSmallCharInput($event) {
        var keycode = $event.which;
        if ((keycode >= 33 && keycode <= 47) || (keycode >= 91 && keycode <= 127) || (keycode >= 58 && keycode <= 64) || (keycode == 8377)) {
            event.preventDefault();
        }
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

    
    resetFormValidation(){
    this.submitted=false;
     this.passengerForm.markAsUntouched();
    this.passengerForm.setErrors(null);
    }

    getfareEnquiry() {
       
        this.traindate = this.seacthResult.searchHistory.journeyDate;
        this.trainDateStr = this.traindate.replace(/-/g, "");
        this.fromstn = this.seacthResult.selectedTrain.fromStnCode;
        this.tostn = this.seacthResult.selectedTrain.toStnCode;
        this.trainnumber = this.seacthResult.selectedTrain.trainNumber;
        this.journeyClass = this.seacthResult.journeyClass;
        this.journeyQuota = this.seacthResult.journeyQuota;
        this.fareEnquiryArr = {
            "frmStn": this.fromstn,
            "journeyDate": this.trainDateStr,
            "journeyClass": this.journeyClass,
            "journeyQuota": this.journeyQuota,
            "paymentEnqFlag": "N",
            "toStn": this.tostn,
            "trainNo": this.trainnumber
        };
        if (this.fareEnquiryArr.journeyClass == "SL" || this.fareEnquiryArr.journeyClass == "2S") {
            this.showgst = false;
        }
        var fareEnquiryStr = JSON.stringify(this.fareEnquiryArr);

        this._irctc.fareEnquiry(fareEnquiryStr).subscribe(response => {
            let dData = JSON.parse(this.EncrDecr.get(response.result));
            this.fareEnqResponse = dData;
            if (!this.fareEnqResponse['partnerResponse']['errorMessage']) {
                //console.log(dData);
                var applicableBerthTypes = [];

                if (Array.isArray(this.fareEnqResponse['partnerResponse']['bkgCfg']['applicableBerthTypes'])) {
                    this.applicableBerthTypes = this.fareEnqResponse['partnerResponse']['bkgCfg']['applicableBerthTypes'];
                } else {
                    applicableBerthTypes.push(this.fareEnqResponse['partnerResponse']['bkgCfg']['applicableBerthTypes']);
                    this.applicableBerthTypes = applicableBerthTypes;
                }

                this.travelInsuranceEnabled= this.fareEnqResponse['partnerResponse']['bkgCfg'].travelInsuranceEnabled;
                this.maxPassengers = this.fareEnqResponse['partnerResponse']['bkgCfg'].maxPassengers;
                this.maxInfants = this.fareEnqResponse['partnerResponse']['bkgCfg'].maxInfants;
                this.minNameLength = this.fareEnqResponse['partnerResponse']['bkgCfg'].minNameLength;
                this.maxNameLength = this.fareEnqResponse['partnerResponse']['bkgCfg'].maxNameLength;
                this.maxPassengerAge = this.fareEnqResponse['partnerResponse']['bkgCfg'].maxPassengerAge;
                this.minPassengerAge = this.fareEnqResponse['partnerResponse']['bkgCfg'].minPassengerAge;

                this.maxChildAge = this.fareEnqResponse['partnerResponse']['bkgCfg'].maxChildAge;
                this.srctzWomenAge = this.fareEnqResponse['partnerResponse']['bkgCfg'].srctnwAge;
                this.srctzMenAge = this.fareEnqResponse['partnerResponse']['bkgCfg'].srctznAge;
                this.srctzTransgenderAge = this.fareEnqResponse['partnerResponse']['bkgCfg'].srctzTAge;

                this.minPassportLength = this.fareEnqResponse['partnerResponse']['bkgCfg'].minPassportLength;
                this.maxPassportLength = this.fareEnqResponse['partnerResponse']['bkgCfg'].maxPassportLength;

                this.childBerthMandatory = this.fareEnqResponse['partnerResponse']['bkgCfg'].childBerthMandatory;

                this.isDestAddressrequired = this.fareEnqResponse['partnerResponse']['bkgCfg'].captureAddress;
                if(this.isDestAddressrequired == 1){
                    this.showDestAddressBox = true;
                    this.passengerForm.controls['destAddressOne'].setValidators([Validators.required,Validators.pattern("^[#.0-9a-zA-Z\s, -]+$")]);
                    this.passengerForm.controls['destAddressTwo'].setValidators([Validators.pattern("^[#.0-9a-zA-Z\s, -]+$")]);
                    this.passengerForm.controls['destAddressPin'].setValidators([Validators.required,Validators.minLength(6)]);
                    this.passengerForm.controls['destAddressState'].setValidators([Validators.required]);
                    this.passengerForm.controls['destAddressCity'].setValidators([Validators.required]);
                    this.passengerForm.controls['destAddressPost'].setValidators([Validators.required]);
                    this.passengerForm.controls['destAddressOne'].updateValueAndValidity();
                    this.passengerForm.controls['destAddressTwo'].updateValueAndValidity();
                    this.passengerForm.controls['destAddressThree'].updateValueAndValidity();
                    this.passengerForm.controls['destAddressPin'].updateValueAndValidity();
                    this.passengerForm.controls['destAddressState'].updateValueAndValidity();
                    this.passengerForm.controls['destAddressCity'].updateValueAndValidity();
                    this.passengerForm.controls['destAddressPost'].updateValueAndValidity();

                }else {
                    this.showDestAddressBox = false;
                    this.passengerForm.get('destAddressOne').clearValidators();
                    this.passengerForm.get('destAddressTwo').clearValidators();
                    this.passengerForm.get('destAddressThree').clearValidators();
                    this.passengerForm.get('destAddressPin').clearValidators();
                    this.passengerForm.get('destAddressState').clearValidators();
                    this.passengerForm.get('destAddressCity').clearValidators();
                    this.passengerForm.get('destAddressPost').clearValidators();
                    this.passengerForm.controls['destAddressOne'].updateValueAndValidity();
                    this.passengerForm.controls['destAddressTwo'].updateValueAndValidity();
                    this.passengerForm.controls['destAddressThree'].updateValueAndValidity();
                    this.passengerForm.controls['destAddressPin'].updateValueAndValidity();
                    this.passengerForm.controls['destAddressState'].updateValueAndValidity();
                    this.passengerForm.controls['destAddressCity'].updateValueAndValidity();
                    this.passengerForm.controls['destAddressPost'].updateValueAndValidity();
                }
                

                if (this.fareEnqResponse['partnerResponse']['bkgCfg'].forgoConcession == 'false') {
                    this.forgoConcession = false;
                } else if (this.fareEnqResponse['partnerResponse']['bkgCfg'].forgoConcession == 'true') {
                    this.forgoConcession = true;
                    this.concessionOpted = true;
                }

                if (this.fareEnqResponse['partnerResponse']['bkgCfg'].seniorCitizenApplicable == 'false') {
                    this.concessionOpted = false;
                } else if (this.fareEnqResponse['partnerResponse']['bkgCfg'].seniorCitizenApplicable == 'true') {
                    this.concessionOpted = true;
                }
                //console.log(this.fareEnqResponse);

                if (this.fareEnqResponse['partnerResponse']['bkgCfg'].seniorCitizenApplicable == 'false') {
                    this.seniorCitizenApplicable = false;
                    this.concessionalMsg = 'No concessional tickets allowed for this Train/Quota/Class.';
                } else if (this.fareEnqResponse['partnerResponse']['bkgCfg'].seniorCitizenApplicable == 'true') {
                    this.seniorCitizenApplicable = true;
                    this.concessionalMsg = '';
                }


                if (this.fareEnqResponse['partnerResponse']['bkgCfg'].gatimaanTrain == 'false') {
                    this.seniorCitizenApplicable = false;
                } else if (this.fareEnqResponse['partnerResponse']['bkgCfg'].gatimaanTrain == 'true') {
                    this.seniorCitizenApplicable = true;
                }




                if (this.fareEnqResponse['partnerResponse']['bkgCfg'].bedRollFlagEnabled == 'false') {
                    this.optBedRollStatus = false;
                } else if (this.fareEnqResponse['partnerResponse']['bkgCfg'].bedRollFlagEnabled == 'true') {
                    this.optBedRollStatus = true;
                }
                if (this.fareEnqResponse['partnerResponse']['bkgCfg']['foodChoiceEnabled'] == 'false') {
                    this.foodChoiceEnabled = false;
                } else {
                    this.passengerForm.addControl('passengerMealPreference0', new FormControl('', [Validators.required]));
                    this.passengerForm.controls['passengerMealPreference0'].updateValueAndValidity();
                    this.foodChoiceEnabled = true;
                    if (this.fareEnqResponse['partnerResponse']['bkgCfg'].foodDetails) {
                        this.foodDetails = this.fareEnqResponse['partnerResponse']['bkgCfg'].foodDetails;
                    }
                }
                this._irctc.countryList().subscribe(responseCountry => {
                    this.country = (responseCountry);
                    this.countries = this.country['partnerResponse']['countryList'];
                    this.defaultCountry = "IN";
                });

                this.passengerForm.controls['passengerMobile'].updateValueAndValidity();
                this.passengerForm.controls['passengerEmail'].updateValueAndValidity();

                let trackUrlParams = new HttpParams()
                .set('current_url', window.location.href)
                .set('category', 'IRCTC')
                .set('event', 'Checkout ')
                .set('metadata',JSON.stringify(dData));

                const track_body: string = trackUrlParams.toString();
                this.rest.trackEvents( track_body).subscribe(result => {});


            } else {

                var message;
                if (this.fareEnqResponse['partnerResponse']['errorMessage'])
                    message = this.fareEnqResponse['partnerResponse']['errorMessage'];
                else
                    message = 'Something went wrong';

                this.dialog.open(ErrorDialog, {
                    disableClose: true,
                    id: 'messageforMliteDialog',
                    data: {
                        messageData: message,
                        backSearchData: this.seacthResult.searchHistory
                    }
                });


            }


        });

    }


    seniorCitizenArr(genderSelectArr, i) {
        this.genderArr[i] = genderSelectArr;
        
        
        if (this.genderArr[i] == 'M') {
            if ((Number(this.age) >= Number(this.srctzMenAge))) {
                this.seniorCitizenEnabledArr[i] = true;
            } else {
                this.seniorCitizenEnabledArr[i] = false;

            }
        } else if (this.genderArr[i] == 'F') {
            if ((Number(this.age) >= Number(this.srctzWomenAge))) {
                this.seniorCitizenEnabledArr[i] = true;
            } else {
                this.seniorCitizenEnabledArr[i] = false;

            }
        } else if (this.genderArr[i] == 'T') {
            if ((Number(this.age) >= Number(this.srctzTransgenderAge))) {
                this.seniorCitizenEnabledArr[i] = true;
            } else {
                this.seniorCitizenEnabledArr[i] = false;

            }
        } else {
            this.seniorCitizenEnabledArr[i] = false;

        }


        this.maxAgeLimitArr(i);
    }
    maxAgeLimitArr(i) {
        let age = this.passengerForm.controls['passengerAge' + i].value;
        if (this.quota == "LD" && (this.genderArr[i] == "M" || this.genderArr[i] == "T") && Number(age) > Number(this.maxChildAge)) {

            var message = 'For ladies quota, male passenger should not be older than 11 yr.';
            const dialogRef = this.dialog.open(ConfirmationDialog, {
                disableClose: true,
                width: '600px',
                id: 'messageforMliteDialog',
                data: {
                    errorDialog: true,
                    messageData: message
                }
            });
            dialogRef.afterClosed().subscribe(result => {
                this.passengerForm.patchValue({
                    ['passengerAge' + i]: '',
                })
            });
        }

        if ((Number(age) > Number(this.maxPassengerAge)) || (Number(age) < Number(this.minPassengerAge))) {
            this.ageValidErrorArr[i] = "Please enter a valid age between " + this.minPassengerAge + " and " + this.maxPassengerAge;
            this.error = 1;

        } else {
            this.ageValidErrorArr[i] = "";
            this.error = 0;
        }
       
        if (Number(age) != 0 || Number(age) != null) {
            
            if ((Number(age) >= Number(this.minPassengerAge)) && (Number(age) <= Number(this.maxChildAge))) {
                this.optChildBerthStatusArr[i] = true;
                if(this.childBerthMandatory == 'true')
                this.optChildBerthStatusArr[i] = false;
            } else {
                this.optChildBerthStatusArr[i] = false; 
            }
        } else {
            this.optChildBerthStatusArr[i] = true;
        }
        if (this.genderArr[i] == 'M') {
            if ((Number(age) >= Number(this.srctzMenAge) && ((this.defaultCountryArr[i] == "IN"))) && this.fareEnqResponse['partnerResponse']['bkgCfg'].seniorCitizenApplicable == 'true') 
            {
                this.seniorCitizenEnabledArr[i] = true;
                this.passengerForm.controls['passengerSeniorCitizen'+i].setValidators([Validators.required]);
                this.passengerForm.controls['passengerSeniorCitizen' + i].updateValueAndValidity();
            } else {
                this.seniorCitizenEnabledArr[i] = false;
                this.passengerForm.controls['passengerSeniorCitizen'+i].clearValidators();
                this.passengerForm.controls['passengerSeniorCitizen' + i].updateValueAndValidity();
                this.passengerForm['controls']['passengerSeniorCitizen' + i].setValue('');
                this.resetFormValidation();
               
            }
        } else if (this.genderArr[i] == 'F') {
            if ((Number(age) >= Number(this.srctzWomenAge)&& (this.defaultCountryArr[i] == "IN"))&& this.fareEnqResponse['partnerResponse']['bkgCfg'].seniorCitizenApplicable == 'true') 
            {
                this.seniorCitizenEnabledArr[i] = true;
                this.passengerForm.controls['passengerSeniorCitizen'+i].setValidators([Validators.required]);
                this.passengerForm.controls['passengerSeniorCitizen' + i].updateValueAndValidity();
            } else {
                this.seniorCitizenEnabledArr[i] = false;
                this.passengerForm.controls['passengerSeniorCitizen'+i].clearValidators();
                this.passengerForm.controls['passengerSeniorCitizen' + i].updateValueAndValidity();
                this.passengerForm['controls']['passengerSeniorCitizen' + i].setValue('');
                this.resetFormValidation();
                  }
        } else if (this.genderArr[i] == 'T') {
            if ((Number(age) >= Number(this.srctzTransgenderAge) && (this.defaultCountryArr[i] == "IN"))&& this.fareEnqResponse['partnerResponse']['bkgCfg'].seniorCitizenApplicable == 'true') {
                this.seniorCitizenEnabledArr[i] = true;
                this.passengerForm.controls['passengerSeniorCitizen'+i].setValidators([Validators.required]);
                this.passengerForm.controls['passengerSeniorCitizen' + i].updateValueAndValidity();
            } else {
                this.seniorCitizenEnabledArr[i] = false;
                this.passengerForm.controls['passengerSeniorCitizen'+i].clearValidators();
                this.passengerForm.controls['passengerSeniorCitizen' + i].updateValueAndValidity();
                this.passengerForm['controls']['passengerSeniorCitizen' + i].setValue('');
                this.resetFormValidation();
            }
        } else {
            this.seniorCitizenEnabledArr[i] = false;

        }


    }
    optChildBerth(event) {
        var marked = event.target.checked;
        //alert(marked);
        if (marked == true) {
            var message = 'Full fare will be charged if seat/berth is opted for child';
        } else if (marked == false) {
            var message = 'No berth will be allotted for child and half of the adult fare will be charged';
        }
        const dialogRef = this.dialog.open(ConfirmationDialog, {
            disableClose: true,
            width: '600px',
            id: 'messageforMliteDialog',
            data: {
                errorDialog: true,
                messageData: message
            }
        });
    }
    count: Number = 0;
    optBedRoll(event, i) {
        if (i == null) {
            var marked = this.passengerForm.controls['optBedRoll'].value;
            if (marked == true) {
                this.bedRollCharge = 25;
                var message = 'A fare of Rs.25 will be charged for each bed roll';
                const dialogRef = this.dialog.open(ConfirmationDialog, {
                    disableClose: true,
                    width: '600px',
                    id: 'messageforMliteDialog',
                    data: {
                        errorDialog: true,
                        messageData: message
                    }
                });
            } else if (marked == false) {
                this.bedRollCharge = 0;
            }
        } else if (i != null) {
            if (this.passengerForm.controls['optBedRoll' + i].value == true) {
                var message = 'A fare of Rs.25 will be charged for each bed roll';
                const dialogRef = this.dialog.open(ConfirmationDialog, {
                    disableClose: true,
                    width: '600px',
                    id: 'messageforMliteDialog',
                    data: {
                        errorDialog: true,
                        messageData: message
                    }
                });
                this.count = Number(this.count) + 1;
            } else if (this.passengerForm.controls['optBedRoll' + i].value == false) {
                this.count = Number(this.count) - 1;
            }
        }
        this.TOTAL_bedRollCharge = Number(this.bedRollCharge) + 25 * Number(this.count);
    }


    countrySelectAddMore(i) {
       
        if (this.defaultCountryArr[i] != 'IN') {
            
            this.seniorCitizenApplicableArr[i] = false;
            this.showTravelDocumentAddMore[i] = true;
            
            
            /***VALIDATION OF TRAVEL DOCUMENT & CARD NO FIELDS **/
            if(i==0){ 
                this.passengerForm.controls['passengerTravelDocument'+ i].setValidators([Validators.required]);
                this.passengerForm.controls['passengerTravelDocCardNo'+ i].setValidators([Validators.required, Validators.minLength(this.minPassportLength),Validators.pattern('^(?!^0+$)[a-zA-Z0-9]{6,9}$')]);
                this.passengerForm.controls['passengerTravelDocument'+ i].setValidators([Validators.required]);
                this.passengerForm.controls['passengerTravelDocCardNo'+ i].setValidators([Validators.required, Validators.minLength(this.minPassportLength),Validators.pattern('^(?!^0+$)[a-zA-Z0-9]{6,9}$')]);
                this.passengerForm.controls['foreignPassengerDOB'+i].setValidators([Validators.required]);
                this.seniorCitizenEnabledArr[i] = false;
                this.passengerForm.controls['passengerSeniorCitizen'+i].clearValidators();
                this.passengerForm.controls['passengerSeniorCitizen' + i].updateValueAndValidity();
                this.passengerForm['controls']['passengerSeniorCitizen' + i].setValue('');
                this.resetFormValidation();
            }else if(i>0){ 
                this.seniorCitizenEnabledArr[i] = false;
                this.passengerForm.controls['passengerSeniorCitizen'+i].clearValidators();
                this.passengerForm.controls['passengerSeniorCitizen' + i].updateValueAndValidity();
                this.passengerForm['controls']['passengerSeniorCitizen' + i].setValue('');
                this.resetFormValidation();
                this.passengerForm.addControl('passengerTravelDocument' + i, new FormControl('', [Validators.required]));
                this.passengerForm.addControl('passengerTravelDocCardNo' + i, new FormControl('', [Validators.required, Validators.minLength(this.minPassportLength),Validators.pattern('^(?!^0+$)[a-zA-Z0-9]{6,9}$')]));
                this.passengerForm.addControl('foreignPassengerDOB'+i,new FormControl('',[Validators.required]));
            }
            
            this.seniorCitizenEnabledArr[i] = false;
                // this.passengerForm.controls['passengerSeniorCitizen'+i].clearValidators();
                // this.passengerForm.controls['passengerSeniorCitizen' + i].updateValueAndValidity();
                // this.passengerForm['controls']['passengerSeniorCitizen' + i].setValue('');
                // this.resetFormValidation();
              
            this.passengerForm.controls['passengerTravelDocument'+ i].setValidators([Validators.required]);
            this.passengerForm.controls['passengerTravelDocCardNo'+ i].setValidators([Validators.required, Validators.minLength(this.minPassportLength),Validators.pattern('^(?!^0+$)[a-zA-Z0-9]{6,9}$')]);
            
            this.passengerForm.controls['foreignPassengerDOB'+ i].setValidators([Validators.required]);

          this.passengerForm.controls['passengerTravelDocument' + i].updateValueAndValidity();
          this.passengerForm.controls['passengerTravelDocCardNo' + i].updateValueAndValidity();
          this.passengerForm.controls['foreignPassengerDOB'+ i].updateValueAndValidity();
            
            this.passengerForm['controls']['passengerSeniorCitizen' + i].setValue('');
            if(this.defaultCountryArr[i] != 'IN' && this.defaultCountryArr[i] != undefined){
                let message = "Citizen of foreign countries are not eligible for travel insurance"
                let dialogRef = this.dialog.open(ConfirmationDialogNew, {
                    disableClose: true,
                    width: '600px',
                    data: { messageData: message}
                });
            }
            
        } else {
            this.showTravelDocumentAddMore[i] = false;
                this.seniorCitizenApplicableArr[i] = true;
                this.maxAgeLimitArr(i);
           
            if (this.passengerForm.controls['passengerTravelDocument' + i]) {
                this.passengerForm.get('passengerTravelDocument' + i).clearValidators();
                this.passengerForm.controls['passengerTravelDocument' + i].updateValueAndValidity();
                this.passengerForm.get('passengerTravelDocCardNo' + i).clearValidators();
                this.passengerForm.controls['passengerTravelDocCardNo' + i].updateValueAndValidity();
                this.passengerForm.controls['foreignPassengerDOB' + i].clearValidators();
                this.passengerForm.controls['foreignPassengerDOB' + i].updateValueAndValidity();
                this.passengerForm.controls['passengerTravelDocument' + i].reset();
                this.passengerForm.controls['passengerTravelDocCardNo' + i].reset();
                this.passengerForm.controls['foreignPassengerDOB' + i].reset();

            }
        }
    }
    gstToggle() {   
        this.gstshow = !this.gstshow;
        this.gstSelected = !this.gstSelected;
        this.passengerForm.get('gstNumber').clearValidators();
        this.passengerForm.get('gstBusinessName').clearValidators();
        this.passengerForm.get('gstAddress').clearValidators();
        this.passengerForm.get('gstCity').clearValidators();
        this.passengerForm.get('gstPincode').clearValidators();
        this.passengerForm.get('gstState').clearValidators();
        this.passengerForm.controls['gstNumber'].updateValueAndValidity();
        this.passengerForm.controls['gstBusinessName'].updateValueAndValidity();
        this.passengerForm.controls['gstAddress'].updateValueAndValidity();
        this.passengerForm.controls['gstCity'].updateValueAndValidity();
        this.passengerForm.controls['gstPincode'].updateValueAndValidity();
        this.passengerForm.controls['gstState'].updateValueAndValidity();
        this.passengerForm.get('saveGST').clearValidators();
        this.passengerForm.controls['saveGST'].updateValueAndValidity();
       

            this.passengerForm['controls']['gstNumber'].setValue('');
            this.passengerForm['controls']['gstBusinessName'].setValue('');
            this.passengerForm['controls']['gstAddress'].setValue('');
            this.passengerForm['controls']['gstCity'].setValue('');
            this.passengerForm['controls']['gstPincode'].setValue('');
            this.passengerForm['controls']['gstState'].setValue('');
              this.passengerForm['controls']['saveGST'].setValue('');
    }
   
gstReset(){
 
      for(let i=0;i<this.GSTListLength;i++){
            this.isCheckedGST[i]=false;
          }
 
              this.passengerForm['controls']['gstNumber'].setValue('');
              this.passengerForm['controls']['gstBusinessName'].setValue('');
              this.passengerForm['controls']['gstAddress'].setValue('');
              this.passengerForm['controls']['gstPincode'].setValue('');
              this.passengerForm['controls']['gstCity'].setValue('');
              this.passengerForm['controls']['gstState'].setValue('');
 }
 travellerReset(){
    this.selectedCheckbox = [];
      this.travellersFilledArray = [];
    for(let i=0;i<this.checkPaxCount;i++){
      this.disableCheckbox[i]=false;
      this.modalcheckedvalue[i]=false;
    }
    
      
    if (this.travellersArray.length > 0) {
        for (let i of this.travellersArray) {
            this.passengerForm.controls['passengerAge' + i].setValue('');
            this.passengerForm.controls['passengerBerthChoice' + i].setValue('');
            this.passengerForm.controls['passengerName' + i].setValue('');
            this.passengerForm.controls['passengerGender' + i].setValue('');
        }
    }
    
       this.selectedCheckboxInfant = [];
      this.infanttravellersFilledArray = [];
    for(let i=0;i<this.checkinfantPaxCount;i++){
      this.disableCheckboxInfant[i]=false;
      this.modalcheckedvalueInfant[i]=false;
    }
    
      
    if (this.travellersArray.length > 0) {
        for (let i of this.childrenArray) {
            this.passengerForm.controls['childAge' + i].setValue('');
            this.passengerForm.controls['childName' + i].setValue('');
            this.passengerForm.controls['childGender' + i].setValue('');
        }
    }
    
    
}

    passengerReservationChoiceFun(e) {
        this.passengerReservationChoice = e.target.value;
    }



    passengerItineraryDetails: any = []; TravelInsuranceMarked: string;


    checkData:string = "0";
    showDatepickerforDOB:boolean = false;
    checkforeign(){
           
            for (let i of this.travellersArray) {
                if (this.passengerForm.controls['passengerNationality'+i]['value'] != "IN") {
                    this.checkData = "1";
                    break;
                } 
                else {
                    this.checkData = "0";
                }
            }

            if (this.checkData == "1") {
                let message = "Foreigner should carry the same passport while travelling.";
                let passportdialog = this.dialog.open(passportDialog, {
                    disableClose: true,
                    width: '600px',
                    data: { messageData: message, }
                });
                passportdialog.afterClosed().subscribe(result => {
                    this.createTrainItinerary2();
                });
            }  
            else
            this.createTrainItinerary2();
            
    }

    createTrainItinerary() {
        alertify.set('notifier', 'position', 'top-center');
         alertify.dismissAll();
         this.resetPopups();
        if (this.travellersArray.length< 1) {
        alertify.error('Please add adult traveller', '').delay(3);
        return;
        }

    
    
        this.submitted = true;
        if (this.gstSelected == true) {
            this.passengerForm.controls['gstNumber'].setValidators([Validators.required, Validators.pattern('^([0]{1}[1-9]{1}|[1]{1}[0-9]{1}|[2]{1}[0-7]{1}|[2]{1}[9]{1}|[3]{1}[0-7]{1})[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}[a-zA-Z0-9]{3}$'), Validators.minLength(15)]);
            this.passengerForm.controls['gstBusinessName'].setValidators([Validators.required, Validators.pattern("^[a-z A-Z 0-9]*$"), Validators.minLength(2)]);
            this.passengerForm.controls['gstAddress'].setValidators([Validators.required, Validators.pattern("^[a-z A-Z 0-9 /,]*$"), Validators.minLength(2)]);
            this.passengerForm.controls['gstCity'].setValidators([Validators.required, Validators.pattern(this.patternName), Validators.minLength(2)]);
            this.passengerForm.controls['gstPincode'].setValidators([Validators.required, Validators.minLength(6)]);
            this.passengerForm.controls['gstState'].setValidators([Validators.required, Validators.pattern(this.patternName), Validators.minLength(2)]);
            this.passengerForm.controls['gstNumber'].updateValueAndValidity();
            this.passengerForm.controls['gstBusinessName'].updateValueAndValidity();
            this.passengerForm.controls['gstAddress'].updateValueAndValidity();
            this.passengerForm.controls['gstCity'].updateValueAndValidity();
            this.passengerForm.controls['gstPincode'].updateValueAndValidity();
            this.passengerForm.controls['gstState'].updateValueAndValidity();
        } else {
            this.passengerForm.get('gstNumber').clearValidators();
            this.passengerForm.get('gstBusinessName').clearValidators();
            this.passengerForm.get('gstAddress').clearValidators();
            this.passengerForm.get('gstCity').clearValidators();
            this.passengerForm.get('gstPincode').clearValidators();
            this.passengerForm.get('gstState').clearValidators();
            this.passengerForm.controls['gstNumber'].updateValueAndValidity();
            this.passengerForm.controls['gstBusinessName'].updateValueAndValidity();
            this.passengerForm.controls['gstAddress'].updateValueAndValidity();
            this.passengerForm.controls['gstCity'].updateValueAndValidity();
            this.passengerForm.controls['gstPincode'].updateValueAndValidity();
            this.passengerForm.controls['gstState'].updateValueAndValidity();
        }

        if (this.passengerForm.invalid || this.error == 1) {
         this.passengerForm.markAllAsTouched();
        let target;
        target = this.el.nativeElement.querySelector('.ng-invalid')
        if (target) {
        $('html,body').animate({ scrollTop: $(target).offset().top }, 'slow');
        target.focus();
        }  
         return;  
        } else {
         this.generateTrainItinerary();
         this.continueReviewBooking();
        }

    }
    

    
        continueReviewBooking(){
        
           if( this.enablesavedTraveller==1)
            this.saveTravellerFunc();
           
            if (this.availFlag == 1 || this.forgoFiftyFlag == 1 || this.forgoFullFlag == 1 || this.availFlag1 == 1 || this.forgoFiftyFlag1 == 1 || this.forgoFullFlag1 == 1) {
                var message;
                var showC;
                if (this.availFlag == 1 || this.availFlag1 == 1) {
                    message = 'You have availed senior citizen concession. Please carry a proof of your age while travelling to produce on demand. Selected option is applicable for this booking transaction only. Please click on \'OK\' to continue the booking';
                    showC = true;
                }

                if (this.forgoFiftyFlag == 1 || this.forgoFiftyFlag1 == 1) {
                    message = 'Thank you for forgoing 50% of the Senior Citizen Concession amount. Please carry a proof of your age while travelling to produce on demand.Selected option is applicable for this booking transaction only.';
                    showC = false;
                }


                if (this.forgoFullFlag == 1 || this.forgoFullFlag1 == 1) {
                    message = 'Thank you for forgoing Senior Citizen Concession. Selected option is applicable for this booking transaction only.';
                    showC = false;
                }


            let dialogRef = this.dialog.open(ConfirmationDialogNew, {
                    disableClose: true,
                    width: '850px',
                    data: { messageData: message, showC: showC }
                });

                dialogRef.afterClosed().subscribe(result => {
                    if (result == 1) {
                        this.createTrainItinerary2();
                    }
                });
            } else {
                   if(this.showTravelDocumentAddMore == [true]){
                        let message = "Foreigner should carry the same passport while travelling.";
                        let dialogRef = this.dialog.open(passportDialog, {
                            disableClose: true,
                            width: '600px',
                            data: { messageData: message, }
                        });
                    }

                    this.checkforeign();
                 
            }
        
        
     
        }
        
        
    opencovidconfirmationDialog(): void {
        if(this.trainItenararyCovidPopup ==1){
        const dialogRef = this.dialog.open(covidconfirmation, {
          autoFocus: false,
          panelClass: 'alert_covid',
          disableClose: true
        });


        dialogRef.afterClosed().subscribe(result => {
            if(result){
                      this.gotoTop();
        this.completedSteps = 4;
        this.steps = 4;
            }
           });
        }else{
                   this.gotoTop();
        this.completedSteps = 4;
        this.steps = 4;
        }
    }



whatsAppCheck:boolean=false;
    createTrainItinerary1() {
        
        if(this.travelInsuranceEnabled=='true'){
        
        //traveller insurance popup
        const dialogTravel = this.dialog.open(TravelInsuranceDialog, {
            disableClose: true,
            width: '600px',
            id: 'messageforMliteDialog',
        });
         dialogTravel.afterClosed().subscribe(result => {

            if (result == '1') {
                this.travelInsuranceOpted = true;
                this.travel_ins_charge = 0.42 * (Number(this.travellersArray.length) + 1);
                this.travel_ins_charge_tax = 0.07 * (Number(this.travellersArray.length) + 1);
                this.totalCollectibleAmount = (this.seacthResult.fareData.totalCollectibleAmount * (Number(this.travellersArray.length) + 1)) + this.convenience_fee + Number(this.travel_ins_charge);
               
            } else {
                this.travelInsuranceOpted = false;
                this.travel_ins_charge = 0;
                this.travel_ins_charge_tax = 0;
                this.totalCollectibleAmount = (this.seacthResult.fareData.totalCollectibleAmount * (Number(this.travellersArray.length) + 1)) + this.convenience_fee + Number(this.travel_ins_charge);
                
            }
 	 this.createTrainItinerary2();
        });
        
       
        }else{
	this.travelInsuranceOpted = false;
	this.travel_ins_charge = 0;
	this.travel_ins_charge_tax = 0;
	this.totalCollectibleAmount = (this.seacthResult.fareData.totalCollectibleAmount * (Number(this.travellersArray.length) + 1)) + this.convenience_fee + Number(this.travel_ins_charge);
        
         this.createTrainItinerary2();
        } 

    }
    contactDatails:any;
    createTrainItinerary2 (){
    
    
        if (this.passengerForm.controls['travelInsurence']['value'] == true) {
        this.travelInsuranceOpted = true;
        this.travel_ins_charge = 0.42 * (Number(this.travellersArray.length) + 1);
        this.travel_ins_charge_tax = 0.07 * (Number(this.travellersArray.length) + 1);
        this.totalCollectibleAmount = (this.seacthResult.fareData.totalCollectibleAmount * (Number(this.travellersArray.length) + 1)) + this.convenience_fee + Number(this.travel_ins_charge);
        } else {
        this.travelInsuranceOpted = false;
        this.travel_ins_charge = 0;
        this.travel_ins_charge_tax = 0;
        this.totalCollectibleAmount = (this.seacthResult.fareData.totalCollectibleAmount * (Number(this.travellersArray.length) + 1)) + this.convenience_fee + Number(this.travel_ins_charge);

        }

        this.error = 0;
        this.generateTrainItinerary();
        this.spinnerService.show();

        var irctcPassData = {
        postData: this.EncrDecr.set(JSON.stringify(this.passengerItineraryDetails))
        };

             
                

            this._irctc.fareEnquiryMultiplePassengers(irctcPassData).subscribe(response => {
                let dData = JSON.parse(this.EncrDecr.get(response.result));
                this.fareEnqueryMultiplePassengers = <fareEnqueryMultiplePassengers>dData;
                var partnerResponse = (this.fareEnqueryMultiplePassengers.partnerResponse);
                if (this.fareEnqueryMultiplePassengers.errorcode == 0 && !this.fareEnqueryMultiplePassengers.partnerResponse.errorMessage) {
                    this.irctcData = this.passengerItineraryDetails;
                    this.clientTransactionId = partnerResponse.clientTransactionId;
                    this.orderReferenceNumber = partnerResponse.orderReferenceNumber;
                    this.buttonstatus = false;
         
                    
                    this.flexipaysummry = false;
                    var whatsappFlag;
                    if (this.whatsappFeature == 1){
                        whatsappFlag = this.passengerForm.controls['whatsappFlag']['value'];
                        this.whatsAppCheck=true;
                    }else{
                        whatsappFlag = 0;
                         this.whatsAppCheck=false;
                    }
                    this.contactDetails = {
                        "mobile": this.passengerForm.controls['passengerMobile']['value'],
                        "country_code": "91",
                        "whatsappFlag": this.passengerForm.controls['whatsappFlag']['value'],
                    }

                    if (typeof partnerResponse.baseFare === "undefined") { } else {
                                        
                         this.convienceChargesEnable=partnerResponse.convienceChargesEnable;
                         this.agent_charges=partnerResponse.agent_charges;
                         this.campiagn_agent_charges=partnerResponse.campiagn_agent_charges;
                         
                        if(this.campiagn_agent_charges==0 )
                         this.convenience_fee = 0;
                        else if(this.campiagn_agent_charges < this.agent_charges )
                         this.convenience_fee =(this.agent_charges -this.campiagn_agent_charges) ;
                        else
                        this.convenience_fee = this.agent_charges;
                        
                       
                       
                        
                        //FARE DETAILS CALCULATION
                        this.totalTicketFare = partnerResponse.totalFare;
                        this.baseFare = partnerResponse.baseFare;
                        this.serviceTax = partnerResponse.serviceTax;
                        this.reservationCharge = partnerResponse.reservationCharge;
                        this.superfastCharge = partnerResponse.superfastCharge;
                        this.dynamicFare = partnerResponse.dynamicFare;
                        this.travel_ins_charge = partnerResponse.travelInsuranceCharge;
                        this.travel_ins_charge_tax = partnerResponse.travelInsuranceServiceTax;
                        this.wp_charge = partnerResponse.wpServiceCharge;
                        this.wp_charge_tax = partnerResponse.wpServiceTax;
                        this.concession = partnerResponse.totalConcession;

                        this.totalCollectibleAmount = Number(partnerResponse.totalCollectibleAmount) + Number(this.convenience_fee);
                        this.totalCollectibleAmountFromPartnerResponse=Number(partnerResponse.totalCollectibleAmount);
                        //this.couponapplyamount = Number(partnerResponse.totalCollectibleAmount);

                        //this.pgCharges = (Number(this.totalCollectibleAmount) * Number(this.serviceSettings.PGCHARGES[25]['CYBER'] / 100));

                        this.generateTrainItinerary(); 
                        this.irctcData = this.passengerItineraryDetails;

                        //console.log(this.totalCollectibleAmount);

                    }
                   // console.log(this.irctcData);
                    var saveCheckoutData = {
                        orderReferenceNumber: this.orderReferenceNumber,
                        irctcData: this.EncrDecr.set(JSON.stringify(this.irctcData))
                    };
                    this._irctc.saveCheckout(JSON.stringify(saveCheckoutData)).subscribe();

                    sessionStorage.setItem(this.searchTrainKey + '-clientTransactionId', this.clientTransactionId);
                    sessionStorage.setItem(this.searchTrainKey + '-orderReferenceNumber', this.orderReferenceNumber);
                    sessionStorage.setItem(this.searchTrainKey + '-ctype', this.ctype);
                    sessionStorage.setItem(this.searchTrainKey + '-totalFare', String(this.totalCollectibleAmount));
                    //sessionStorage.setItem(this.searchTrainKey + '-couponFare', String(this.couponapplyamount));
                    sessionStorage.setItem(this.searchTrainKey + '-passData', this.EncrDecr.set(JSON.stringify(this.irctcData)));
                    sessionStorage.setItem(this.searchTrainKey + '-passFareData', btoa(JSON.stringify(this.fareData)));
                    sessionStorage.setItem(this.searchTrainKey + '-contactDetails', this.EncrDecr.set(JSON.stringify(this.contactDetails)));
                    this.spinnerService.hide();
                    this.buttonstatus = true;
                    this.showFareSummary = true;

                    let trackUrlParams = new HttpParams()
                    .set('current_url', window.location.href)
                    .set('category', 'IRCTC')
                    .set('event', 'Save Checkout')
                    .set('metadata','{"save_checkout":"'+JSON.stringify(saveCheckoutData)+'"}');

                    const track_body: string = trackUrlParams.toString();
                     this.rest.trackEvents( track_body).subscribe(result => {});
                     
                                 this.gotoTop();
                      this.completedSteps = 3;
                      this.steps = 3; 

                } else {
                    this.showFareSummary = false;
                    this.spinnerService.hide();
                    this.buttonstatus = true;
                    var message;
                    if (this.fareEnqueryMultiplePassengers.partnerResponse.errorMessage)
                        message = this.fareEnqueryMultiplePassengers.partnerResponse.errorMessage;
                    else
                        message = 'Something went wrong';

                    this.dialog.open(ErrorDialog, {
                        disableClose: true,
                        id: 'messageforMliteDialog',
                        data: {
                            messageData: message,
                            backSearchData: this.seacthResult.searchHistory
                        }
                    });

                }

            }), (err: HttpErrorResponse) => {
                this.spinnerService.hide();
                var message = 'Something went wrong';
                this.dialog.open(ErrorDialog, {
                    disableClose: true,
                    id: 'messageforMliteDialog',
                    data: {
                        messageData: message,
                        backSearchData: this.seacthResult.searchHistory
                    }
                });
            };
    
    
    }
    setPassengerConcession(gender, age) {
        var temp;
        switch (gender) {
            case 'M': {
                if (age >= 60)
                    temp = 'SRCTZN';
                else
                    temp = 'NOCONC';
                break;
            }
            case 'F': {
                if (age >= 58)
                    temp = 'SRCTNW';
                else
                    temp = 'NOCONC';
                break;
            }
            case 'T': {
                if (age >= 60)
                    temp = 'SRCTZN';
                else
                    temp = 'NOCONC';
                break;
            }
        }
        return temp;
    }
    
    autoUpgrade($event) {
        this.addshow = !this.addshow;
        this.addPreferenceSelected = $event.target.checked;
        if (this.addPreferenceSelected == true) {
             this.passengerForm['controls']['passengerAutoUpgradation'].setValue(1);
            this.passengerForm.controls['coachId'].setValidators([Validators.pattern("^(([a-zA-Z]{1})([0-9]{1,3}))"),Validators.maxLength(4)]);
            this.passengerForm.controls['coachId'].updateValueAndValidity();
        } else {
          this.passengerForm['controls']['passengerAutoUpgradation'].setValue(0);
            this.passengerForm.get('coachId').clearValidators();
            this.passengerForm.controls['coachId'].updateValueAndValidity();
        }
    }
    generateTrainItinerary() { 
        if(this.gstSelected){
            this.gstDetails = {
                "city": this.passengerForm.controls['gstCity']['value'],
                "flat": this.passengerForm.controls['gstAddress']['value'],
                "gstIn": this.passengerForm.controls['gstNumber']['value'],
                "nameOnGst": this.passengerForm.controls['gstBusinessName']['value'],
                "pin": this.passengerForm.controls['gstPincode']['value'],
                "state": this.passengerForm.controls['gstState']['value'],
                "street": this.passengerForm.controls['gstAddress']['value']
            }
             if( this.enablesavedTraveller==1)
             this.saveCustomerGst();
        }else{
            this.gstDetails = {
                "city": '',
                "flat": '',
                "gstIn": '',
                "nameOnGst": '',
                "pin": '',
                "state": '',
                "street": ''
            }
        }

        this.traindate = this.seacthResult.searchHistory.journeyDate;
        this.fromstn = this.seacthResult.selectedTrain.fromStnCode;
        this.tostn = this.seacthResult.selectedTrain.toStnCode;
        this.trainnumber = this.seacthResult.selectedTrain.trainNumber;
        this.journeyClass = this.seacthResult.journeyClass;
        this.journeyQuota = this.seacthResult.journeyQuota;

        var boardingStation = this.idForm.controls['boardingStation']['value'];
        var boardingStationSplit = boardingStation.split(" - ");


        //mobile & email vaues
        var passengerMobile = this.passengerForm.controls['passengerMobile']['value'];
        var passengerEmail = this.passengerForm.controls['passengerEmail']['value'];

        //destination address values
        var passAddressOne = this.passengerForm.controls['destAddressOne']['value'];
        var passAddressTwo = this.passengerForm.controls['destAddressTwo']['value'];
        var passAddressThree = this.passengerForm.controls['destAddressThree']['value'];
        var passAddressPIN = this.passengerForm.controls['destAddressPin']['value'];
        var passAddressState = this.passengerForm.controls['destAddressState']['value'];
        var passAddressCity = this.passengerForm.controls['destAddressCity']['value'];
        var passAddressPost = this.passengerForm.controls['destAddressPost']['value'];

        var passDestAddressDetails = {
            "address": passAddressOne,
            "street": passAddressTwo,
            "colony": passAddressThree,
            "pinCode": passAddressPIN,
            "stateName":passAddressState,
            "city":passAddressCity,
            "postOffice": passAddressPost
        }


        //AutoUpgradeflag
        var passengerAutoUpgradation: string;
        if (this.passengerForm.controls['passengerAutoUpgradation']) {
            if (this.passengerForm.controls['passengerAutoUpgradation']['value'] == true) {
                passengerAutoUpgradation = "true";
            } else {
                passengerAutoUpgradation = "false";
            }
        } else {
            passengerAutoUpgradation = "false";
        }
        var travelDocCardNo: any;
        var travelDoc: any;
        var MealPreference: any;
        var optBedRoll: any;
        var coachId: any;



        var travellerList = [];
         var ii=1;
        if (this.travellersArray.length > 0) {
            for (let i of this.travellersArray) {

                if (this.passengerForm.controls['passengerTravelDocCardNo' + i]) {
                    this.travelDocCardNoArr[i] = this.passengerForm.controls['passengerTravelDocCardNo' + i]['value'];
                } else {
                    this.travelDocCardNoArr[i] = "";
                }
                if (this.passengerForm.controls['passengerTravelDocument' + i]) {
                    this.travelDocArr[i] = this.passengerForm.controls['passengerTravelDocument' + i]['value'];
                } else {
                    this.travelDocArr[i] = "";
                }
                if (this.foodChoiceEnabled) {
                    this.MealPreferenceArr[i] = this.passengerForm.controls['passengerMealPreference' + i]['value'];
                } else {
                    this.MealPreferenceArr[i] = "";
                }
                if (this.passengerForm.controls['optBedRoll' + i]['value']) {
                    this.optBedRollArr[i] = this.passengerForm.controls['optBedRoll' + i]['value'];
                } else {
                    this.optBedRollArr[i] = "false";
                }
          
                if (this.passengerForm.controls['foreignPassengerDOB' + i]) {
                    this.foreignPassDOBArr[i] = this.passengerForm.controls['foreignPassengerDOB' + i]['value'];
                } else {
                    this.foreignPassDOBArr[i] = "";
                }
                
                
                if ((this.passengerForm.controls['optChildBerth' + i]) || (this.fareEnqResponse['partnerResponse']['bkgCfg'].gatimaanTrain == 'true')) {
                  if(this.optChildBerthStatusArr[i]==false){
                   this.optChildBerthArr[i] = "false";
                  }else{
                  let element = <HTMLInputElement> document.getElementById('optChildBerth' + i);  
                    if( element.checked)
                    this.optChildBerthArr[i] = "true";
                   else
                    this.optChildBerthArr[i] ="false" ;
                  }
                }
                else {
                    this.optChildBerthArr[i] = "false";
                }

                if(this.childBerthMandatory == 'true') {
                    this.optChildBerthArr[i] = "true";
                }
                 
                
                var idCardflag1="false";
                if (this.passengerForm.controls['passengerNationality'+i]['value'] == "IN") {
                    idCardflag1 = "false";
                } else {
                    idCardflag1 = "true";
                    
                }

                var checksaveTraveller;
                if(this.passengerForm.controls['saveTraveller' ]['value'] == 1){
                    checksaveTraveller=1;
                }else{
                    checksaveTraveller= 0;
                }

                var concessionOpted1;
                var forgoConcession1; var passengerConcession1;
                if (this.passengerForm.controls['passengerSeniorCitizen' + i]['value'] == 1  &&idCardflag1=="false") {
                    concessionOpted1 = "true";
                    forgoConcession1 = "false";
                    passengerConcession1 = this.setPassengerConcession(this.passengerForm.controls['passengerGender' + i]['value'], this.passengerForm.controls['passengerAge' + i]['value']);
                    this.availFlag1 = 1;
                } else if (this.passengerForm.controls['passengerSeniorCitizen' + i]['value'] == 2  &&idCardflag1=="false") {
                    concessionOpted1 = "true";
                    forgoConcession1 = "true";
                    passengerConcession1 = this.setPassengerConcession(this.passengerForm.controls['passengerGender' + i]['value'], this.passengerForm.controls['passengerAge' + i]['value']);
                    this.forgoFiftyFlag1 = 1;
                } else if (this.passengerForm.controls['passengerSeniorCitizen' + i]['value'] == 3  &&idCardflag1=="false") {
                    concessionOpted1 = "false";
                    forgoConcession1 = "false";
                    passengerConcession1 = this.setPassengerConcession(this.passengerForm.controls['passengerGender' + i]['value'], this.passengerForm.controls['passengerAge' + i]['value']);
                    this.forgoFullFlag1 = 1;

                } else {
                    concessionOpted1 = "false";
                    forgoConcession1 = "false";
                    passengerConcession1 = "NOCONC";
                    this.availFlag1 = 0; this.forgoFiftyFlag1 = 0; this.forgoFullFlag1 = 0;
                }

                var gender;
                if(this.passengerForm.controls['passengerGender' + i]['value']=="Male"){
                  gender='M';
                }else if(this.passengerForm.controls['passengerGender' + i]['value']=="Female"){
                  gender='F';
                }else{
                  gender=this.passengerForm.controls['passengerGender' + i]['value'];
                }
 

                var traveller = {
                    "childBerthFlag": this.optChildBerthArr[i],
                    "concessionOpted": concessionOpted1,
                    "foodChoiceEnabled": this.foodChoiceEnabled,
                    "forgoConcession": forgoConcession1,
                    "forGoConcessionOpted": forgoConcession1,
                    "passengerAge": this.passengerForm.controls['passengerAge' + i]['value'],
                    "passengerBedrollChoice": this.optBedRollArr[i],
                    "passengerBerthChoice": this.passengerForm.controls['passengerBerthChoice' + i]['value'],
                    "passengerCardNumber": this.travelDocCardNoArr[i],
                    "passengerCardType": this.travelDocArr[i],
                    "passengerConcession": passengerConcession1,
                    "passengerFoodChoice": this.MealPreferenceArr[i],
                    "passengerGender": this.passengerForm.controls['passengerGender' + i]['value'],
                    "passengerIcardFlag": idCardflag1,
                    "passengerName": this.passengerForm.controls['passengerName' + i]['value'].trim(),
                    "passengerNationality": this.passengerForm.controls['passengerNationality' + i]['value'],
                    "passengerSerialNumber": ii,
                    "saveTraveller":checksaveTraveller,
                    "DOB":this.foreignPassDOBArr[i]

                }
                travellerList.push(traveller);
                ii++;
            }
            
        }
        this.travellerListArray = travellerList;
       

        //INFANT LIST
        var infantList: any = [];
        if (this.childrenArray.length > 0) {
          var ii=1;
            for (let i of this.childrenArray) {
                var infant = {
                    "age": this.passengerForm.controls['childAge' + i]['value'],
                    "gender": this.passengerForm.controls['childGender' + i]['value'],
                    "infantSerialNumber": ii ,
                    "name": this.passengerForm.controls['childName' + i]['value'].trim()
                }
                infantList.push(infant);
                ii++;
            }
        }
        this.trainDateStr = this.traindate.replace(/-/g, "");

        //VIKALP
        var vikalpInSpecialTrainsAccomFlag = this.passengerForm.controls['vikalpInSpecialTrainsAccomFlag']['value']
        if (vikalpInSpecialTrainsAccomFlag == true) {

        } else {

        }

       
        var whatsappFlag;
        if (this.whatsappFeature == 1)
            whatsappFlag = this.passengerForm.controls['whatsappFlag']['value'];
        else
            whatsappFlag = 0;

           var saved_GST_flag;
           if(this.passengerForm.controls['saveGST'].value == 1){
            saved_GST_flag = 1;
           } else{
            saved_GST_flag = 0;
           }

        /* Dynamic data */
        this.passengerContactData = {
            "whatsappFlag": whatsappFlag,
            "mobile": passengerMobile,
            "firstName": this.passengerForm.controls['passengerName'+this.travellersArray[0]]['value'].trim(),
            "gst": "",
            "title": "",
            "email": passengerEmail,
            "country_code": "91",
            "lastName": ""
        }

        this.fareData = {
            totalTicketFare: this.totalTicketFare,
            totalBaseFare: this.baseFare,
            serviceTax: this.serviceTax,
            reservationCharge: this.reservationCharge,
            superfastCharge: this.superfastCharge,
            dynamicFare: this.dynamicFare,
            travel_ins_charge: this.travel_ins_charge,
            travel_ins_charge_tax: this.travel_ins_charge_tax,
            wp_charge: this.wp_charge,
            wp_charge_tax: this.wp_charge_tax,
            concession: this.concession,
            convenience_fee: Number(this.convenience_fee),
            agent_charges: Number(this.agent_charges),
            campiagn_agent_charges: Number(this.campiagn_agent_charges),
            pgCharges: 0,
            pgChargesNetbanking:0,
            totalFare: this.totalCollectibleAmount,
            totalTax: (Number(this.serviceTax) + Number(this.reservationCharge) + Number(this.superfastCharge) + Number(this.dynamicFare) + Number(this.travel_ins_charge) + Number(this.travel_ins_charge_tax) + Number(this.wp_charge) + Number(this.wp_charge_tax) + Number(this.concession)),

            ticketFare: this.totalTicketFare,
            irctcServiceCharges: (Number(this.wp_charge) + Number(this.wp_charge_tax)),
            travelInsurenceChargs: (Number(this.travel_ins_charge) + Number(this.travel_ins_charge_tax)),

        }

        this.passengerItineraryDetails = {
            "trainName": this.trainName,
            "toStn": this.tostn,
            "frmStn": this.fromstn,
            "boardingStation": boardingStationSplit[1],
            "journeyClass": this.journeyClass,
            "journeyDate": this.journeyDateactualstr,
            "journeyQuota": this.journeyQuota,
            "trainNo": this.trainnumber,
            "wsUserLogin": this.wsUserLogin,
            "ticketType": "E",
            "mobileNumber": passengerMobile,
            "customerID": this.REWARD_CUSTOMERID,
            "passengerList": travellerList,
            "infantList": infantList,
            "gstDetails": this.gstDetails,
            "reservationChoice": this.passengerReservationChoice,
            "coachId": this.passengerForm.controls['coachId']['value'],
            "paymentEnqFlag": "Y",
            "masterId": "",
            "moreThanOneDay": "False",
            "deviceID": this.deviceID,
            "deviceModel": this.deviceModel,
            "osType": this.osType,
            "enquiryType": "3",
            "ticketChoiceLowerBerth": "",
            "ticketChoiceSameCoach": "",
            "travelInsuranceOpted": this.travelInsuranceOpted,
            "autoUpgradationSelected": passengerAutoUpgradation,
            "_mainJourneyTxnId": "",
            "_onwardFlag": "N",
            "_reservationMode": "WS_TA_B2C",
            "atasOpted": "",
            "channelID": "web",
            "clientTransactionId": "",
            "gnToCkOpted": "",
            "ignoreChoiceIfWl": "",
            "contactDetails": this.passengerContactData,
            "selectedTrain": this.seacthResult.selectedTrain,
            "fareData": this.fareData,
            "departureDate": this.journeyDateactual,
            "travalfrom": this.seacthResult.searchHistory.travalfrom,
            "travalto": this.seacthResult.searchHistory.travalto,
            "convenience_fee": this.convenience_fee,
            "pgCharges": 0,
            "pgChargesNetbanking":0,
            "scheduletime": this.scheduletime,
            "email": passengerEmail,
            "convienceChargesEnable":this.convienceChargesEnable,
            "agent_charges":this.agent_charges,
            "campiagn_agent_charges":this.campiagn_agent_charges,
            "tktAddress": passDestAddressDetails
        };
        

        let trackUrlParams = new HttpParams()
        .set('current_url', window.location.href)
        .set('category', 'IRCTC')
        .set('event', 'Create Itinerary')
        .set('metadata',this.EncrDecr.set(JSON.stringify(this.passengerItineraryDetails)));
        
         const track_body: string = trackUrlParams.toString();
         this.rest.trackEvents( track_body).subscribe(result => {});
    }

    openmodal(content) {
        this.isExpanded = false; this.isAdultExpanded = false; this.isInfantExpanded = false;
        this.modalService.open(content, { centered: true });
      }



    openBottomSheet() {

        this._bottomSheet.open(BottomSheetComponent, {
            data: {
                trainName: this.trainName,
                trainNo: this.seacthResult.selectedTrain.trainNumber,
                from: this.seacthResult.searchHistory.travalfrom,
                to: this.seacthResult.searchHistory.travalto,
                departureTime: this.departureTime,
                arrivalTime: this.arrivalTime,
                timeStamp: this.seacthResult.searchHistory.journeyDate,
                enqClass: this.enqClass,
                quota: this.quota,
                travellerListArray: this.travellerListArray,
                baseFare: this.baseFare,
                totalTicketFare: this.totalTicketFare,
                serviceTax: this.serviceTax,
                reservationCharge: this.reservationCharge,
                superfastCharge: this.superfastCharge,
                dynamicFare: this.dynamicFare,
                travel_ins_charge: this.travel_ins_charge,
                travel_ins_charge_tax: this.travel_ins_charge_tax,
                wp_charge: this.wp_charge,
                wp_charge_tax: this.wp_charge_tax,
                concession: this.concession,
                convenience_fee: this.convenience_fee,
                pgCharges: Number(this.pgCharges),
                coupon_amount: this.coupon_amount,
                totalCollectibleAmount: Number(this.totalCollectibleAmount) + Number(this.pgCharges),
                journeyDateactual: this.journeyDateactual,
                passengerCount: this.travellersArray,
                journeyArrivalDate: this.journeyArrivalDate,
                convienceChargesEnable:this.convienceChargesEnable,
                agent_charges:this.agent_charges,
                campiagn_agent_charges:this.campiagn_agent_charges                        

            }
        });

    }


    getCityResidence($event) {
     this.cityList=[];
        let pincodevalue = this.passengerForm.controls['gstPincode']['value'];
       
      if(pincodevalue.length==6){
        if(this.passengerForm.controls['gstPincode']['status']){
            let pincode = this.passengerForm.controls['gstPincode']['value'];
            this.urlparam = {
              "pinCode": pincode
            };
            var param1Str = JSON.stringify(this.urlparam);
            this._irctc.findCity(param1Str).subscribe(data => {
                this.response=data;
                //console.log(this.residentialAddrForm.controls['city']['value']);
                if(this.passengerForm.controls['gstCity']['value'] != undefined){
                 // this.findPinResidence();
                }
if(Array.isArray(this.response.partnerResponse.cityList) && !(this.response.partnerResponse.error)){   
                  this.cityList=this.response.partnerResponse.cityList;
                  this.pincodeError="";
                }else if(Array.isArray(this.response.partnerResponse.cityList)==false && !(this.response.partnerResponse.error)){ 
                  this.cityList.push(this.response.partnerResponse.cityList);
                  this.pincodeError="";
                }else if(this.response.partnerResponse.error){ 
                  this.pincodeError=this.response.partnerResponse.error; 
                  this.cityList=[];
                }else{  
                  this.cityList=[];
                  this.pincodeError="";
                }
                this.state=this.response.partnerResponse.state;
                //this.stateCheck=true;   //disable state field
            },
            (err: HttpErrorResponse) => {
                var message='Something went wrong !';
                const dialogRef=this.dialog.open(ConfirmationDialog, {
                    disableClose: true,
                    width: '600px',
                    id: 'messageforMliteDialog',
                    data: {
                        messageData: message
                    }
              });
            });
        }
      }else{
        this.passengerForm['controls']['gstCity'].setValue('');
        this.cityList=[];
        this.pincodeError="";
        //this.stateCheck=true;
        this.state="";
        //this.postOfficeList=[];
      }
    }

    destCityList:any;
    getDestCity($event){
      this.destCityList=[];
     this.postofficeList=[];
        let destpincodevalue = this.passengerForm.controls['destAddressPin']['value'];
      if(destpincodevalue.length==6){
        if(this.passengerForm.controls['destAddressPin']['status']){
            let pincode = this.passengerForm.controls['destAddressPin']['value'];
            this.urlparam = {
              "pinCode": pincode
            };
            var param1Str = JSON.stringify(this.urlparam);
            this._irctc.findCity(param1Str).subscribe(data => {
                this.cityResp=data;
if(Array.isArray(this.cityResp.partnerResponse.cityList) && !(this.cityResp.partnerResponse.error)){   
                  this.destCityList=this.cityResp.partnerResponse.cityList;
                  this.destpincodeError="";
                }else if(Array.isArray(this.cityResp.partnerResponse.cityList)==false && !(this.cityResp.partnerResponse.error)){ 
                  this.destCityList.push(this.cityResp.partnerResponse.cityList);
                  this.destpincodeError="";
                }else if(this.cityResp.partnerResponse.error){ 
                  this.destpincodeError=this.cityResp.partnerResponse.error; 
                  this.destCityList=[];
                }else{  
                  this.destCityList=[];
                  this.pincodeError="";
                }
                this.destState=this.cityResp.partnerResponse.state;
                //this.stateCheck=true;   //disable state field
            },
            (err: HttpErrorResponse) => {
                var message='Something went wrong !';
                const dialogRef=this.dialog.open(ConfirmationDialog, {
                    disableClose: true,
                    width: '600px',
                    id: 'messageforMliteDialog',
                    data: {
                        messageData: message
                    }
              });
            });
        }
      }else{
        this.destState = '';
        this.passengerForm['controls']['gstCity'].setValue('');
        this.destCityList=[];
        this.destpincodeError="";
        //this.stateCheck=true;
        this.state="";
        //this.postOfficeList=[];
      }
    }
    cityValue:any;
    getcitypostoffice(val){
        this.cityValue  = val;
        let pincode = this.passengerForm.controls['destAddressPin']['value'];
        if(this.cityValue != undefined && this.cityValue != "" && this.cityValue != null ){
                let urlparam = {
                  "city": this.cityValue,
                  "pinCode": pincode
                };
               // console.log(urlparam)
                let postParamstr = JSON.stringify(urlparam);
                this._irctc.findpost(postParamstr).subscribe(data => {
                    this.postOfficeAPIresponse=data;
    if(Array.isArray(this.postOfficeAPIresponse.partnerResponse.postofficeList) && !(this.postOfficeAPIresponse.partnerResponse.errorcode==0)){   
        this.postofficeList=this.postOfficeAPIresponse.partnerResponse.postofficeList;
                     
                    }else if(Array.isArray(this.postOfficeAPIresponse.partnerResponse.postofficeList)==false && !(this.postOfficeAPIresponse.partnerResponse.errorcode==0)){ 
                        this.postofficeList.push(this.postOfficeAPIresponse.partnerResponse.postofficeList);
                      
                    }else if(this.postOfficeAPIresponse.partnerResponse.error){ 
                      this.destpincodeError=this.postOfficeAPIresponse.partnerResponse.error; 
                      this.postofficeList=[];
                    }else{  
                        this.postofficeList=[];
                      this.pincodeError="";
                    }
                    this.destState=this.postOfficeAPIresponse.partnerResponse.state;
                    //this.stateCheck=true;   //disable state field
                },
                (err: HttpErrorResponse) => {
                    var message='Something went wrong !';
                    const dialogRef=this.dialog.open(ConfirmationDialog, {
                        disableClose: true,
                        width: '600px',
                        id: 'messageforMliteDialog',
                        data: {
                            messageData: message
                        }
                  });
                });
    }else{
        this.passengerForm['controls']['destAddressPost'].setValue('');
        this.postofficeList=[];
      }
}




    /*** ---------------------------------TRAVELLER INFORMATION SECTION ends-----------------------------------------------------------------***/
    addPreferenceSelected: boolean;
    addToggle($event) {
        this.addshow = !this.addshow;
        this.addPreferenceSelected = $event.target.checked;
        if (this.addPreferenceSelected == true) {
            this.passengerForm.controls['coachId'].setValidators([Validators.pattern("^(([a-zA-Z]{1})([0-9]{1,3}))"),Validators.maxLength(4)]);
            this.passengerForm.controls['coachId'].updateValueAndValidity();
        } else {
            this.passengerForm.get('coachId').clearValidators();
            this.passengerForm.controls['coachId'].updateValueAndValidity();
        }
    }

    reciveflexiAmount(values){
        this.showFlexipay = true;
        if(values[0].key == 15){
            this.flexipaysummry=true;
            this.flexiDiscount = Number(values[0].value);
            this.totalCollectibleAmount =  Number(this.totalCollectibleAmountFromPartnerResponse) + Number(this.convenience_fee) - Number(this.coupon_amount) - Number(this.flexiDiscount);
            //sessionStorage.setItem(this.searchTrainKey + '-totalFare', String(this.totalCollectibleAmount));
        }else if(values[0].key !== 15){
            this.flexipaysummry = false;
            this.flexiDiscount = 0;
            this.flexiIntrest=Number(values[0].value);
            this.totalCollectibleAmount = Number(this.totalCollectibleAmountFromPartnerResponse) + Number(this.convenience_fee) - Number(this.coupon_amount);
            //sessionStorage.setItem(this.searchTrainKey + '-totalFare', String(this.totalCollectibleAmount));
    }
}
recivetotalFare($event){
    this.flexipaysummry=false;
    this.flexiDiscount = 0;
    this.totalCollectibleAmount = Number(this.totalCollectibleAmountFromPartnerResponse) + Number(this.convenience_fee) - Number(this.coupon_amount);
   
}


    /***----- APPLY COUPON (--parent--) ------***/
    receiveCouponDetails($event) {
        if ($event.type == 0) {
            this.indexCoupon = $event.couponOptions;
            this.coupon_id = this.indexCoupon.coupon_id;
            this.coupon_name = this.indexCoupon.coupon_name;
            this.coupon_code = this.indexCoupon.coupon_code;
            this.coupon_amount = this.indexCoupon.coupon_amount;
            if(this.flexiDiscount == undefined) this.flexiDiscount = 0;
            this.totalCollectibleAmount = Number(this.totalCollectibleAmountFromPartnerResponse) + Number(this.convenience_fee) - (Number(this.coupon_amount)+Number(this.flexiDiscount));
            sessionStorage.setItem(this.searchTrainKey + '-totalFare', String(this.totalCollectibleAmount));
        } else {
            this.coupon_id = '';
            this.coupon_name = '';
            this.coupon_code = '';
            this.coupon_amount = 0;
            if(this.flexiDiscount == undefined) this.flexiDiscount = 0;
            this.totalCollectibleAmount = Number(this.totalCollectibleAmountFromPartnerResponse) + Number(this.convenience_fee) - (Number(this.coupon_amount)+Number(this.flexiDiscount));
            sessionStorage.setItem(this.searchTrainKey + '-totalFare', String(this.totalCollectibleAmount));
        }
    }




    /**----------REMOVE COUPON----------**/
    removeCoupon(coupon_id, coupon_amount) {
        this.coupon_id = '';
        this.coupon_name = '';
        this.coupon_code = '';
        this.coupon_amount = 0;
        this.totalCollectibleAmount = Number(this.totalCollectibleAmountFromPartnerResponse) + Number(this.convenience_fee) - Number(this.coupon_amount);
        sessionStorage.setItem(this.searchTrainKey + '-totalFare', String(this.totalCollectibleAmount));
    }


    receivePgCharges($event) {
        this.pgCharges = $event;

    }


    goback() {
        this.location.back();
    }
    openDialog() {
        const errmsg = [];
        errmsg.push('Creating / Changing personal data is not allowed at this time.');
        const message = errmsg;
        let dialogRef = this.dialog.open(ConfirmationDialogclose, {
            disableClose:true,
            width: '560px',
            data: { messageData: message }
        });
    }

    /*** ---------------------------------IRCTC new registration-----------------------------------------------------------------***/
    registration() {
        var time = new Date();
        var hour = time.getHours().toString();
        var min = time.getMinutes().toString();
    
        if(min.length==1)
        min='0'+min;
        if(hour.length==1)
        hour='0'+hour;
    
        var cuurnttime = hour+min
        var actualtime = parseInt(cuurnttime)

        if (actualtime >= parseInt(AppConfig.blocktimings.userUpdateBlockstart) && actualtime <= parseInt(AppConfig.blocktimings.userUpdateBlockend)) {
            this.openDialog();
        } else {
            this.router.navigate(['/train/registration']);
           /* this.trainDetails = false;
            this.irctcRegister = true ; */
        }
    }
    forgotUserId() {

        var time = new Date();
        var hour = time.getHours().toString();
        var min = time.getMinutes().toString();
    
        if(min.length==1)
        min='0'+min;
        if(hour.length==1)
        hour='0'+hour;
    
        var cuurnttime = hour+min
        var actualtime = parseInt(cuurnttime)

        if (actualtime >= parseInt(AppConfig.blocktimings.userUpdateBlockstart) && actualtime <= parseInt(AppConfig.blocktimings.userUpdateBlockend)) {
            this.openDialog();

        } else {
            const dialogRef = this.dialog.open(ConfirmationDialog, {
                data: {
                    disableClose: true,
                    forgotUserIdDialog: true,
                    resetPasswordDialog: false,
                    errorDialog: false
                }
            });
        }

    }
    resetPassword() {

        var time = new Date();
        var hour = time.getHours().toString();
        var min = time.getMinutes().toString();
    
        if(min.length==1)
        min='0'+min;
        if(hour.length==1)
        hour='0'+hour;
    
        var cuurnttime = hour+min
        var actualtime = parseInt(cuurnttime)

        if (actualtime >= parseInt(AppConfig.blocktimings.userUpdateBlockstart) && actualtime <= parseInt(AppConfig.blocktimings.userUpdateBlockend)) {
            this.openDialog();
        } else {
            const dialogRef = this.dialog.open(ConfirmationDialog, {
                data: {
                    disableClose: true,
                    forgotUserIdDialog: false,
                    resetPasswordDialog: true,
                    errorDialog: false
                }
            });
        }
    }
    validateOTP() {
        var time = new Date();
        var hour = time.getHours().toString();
        var min = time.getMinutes().toString();
    
        if(min.length==1)
        min='0'+min;
        if(hour.length==1)
        hour='0'+hour;
    
        var cuurnttime = hour+min
        var actualtime = parseInt(cuurnttime)
        if (actualtime >= parseInt(AppConfig.blocktimings.userUpdateBlockstart) && actualtime <= parseInt(AppConfig.blocktimings.userUpdateBlockend)) {
            this.openDialog();
        } else {
        
        const dialogRef1 = this.dialog.open(newUserValidate, {
            data: {
                disableClose: true,
            }
        });
    }
}

    /**--------------------------------------SAVED TRAVELLER ------------------------------------------------------------------------ */
 
    saveTravellerId=[]; saveChildTravellerId=[];
        /**--------------------------------------SAVED TRAVELLER ------------------------------------------------------------------------ */
    checksavedtraveller(){
        let checksavedtravConfig = this.serviceSettings.enablesavedTraveller
        if(checksavedtravConfig == 1){
            this.saveTravllerShow = true;
            var requestParams = {
            'customerId':this.REWARD_CUSTOMERID
            };

            var postsavedTravellers = {
            postData:this.EncrDecr.set(JSON.stringify(requestParams)) 
            };

            this.rest.getCustomertravellerInfo(postsavedTravellers).subscribe(response =>{
                // let respData = JSON.parse(this.EncrDecr.get(response.result ));
                let resp = response['errorcode']; 
                if(response['errorcode'] == 0){

                if(response['value'].length > 0){
                response['value'] =   response['value'].sort(function (a, b) {
                var x = a['age']; var y = b['age'];
                return ((x > y) ? -1 : ((x < y) ? 1 : 0));
                });
                }
                this.travellerlist = response['value'];
                
                
		this.adulttravellerlist =  this.travellerlist.filter(function(tra) {
		return tra.age > 1;
		});
		
		
                for(let i=0;i<this.travellerlist.length;i++){
                if(this.adulttravellerlist[i].age > 4)
                this.saveTravellerId[this.adulttravellerlist[i].id]=-1
                else
                this.saveChildTravellerId[this.adulttravellerlist[i].id]=-1
                }
	                
                this.checkPaxCount = this.adulttravellerlist.length;
                }
            }),(err:HttpErrorResponse)=>{
               console.log('Something went wrong !');
            
            }
        }
    }
    
    

    passengerFormCount: number = 1;
    currentId: any;
    
    clickPassenger($event,passenger,checkboxIndex) {
      if($event.target.checked){
      if(passenger.age > 4)
      this.addTraveller(passenger,checkboxIndex);
      else
       this.addChild(passenger,checkboxIndex);
      }else{
        if(passenger.age > 4){
         this.currentId=$('#passengerBoxId_'+checkboxIndex).val();
        this.removeTraveller(parseInt(this.currentId),checkboxIndex);
        } else{
        this.currentId=$('#passengerChildBoxId_'+checkboxIndex).val();
        this.removeChild(parseInt(this.currentId),checkboxIndex);
        }
      
      }
    }
    
     editPassenger(passenger,checkboxIndex) {
      if(passenger.age > 4)
      this.addTraveller(passenger,checkboxIndex);
      else
       this.addChild(passenger,checkboxIndex);
    }
    
       manualAddTraveller(type){
        if(type==1)
        this.addTraveller(-1,-1);
        else
        this.addChild(-1,-1);
       }
    
    
    addTraveller(passenger,checkboxIndex) {
           if ((this.travellersArray.length ) < (this.maxPassengers)) {
            this.travellers.push(this.travellersArray.length);
            this.travellersArray.push(this.passengerFormCount);
            
             if(checkboxIndex ==-1)
            this.travellersArrayM.push(this.passengerFormCount);

            var i = Number(this.passengerFormCount);
            
            if(checkboxIndex !=-1)
            this.saveTravellerId[checkboxIndex]=i;
            
                var gender=""; var arrAge = "";  var passengerName = "";
                
                if(checkboxIndex !=-1){
                if((passenger.gender == 'M') || (passenger.gender == 'Male')) {
                gender = 'M'
                }else if((passenger.gender == 'F') || (passenger.gender == 'Female')){
                gender = 'F';
                }

               
                if(passenger.age != undefined){
                arrAge = passenger.age;
                }else{
                arrAge = this.travellersFilledArray[i].age;
                }
                
                passengerName=passenger.firstName+' '+passenger.lastName;
                
                }
 
            this.defaultCountryArr[i] = "IN";
            this.passengerForm.addControl('passengerName' + i, new FormControl(passengerName, [Validators.required, Validators.pattern(this.patternName), Validators.minLength(this.minNameLength), Validators.maxLength(this.maxNameLength)]));
            this.passengerForm.addControl('passengerGender' + i, new FormControl('', Validators.required));
            this.passengerForm.addControl('passengerAge' + i, new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.min(5), Validators.max(125)]));
            this.passengerForm.addControl('passengerNationality' + i, new FormControl('', Validators.required));

            this.passengerForm.controls['passengerMobile'].setValidators([Validators.required, Validators.pattern("^[6-9][0-9]{9}$"), Validators.minLength(10)]);
            this.passengerForm.controls['passengerEmail'].setValidators([Validators.required, Validators.pattern(this.emailPattern)]);
            this.passengerForm.controls['passengerAgree'].setValidators([Validators.required, Validators.pattern('true')]);


            this.passengerForm.controls['passengerName' + i].updateValueAndValidity();
            this.passengerForm.controls['passengerGender' + i].updateValueAndValidity();
            this.passengerForm.controls['passengerAge' + i].updateValueAndValidity();
            this.passengerForm.controls['passengerNationality' + i].updateValueAndValidity();
            this.passengerForm.controls['passengerMobile'].updateValueAndValidity();
            this.passengerForm.controls['passengerEmail'].updateValueAndValidity();
            this.passengerForm.controls['passengerAgree'].updateValueAndValidity();
            this.passengerForm.addControl('passengerBerthChoice' + i, new FormControl(''));
           
           
           
        if (this.foodChoiceEnabled)
        this.passengerForm.addControl('passengerMealPreference' + i, new FormControl('', [Validators.required]));
        else
        this.passengerForm.addControl('passengerMealPreference' + i, new FormControl(''));

        this.passengerForm.addControl('passengerSeniorCitizen' + i, new FormControl(''));

        this.passengerForm.addControl('optChildBerth' + i, new FormControl(''));
        this.passengerForm.addControl('optBedRoll' + i, new FormControl(''));


        this.passengerForm['controls']['passengerGender'+i].setValue(gender);
        this.passengerForm['controls']['passengerAge'+i].setValue(arrAge);
        this.genderSelectArr[i]=gender;


            if (this.travelInsuranceOpted == true) {
                this.travel_ins_charge = 0.42 * (Number(this.travellersArray.length) + 1);
                this.travel_ins_charge_tax = 0.07 * (Number(this.travellersArray.length) + 1);
            } else {
                this.travel_ins_charge = 0;
                this.travel_ins_charge_tax = 0;
            }

            this.baseFare = this.seacthResult.fareData.baseFare * (Number(this.travellersArray.length) + 1);
            this.serviceTax = this.seacthResult.fareData.serviceTax * (Number(this.travellersArray.length) + 1);
            this.reservationCharge = this.seacthResult.fareData.reservationCharge * (Number(this.travellersArray.length) + 1);
            this.superfastCharge = this.seacthResult.fareData.superfastCharge * (Number(this.travellersArray.length) + 1);
            this.dynamicFare = this.seacthResult.fareData.dynamicFare * (Number(this.travellersArray.length) + 1);
            this.travel_ins_charge_tax = this.seacthResult.fareData.travelInsuranceServiceTax * (Number(this.travellersArray.length) + 1);
            this.wp_charge = this.seacthResult.fareData.wpServiceCharge * (Number(this.travellersArray.length) + 1);
            this.wp_charge_tax = this.seacthResult.fareData.wpServiceTax * (Number(this.travellersArray.length) + 1);
            this.concession = this.seacthResult.fareData.totalConcession * (Number(this.travellersArray.length) + 1);
            this.totalCollectibleAmount = (this.seacthResult.fareData.totalCollectibleAmount * (Number(this.travellersArray.length) + 1)) + this.convenience_fee + Number(this.travel_ins_charge);
            this.passengerFormCount++;
            
             if(checkboxIndex !=-1){
               $('#travelPassenger_'+checkboxIndex).prop('checked', true); 
             $('#passengerBox_'+checkboxIndex).removeClass('hidden');
             }
        } else {
         if(checkboxIndex !=-1){
          $('#passengerBox_'+checkboxIndex).addClass('hidden');
          $('#travelPassenger_'+checkboxIndex).prop('checked', false); 
         } 
            var message = 'Maximum passengers cannot be more than ' + this.maxPassengers;
            const dialogRef = this.dialog.open(ConfirmationDialog, {
                disableClose: true,
                width: '600px',
                id: 'messageforMliteDialog',
                data: {
                    errorDialog: true,
                    messageData: message
                }
            });
        }

    }
    
    
    
    removeTraveller(val,checkboxIndex) {
    
    
        var passengerName = this.passengerForm.controls['passengerName' + val]['value'];
        const index = this.travellersArray.indexOf(val, 0);
         if(checkboxIndex !=-1)
     $('#passengerBox_'+checkboxIndex).addClass('hidden');
        if (index > -1) {
            this.travellersArray.splice(index, 1);
        }
        
        
        if(checkboxIndex ==-1){
        const index1 = this.travellersArrayM.indexOf(val, 0); 
        if (index1 > -1) {
        this.travellersArrayM.splice(index1, 1);
        }

        }

        
        
        if (this.travellerlist.length > 0) {
            var trvList = [];
            for (let i of this.travellerlist) {
                var trvlist = i;
                var combineName = trvlist.firstName+ " " +trvlist.lastName;
                trvList.push({name:combineName}); 
            }
            for (var index1 in trvList) {
                var fullName = trvList[index1]['name'];
                if(fullName == passengerName) {
                    this.disableCheckbox[index1]=true;
                    this.modalcheckedvalue[index1]=false;
                    this.selectedCheckbox.splice(index1,1);
                    break;
                }
            }
        }

        this.passengerForm.removeControl('passengerName' + val);
        this.passengerForm.removeControl('passengerGender' + val);
        this.passengerForm.removeControl('passengerAge' + val);
        this.passengerForm.removeControl('passengerBerthChoice' + val);
        this.passengerForm.removeControl('passengerNationality' + val);
        this.passengerForm.removeControl('passengerTravelDocument' + val);
        this.passengerForm.removeControl('passengerTravelDocCardNo' + val);
        this.passengerForm.removeControl('passengerMealPreference' + val);
        this.passengerForm.removeControl('passengerSeniorCitizen' + val);
        this.passengerForm.removeControl('optChildBerth' + val);
        this.passengerForm.removeControl('optBedRoll' + val);
        this.passengerForm.removeControl('foreignPassengerDOB'+val);
        this.passengerForm.clearValidators();
        this.passengerForm.updateValueAndValidity();

        
        this.travellers.splice(val, 1);
        

        if (this.travelInsuranceOpted == true) {
            this.travel_ins_charge = 0.42 * (Number(this.travellersArray.length) + 1);
            this.travel_ins_charge_tax = 0.07 * (Number(this.travellersArray.length) + 1);
        } else {
            this.travel_ins_charge = 0;
            this.travel_ins_charge_tax = 0;
        }

        this.baseFare = this.seacthResult.fareData.baseFare * (Number(this.travellersArray.length) + 1);
        this.serviceTax = this.seacthResult.fareData.serviceTax * (Number(this.travellersArray.length) + 1);
        this.reservationCharge = this.seacthResult.fareData.reservationCharge * (Number(this.travellersArray.length) + 1);
        this.superfastCharge = this.seacthResult.fareData.superfastCharge * (Number(this.travellersArray.length) + 1);
        this.dynamicFare = this.seacthResult.fareData.dynamicFare * (Number(this.travellersArray.length) + 1);
        this.travel_ins_charge_tax = this.seacthResult.fareData.travelInsuranceServiceTax * (Number(this.travellersArray.length) + 1);
        this.wp_charge = this.seacthResult.fareData.wpServiceCharge * (Number(this.travellersArray.length) + 1);
        this.wp_charge_tax = this.seacthResult.fareData.wpServiceTax * (Number(this.travellersArray.length) + 1);
        this.concession = this.seacthResult.fareData.totalConcession * (Number(this.travellersArray.length) + 1);
        this.totalCollectibleAmount = (this.seacthResult.fareData.totalCollectibleAmount * (Number(this.travellersArray.length) + 1)) + this.convenience_fee + Number(this.travel_ins_charge);
        this.error = 0;

    }
    childCount: number = 1;
    addChild(passenger,checkboxIndex) {
    
    
        if ((this.childrenArray.length + 1) <= (this.maxInfants)) {
        
            if(checkboxIndex ==-1)
            this.childrenArrayM.push(this.childCount);
        
            this.childrenArray.push(this.childCount);
            var i = Number(this.childCount);
            
            if(checkboxIndex !=-1)
            this.saveChildTravellerId[checkboxIndex]=i;
            
            var gender=""; var arrAge = ""; var childpassenger = "";
           if(passenger !=-1){
              
                if((passenger.gender == 'M') || (passenger.gender == 'Male')) {
                gender = 'M'
                }else if((passenger.gender == 'F') || (passenger.gender == 'Female')){
                gender = 'F';
                }
               
                if(passenger.age != undefined){
                arrAge = passenger.age;
                }else{
                arrAge = passenger.age;
                }
             childpassenger=passenger.firstName+' '+passenger.lastName;
            }    
            
            this.passengerForm.addControl('childName' + i, new FormControl(childpassenger, [Validators.required, Validators.pattern(this.patternName), Validators.minLength(this.minNameLength)]));
            this.passengerForm.addControl('childGender' + i, new FormControl(gender, Validators.required));
            this.passengerForm.addControl('childAge' + i, new FormControl(arrAge, Validators.required));
            // this.passengerForm.addControl('saveTravellerInfant' + i, new FormControl('1'));
            
            this.passengerForm.controls['childName' + i].updateValueAndValidity();
            this.passengerForm.controls['childGender' + i].updateValueAndValidity();
            this.passengerForm.controls['childAge' + i].updateValueAndValidity();
            this.childCount++;
              if(checkboxIndex !=-1){
           $('#passengerBox_'+checkboxIndex).removeClass('hidden');
           $('#travelPassenger_'+checkboxIndex).prop('checked', true); 
           }
            
        } else {
          if(checkboxIndex !=-1){
          $('#passengerBox_'+checkboxIndex).addClass('hidden');
          $('#travelPassenger_'+checkboxIndex).prop('checked', false); 
          }
            var message = 'Maximum Infants cannot be more than ' + this.maxInfants;
            const dialogRef = this.dialog.open(ConfirmationDialog, {
                disableClose: true,
                width: '600px',
                id: 'messageforMliteDialog',
                data: {
                    errorDialog: true,
                    messageData: message
                }
            });
            //this.childCount = Number(this.maxInfants)+1;
        }
    }
    
    
    removeChild(val,checkboxIndex) {
        var passengerName = this.passengerForm.controls['childName' + val]['value'];
         if(checkboxIndex !=-1)
         $('#passengerBox_'+checkboxIndex).addClass('hidden');
 
 
 
        const index = this.childrenArray.indexOf(val, 0); 
        if (index > -1) {
            this.childrenArray.splice(index, 1);
        }
        
        
        if(checkboxIndex ==-1){
        const index1 = this.childrenArrayM.indexOf(val, 0); 
        if (index1 > -1) {
        this.childrenArrayM.splice(index1, 1);
        }

        }

        if (this.travellerlist.length > 0) {
            var trvList = [];
            for (let i of this.travellerlist) {
                var trvlist = i;
                var combineName = trvlist.firstName+ " " +trvlist.lastName;
                trvList.push({name:combineName}); 
            }
            for (var index1 in trvList) {
                var fullName = trvList[index1]['name'];
                if(fullName == passengerName) {
                    this.disableCheckboxInfant[index1]=true;
                    this.modalcheckedvalueInfant[index1]=false;
                    break;
                }
            }
        }

        this.passengerForm.removeControl('childName' + val);
        this.passengerForm.removeControl('childGender' + val);
        this.passengerForm.removeControl('childAge' + val);

        this.passengerForm.clearValidators();
        this.childCount--;
        this.children.splice(val, 1);

    }

    arrayRemove(arr, value) {
        return arr.filter(item => item !== item); 
    }
    calculateAge(dob) { 
        var today = new Date();
        var birthDate = new Date(dob);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age = age - 1;
        }
        return age;
    }
    getCustomerGstDetails(){
        if(this.enableGST==1){ 
        var requestParams = {
            'customerId':this.REWARD_CUSTOMERID
        };
        var requestParamsEncrpt = {
            postData:this.EncrDecr.set(JSON.stringify(requestParams)) 
        };
        this.rest.getCustomerGstDetails(requestParamsEncrpt).subscribe(response => {
            // let respData = JSON.parse(this.EncrDecr.get(response.result ));
            if(response['errorcode'] == 0){
            
            if(response['value'].length > 0){
        response['value'] =   response['value'].sort(function (a, b) {
        var x = a['id']; var y = b['id'];
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        });
        }
            
                this.GSTList = response['value'];
                this.GSTListLength=this.GSTList.length;
                    if(this.GSTListLength>0){
                this.getGSTShow=true;
            }else{
                this.getGSTShow=false;
            }
            }
        });
        }else{
        this.getGSTShow=false;
       }
       for(let i=0;i<this.GSTListLength;i++){
            this.isCheckedGST[i]=false;
        }
    }
    fillupGSTDetailOnCheck($event,data,GSTIndex){ 
        if($event.target.checked){
            this.selectedGST.push(GSTIndex);
            this.checkedGST.push({ 
                                    "gstNumber":  data.gstNumber,
                                    "gstName":    data.gstName,
                                    "address":    data.address,
                                    "pinCode":    data.pinCode,
                                    "city":       data.city,
                                    "state":      data.state,
                                    });
            var checkedGSTLength=this.checkedGST.length;

            this.passengerForm['controls']['gstNumber'].setValue(this.checkedGST[checkedGSTLength-1].gstNumber);
            this.passengerForm['controls']['gstBusinessName'].setValue(this.checkedGST[checkedGSTLength-1].gstName);
            this.passengerForm['controls']['gstAddress'].setValue(this.checkedGST[checkedGSTLength-1].address);
            this.passengerForm['controls']['gstPincode'].setValue(this.checkedGST[checkedGSTLength-1].pinCode);
            this.passengerForm['controls']['gstCity'].setValue(this.checkedGST[checkedGSTLength-1].city);
            this.passengerForm['controls']['gstState'].setValue(this.checkedGST[checkedGSTLength-1].state);
            this.getCityResidence($event);
            this.isCheckedGST[GSTIndex]=true;
        }else{
            this.selectedGST.pop(GSTIndex);
             this.isCheckedGST[GSTIndex]=false;
            this.checkedGST.pop({ 
                                    "gstNumber":  data.gstNumber,
                                    "gstName":    data.gstName,
                                    "address":    data.address,
                                    "pinCode":    data.pinCode,
                                    "city":       data.city,
                                    "state":      data.state,
                                });
            if(this.passengerForm.controls['gstNumber'].value==data.gstNumber){
                this.passengerForm['controls']['gstNumber'].setValue('');
                this.passengerForm['controls']['gstBusinessName'].setValue('');
                this.passengerForm['controls']['gstAddress'].setValue('');
                this.passengerForm['controls']['gstPincode'].setValue('');
                this.passengerForm['controls']['gstCity'].setValue('');
                this.passengerForm['controls']['gstState'].setValue('');
            }
        }
    }
    saveTravellerFunc(){
        var saveTravellerArray: any=[];
        var ii=1;
        
        if (this.travellersArray.length > 0) {
           for (let i of this.travellersArray) {

                var checksaveTraveller;
                if(this.passengerForm.controls['saveTraveller']['value'] == true){
                    checksaveTraveller=1;
                }else{
                    checksaveTraveller= 0;
                }

                if(checksaveTraveller==1){
                    var gender;
                    if(this.passengerForm.controls['passengerGender' + i]['value']=="Male"){
                        gender='M';
                    }else if(this.passengerForm.controls['passengerGender' + i]['value']=="Female"){
                        gender='F';
                    }else{
                        gender=this.passengerForm.controls['passengerGender' + i]['value'];
                    }
                    saveTravellerArray.push({
                        "age": this.passengerForm.controls['passengerAge' + i]['value'],
                        "birthPreference": this.passengerForm.controls['passengerBerthChoice' + i]['value'],
                        "concessionType": '',
                        "customerId": this.REWARD_CUSTOMERID,
                        "dateOfBirth": "",
                        "emailId": this.passengerForm.controls['passengerEmail']['value'],
                        "firstName": this.passengerForm.controls['passengerName' + i]['value'].trim(),
                        "gender": gender,
                        "id": 0,
                        "lastName": '',
                        "mobileNumber": this.passengerForm.controls['passengerMobile']['value'],
                        "passportExpiryDate": "",
                        "passportIssueCountry": "",
                        "passportIssueDate": "",
                        "passportNumber": "",
                        "paxBirthCountry": "",
                        "paxNationality": "",
                        "status": 0,
                        "title": ""
                        });

                }
               
                ii++;
           }
           
       }
       
        if (this.childrenArray.length > 0) {
           for (let i of this.childrenArray) {

                var checksaveTravellerInfant;
                if(this.passengerForm.controls['saveTraveller']['value'] == true){
                    checksaveTravellerInfant=1;
                }else{
                    checksaveTravellerInfant= 0;
                }

                if(checksaveTravellerInfant==1){
                    var gender;
                    if(this.passengerForm.controls['childGender' + i]['value']=="Male"){
                        gender='M';
                    }else if(this.passengerForm.controls['childGender' + i]['value']=="Female"){
                        gender='F';
                    }else{
                        gender=this.passengerForm.controls['childGender' + i]['value'];
                    }
                    saveTravellerArray.push({
                        "age": this.passengerForm.controls['childAge' + i]['value'],
                        "birthPreference": '',
                        "concessionType": '',
                        "customerId": this.REWARD_CUSTOMERID,
                        "dateOfBirth": "",
                        "emailId": this.passengerForm.controls['passengerEmail']['value'],
                        "firstName": this.passengerForm.controls['childName' + i]['value'].trim(),
                        "gender": gender,
                        "id": 0,
                        "lastName": '',
                        "mobileNumber": this.passengerForm.controls['passengerMobile']['value'],
                        "passportExpiryDate": "",
                        "passportIssueCountry": "",
                        "passportIssueDate": "",
                        "passportNumber": "",
                        "paxBirthCountry": "",
                        "paxNationality": "",
                        "status": 0,
                        "title": ""
                        });

                }
               
                ii++;
           }
           
       }
       
       
        if( this.enablesavedTraveller==1 && saveTravellerArray.length >0){
            var requestParamsEncrpt = {
            postData:this.EncrDecr.set(JSON.stringify(saveTravellerArray)) 
            };
            this.rest.saveCustomertravellerInfo(requestParamsEncrpt).subscribe(response => {
            })
        }
    }
    saveCustomerGst(){
       if(this.passengerForm['controls']['saveGST'].value == true){
        var saveGSTArray: any=[];
          saveGSTArray.push({
          "address": this.passengerForm.controls['gstAddress']['value'],
          "city": this.passengerForm.controls['gstCity']['value'],
          "customerId": this.REWARD_CUSTOMERID,
          "gstName": this.passengerForm.controls['gstBusinessName']['value'],
          "gstNumber": this.passengerForm.controls['gstNumber']['value'],
          "id": 0,
          "pinCode": this.passengerForm.controls['gstPincode']['value'],
          "state": this.passengerForm.controls['gstState']['value'],
        });
	  var requestParamsEncrpt = {
	    postData:this.EncrDecr.set(JSON.stringify(saveGSTArray)) 
	  };
	  this.rest.saveCustomerGstDetails(requestParamsEncrpt).subscribe(response => {
	     // console.log(response);
	  })
       } 
    }
}

@Component({
    selector: 'confirmation-dialog',
    templateUrl: 'dialog.html',
    styleUrls: ['./travellers.component.scss']
})
export class ConfirmationDialog {
  cdnUrl: any;
    checkDate: any;
    siteKey: any; serviceSettings:any;
    searchArray: any = [];
    Form1Submit: FormGroup;
    Form2Submit: FormGroup;
    submittedForm1: boolean = false; submittedForm2: boolean = false; submittedForm3: boolean = false;
    step1: boolean = false; step2: boolean = false; verifySuccess: boolean = false; step4: boolean = false; verifyFail: boolean = false;
    paramForm1: any; paramStep1: any; paramStep2: any;
    emailPattern = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    patternPwd = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    response: any = []; responseUserDetails: any = [];
    //date-picker
    maxDate: any;

    constructor(private cd: ChangeDetectorRef,public dialogRef: MatDialogRef<ConfirmationDialog>, @Inject(MAT_DIALOG_DATA) public data: any, private location: Location, private router: Router, public _irctc: IrctcApiService, private calendar: NgbCalendar, private ngbDateParserFormatter: NgbDateParserFormatter, private sg: SimpleGlobal,private appConfigService:AppConfigService) {
        dialogRef.disableClose = true;
     }

    ngOnInit() {
         this.cdnUrl = environment.cdnUrl + this.sg['assetPath'];
         this.serviceSettings=this.appConfigService.getConfig();
        this.siteKey = this.serviceSettings.SITEKEY;
        const form1Group: FormGroup = new FormGroup({});
        form1Group.addControl('email', new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]));
        form1Group.addControl('dob', new FormControl('', [Validators.required]));
        form1Group.addControl('recaptcha1', new FormControl('', [Validators.required]));
        this.Form1Submit = form1Group;

        const form2Group: FormGroup = new FormGroup({});
        form2Group.addControl('userID', new FormControl(''));
        form2Group.addControl('mobileNo', new FormControl(''));
        form2Group.addControl('smsOTP', new FormControl(''));
        form2Group.addControl('recaptcha2', new FormControl(''));
        this.Form2Submit = form2Group;

        this.step1 = true;
        this.step2 = false;
        this.verifySuccess = false;
        this.verifyFail = false;
        this.step4 = true;

        this.maxDate = new Date();
        var mm = ("0" + (this.maxDate.getMonth() + 1)).slice(-2);
        var dd = ("0" + this.maxDate.getDate()).slice(-2);
        var yyyy = this.maxDate.getFullYear();

        this.checkDate = this.checkmaxDate(dd, mm, yyyy)

    }
     ngAfterContentChecked() {
    this.cd.detectChanges();
     }
    onYesClick(): void {
        this.dialogRef.close(true);

    }

    checkmaxDate(dd, mm, yyyy) {
        return new Date(yyyy - 18, mm - 1, dd);
    }
    //Forgot User id
    apimessage: string; dialogmsg: string; OTPmessage: string;
    forgotDetailsFormSubmit() {
        this.submittedForm1 = true;
        if (this.Form1Submit.invalid) {
            return;
        } else {
            let email = (this.Form1Submit.controls['email']['value']).trim();
            let dob = this.Form1Submit.controls['dob']['value'];
            var datePipe = new DatePipe('en-US');
            dob = datePipe.transform(new Date(dob), 'yyyyMMdd');
            // • requestType (P – for Password, U – For user details)
            // • userLoginId (Required only to get password.)
            // • otpType (Required only to get password. E - Password on mail, M – Password on mobile)
            // • dob (Required only to get user name)
            this.paramForm1 = {
                "dob": dob,
                "email": email,
                "mobile": "",
                "requestType": "U",         //RequestType=U; requesting for UserId
                "otpType": "M"
            }
            var paramForm1Str = JSON.stringify(this.paramForm1);
            this._irctc.forgotDetails(paramForm1Str).subscribe(data => {
                // console.log(data);
                this.response = data;
                if (this.response.partnerResponse.status) {
                    this.step4 = false;
                    this.verifySuccess = true;
                    this.dialogmsg = "Reset successful";
                    this.apimessage = this.response.partnerResponse.status;
                } else if (this.response.partnerResponse.error) {
                    this.step4 = false;
                    this.verifyFail = true;
                    this.dialogmsg = "Reset fail";
                    this.apimessage = this.response.partnerResponse.error;
                } else {
                    alert("Error! Please check details");
                    this.goback();
                }
            });
        }
    }
    cnfPassValidError: boolean = false; cnfPassValidErrorMsg: string; errorInvalid: number = 1;
    validateConfirmPassword() {
        let pass = this.Form2Submit.controls['newPassword']['value'];
        let confirmPass = this.Form2Submit.controls['confirmPassword']['value'];
        if (pass.trim() == confirmPass.trim()) {
            this.cnfPassValidError = false;
            this.cnfPassValidErrorMsg = ""
            this.errorInvalid = 0;
        } else {
            this.cnfPassValidError = true;
            this.cnfPassValidErrorMsg = "Confirm Password does not match.";
            this.errorInvalid = 1;
        }
    }
    //forgot password - Step 1
    nextStep() {
        this.submittedForm2 = true;
        this.Form2Submit.controls['userID'].setValidators([Validators.required, Validators.pattern("^[A-Za-z][A-Za-z0-9]*(?:_[A-Za-z0-9]+)*$"), Validators.minLength(3)]);
        this.Form2Submit.controls['userID'].updateValueAndValidity();
        this.Form2Submit.controls['mobileNo'].setValidators([Validators.required, Validators.pattern("^[6-9][0-9]{9}$"), Validators.minLength(10)]);
        this.Form2Submit.controls['mobileNo'].updateValueAndValidity();
        this.Form2Submit.controls['recaptcha2'].setValidators([Validators.required]);
        this.Form2Submit.controls['recaptcha2'].updateValueAndValidity();

        if (this.Form2Submit.controls['userID'].invalid || this.Form2Submit.controls['mobileNo'].invalid || this.Form2Submit.controls['recaptcha2'].invalid) {
            return;
        } else {
            let userID = (this.Form2Submit.controls['userID']['value']).trim();
            let mobileNo = this.Form2Submit.controls['mobileNo']['value'];
            this.paramStep1 = {
                "userLoginId": userID,
                "mobile": mobileNo,
                "requestType": "P",      //RequestType=P; requesting for Password
                "otpType": "M"           //otpType (B – Verify OTP for both mobile and email, E – Verify OTP only for mail, M – Verify OTP for mobile)
            }
            var paramStep1Str = JSON.stringify(this.paramStep1);
            this._irctc.forgotPassword(paramStep1Str).subscribe(data => {
                this.response = data;
                if (this.response.partnerResponse.status) {
                    this.step1 = false;
                    this.step2 = true;
                    this.OTPmessage = this.response.partnerResponse.status;
                } else if (this.response.partnerResponse.error) {
                    this.step1 = false;
                    this.verifyFail = true;
                    this.dialogmsg = "Reset fail";
                    this.apimessage = this.response.partnerResponse.error;
                } else {
                    alert("Error! Please check details");
                    this.onYesClick();
                }
            });
        }
    }
    gotoStep1() {
        this.step1 = true;
        this.step2 = false;
    }
    //Forgot Password - Step 2
    resetPasswordFormSubmit() {
        this.Form2Submit.controls['smsOTP'].setValidators([Validators.required, Validators.pattern("^[0-9]*$")]);
        this.Form2Submit.controls['smsOTP'].updateValueAndValidity();
        this.submittedForm3 = true;
        if (this.Form2Submit.invalid) {
            return;
        } else {
            let smsOTP = (this.Form2Submit.controls['smsOTP']['value']).trim();
            let userID = (this.Form2Submit.controls['userID']['value']).trim();

            this.paramStep2 = {
                "otpType": "M",     //otpType (B – Verify OTP for both mobile and email, E – Verify OTP only for mail, M – Verify OTP for mobile)
                "smsCode": smsOTP,
                "userLoginId": userID
            }
            var paramStep2Str = JSON.stringify(this.paramStep2);
            this._irctc.verifyOTP(paramStep2Str).subscribe(data => {
                //console.log(data);
                this.response = data;
                if (this.response.partnerResponse.status) {
                    this.step2 = false;
                    this.verifySuccess = true;
                    this.dialogmsg = "Reset successful";
                    this.apimessage = this.response.partnerResponse.status;
                } else if (this.response.partnerResponse.error) {
                    this.step2 = false;
                    this.verifyFail = true;
                    this.dialogmsg = "Reset fail";
                    this.apimessage = this.response.partnerResponse.error;
                } else {
                    alert("Error! Please check details");
                    this.goback();
                }
            });
        }
    }
    /*number input */
    numberInput($event) {
        var keycode = $event.which;
        if (!(keycode >= 48 && keycode <= 57)) {
            event.preventDefault();
        }
    }
    AvoidSpace($event) {
        var keycode = $event.which;
        if (keycode == 32)
            event.preventDefault();
    }
    /*special char & rupee symbol ( Rs.)*/
    specialcharInput($event) {
        var keycode = $event.which;
        if ((keycode >= 33 && keycode <= 47) || (keycode >= 91 && keycode <= 96) || (keycode >= 58 && keycode <= 64) || (keycode >= 123 && keycode <= 126) || (keycode == 8377)) {
            event.preventDefault();
        }
    }
    goback() {
        this.dialogRef.close(true);
        //this.location.back();
    }

}

@Component({
    selector: 'app-bottom-sheet',
    templateUrl: 'summary_modal.html',
    styleUrls: ['./travellers.component.scss']
})
export class BottomSheetComponent implements OnInit {
    ngOnInit() {
    }
    appConfig: any;
    cdnUrl: any;
    constructor(private _bottomSheet: MatBottomSheet, @Inject(MAT_BOTTOM_SHEET_DATA) public data: any, @Inject(APP_CONFIG) appConfig: any) {
        this.appConfig = appConfig;
        this.cdnUrl = environment.cdnUrl;
        
    }
    closeBottomSheet(): void {
        this._bottomSheet.dismiss();
    }
}

@Component({
    selector: 'travelInsurance-dialog',
    templateUrl: 'travelInsuranceDialog.html',
    styleUrls: ['./travellers.component.scss']
})
export class TravelInsuranceDialog {
    domainName:any;
    constructor(private sg: SimpleGlobal,public dialogTravel: MatDialogRef<TravelInsuranceDialog>, @Inject(MAT_DIALOG_DATA) public data: any) { 
       this.domainName = this.sg['domainName']; 
    }
    ngOnInit() { }
    travelInsuranceOptedFun(val) {
        this.dialogTravel.close(val);
    }
}



@Component({
    selector: 'error-dialog',
    templateUrl: './error-alert.component.html'
})


export class ErrorDialog {
    backSearchData: any;
    appConfig: any;
    cdnUrl: any;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<ErrorDialog>, private location: Location, private router: Router, @Inject(APP_CONFIG) appConfig: any, private sg: SimpleGlobal) {
        this.backSearchData = {
            searchFrom: this.data.backSearchData.travalfrom,
            searchTo: this.data.backSearchData.travalto,
            fromTravelCode: this.data.backSearchData.frmStn,
            toTravelCode: this.data.backSearchData.toStn,
            departure: this.data.backSearchData.journeyDate,
        };
        this.appConfig = appConfig;
        this.cdnUrl = environment.cdnUrl + this.sg['assetPath'];
    }

    startOver(): void {
        this.dialogRef.close(true);
    }

}

@Component({
    //selector: 'validatenewUserOTP-dialog',
    templateUrl: 'validatenewUserOTP.html',
    styleUrls: ['./travellers.component.scss']
})
export class newUserValidate {

    Form2Submit: FormGroup;
    step1: boolean = false; step2: boolean = false;
    submittedForm2: boolean = false; submittedForm3: boolean = false; sendOTP: any; userID: any; verifySuccess: any;
    getotpParam: any = []; paramStep2: any[]; response: any = []; apimessage: any; OTPmessage; any; verifyFail: any; dialogmsg: any;
     cdnUrl: any;
    constructor(private EncrDecr: EncrDecrService, public dialogRef: MatDialogRef<ConfirmationDialog>, public _irctc: IrctcApiService, private formBuilder: FormBuilder, public dialogTravel: MatDialogRef<newUserValidate>, @Inject(MAT_DIALOG_DATA) public data: any  , private sg: SimpleGlobal) {
        dialogRef.disableClose = true;

     }
    ngOnInit() {
      this.cdnUrl = environment.cdnUrl + this.sg['assetPath'];
        const form2Group: FormGroup = new FormGroup({});
        form2Group.addControl('userID', new FormControl(''));
        form2Group.addControl('smsOTP', new FormControl(''));
        form2Group.addControl('emailOTP', new FormControl(''));
        this.Form2Submit = form2Group;
        this.step1 = true;
        this.step2 = false;

    }
    nextStep() {
        this.submittedForm2 = true;
        this.Form2Submit.controls['userID'].setValidators([Validators.required, Validators.pattern("^[A-Za-z][A-Za-z0-9]*(?:_[A-Za-z0-9]+)*$"), Validators.minLength(3)]);
        this.Form2Submit.controls['userID'].updateValueAndValidity();
        if (this.Form2Submit.controls['userID'].invalid) {
            return;
        } else {
            this.userID = (this.Form2Submit.controls['userID']['value']).trim();
            this.getotpParam = {
                "userLoginId": this.userID,
                "otpType": "B"
            }

            var requestOTP = {
                postData: this.EncrDecr.set(JSON.stringify(this.getotpParam))
            };



            this._irctc.getOTP(requestOTP).subscribe(data => {
                this.response = data;
                if (this.response.partnerResponse.status) {
                    this.step1 = false;
                    this.step2 = true;
                    this.OTPmessage = this.response.partnerResponse.status;
                }
                else if (this.response.partnerResponse.error) {
                    this.step1 = false;
                    this.verifyFail = true;
                    this.dialogmsg = "Reset fail";
                    this.apimessage = this.response.partnerResponse.error;
                } else {
                    alert("Error! Please check details");
                    // this.onYesClick();
                }
            });
        }
        this.submittedForm3 = true;
    }
    gotoStep1() {
        this.step1 = true;
        this.step2 = false;
    }
    verifyOTP() {
        this.Form2Submit.controls['smsOTP'].setValidators([Validators.required, Validators.pattern("^[0-9]*$")]);
        this.Form2Submit.controls['smsOTP'].updateValueAndValidity();
        this.Form2Submit.controls['emailOTP'].setValidators([Validators.required, Validators.pattern("^[0-9]*$")]);
        this.Form2Submit.controls['emailOTP'].updateValueAndValidity();
        this.submittedForm3 = true;
        if (this.Form2Submit.invalid) {
            return;
        } else {
            let smsOTP = (this.Form2Submit.controls['smsOTP']['value']).trim();
            let userID = (this.Form2Submit.controls['userID']['value']).trim();
            let emailOTP = (this.Form2Submit.controls['emailOTP']['value']).trim();
            this.sendOTP = {
                "emailCode": emailOTP,
                "otpType": "B",
                "smsCode": smsOTP,
                "userLoginId": this.userID
            }


            var paramStep2Str = {
                postData: this.EncrDecr.set(JSON.stringify(this.sendOTP))
            };

            this._irctc.verifyOTP(paramStep2Str).subscribe(data => {
                this.response = data;
                if (this.response.partnerResponse.status) {
                    this.step2 = false;
                    this.verifySuccess = true;
                    this.dialogmsg = "Reset successful";
                    this.apimessage = this.response.partnerResponse.status;
                } else if (this.response.partnerResponse.error) {
                    this.step2 = false;
                    this.verifyFail = true;
                    this.dialogmsg = "Reset fail";
                    this.apimessage = this.response.partnerResponse.error;
                } else {
                    alert("Error! Please check details");
                    // this.goback();
                }
            });
        }
    }

    AvoidSpace($event) {
        var keycode = $event.which;
        if (keycode == 32)
            event.preventDefault();
    }

    specialcharInput($event) {
        var keycode = $event.which;
        if ((keycode >= 33 && keycode <= 47) || (keycode >= 91 && keycode <= 96) || (keycode >= 58 && keycode <= 64) || (keycode >= 123 && keycode <= 126) || (keycode == 8377)) {
            event.preventDefault();
        }
    }

    goback() {
        this.dialogRef.close(true);
    }

    numberInput($event) {
        var keycode = $event.which;
        if (!(keycode >= 48 && keycode <= 57)) {
            event.preventDefault();
        }
    }

}
export interface DialogData {
    messageData: string;
    showC: boolean;
}
@Component({
    // selector: 'confirmation-dialog2',
    templateUrl: './userpasswordblock.html',
})
export class ConfirmationDialogclose {
    constructor(public dialogRef: MatDialogRef<ConfirmationDialog>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

    onYesClick(): void {
        this.dialogRef.close(true);
    }

}

@Component({
    selector: 'confirmation-new-dialog',
    templateUrl: './dialog1.html',
    styleUrls: ['./travellers.component.scss'],
})
export class ConfirmationDialogNew {
    constructor(public dialogRef: MatDialogRef<ConfirmationDialogNew>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) {
            dialogRef.disableClose = true;

         }

    onYesClick(): void {
        this.dialogRef.close(1);
    }
    onNoClick(): void {
        this.dialogRef.close(0);
    }
}

@Component({
    selector: 'confirmation-new-dialog',
    templateUrl: './passportDialog.html',
    styleUrls: ['./travellers.component.scss'],
})
export class passportDialog {
    constructor(public dialogRef: MatDialogRef<passportDialog>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) { 
            dialogRef.disableClose = true;

        }

    onYesClick(): void {
        this.dialogRef.close();
    }
}
@Component({
    // selector: 'confirmation-new-dialog',
    templateUrl: './usrIDforgotdialog.html',
    styleUrls: ['./travellers.component.scss'],
})
export class userIDforgot {
    domainName:any;
    constructor(private sg: SimpleGlobal,public dialogRef1: MatDialogRef<userIDforgot>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) { 
            
            dialogRef1.disableClose = true;
            this.domainName = this.sg['domainName'];

        }

    onYesClick(): void {
        this.dialogRef1.close(1);
    }
    onNoClick():void{
        this.dialogRef1.close(0);
    }
}

@Component({
    // selector: 'dialog-overview-example-dialog',
    templateUrl: 'covid-waitlist-popup.html',
    styleUrls: ['./travellers.component.scss']
  })
  export class covidconfirmation {
    domainName:any;
    constructor( private sg: SimpleGlobal,
      public dialogRef: MatDialogRef<covidconfirmation>,
      @Inject(MAT_DIALOG_DATA) public data: any) {
        this.domainName = this.sg['domainName'];
       }
  
      onYesClick(): void {
        this.dialogRef.close(true);
      }
      onNoClick(): void{
        this.dialogRef.close(false);
      }
  
  }
