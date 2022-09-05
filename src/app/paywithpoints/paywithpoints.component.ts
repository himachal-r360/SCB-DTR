import { Component, OnInit,OnChanges,SimpleChanges, Inject, Input, Output, forwardRef, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, NG_VALUE_ACCESSOR, ControlValueAccessor  } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Options } from 'ng5-slider';
import { SimpleGlobal } from 'ng2-simple-global';
import { HttpClient, HttpHeaders, HttpErrorResponse , HttpParams} from '@angular/common/http';
import { RestapiService } from 'src/app/shared/services/restapi.service';
import {APP_CONFIG, AppConfig} from '../configs/app.config';
import { EncrDecrService } from 'src/app/shared/services/encr-decr.service';
import {environment} from '../../environments/environment';
import { DOCUMENT } from '@angular/common';
import { PayService } from 'src/app/shared/services/pay.service';
import { DatePipe } from '@angular/common';
import { BnNgIdleService } from 'bn-ng-idle';
import { CountdownModule, CountdownComponent } from 'ngx-countdown';
import { AppConfigService } from '../app-config.service';
@Component({
  selector: 'app-paywithpoints',
  templateUrl: './paywithpoints.component.html',
  styleUrls: ['./paywithpoints.component.scss'],
})
export class PaywithpointsComponent implements OnInit,OnChanges  {

  REWARD_EMAILID: string;
  REWARD_MOBILE: string;
  XSRFTOKEN: string;
  voucherApplied: boolean=false;
  addcardDiv: boolean=true;
  voucherDiv: boolean=true;
  otp_verify : boolean=false;
  voucherCodedetails: boolean=true;
  cdnUrl: any;
  @Input() serviceId;
  @Input() Partnertoken;
  @Input() payTotalFare;
  @Input() passSessionKey;
  @Input() ctype;
  @Input() customerInfo;
  @Output() amountToPay =new EventEmitter<any>();
  value: number = 0;
  savedCards: any = [];
  cards:any[];
  options: Options = {
    floor: 0,
    ceil: 100,
    showSelectionBar: true,
  };
 serviceSettings:any;
 selectedCardDetails:any;
 response1:any;
 pointData:any;
 errorMsg0:any;
 points_available:any;
 points_percentage:any;
 CcCharges:any;
 intitialconversionptoc:any;
 hasCards:boolean=false;
 // amount:number;
 orderamount:number;
 redemptionMsg:any;
 cardmobile:any;
 cardbin:any;
 carddob:any;
 submitted1:any;
 submitted2:any;
 applyVoucherRes:any;
 VoucherPreRedeemBalance:any;
 VoucherPostRedeemBalance:any;
 AmountRedeemed:any;
 RemaingAmount:any;
 RedeemedPoints:any;
 vouchertransID:any;
 otp:any;
otperror :Boolean=false;
otpCounter :Boolean=true;
otperrormsg :any;
 redemption_value:any;
 voucherOtp:Boolean=false;
 otpaccepted:Boolean=false;
 voucherapplyform:Boolean=false;
 voucheraddform:Boolean=false;
 voucherslider:Boolean=true;
 submittedFormotpvalidate:Boolean=false;
 submittedotpform:Boolean=false;
 Formotpvalidate: FormGroup;
 Formotp: FormGroup;
 voucherForm1: FormGroup;
 cardaddForm1: FormGroup;
  constructor(private dialog: MatDialog, public rest: RestapiService, public pay: PayService, private EncrDecr: EncrDecrService, private sg: SimpleGlobal, @Inject(DOCUMENT) private document: any,private appConfigService:AppConfigService,private formBuilder: FormBuilder) { 
   this.serviceSettings=this.appConfigService.getConfig();
    this.cdnUrl = environment.cdnUrl+this.sg['assetPath'];
    
    this.Formotpvalidate = this.formBuilder.group({
          otp:['', [Validators.required,Validators.pattern("^[0-9]*$")]]
        });
    this.Formotp = this.formBuilder.group({
          termsconditionvoucher:['', [Validators.required,Validators.pattern('true')]]
        });
     this.voucherForm1 = this.formBuilder.group({
          first4digit:['', [Validators.required,Validators.pattern("^[0-9]*$")],this.isCardValid.bind(this)],
          last4digit:['', [Validators.required,Validators.pattern("^[0-9]*$")]],
          applymobile:['', [Validators.required,Validators.pattern("^[6-9][0-9]{9}$")]],
          dob:['', Validators.required],
          applyvouchercode:['', [Validators.required,Validators.pattern("^[a-zA-Z0-9]*$")]]
        });
     this.cardaddForm1 = this.formBuilder.group({
          first4digit:['', [Validators.required,Validators.pattern("^[0-9]*$")],this.isCardValid.bind(this)],
          last4digit:['', [Validators.required,Validators.pattern("^[0-9]*$")]],
          applymobile:['', [Validators.required,Validators.pattern("^[6-9][0-9]{9}$")]],
          dob:['', Validators.required]
        });
    
  }

