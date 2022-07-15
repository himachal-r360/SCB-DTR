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
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { createMask } from '@ngneat/input-mask';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IrctcApiService } from 'src/app/shared/services/irctc.service';

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
  styleUrls: ['./flight-checkout.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class FlightCheckoutComponent implements OnInit ,OnDestroy {
        passengerForm: FormGroup;
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
        patternName = /^(?:(?!.*[ ]{2})(?!(?:.*[']){2})(?!(?:.*[-]){2})(?:[a-zA-Z0-9 \p{L}'-]{3,48}$))$/;
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
        whatsappFeature: number = 0;
        customerInfo: any;
        coupon_id: any;
        indexCoupon: any;
        coupon_name: any;
        coupon_code: any;
        remove_Coupon: any;
        coupon_amount: number = 0;
        REWARD_CUSTOMERID: string;
        REWARD_EMAILID: string;
        REWARD_MOBILE: string;
        REWARD_CUSTOMERNAME: string;
        REWARD_TITLE:string;
        totalCollectibleAmount: any;
        totalCollectibleAmountFromPartnerResponse: any;
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

        adults = []; child = [];infant = [];
        adultsArray = []; 
        childArray = [];
        infantArray = [];

        adultsArrayM = []; 
        childArrayM = [];
        infantArrayM = [];


        flightDetails:any;
        selectedVendor:any;
        flightIcons:any;
        airportsNameJson:any;
        EMI_interest: number = 16;
        EMIAvailableLimit: number = 3000;
        getsearchVal:any;
        parseSearchVal:any;
        getFlightDetailLocalStorage:any;
        totalDuration:number=0;
        randomFlightDetailKey:any;
        searchData:any;
        BaseFare:any;
        Tax:any;
        TotalFare:any;
        sessionTimer:any = 3;
        timeLeft:any = 900;
        baggageInfo:any='';
        flightDetailsArrVal:any;
        steps:any = 2;


        travelerDetails:any={};
        checked:any= false;
        whatsAppCheck:boolean = true;
        gstNumber:any
        mobileNumber:any;
        showLoader:number=1;



  constructor( public _irctc: IrctcApiService,private _fb: FormBuilder,private _flightService:FlightService, private route:ActivatedRoute ,private router:Router, private sg: SimpleGlobal,private appConfigService:AppConfigService, private EncrDecr: EncrDecrService, public rest: RestapiService,private toastrService: ToastrService,private modalService:NgbModal) { 

   this.cdnUrl = environment.cdnUrl+this.sg['assetPath']; 
    this.serviceSettings=this.appConfigService.getConfig();
           this.whatsappFeature =this.serviceSettings.whatsappFeature;
        this.enableGST = this.serviceSettings.enableSavedGST;
        this.enablesavedTraveller = this.serviceSettings.enablesavedTraveller;
        setTimeout(() => {
  
       //Check Laravel Seesion
        if(this.sg['customerInfo']){
         var customer_cookie;
          if(this.sg['customerInfo'].customer_cookie == 1)customer_cookie = 1;
          if(customer_cookie == 1){
               this.customerInfo = this.sg['customerInfo'];
             if(this.customerInfo["guestLogin"]==true){
             }else{
              this.initiatePage();
              
                  this.passengerForm.patchValue({
                    passengerMobile: this.customerInfo["mobile"],
                    passengerEmail: this.customerInfo["email"]
                });
              
                if(this.enablesavedTraveller == 1){
                this.checksavedtraveller();
                }
                if(this.enableGST==1){
                this.getCustomerGstDetails();
                }

    
              
             }

          }else{
              this.customerInfo =[];
          }
        
      }

      }, 50);
       const jobGroup: FormGroup = new FormGroup({});
          this.passengerForm = jobGroup;
           jobGroup.addControl('saveTraveller',new FormControl(''));
            jobGroup.addControl('passengerMobile', new FormControl(this.REWARD_MOBILE));
        jobGroup.addControl('passengerEmail', new FormControl(this.REWARD_EMAILID));
        jobGroup.addControl('whatsappFlag', new FormControl('1'));
        //jobGroup.addControl('passengerAgree', new FormControl(''));

        jobGroup.addControl('gstNumber', new FormControl());
        jobGroup.addControl('gstBusinessName', new FormControl());
        jobGroup.addControl('gstAddress', new FormControl());
        jobGroup.addControl('gstCity', new FormControl());
        jobGroup.addControl('gstPincode', new FormControl());
        jobGroup.addControl('gstState', new FormControl());
        

        jobGroup.addControl('saveGST', new FormControl('1'));
         
          
    this.startTimer();

  }

  ngOnInit(): void {
  

    
  }

  getQueryParamData() {
      this.route.queryParams
        .subscribe((params: any) => {
        this.randomFlightDetailKey = params.searchFlightKey
          sessionStorage.getItem(this.randomFlightDetailKey);
        });
  }
  initiatePage(){
  
    this.getQueryParamData();
    this.getsearchVal = sessionStorage.getItem('searchVal');
    this.parseSearchVal = JSON.parse(this.getsearchVal);
   // this.getFlightIcon();
    this.getAirpotsList();
    this.getFlightDetails();
  
  }

  getFlightDetails(){
    //this._flightService.getFlightDetailsVal()
    this.showLoader=1;
     this.flightDetailsArrVal=sessionStorage.getItem(this.randomFlightDetailKey);
    let param=JSON.parse(this.flightDetailsArrVal);
    this.searchData=JSON.parse(param.searchData);
    console.log(this.searchData);
        this.maxAdults=Number(this.searchData.adults);
        this.maxChilds=Number(this.searchData.child);
        this.maxInfants=Number(this.searchData.infants);
   this.travelerDetails=this.searchData;
   
      if(param!=null){
        this.flightDetails = param.flights;
        this.selectedVendor = param.priceSummary;
        this.partnerToken=this.selectedVendor.partnerName;
         var onwardFlightFareKey = (param.priceSummary.clearTripFareKey != undefined && param.priceSummary.clearTripFareKey != null  ? param.priceSummary.clearTripFareKey : "");
        
        var body = {
          "docKey": param.docKey,
          "flightKeys": [
            param.flightKey
          ],
          "partnerName": this.selectedVendor.partnerName,
          "onwardFlightFareKey": onwardFlightFareKey,
          "returnFlightFareKey": "",
          "splrtFlight": this.selectedVendor.splrtFareFlight
        }
        this.getFlightInfo(body,this.selectedVendor.partnerName);
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
            
                var title="";   var adult_first_name = "";var adult_last_name = "";var adult_dob='';
                
                if(checkboxIndex !=-1){
                title=passenger.title;
                adult_first_name=passenger.firstName;
                adult_last_name=passenger.lastName;
                adult_dob=passenger.dateOfBirth;
                }
 
             this.passengerForm.addControl('adult_title' + i, new FormControl(title, [Validators.required, Validators.minLength(2), Validators.maxLength(15)]));
             this.passengerForm.addControl('adult_first_name' + i, new FormControl(adult_first_name, [Validators.required,Validators.pattern(this.patternName), Validators.minLength(2), Validators.maxLength(26)]));
             this.passengerForm.addControl('adult_last_name' + i, new FormControl(adult_last_name, [Validators.required,Validators.pattern(this.patternName), Validators.minLength(2), Validators.maxLength(26)]));
            
             this.passengerForm.addControl('adult_dob' + i, new FormControl(adult_dob, [Validators.required]));
            
            

                this.passengerForm.controls['adult_title' + i].updateValueAndValidity();
                this.passengerForm.controls['adult_first_name' + i].updateValueAndValidity();
                this.passengerForm.controls['adult_last_name' + i].updateValueAndValidity();
                this.passengerForm.controls['adult_dob' + i].updateValueAndValidity();
                
                
                 this.passengerForm.controls['passengerMobile'].setValidators([Validators.required, Validators.pattern("^[6-9][0-9]{9}$"), Validators.minLength(10)]);
                 this.passengerForm.controls['passengerEmail'].setValidators([Validators.required, Validators.pattern(this.emailPattern)]);
                // this.passengerForm.controls['passengerAgree'].setValidators([Validators.required, Validators.pattern('true')]);

                 this.passengerForm.controls['passengerMobile'].updateValueAndValidity();
                this.passengerForm.controls['passengerEmail'].updateValueAndValidity();
                // this.passengerForm.controls['passengerAgree'].updateValueAndValidity();
         


            this.passengerAdultFormCount++;
            
             if(checkboxIndex !=-1){
               $('#travelPassenger_'+checkboxIndex).prop('checked', true); 
             $('#passengerBox_'+checkboxIndex).removeClass('hidden');
             }
        } else {
         if(checkboxIndex !=-1){
          $('#passengerBox_'+checkboxIndex).addClass('hidden');
          $('#travelPassenger_'+checkboxIndex).prop('checked', false); 
         } 
 
        }

    }
    
    removeAdult(val,checkboxIndex) {
         
        var passengerName = this.passengerForm.controls['adult_first_name' + val]['value'];
        const index = this.adultsArray.indexOf(val, 0);
         if(checkboxIndex !=-1)
     $('#passengerBox_'+checkboxIndex).addClass('hidden');
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
            
                var title="";   var child_first_name = "";var child_last_name = "";var child_dob='';
                if(checkboxIndex !=-1){
                title=passenger.title;
                child_first_name=passenger.firstName;
                child_last_name=passenger.lastName;
                child_dob=passenger.dateOfBirth;
                }
 
             this.passengerForm.addControl('child_title' + i, new FormControl(title, [Validators.required, Validators.minLength(2), Validators.maxLength(15)]));
             this.passengerForm.addControl('child_first_name' + i, new FormControl(child_first_name, [Validators.required,Validators.pattern(this.patternName), Validators.minLength(2), Validators.maxLength(26)]));
             this.passengerForm.addControl('child_last_name' + i, new FormControl(child_last_name, [Validators.required,Validators.pattern(this.patternName), Validators.minLength(2), Validators.maxLength(26)]));
            
             this.passengerForm.addControl('child_dob' + i, new FormControl(child_dob, [Validators.required]));

                this.passengerForm.controls['child_title' + i].updateValueAndValidity();
                this.passengerForm.controls['child_first_name' + i].updateValueAndValidity();
                this.passengerForm.controls['child_last_name' + i].updateValueAndValidity();
                this.passengerForm.controls['child_dob' + i].updateValueAndValidity();

            this.passengerChildFormCount++;
            
             if(checkboxIndex !=-1){
               $('#travelPassenger_'+checkboxIndex).prop('checked', true); 
             $('#passengerBox_'+checkboxIndex).removeClass('hidden');
             }
        } else {
         if(checkboxIndex !=-1){
          $('#passengerBox_'+checkboxIndex).addClass('hidden');
          $('#travelPassenger_'+checkboxIndex).prop('checked', false); 
         } 
 
        }

    }
    
    
    
    removeChild(val,checkboxIndex) {
        var passengerName = this.passengerForm.controls['child_first_name' + val]['value'];
        const index = this.childArray.indexOf(val, 0);
         if(checkboxIndex !=-1)
     $('#passengerBox_'+checkboxIndex).addClass('hidden');
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
            
                var title="";   var infant_first_name = "";var infant_last_name = "";var infant_dob='';
                if(checkboxIndex !=-1){
                title=passenger.title;
                infant_first_name=passenger.firstName;
                infant_last_name=passenger.lastName;
                infant_dob=passenger.dateOfBirth;
                }
 
             this.passengerForm.addControl('infant_title' + i, new FormControl(title, [Validators.required, Validators.minLength(2), Validators.maxLength(15)]));
             this.passengerForm.addControl('infant_first_name' + i, new FormControl(infant_first_name, [Validators.required,Validators.pattern(this.patternName), Validators.minLength(2), Validators.maxLength(26)]));
             this.passengerForm.addControl('infant_last_name' + i, new FormControl(infant_last_name, [Validators.required,Validators.pattern(this.patternName), Validators.minLength(2), Validators.maxLength(26)]));
            
             this.passengerForm.addControl('infant_dob' + i, new FormControl(infant_dob, [Validators.required]));

           this.passengerForm.controls['infant_title' + i].updateValueAndValidity();
            this.passengerForm.controls['infant_first_name' + i].updateValueAndValidity();
             this.passengerForm.controls['infant_last_name' + i].updateValueAndValidity();
               this.passengerForm.controls['infant_dob' + i].updateValueAndValidity();
             

            this.passengerInfantFormCount++;
            
             if(checkboxIndex !=-1){
               $('#travelPassenger_'+checkboxIndex).prop('checked', true); 
             $('#passengerBox_'+checkboxIndex).removeClass('hidden');
             }
        } else {
         if(checkboxIndex !=-1){
          $('#passengerBox_'+checkboxIndex).addClass('hidden');
          $('#travelPassenger_'+checkboxIndex).prop('checked', false); 
         } 
 
        }

    }
    
    
    
    removeInfant(val,checkboxIndex) {
        var passengerName = this.passengerForm.controls['infant_first_name' + val]['value'];
        const index = this.infantArray.indexOf(val, 0);
         if(checkboxIndex !=-1)
     $('#passengerBox_'+checkboxIndex).addClass('hidden');
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
		
		
		for(let i=0;i<(this.maxAdults-this.adultTravellerList);i++){
		this.manualAdultTraveller(1);
		}
		
		for(let i=0;i<(this.maxChilds-this.childTravellerList);i++){
		this.manualChildTraveller(1);
		}
		
		
		for(let i=0;i<(this.maxInfants-this.infantTravellerList);i++){
		this.manualInfantTraveller(1);
		}
		
		
                for(let i=0;i<this.travellerlist.length;i++){
                if(this.filterTravellerList[i].age > 12)
                this.saveAdultTravellerId[this.filterTravellerList[i].id]=-1
                
                else if(this.filterTravellerList[i].age > 2 && this.filterTravellerList[i].age < 5 )
                this.saveChildTravellerId[this.filterTravellerList[i].id]=-1
                
                else
                this.saveChildTravellerId[this.filterTravellerList[i].id]=-1
                
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
        console.log(characterReg.test(inputVal));
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


    startTimer() {
      this.sessionTimer = setInterval(() => {
        if(this.timeLeft > 0) {
          this.timeLeft--;
        
        } else if( this.timeLeft == 0) {
          // setTimeout(() => {
            let searchVal:any = sessionStorage.getItem('searchVal')
            let url="flight-list?"+ this.ConvertObjToQueryString(JSON.parse(searchVal));
            this.router.navigateByUrl(url);
          //  });
        }
      },1000)
    
    }
    


  // get airport list
  getAirpotsList() {
    this._flightService.getAirportName().subscribe((res:any)=>{
      this.airportsNameJson = res;
    })
  }

  calculateEMI(amount: number) {
    return Math.round((amount + (amount * (this.EMI_interest / 100))) / 12);
  }


  dateHour:any;
  getLayoverHour(obj1:any, obj2:any)
  {
    if(obj2!=null || obj2!=undefined)
    {
      let obj2Date=new Date(obj2.departureDateTime);
      let obj1Date=new Date(obj1.arrivalDateTime);
      this.dateHour=(obj2Date.valueOf()-obj1Date.valueOf())/1000;
    }
  }

  durationCalc(){
    this.totalDuration=0;
    for(let i = 0;i<this.flightDetails.length;i++){
      this.totalDuration+=this.flightDetails[i].duration;
      if(this.flightDetails[i+1]!=null && this.flightDetails[i+1]!=undefined){
        this.getLayoverHour(this.flightDetails[i],this.flightDetails[i+1]);
      }
    }
  }

  changeFareRuleTab(event:any){
    $('.flight-extra-content').hide();
    $('.flight-extra-tabs li a').removeClass('flight-extra-tabs-active');
    var Element = document.getElementById(event.target.dataset['bind']);
    Element!.style.display = 'block';
    event.target.classList.add('flight-extra-tabs-active');
  }


  getFlightInfo(param:any,partner:any)
  {
  
    this._flightService.getFlightInfo(param).subscribe((res: any) => {
     this.showLoader=0;
      if(res.statusCode ==200)
      {
       
        let baseFare=0; let taxFare=0; let totalFare=0;
       
        if(partner=='Yatra'){
      if(res.response.onwardFlightDetails.fare.O){
        if(res.response.onwardFlightDetails.fare.O.ADT){
        baseFare+=Number(res.response.onwardFlightDetails.fare.O.ADT.bf * res.response.onwardFlightDetails.fare.O.ADT.qt );
        totalFare+=Number(res.response.onwardFlightDetails.fare.O.ADT.tf * res.response.onwardFlightDetails.fare.O.ADT.qt ) ;
        }

        if(res.response.onwardFlightDetails.fare.O.CHD){
        baseFare+=Number(res.response.onwardFlightDetails.fare.O.CHD.bf * res.response.onwardFlightDetails.fare.O.CHD.qt );
        totalFare+=Number(res.response.onwardFlightDetails.fare.O.CHD.tf * res.response.onwardFlightDetails.fare.O.CHD.qt );
        }

        if(res.response.onwardFlightDetails.fare.O.INF){
        baseFare+=Number(res.response.onwardFlightDetails.fare.O.INF.bf * res.response.onwardFlightDetails.fare.O.INF.qt );
        totalFare+=Number(res.response.onwardFlightDetails.fare.O.INF.tf * res.response.onwardFlightDetails.fare.O.INF.qt );
        } 

        }


        }else{
        if(res.response.onwardFlightDetails.fare){
        if(res.response.onwardFlightDetails.fare.ADT){
        baseFare+=Number(res.response.onwardFlightDetails.fare.ADT.bf * res.response.onwardFlightDetails.fare.ADT.qt );
        totalFare+=Number(res.response.onwardFlightDetails.fare.ADT.bf * res.response.onwardFlightDetails.fare.ADT.qt )+ Number(res.response.onwardFlightDetails.fare.ADT.TX) ;
        }

        if(res.response.onwardFlightDetails.fare.CHD){
        baseFare+=Number(res.response.onwardFlightDetails.fare.CHD.bf * res.response.onwardFlightDetails.fare.CHD.qt );
        totalFare+=Number(res.response.onwardFlightDetails.fare.CHD.bf * res.response.onwardFlightDetails.fare.CHD.qt )+ Number(res.response.onwardFlightDetails.fare.CHD.TX) ;
        }

        if(res.response.onwardFlightDetails.fare.INF){
        baseFare+=Number(res.response.onwardFlightDetails.fare.INF.bf * res.response.onwardFlightDetails.fare.INF.qt );
        totalFare+=Number(res.response.onwardFlightDetails.fare.INF.bf * res.response.onwardFlightDetails.fare.INF.qt )+ Number(res.response.onwardFlightDetails.fare.INF.TX) ;
        } 

        }

       } 
       
         taxFare=totalFare-baseFare;
      
        this.BaseFare =baseFare;
        this.Tax =taxFare;
        this.TotalFare =totalFare;
        
       this.totalCollectibleAmount = Number(this.TotalFare) + Number(this.convenience_fee) ;
       this.totalCollectibleAmountFromPartnerResponse=this.totalCollectibleAmount;
       
       if(res.response.onwardFlightDetails.bg.length >0) 
       this.baggageInfo = res.response.onwardFlightDetails.bg;
        
        }
    }, (error) => { console.log(error) });
  }

  ngOnDestroy(): void {
    if(this.sessionTimer){
      clearInterval(this.sessionTimer);
    }
  }

  sendFlightDetails(){
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



  

  
  continueTravellerDetails(){
  
    if(this.adultsArray.length <  this.maxAdults){
     this.toastrService.error('Please add adult traveller', '');
    return;
    }
 
    if(this.childArray.length <  this.maxChilds){
     this.toastrService.error('Please add child traveller', '');
    return;
    }
     
      if(this.infantArray.length <  this.maxInfants){
     this.toastrService.error('Please add infant traveller', '');
    return;
    }
    
    console.log(this.passengerAdultFormCount);
    
        for(let i=1;i<(this.passengerAdultFormCount);i++){
        this.passengerForm.controls['adult_title' + i].markAsTouched();
        this.passengerForm.controls['adult_first_name' + i].markAsTouched();
        this.passengerForm.controls['adult_last_name' + i].markAsTouched();
        this.passengerForm.controls['adult_dob' + i].markAsTouched();
        }
    
       for(let i=1;i<(this.passengerChildFormCount);i++){
        this.passengerForm.controls['child_title' + i].markAsTouched();
        this.passengerForm.controls['child_first_name' + i].markAsTouched();
        this.passengerForm.controls['child_last_name' + i].markAsTouched();
        this.passengerForm.controls['child_dob' + i].markAsTouched();
        }
    
           for(let i=1;i<(this.passengerInfantFormCount);i++){
        this.passengerForm.controls['infant_title' + i].markAsTouched();
        this.passengerForm.controls['infant_first_name' + i].markAsTouched();
        this.passengerForm.controls['infant_last_name' + i].markAsTouched();
        this.passengerForm.controls['infant_dob' + i].markAsTouched();
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
            
            
            this.passengerForm.get('gstNumber').markAsTouched();
            this.passengerForm.get('gstBusinessName').markAsTouched();
            this.passengerForm.get('gstAddress').markAsTouched();
            this.passengerForm.get('gstCity').markAsTouched();
            this.passengerForm.get('gstPincode').markAsTouched();
            this.passengerForm.get('gstState').markAsTouched();
            this.passengerForm.controls['gstNumber'].markAsTouched();
            this.passengerForm.controls['gstBusinessName'].markAsTouched();
            this.passengerForm.controls['gstAddress'].markAsTouched();
            this.passengerForm.controls['gstCity'].markAsTouched();
            this.passengerForm.controls['gstPincode'].markAsTouched();
            this.passengerForm.controls['gstState'].markAsTouched();
            
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
    
        if (this.passengerForm.invalid ) {
       // console.log(this.passengerAdultFormCount);
        return;
        } else {
        this.steps=3;
       }
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
            sessionStorage.setItem(this.randomFlightDetailKey + '-totalFare', String(this.totalCollectibleAmount));
        } else {
            this.coupon_id = '';
            this.coupon_name = '';
            this.coupon_code = '';
            this.coupon_amount = 0;
            this.totalCollectibleAmount = Number(this.totalCollectibleAmountFromPartnerResponse) + Number(this.convenience_fee) - (Number(this.coupon_amount));
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
        sessionStorage.setItem(this.randomFlightDetailKey + '-totalFare', String(this.totalCollectibleAmount));
    }


}
