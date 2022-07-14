import { Component, OnInit,OnDestroy,DebugNode, NgModule,ViewChild, ChangeDetectorRef, ElementRef, Inject, ɵConsole, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightService } from 'src/app/common/flight.service';
import { Location } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { SimpleGlobal } from 'ng2-simple-global';
import {environment} from '../../../environments/environment';
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
  cdnUrl: any;
       customerInfo: any;
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
        flexipaysummry:boolean;
    flexiDiscount:any;
    flexiIntrest:any;
        totalCollectibleAmount: any;
    totalCollectibleAmountFromPartnerResponse: any;
    couponapplyamount:any;
        convenience_fee: number = 0;
    convienceChargesEnable: boolean = true;
    convienceChargesEnabledValue: number = 0;
partnerToken:any;

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
  BaseFare:any;
  Tax:any;
  TotalFare:any;
  sessionTimer:any = 3;
  timeLeft:any = 900;
  baggageInfo:any='';
  flightDetailsArrVal:any;
  steps:any = 1;



  travelerDetails:any={};
  travellerDetailsArr:any;
  toggleAdult:boolean= false;
  toggleChild:boolean = false;
  infantToggle:boolean = false;
  adultDetailList:any[]=[];
  checked:any= false;
  whatsAppCheck:boolean = true;
  gstNumber:any
  mobileNumber:any;
  email:any
  InputArray:any;
  adultArr:any;
  adultArrData:any;
  adultsCount:number=0;
  showLoader:number=1;
  travellerDetailsForm!:any;
  
  // adultDetail!:FormArray;
  
  
  // addAdultDetail: any = this._fb.group({
  //   firstName:['',[Validators.required]],
  //   lastName:['',[Validators.required]],
  //   dateOfBirth:['',[Validators.required]],
  //   gender:[]
  // })

  addChildDetail: any = this._fb.group({
    firstName:[],
    lastName:[],
    dateOfBirth:[],
    gender:[]
  })

  // addChildDetail: any = this._fb.group({})

  addInfantDetail: any = this._fb.group({
  
  })





  constructor(private _fb: FormBuilder,private _flightService:FlightService, private route:ActivatedRoute ,private router:Router, private sg: SimpleGlobal) { 
   this.cdnUrl = environment.cdnUrl+this.sg['assetPath']; 
    this.startTimer();
        this.travellerDetailsForm = this._fb.group({
      adult : this._fb.array([]),
      child : this._fb.array([]),
      infant : this._fb.array([]),
    })
  }

  ngOnInit(): void {
  
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
             }

          }else{
              this.customerInfo =[];
          }
        
      }

      }, 50);
    
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

    
        this.InputArray =
    {
      adult: this.GetArrOfTravellerDetails(parseInt(this.travelerDetails.adults)),
      child:this.GetArrOfTravellerDetails(parseInt(this.travelerDetails.child)),
      infants:this.GetArrOfTravellerDetails(parseInt(this.travelerDetails.infants)),
      email:"",
      mobileNumber:"",
      gstNumber:"",
    }
  
  }

  getFlightDetails(){
    //this._flightService.getFlightDetailsVal()
    this.showLoader=1;
     this.flightDetailsArrVal=sessionStorage.getItem(this.randomFlightDetailKey);
     //console.log(this.flightDetailsArrVal, "Param");
    let param=JSON.parse(this.flightDetailsArrVal);
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

  // getLayoverHour(obj1:any, obj2:any)
  // {

  //   let dateHour:any;
  //   if(obj2!=null || obj2!=undefined)
  //   {

  //     let obj2Date=new Date(obj2.departureDateTime);
  //     let obj1Date=new Date(obj1.arrivalDateTime);
  //     dateHour=(obj2Date.valueOf()-obj1Date.valueOf())/1000;

  //   }
  //   return dateHour;
  // }
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
       
       console.log(totalFare);
        
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

  addAdultForm(){
    this.toggleAdult =! this.toggleAdult
    let adults = this.travellerDetailsForm.get('adult') as FormArray;
    adults.push(this._fb.group({
      // Id:['', [Validators.required]],
      firstName:['', [Validators.required]],
      lastName:['', [Validators.required]],
      dateOfBirth:['', [Validators.required]],
      gender:['Male']
    }));
    console.log(adults , "adult");
    
  }

  // addAdult(){
  //   this.toggleAdult =! this.toggleAdult
  //   let adult = this.travellerDetailsForm.get('customerInfo') as FormArray;
  //   adult.push(this._fb.group({
  //     firstName : ['', [Validators.required]],
  //     lastName : ['', [Validators.required]],
  //     dateOfBirth:['',[Validators.required]],
  //     gender:['Male']
  //   }));
  // }

  public Error = (controlName: string, errorName: string) => {
    return this.travellerDetailsForm.controls[controlName].hasError(errorName);
  };






  getAdultGenderValue(gender:any , i:any){
    // this.InputArray.adult[i].gender = gender; 
    
    this.travellerDetailsForm.value.adult[i].gender = gender; 
    console.log(this.travellerDetailsForm);
    if(gender == "Male"){ }
    else if(gender == "Female"){}
  }
  getChildGenderValue(gender:any , i:any){
    this.travellerDetailsForm.value.child[i].gender = gender; 
    // this.InputArray.child[i].gender = gender;
    if(gender == "Male"){}
    else if(gender == "Female"){}
  }
  getInfantsGenderValue(gender:any , i:any){
    this.travellerDetailsForm.value.intant[i].gender = gender; 
    // this.InputArray.infants[i].gender = gender;
    if(gender == "Male"){}
    else if(gender == "Female" ){}
  }

  GetArrOfTravellerDetails(detailsCount:any)
  {
    console.log(detailsCount);
    
      //let resultArr=[];
      for(let i=0;i<detailsCount;i++){
          // let traverller_obj={Id:i, firstName:'', lastName:'', dateOfBirth:'' ,gender:'Male'}
          // resultArr.push(traverller_obj);
          this.addAdultForm();
      }
      //return resultArr;
  }
  
  
  postAdultDetails(){
    this.toggleAdult =! this.toggleAdult
    // this.InputArray.adult.push();
    this.travellerDetailsArr= this.InputArray;
    
    
    // this.adultArrData.push();
 
    // let travellerDetailsObj={adults:[],Child:[],infant:[] }
    //   let traverller_obj={Id:0, FirstName:'', LastName:'', DOB:''};
    //   let adultArr=[];
    //       for(let i=0;i<adult;i++){
    //       traverller_obj={Id:i, FirstName:'', LastName:'', DOB:''}
    //       console.log(traverller_obj);
    //       adultArr.push(traverller_obj);
    //   }

  }

  postChildDetails(){
    this.toggleChild =! this.toggleChild
    this.InputArray.child.push();
    this.travellerDetailsArr= this.InputArray;
    
  }

  postInfantDetails(){
    this.infantToggle =! this.infantToggle
    this.InputArray.infants.push();
    this.travellerDetailsArr= this.InputArray;
    

  }

  saveTravellerHistory(para:any){
    this.checked = para.target.checked;
    localStorage.setItem('isCheckedTravellerDetails', this.checked);
    if(this.checked == true){
      let saveTravellerDetailsArr :any ;
      saveTravellerDetailsArr = this.InputArray
      localStorage.setItem('travellerDetailsArray' , JSON.stringify(saveTravellerDetailsArr));
    }
  }
  

  
  continueTravellerDetails(){
    // if(this.InputArray){
    //   return
    // }
    // else{
    //   localStorage.setItem('finalTravellerDetail',JSON.stringify(this.InputArray));  
    // }
    //this.travellerDetailsForm.markAllAsTouched();
    this.steps=3;
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
            sessionStorage.setItem(this.randomFlightDetailKey + '-totalFare', String(this.totalCollectibleAmount));
        } else {
            this.coupon_id = '';
            this.coupon_name = '';
            this.coupon_code = '';
            this.coupon_amount = 0;
            if(this.flexiDiscount == undefined) this.flexiDiscount = 0;
            this.totalCollectibleAmount = Number(this.totalCollectibleAmountFromPartnerResponse) + Number(this.convenience_fee) - (Number(this.coupon_amount)+Number(this.flexiDiscount));
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