  ngOnInit() {
  }
    ngOnChanges(changes: SimpleChanges): void {
    this.orderamount= Number(this.payTotalFare);
    // this.orderamount = this.orderamount - this.value;
    this.setSlider();
       this.getCustomerCards();
   console.log(this.customerInfo);
  }
    getCustomerCards(){
        var cards = [];
        if(this.customerInfo && this.customerInfo['customercards'].length>0){
          this.hasCards = true;
          this.cards = this.customerInfo['customercards'];
          this.selectedCardDetails = this.cards[0];
          this.checkAvailablePointsforSavedCard();
          
          
        }

  }
    updateAmountToPay(code: string,value: string,remain_value: string) {
    var values={code: code, value:value,remain_value:remain_value}; 
    console.log(values);
    this.amountToPay.emit(values);
  }
  setSlider(){
    // update slider dynamically
    
    if(this.pointData !== undefined)
    {
             if(Object.keys(this.pointData['condition']).length!=0){
          var name=this.pointData['condition']['name'];
          var condition_type=this.pointData['condition'].condition_type; 
          var redemption_type=this.pointData['condition'].redemption_type;
          this.redemption_value=this.pointData['condition'].redemption_value;
          var min_value=this.pointData['condition'].min_value;
          var max_value=this.pointData['condition'].max_value;
          var monthly_trn_limit=this.pointData['condition'].monthly_trn_limit;
          var monthly_trn_value=this.pointData['condition'].monthly_trn_value;
          var total_count=this.pointData['condition'].total_count;
          var total_transvalue=this.pointData['condition'].total_transvalue;   
      }
      var max_value_redemption = Number((Number(this.orderamount)/Number(this.points_percentage))*(this.redemption_value/100));
      if(max_value<max_value_redemption){
        max_value_redemption = Number (max_value);
      }

       let opts: Options = {
                  floor: min_value,
                  ceil: max_value_redemption,
            };
            this.value = min_value;
             this.options = opts;
             
    }
  }
  checkAvailablePointsforSavedCard(){ 
    console.log('checkAvailablePointsforSavedCard');
    this.XSRFTOKEN = this.customerInfo['XSRF-TOKEN'];
    // this.ctype = sessionStorage.getItem(this.passSessionKey+'-ctype');
    var request = {
      "takecard":this.selectedCardDetails.id,
      "type":"available_points",
      "bin":"",
      "clientToken":this.sg['domainName'].toUpperCase(),
      "ctype":this.ctype,
      "modal":"DIGITAL",
      "noopt": 1,
      "customer_id":this.sg["customerInfo"]["customerid"],
      "programName":this.sg['domainName'],
      "partnertoken":this.Partnertoken,
      "serviceToken":this.serviceId,
      "_token":this.XSRFTOKEN,
      "guestLogin":this.customerInfo['guestLogin']
    };
    
    
    var passData = {
      postData: this.EncrDecr.set(JSON.stringify(request))
    };
    this.pay.getcustomercardpoint(passData).subscribe(response => {
      this.response1=response;
      if(this.response1['status']!=undefined && (this.response1['status']==true || this.response1['status']=='true'))
      {
        this.errorMsg0=""
        var customername=this.response1['customername'];
        this.points_available=this.response1['points_available'];

        this.points_percentage=this.response1['points_percentage'];
        var client_type=this.response1['client_type'];
        var card_type=this.response1['card_type'];
        this.CcCharges = this.response1['CcCharges'];
        this.pointData = this.response1;
        this.cardmobile = this.customerInfo['ccustomer']['mobile'];
        this.cardbin = this.response1['bin'];
        this.carddob = this.customerInfo['ccustomer']['DOB'];
        this.setSlider();
        // this.intitialconversionptoc();
      }else{
        this.errorMsg0="Something went wrong";
        if(this.response1['message']!=undefined)
        {
          this.errorMsg0=this.response1['message'];
        }
      }
    }), (err: HttpErrorResponse) => {
      var message = 'Something went wrong';
      alert(message);
      this.errorMsg0="";
      
    };
  }
  voucherForm(){
    this.voucherOtp = false;
    this.voucheraddform = false;
    this.voucherslider = false;
    this.voucherapplyform = true;
  }
  addCardform(){
    this.voucherOtp = false;
    this.voucheraddform = true;
    this.voucherslider = false;
    this.voucherapplyform = false;
  }
  addCardCancel(){
    this.voucherOtp = false;
    this.voucheraddform = false;
    this.voucherslider = true;
    this.voucherapplyform = false;
    
  }
  closeotp(){
    this.voucherOtp = false;
    this.voucheraddform = false;
    this.voucherslider = true;
    this.voucherapplyform = false;
    
  }

  selectedCard(id){
    for(let i=0;i<this.cards.length;i++){
      if(id == this.cards[i].id){
        this.selectedCardDetails = this.cards[i];
          this.checkAvailablePointsforSavedCard();
          break;
      }
    }

  }
 
