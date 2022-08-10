import { Component, OnInit,OnDestroy,DebugNode, NgModule,ViewChild, ChangeDetectorRef, ElementRef, Inject, ɵConsole, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightService } from 'src/app/common/flight.service';
import { Location } from '@angular/common';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { SimpleGlobal } from 'ng2-simple-global';
import {environment} from '../../../environments/environment';
import { AppConfigService } from '../../app-config.service';
import { EncrDecrService } from 'src/app/shared/services/encr-decr.service';
import { RestapiService } from 'src/app/shared/services/restapi.service';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { createMask } from '@ngneat/input-mask';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IrctcApiService } from 'src/app/shared/services/irctc.service';
import alertifyjs from 'alertifyjs';
import * as moment from 'moment';
import { DOCUMENT, NgStyle, DecimalPipe, DatePipe } from '@angular/common';
import { CountdownConfig, CountdownEvent } from 'ngx-countdown';
import { stringify } from '@angular/compiler/src/util';


function validateAdultAge(c: FormControl) {
let journery_date=$('#journery_date').val();
let check_date=moment(new Date(journery_date)).subtract(12, 'years').calendar();
let input_date= moment(c.value).format('YYYY-MM-DD');
let to_date=moment(check_date).format('YYYY-MM-DD');
if(moment(input_date).isAfter(to_date))
{
return  {
validateAdultAge: {
valid: false
}
};
}
}

function validateChildAge(c: FormControl) {
let journery_date=$('#journery_date').val();
	let mndate=moment(new Date(journery_date)).subtract(12, 'years').calendar();
	let mxdate=moment(new Date(journery_date)).subtract(2, 'years').calendar();
	let mindate =moment(mndate).format('YYYY-MM-DD');
	let maxdate =moment(mxdate).format('YYYY-MM-DD');
	let input_date= moment(c.value).format('YYYY-MM-DD');

	if(moment(mindate).isAfter(input_date) && moment(maxdate).isAfter(input_date) )
	{
        return  {
        validateChildAge: {
        valid: false
        }
        };
	}

}

function validateInfantAge(c: FormControl) {
let journery_date=$('#journery_date').val();

	let mndate=moment(new Date(journery_date)).subtract(2, 'years').calendar();
	let current_date =moment(new Date()).format('YYYY-MM-DD');
	let mindate =moment(mndate).format('YYYY-MM-DD');
	let maxdate =moment().format('YYYY-MM-DD');
	let input_date= moment(c.value).format('YYYY-MM-DD');

	if(moment(input_date).isAfter(mindate) && moment(input_date).isBefore(maxdate)&& moment(input_date).isBefore(current_date)){}else{
        return  {
        validateInfantAge: {
        valid: false
        }
        };
	}
}

