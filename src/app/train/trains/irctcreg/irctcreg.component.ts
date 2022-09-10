import { Component, OnInit,NgModule,ChangeDetectorRef, ElementRef ,Inject, ɵConsole, Input, Output, EventEmitter } from '@angular/core';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router} from '@angular/router';
import { SimpleGlobal } from 'ng2-simple-global';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { DOCUMENT, NgStyle, DatePipe } from '@angular/common';
import { APP_CONFIG, AppConfig} from '../../../configs/app.config';
import * as moment from 'moment';

import { RestapiService} from 'src/app/shared/services/restapi.service';
import { Location } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { EncrDecrService } from 'src/app/shared/services/encr-decr.service';
import { IrctcApiService } from 'src/app/shared/services/irctc.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MatBottomSheet} from '@angular/material/bottom-sheet';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import { fareEnqueryMultiplePassengers} from 'src/app/shared/interfaces/fareEnqueryMultiplePassengers';
import { environment } from '../../../../environments/environment';
import {NgbDateParserFormatter,NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
// import { ReCaptchaV3Service } from 'ngx-captcha';
import { AppConfigService } from '../../../app-config.service';

@Component({
  selector: 'app-irctcreg',
  templateUrl: './irctcreg.component.html',
  styleUrls: ['./irctcreg.component.scss']
})
export class IrctcregComponent implements OnInit {
  AccountActive:boolean=true; 
  PersonalActive:boolean=false; 
  ResidentialActive:boolean=false;   
  OfficeActive:boolean=false;   
  siteKey:any;
  accountDetailsForm: FormGroup;
  personalDetailsForm: FormGroup;
  residentialAddrForm: FormGroup;
  checkDate:any;
  //officeForm: FormGroup;

  pinParamResidence: any; pinParamOffc: any;
  userIdParam: any;userParam: any;
  response: any = [];
  wsUserLogin: string;
  IRCTCUserError: any;
  IRCTCUserId: any;
  domainRedirect:any = 'http://contents.irctc.co.in/en/Terms%20and%20conditions.pdf';
  userValidError: boolean = false;cnfPassValidError: boolean = false;cnfPassValidErrorMsg:string;

  submitted = false;
  submittedaccountDetailsForm=false;
  submittedPersonalDetailsForm=false;
  submittedResidentialAddrForm=false;
  submittedofficeForm=false;
  
  patternPwd=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  patternName = /^\S[a-z A-Z]+$/;
  emailPattern = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

  country: any = [];
  countries: any;
  defaultCountry: String;defaultNationality: String;defaultCountryOffc:String;
  selectedCity: String;
  citySelect:string;
  POSelect:string;
  CheckCopyResidence:Boolean;
  
  tab_1:boolean=true;tab_2:boolean=false;tab_3:boolean=false;tab_4:boolean=false;
  tab_2_disabled:boolean=true;tab_3_disabled:boolean=true;tab_4_disabled:boolean=true;
  maxDate:any;
  dialog1:boolean;
  dialog2:boolean;



  //defaultISD:string;
   serviceSettings:any;
  
  constructor(private calendar: NgbCalendar,private ngbDateParserFormatter: NgbDateParserFormatter,public _irctc: IrctcApiService,private EncrDecr: EncrDecrService,private location: Location,private dialog: MatDialog,private appConfigService:AppConfigService)
   { }

  ngOnInit() {
  this.serviceSettings=this.appConfigService.getConfig();
    this.siteKey=this.serviceSettings.SITEKEY; 
    this.tab_1=true;
    this.tab_2_disabled=true;
    this.tab_3_disabled=true;
    this.tab_4_disabled=true;

    const form1Group: FormGroup = new FormGroup({});
    form1Group.addControl('userID', new FormControl('', [Validators.required, Validators.pattern("^[A-Za-z][A-Za-z0-9]*(?:_[A-Za-z0-9]+)*$"), Validators.minLength(3)]));
    // form1Group.addControl('password', new FormControl('', [Validators.required, Validators.pattern(this.patternPwd), Validators.minLength(6)]));
    // form1Group.addControl('cnfpassword', new FormControl('', [Validators.required]));
    form1Group.addControl('securityQues', new FormControl('', [Validators.required]));
    form1Group.addControl('securityAns', new FormControl('', [Validators.required]));
    form1Group.addControl('preferredLang', new FormControl('', [Validators.required]));
    this.accountDetailsForm = form1Group;

    const form2Group: FormGroup = new FormGroup({});
    form2Group.addControl('firstName', new FormControl('', [Validators.required, Validators.pattern(this.patternName), Validators.minLength(2), Validators.maxLength(30)]));
    form2Group.addControl('middleName', new FormControl('', [Validators.pattern(this.patternName)]));
    form2Group.addControl('lastName', new FormControl('', [Validators.required, Validators.pattern(this.patternName), Validators.minLength(1), Validators.maxLength(30)]));
    form2Group.addControl('dob', new FormControl('', [Validators.required]));
    form2Group.addControl('gender', new FormControl('', [Validators.required]));
    form2Group.addControl('maritalStatus', new FormControl('', [Validators.required]));
    form2Group.addControl('occupation', new FormControl('', [Validators.required]));
    form2Group.addControl('nationality', new FormControl('', [Validators.required]));
    form2Group.addControl('country', new FormControl('', [Validators.required]));
    form2Group.addControl('email', new FormControl('', [Validators.required, Validators.pattern(this.emailPattern), Validators.maxLength(70)]));
    //form2Group.addControl('isd', new FormControl('',[Validators.required,Validators.pattern("^[0-9]*$")]));
    form2Group.addControl('mobileNo', new FormControl('', [Validators.required, Validators.pattern("^[6-9][0-9]{9,14}$"), Validators.minLength(10), Validators.maxLength(15)]));
    this.personalDetailsForm = form2Group;

    const form3Group: FormGroup = new FormGroup({});
    form3Group.addControl('flat', new FormControl('', [Validators.required,Validators.pattern("^[a-z A-Z 0-9 .:/,-]*$"),Validators.minLength(3),Validators.maxLength(225)]));
    form3Group.addControl('street', new FormControl('', [Validators.required, Validators.minLength(2),Validators.maxLength(30)]));
    form3Group.addControl('locality', new FormControl('', [Validators.required, Validators.minLength(2),Validators.maxLength(40)]));
    form3Group.addControl('pincode', new FormControl('', [Validators.required, Validators.minLength(2),Validators.maxLength(6)]));
    form3Group.addControl('state', new FormControl('', [Validators.required, Validators.minLength(2),Validators.maxLength(15)]));
    form3Group.addControl('city', new FormControl('', [Validators.required]));
    form3Group.addControl('postOffc', new FormControl('', [Validators.required]));
    form3Group.addControl('phoneNo', new FormControl('', [Validators.required, Validators.pattern("^[6-9][0-9]{9,14}$"), Validators.minLength(10), Validators.maxLength(15)]));
    form3Group.addControl('copyResidence', new FormControl(''));
    form3Group.addControl('informMe', new FormControl(''));
    form3Group.addControl('recaptcha', new FormControl(''));
    form3Group.addControl('agree', new FormControl(''));
   
    form3Group.addControl('offccountry', new FormControl(''));
    form3Group.addControl('offcflat', new FormControl(''));
    form3Group.addControl('offcstreet', new FormControl(''));
    form3Group.addControl('offclocality', new FormControl(''));
    form3Group.addControl('offcpincode', new FormControl(''));
    form3Group.addControl('offcstate', new FormControl(''));
    form3Group.addControl('offccity', new FormControl(''));
    form3Group.addControl('offcpostOffc', new FormControl(''));
    form3Group.addControl('offcphoneNo', new FormControl(''));
    form3Group.addControl('offcinformMe', new FormControl(''));
    form3Group.addControl('offcagree', new FormControl(''));
    form3Group.addControl('offcrecaptcha', new FormControl(''));
    this.residentialAddrForm = form3Group;
  
    //country dropdown
    this._irctc.countryList().subscribe(responseCountry => {
        this.country = (responseCountry);
        this.countries = this.country['partnerResponse']['countryList'];
        this.defaultCountry = "94";
        this.defaultNationality = "94";
        this.defaultCountryOffc="94";
    });
    //default copy residence checkbox is false
    this.CheckCopyResidence=false;
    this.stateCheckOffc=false;
    this.stateCheck=false;
    this.FlagCountry=true;
    this.state ="";
    this.offcstate="";
    
    this.maxDate = new Date();
    
     var mm = ("0"+(this.maxDate.getMonth()+1)).slice(-2);
     var dd = ("0"+this.maxDate.getDate()).slice(-2);
    
    
    var yyyy = this.maxDate.getFullYear();
    this.checkDate = this.checkmaxDate(dd, mm, yyyy)
    this.dialog1=true;
    this.dialog2=false;
  }
  readonlyISD:boolean;
  // changeCountry(countrycode){
  //   if(countrycode == "94"){
  //       this.defaultISD="91";
  //       this.readonlyISD=true;
  //   }else{
  //     this.defaultISD="";
  //     this.readonlyISD=false;
  //   }
  // }
  
  tabOpen(x){
    if(x==1){
      this.tab_1=true;
      this.tab_2=false;
      this.tab_3=false;
      this.tab_4=false;
      this.AccountActive=true;
      this.PersonalActive=false;
      this.ResidentialActive=false;
      this.OfficeActive=false;
    }else if(x==2){
      this.tab_1=false;
      this.tab_2=true;
      this.tab_3=false;
      this.tab_4=false;
      this.AccountActive=false;
      this.PersonalActive=true;
      this.ResidentialActive=false;
      this.OfficeActive=false;
    }else if(x==3){
      this.tab_1=false;
      this.tab_2=false;
      this.tab_3=true;
      this.tab_4=false;
      this.AccountActive=false;
      this.PersonalActive=false;
      this.ResidentialActive=true;
      this.OfficeActive=false;
    }else if(x==4){
      this.tab_1=false;
      this.tab_2=false;
      this.tab_3=false;
      this.tab_4=true;
      this.AccountActive=false;
      this.PersonalActive=false;
      this.ResidentialActive=false;
      this.OfficeActive=true;
    }  
  }
  errorInvalid:number=1;
  validateIRCTCUser() {
    var IRCTCUserId =	this.accountDetailsForm.controls['userID']['value'];
    if(IRCTCUserId!="" && IRCTCUserId!=undefined && IRCTCUserId!=null)
    { 
        this.userIdParam = {
            "userLoginId": IRCTCUserId
        };
        var userIdParamStr = JSON.stringify(this.userIdParam);
        this._irctc.checkUsername(userIdParamStr).subscribe(data => {
                this.response = data;
                if(this.response.partnerResponse.useridAvailable) {
                  if (this.response.partnerResponse.useridAvailable == "TRUE" || this.response.partnerResponse.useridAvailable == "true" || this.response.partnerResponse.useridAvailable == "True") {      //** USERID AVAILABLE*/ 
                      this.userValidError = false;
                      //this.openTravellerInfoTab = false;
                      this.errorInvalid = 0;
                  }else{ 		                                                    //** USERID UN-AVAILABLE*/ 										
                      this.IRCTCUserError = "User ID not available.Please re-enter";
                      this.userValidError = true;
                      //this.openTravellerInfoTab = true;
                      this.submittedaccountDetailsForm = false;
                      this.errorInvalid = 1;
                  }
                }else{
                    this.IRCTCUserError = "Please re-enter";
                    this.userValidError = true;
                    //this.openTravellerInfoTab = true;
                    this.submittedaccountDetailsForm = false;
                    this.errorInvalid = 1;
                }
            },
            (err: HttpErrorResponse) => {
                var message = 'Please check your internet connection !';
                const dialogRef = this.dialog.open(ConfirmationDialog, {
                                 disableClose: true,
                    width: '600px',
                    id: 'messageforMliteDialog',
                    data: {
                        messageData: message
                    }
                });
                this.userValidError = true;
                //this.openTravellerInfoTab = true;
                this.submittedaccountDetailsForm = false;
                this.errorInvalid = 1;
            });
    }else{
        //this.IRCTCUserError = "Please re-enter";
        this.userValidError = true;
        //this.openTravellerInfoTab = true;
        this.submittedaccountDetailsForm = false;
        this.errorInvalid = 1;
    }
  }

  Form1:boolean=false;Form2:boolean=false;Form3:boolean=false;
  submitAccountDetails(){
 
    //form validation check
    this.submittedaccountDetailsForm = true;
    if (this.accountDetailsForm.invalid || this.errorInvalid == 1 || this.userValidError == true) {
      this.Form1 = false;
      return;
    }else{ 
      this.tab_2_disabled=false;
      this.Form1 = true;
      this.errorInvalid = 0;
      this.tab_1=false;
      this.tab_2=true;
      this.tab_3=false;
      this.AccountActive=false;
      this.PersonalActive=true;
      this.ResidentialActive=false;
      this.OfficeActive=false;
    }
  }
  checkmaxDate(dd, mm, yyyy){
    return new Date(yyyy-18, mm-1, dd);
  }
  submitPersonalDetails(){
    this.submittedPersonalDetailsForm=true;
    if (this.personalDetailsForm.invalid) {
      this.Form2 = false;
      return;
    }else{ 
      // this.errorInvalid = 0;
        this.tab_3_disabled=false;
        this.tab_4_disabled=false;
        this.Form2 = true;
        this.tab_1=false;
        this.tab_2=false;
        this.tab_3=true;
        this.AccountActive=false;
        this.PersonalActive=false;
        this.ResidentialActive=true;
        this.OfficeActive=false;
    }
  }
  registerIRCTCUser(){
    this.submitAccountDetails();
    this.submitPersonalDetails();
    if(this.CheckCopyResidence==true){
      this.residentialAddrForm.controls['recaptcha'].setValidators([Validators.required]);
      this.residentialAddrForm.controls['agree'].setValidators([Validators.required, Validators.pattern('true')]);
      this.residentialAddrForm.controls['recaptcha'].updateValueAndValidity();
      this.residentialAddrForm.controls['agree'].updateValueAndValidity();

      this.residentialAddrForm.get('offccountry').clearValidators();
      this.residentialAddrForm.get('offcflat').clearValidators();
      this.residentialAddrForm.get('offcstreet').clearValidators();
      this.residentialAddrForm.get('offclocality').clearValidators();
      this.residentialAddrForm.get('offcpincode').clearValidators();
      this.residentialAddrForm.get('offcstate').clearValidators();
      this.residentialAddrForm.get('offccity').clearValidators();
      this.residentialAddrForm.get('offcpostOffc').clearValidators();
      this.residentialAddrForm.get('offcphoneNo').clearValidators();
      this.residentialAddrForm.get('offcinformMe').clearValidators();
      this.residentialAddrForm.get('offcagree').clearValidators();
      this.residentialAddrForm.get('offcrecaptcha').clearValidators();
      this.residentialAddrForm.controls['offccountry'].updateValueAndValidity();
      this.residentialAddrForm.controls['offcflat'].updateValueAndValidity();
      this.residentialAddrForm.controls['offcstreet'].updateValueAndValidity();
      this.residentialAddrForm.controls['offclocality'].updateValueAndValidity();
      this.residentialAddrForm.controls['offcpincode'].updateValueAndValidity();
      this.residentialAddrForm.controls['offcstate'].updateValueAndValidity();
      this.residentialAddrForm.controls['offccity'].updateValueAndValidity();
      this.residentialAddrForm.controls['offcpostOffc'].updateValueAndValidity();
      this.residentialAddrForm.controls['offcphoneNo'].updateValueAndValidity();
      this.residentialAddrForm.controls['offcinformMe'].updateValueAndValidity();
      this.residentialAddrForm.controls['offcagree'].updateValueAndValidity();
      this.residentialAddrForm.controls['offcrecaptcha'].updateValueAndValidity();
    }else{
      this.residentialAddrForm.controls['offccountry'].setValidators([Validators.required]);
      this.residentialAddrForm.controls['offcflat'].setValidators([Validators.required,Validators.pattern("^[a-z A-Z 0-9 .:/,-]*$"),Validators.minLength(3),Validators.maxLength(225)]);
      this.residentialAddrForm.controls['offcstreet'].setValidators([Validators.required, Validators.minLength(2),Validators.maxLength(20)]);
      this.residentialAddrForm.controls['offclocality'].setValidators([Validators.required, Validators.minLength(2),Validators.maxLength(40)]);
      this.residentialAddrForm.controls['offcpincode'].setValidators([Validators.required, Validators.minLength(2),Validators.maxLength(6)]);
      this.residentialAddrForm.controls['offcstate'].setValidators([Validators.required, Validators.minLength(2),Validators.maxLength(15)]);
      this.residentialAddrForm.controls['offccity'].setValidators([Validators.required]);
      this.residentialAddrForm.controls['offcpostOffc'].setValidators([Validators.required]);
      this.residentialAddrForm.controls['offcphoneNo'].setValidators([Validators.required, Validators.pattern("^[6-9][0-9]{9,14}$"), Validators.minLength(10), Validators.maxLength(15)]);
      this.residentialAddrForm.controls['offcinformMe'].setValidators([]);
      this.residentialAddrForm.controls['offcagree'].setValidators([Validators.required, Validators.pattern('true')]);
      this.residentialAddrForm.controls['offcrecaptcha'].setValidators([Validators.required]);
      this.residentialAddrForm.controls['offccountry'].updateValueAndValidity();
      this.residentialAddrForm.controls['offcflat'].updateValueAndValidity();
      this.residentialAddrForm.controls['offcstreet'].updateValueAndValidity();
      this.residentialAddrForm.controls['offclocality'].updateValueAndValidity();
      this.residentialAddrForm.controls['offcpincode'].updateValueAndValidity();
      this.residentialAddrForm.controls['offcstate'].updateValueAndValidity();
      this.residentialAddrForm.controls['offccity'].updateValueAndValidity();
      this.residentialAddrForm.controls['offcpostOffc'].updateValueAndValidity();
      this.residentialAddrForm.controls['offcphoneNo'].updateValueAndValidity();
      this.residentialAddrForm.controls['offcinformMe'].updateValueAndValidity();
      this.residentialAddrForm.controls['offcagree'].updateValueAndValidity();
      this.residentialAddrForm.controls['offcrecaptcha'].updateValueAndValidity();
      this.tabOpen(4);
    }
    this.submittedResidentialAddrForm=true;
    if (this.residentialAddrForm.invalid){
      this.Form3 = false;
      return;
    }else{ 
      if(this.Form1 == false){
        this.tabOpen(1);
      }else if(this.Form2 == false) {
        this.tabOpen(2);
      }else{
        this.Form3 = true;
        var prefLanguage = this.accountDetailsForm.controls['preferredLang']['value']; 
        var securityAns = this.accountDetailsForm.controls['securityAns']['value']; 
        var securityQuestion = this.accountDetailsForm.controls['securityQues']['value']; 
        var userName = this.accountDetailsForm.controls['userID']['value'];  
       // var uidNumber
        var countryId = this.personalDetailsForm.controls['country']['value'];
        var dob = this.personalDetailsForm.controls['dob']['value'];
        var datePipe =new DatePipe('en-US'); 
        dob=datePipe.transform(dob,'yyyyMMdd');
		
        var email = this.personalDetailsForm.controls['email']['value'];
        var firstName = this.personalDetailsForm.controls['firstName']['value'];
        var lastName = this.personalDetailsForm.controls['lastName']['value'];
        var middleName = this.personalDetailsForm.controls['middleName']['value'];
        var gender = this.personalDetailsForm.controls['gender']['value'];
        //var isd = this.personalDetailsForm.controls['isd']['value'];
        var mobile = this.personalDetailsForm.controls['mobileNo']['value'];
        var martialStatus = this.personalDetailsForm.controls['maritalStatus']['value'];
        var nationalityId = this.personalDetailsForm.controls['nationality']['value'];
        var occupation = this.personalDetailsForm.controls['occupation']['value'];
        
        //var copyAddressResToOff = this.CheckCopyResidence;
        //var copyAddressResToOff = this.residentialAddrForm.controls['copyResidence']['value']; //CheckCopyResidence
        var address = this.residentialAddrForm.controls['flat']['value'];
        var street = this.residentialAddrForm.controls['street']['value'];
        var area = this.residentialAddrForm.controls['locality']['value'];
        var city = this.residentialAddrForm.controls['city']['value'];
        // var state = this.residentialAddrForm.controls['state']['value'];
        var state = this.residentialAddrForm.controls['state']['value'];
        var landlineNumber = this.residentialAddrForm.controls['phoneNo']['value'];
        var pinCode = this.residentialAddrForm.controls['pincode']['value'];
        var postOffice = this.residentialAddrForm.controls['postOffc']['value'];

        if(this.CheckCopyResidence == true){ 
          var off_Address=address;
          var off_City=city;
          var off_CountryId=countryId;
          var off_LandlineNumber=landlineNumber;
          var off_PinCode=pinCode;
          var off_PostOffice=postOffice;
          var off_State=state;
          var off_Street=street;
          var off_area=area;

          var off_otherCity=city;
          var off_otherCountry=countryId;
          var off_otherState=state;
          var otherCity=city;
          var otherCountry=countryId;
          var otherState=state;
        }else{                               
          off_Address=this.residentialAddrForm.controls['flat']['value'];
          off_City=this.residentialAddrForm.controls['city']['value'];
          off_CountryId=this.residentialAddrForm.controls['offccountry']['value'];
          off_LandlineNumber=this.residentialAddrForm.controls['offcphoneNo']['value'];
          off_PinCode=this.residentialAddrForm.controls['offcpincode']['value'];
          off_PostOffice=this.residentialAddrForm.controls['postOffc']['value'];
          //off_State=this.offcstate 
          off_State=this.residentialAddrForm.controls['offcstate']['value'];
          off_Street=this.residentialAddrForm.controls['offcstreet']['value'];
          off_area=this.residentialAddrForm.controls['offclocality']['value'];
          
          off_otherCity=off_City;
          off_otherCountry=off_CountryId;
          off_otherState=off_State;
          otherCity=off_City;
          otherCountry=off_CountryId;
          otherState=off_State;
        }
        var CheckCopyResidence;
        if(this.CheckCopyResidence==true)
        CheckCopyResidence='Y'
        else
        CheckCopyResidence='N';
        this.userParam = {
          "address": address,
          "area": area,
          "city": city,
          "copyAddressResToOff": CheckCopyResidence,
          "countryId": countryId,
          "dob": dob,
          "email": email,
          "firstName": firstName,
          "gender": gender,
          "landlineNumber": landlineNumber,
          "lastName": lastName,
          "martialStatus": martialStatus,
          "middleName": middleName,
          "mobile": mobile,
          "nationalityId": nationalityId,
          "occupation": occupation,
          "off_Address": off_Address,
          "off_City": off_City,
          "off_CountryId": off_CountryId,
          "off_LandlineNumber": off_LandlineNumber,
          "off_PinCode": off_PinCode,
          "off_PostOffice": off_PostOffice,
          "off_State": off_State,
          "off_Street": off_Street,
          "off_area": off_area,
          "off_otherCity": off_otherCity,
          "off_otherCountry": off_otherCountry,
          "off_otherState": off_otherState,
          "otherCity": otherCity,
          "otherCountry": otherCountry,
          "otherState": otherState,
          "pinCode": pinCode,
          "postOffice": postOffice,
          "prefLanguage": prefLanguage,
          "securityAns": securityAns,
          "securityQuestion": securityQuestion,
          "state": state,
          "street": street,
          "uidNumber": userName,
          "userName": userName
        };
        var userParamStr = JSON.stringify(this.userParam);
        this._irctc.userRegister(userParamStr).subscribe(data => {
              this.response = data;
              var message = this.response.partnerResponse.status;
              var regFlag = this.response.partnerResponse.regFlag;
              //console.log( this.response);
             
              if(regFlag == "true"){
                  const dialogRef = this.dialog.open(SuccessDialog, {
                      disableClose: true,
                      data: {
                          messageData: message
                      }
                  });
              }else{
                //var error = this.response.partnerResponse.errorList;
                var error = this.response.partnerResponse.errorList;
                const dialogRef = this.dialog.open(ConfirmationDialog, {
                    disableClose: true,
                    width: '600px',
                    id: 'messageforMliteDialog',
                    data: {
                        messageData: error
                    }
                });
              }
          },
          (err: HttpErrorResponse) => {
              var message = this.response.partnerResponse.errorList;
              const dialogRef = this.dialog.open(ConfirmationDialog, {
                  disableClose: true,
                  width: '600px',
                  id: 'messageforMliteDialog',
                  data: {
                      messageData: message
                  }
              });
          });
      }
    }
  }
  param1:any;cityList:any[];stateCheck:boolean=false;
  param2:any;cityListOffc:any[];stateCheckOffc:boolean=false;pincodeError:string;pincodeErrorOffc:string;
  postOfficeList:any[];state:any;
  offcpostOfficeList:any[];offcstate:any;
  getCityResidence($event) 
  {
    if($event.target.value.length==6){
      if(this.residentialAddrForm.controls['pincode']['status']){
          let pincode = this.residentialAddrForm.controls['pincode']['value'];
          this.param1 = {
            "pinCode": pincode
          };
          var param1Str = JSON.stringify(this.param1);
          this._irctc.findCity(param1Str).subscribe(data => {
              this.response=data;
              //console.log(this.residentialAddrForm.controls['city']['value']);
              if(this.residentialAddrForm.controls['city']['value'] != undefined){
                this.findPinResidence();
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
              this.stateCheck=true;   //disable state field
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
      this.cityList=[];
      this.pincodeError="";
      this.stateCheck=true;
      this.state="";
      this.postOfficeList=[];
    }
  }
  getCityOffice($event) 
  { 
    if($event.target.value.length==6){
        if(this.residentialAddrForm.controls['offcpincode']['value']){
          let pincode = this.residentialAddrForm.controls['offcpincode']['value'];
          this.param2 = {
            "pinCode": pincode
          };
          var param2Str = JSON.stringify(this.param2);
          this._irctc.findCity(param2Str).subscribe(data => {
                this.response = data;
               // console.log(this.residentialAddrForm.controls['offccity']['value']);
                if(this.residentialAddrForm.controls['offccity']['value'] != undefined){
                  this.findPinOffice();
                }
                if(Array.isArray(this.response.partnerResponse.cityList) && !(this.response.partnerResponse.error)){
                  this.cityListOffc  = this.response.partnerResponse.cityList;
                  this.pincodeErrorOffc="";
                }else if(Array.isArray(this.response.partnerResponse.cityList)==false && !(this.response.partnerResponse.error)){
                  this.cityListOffc.push(this.response.partnerResponse.cityList);
                  this.pincodeErrorOffc="";
                }else if(this.response.partnerResponse.error){
                  this.pincodeErrorOffc=this.response.partnerResponse.error;
                  this.cityListOffc=[];
                }else{
                  this.pincodeErrorOffc="";
                  this.cityListOffc=[];
                }
                this.offcstate = this.response.partnerResponse.state;
                this.stateCheckOffc = true;   //disable state field
            },
            (err: HttpErrorResponse) => {
                var message = 'Something went wrong !';
                const dialogRef = this.dialog.open(ConfirmationDialog, {
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
      this.cityListOffc=[];
      this.pincodeErrorOffc="";
      this.stateCheckOffc=true;
      this.offcstate="";
      this.offcpostOfficeList=[];
    }
  }
  findPinResidence(){
    this.postOfficeList=[];
    if(this.residentialAddrForm.controls['pincode']['value']){
      let pincode = this.residentialAddrForm.controls['pincode']['value'];
      let city = this.residentialAddrForm.controls['city']['value'];
      this.pinParamResidence = {
        "city": city,
        "pinCode": pincode
      };
      var pinParamResidenceStr = JSON.stringify(this.pinParamResidence);
      this._irctc.findPin(pinParamResidenceStr).subscribe(data => {
          this.response = data;
          if(Array.isArray(this.response.partnerResponse.postofficeList) && !(this.response.partnerResponse.error)){ 
            this.postOfficeList=this.response.partnerResponse.postofficeList;
          }else if(Array.isArray(this.response.partnerResponse.postofficeList)==false && !(this.response.partnerResponse.error)){
            this.postOfficeList.push(this.response.partnerResponse.postofficeList);
          }else if(this.response.partnerResponse.error){
            this.postOfficeList=[];
          }else{
            this.postOfficeList=[];
            //this.postOfficeList[0]  = this.response.partnerResponse.postofficeList;
          }
        },
        (err: HttpErrorResponse) => {
            var message = 'Something went wrong !';
            const dialogRef = this.dialog.open(ConfirmationDialog, {
                disableClose: true,
                width: '600px',
                id: 'messageforMliteDialog',
                data: {
                    messageData: message
                }
            });
        });
    }
  }
  findPinOffice(){  
    this.offcpostOfficeList=[];
    if(this.residentialAddrForm.controls['offcpincode']['value']){
      let pincode = this.residentialAddrForm.controls['offcpincode']['value'];
      let city = this.residentialAddrForm.controls['offccity']['value'];
      this.pinParamOffc = {
        "city": city,
        "pinCode": pincode
      };
      var pinParamOffcStr = JSON.stringify(this.pinParamOffc);
      this._irctc.findPin(pinParamOffcStr).subscribe(data => {
            this.response = data;
            if(Array.isArray(this.response.partnerResponse.postofficeList) && !(this.response.partnerResponse.error)){
              this.offcpostOfficeList  = this.response.partnerResponse.postofficeList;
            }else if(Array.isArray(this.response.partnerResponse.postofficeList)==false && !(this.response.partnerResponse.error)){
              this.offcpostOfficeList.push(this.response.partnerResponse.postofficeList);
            }else if(this.response.partnerResponse.error){
              this.offcpostOfficeList=[];
            }else{
              this.offcpostOfficeList=[];
            }
        },
        (err: HttpErrorResponse) => {
            var message = 'Something went wrong !';
            const dialogRef = this.dialog.open(ConfirmationDialog, {
                disableClose: true,
                width: '600px',
                id: 'messageforMliteDialog',
                data: {
                    messageData: message
                }
            });
        });
    }
  }
  copyResidence($event){
    this.CheckCopyResidence=!this.CheckCopyResidence;

    this.residentialAddrForm.get('recaptcha').clearValidators();
    this.residentialAddrForm.get('agree').clearValidators();
    this.residentialAddrForm.controls['recaptcha'].updateValueAndValidity();
    this.residentialAddrForm.controls['agree'].updateValueAndValidity();

    this.residentialAddrForm.get('offccountry').clearValidators();
    this.residentialAddrForm.get('offcflat').clearValidators();
    this.residentialAddrForm.get('offcstreet').clearValidators();
    this.residentialAddrForm.get('offclocality').clearValidators();
    this.residentialAddrForm.get('offcpincode').clearValidators();
    this.residentialAddrForm.get('offcstate').clearValidators();
    this.residentialAddrForm.get('offccity').clearValidators();
    this.residentialAddrForm.get('offcpostOffc').clearValidators();
    this.residentialAddrForm.get('offcphoneNo').clearValidators();
    this.residentialAddrForm.get('offcagree').clearValidators();
    this.residentialAddrForm.get('offcrecaptcha').clearValidators();
    this.residentialAddrForm.controls['offccountry'].updateValueAndValidity();
    this.residentialAddrForm.controls['offcflat'].updateValueAndValidity();
    this.residentialAddrForm.controls['offcstreet'].updateValueAndValidity();
    this.residentialAddrForm.controls['offclocality'].updateValueAndValidity();
    this.residentialAddrForm.controls['offcpincode'].updateValueAndValidity();
    this.residentialAddrForm.controls['offcstate'].updateValueAndValidity();
    this.residentialAddrForm.controls['offccity'].updateValueAndValidity();
    this.residentialAddrForm.controls['offcpostOffc'].updateValueAndValidity();
    this.residentialAddrForm.controls['offcphoneNo'].updateValueAndValidity();
    this.residentialAddrForm.controls['offcagree'].updateValueAndValidity();
    this.residentialAddrForm.controls['offcrecaptcha'].updateValueAndValidity();
  }
  openOfficeResidence(){
      this.submittedResidentialAddrForm=true;
      if(this.residentialAddrForm.controls['flat'].invalid ||
      this.residentialAddrForm.controls['street'].invalid ||
      this.residentialAddrForm.controls['locality'].invalid ||
      this.residentialAddrForm.controls['pincode'].invalid ||
      this.residentialAddrForm.controls['state'].invalid ||
      this.residentialAddrForm.controls['city'].invalid ||
      this.residentialAddrForm.controls['postOffc'].invalid ||
      this.residentialAddrForm.controls['phoneNo'].invalid ||
      this.residentialAddrForm.controls['postOffc'].invalid ){
        this.Form3 = false;
        return;
      }else{ 

        // this.errorInvalid = 0;
          this.tab_3_disabled=false;
          this.tab_4_disabled=false;
          this.Form3 = true;
          this.tab_1=false;
          this.tab_2=false;
          this.tab_3=false;
          this.tab_4=true;
          this.AccountActive=false;
          this.PersonalActive=false;
          this.ResidentialActive=true;
          this.OfficeActive=true;
      }
  }
  FlagCountry:boolean=true;
  countrySelect() {   //if country=india; PostOffc and City is dropdown field; otherwise ther are input fields
    var id = this.residentialAddrForm.controls['offccountry']['value'];
    if(this.residentialAddrForm.controls['offccountry']['value']){
      if(id != "94"){       //not India
          this.FlagCountry=false;
      }else if(id == "94"){        //India
          this.FlagCountry=true;
      }else{
        this.FlagCountry=true;
      }
    }else{
      this.FlagCountry=true;
    }
  }
  foreigntext: boolean = false;
  changecountry(){
    var countrycode = this.personalDetailsForm.controls['country']['value'];
    if(this.residentialAddrForm.controls['offccountry']['value']){
      if(countrycode!=94){
        this.foreigntext=true;
      }else if(countrycode == 94){
        this.foreigntext=false;
      }else{
        this.foreigntext = false;
      }
    }else{
      this.foreigntext = false;
    }
  }
  newsandalertRes:any=[];
  newsandalert($event){ 
    var marked=$event.target.checked;
    if(marked==true){
      this._irctc.newsandalert().subscribe(response => {
        this.newsandalertRes = (response);
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
  /*special char & number & rupee symbol ( Rs.)*/
  flInput($event) {
    var keycode = $event.which;
    if ((keycode >= 33 && keycode <= 47) || (keycode >= 91 && keycode <= 96) || (keycode >= 48 && keycode <= 64) || (keycode == 8377)) {
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
    if ((keycode >= 33 && keycode <= 47) || (keycode >= 91 && keycode <= 96) || (keycode >= 58 && keycode <= 64) ||
    (keycode >= 123 && keycode <= 126) || (keycode == 8377) || (keycode == 8364) || (keycode == 128) || (keycode == 163) ||
    (keycode == 165)){
      event.preventDefault();
    }
  }
  specialcharInputAddress($event) { //40,41,58,45
    var keycode = $event.which;
    if ((keycode >= 33 && keycode <= 34) || (keycode >= 36 && keycode <= 43) || (keycode >= 60 && keycode <= 64) || (keycode >= 91 && keycode <= 96) || (keycode >= 123 && keycode <= 126) || (keycode == 8377) || (keycode == 8364) || (keycode == 128) || (keycode == 163) ||
     (keycode == 165)){
     event.preventDefault();
    }
  }
  goback() {
    this.location.back();
  }

  //date-picker
  dob:NgbDateStruct;
	navigation = 'select';
	today = new Date();
	year = this.today.getFullYear();
	month = this.today.getMonth();
  day = this.today.getDate();
  pickermaxDate = {year: this.year, month: this.month+1, day: this.day};
  setDefaultDate(): NgbDateStruct {
    var startDate = new Date();
    let startYear = startDate.getFullYear().toString();
    let startMonth = startDate.getMonth() + 1; 
    let startDay = "12";
      return this.ngbDateParserFormatter.parse(startYear + "-" + startMonth.toString() + "-" + startDay);
  }
  setPickerDate(date): NgbDateStruct { 
    let dateParts = date.split('-');
    return this.ngbDateParserFormatter.parse(dateParts[0] + "-" + dateParts[1] + "-" + dateParts[2]);
  }

}

@Component({
  selector: 'confirmation-dialog',
  templateUrl: 'dialog.html'
})
export class ConfirmationDialog {
  searchArray: any = [];
  constructor(public dialogRef: MatDialogRef < ConfirmationDialog > , @Inject(MAT_DIALOG_DATA) public data: any, private location: Location, private router: Router) {}
  onYesClick(): void {
      this.dialogRef.close(true);
  }

}

@Component({
  selector: 'success-dialog',
  templateUrl: 'success.html',
  styleUrls: ['./irctcreg.component.scss']
})
export class SuccessDialog {
cdnUrl: any;
  searchArray: any = [];
  Form2Submit: FormGroup;
  submittedForm3:boolean=false;
  paramStep2:any;response: any = [];
  apimessage:string;dialogmsg:string;OTPmessage:string;
  verifyOTPdialog:boolean;verifySuccess:boolean;verifyFail:boolean;
  constructor(private dialog: MatDialogRef < SuccessDialog > , @Inject(MAT_DIALOG_DATA) public data: any, private location: Location, private router: Router,public _irctc: IrctcApiService,private sg: SimpleGlobal, private EncrDecr: EncrDecrService) {}
  ngOnInit(){
     this.cdnUrl = environment.cdnUrl + this.sg['assetPath'];
      this.verifyOTPdialog=true;
      this.verifySuccess=false;
      this.verifyFail=false;
      const form2Group: FormGroup = new FormGroup({});
      form2Group.addControl('userID', new FormControl(''));
      form2Group.addControl('smsOTP', new FormControl(''));
      form2Group.addControl('emailOTP', new FormControl(''));
      form2Group.addControl('recaptcha2', new FormControl(''));
      this.Form2Submit=form2Group;
  }    
  verifyOTP(): void {
          //this.dialogRef.close(true);
          this.Form2Submit.controls['userID'].setValidators([Validators.required, Validators.pattern("^[a-zA-Z0-9]*$"), Validators.minLength(3)]);
          this.Form2Submit.controls['userID'].updateValueAndValidity();
          this.Form2Submit.controls['smsOTP'].setValidators([Validators.required,Validators.pattern("^[0-9]*$")]);
          this.Form2Submit.controls['smsOTP'].updateValueAndValidity();
          this.Form2Submit.controls['emailOTP'].setValidators([Validators.required,Validators.pattern("^[0-9]*$")]);
          this.Form2Submit.controls['emailOTP'].updateValueAndValidity();
          this.submittedForm3=true;
          if(this.Form2Submit.invalid){
              return;
          }else{
              let smsOTP = (this.Form2Submit.controls['smsOTP']['value']).trim();
              let emailOTP = (this.Form2Submit.controls['emailOTP']['value']).trim();
              let userID = (this.Form2Submit.controls['userID']['value']).trim();
              // • otpType (B – Verify OTP for both mobile and email, E – Verify OTP only for mail, M – Verify OTP for mobile)
             var verifyOtpParam ={
                  "otpType": "B",
                  "smsCode": smsOTP,
                  "emailCode": emailOTP,
                  "userLoginId": userID
              }

                var postverifyOtpParam = {
                    postData: this.EncrDecr.set(JSON.stringify(verifyOtpParam))
                };
              
           
              
              this._irctc.verifyOTP(postverifyOtpParam).subscribe(data => {
                  //console.log(data);
                  this.response = data;
                  if(this.response.partnerResponse.status){
                          this.verifyOTPdialog=false;
                          this.verifySuccess=true;
                          this.verifyFail=false;
                          this.dialogmsg="OTP Verified";
                          this.apimessage=this.response.partnerResponse.status;
                  }else if(this.response.partnerResponse.error){
                          this.verifyOTPdialog=false;
                          this.verifyFail=true;
                          this.verifySuccess=false;
                          this.dialogmsg="OTP Verfication failed!";
                          this.apimessage=this.response.partnerResponse.error;
                  }else{
                          this.verifyOTPdialog=false;
                          this.verifyFail=true;
                          this.verifySuccess=false;
                          this.dialogmsg="OTP Verfication failed!";
                          this.apimessage="Error! Please try again";
                          //this.goback();
                  }
              });
          }
      }
      goback(): void {
        this.dialog.close(true);
      }
      goBackToBookingPage(): void {
        this.dialog.close(true);
        //redirect to traveller booking page
        var searchTrainKey=sessionStorage.getItem("searchTrainKey");
        this.router.navigate([this.sg['domainPath']+`train-traveller/`,{searchTrainKey:searchTrainKey}]);
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
      
}

// @Component({
//   selector: 'verify-dialog',
//   templateUrl: 'verify.html'
// })
// export class VerifyDialog {
//   searchArray: any = [];
//   constructor(public dialogRef: MatDialogRef < VerifyDialog > , @Inject(MAT_DIALOG_DATA) public data: any, private location: Location, private router: Router) {}
//   clickOk(): void {

//   }
// }