  generateVoucherOtp(){
    this.submittedotpform=true;
    if (this.Formotp.status !='VALID') {
      return;
    }else{
     
      this.submittedotpform=false;
      this.otpaccepted = false;
       let URLparams = {
      "mobile": this.cardmobile,
      "customer_id": this.sg["customerInfo"]["customerid"],
      "programName":this.sg['domainName'],
      "last4digit":this.selectedCardDetails.card.slice(-4),
      "_token":this.customerInfo["XSRF-TOKEN"],
      "DOB":this.carddob,
      "savecard":1,
      "services_id": this.serviceId,
        "bin":this.cardbin,
      "clientToken":this.sg['domainName'].toUpperCase(),
      "total_amount": this.payTotalFare,
      "user_id":this.sg["customerInfo"]["id"],
    }

      this.otpGenerate(URLparams);
   
  }    
  }
    otpGenerate(URLparams:any){

    var passData = {
      postData: this.EncrDecr.set(JSON.stringify(URLparams))
    };
        this.pay.generateVoucherOtp(passData).subscribe(response => {
        if(response.status==true){
          this.voucherOtp = true;
          this.voucheraddform=false; 
          this.voucherslider = false;
          this.otp_verify=true;
        }else{
          this.addCardCancel(); 
          this.voucherOtp = false;
          this.voucherslider = true;
          alert(response.message);
        }
    }), (err: HttpErrorResponse) => {
        this.voucherOtp = false;
        this.voucherslider = true;
        this.errorMsg0="";
      
    };
  }
   OTPVerification(){
    this.submittedFormotpvalidate=true;
    if (this.Formotpvalidate.status !='VALID') {
      return;
    }else{
       if(this.otp_verify==true){ 
         let URLparams = {
            "mobile": this.cardmobile,
            "customer_id": this.sg["customerInfo"]["customerid"],
            "programName":this.sg['domainName'],
            "first4digit":this.selectedCardDetails.card.slice(0,4),
            "last4digit":this.selectedCardDetails.card.slice(-4),
            "points":this.value,
            "ORDER_POINTS":this.value,
            "voucherINRvalue":this.value * this.points_percentage,
             "DOB":this.carddob,
             "bin":this.cardbin,
             "services_id": this.serviceId,
             "clientToken":this.sg['domainName'].toUpperCase(),
             "total_amount": this.payTotalFare,
            "passwordValue":this.Formotpvalidate.controls['otp'].value,
            "_token":this.customerInfo["XSRF-TOKEN"],
            'orderReferenceNumber': sessionStorage.getItem(this.passSessionKey+'-orderReferenceNumber'),
          }
          this.RemaingAmount = Number(this.orderamount)-((this.value)*Number(this.points_percentage));
          this.AmountRedeemed =((this.value)*Number(this.points_percentage));
          this.RedeemedPoints = this.value;
          this.otpVerify(URLparams);
       }else{
              let URLparams = {
                "first4digit":this.cardaddForm1.controls['first4digit'].value.substring(0, 4).trim(),
                "last4digit":this.cardaddForm1.controls['last4digit'].value,
                "mobile": this.cardaddForm1.controls['applymobile'].value,
                "DOB":this.cardaddForm1.controls['dob'].value,
                "type":"available_points",
                "bin":this.cardaddForm1.controls['first4digit'].value,
                "clientToken":this.sg['domainName'].toUpperCase(),
                "services_id":this.serviceId,
                "partner_id":42,
                "modal":"DIGITAL",
                "noopt": 1,
                "savecard":1,
                "customer_id": this.sg["customerInfo"]["customerid"],
                "programName":this.sg['domainName'],
                "_token":this.customerInfo["XSRF-TOKEN"],
                "user_id":this.sg["customerInfo"]["id"],
                "passwordValue":this.Formotpvalidate.controls['otp'].value,
              }
              this.otpVerifyAddCard(URLparams);
       }   
    }
  }
  otpVerifyAddCard(URLparams:any){
    console.log('otpVerifyAddCard');
         var passData = {
          postData: this.EncrDecr.set(JSON.stringify(URLparams))
        };
         this.pay.otp_validation_addcard(passData).subscribe(resp =>{
            if(typeof resp.opt_status != undefined && resp.otp_status){
              if(resp.otp_status==true){
                this.addCardCancel();
                this.otperror=false; 
                this.getCustomerCards();
              }else{ 
                this.Formotpvalidate.setValue({otp: ''});
                this.otperror = true;
                this.otperrormsg = "OTP not matching";
              }
            } 
         }),(err:HttpErrorResponse)=>{
           alert("Something went wrong, please try again");
        };
  }  
  otpVerify(URLparams:any){
         var passData = {
        postData: this.EncrDecr.set(JSON.stringify(URLparams))
      };
       this.pay.otp_validation(passData).subscribe(resp =>{
       
          console.log("otpVerify");
        console.log(resp);
       
  if(typeof resp.status != undefined && resp.status){
        //validate otp success
        if(resp.status !='false'){
          this.voucherApplied=true;
          this.hasCards=false; 
          this.voucherOtp=false; 
          this.voucherDiv=false; 
          this.addcardDiv=false; 
          this.voucherCodedetails=false;
          this.otperror =false;
        let URLparams = {
                "first4digit":this.cardaddForm1.controls['first4digit'].value.substring(0, 4).trim(),
                "last4digit":this.cardaddForm1.controls['last4digit'].value,
                "mobile": this.cardaddForm1.controls['applymobile'].value,
                "DOB":this.cardaddForm1.controls['dob'].value,
                "bin":this.cardaddForm1.controls['first4digit'].value,
                "services_id":this.serviceId,
                "partner_id":42,
                "modal":"DIGITAL",
                 "total_amount": this.payTotalFare,
          "ctype": this.ctype,
          'orderReferenceNumber': sessionStorage.getItem(this.passSessionKey+'-orderReferenceNumber'),
          "_token":this.XSRFTOKEN 
              }
      var passData = {
        postData: this.EncrDecr.set(JSON.stringify(URLparams))
      };
      this.pay.voucherRedemption(passData).subscribe(response => {
        console.log(response);
      });
          
          this.updateAmountToPay('XXXXX',this.AmountRedeemed,this.RemaingAmount);
        }else{
          this.submittedFormotpvalidate=false;
          this.otpCounter = false;
     this.voucherApplied=false;
          this.hasCards=false; 
          this.voucherOtp=true; 
          this.voucherDiv=false; 
          this.addcardDiv=true; 
          this.voucherCodedetails=true; 
          // this.otp.reset();
          this.Formotpvalidate.setValue({otp: ''});
          this.otperror = true;
          this.otperrormsg = resp.error;
        }
      }else{


    } 
   
       }),(err:HttpErrorResponse)=>{
         alert("Something went wrong, please try again");
        //this.router.navigate([this.sg['domainPath'] + 'milestone']);
         
    };
  }
    handleEvent($event,ref){
   // console.log($event);
  }
  onFinishedTimer(): void {
    //console.log("---TIMER FINISHED---");
  }
  resendOTP(ref){
    ref.restart();
    let URLparams = {
      "mobile": this.cardmobile,
      "customer_id": this.sg["customerInfo"]["customerid"],
      "programName":this.sg['domainName'],
      "last4digit":this.selectedCardDetails.card.slice(-4),
      "_token":this.customerInfo["XSRF-TOKEN"],
      "DOB":this.carddob,
      "savecard":1,
      "user_id":this.sg["customerInfo"]["id"],
    }
      this.otpGenerate(URLparams);
  }
    isCardValid(control: FormControl) {
      const q = new Promise((resolve, reject) => {
      // resolve(null);
      setTimeout(() => {
      let prgramName=this.sg['domainName'];
      //let cardnumber=control.value.replace(/-/g, "");
      let cardnumber=control.value;
      if(prgramName=='SMARTBUY' || prgramName==''){
      var res = cardnumber.substring(0, 6);
      }else{
      var res = cardnumber.substring(0, 9);
      }
      const urlParams = new HttpParams()
      .set('card_number', res)
      .set('prgramName', prgramName)
      .set('_token', this.XSRFTOKEN);
        let body = urlParams.toString();
        this.rest.isCardValid(body).subscribe((data) => {
         if(data==0){
          resolve({ 'isCardValid': true });
         }else
          resolve(null);
        }, () => { resolve({ 'isCardValid': true }); });
      }, 5000);
    });
    return q;
  }
    applyVoucher(){
    this.submitted1=true;
    if (this.voucherForm1.status !='VALID') {
      return;
    }else{
        var first9digit = this.voucherForm1.controls['first4digit'].value;
        var first4digit = first9digit.substring(0, 4).trim();
        var last4digit = this.voucherForm1.controls['last4digit'].value;
        var applymobile = this.voucherForm1.controls['applymobile'].value;
        var dob = this.voucherForm1.controls['dob'].value;
        var datePipe = new DatePipe('en-US'); 
        var dobStr = datePipe.transform(dob,'MM/dd/yyyy');
        var applyvouchercode = this.voucherForm1.controls['applyvouchercode'].value;
        var request = {
        "first4digit": first4digit,
        "last4digit": last4digit,
        "mobile": applymobile,
        "DOB": dobStr,
        "bin": first9digit,
        "partner_id": 42,
        "services_id": this.serviceId,
        "total_amount": this.payTotalFare,
        "applyvouchercode": applyvouchercode,
        "ctype": this.ctype,
        "modal": "DIGITAL",
        'orderReferenceNumber': sessionStorage.getItem(this.passSessionKey+'-orderReferenceNumber'),
        "_token":this.XSRFTOKEN 
      }
      var passData = {
        postData: this.EncrDecr.set(JSON.stringify(request))
      };
      this.pay.voucherRedemption(passData).subscribe(response => {
        //this.applyVoucherRes = JSON.parse(this.EncrDecr.get(response));
        this.applyVoucherRes = response;
        
        if(this.applyVoucherRes.status!=undefined && (this.applyVoucherRes.status || this.applyVoucherRes.status=="true")){ 
          this.payTotalFare = this.applyVoucherRes.ordertotalamount
          this.VoucherPreRedeemBalance = this.applyVoucherRes.VoucherPreRedeemBalance;
          this.VoucherPostRedeemBalance = this.applyVoucherRes.VoucherPostRedeemBalance;
          this.AmountRedeemed = this.applyVoucherRes.AmountRedeemed;
          this.RemaingAmount = this.applyVoucherRes.RemaingAmount;
          this.RedeemedPoints = this.applyVoucherRes.RedeemedPoints;
          this.vouchertransID = this.applyVoucherRes.vouchertransID;
          this.payTotalFare = this.payTotalFare - this.AmountRedeemed;
          this.voucherApplied=true;
          this.hasCards=false; 
          this.voucherOtp=false; 
          this.voucherDiv=false; 
          this.addcardDiv=false; 
          this.updateAmountToPay(this.vouchertransID,this.AmountRedeemed,this.RemaingAmount);
        }else{
          // this.errorMsg3="Something went wrong";
          if(this.applyVoucherRes['message']!=undefined)
          {
            // this.errorMsg3=this.applyVoucherRes['message'];
          }
         
        }
      }), (err: HttpErrorResponse) => {
        var message = 'Something went wrong';
        alert(message);
      };

    }
  }
  GenerateOTPform(){
    this.submitted2=true;
    if (this.cardaddForm1.status !='VALID') {
      return;
    }else{
        let URLparams = {
           "first4digit":this.cardaddForm1.controls['first4digit'].value.substring(0, 4).trim(),
           "last4digit":this.cardaddForm1.controls['last4digit'].value,
           "mobile": this.cardaddForm1.controls['applymobile'].value,
           "DOB":this.cardaddForm1.controls['dob'].value,
           "type":"available_points",
           "bin":this.cardaddForm1.controls['first4digit'].value,
           "clientToken":this.sg['domainName'].toUpperCase(),
           "services_id":this.serviceId,
           "partner_id":42,
           "modal":"DIGITAL",
           "noopt": 1,
           "savecard":1,
           "customer_id": this.sg["customerInfo"]["customerid"],
           "programName":this.sg['domainName'],
           "_token":this.customerInfo["XSRF-TOKEN"],
           "user_id":this.sg["customerInfo"]["id"],
        }
        this.otp_verify=false;
       this.otpGenerate(URLparams);
    }
  }
  addcardform(){
    this.submitted2=true;
    if (this.cardaddForm1.status !='VALID') {
      return;
    }else{
      console.log(this.cardaddForm1);
      var first9digit = this.cardaddForm1.controls['first4digit'].value;
      var first4digit = first9digit.substring(0, 4).trim();
      var last4digit = this.cardaddForm1.controls['last4digit'].value;
      var mobile = this.cardaddForm1.controls['applymobile'].value;
      var dob = this.cardaddForm1.controls['dob'].value;
      var datePipe = new DatePipe('en-US'); 
      var dobStr = datePipe.transform(dob,'dd/MM/yyyy');
      // if(this.cardaddForm1.controls['savecard'].value==true){
      //   var savecard=1;
      // }else{
      //   var savecard=0;
      // }
      var request = {
        "first4digit":first4digit,
        "last4digit":last4digit,
        "mobile":mobile,
        "DOB":dobStr,
        "type":"available_points",
        "bin":first9digit,
        "clientToken":this.sg['domainName'].toUpperCase(),
        "services_id":this.serviceId,
        "partner_id":42,
        "modal":"DIGITAL",
        "noopt": 1,
        "savecard":1,
        "customer_id":this.sg["customerInfo"]["customerid"],
        "programName":this.sg['domainName'],
        "_token":this.XSRFTOKEN,
      };
      console.log(request);
      var passData = {
        postData: this.EncrDecr.set(JSON.stringify(request))
      };
      this.pay.availablePoints(passData).subscribe(response => {
        this.response1 = response;
        if(this.response1['status']!=undefined && (this.response1['status']==true || this.response1['status']=='true'))
        {
          // this.errorMsg="";
          var customername=this.response1['customername'];
          this.points_available=this.response1['points_available'];
          this.points_percentage=this.response1['points_percentage'];
          var client_type=this.response1['client_type'];
          var card_type=this.response1['card_type'];
          this.CcCharges = this.response1['CcCharges'];
          // this.intitialconversionptoc();
        }else{
          // this.errorMsg="Something went wrong";
          if(this.response1['message']!=undefined)
          {
            // this.errorMsg=this.response1['message'];
          }
        }
      }), (err: HttpErrorResponse) => {
        var message = 'Something went wrong';
        // alert(message);
        // this.errorMsg="";
        // this.buttonContinue2=true; 
        // this.showCloseBtn=true;
        // this.collapseStatus2="collapse";
      };
    }

  }
  applyVoucherCancel(){
    this.voucheraddform = false;
    this.voucherOtp = false;
    this.voucherslider = true;
    this.voucherapplyform = false;
  }
    AvoidSpace($event) {
    var keycode = $event.which;
    if (keycode == 32)
    event.preventDefault();
  }
  numberInput($event) {
    var keycode = $event.which;
    if (!(keycode >= 48 && keycode <= 57)) {
      event.preventDefault();
    }
  }
  /*special char & rupee symbol ( Rs.)*/
  specialcharInput($event) {
    var keycode = $event.which;
    if ((keycode >= 33 && keycode <= 47) || (keycode >= 91 && keycode <= 96) || (keycode >= 58 && keycode <= 64) ||
    (keycode >= 123 && keycode <= 126) || (keycode == 8377) || (keycode == 8364) || (keycode == 128) || (keycode == 163) ||
    (keycode == 165)){
      event.preventDefault();
    }
  }
    convertToUpperCase($event) {
    $event.target.value = $event.target.value.toUpperCase();
  }