declare let alertify: any;
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
  selector: 'app-flight-checkout',
  templateUrl: './flight-checkout.component.html',
  styleUrls: ['./flight-checkout.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class FlightCheckoutComponent implements OnInit ,OnDestroy {
   savedCards: any = [];
       XSRFTOKEN: string;
           IsDcemiEligibleFlag: boolean = false;
               isFlexipayEligibleFlag:boolean = false;
                 sendflexiFare:any;
                  flexiIntrest:any;
      showFlexipay:any;
 flexipaysummry:any;
 flexiDiscount:any;
priceSummaryResponse:any;
pricingId:any;
itineraryid:any;
partnerConvFee: number = 0;
old_fare: number = 0;
new_fare: number = 0;
      flightSessionData:any;
       flightInfo:any;
       itinararyResponse:any;
        enableVAS: number = 0;
        completedSteps=1;
        passengerForm: FormGroup;
        loaderValue = 10;
        passengerAdultFormCount: number = 1;
        passengerChildFormCount: number = 1;
        passengerInfantFormCount: number = 1;
        currentId: any;
        dateInputMask = createMask<Date>({
        alias: 'datetime',
        inputFormat: 'dd/mm/yyyy',
        parser: (value: string) => {
        const values = value.split('/');
        const year = +values[2];
        const month = +values[1] - 1;
        const date = +values[0];
        return new Date(year, month, date);
        },
        });

        emailInputMask = createMask({ alias: 'email' });
        saveAdultTravellerId=[]; saveChildTravellerId=[];    saveInfantTravellerId=[];
        patternName = /^[a-zA-Z\s]*$/;
        emailPattern = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
        maxAdults: number;
        maxChilds: number;
        maxInfants: number;
        minNameLength: number;
        maxNameLength: number;
        minPassportLength: number;
        maxPassportLength: number;
        gstshow = false;
        gstSelected: boolean = false;
        cdnUrl: any;
        serviceSettings:any;
        flightClasses:any;
        whatsappFeature: number = 0;
        customerInfo: any;
        coupon_id: any;
        indexCoupon: any;
        coupon_name: any;
        coupon_code: any;
        remove_Coupon: any;
        coupon_amount: number = 0;
        vas_amount: number = 0;
        REWARD_CUSTOMERID: string;
        REWARD_EMAILID: string;
        REWARD_MOBILE: string;
        REWARD_CUSTOMERNAME: string;
        REWARD_TITLE:string;
        totalCollectibleAmount: any;
        totalCollectibleAmountFromPartnerResponse: any;
         totalCollectibleAmountFromPartnerResponseOrg: any;
        onwardAmount: any;
        returnAmount: any;
        convenience_fee: number = 0;
        partnerToken:any;

        isAdultExpanded:boolean = false;
        isChildExpanded:boolean = false;
        isInfantExpanded:boolean = false;
        isGstExpanded:boolean = false;
        enablesavedTraveller:number=0;
        enableGST:any;
        travellerlist:any;
        filterTravellerList:any;
        adultTravellerList:any;
        childTravellerList:any;
        infantTravellerList:any;
        GSTList:any=[];
        GSTListLength:any;
        selectedGST:any=[];
        checkedGST:any=[];
        disableCheckbox:any = [];
        disableCheckboxInfant:any = [];
        selectedCheckbox:any=[];
        selectedCheckboxInfant:any=[];
        getGSTShow:Boolean=false;
        modalcheckedvalue:any = []; modalcheckedvalueInfant:any = [];
        gstmodalcheckedvalue:any = false;
        isCheckedGST:any=[];
        gstDetails:any;
        adults = []; child = [];infant = [];
        adultsArray = [];
        childArray = [];
        infantArray = [];

        adultsArrayM = [];
        childArrayM = [];
        infantArrayM = [];

        flightOnwardDetails:any;
        flightReturnDetails:any;

        selectedOnwardVendor:any;
        selectedReturnVendor:any;

        airportsNameJson:any;
        airlinesNameJson:any;
        countryJson:any;
        EMI_interest: number = 16;
        EMIAvailableLimit: number = 3000;
        totalOnwardDuration:number=0;
        totalReturnDuration:number=0
        randomFlightDetailKey:any;
        searchData:any;
        BaseFare:any;
        Tax:any;
        TotalFare:any;
        AdtFare:number=0;
        ChildFare:number=0;
        InfantTotalFare:number=0;
        sessionTimer:any = 3;

        AdtQuantity:number=0;
        ChildQuantity:number=0;
        InfantQuantity:number=0;

        AdtBaseFare:number=0;
        ChildBaseFare:number=0;
        InfantBaseFare:number=0;


        baggageInfoOnward:any='';
        cancellationPolicyOnward:any='';

          baggageInfoReturn:any='';
        cancellationPolicyReturn:any='';


        flightDetailsArrVal:any;
        steps:any = 1;

        travelerDetails:any={};
        checked:any= false;
        whatsAppCheck:boolean = true;
        gstNumber:any
        mobileNumber:any;
        showLoader:number=1;
 serviceId:string='Flight';
  isMobile:boolean= true;
  isCollapseBasefare : boolean = false;
  isCollapseDiscount : boolean = false;
  isCollapseVas : boolean = false;
  isCollapse : boolean = false;


  constructor( private ref: ChangeDetectorRef,public _irctc: IrctcApiService,private _fb: FormBuilder,private _flightService:FlightService, private route:ActivatedRoute ,private router:Router, private sg: SimpleGlobal,private appConfigService:AppConfigService, private EncrDecr: EncrDecrService, public rest: RestapiService,private modalService:NgbModal, @Inject(DOCUMENT) private document: any) {
   this.route.url.subscribe(url =>{
                this.cdnUrl = environment.cdnUrl+this.sg['assetPath'];
                this.serviceSettings=this.appConfigService.getConfig();
                this.whatsappFeature =this.serviceSettings.whatsappFeature;
                this.enableGST = this.serviceSettings.enableSavedGST;
                this.enablesavedTraveller = this.serviceSettings.enablesavedTraveller;
                this.flightClasses = this.serviceSettings.flightClasses;

                this.getAirpotsList();
                this.getAirLineList();
                this.getCountryList();
                 this.resetPopups('construct');
                const jobGroup: FormGroup = new FormGroup({});
                this.passengerForm = jobGroup;
                jobGroup.addControl('saveTraveller',new FormControl(''));
                jobGroup.addControl('passengerMobile', new FormControl(this.REWARD_MOBILE));
                jobGroup.addControl('passengerEmail', new FormControl(this.REWARD_EMAILID));
                jobGroup.addControl('whatsappFlag', new FormControl('1'));

                jobGroup.addControl('gstNumber', new FormControl());
                jobGroup.addControl('gstBusinessName', new FormControl());
                jobGroup.addControl('gstAddress', new FormControl());
                jobGroup.addControl('gstCity', new FormControl());
                jobGroup.addControl('gstPincode', new FormControl());
                jobGroup.addControl('gstState', new FormControl());
                jobGroup.addControl('saveGST', new FormControl('1'));
                
                this.adultsArray = [];
                this.childArray = [];
                this.infantArray = [];

                this.adultsArrayM = [];
                this.childArrayM = [];
                this.infantArrayM = [];
               this.passengerAdultFormCount = 1;
        this.passengerChildFormCount = 1;
        this.passengerInfantFormCount = 1;

         });

  }

  ngOnInit(): void {
       this.route.url.subscribe(url =>{
        this.resetPopups('onInint');
        
                this.steps=1;
                this.isMobile = window.innerWidth < 991 ?  true : false;
                if(this.isMobile){
                this._flightService.showHeader(false);
                }else{
                this._flightService.showHeader(true);
                }
                


          /*** SESSION */
        sessionStorage.removeItem("coupon_amount");
  setTimeout(() => {
    //Check Laravel Seesion
        if(this.sg['customerInfo']){
          this.customerInfo=this.sg['customerInfo'];
	  if(sessionStorage.getItem("channel")=="payzapp"){
		var customerInfo = this.sg['customerInfo'];
		this.XSRFTOKEN = customerInfo["XSRF-TOKEN"];
		this.REWARD_CUSTOMERID = '0000';
		this.REWARD_EMAILID = '';
		this.REWARD_MOBILE = '';
		this.REWARD_CUSTOMERNAME = '';
	  }else{
	   var customerInfo = this.sg['customerInfo'];

            if(customerInfo["org_session"]==1){

            // console.log(customerInfo)
             if(customerInfo["guestLogin"]==true){

                this.REWARD_CUSTOMERID = customerInfo["id"];
                this.XSRFTOKEN = customerInfo["XSRF-TOKEN"];
                this.IsDcemiEligibleFlag=true;
                this.isFlexipayEligibleFlag=true;
                this.enablesavedTraveller=0;
             }else{
                this.getQueryParamData();
                this.flightDetailsArrVal=sessionStorage.getItem(this.randomFlightDetailKey);

                this.flightSessionData=JSON.parse(this.flightDetailsArrVal);
                if(!this.flightSessionData){
                setTimeout(() => {
                 $("#bookingprocessFailed1").modal('show');
                }, 10);
                }else{
                this.searchData=(this.flightSessionData.queryFlightData);
                //console.log(this.searchData);
                 setTimeout(() => {
                $("#infoprocess").modal('show');
                }, 10);
                this.maxAdults=Number(this.searchData.adults);
                this.maxChilds=Number(this.searchData.child);
                this.maxInfants=Number(this.searchData.infants);
                this.travelerDetails=this.searchData;


                if(this.flightSessionData.travel=='DOM'){
                this.flightOnwardDetails = this.flightSessionData.onwardFlights;
                this.selectedOnwardVendor = this.flightSessionData.onwardPriceSummary;
                this.selectedReturnVendor = this.flightSessionData.returnPriceSummary;

                if(this.flightSessionData.returnFlights)
                this.flightReturnDetails=this.flightSessionData.returnFlights;
                else
                this.flightReturnDetails=[];
                }else{

                this.flightOnwardDetails = this.flightSessionData.onwardFlights;
                this.selectedOnwardVendor = this.flightSessionData.onwardPriceSummary;
                this.selectedReturnVendor = [];


                if(this.flightSessionData.returnFlights)
                this.flightReturnDetails=this.flightSessionData.returnFlights;
                else
                this.flightReturnDetails=[];

                }


                this.partnerToken=this.selectedOnwardVendor.partnerName;
                this.enableVAS= this.serviceSettings.enabledVAS[this.partnerToken];
                //console.log(this.partnerToken);
                //console.log(this.enableVAS);

                this.getFlightDetails(this.flightSessionData);
                }
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
                /* if(this.domainName != "SMARTBUY"){
                for(var i=0;i<cardData.length;i++){
                if(cardData[i].type == this.domainName){
                newCardArr.push({"bin":cardData[i].bin,"card_display_name":cardData[i].card_display_name,
                "card_id":cardData[i].card_id,"id":cardData[i].id,"type":cardData[i].type})
                this.savedCards = newCardArr;
                }else{
                this.savedCards = [];
                }
                }
                }else{
                this.savedCards = cardData;
                }*/

                // this.savedCards = data;
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
                if(resp == null || resp == undefined || resp == false){
                this.isFlexipayEligibleFlag = false;
                }else
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
                this.REWARD_CUSTOMERID = '0000';
                this.REWARD_EMAILID = '';
                this.REWARD_MOBILE = '';
                this.REWARD_CUSTOMERNAME = '';
                this.XSRFTOKEN = 'NULL';
                if (environment.localInstance == 0)
                    this.document.location.href = environment.MAIN_SITE_URL + this.sg['domainPath'] + 'check-login';
            }
          }
        }else {
            this.REWARD_CUSTOMERID = '0000';
            this.REWARD_EMAILID = '';
            this.REWARD_MOBILE = '';
            this.REWARD_CUSTOMERNAME = '';
            this.XSRFTOKEN = 'NULL';
            if (environment.localInstance == 0)
                this.document.location.href = environment.MAIN_SITE_URL + this.sg['domainPath'] + 'check-login';
         }
     }, 50);



         });
  }


  getQueryParamData() {
      this.route.queryParams
        .subscribe((params: any) => {
        this.randomFlightDetailKey = params.searchFlightKey
          sessionStorage.getItem(this.randomFlightDetailKey);
        });
  }


  getFlightDetails(param){

    if(param!=null){

      let flightKeys=[];
      flightKeys.push(param.onwardFlightKey);

      if(param.returnFlightKey)
      flightKeys.push(param.returnFlightKey);

        var onwardFlightFareKey = (param.onwardPriceSummary.clearTripFareKey != undefined && param.onwardPriceSummary.clearTripFareKey != null  ? param.onwardPriceSummary.clearTripFareKey : "");
        var returnFlightFareKey = (param.returnPriceSummary.clearTripFareKey != undefined && param.returnPriceSummary.clearTripFareKey != null  ? param.returnPriceSummary.clearTripFareKey : "");
        var body = {
          "docKey": param.docKey,
          "flightKeys": flightKeys,
          "partnerName": this.selectedOnwardVendor.partnerName,
          "onwardFlightFareKey": onwardFlightFareKey,
          "returnFlightFareKey": returnFlightFareKey,
          "splrtFlight": this.selectedOnwardVendor.splrtFareFlight
        }

        this.getFlightInfo(body,this.selectedOnwardVendor.partnerName,this.searchData);
        this.durationCalc();
      }


  }


        clickPassenger($event,passenger,checkboxIndex) {
        if($event.target.checked){
        if(passenger.age > 12)
        this.addAdult(passenger,checkboxIndex);
        else if(passenger.age > 2  && passenger.age < 5)
        this.addChild(passenger,checkboxIndex);
        else if(passenger.age > 1  && passenger.age < 3 )
        this.addInfant(passenger,checkboxIndex);
        }else{
         if(passenger.age > 12){
        this.currentId=$('#passengerBoxId_'+checkboxIndex).val();
        this.removeAdult(parseInt(this.currentId),checkboxIndex);
        }else if(passenger.age > 2  && passenger.age < 5){
        this.currentId=$('#passengerBoxId_'+checkboxIndex).val();
        this.removeChild(parseInt(this.currentId),checkboxIndex);
        } else if(passenger.age > 1  && passenger.age < 3 ){
        this.currentId=$('#passengerChildBoxId_'+checkboxIndex).val();
        this.removeInfant(parseInt(this.currentId),checkboxIndex);
        }

        }
        }


       manualAdultTraveller(type){
        this.addAdult(-1,-1);
       }

       manualMobileAdultTraveller(type){
        this.addAdult(-1,-1);
        $('#addTraveller_mlite').modal('show');
       }

       manualMobileChildTraveller(type){
        this.addChild(-1,-1);
        $('#childTraveller_mlite').modal('show');
       }

           manualMobileInfantTraveller(type){
        this.addInfant(-1,-1);
        $('#infantTraveller_mlite').modal('show');
       }


       validateMliteForm(type,traveller){
       this.passengerForm.markAllAsTouched();

       if(type=='adult'){

        if(this.passengerForm.controls['adult_title'+traveller]['status'] =='VALID' && this.passengerForm.controls['adult_first_name'+traveller]['status'] =='VALID' && this.passengerForm.controls['adult_last_name'+traveller]['status']  =='VALID' && this.passengerForm.controls['adult_dob'+traveller]['status'] =='VALID'){
         $('#addTraveller_mlite').modal('hide');
        }
       }


              if(type=='child'){

        if(this.passengerForm.controls['child_title'+traveller]['status'] =='VALID' && this.passengerForm.controls['child_first_name'+traveller]['status'] =='VALID' && this.passengerForm.controls['child_last_name'+traveller]['status']  =='VALID' && this.passengerForm.controls['child_dob'+traveller]['status'] =='VALID'){
         $('#childTraveller_mlite').modal('hide');
        }
       }


              if(type=='infant'){

        if(this.passengerForm.controls['infant_title'+traveller]['status'] =='VALID' && this.passengerForm.controls['infant_first_name'+traveller]['status'] =='VALID' && this.passengerForm.controls['infant_last_name'+traveller]['status']  =='VALID' && this.passengerForm.controls['infant_dob'+traveller]['status'] =='VALID'){
         $('#infantTraveller_mlite').modal('hide');
        }
       }


       }

       removeMobileAdult(val,checkboxIndex) {
        this.removeAdult(val,checkboxIndex);
        $('#addTraveller_mlite').modal('hide');
       }
           removeMobileChild(val,checkboxIndex) {
        this.removeChild(val,checkboxIndex);
        $('#childTraveller_mlite').modal('hide');
       }

           removeMobileInfant(val,checkboxIndex) {
        this.removeInfant(val,checkboxIndex);
        $('#infantTraveller_mlite').modal('hide');
       }



      manualChildTraveller(type){
        this.addChild(-1,-1);
       }

      manualInfantTraveller(type){
        this.addInfant(-1,-1);
       }





      addAdult(passenger,checkboxIndex) {

           if ((this.adultsArray.length ) < (this.maxAdults)) {
            this.adults.push(this.adultsArray.length);
            this.adultsArray.push(this.passengerAdultFormCount);

             if(checkboxIndex ==-1)
            this.adultsArrayM.push(this.passengerAdultFormCount);

            var i = Number(this.passengerAdultFormCount);

            if(checkboxIndex !=-1)
            this.saveAdultTravellerId[checkboxIndex]=i;

                var title="";   var adult_first_name = "";var adult_last_name = "";let adult_dob:any;

                let adult_passport:any;
                let adult_passport_expiry_date:any;
                let adult_passport_issue_date:any;
                var adult_passport_issuing_country='';
                var adult_pax_nationality='';
                var adult_pax_birthcountry='';


                if(checkboxIndex !=-1){
                title=passenger.title;
                adult_first_name=passenger.firstName;
                adult_last_name=passenger.lastName;



                if(passenger.dateOfBirth){
                const values = passenger.dateOfBirth.split('/');
                const year = +values[2];
                const month = +values[1]-1;
                const date = +values[0];
                adult_dob=new Date(year, month, date);
                }else{
                adult_dob='';
                }

                 adult_passport=passenger.passportNumber?passenger.passportNumber:'';
                adult_passport_issuing_country=passenger.passportIssueCountry?passenger.passportIssueCountry:'';
                adult_pax_nationality=passenger.paxNationality?passenger.paxNationality:'';
                adult_pax_birthcountry=passenger.paxBirthCountry?passenger.paxBirthCountry:'';

               if(passenger.passportExpiryDate){
                const values1 = passenger.passportExpiryDate.split('/');
                const year1 = +values1[2];
                const month1 = +values1[1]-1;
                const date1 = +values1[0];
                adult_passport_expiry_date=new Date(year1, month1, date1);
                }else{
                adult_passport_expiry_date='';
                }



                if(passenger.passportIssueDate){
                const values2 = passenger.passportIssueDate.split('/');
                const year2 = +values2[2];
                const month2 = +values2[1]-1;
                const date2 = +values2[0];
                adult_passport_issue_date=new Date(year2, month2, date2);
                }else{
                adult_passport_issue_date='';
                }

                }

             this.passengerForm.addControl('adult_title' + i, new FormControl(title, [Validators.required, Validators.minLength(2), Validators.maxLength(15)]));
             this.passengerForm.addControl('adult_first_name' + i, new FormControl(adult_first_name, [Validators.required,Validators.pattern(this.patternName), Validators.minLength(2), Validators.maxLength(26)]));
             this.passengerForm.addControl('adult_last_name' + i, new FormControl(adult_last_name, [Validators.required,Validators.pattern(this.patternName), Validators.minLength(2), Validators.maxLength(26)]));
             this.passengerForm.addControl('adult_dob' + i, new FormControl(adult_dob, [Validators.required,validateAdultAge]));



             if(this.searchData.travel=='INT'){
                this.passengerForm.addControl('adult_passport_num' + i, new FormControl('', [Validators.required]));
                this.passengerForm.addControl('adult_passport_expiry_date' + i, new FormControl('', [Validators.required]));
                this.passengerForm.addControl('adult_passport_issue_date' + i, new FormControl('', [Validators.required]));
                this.passengerForm.addControl('adult_passport_issuing_country' + i, new FormControl('', [Validators.required]));
                this.passengerForm.addControl('adult_pax_nationality' + i, new FormControl('', [Validators.required]));
               // this.passengerForm.addControl('adult_pax_birthcountry' + i, new FormControl('', [Validators.required]));
               // this.passengerForm.addControl('adult_dom_pax_nationality' + i, new FormControl('', [Validators.required]));


                this.passengerForm['controls']['adult_passport_num' + i].setValue(adult_passport);
                this.passengerForm['controls']['adult_passport_expiry_date' + i].setValue(adult_passport_expiry_date);
                this.passengerForm['controls']['adult_passport_issue_date' + i].setValue(adult_passport_issue_date);
                this.passengerForm['controls']['adult_passport_issuing_country' + i].setValue(adult_passport_issuing_country);
                this.passengerForm['controls']['adult_pax_nationality' + i].setValue(adult_pax_nationality);
                //this.passengerForm['controls']['adult_pax_birthcountry' + i].setValue(adult_pax_birthcountry);


                       this.passengerForm.controls['adult_passport_num' + i].updateValueAndValidity();
                this.passengerForm.controls['adult_passport_expiry_date' + i].updateValueAndValidity();
                this.passengerForm.controls['adult_passport_issue_date' + i].updateValueAndValidity();
                this.passengerForm.controls['adult_passport_issuing_country' + i].updateValueAndValidity();
                this.passengerForm.controls['adult_pax_nationality' + i].updateValueAndValidity();
               // this.passengerForm.controls['adult_pax_birthcountry' + i].updateValueAndValidity();
              //  this.passengerForm.controls['adult_dom_pax_nationality' + i].updateValueAndValidity();
             }




        this.passengerForm.controls['passengerMobile'].setValidators([Validators.required, Validators.pattern("^[6-9][0-9]{9}$"), Validators.minLength(10)]);
        this.passengerForm.controls['passengerEmail'].setValidators([Validators.required, Validators.pattern(this.emailPattern)]);
        this.passengerForm.controls['passengerMobile'].updateValueAndValidity();
        this.passengerForm.controls['passengerEmail'].updateValueAndValidity();



            this.passengerAdultFormCount++;

             if(checkboxIndex !=-1){
               $('#travelPassenger_'+checkboxIndex).prop('checked', true);
             $('#passengerBox_'+checkboxIndex).removeClass('hide');

             }
        } else {
         if(checkboxIndex !=-1){
          $('#passengerBox_'+checkboxIndex).addClass('hide');
          $('#travelPassenger_'+checkboxIndex).prop('checked', false);
         }

        }
    }

    removeAdult(val,checkboxIndex) {

        var passengerName = this.passengerForm.controls['adult_first_name' + val]['value'];
        const index = this.adultsArray.indexOf(val, 0);
         if(checkboxIndex !=-1)
     $('#passengerBox_'+checkboxIndex).addClass('hide');
        if (index > -1) {
            this.adultsArray.splice(index, 1);
        }

        if(checkboxIndex ==-1){
        const index1 = this.adultsArrayM.indexOf(val, 0);
        if (index1 > -1) {
        this.adultsArrayM.splice(index1, 1);
        }
        }


        if (this.travellerlist.length > 0) {
            var trvList = [];
            for (let i of this.travellerlist) {
                var trvlist = i;
                var combineName = trvlist.firstName;
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
        this.passengerAdultFormCount--;
         this.passengerForm.removeControl('adult_title' + val);
        this.passengerForm.removeControl('adult_dob'+val);
        this.passengerForm.removeControl('adult_first_name' + val);
        this.passengerForm.removeControl('adult_last_name'+val);


                if(this.searchData.travel=='INT'){
                this.passengerForm.removeControl('adult_passport_num' +val);
                this.passengerForm.removeControl('adult_passport_expiry_date' + val);
                this.passengerForm.removeControl('adult_passport_issue_date' + val);
                this.passengerForm.removeControl('adult_passport_issuing_country' +val);
                this.passengerForm.removeControl('adult_pax_nationality' +val);
                //this.passengerForm.removeControl('adult_pax_birthcountry' + val);
                // this.passengerForm.removeControl('adult_dom_pax_nationality' val);
                }



        this.passengerForm.clearValidators();
        this.passengerForm.updateValueAndValidity();
        this.adults.splice(val, 1);

    }

     addChild(passenger,checkboxIndex) {
           if ((this.childArray.length ) < (this.maxChilds)) {
            this.child.push(this.childArray.length);
            this.childArray.push(this.passengerChildFormCount);

             if(checkboxIndex ==-1)
            this.childArrayM.push(this.passengerChildFormCount);

            var i = Number(this.passengerChildFormCount);

            if(checkboxIndex !=-1)
            this.saveChildTravellerId[checkboxIndex]=i;


                var title="";   var child_first_name = "";var child_last_name = "";let child_dob:any;


                let child_passport:any;
                let child_passport_expiry_date:any;
                let child_passport_issue_date:any;
                var  child_passport_issuing_country='';
                var child_pax_nationality='';
                var child_pax_birthcountry='';



                if(checkboxIndex !=-1){
                title=passenger.title;
                child_first_name=passenger.firstName;
                child_last_name=passenger.lastName;

                         if(passenger.dateOfBirth){
                const values = passenger.dateOfBirth.split('/');
                const year = +values[2];
                const month = +values[1]-1;
                const date = +values[0];
                child_dob=new Date(year, month, date);
                }

                child_passport=passenger.passportNumber?passenger.passportNumber:'';
                child_passport_issuing_country=passenger.passportIssueCountry?passenger.passportIssueCountry:'';
                child_pax_nationality=passenger.paxNationality?passenger.paxNationality:'';
                child_pax_birthcountry=passenger.paxBirthCountry?passenger.paxBirthCountry:'';

               if(passenger.passportExpiryDate){
                var values1 = passenger.passportExpiryDate.split('/');
                var year1 = +values1[2];
                var month1 = +values1[1]-1;
                var date1 = +values1[0];
                child_passport_expiry_date=new Date(year1, month1, date1);
                }else{
                child_passport_expiry_date='';
                }



                if(passenger.passportIssueDate){
                var values2 = passenger.passportIssueDate.split('/');
                var year2 = +values2[2];
                var month2 = +values2[1]-1;
                var date2 = +values2[0];
                child_passport_issue_date=new Date(year2, month2, date2);
                }else{
                child_passport_issue_date='';
                }



                }

             this.passengerForm.addControl('child_title' + i, new FormControl(title, [Validators.required, Validators.minLength(2), Validators.maxLength(15)]));
             this.passengerForm.addControl('child_first_name' + i, new FormControl(child_first_name, [Validators.required,Validators.pattern(this.patternName), Validators.minLength(2), Validators.maxLength(26)]));
             this.passengerForm.addControl('child_last_name' + i, new FormControl(child_last_name, [Validators.required,Validators.pattern(this.patternName), Validators.minLength(2), Validators.maxLength(26)]));

             this.passengerForm.addControl('child_dob' + i, new FormControl(child_dob, [Validators.required,validateChildAge]));

                this.passengerForm.controls['child_title' + i].updateValueAndValidity();
                this.passengerForm.controls['child_first_name' + i].updateValueAndValidity();
                this.passengerForm.controls['child_last_name' + i].updateValueAndValidity();
                this.passengerForm.controls['child_dob' + i].updateValueAndValidity();



             if(this.searchData.travel=='INT'){
                this.passengerForm.addControl('child_passport_num' + i, new FormControl('', [Validators.required]));
                this.passengerForm.addControl('child_passport_expiry_date' + i, new FormControl('', [Validators.required]));
                this.passengerForm.addControl('child_passport_issue_date' + i, new FormControl('', [Validators.required]));
                this.passengerForm.addControl('child_passport_issuing_country' + i, new FormControl('', [Validators.required]));
                this.passengerForm.addControl('child_pax_nationality' + i, new FormControl('', [Validators.required]));
              //  this.passengerForm.addControl('child_pax_birthcountry' + i, new FormControl('', [Validators.required]));
               // this.passengerForm.addControl('child_dom_pax_nationality' + i, new FormControl('', [Validators.required]));


                this.passengerForm['controls']['child_passport_num' + i].setValue(child_passport);
                this.passengerForm['controls']['child_passport_expiry_date' + i].setValue(child_passport_expiry_date);
                this.passengerForm['controls']['child_passport_issue_date' + i].setValue(child_passport_issue_date);
                this.passengerForm['controls']['child_passport_issuing_country' + i].setValue(child_passport_issuing_country);
                this.passengerForm['controls']['child_pax_nationality' + i].setValue(child_pax_nationality);
              //  this.passengerForm['controls']['child_pax_birthcountry' + i].setValue(child_pax_birthcountry);


                       this.passengerForm.controls['child_passport_num' + i].updateValueAndValidity();
                this.passengerForm.controls['child_passport_expiry_date' + i].updateValueAndValidity();
                this.passengerForm.controls['child_passport_issue_date' + i].updateValueAndValidity();
                this.passengerForm.controls['child_passport_issuing_country' + i].updateValueAndValidity();
                this.passengerForm.controls['child_pax_nationality' + i].updateValueAndValidity();
             //   this.passengerForm.controls['child_pax_birthcountry' + i].updateValueAndValidity();
              //  this.passengerForm.controls['child_dom_pax_nationality' + i].updateValueAndValidity();
             }



            this.passengerChildFormCount++;

             if(checkboxIndex !=-1){
               $('#travelPassenger_'+checkboxIndex).prop('checked', true);
             $('#passengerBox_'+checkboxIndex).removeClass('hide');
             }
        } else {
         if(checkboxIndex !=-1){
          $('#passengerBox_'+checkboxIndex).addClass('hide');
          $('#travelPassenger_'+checkboxIndex).prop('checked', false);
         }

        }

    }



    removeChild(val,checkboxIndex) {
        var passengerName = this.passengerForm.controls['child_first_name' + val]['value'];
        const index = this.childArray.indexOf(val, 0);
         if(checkboxIndex !=-1)
     $('#passengerBox_'+checkboxIndex).addClass('hide');
        if (index > -1) {
            this.childArray.splice(index, 1);
        }

        if(checkboxIndex ==-1){
        const index1 = this.childArrayM.indexOf(val, 0);
        if (index1 > -1) {
        this.childArrayM.splice(index1, 1);
        }
        }
        if (this.travellerlist.length > 0) {
            var trvList = [];
            for (let i of this.travellerlist) {
                var trvlist = i;
                var combineName = trvlist.firstName;
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
         this.passengerForm.removeControl('child_title' + val);
        this.passengerForm.removeControl('child_dob'+val);
        this.passengerForm.removeControl('child_first_name' + val);
        this.passengerForm.removeControl('child_last_name'+val);

                    if(this.searchData.travel=='INT'){
                this.passengerForm.removeControl('child_passport_num' +val);
                this.passengerForm.removeControl('child_passport_expiry_date' + val);
                this.passengerForm.removeControl('child_passport_issue_date' + val);
                this.passengerForm.removeControl('child_passport_issuing_country' +val);
                this.passengerForm.removeControl('child_pax_nationality' +val);
               // this.passengerForm.removeControl('child_pax_birthcountry' + val);
                // this.passengerForm.removeControl('infant_dom_pax_nationality' val);
                }

        this.passengerForm.clearValidators();
        this.passengerForm.updateValueAndValidity();
        this.child.splice(val, 1);
        this.passengerChildFormCount--;

    }


     addInfant(passenger,checkboxIndex) {
           if ((this.infantArray.length ) < (this.maxInfants)) {
            this.infant.push(this.infantArray.length);
            this.infantArray.push(this.passengerInfantFormCount);

             if(checkboxIndex ==-1)
            this.infantArrayM.push(this.passengerInfantFormCount);

            var i = Number(this.passengerInfantFormCount);

            if(checkboxIndex !=-1)
            this.saveInfantTravellerId[checkboxIndex]=i;

                var title="";   var infant_first_name = "";var infant_last_name = "";let infant_dob:any;


                let infant_passport:any;
                let infant_passport_expiry_date:any;
                let infant_passport_issue_date:any;
                var  infant_passport_issuing_country='';
                var infant_pax_nationality='';
                var infant_pax_birthcountry='';

                if(checkboxIndex !=-1){
                title=passenger.title;
                infant_first_name=passenger.firstName;
                infant_last_name=passenger.lastName;



                                if(passenger.dateOfBirth){
                const values = passenger.dateOfBirth.split('/');
                const year = +values[2];
                const month = +values[1]-1;
                const date = +values[0];
                infant_dob=new Date(year, month, date);
                }

                infant_passport=passenger.passportNumber?passenger.passportNumber:'';
                infant_passport_issuing_country=passenger.passportIssueCountry?passenger.passportIssueCountry:'';
                infant_pax_nationality=passenger.paxNationality?passenger.paxNationality:'';
                infant_pax_birthcountry=passenger.paxBirthCountry?passenger.paxBirthCountry:'';

               if(passenger.passportExpiryDate){
                var values1 = passenger.passportExpiryDate.split('/');
                var year1 = +values1[2];
                var month1 = +values1[1]-1;
                var date1 = +values1[0];
                infant_passport_expiry_date=new Date(year1, month1, date1);
                }else{
                infant_passport_expiry_date='';
                }



                if(passenger.passportIssueDate){
                var values2 = passenger.passportIssueDate.split('/');
                var year2 = +values2[2];
                var month2 = +values2[1]-1;
                var date2 = +values2[0];
                infant_passport_issue_date=new Date(year2, month2, date2);
                }else{
                infant_passport_issue_date='';
                }


                }

             this.passengerForm.addControl('infant_title' + i, new FormControl(title, [Validators.required, Validators.minLength(2), Validators.maxLength(15)]));
             this.passengerForm.addControl('infant_first_name' + i, new FormControl(infant_first_name, [Validators.required,Validators.pattern(this.patternName), Validators.minLength(2), Validators.maxLength(26)]));
             this.passengerForm.addControl('infant_last_name' + i, new FormControl(infant_last_name, [Validators.required,Validators.pattern(this.patternName), Validators.minLength(2), Validators.maxLength(26)]));

             this.passengerForm.addControl('infant_dob' + i, new FormControl(infant_dob, [Validators.required,validateInfantAge]));

           this.passengerForm.controls['infant_title' + i].updateValueAndValidity();
            this.passengerForm.controls['infant_first_name' + i].updateValueAndValidity();
             this.passengerForm.controls['infant_last_name' + i].updateValueAndValidity();
               this.passengerForm.controls['infant_dob' + i].updateValueAndValidity();


                if(this.searchData.travel=='INT'){
                this.passengerForm.addControl('infant_passport_num' + i, new FormControl('', [Validators.required]));
                this.passengerForm.addControl('infant_passport_expiry_date' + i, new FormControl('', [Validators.required]));
                this.passengerForm.addControl('infant_passport_issue_date' + i, new FormControl('', [Validators.required]));
                this.passengerForm.addControl('infant_passport_issuing_country' + i, new FormControl('', [Validators.required]));
                this.passengerForm.addControl('infant_pax_nationality' + i, new FormControl('', [Validators.required]));
              //  this.passengerForm.addControl('infant_pax_birthcountry' + i, new FormControl('', [Validators.required]));
               // this.passengerForm.addControl('infant_dom_pax_nationality' + i, new FormControl('', [Validators.required]));


                this.passengerForm['controls']['infant_passport_num' + i].setValue(infant_passport);
                this.passengerForm['controls']['infant_passport_expiry_date' + i].setValue(infant_passport_expiry_date);
                this.passengerForm['controls']['infant_passport_issue_date' + i].setValue(infant_passport_issue_date);
                this.passengerForm['controls']['infant_passport_issuing_country' + i].setValue(infant_passport_issuing_country);
                this.passengerForm['controls']['infant_pax_nationality' + i].setValue(infant_pax_nationality);
               // this.passengerForm['controls']['infant_pax_birthcountry' + i].setValue(infant_pax_birthcountry);


                       this.passengerForm.controls['infant_passport_num' + i].updateValueAndValidity();
                this.passengerForm.controls['infant_passport_expiry_date' + i].updateValueAndValidity();
                this.passengerForm.controls['infant_passport_issue_date' + i].updateValueAndValidity();
                this.passengerForm.controls['infant_passport_issuing_country' + i].updateValueAndValidity();
                this.passengerForm.controls['infant_pax_nationality' + i].updateValueAndValidity();
              //  this.passengerForm.controls['infant_pax_birthcountry' + i].updateValueAndValidity();
              //  this.passengerForm.controls['infant_dom_pax_nationality' + i].updateValueAndValidity();
             }



            this.passengerInfantFormCount++;

             if(checkboxIndex !=-1){
               $('#travelPassenger_'+checkboxIndex).prop('checked', true);
             $('#passengerBox_'+checkboxIndex).removeClass('hide');
             }
        } else {
         if(checkboxIndex !=-1){
          $('#passengerBox_'+checkboxIndex).addClass('hide');
          $('#travelPassenger_'+checkboxIndex).prop('checked', false);
         }

        }

    }



    removeInfant(val,checkboxIndex) {
        var passengerName = this.passengerForm.controls['infant_first_name' + val]['value'];
        const index = this.infantArray.indexOf(val, 0);
         if(checkboxIndex !=-1)
     $('#passengerBox_'+checkboxIndex).addClass('hide');
        if (index > -1) {
            this.infantArray.splice(index, 1);
        }

        if(checkboxIndex ==-1){
        const index1 = this.infantArrayM.indexOf(val, 0);
        if (index1 > -1) {
        this.infantArrayM.splice(index1, 1);
        }
        }
        if (this.travellerlist.length > 0) {
            var trvList = [];
            for (let i of this.travellerlist) {
                var trvlist = i;
                var combineName = trvlist.firstName;
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
         this.passengerForm.removeControl('infant_title' + val);
        this.passengerForm.removeControl('infant_dob'+val);
        this.passengerForm.removeControl('infant_first_name' + val);
        this.passengerForm.removeControl('infant_last_name'+val);

                 if(this.searchData.travel=='INT'){
                this.passengerForm.removeControl('infant_passport_num' +val);
                this.passengerForm.removeControl('infant_passport_expiry_date' + val);
                this.passengerForm.removeControl('infant_passport_issue_date' + val);
                this.passengerForm.removeControl('infant_passport_issuing_country' +val);
                this.passengerForm.removeControl('infant_pax_nationality' +val);
               // this.passengerForm.removeControl('infant_pax_birthcountry' + val);
                // this.passengerForm.removeControl('infant_dom_pax_nationality' val);
                }


        this.passengerForm.clearValidators();
        this.passengerForm.updateValueAndValidity();
        this.infant.splice(val, 1);
        this.passengerInfantFormCount--;

    }



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
    specialcharInputAddress($event) {
        var keycode = $event.which;
        if ((keycode >= 33 && keycode <= 34) || (keycode >= 36 && keycode <= 43) || (keycode >= 60 && keycode <= 64) || (keycode >= 91 && keycode <= 96) || (keycode >= 123 && keycode <= 126) || (keycode == 8377) || (keycode == 8364) || (keycode == 128) || (keycode == 163) ||
            (keycode == 165)) {
            event.preventDefault();
        }
    }
        convertToUpperCase($event) {
        $event.target.value = $event.target.value.toUpperCase();
    }


        openmodal(content) {
        this.modalService.open(content, { centered: true });
      }


        /**--------------------------------------SAVED TRAVELLER ------------------------------------------------------------------------ */
    checksavedtraveller(){
        let checksavedtravConfig = this.serviceSettings.enablesavedTraveller
        if(checksavedtravConfig == 1){
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


		this.filterTravellerList =  this.travellerlist.filter(function(tra) {
		return tra.age > 1;
		});

		this.adultTravellerList =  this.filterTravellerList.filter(function(tra) {
		return tra.age > 12;
		});

		this.childTravellerList =  this.filterTravellerList.filter(function(tra) {
		return tra.age > 2 && tra.age < 5 ;
		});


		this.infantTravellerList =  this.filterTravellerList.filter(function(tra) {
		return tra.age < 2;
		});


		/*for(let i=0;i<(this.maxAdults-this.adultTravellerList);i++){
		this.manualAdultTraveller(1);
		}

		for(let i=0;i<(this.maxChilds-this.childTravellerList);i++){
		this.manualChildTraveller(1);
		}


		for(let i=0;i<(this.maxInfants-this.infantTravellerList);i++){
		this.manualInfantTraveller(1);
		}
		*/

                for(let i=0;i<this.travellerlist.length;i++){

                if(this.filterTravellerList[i]){
                if(this.filterTravellerList[i].age > 12)
                this.saveAdultTravellerId[this.filterTravellerList[i].id]=-1

                else if(this.filterTravellerList[i].age > 2 && this.filterTravellerList[i].age < 5 )
                this.saveChildTravellerId[this.filterTravellerList[i].id]=-1

                else
                this.saveChildTravellerId[this.filterTravellerList[i].id]=-1
                }
                }


                }
            }),(err:HttpErrorResponse)=>{
               console.log('Something went wrong !');

            }
        }
    }

    gstNumberCheck(event) {
        let inputVal: string = event.target.value;
        var characterReg = /^([0]{1}[1-9]{1}|[1]{1}[0-9]{1}|[2]{1}[0-7]{1}|[2]{1}[9]{1}|[3]{1}[0-7]{1})[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}[a-zA-Z0-9]{3}$/;
       // console.log(characterReg.test(inputVal));
        if(characterReg.test(inputVal)) {
        this.gstshow=true;
        this.gstSelected=true;
        }else{
        this.gstshow=false;
        this.gstSelected=false;
        }

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


        this.gstshow=true;
        this.gstSelected=true;



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
    saveTravellerFunc(){
        var saveTravellerArray: any=[];
        var ii=1;

        if (this.adultsArray.length > 0) {
           for (let i of this.adultsArray) {

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
                        "id": i,
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

        if (this.childArray.length > 0) {
           for (let i of this.childArray) {

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
                        "id": i,
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


    expandItemsAdult() {
        if(this.isAdultExpanded == false){
          this.isAdultExpanded = true;
        }else if(this.isAdultExpanded == true){
          this.isAdultExpanded = false;
        }
      }

    expandItemsChild() {
        if(this.isChildExpanded == false){
          this.isChildExpanded = true;
        }else if(this.isChildExpanded == true){
          this.isChildExpanded = false;
        }
      }

        expandItemsInfant() {
        if(this.isInfantExpanded == false){
          this.isInfantExpanded = true;
        }else if(this.isInfantExpanded == true){
          this.isInfantExpanded = false;
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


    bookingSessionExpires(e: CountdownEvent) {

     if(e.action == 'done'){

     $('#bookingprocessExpires').modal('show');
     }



    }



  // get airport list
  getAirpotsList() {
    this._flightService.getAirportName().subscribe((res:any)=>{
      this.airportsNameJson = res;
    })
  }

  // get airline list
  getAirLineList() {
    this._flightService.getFlightIcon().subscribe((res:any)=>{
      this.airlinesNameJson = res;
    })
  }
    getCountryList() {
    this._flightService.getCountryList().subscribe((res:any)=>{
      this.countryJson = res.partnerResponse.countryList;
    })
  }


  calculateEMI(amount: number) {
    return Math.round((amount + (amount * (this.EMI_interest / 100))) / 12);
  }


  dateOnwardHour:number=0;
  getLayoverHourOnward(obj1:any, obj2:any)
  {
    if(obj2!=null || obj2!=undefined)
    {
      let obj2Date=new Date(obj2.departureDateTime);
      let obj1Date=new Date(obj1.arrivalDateTime);
      this.dateOnwardHour=(obj2Date.valueOf()-obj1Date.valueOf())/1000;
    }
  }

    dateReturnHour:number=0;
  getLayoverHourReturn(obj1:any, obj2:any)
  {
    if(obj2!=null || obj2!=undefined)
    {
      let obj2Date=new Date(obj2.departureDateTime);
      let obj1Date=new Date(obj1.arrivalDateTime);
      this.dateReturnHour=(obj2Date.valueOf()-obj1Date.valueOf())/1000;
    }
  }


 totalOnwardStops_data:any;
 totalReturnStops_data:any;
 onwardAirlineMulti:boolean=false;
 returnAirlineMulti:boolean=false;

  durationCalc(){

    let totalOnwardStops=-1;
    this.totalOnwardDuration=0;
    let onward_airline_array=[];
    let return_airline_array=[];

        const unique = (value, index, self) => {
        return self.indexOf(value) === index
        }

    for(let i = 0;i<this.flightOnwardDetails.length;i++){
      onward_airline_array.push(this.flightOnwardDetails[i].airline);
      this.totalOnwardDuration+=this.flightOnwardDetails[i].duration;
      if(this.flightOnwardDetails[i+1]!=null && this.flightOnwardDetails[i+1]!=undefined){
        this.getLayoverHourOnward(this.flightOnwardDetails[i],this.flightOnwardDetails[i+1]);
      }
        totalOnwardStops++;
    }


   if(totalOnwardStops==0){
   if(this.flightSessionData.onwardFlights[0]['stops']==0)
   this.totalOnwardStops_data="Non-Stop";
   else
   this.totalOnwardStops_data=totalOnwardStops+ " Stop";
   }else{
   this.totalOnwardStops_data=totalOnwardStops+ " Stop";
   }


    let totalReturnStops=-1;
    this.totalOnwardDuration=0;
    for(let i = 0;i<this.flightReturnDetails.length;i++){
     return_airline_array.push(this.flightReturnDetails[i].airline);
      this.totalOnwardDuration+=this.flightReturnDetails[i].duration;
      if(this.flightReturnDetails[i+1]!=null && this.flightReturnDetails[i+1]!=undefined){
        this.getLayoverHourReturn(this.flightReturnDetails[i],this.flightReturnDetails[i+1]);
      }
        totalReturnStops++;
    }

   if(totalReturnStops==0){
   if(this.flightSessionData.onwardFlights[0]['stops']==0)
   this.totalReturnStops_data="Non-Stop";
   else
   this.totalReturnStops_data=totalReturnStops+ " Stop";
   }else{
   this.totalReturnStops_data=totalReturnStops+ " Stop";
   }


    const onward_airline_unique = onward_airline_array.filter(unique);
    const return_airline_unique = return_airline_array.filter(unique);

    if(onward_airline_unique.length > 1)
    this.onwardAirlineMulti=true;

  if(return_airline_unique.length > 1)
    this.returnAirlineMulti=true;


  }

  changeFareRuleTabBottomOnward(event:any){
    $('.flight-extra-content-o').hide();
    $('#onwardFareDetails .flight-extra-tabs li a').removeClass('flight-extra-tabs-active');
    var Element = document.getElementById(event.target.dataset['bind']);
    Element!.style.display = 'block';
    event.target.classList.add('flight-extra-tabs-active');
  }

    changeFareRuleTabBottomReturn(event:any){
    $('.flight-extra-content-r').hide();
    $('#returnFareDetails .flight-extra-tabs li a').removeClass('flight-extra-tabs-active');
    var Element = document.getElementById(event.target.dataset['bind']);
    Element!.style.display = 'block';
    event.target.classList.add('flight-extra-tabs-active');
  }


  changeFareRuleTabOnward(event:any){
    $('.flight-extra-content-onward').show();
    $('.flight-extra-content-return').hide();
  
    $('.flight-extra-tabs li a').removeClass('flight-extra-tabs-active');
  
    if(this.cancellationPolicyOnward){
    var Element = document.getElementById("CancellationDetails");
    Element!.style.display = 'block';
     $('.flight-extra-content-oo').addClass('flight-extra-tabs-active');
    }
    if(!this.cancellationPolicyOnward && this.baggageInfoOnward){
    var Element = document.getElementById("BaggageDetails");
    Element!.style.display = 'block';
     $('.flight-extra-content-ob').addClass('flight-extra-tabs-active');
    }
     
  }

    changeFareRuleTabReturn(event:any){
      $('.flight-extra-content-onward').hide();
    $('.flight-extra-content-return').show();
    $('.flight-extra-tabs li a').removeClass('flight-extra-tabs-active');
    
    
     if(this.cancellationPolicyReturn){
    var Element = document.getElementById("CancellationDetailsR");
    Element!.style.display = 'block';
    $('.flight-extra-content-rr').addClass('flight-extra-tabs-active');
    }
        if(!this.cancellationPolicyReturn && this.baggageInfoReturn){
    var Element = document.getElementById("BaggageDetailsR");
    Element!.style.display = 'block';
     $('.flight-extra-content-rb').addClass('flight-extra-tabs-active');
    }
    
  }


  getFlightInfo(param:any,partner:any,searchData:any)
  {
  this.loaderValue=10;
  const myInterval3 =setInterval(()=>{
      this.loaderValue = this.loaderValue + 10;

      if(this.loaderValue == 110)
      {
      this.loaderValue=10;
      }
    },600) ;


    this._flightService.getFlightInfo(param,searchData).subscribe((res: any) => {

      let baseFare=0; let taxFare=0; let totalFare=0;let totalFareOnward=0;let totalFareReturn=0;
      let adultFare = 0; let childFare=0; let infantFare=0;

         clearInterval(myInterval3);
           setTimeout(() => {
                $("#infoprocess").modal('hide');
                }, 10);

      if(res.statusCode ==200)
      {
         this.flightInfo=res.response;
        var suggestHotels = {
        service:'Flights',
        city:this.searchData.toCity,
        country_code:this.searchData.toContry,
        address:'',
        check_in_date:this.searchData.departure,
        adult:1,
        child:1
        };


      this.rest.suggestHotels(JSON.stringify(suggestHotels)).subscribe(result => {});

      if(this.searchData.travel=='DOM'){
       if(res.response && res.response.onwardFlightDetails && res.response.onwardFlightDetails.fareKey){
       if(partner=='Yatra'){
                if(res.response.onwardFlightDetails.fare.O){
                if(res.response.onwardFlightDetails.fare.O.ADT){
                baseFare+=Number(res.response.onwardFlightDetails.fare.O.ADT.bf * res.response.onwardFlightDetails.fare.O.ADT.qt );
                totalFare+=Number(res.response.onwardFlightDetails.fare.O.ADT.tf * res.response.onwardFlightDetails.fare.O.ADT.qt ) ;
                totalFareOnward+=Number(res.response.onwardFlightDetails.fare.O.ADT.tf * res.response.onwardFlightDetails.fare.O.ADT.qt ) ;
                this.AdtFare+=Number(res.response.onwardFlightDetails.fare.O.ADT.tf * res.response.onwardFlightDetails.fare.O.ADT.qt ) ;

                this.AdtQuantity =  Number(res.response.onwardFlightDetails.fare.O.ADT.qt);
                  this.AdtBaseFare = Number(res.response.onwardFlightDetails.fare.O.ADT.bf);

                }
                if(res.response.onwardFlightDetails.fare.O.CHD){
                baseFare+=Number(res.response.onwardFlightDetails.fare.O.CHD.bf * res.response.onwardFlightDetails.fare.O.CHD.qt );
                totalFare+=Number(res.response.onwardFlightDetails.fare.O.CHD.tf * res.response.onwardFlightDetails.fare.O.CHD.qt );
                 totalFareOnward+=Number(res.response.onwardFlightDetails.fare.O.CHD.tf * res.response.onwardFlightDetails.fare.O.CHD.qt );
                this.ChildFare+=Number(res.response.onwardFlightDetails.fare.O.CHD.tf * res.response.onwardFlightDetails.fare.O.CHD.qt ) ;

                this.ChildQuantity = Number(res.response.onwardFlightDetails.fare.O.CHD.qt);
                this.ChildBaseFare = Number(res.response.onwardFlightDetails.fare.O.CHD.bf);

                }

                if(res.response.onwardFlightDetails.fare.O.INF){
                baseFare+=Number(res.response.onwardFlightDetails.fare.O.INF.bf * res.response.onwardFlightDetails.fare.O.INF.qt );
                totalFare+=Number(res.response.onwardFlightDetails.fare.O.INF.tf * res.response.onwardFlightDetails.fare.O.INF.qt );
                totalFareOnward+=Number(res.response.onwardFlightDetails.fare.O.INF.tf * res.response.onwardFlightDetails.fare.O.INF.qt );
                this.InfantTotalFare+=Number(res.response.onwardFlightDetails.fare.O.INF.tf * res.response.onwardFlightDetails.fare.O.INF.qt ) ;

                this.InfantQuantity = Number(res.response.onwardFlightDetails.fare.O.INF.qt);
                this.InfantBaseFare = Number(res.response.onwardFlightDetails.fare.O.INF.bf);

                }
                }

              if(res.response.returnFlightDetails && res.response.returnFlightDetails.fare.O){
                if(res.response.returnFlightDetails.fare.O.ADT){
                baseFare+=Number(res.response.returnFlightDetails.fare.O.ADT.bf * res.response.returnFlightDetails.fare.O.ADT.qt );
                totalFare+=Number(res.response.returnFlightDetails.fare.O.ADT.tf * res.response.returnFlightDetails.fare.O.ADT.qt ) ;
                totalFareReturn+=Number(res.response.returnFlightDetails.fare.O.ADT.tf * res.response.returnFlightDetails.fare.O.ADT.qt ) ;
                this.AdtFare+=Number(res.response.returnFlightDetails.fare.O.ADT.tf * res.response.returnFlightDetails.fare.O.ADT.qt ) ;


                  this.AdtQuantity =  Number(res.response.returnFlightDetails.fare.O.ADT.qt);
                  this.AdtBaseFare = Number(res.response.returnFlightDetails.fare.O.ADT.bf);

                }
                if(res.response.returnFlightDetails.fare.O.CHD){
                baseFare+=Number(res.response.returnFlightDetails.fare.O.CHD.bf * res.response.returnFlightDetails.fare.O.CHD.qt );
                totalFare+=Number(res.response.returnFlightDetails.fare.O.CHD.tf * res.response.returnFlightDetails.fare.O.CHD.qt );
                 totalFareReturn+=Number(res.response.returnFlightDetails.fare.O.CHD.tf * res.response.returnFlightDetails.fare.O.CHD.qt );
                this.ChildFare+=Number(res.response.returnFlightDetails.fare.O.CHD.tf * res.response.returnFlightDetails.fare.O.CHD.qt ) ;

                this.ChildQuantity = Number(res.response.returnFlightDetails.fare.O.CHD.qt);
                this.ChildBaseFare = Number(res.response.returnFlightDetails.fare.O.CHD.bf);

                }

                if(res.response.returnFlightDetails.fare.O.INF){
                baseFare+=Number(res.response.returnFlightDetails.fare.O.INF.bf * res.response.returnFlightDetails.fare.O.INF.qt );
                totalFare+=Number(res.response.returnFlightDetails.fare.O.INF.tf * res.response.returnFlightDetails.fare.O.INF.qt );
                 totalFareReturn+=Number(res.response.returnFlightDetails.fare.O.INF.tf * res.response.returnFlightDetails.fare.O.INF.qt );
                this.InfantTotalFare+=Number(res.response.returnFlightDetails.fare.O.INF.tf * res.response.returnFlightDetails.fare.O.INF.qt ) ;

                this.InfantQuantity = Number(res.response.returnFlightDetails.fare.O.INF.qt);
                this.InfantBaseFare = Number(res.response.returnFlightDetails.fare.O.INF.bf);

                }
                }


        }else{

        if(res.response.onwardFlightDetails.fare){
        if(res.response.onwardFlightDetails.fare.ADT){
          this.AdtFare+=Number(res.response.onwardFlightDetails.fare.ADT.bf * res.response.onwardFlightDetails.fare.ADT.qt )+ Number(res.response.onwardFlightDetails.fare.ADT.TX) ;

          this.AdtQuantity =  Number(res.response.onwardFlightDetails.fare.ADT.qt);
          this.AdtBaseFare = Number(res.response.onwardFlightDetails.fare.ADT.bf);

        }

        if(res.response.onwardFlightDetails.fare.CHD){
        this.ChildFare+=Number(res.response.onwardFlightDetails.fare.CHD.bf * res.response.onwardFlightDetails.fare.CHD.qt )+ Number(res.response.onwardFlightDetails.fare.CHD.TX) ;

        this.ChildQuantity = Number(res.response.onwardFlightDetails.fare.CHD.qt);
        this.ChildBaseFare = Number(res.response.onwardFlightDetails.fare.CHD.bf);

        }

        if(res.response.onwardFlightDetails.fare.INF){
        this.InfantTotalFare+=Number(res.response.onwardFlightDetails.fare.INF.bf * res.response.onwardFlightDetails.fare.INF.qt )+ Number(res.response.onwardFlightDetails.fare.INF.TX) ;

        this.InfantQuantity = Number(res.response.onwardFlightDetails.fare.INF.qt);
        this.InfantBaseFare = Number(res.response.onwardFlightDetails.fare.INF.bf);

        }
        }

        if(res.response.returnFlightDetails && res.response.returnFlightDetails.fare){
        if(res.response.returnFlightDetails.fare.ADT){
          this.AdtFare+=Number(res.response.returnFlightDetails.fare.ADT.bf * res.response.returnFlightDetails.fare.ADT.qt )+ Number(res.response.returnFlightDetails.fare.ADT.TX) ;

          this.AdtQuantity =  Number(res.response.returnFlightDetails.fare.ADT.qt);
          this.AdtBaseFare = Number(res.response.returnFlightDetails.fare.ADT.bf);
        }

        if(res.response.returnFlightDetails.fare.CHD){
        this.ChildFare+=Number(res.response.returnFlightDetails.fare.CHD.bf * res.response.returnFlightDetails.fare.CHD.qt )+ Number(res.response.returnFlightDetails.fare.CHD.TX) ;

        this.ChildQuantity = Number(res.response.returnFlightDetails.fare.CHD.qt);
        this.ChildBaseFare = Number(res.response.returnFlightDetails.fare.CHD.bf);

        }

        if(res.response.returnFlightDetails.fare.INF){
        this.InfantTotalFare+=Number(res.response.returnFlightDetails.fare.INF.bf * res.response.returnFlightDetails.fare.INF.qt )+ Number(res.response.returnFlightDetails.fare.INF.TX) ;

        this.InfantQuantity = Number(res.response.returnFlightDetails.fare.INF.qt);
        this.InfantBaseFare = Number(res.response.returnFlightDetails.fare.INF.bf);

        }
        }

         totalFare+=Number(res.response.comboFare.onwardTotalFare);
         baseFare+=Number(res.response.comboFare.onwardBaseFare);
         totalFareOnward+=Number(res.response.comboFare.onwardTotalFare);

         if(res.response.comboFare.returnTotalFare){
         totalFare+=Number(res.response.comboFare.returnTotalFare);
         baseFare+=Number(res.response.comboFare.returnBaseFare);
         totalFareReturn+=Number(res.response.comboFare.returnTotalFare);
         }
       }

       if(res.response && res.response.onwardFlightDetails.bg.length >0)
       this.baggageInfoOnward = res.response.onwardFlightDetails.bg;

       if(res.response && res.response.returnFlightDetails && res.response.returnFlightDetails.bg.length >0)
       this.baggageInfoReturn = res.response.returnFlightDetails.bg;

       if(partner=='Easemytrip')
       this.cancellationPolicyOnward= this.emt_cancellationPolicy (res.response.onwardFlightDetails.cancellationPolicy);

        if(partner=='Easemytrip' && res.response.returnFlightDetails && res.response.returnFlightDetails.cancellationPolicy)
       this.cancellationPolicyReturn= this.emt_cancellationPolicy (res.response.returnFlightDetails.cancellationPolicy);
       }
       }else{
       /**International**/

              if(partner=='Yatra'){
              if(res.response.flight_details.fare.O){
                if(res.response.flight_details.fare.O.ADT){
                baseFare+=Number(res.response.flight_details.fare.O.ADT.bf * res.response.flight_details.fare.O.ADT.qt );
                totalFare+=Number(res.response.flight_details.fare.O.ADT.tf * res.response.flight_details.fare.O.ADT.qt );
                totalFareOnward+=Number(res.response.flight_details.fare.O.ADT.tf * res.response.flight_details.fare.O.ADT.qt ) ;
                this.AdtFare+=Number(res.response.flight_details.fare.O.ADT.tf * res.response.flight_details.fare.O.ADT.qt );
               this.AdtQuantity =  Number(res.response.flight_details.fare.O.ADT.qt);
               this.AdtBaseFare = Number(res.response.flight_details.fare.O.ADT.bf);

                }
                if(res.response.flight_details.fare.O.CHD){
                baseFare+=Number(res.response.flight_details.fare.O.CHD.bf * res.response.flight_details.fare.O.CHD.qt );
                totalFare+=Number(res.response.flight_details.fare.O.CHD.tf * res.response.flight_details.fare.O.CHD.qt );
                 totalFareOnward+=Number(res.response.flight_details.fare.O.CHD.tf * res.response.flight_details.fare.O.CHD.qt );
                this.ChildFare+=Number(res.response.flight_details.fare.O.CHD.tf * res.response.flight_details.fare.O.CHD.qt );
                this.ChildQuantity = Number(res.response.flight_details.fare.O.CHD.qt);
                this.ChildBaseFare = Number(res.response.flight_details.fare.O.CHD.bf);
                }

                if(res.response.flight_details.fare.O.INF){
                baseFare+=Number(res.response.flight_details.fare.O.INF.bf * res.response.flight_details.fare.O.INF.qt );
                totalFare+=Number(res.response.flight_details.fare.O.INF.tf * res.response.flight_details.fare.O.INF.qt ) ;
                totalFareOnward+=Number(res.response.flight_details.fare.O.INF.tf * res.response.flight_details.fare.O.INF.qt ) ;
                this.InfantTotalFare+=Number(res.response.flight_details.fare.O.INF.tf * res.response.flight_details.fare.O.INF.qt ) ;
                this.InfantQuantity = Number(res.response.flight_details.fare.O.INF.qt);
                this.InfantBaseFare = Number(res.response.flight_details.fare.O.INF.bf);
                }
                }


              }else{

                if(res.response.flight_details.fare){
                if(res.response.flight_details.fare.ADT){
                baseFare+=Number(res.response.flight_details.fare.ADT.bf * res.response.flight_details.fare.ADT.qt );
                totalFare+=Number(res.response.flight_details.fare.ADT.bf * res.response.flight_details.fare.ADT.qt ) +Number(res.response.flight_details.fare.ADT.TX);
                totalFareOnward+=Number(res.response.flight_details.fare.ADT.bf * res.response.flight_details.fare.ADT.qt ) +Number(res.response.flight_details.fare.ADT.TX);
                this.AdtFare+=Number(res.response.flight_details.fare.ADT.bf * res.response.flight_details.fare.ADT.qt ) +Number(res.response.flight_details.fare.ADT.TX);
                this.AdtQuantity =  Number(res.response.flight_details.fare.ADT.qt);
                this.AdtBaseFare = Number(res.response.flight_details.fare.ADT.bf);
                }
                if(res.response.flight_details.fare.CHD){
                baseFare+=Number(res.response.flight_details.fare.CHD.bf * res.response.flight_details.fare.CHD.qt );
                totalFare+=Number(res.response.flight_details.fare.CHD.bf * res.response.flight_details.fare.CHD.qt ) +Number(res.response.flight_details.fare.CHD.TX);
                 totalFareOnward+=Number(res.response.flight_details.fare.CHD.bf * res.response.flight_details.fare.CHD.qt ) +Number(res.response.flight_details.fare.CHD.TX);
                this.ChildFare+=Number(res.response.flight_details.fare.CHD.bf * res.response.flight_details.fare.CHD.qt ) +Number(res.response.flight_details.fare.CHD.TX);
                this.ChildQuantity =  Number(res.response.flight_details.fare.CHD.qt);
                this.ChildBaseFare = Number(res.response.flight_details.fare.CHD.bf);
                }

                if(res.response.flight_details.fare.INF){
                baseFare+=Number(res.response.flight_details.fare.INF.bf * res.response.flight_details.fare.INF.qt );
                totalFare+=Number(res.response.flight_details.fare.INF.bf * res.response.flight_details.fare.INF.qt ) +Number(res.response.flight_details.fare.INF.TX);
                totalFareOnward+=Number(res.response.flight_details.fare.INF.bf * res.response.flight_details.fare.INF.qt ) +Number(res.response.flight_details.fare.INF.TX);
                this.InfantTotalFare+=Number(res.response.flight_details.fare.INF.bf * res.response.flight_details.fare.INF.qt ) +Number(res.response.flight_details.fare.INF.TX);
                this.InfantQuantity = Number(res.response.flight_details.fare.INF.qt);
                this.InfantBaseFare = Number(res.response.flight_details.fare.INF.bf);
                }
                }
             }

       if(res.response && res.response.flight_details.bg.length >0)
       this.baggageInfoOnward = res.response.flight_details.bg;

       if(partner=='Easemytrip' && res.response  && res.response.flight_details.cancellationPolicy)
       this.cancellationPolicyOnward= this.emt_cancellationPolicy (res.response.flight_details.cancellationPolicy);
       // console.log( res.response.flight_details);
       }


       }else{
            $('#bookingprocessFailed').modal('show');
       }
        taxFare=totalFare-baseFare;

        this.BaseFare =baseFare;
        this.Tax =taxFare;
        this.TotalFare =totalFare;

       this.totalCollectibleAmount = Number(this.TotalFare) ;
       this.totalCollectibleAmountFromPartnerResponse=this.totalCollectibleAmount;
       this.totalCollectibleAmountFromPartnerResponseOrg=this.totalCollectibleAmount;
      // console.log( this.totalCollectibleAmountFromPartnerResponse);


       this.onwardAmount=totalFareOnward;
       this.returnAmount=totalFareReturn;

    }, (error) => {

        clearInterval(myInterval3);

        setTimeout(() => {
        $('#infoprocess').modal('hide');
        $('#bookingprocessFailed').modal('show');
        }, 10);

     });
  }

  emt_cancellationPolicy(data){
   if(data.Cancellation){
   let cancellation_data = data.Cancellation.split('|');
   let reschedule_data = data.Reschedule.split('|');
   let emt_charges =data.EMTFee;

   let cancellation_updated_data=[];
   let reschedule_data_data=[];
   let tnc_data=[];
   for (let i = 0; i < cancellation_data.length; i++) {
   if(cancellation_data[i]){
    let sp_data = cancellation_data[i].split('Rs.');
     let rd_data = reschedule_data[i].split('Rs.');
   cancellation_updated_data.push({'data':sp_data[0],'airline_fee':sp_data[1],'emt_fee':emt_charges});
   reschedule_data_data.push({'data':rd_data[0],'airline_fee':rd_data[1],'emt_fee':emt_charges});
   }
   }


        $.each(data.Tnc,function(key,value){
        tnc_data.push(value);
        });


   return {
            "cancellation":cancellation_updated_data,
            "reschedule":reschedule_data_data,
            "tnc":tnc_data
         }
        ;
    }

  }

  triggerBack(){
   this.resetPopups('trigger back');
   let url;
  if(this.searchData.travel=='DOM'){   
   if(this.searchData.flightdefault=='R')
     url="flight-roundtrip?"+decodeURIComponent(this.ConvertObjToQueryString((this.searchData)));
   else
     url="flight-list?"+decodeURIComponent(this.ConvertObjToQueryString((this.searchData))); 
    }else{
   url="flight-int?"+decodeURIComponent(this.ConvertObjToQueryString((this.searchData)));
   }
  this.router.navigateByUrl(url);

  }

        resetPopups(message){
        $('#bookingprocessPriceChange').modal('hide');
        $('#bookingprocessFailed').modal('hide');
        $("#infoprocess").modal('hide');
        $("#bookingprocessFailed1").modal('hide');  
        $('#addTraveller_mlite').modal('hide');
        $('#childTraveller_mlite').modal('hide');
        $('#infantTraveller_mlite').modal('hide');
        $('#bookingprocessExpires').modal('hide');
        $(".modal").hide();
        $("body").removeAttr("style");
        $(".modal-backdrop").remove();
        }

  goBack(){
  this.resetPopups('goback');
  this.router.navigateByUrl('/');


  }

  ngOnDestroy(): void {
   this.resetPopups('destroy');
    if(this.sessionTimer){
      clearInterval(this.sessionTimer);
    }
  }

  sendFlightDetails(){
   this.gotoTop();
     this.completedSteps=2;
     this.steps=2;
  }

  // get rendom string value
  getRandomString(length: any) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random()*charactersLength));
    }
    return result;
  }




   paxInfo=[];fareData:any;itineraryRequest:any;
  contactDatails: any;
  continueWithNewFareInterval:any;


  continueTravellerDetails(){
        alertify.set('notifier','position', 'top-center');
        if(this.adultsArray.length <  this.maxAdults){
        alertify.error('Please add adult traveller', '').delay(3);
        return;
        }

        if(this.childArray.length <  this.maxChilds){
        alertify.error('Please add child traveller', '').delay(3);
        return;
        }

        if(this.infantArray.length <  this.maxInfants){
        alertify.error('Please add infant traveller', '').delay(3);
        return;
        }


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

        this.passengerForm.markAllAsTouched();


   console.log(this.passengerForm);

        if (this.passengerForm.invalid ) {
       // console.log(this.passengerAdultFormCount);
        return;
        } else {


         let flightDetailsOnward=[];
         let flightDetailsReturn=[];


         let itineraryType;
        if(this.searchData.travel=='INT') { //International
        if(this.searchData.flightdefault=='O') //international oneway
        itineraryType=3;
        else
        itineraryType=4; // international return
        }else{
        if(this.searchData.flightdefault=='O') //domestic oneway
        itineraryType=1;
        else
        itineraryType=2; //domestic return
        }

        if(this.gstSelected){
            this.gstDetails = {
                "city": this.passengerForm.controls['gstCity']['value'],
                "address": this.passengerForm.controls['gstAddress']['value'],
                "gstNumber": this.passengerForm.controls['gstNumber']['value'],
                "name": this.passengerForm.controls['gstBusinessName']['value'],
                "pincode": this.passengerForm.controls['gstPincode']['value'],
                "state": this.passengerForm.controls['gstState']['value']
            }
        if( this.enablesavedTraveller==1)
             this.saveCustomerGst();
        }else{
            this.gstDetails = {
                "address": '',
                "city": '',
                "gstNumber": '',
                "name": '',
                "pincode": '',
                "state": '',
              }
        }

         var paxInfoCnt=1;
         this.paxInfo=[];

        for(let i=1;i<(this.passengerAdultFormCount);i++){

        let adult_data={};

        adult_data['title']=this.passengerForm.controls['adult_title'+i]['value'];
        adult_data['firstName']=this.passengerForm.controls['adult_first_name'+i]['value'];
        adult_data['lastName']=this.passengerForm.controls['adult_last_name'+i]['value'];
        adult_data['type']="ADT";
        adult_data['dob']=moment(this.passengerForm.controls['adult_dob'+i]['value']).format('YYYY-MM-DD');
        adult_data['dateOfBirth']=moment(this.passengerForm.controls['adult_dob'+i]['value']).format('YYYY-MM-DD');
        adult_data['frequentFlyerNumbers']=[];

        if(this.searchData.travel=='INT'){
        if(this.passengerForm.controls['adult_pax_nationality'+i]['value'])
        adult_data['paxNationality']= this.passengerForm.controls['adult_pax_nationality'+i]['value'];

        if(this.passengerForm.controls['adult_passport_num'+i]['value']) {

        var passport_data={};

        passport_data['passportNumber']= this.passengerForm.controls['adult_passport_num'+i]['value'];
        passport_data['passportIssueDate']= moment(this.passengerForm.controls['adult_passport_issue_date'+i]['value']).format('YYYY-MM-DD');
        passport_data['passportExpDate']= moment(this.passengerForm.controls['adult_passport_expiry_date'+i]['value']).format('YYYY-MM-DD');
        passport_data['passportIssuingCountry']= this.passengerForm.controls['adult_passport_num'+i]['value'];
        adult_data['passportDetail']=passport_data;
        }
        }

        this.paxInfo.push(adult_data);

        paxInfoCnt++;
        }



        for(let i=1;i<(this.passengerChildFormCount);i++){

        let child_data={};

        child_data['title']=this.passengerForm.controls['child_title'+i]['value'];
        child_data['firstName']=this.passengerForm.controls['child_first_name'+i]['value'];
        child_data['lastName']=this.passengerForm.controls['child_last_name'+i]['value'];
        child_data['type']="CHD";
        child_data['dob']=moment(this.passengerForm.controls['child_dob'+i]['value']).format('YYYY-MM-DD');
        child_data['dateOfBirth']=moment(this.passengerForm.controls['child_dob'+i]['value']).format('YYYY-MM-DD');
        child_data['frequentFlyerNumbers']=[];

        if(this.searchData.travel=='INT'){
        if(this.passengerForm.controls['child_pax_nationality'+i]['value'])
        child_data['paxNationality']= this.passengerForm.controls['child_pax_nationality'+i]['value'];

        if(this.passengerForm.controls['child_passport_num'+i]['value']) {

        var passport_data={};

        passport_data['passportNumber']= this.passengerForm.controls['child_passport_num'+i]['value'];
        passport_data['passportIssueDate']= moment(this.passengerForm.controls['child_passport_issue_date'+i]['value']).format('YYYY-MM-DD');
        passport_data['passportExpDate']= moment(this.passengerForm.controls['child_passport_expiry_date'+i]['value']).format('YYYY-MM-DD');
        passport_data['passportIssuingCountry']= this.passengerForm.controls['child_passport_num'+i]['value'];
        child_data['passportDetail']=passport_data;
        }
        }

        this.paxInfo.push(child_data);

        paxInfoCnt++;
        }

      for(let i=1;i<(this.passengerInfantFormCount);i++){

        let infant_data={};

        infant_data['title']=this.passengerForm.controls['infant_title'+i]['value'];
        infant_data['firstName']=this.passengerForm.controls['infant_first_name'+i]['value'];
        infant_data['lastName']=this.passengerForm.controls['infant_last_name'+i]['value'];
        infant_data['type']="INF";
        infant_data['dob']=moment(this.passengerForm.controls['infant_dob'+i]['value']).format('YYYY-MM-DD');
        infant_data['dateOfBirth']=moment(this.passengerForm.controls['infant_dob'+i]['value']).format('YYYY-MM-DD');
        infant_data['frequentFlyerNumbers']=[];

        if(this.searchData.travel=='INT'){
        if(this.passengerForm.controls['infant_pax_nationality'+i]['value'])
        infant_data['paxNationality']= this.passengerForm.controls['infant_pax_nationality'+i]['value'];

        if(this.passengerForm.controls['infant_passport_num'+i]['value']) {

        var passport_data={};

        passport_data['passportNumber']= this.passengerForm.controls['infant_passport_num'+i]['value'];
        passport_data['passportIssueDate']= moment(this.passengerForm.controls['infant_passport_issue_date'+i]['value']).format('YYYY-MM-DD');
        passport_data['passportExpDate']= moment(this.passengerForm.controls['infant_passport_expiry_date'+i]['value']).format('YYYY-MM-DD');
        passport_data['passportIssuingCountry']= this.passengerForm.controls['infant_passport_num'+i]['value'];
        infant_data['passportDetail']=passport_data;
        }
        }

        this.paxInfo.push(infant_data);

        paxInfoCnt++;
        }



        let fareDetails=[];

        if(this.searchData.travel=='INT'){
        fareDetails.push({ "amount": this.onwardAmount,   "fareKey": this.flightInfo.flight_details.fareKey, "flightKey": this.flightSessionData.onwardFlightKey });
        }else{
        fareDetails.push({ "amount": this.onwardAmount,   "fareKey": this.flightInfo.onwardFlightDetails.fareKey, "flightKey": this.flightSessionData.onwardFlightKey });

       if(this.flightSessionData.returnFlightKey)
         fareDetails.push({ "amount": this.returnAmount,   "fareKey": this.flightInfo.returnFlightDetails.fareKey, "flightKey": this.flightSessionData.returnFlightKey });
        }



        for(let i=0;i<(this.flightSessionData.onwardFlights.length);i++){
        flightDetailsOnward.push({
                      "apar": this.partnerToken,
                      "departureAirport":  this.flightSessionData.onwardFlights[i]['departureAirport'],
                      "arrivalAirport":  this.flightSessionData.onwardFlights[i]['arrivalAirport'],
                      "flightNumber": this.flightSessionData.onwardFlights[i]['flightNumber'],
                      "airline": this.flightSessionData.onwardFlights[i]['airline'],
                      "operatingAirline": "",
                      "departureDate": moment(this.flightSessionData.onwardFlights[i]['departureDateTime']).format('YYYY-MM-DD'),
                      "stops": this.flightSessionData.onwardFlights[i]['stops'],
                      "segNum": i+1,
                      "duration": this.flightSessionData.onwardFlights[i]['duration'],
                      "arrivalDateTime": moment(this.flightSessionData.onwardFlights[i]['arrivalDateTime']).format('HH:mm:ss'),
                      "departureDateTime": moment(this.flightSessionData.onwardFlights[i]['departureDateTime']).format('HH:mm:ss'),
                      "arrivalDate": moment(this.flightSessionData.onwardFlights[i]['arrivalDateTime']).format('YYYY-MM-DD'),
                      "bookingClass": this.flightSessionData.onwardPriceSummary['bookingClass'] ? this.flightSessionData.onwardPriceSummary['bookingClass'] : ""
                    });
        }


                for(let i=0;i<(this.flightSessionData.returnFlights.length);i++){
        flightDetailsReturn.push({
                      "apar": this.partnerToken,
                      "departureAirport":  this.flightSessionData.returnFlights[i]['departureAirport'],
                      "arrivalAirport":  this.flightSessionData.returnFlights[i]['arrivalAirport'],
                      "flightNumber": this.flightSessionData.returnFlights[i]['flightNumber'],
                      "airline": this.flightSessionData.returnFlights[i]['airline'],
                      "operatingAirline": "",
                      "departureDate": moment(this.flightSessionData.returnFlights[i]['departureDateTime']).format('YYYY-MM-DD'),
                      "stops": this.flightSessionData.returnFlights[i]['stops'],
                      "segNum": i+1,
                      "duration": this.flightSessionData.returnFlights[i]['duration'],
                      "arrivalDateTime": moment(this.flightSessionData.returnFlights[i]['arrivalDateTime']).format('HH:mm:ss'),
                      "departureDateTime": moment(this.flightSessionData.returnFlights[i]['departureDateTime']).format('HH:mm:ss'),
                      "arrivalDate": moment(this.flightSessionData.returnFlights[i]['arrivalDateTime']).format('YYYY-MM-DD'),
                      "bookingClass": this.flightSessionData.returnPriceSummary['bookingClass'] ? this.flightSessionData.returnPriceSummary['bookingClass']  : ""
                    });
        }

        this.contactDatails={
              "title": this.passengerForm.controls['adult_title1']['value'],
              "firstName": this.passengerForm.controls['adult_first_name1']['value'],
              "lastName": this.passengerForm.controls['adult_last_name1']['value'],
              "email": this.passengerForm.controls['passengerEmail']['value'],
              "address": "Lavelle Road",
              "mobile":  this.passengerForm.controls['passengerMobile']['value'],
              "mobileIsdCode": "91",
              "landline": "000",
              "cityName": "Bangalore",
              "stateName": "Karnataka",
              "countryName": "India",
              "pinCode": "560001",
              "additionalContact": {
                "email": this.passengerForm.controls['passengerEmail']['value'],
                "mobile":this.passengerForm.controls['passengerMobile']['value'],
                "mobileIsdCode": "91"
              }};

                this.fareData={
                totalFare: Number(this.totalCollectibleAmount)+Number(this.partnerConvFee),
                "convenience_fee": 0,
                "partnerConvFee": this.partnerConvFee,
                "child": this.searchData.child,
                "adults": this.searchData.adults,
                "infants": this.searchData.infants,
                "total": this.totalCollectibleAmount ,
                "others": this.Tax ,
                "totalbf": this.BaseFare ,
                "coupon_code": this.coupon_code ? this.coupon_code : '',
                "pass_break": {
                "ADT": this.AdtFare,
                "CHD":this.ChildFare,
                "INF": this.InfantTotalFare,
                },
                "total_passengers": (this.maxAdults+this.maxChilds+this.maxInfants),
                "markup_fee": 0,
                "partner_amount": this.totalCollectibleAmountFromPartnerResponse,
                "discount": this.coupon_amount,
                "voucher_amount": 0,
                "voucher_code": 0,
                "couponcode": "",
                "ticket_class": this.flightClasses[this.searchData.flightclass] ? this.flightClasses[this.searchData.flightclass] : ""
                };




        this.itineraryRequest={
          "serviceName": "Flight",
          "clientName": "HDFC243",
          "partnerName":   this.partnerToken,
          "itineraryType": itineraryType,
          "itineraryId": "",
          "price": this.totalCollectibleAmountFromPartnerResponse,
          "comboFare": "false",
          "origin": this.searchData.flightfrom,
          "destination": this.searchData.flightto,
          "onwardCheckInDate": moment(this.searchData.departure).format('YYYY-MM-DD') ,
          "threadName": "",
          "tripType": this.searchData.travel,
          "operator": "",
          "orderId": "",
          "adults": this.searchData.adults,
          "child": this.searchData.child,
          "infants": this.searchData.infants,
          "convFee": 0,
          "customerId": this.customerInfo["id"],
          "osVersion": "web",
          "couponCode": "",
          "discountAmount": 0,
          "scid": "",
          "errorStatus": 0,
          "gstDetails": this.gstDetails,
          "itinerary": {
            "fareDetails":fareDetails,
            "flights": [
              {
                "segments": {
                  "onwardSegmentSpec": flightDetailsOnward,
                  "returnSegmentSpec": flightDetailsReturn
                }
              }
            ],
            "paxInfoList": this.paxInfo,
            "contactDetail": this.contactDatails,
            "paymentDetail": {
              "paymentType": "",
              "depositAccountId": ""
            },
            "cabinType": this.searchData.flightclass
          }
        };

        if(this.searchData.arrival)
        this.itineraryRequest["returnCheckInDate"]= moment(this.searchData.arrival).format('YYYY-MM-DD');
        
        
         this.resetPopups('itinerary');

            $('#infoprocess').modal('show');
      this.loaderValue=10;
        const myInterval1 =setInterval(()=>{
        this.loaderValue = this.loaderValue + 10;
        if(this.loaderValue == 110)
        {
        this.loaderValue=10;
        }
        },700) ;
this.new_fare=0;

      //    console.log(this.itineraryRequest);
        var requestParamsEncrpt = {
        postData:this.EncrDecr.set(JSON.stringify(this.itineraryRequest))
        };
        this.rest.createItinerary(requestParamsEncrpt).subscribe(response => {

        this.itinararyResponse= JSON.parse(this.EncrDecr.get(response.result ));

          if(this.itinararyResponse['response'] && (this.itinararyResponse['response']['itineraryResponseDetails']['partnerErrorCode']) && this.itinararyResponse['response']['itineraryResponseDetails']['partnerErrorCode']==200 && this.itinararyResponse['response']['itineraryResponseDetails']["httpcode"]==200 && this.itinararyResponse['response']["pricingResponseDetails"]["httpcode"]==200){

                   if(this.partnerToken=='Yatra'){
                this.pricingId=this.itinararyResponse['response']['itineraryResponseDetails']['pricingId'];
                this.itineraryid=this.itinararyResponse['response']['itineraryResponseDetails']['superPnr'];
		 //$json_data=$result_array['response']["pricingResponseDetails"]['partnerErrorMessage'];
		// $getStopOver=Yatraflight::getStopOver($json_data,$data['post_data'],$session_flight_key);

               }else{
	        this.itineraryid=this.itinararyResponse['response']['itineraryResponseDetails']['itineraryId'];
		}
	         this.partnerConvFee = 0;
		if((this.itinararyResponse['response']["pricingResponseDetails"]["partnerConvFee"]) && this.itinararyResponse['response']["pricingResponseDetails"]["partnerConvFee"] != '' ){
			this.partnerConvFee =this.itinararyResponse['response']["pricingResponseDetails"]["partnerConvFee"];
		}
		let priceSummary; let setOrderAmount;
		this.priceSummaryResponse=this.itinararyResponse['response']["pricingResponseDetails"]['priceSummary'];
		priceSummary=JSON.parse(this.priceSummaryResponse);
                this.new_fare = Number(priceSummary['total_fare'])-Number(this.coupon_amount);
                setOrderAmount=Number(priceSummary['total_fare']) ? Number((priceSummary['total_fare'])) : 0;

		this.old_fare=this.totalCollectibleAmountFromPartnerResponseOrg;

		if(this.partnerConvFee > 0){
                	setOrderAmount = setOrderAmount+Number(this.partnerConvFee);
                }

                this.convenience_fee=this.partnerConvFee;

               this.totalCollectibleAmount = Number(setOrderAmount) ;
               this.totalCollectibleAmountFromPartnerResponse=this.totalCollectibleAmount;



                this.fareData={
                totalFare: Number(this.totalCollectibleAmount)+Number(this.partnerConvFee),
                "convenience_fee": 0,
                "partnerConvFee": this.partnerConvFee,
                "child": this.searchData.child,
                "adults": this.searchData.adults,
                "infants": this.searchData.infants,
                "total": this.totalCollectibleAmount ,
                "others": this.Tax ,
                "totalbf": this.BaseFare ,
                "coupon_code": this.coupon_code ? this.coupon_code : '',
                "pass_break": {
                "ADT": this.AdtFare,
                "CHD":this.ChildFare,
                "INF": this.InfantTotalFare,
                },
                "total_passengers": (this.maxAdults+this.maxChilds+this.maxInfants),
                "markup_fee": 0,
                "partner_amount": this.totalCollectibleAmountFromPartnerResponse,
                "discount": this.coupon_amount,
                "voucher_amount": 0,
                "voucher_code": 0,
                "couponcode": "",
                "ticket_class": this.flightClasses[this.searchData.flightclass]
                };


		if((this.new_fare-this.partnerConvFee) != this.old_fare){
      		 $('#infoprocess').modal('hide');
      		  setTimeout(() => {
		 this.continueWithNewFareInterval=myInterval1;
		 $('#bookingprocessPriceChange').modal('show');
                  }, 10);
 		}else{
 		   this.saveCheckout(myInterval1);
 		}
          }else{
           clearInterval(myInterval1);

                setTimeout(() => {
                $('#infoprocess').modal('hide');
                $('#bookingprocessFailed').modal('show');
                }, 10);

          }
         }),(err:HttpErrorResponse)=>{
         clearInterval(myInterval1);
                 setTimeout(() => {
                $('#infoprocess').modal('hide');
                $('#bookingprocessFailed').modal('show');
                }, 10);
         }

       }
  }

  saveCheckout(myInterval1){
 // console.log(this.flightSessionData);
 // console.log(this.flightInfo);
   console.log('4');
    let fligthsOnward=[];
    let fligthsReturn=[];
         for(let i=0;i<(this.flightSessionData.onwardFlights.length);i++){
     fligthsOnward.push({
        "arr_tym":  this.flightSessionData.onwardFlights[i]['arrivalDateTime'],
        "sourcity": this.airportsNameJson[this.flightSessionData.onwardFlights[i]['departureAirport']]['city'],
        "car_id":  this.flightSessionData.onwardFlights[i]['airline'],
        "rowfirst_onward": "",
        "airportname_countrysour": this.airportsNameJson[this.flightSessionData.onwardFlights[i]['departureAirport']]['country'],
        "img": this.flightSessionData.onwardFlights[i]['airline']+".gif",
        "operating_airline": this.flightSessionData.onwardFlights[i]['operatingAirline'],
        "airportname_citydesti": this.airportsNameJson[this.flightSessionData.onwardFlights[i]['arrivalAirport']]['city'],
        "fnum": this.flightSessionData.onwardFlights[i]['flightNumber'],
        "airportname_countrydesti": this.airportsNameJson[this.flightSessionData.onwardFlights[i]['arrivalAirport']]['country'],
        "refund": this.selectedOnwardVendor.refundStatus==1 ? "Refundable" : "Non Refundable",
        "friend_ddate": "",
        "flight_id": "",
        "show_price": "",
        "dst_tym":  this.flightSessionData.onwardFlights[i]['departureDateTime'],
        "desti":  this.flightSessionData.onwardFlights[i]['departureAirport'],
        "friend_dst": moment(this.flightSessionData.onwardFlights[i]['departureDateTime']).format('HH:mm'),
        "friend_arr": moment(this.flightSessionData.onwardFlights[i]['arrivalDateTime']).format('HH:mm'),
        "sour": this.flightSessionData.onwardFlights[i]['departureAirport'],
        "airportname_sour": this.airportsNameJson[this.flightSessionData.onwardFlights[i]['departureAirport']]['airport_name'],
        "desticity": this.airportsNameJson[this.flightSessionData.onwardFlights[i]['arrivalAirport']]['city'],
        "flyend": "",
        "friend_adate": "",
        "car_name": this.airlinesNameJson[this.flightSessionData.onwardFlights[i]['airline']]['name'],
        "airportname_citysour": this.airportsNameJson[this.flightSessionData.onwardFlights[i]['departureAirport']]['city'],
        "operated_by":  this.flightSessionData.onwardFlights[i]['operatingAirline'],
        "duration":moment.utc(this.flightSessionData.onwardFlights[i]['duration'] * 1000).format("H [h] mm [min]"),
        "frcnt": "",
        "flystart": "",
        "airportname_desti": this.airportsNameJson[this.flightSessionData.onwardFlights[i]['arrivalAirport']]['airport_name'],
        "flight_type":  this.flightSessionData.onwardFlights[i]['stops'] == 0 ? "Non-Stop" : this.flightSessionData.onwardFlights[i]['stops'] + " Stop" ,
        "departureTerminal": this.flightSessionData.onwardFlights[i]['departureTerminal']? this.flightSessionData.onwardFlights[i]['departureTerminal'] : '',
        "arrivalTerminal": this.flightSessionData.onwardFlights[i]['arrivalTerminal'] ? this.flightSessionData.onwardFlights[i]['arrivalTerminal'] : '',
        "stopsDetails": []
      });
      }


   for(let i=0;i<(this.flightSessionData.returnFlights.length);i++){

     fligthsReturn.push({
        "arr_tym":  this.flightSessionData.returnFlights[i]['arrivalDateTime'],
        "sourcity": this.airportsNameJson[this.flightSessionData.returnFlights[i]['departureAirport']]['city'],
        "car_id":  this.flightSessionData.returnFlights[i]['airline'],
        "rowfirst_onward": "",
        "airportname_countrysour": this.airportsNameJson[this.flightSessionData.returnFlights[i]['departureAirport']]['country'],
        "img": this.flightSessionData.returnFlights[i]['airline']+".gif",
        "operating_airline": this.flightSessionData.returnFlights[i]['operatingAirline'],
        "airportname_citydesti": this.airportsNameJson[this.flightSessionData.returnFlights[i]['arrivalAirport']]['city'],
        "fnum": this.flightSessionData.returnFlights[i]['flightNumber'],
        "airportname_countrydesti": this.airportsNameJson[this.flightSessionData.returnFlights[i]['arrivalAirport']]['country'],
        "refund": this.selectedReturnVendor.refundStatus==1 ? "Refundable" : "Non Refundable",
        "friend_ddate": "",
        "flight_id": "",
        "show_price": "",
        "dst_tym":  this.flightSessionData.returnFlights[i]['departureDateTime'],
        "desti":  this.flightSessionData.returnFlights[i]['departureAirport'],
        "friend_dst": moment(this.flightSessionData.returnFlights[i]['departureDateTime']).format('HH:mm'),
        "friend_arr": moment(this.flightSessionData.returnFlights[i]['arrivalDateTime']).format('HH:mm'),
        "sour": this.flightSessionData.returnFlights[i]['departureAirport'],
        "airportname_sour": this.airportsNameJson[this.flightSessionData.returnFlights[i]['departureAirport']]['airport_name'],
        "desticity": this.airportsNameJson[this.flightSessionData.returnFlights[i]['arrivalAirport']]['city'],
        "flyend": "",
        "friend_adate": "",
        "car_name": this.airlinesNameJson[this.flightSessionData.returnFlights[i]['airline']]['name'],
        "airportname_citysour": this.airportsNameJson[this.flightSessionData.returnFlights[i]['departureAirport']]['city'],
        "operated_by":  this.flightSessionData.returnFlights[i]['operatingAirline'],
        "duration":moment.utc(this.flightSessionData.returnFlights[i]['duration'] * 1000).format("H [h] mm [min]"),
        "frcnt": "",
        "flystart": "",
        "airportname_desti": this.airportsNameJson[this.flightSessionData.returnFlights[i]['arrivalAirport']]['airport_name'],
        "flight_type":  this.flightSessionData.returnFlights[i]['stops'] == 0 ? "Non-Stop" : this.flightSessionData.returnFlights[i]['stops'] + " Stop" ,
         "departureTerminal": this.flightSessionData.returnFlights[i]['departureTerminal']? this.flightSessionData.returnFlights[i]['departureTerminal'] : '',
        "arrivalTerminal": this.flightSessionData.returnFlights[i]['arrivalTerminal'] ? this.flightSessionData.returnFlights[i]['arrivalTerminal'] : '',
        "stopsDetails": []
      });
      }



      var whatsappFlag;
   if(this.whatsappFeature==1)
   whatsappFlag=this.passengerForm.controls['whatsappFlag']['value'];
   else
   whatsappFlag=0;

  let checkoutData={
  "itineraryid": this.itineraryid,
  "clientToken": "HDFC243",
  "programName": "SMARTBUY",
  "partnerToken": this.selectedOnwardVendor.partnerName,
  "serviceToken": "Flight",
  "contactDetails": {
    "firstName": this.contactDatails.firstName,
    "lastName": this.contactDatails.lastName,
    "email": this.contactDatails.email,
    "mobile": this.contactDatails.mobile,
    "whatsappFlag": whatsappFlag,
    "forex_check": 0
  },
  "flightDetails": {
    "onwards": fligthsOnward,
    "onward_refund":this.selectedOnwardVendor.refundStatus,
    "onward_duration":moment.utc(this.totalOnwardDuration * 1000).format("H [h] mm [min]"),
    "onward_stops":this.totalOnwardStops_data,
    "returns": fligthsReturn,
    "return_refund":this.selectedReturnVendor.refundStatus,
      "return_duration":moment.utc(this.totalReturnDuration * 1000).format("H [h] mm [min]"),
       "return_stops":this.totalReturnStops_data,
    "baggage_information": {
      "onward": "",
      "return": ""
    },
    "passengerDetails": this.paxInfo,
    "fare": this.fareData ,
    "onwardFareKey": this.searchData.travel=='INT'? this.flightInfo.flight_details.fareKey :this.flightInfo.onwardFlightDetails.fareKey,
    "returnFareKey": this.flightInfo.returnFlightDetails && this.flightInfo.returnFlightDetails.fareKey ? this.flightInfo.returnFlightDetails.fareKey : '',
    "inputs": {
      "Default":  this.searchData.flightdefault,
      "adults": this.searchData.adults,
      "child": this.searchData.child,
      "class": this.searchData.flightclass,
      "fcode": this.searchData.flightfrom,
      "flightdeparture": this.searchData.departure,
      "flightfrom": this.searchData.fromCity,
      "flightfromCity": this.airportsNameJson[this.searchData.flightfrom].city,
      "flightfromCountry": this.airportsNameJson[this.searchData.flightfrom].country,
      "flightfromCountryCode": this.airportsNameJson[this.searchData.flightfrom].country_code,
      "flightreturn": this.searchData.arrival,
      "flightto": this.searchData.toCity,
      "flighttoCity": this.airportsNameJson[this.searchData.flightto].city,
      "flighttoCountry": this.airportsNameJson[this.searchData.flightto].country,
      "flighttoCountryCode": this.airportsNameJson[this.searchData.flightto].country_code,
      "infants":this.searchData.infants,
      "t": "ZWFybg==",
      "tcode": this.searchData.flightto,
      "post_partner":this.selectedOnwardVendor.partnerName,
      "post_default":this.searchData.flightdefault,
       "travel":this.searchData.travel
    }
  },
  "cancellationPolicy": "",
  "checkin": "",
  "checkin_box": null,
  "order_ref_num":this.itinararyResponse.response.orderId,
  "amd_url": "",
  "redirect_url": "",
  "retry_url": "",
  "itineraryRequest":this.itineraryRequest
};


      var saveCheckoutData = {
       orderReferenceNumber: this.itinararyResponse.response.orderId,
       flightData: this.EncrDecr.set(JSON.stringify(checkoutData))
      };

      let trackUrlParams = new HttpParams()
  .set('current_url', window.location.href)
  .set('category', 'Flight')
  .set('event', 'Save Checkout')
  .set('metadata','{"save_checkout":"'+this.EncrDecr.set(JSON.stringify(JSON.stringify(saveCheckoutData)))+'"}');

   const track_body: string = trackUrlParams.toString();
   this.rest.trackEvents( track_body).subscribe(result => {});

    this.rest.saveCheckout(JSON.stringify(saveCheckoutData)).subscribe(rdata => {
      if(rdata==1){


      sessionStorage.setItem(this.randomFlightDetailKey + '-clientTransactionId', this.itinararyResponse.response.itineraryResponseDetails.itineraryId);
      sessionStorage.setItem(this.randomFlightDetailKey + '-orderReferenceNumber', this.itinararyResponse.response.orderId);
      sessionStorage.setItem(this.randomFlightDetailKey + '-ctype', 'flights');
      sessionStorage.setItem(this.randomFlightDetailKey + '-totalFare', String(this.totalCollectibleAmount));
      sessionStorage.setItem(this.randomFlightDetailKey + '-passData', this.EncrDecr.set(JSON.stringify(checkoutData)));
      sessionStorage.setItem(this.randomFlightDetailKey + '-passFareData', btoa(JSON.stringify(this.fareData)));
        clearInterval(myInterval1);

        this.gotoTop();
               if(this.enableVAS==1){
        this.steps=3;
        this.completedSteps=3;
        }else{
        this.steps=4;
        this.completedSteps=4;
        }
          setTimeout(() => {
                $('#infoprocess').modal('hide');
                }, 10);
      }else{
        clearInterval(myInterval1);
            setTimeout(() => {
                $('#infoprocess').modal('hide');
                $('#bookingprocessFailed').modal('show');
                }, 10);
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
  gstReset(){
   $("input[type=radio][name=GSTList]").prop('checked', false);
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
  continueWithNewFare(myInterval1){
  $('#bookingprocessPriceChange').modal('hide');
   this.saveCheckout(myInterval1);
  /* this.gotoTop();
      if(this.enableVAS==1){
        this.steps=3;
        this.completedSteps=3;
        }else{
        this.steps=4;
        this.completedSteps=4;
        }*/
   }

        moveTab(page){
         this.gotoTop();
        if(page <= this.completedSteps){
        this.steps=page;
        this.completedSteps=page;
        }
        }

        continueSeatSelection(){
         this.gotoTop();
        this.steps=4;
        this.completedSteps=4;
        }


       continueReviewBooking(){
        this.gotoTop();
        this.steps=5;
        this.completedSteps=5;
        }

       continuePayment(){

        }

 reciveflexiAmount(values){
  this.showFlexipay = true;
  if(values[0].key == 15){
  this.flexipaysummry=true;
  this.flexiDiscount = Number(values[0].value);
  this.totalCollectibleAmount =  (Number(this.totalCollectibleAmountFromPartnerResponse) + Number(this.convenience_fee)) - Number(this.coupon_amount)-Number(this.flexiDiscount);
  this.sendflexiFare = (Number(this.totalCollectibleAmountFromPartnerResponse) + Number(this.convenience_fee)) - Number(this.coupon_amount);
      // console.log(this.sendflexiFare)
      //sessionStorage.setItem(this.randomFlightDetailKey + '-totalFare', String(this.totalCollectibleAmount));
  }else if(values[0].key !== 15){
      this.flexipaysummry = false;
      this.flexiDiscount = 0;
      this.flexiIntrest=Number(values[0].value);
      this.flexiDiscount = 0;
      this.totalCollectibleAmount = (Number(this.totalCollectibleAmountFromPartnerResponse) + Number(this.convenience_fee)) - Number(this.coupon_amount);
      this.sendflexiFare = this.totalCollectibleAmount;
      //sessionStorage.setItem(this.randomFlightDetailKey + '-totalFare', String(this.totalCollectibleAmount));
}
}

 recivetotalFare($event){
    this.flexipaysummry=false;
    this.flexiDiscount = 0;
    this.totalCollectibleAmount = (Number(this.totalCollectibleAmountFromPartnerResponse) + Number(this.convenience_fee)) - Number(this.coupon_amount);

}

    /***----- APPLY COUPON (--parent--) ------***/
    receiveCouponDetails($event) {
        if ($event.type == 0) {
            this.indexCoupon = $event.couponOptions;
            this.coupon_id = this.indexCoupon.coupon_id;
            this.coupon_name = this.indexCoupon.coupon_name;
            this.coupon_code = this.indexCoupon.coupon_code;
            this.coupon_amount = this.indexCoupon.coupon_amount;
            this.totalCollectibleAmount = Number(this.totalCollectibleAmountFromPartnerResponse) + Number(this.convenience_fee) - (Number(this.coupon_amount));
            this.sendflexiFare = (Number(this.totalCollectibleAmountFromPartnerResponse) + Number(this.convenience_fee)) - (Number(this.coupon_amount));
            sessionStorage.setItem(this.randomFlightDetailKey + '-totalFare', String(this.totalCollectibleAmount));
        } else {
            this.coupon_id = '';
            this.coupon_name = '';
            this.coupon_code = '';
            this.coupon_amount = 0;
            this.totalCollectibleAmount = Number(this.totalCollectibleAmountFromPartnerResponse) + Number(this.convenience_fee) - (Number(this.coupon_amount));
             this.sendflexiFare = (Number(this.totalCollectibleAmountFromPartnerResponse) + Number(this.convenience_fee)) - (Number(this.coupon_amount));
            sessionStorage.setItem(this.randomFlightDetailKey + '-totalFare', String(this.totalCollectibleAmount));
        }
    }




    /**----------REMOVE COUPON----------**/
    removeCoupon(coupon_id, coupon_amount) {
        this.coupon_id = '';
        this.coupon_name = '';
        this.coupon_code = '';
        this.coupon_amount = 0;
        this.totalCollectibleAmount = Number(this.totalCollectibleAmountFromPartnerResponse) + Number(this.convenience_fee) - Number(this.coupon_amount);
         this.sendflexiFare = (Number(this.totalCollectibleAmountFromPartnerResponse) + Number(this.convenience_fee)) - (Number(this.coupon_amount));
        sessionStorage.setItem(this.randomFlightDetailKey + '-totalFare', String(this.totalCollectibleAmount));
    }

    isCollapseShow(identifyCollpase) {

      if(identifyCollpase=='BaseFare') {
      this.isCollapseBasefare = ! this.isCollapseBasefare;
      } else if(identifyCollpase=='vas'){
        this.isCollapseVas = ! this.isCollapseVas;
      } else if(identifyCollpase=='discount'){
        this.isCollapseDiscount = ! this.isCollapseDiscount;
      } else {
        this.isCollapse = ! this.isCollapse;
      }

      }


}