  calldialog(event) {
    var message=event;
    const dialogRef = this.dialog.open(ConfirmationDialog, {
        data: {
          popup: message,
          customerInfo: this.customerInfo,
          serviceId:this.serviceId
        }
    });
  }
}


@Component({
  selector: 'confirmation-dialog',
  templateUrl: './dialog.html',
  styleUrls: ['./paywithpoints.component.scss']
})
export class ConfirmationDialog {
  Form1: FormGroup;
  Form2: FormGroup;
  Form3: FormGroup;
  submittedForm1: Boolean = false;
  submittedForm2: Boolean = false;
  submittedForm3: Boolean = false;
  voucherForm1: FormGroup;
  submitted1: Boolean = false;
  checkDate: any;  
  maxDate: any;
  saveCard: any;
  cdnUrl: any;
  serviceId: string;
  first9digit:String;
  public mask = {
    guide: true,
    showMask : true,
    mask: [/\d/, /\d/, '/', /\d/, /\d/, '/',/\d/, /\d/,/\d/, /\d/]
  };
  appConfig: any;
  customerInfo:any[];
	REWARD_EMAILID: string;
  REWARD_MOBILE: Number;
  XSRFTOKEN: string;
  passData:any=[];
  status:any=[];
  points_available:any;
  points_percentage:any;
  orderamount:any;
  totalorderpts:any;
  //conv_amount:any;
  infiniaPts:Number=null;
  conv_amount:Number=null;
  dData:any=[];
  applicable:Number=1;
  customermobile:any;
  saveCardChecked:Boolean;
  tab1:Boolean=true;
  tab2:Boolean=false;
  tab3:Boolean=false;
  vouchertab1:Boolean=true;
  vouchertab2:Boolean=false;
  vouchertab3:Boolean=false;
  popup:any;
  constructor(public dialogRef: MatDialogRef < ConfirmationDialog > , @Inject(MAT_DIALOG_DATA) public data: any,private formBuilder: FormBuilder,private sg: SimpleGlobal,public rest:RestapiService,private EncrDecr: EncrDecrService,private pay: PayService,private bnIdle: BnNgIdleService) {
        this.popup=data.popup;
        this.customerInfo = data.customerInfo;
        this.serviceId=data.serviceId;
        this.REWARD_EMAILID = this.customerInfo["email"];
        this.REWARD_MOBILE = this.customerInfo["mobile"];
        this.XSRFTOKEN = this.customerInfo["XSRF-TOKEN"];
        this.customermobile = this.REWARD_MOBILE;
       // console.log(this.customerInfo);

        this.voucherForm1 = this.formBuilder.group({
          first4digit:['', [Validators.required,Validators.pattern("^[0-9]*$")],this.isCardValid.bind(this)],
          last4digit:['', [Validators.required,Validators.pattern("^[0-9]*$")]],
          applymobile:['', [Validators.required,Validators.pattern("^[6-9][0-9]{9}$")]],
          dob:['', Validators.required],
          applyvouchercode:['', [Validators.required,Validators.pattern("^[a-zA-Z0-9]*$")]]
        });

        this.Form1 = this.formBuilder.group({
          first4digit:['', [Validators.required,Validators.pattern("^[0-9]*$")],this.isCardValid.bind(this)],
          last4digit:['', [Validators.required,Validators.pattern("^[0-9]*$")]],
          mobile:['', [Validators.required,Validators.pattern("^[6-9][0-9]{9}$")]],
          dob:['', Validators.required],
          savecard:['']
        });

        this.Form2 = this.formBuilder.group({
          infiniaPts:['', [Validators.required]],
          conv_amount:['', [Validators.required]],
          termsconditions:['',[Validators.required,Validators.pattern('true')]]
        });

        this.Form3 = this.formBuilder.group({
          otp:['', [Validators.required,Validators.pattern("^[0-9]*$")]]
        });
        

  }
  ngOnInit() {
    this.saveCard=AppConfig.saveCard; //SAVE CARD VALUE FROM CONFIG FILE
    if(this.saveCard==1){
      this.saveCardChecked=true;
    }else{
      this.saveCardChecked=false;
    }
    this.checkDate=new Date();
  }
  closeDialog(): void {
    this.dialogRef.close();
  }

  switchTab(val){
    if(val=='1'){
      this.tab1=true;
      this.tab2=false;
      this.tab3=false;
    }else if(val=='2'){
      this.tab1=false;
      this.tab2=true;
      this.tab3=false;
    }else if(val=='3'){
      this.tab1=false;
      this.tab2=false;
      this.tab3=true;
    }
  }
  checkAvailablePoints(){
    //this.switchTab(2); return false;
    this.submittedForm1 = true;
    //console.log(this.Form1.status);
    //console.log(this.Form1.controls);
    //console.log(this.Form1.invalid);
    if (this.Form1.status !='VALID') {
      return;
    }else{
        var first9digit = this.Form1.controls['first4digit'].value;
        var first4digit = first9digit.substring(0, 4).trim();
        var last4digit = this.Form1.controls['last4digit'].value;
        var mobile = this.Form1.controls['mobile'].value;
        var dob = this.Form1.controls['dob'].value;
        var datePipe = new DatePipe('en-US'); 
        var dobStr = datePipe.transform(dob,'MM/dd/yyyy');
        if(this.Form1.controls['savecard'].value==true){
          var savecard=1;
        }else{
          var savecard=0;
        }
        var request = {
            "first4digit":first4digit,
            "last4digit":last4digit,
            "mobile":mobile,
            "DOB":dobStr,
            "type":"available_points",
            "bin":first9digit,
            "clientToken":"SMARTBUY",
            "services_id":this.serviceId,
            "partner_id":42,
            "modal":"DIGITAL",
            "savecard":savecard,
            "customer_id":this.customerInfo["id"],
            "programName":this.sg['domainName'],
        };
        //console.log(request);
        var passData = JSON.stringify(request);
        // var passData = {
        //   postData: this.EncrDecr.set(JSON.stringify(this.passData))
        // };
        this.pay.availablePoints(passData).subscribe(response => {
            //console.log(response); return;
            //let dData = JSON.parse(this.EncrDecr.get(response));
            this.dData = response;
            var customername=this.dData['customername'];
            this.points_available=this.dData['points_available'];
            this.points_percentage=this.dData['points_percentage'];
            var client_type=this.dData['client_type'];
            var card_type=this.dData['card_type'];
            this.switchTab(2);
        }), (err: HttpErrorResponse) => {
            var message = 'Something went wrong';
            alert(message);
        };
    }
  }

  pointsToRs(val){
    this.infiniaPts=val;
    this.conv_amount=Math.round(Number(this.points_percentage)*Number(this.infiniaPts));
    this.checkApply(this.infiniaPts,this.conv_amount);
  }
  RsToPoints(val){
    this.conv_amount=val;
    this.infiniaPts=Math.round(Number(this.conv_amount)/Number(this.points_percentage));
    this.checkApply(this.infiniaPts,this.conv_amount);
  }
  checkApply(infiniaPts,conv_amount){
    this.orderamount=5000;              ///NEED TO MAKE THIS DYNAMIC
    this.totalorderpts=Number(this.orderamount)/Number(this.points_percentage);

      var customername=this.dData['customername'];
      this.points_available=this.dData['points_available'];
      this.points_percentage=this.dData['points_percentage'];
      var client_type=this.dData['client_type'];
      var card_type=this.dData['card_type'];
     //console.log(this.dData);
      if(Object.keys(this.dData['condition']).length!=0){
          var name=this.dData['condition']['name'];
          var condition_type=this.dData['condition'][0].condition_type; 
          var redemption_type=this.dData['condition'][0].redemption_type;
          var redemption_value=this.dData['condition'][0].redemption_value;

          var min_value=this.dData['condition'][0].min_value;
          var max_value=this.dData['condition'][0].max_value;
          var monthly_trn_limit=this.dData['condition'][0].monthly_trn_limit;
          var monthly_trn_value=this.dData['condition'][0].monthly_trn_value;
          var total_count=this.dData['condition'][0].total_count;
          var total_transvalue=this.dData['condition'][0].total_transvalue;

          switch(condition_type)
          {
            case 1: //CASH
                  if(min_value<=conv_amount)
                  {
                    if(max_value>=conv_amount || max_value==0)
                    {
                        switch(redemption_type)
                        {
                          case 1: //PERCENT
                                var percentagevalue=(this.orderamount*redemption_value)/100;
                                if(percentagevalue>=conv_amount){
                                  this.status['apply']=true;
                                  this.status['message']="";
                                }else{
                                  this.status['apply']=false;
                                  this.status['message']="You can redeem "+redemption_value+"% (Rs "+Math.floor(percentagevalue)+") of your order amount ";
                                }
                                break;
                          case 2: //FLAT
                                if(redemption_value>conv_amount){
                                  this.status['apply']=true;
                                  this.status['message']="";
                                }else{
                                  this.status['apply']=false;
                                  this.status['message']="You can redeem  Rs. "+redemption_value+" of your order amount ";
                                }
                                break;
                          case 0:
                                this.status['apply']=true;
                                this.status['message']="";
                                break;
                        }
                        if(status['apply']==true){
                          if(monthly_trn_limit>total_count){
                            if(monthly_trn_value>total_transvalue){
                              this.status['apply']=true;
                              this.status['message']="";
                            }else{
                              this.status['apply']=false;
                              this.status['message']="Only Rs."+monthly_trn_value+" limit for month";
                            }
                          }else{
                            this.status['apply']=false;
                            this.status['message']="Sorry, you have reached the maximum number of points redemption transaction for this month.";
                          }
                        }
                    }else{
                      this.status['apply']=false;
                      this.status['message']="Amount should be lesser than or equal to Rs. "+max_value+" ";
                    }
                  }else{
                    this.status['apply']=false;
                    this.status['message']="Amount should be greater than  or equal to Rs."+min_value+" ";
                  }
                  break;
            case 2: //POINTS
                  if(min_value<=infiniaPts)
                  {
                    if(max_value>=infiniaPts || max_value==0)
                    {
                      switch(redemption_type)
                      {
                          case 1:
                              var total=this.points_available;
                              var percentagevalue=(total*redemption_value)/100;
                              if(percentagevalue>=infiniaPts && infiniaPts <= this.totalorderpts){
                                this.status['apply']=true;
                                this.status['message']="";
                              }else{
                                this.status['apply']=false;
                                this.status['message']="You can redeem "+redemption_value+"% of your available points or equivalent to order value";
                              }
                              break;
                          case 2:
                              if(redemption_value>infiniaPts){
                                this.status['apply']=true;
                                this.status['message']="";
                              }else{
                                this.status['apply']=false;
                                this.status['message']="Points can apply only "+redemption_value+"pts of your available points ";
                              }
                              break;
                          case 0:
                              this.status['apply']=true;
                              this.status['message']="";
                              break;
                      }
                      if(this.status['apply']==true){
                        if(monthly_trn_limit>total_count){
                          if(monthly_trn_value>total_transvalue){
                            this.status['apply']=true;
                            this.status['message']="";
                          }else{
                            this.status['apply']=false;
                            this.status['message']="Only "+monthly_trn_value+"pts limit for month";
                          }
                        }else{
                          this.status['apply']=false;
                          this.status['message']="Sorry, you have reached the maximum number of points redemption transaction for this month.";
                        }
                      }
                    }else{
                      this.status['apply']=false;
                      this.status['message']="Points should be lesser than  or equal to "+max_value;
                    }
                  }else{
                    this.status['apply']=false;
                    this.status['message']="Points should be greater than  or equal to "+min_value;
                  }
                  break;
            default:
                  this.status['apply']=false;
                  break;
          }
         
      }else{
       // console.log("else");
        this.status['apply']=true;
        this.status['message']="";
      }
      if(infiniaPts > this.points_available){
          this.status['apply'] = false;
          this.status['message']="You do not have enough points to redeem";
      }
     // console.log(this.status);
    //  console.log(this.status['apply']);
      if(this.status['apply']){	 
        this.applicable=0;
      }else{
        this.applicable=1;
      }
  }
  payWithPoints(){
    //this.switchTab(3); return false;
    this.submittedForm2 = true;
    if (this.Form2.status !='VALID' || this.applicable==1) {
     // console.log("INVALID");
      return;
    }else{
      //console.log("VALID");
      // this.orderamount=5000;              ///NEED TO MAKE THIS DYNAMIC
      // this.totalorderpts=Number(this.orderamount)/Number(this.points_percentage);

      var infiniaPts = this.Form2.controls['infiniaPts'].value;
      var conv_amount = this.Form2.controls['conv_amount'].value;
      
      this.switchTab(3); //redirect to otp page
    }
  }
  handleEvent($event,ref){
   // console.log($event);
  }
  onFinishedTimer(): void {
    //console.log("---TIMER FINISHED---");
  }
  resendOTP(ref){
    ref.restart();
  }
  OTPVerification(){
    this.submittedForm3=true;
    if (this.Form3.status !='VALID') {
      return;
    }else{}
  }
  isCardValid(control: FormControl) {
      const q = new Promise((resolve, reject) => {
      // resolve(null);
      setTimeout(() => {
      let prgramName=this.sg['domainName'];
      //let cardnumber=control.value.replace(/-/g, "");
      let cardnumber=control.value;
      if(prgramName=='SMARTBUY' || prgramName==''){
      var res = cardnumber.substring(0, 6);
      }else{
      var res = cardnumber.substring(0, 9);
      }
      const urlParams = new HttpParams()
      .set('card_number', res)
      .set('prgramName', prgramName)
      .set('_token', this.XSRFTOKEN);
	      let body = urlParams.toString();
        this.rest.isCardValid(body).subscribe((data) => {
         if(data==0){
          resolve({ 'isCardValid': true });
         }else
          resolve(null);
        }, () => { resolve({ 'isCardValid': true }); });
      }, 5000);
    });
    return q;
  }
  AvoidSpace($event) {
	  var keycode = $event.which;
	  if (keycode == 32)
	  event.preventDefault();
	}
	numberInput($event) {
	  var keycode = $event.which;
	  if (!(keycode >= 48 && keycode <= 57)) {
		  event.preventDefault();
	  }
  }
  /*special char & rupee symbol ( Rs.)*/
  specialcharInput($event) {
    var keycode = $event.which;
    if ((keycode >= 33 && keycode <= 47) || (keycode >= 91 && keycode <= 96) || (keycode >= 58 && keycode <= 64) ||
    (keycode >= 123 && keycode <= 126) || (keycode == 8377) || (keycode == 8364) || (keycode == 128) || (keycode == 163) ||
    (keycode == 165)){
      event.preventDefault();
    }
  }
  convertToUpperCase($event) {
    $event.target.value = $event.target.value.toUpperCase();
  }


  /***   APPLY VOUCHER  ***/
  // vouchertab1:Boolean=true;
  // vouchertab2:Boolean=false;
  // vouchertab3:Boolean=false;
  switchvoucherTab(val){alert(val);
    if(val=='1'){
      this.vouchertab1=true;
      this.vouchertab2=false;
      this.vouchertab3=false;
    }else if(val=='2'){
      this.vouchertab1=false;
      this.vouchertab2=true;
      this.vouchertab3=false;
    }else if(val=='3'){
      this.vouchertab1=false;
      this.vouchertab2=false;
      this.vouchertab3=true;
    }
  }
  applyVoucher(){
    this.submitted1=true;
    if (this.voucherForm1.status !='VALID') {
      return;
    }else{
      this.switchvoucherTab(2);
        var first9digit = this.voucherForm1.controls['first4digit'].value;
        var first4digit = first9digit.substring(0, 4).trim();
        var last4digit = this.voucherForm1.controls['last4digit'].value;
        var applymobile = this.voucherForm1.controls['applymobile'].value;
        var dob = this.voucherForm1.controls['dob'].value;
        var datePipe = new DatePipe('en-US'); 
        var dobStr = datePipe.transform(dob,'MM/dd/yyyy');
        var applyvouchercode = this.voucherForm1.controls['applyvouchercode'].value;
        /*console.log(first9digit);
        console.log(first4digit);
        console.log(last4digit);
        console.log(applymobile);
        console.log(dobStr);
        console.log(applyvouchercode);*/

    }
  }

}

  
