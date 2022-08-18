import { Component, OnInit, OnDestroy, DebugNode, NgModule, ViewChild, ChangeDetectorRef, ElementRef, Inject, ɵConsole, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightService } from 'src/app/common/flight.service';
import { Location } from '@angular/common';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { SimpleGlobal } from 'ng2-simple-global';
import { environment } from '../../../environments/environment';
import { AppConfigService } from '../../app-config.service';
import { EncrDecrService } from 'src/app/shared/services/encr-decr.service';
import { RestapiService } from 'src/app/shared/services/restapi.service';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { createMask } from '@ngneat/input-mask';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IrctcApiService } from 'src/app/shared/services/irctc.service';
import alertifyjs from 'alertifyjs';
import * as moment from 'moment';
import { DOCUMENT, NgStyle, DecimalPipe, DatePipe } from '@angular/common';
import { CountdownConfig, CountdownEvent } from 'ngx-countdown';
import { stringify } from '@angular/compiler/src/util';
import { AbstractControl } from '@angular/forms';


function validateAdultAge(c: FormControl) {
  let journery_date = $('#journery_date').val();
  let check_date = moment(new Date(journery_date)).subtract(12, 'years').calendar();
  let input_date = moment(c.value).format('YYYY-MM-DD');
  let to_date = moment(check_date).format('YYYY-MM-DD');
  if (moment(input_date).isAfter(to_date)) {
    return {
      validateAdultAge: {
        valid: false
      }
    };
  }
}

function validateChildAge(c: FormControl) {
  let journery_date = $('#journery_date').val();
  let mndate = moment(new Date(journery_date)).subtract(12, 'years').calendar();
  let mxdate = moment(new Date(journery_date)).subtract(2, 'years').calendar();
  let mindate = moment(mndate).format('YYYY-MM-DD');
  let maxdate = moment(mxdate).format('YYYY-MM-DD');
  let input_date = moment(c.value).format('YYYY-MM-DD');

  if (moment(mindate).isAfter(input_date) && moment(maxdate).isAfter(input_date) || moment(mindate).isBefore(input_date) && moment(maxdate).isBefore(input_date) ) {
    return {
      validateChildAge: {
        valid: false
      }
    };
  }

}

function validateInfantAge(c: FormControl) {
  let journery_date = $('#journery_date').val();

  let mndate = moment(new Date(journery_date)).subtract(2, 'years').calendar();
  let current_date = moment(new Date()).format('YYYY-MM-DD');
  let mindate = moment(mndate).format('YYYY-MM-DD');
  let maxdate = moment().format('YYYY-MM-DD');
  let input_date = moment(c.value).format('YYYY-MM-DD');

  if (moment(input_date).isAfter(mindate) && moment(input_date).isBefore(maxdate) && moment(input_date).isBefore(current_date)) { } else {
    return {
      validateInfantAge: {
        valid: false
      }
    };
  }
}

const youngerThanValidator = (maxAge: number): ValidatorFn => control =>
  (new Date()).getFullYear() - (new Date(control.value)).getFullYear() > maxAge ? { younger: true } : null;

function passissuecheck(c: FormControl) {

  let journery_date = $('#journery_date').val();

  let mndate = moment(journery_date).subtract(30, 'years').calendar();
  let mindate = moment(mndate).format('YYYY-MM-DD');
  let maxdate = moment().format('YYYY-MM-DD');
  let input_date = moment(c.value).format('YYYY-MM-DD');

  if (moment(input_date).isSameOrAfter(maxdate)) {
    return {
      validatePassportIssue: {
        valid: false
      }
    };
  }

}

function passportIssueWithDob(fcon: AbstractControl) {

  const passport_issue = fcon.value;
  const dob = fcon.get("traveller_dob1").value;

  let pass_date = moment(passport_issue).format('YYYY-MM-DD');

  let dob_date = moment(dob).format('YYYY-MM-DD');

  if (moment(pass_date).isAfter(dob_date)) {
    return {
      passportIssueWithDob: {
        valid: false
      }
    };

  }

}



function passexpcheck(c: FormControl) {

  let input_date = moment(c.value).format('YYYY-MM-DD');
  let maxdate = moment($('#journery_date').val()).format('YYYY-MM-DD');

  if (Date.parse(input_date) < Date.parse(maxdate)) {
    return {
      validatePassportExp: {
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
  selector: 'app-bus-checkout',
  templateUrl: './bus-checkout.component.html',
  styleUrls: ['./bus-checkout.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class BusCheckoutComponent implements OnInit, OnDestroy {
  savedCards: any = [];
  XSRFTOKEN: string;
  IsDcemiEligibleFlag: boolean = false;
  isFlexipayEligibleFlag: boolean = false;
  sendflexiFare: any;
  flexiIntrest: any;
  showFlexipay: any;
  flexipaysummry: any;
  flexiDiscount: any;
  partnerConvFee: number = 0;
  old_fare: number = 0;
  new_fare: number = 0;
  busSessionData: any;
    completedSteps = 1;
  passengerForm: FormGroup;
  loaderValue = 10;
  passengerFormCount: number = 1;
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
 domainPath: string;
 domainRedirect: string;
  emailInputMask = createMask({ alias: 'email' });
  saveTravellerId = []; saveChildTravellerId = []; saveInfantTravellerId = [];
  patternName = /^[a-zA-Z\s]*$/;
  patternAlphaNumeric = /^[a-zA-Z0-9]+$/;
  emailPattern = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
  maxTravellers: number;
  minNameLength: number;
  maxNameLength: number;
  minPassportLength: number;
  maxPassportLength: number;
  gstshow = false;
  gstSelected: boolean = false;
  cdnUrl: any;
  serviceSettings: any;
  flightClasses: any;
  whatsappFeature: number = 0;
  customerInfo: any;
  coupon_id: any;
  indexCoupon: any;
  coupon_name: any;
  coupon_code: any;
  remove_Coupon: any;
  coupon_amount: number = 0;
  vas_amount: number = 0;
  REWARD_CUSTOMERID: string= '0000';
  REWARD_EMAILID: string;
  REWARD_MOBILE: string;
  REWARD_CUSTOMERNAME: string;
  REWARD_TITLE: string;
  totalCollectibleAmount: any;
  totalCollectibleAmountFromPartnerResponse: any;
  totalCollectibleAmountFromPartnerResponseOrg: any;
  convenience_fee: number = 0;
  partnerToken: any;

  isTravellerExpanded: boolean = false;
  isGstExpanded: boolean = false;
  enablesavedTraveller: number = 0;
  enableGST: any;
  travellerlist: any;
  filterTravellerList: any;
  adultTravellerList: any;
  GSTList: any = [];
  GSTListLength: any;
  selectedGST: any = [];
  checkedGST: any = [];
  disableCheckbox: any = [];
  disableCheckboxInfant: any = [];
  selectedCheckbox: any = [];
  selectedCheckboxInfant: any = [];
  getGSTShow: Boolean = false;
  modalcheckedvalue: any = []; modalcheckedvalueInfant: any = [];
  gstmodalcheckedvalue: any = false;
  isCheckedGST: any = [];
  gstDetails: any;
  travellers = [];
  travllersArray = [];
  travllersArrayM = [];
  


  totalFareStr: string;
  countryJson: any;
  EMI_interest: number = 16;
  EMIAvailableLimit: number = 3000;
   convertpipe: any;
   passengerCount: any = [];
   seatResponse:any=[];
   searchBusKey: string;
 seacthResult: any = [];
 onward: any = [];
 totalBaseFare: number;
 totalFare: number = 0;
 intialTotalFare: number = 0;
 totalTax: number;
  
  sessionTimer: any = 3;

  AdtQuantity: number = 0;
  ChildQuantity: number = 0;
  InfantQuantity: number = 0;

  AdtBaseFare: number = 0;
  ChildBaseFare: number = 0;
  InfantBaseFare: number = 0;


 
  steps: any = 1;

  travelerDetails: any = {};
  checked: any = false;
  whatsAppCheck: boolean = true;
  gstNumber: any
  mobileNumber: any;
  showLoader: number = 1;
  serviceId: string = 'Flight';
  isMobile: boolean = true;
  isCollapseBasefare: boolean = false;
  isCollapseDiscount: boolean = false;
  isCollapseVas: boolean = false;
  isCollapse: boolean = false;
 patternNameLastName = /^\S[a-z A-Z]*$/;

  constructor(private _decimalPipe: DecimalPipe,private ref: ChangeDetectorRef, public _irctc: IrctcApiService, private _fb: FormBuilder, private _flightService: FlightService, private route: ActivatedRoute, private router: Router, private sg: SimpleGlobal, private appConfigService: AppConfigService, private EncrDecr: EncrDecrService, public rest: RestapiService, private modalService: NgbModal, @Inject(DOCUMENT) private document: any) {
    this.route.url.subscribe(url => {
      this.cdnUrl = environment.cdnUrl + this.sg['assetPath'];
      this.serviceSettings = this.appConfigService.getConfig();
      this.whatsappFeature = this.serviceSettings.whatsappFeature;
      this.enableGST = this.serviceSettings.enableSavedGST;
      this.enablesavedTraveller = this.serviceSettings.enablesavedTraveller;
      this.flightClasses = this.serviceSettings.flightClasses;

      this.getCountryList();
      this.resetPopups();
      this.getQueryParamData();
        this.searchBusKey = this.route.snapshot.queryParamMap.get('searchBusKey');
        this.seacthResult = JSON.parse(sessionStorage.getItem(this.searchBusKey));
      
      
      const jobGroup: FormGroup = new FormGroup({});
      this.passengerForm = jobGroup;
      jobGroup.addControl('saveTraveller', new FormControl(''));
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

      this.travllersArray = [];
      this.travllersArrayM = [];
      this.passengerFormCount = 1;

    });

  }
 fareData: any = [];
  ngOnInit(): void {
    this.route.url.subscribe(url => {
      this.resetPopups();
      this.steps = 1;
      this.isMobile = window.innerWidth < 991 ? true : false;
      if (this.isMobile) {
        this._flightService.showHeader(false);
      } else {
        this._flightService.showHeader(true);
      }

     this.searchBusKey = this.route.snapshot.queryParamMap.get('searchBusKey');

      /*** SESSION */
      sessionStorage.removeItem("coupon_amount");
      setTimeout(() => {
        //Check Laravel Seesion
        if (this.sg['customerInfo']) {
          this.customerInfo = this.sg['customerInfo'];
          if (sessionStorage.getItem("channel") == "payzapp") {
            var customerInfo = this.sg['customerInfo'];
            this.XSRFTOKEN = customerInfo["XSRF-TOKEN"];
            this.REWARD_CUSTOMERID = '0000';
            this.REWARD_EMAILID = '';
            this.REWARD_MOBILE = '';
            this.REWARD_CUSTOMERNAME = '';
          } else {
            var customerInfo = this.sg['customerInfo'];

            if (customerInfo["org_session"] == 1) {

              // console.log(customerInfo)
              if (customerInfo["guestLogin"] == true) {

                this.REWARD_CUSTOMERID = customerInfo["id"];
                this.XSRFTOKEN = customerInfo["XSRF-TOKEN"];
                this.IsDcemiEligibleFlag = true;
                this.isFlexipayEligibleFlag = true;
                this.enablesavedTraveller = 0;
              } else {
                
                var lengthofboarding = this.seacthResult.busdetails.boardingTimes.length;
                var lengthofDropping = this.seacthResult.busdetails.droppingTimes.length;
                
                console.log(this.seacthResult );
                
                var fares = this.seacthResult.seatdetails;
                this.maxTravellers= Number(fares.length);
                 for (var i = 0; i <this.maxTravellers; i++) {
                  //this.addTraveller(-1, -1);
                 }
                
              if (!this.seacthResult) {
                  setTimeout(() => {
                    $("#bookingprocessFailed1").modal('show');
                  }, 10);
                } else {
                 
                if (this.seacthResult != null) {
                this.onward = this.seacthResult.busdetails;
                var fares = this.seacthResult.seatdetails;
                this.seatResponse=this.seacthResult.seatResponse;
                var fareDetail = this.onward.fareDetails;
                var totalBaseFare = 0;
                var totalFare = 0;
                var totalTax = 0;
                var totalbookingFee = 0;
                this.passengerCount = fares.length;
                for (let calcbooking of fareDetail) {
                totalbookingFee = totalbookingFee + calcbooking.bookingFee;
                }

                for (let fare of fares) {
                totalBaseFare = totalBaseFare + fare.baseFare;
                totalFare = totalFare + fare.fare;
                totalTax = totalTax + fare.markupFareAbsolute + fare.serviceTaxAbsolute;
                }
                this.fareData = {
                totalBaseFare: totalBaseFare,
                totalFare: totalFare+totalbookingFee,
                totalTax: totalTax,
                data: fares,
                totalbookingFee: totalbookingFee
                }

                this.totalFare = Number(totalFare) + Number(totalbookingFee);
                this.intialTotalFare = Number(totalFare) + Number(totalbookingFee);
                this.convertpipe = this._decimalPipe.transform(this.totalFare, '1.2');
                this.totalFareStr = String(this.convertpipe.replace(/,/g, ""));

                this.domainRedirect = environment.MAIN_SITE_URL +this.sg['domainPath']+ this.domainPath; 
                if(this.sg['domainPath'] != ''){
                this.domainRedirect =  environment.MAIN_SITE_URL +this.domainPath;
                }
                } else {
                this.router.navigate(['/'+this.sg['domainPath'], 'bus']);
                }


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
                if (this.serviceSettings.PAYSETTINGS[this.sg['domainName']][this.serviceId].DEBIT_EMI == 1) {
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


                  // this.savedCards = data;
                });

                //check flexipay eligible
                if (this.serviceSettings.PAYSETTINGS[this.sg['domainName']][this.serviceId].FLEXI_PAY == 1) {
                  var eligibleparam = {
                    'mobile': customerInfo["mobile"]
                  }
                  var postEligibleParam = {
                    postData: this.EncrDecr.set(JSON.stringify(eligibleparam))
                  };
                  this.rest.isFlexiPayEligible(postEligibleParam).subscribe(results => {

                    let resp = JSON.parse(this.EncrDecr.get(results.result));
                    if (resp == null || resp == undefined || resp == false) {
                      this.isFlexipayEligibleFlag = false;
                    } else
                      this.isFlexipayEligibleFlag = resp.status;

                  })
                }
                if (this.enablesavedTraveller == 1) {
                  this.checksavedtraveller();
                }
                if (this.enableGST == 1) {
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
        } else {
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
        this.searchBusKey = params.searchFlightKey
        sessionStorage.getItem(this.searchBusKey);
      });
  }




  clickPassenger($event, passenger, checkboxIndex) {
    if ($event.target.checked) {
        this.addTraveller(passenger, checkboxIndex);
     
    } else {
        this.currentId = $('#passengerBoxId_' + checkboxIndex).val();
        this.removeTraveller(parseInt(this.currentId), checkboxIndex);
     
    }
  }


  manualTraveller(type) {
    this.addTraveller(-1, -1);
  }

  manualMobileTraveller(type) {
    this.addTraveller(-1, -1);
    $('#addTraveller_mlite').modal('show');
  }

 

  validateMliteForm(type, traveller) {
    this.passengerForm.markAllAsTouched();

      if (this.passengerForm.controls['traveller_title' + traveller]['status'] == 'VALID' && this.passengerForm.controls['traveller_first_name' + traveller]['status'] == 'VALID' && this.passengerForm.controls['traveller_last_name' + traveller]['status'] == 'VALID' && this.passengerForm.controls['traveller_dob' + traveller]['status'] == 'VALID') {
        $('#addTraveller_mlite').modal('hide');
      }

  }

  removeMobile(val, checkboxIndex) {
    this.removeTraveller(val, checkboxIndex);
    $('#addTraveller_mlite').modal('hide');
  }
  

  addTraveller(passenger, checkboxIndex) {

    if ((this.travllersArray.length) < (this.maxTravellers)) {
      this.travellers.push(this.travllersArray.length);
      this.travllersArray.push(this.passengerFormCount);

      if (checkboxIndex == -1)
        this.travllersArrayM.push(this.passengerFormCount);

      var i = Number(this.passengerFormCount);

      if (checkboxIndex != -1)
        this.saveTravellerId[checkboxIndex] = i;

      var title = ""; var traveller_first_name = ""; var traveller_last_name = ""; let traveller_dob: any;

      let traveller_passport: any;
      let traveller_passport_expiry_date: any;
      let traveller_passport_issue_date: any;
      var traveller_passport_issuing_country = '';
      var traveller_pax_nationality = '';
      var traveller_pax_birthcountry = '';


      if (checkboxIndex != -1) {
        title = passenger.title;
        traveller_first_name = passenger.firstName;
        traveller_last_name = passenger.lastName;



        if (passenger.dateOfBirth) {
          const values = passenger.dateOfBirth.split('/');
          const year = +values[2];
          const month = +values[1] - 1;
          const date = +values[0];
          traveller_dob = new Date(year, month, date);
        } else {
          traveller_dob = '';
        }

        traveller_passport = passenger.passportNumber ? passenger.passportNumber : '';
        traveller_passport_issuing_country = passenger.passportIssueCountry ? passenger.passportIssueCountry : '';
        traveller_pax_nationality = passenger.paxNationality ? passenger.paxNationality : '';
        traveller_pax_birthcountry = passenger.paxBirthCountry ? passenger.paxBirthCountry : '';

        if (passenger.passportExpiryDate) {
          const values1 = passenger.passportExpiryDate.split('/');
          const year1 = +values1[2];
          const month1 = +values1[1] - 1;
          const date1 = +values1[0];
          traveller_passport_expiry_date = new Date(year1, month1, date1);
        } else {
          traveller_passport_expiry_date = '';
        }



        if (passenger.passportIssueDate) {
          const values2 = passenger.passportIssueDate.split('/');
          const year2 = +values2[2];
          const month2 = +values2[1] - 1;
          const date2 = +values2[0];
          traveller_passport_issue_date = new Date(year2, month2, date2);
        } else {
          traveller_passport_issue_date = '';
        }

      }

      this.passengerForm.addControl('traveller_title' + i, new FormControl(title, [Validators.required, Validators.minLength(2), Validators.maxLength(15)]));
      this.passengerForm.addControl('traveller_first_name' + i, new FormControl(traveller_first_name, [Validators.required, Validators.pattern(this.patternName), Validators.minLength(2), Validators.maxLength(26)]));
      this.passengerForm.addControl('traveller_last_name' + i, new FormControl(traveller_last_name, [Validators.required, Validators.pattern(this.patternName), Validators.minLength(2), Validators.maxLength(26)]));
      this.passengerForm.addControl('traveller_dob' + i, new FormControl(traveller_dob,
        [Validators.required, validateAdultAge, youngerThanValidator(100)]));




      this.passengerForm.controls['passengerMobile'].setValidators([Validators.required, Validators.pattern("^[6-9][0-9]{9}$"), Validators.minLength(10)]);
      this.passengerForm.controls['passengerEmail'].setValidators([Validators.required, Validators.pattern(this.emailPattern)]);
      this.passengerForm.controls['passengerMobile'].updateValueAndValidity();
      this.passengerForm.controls['passengerEmail'].updateValueAndValidity();



      this.passengerFormCount++;

      if (checkboxIndex != -1) {
        $('#travelPassenger_' + checkboxIndex).prop('checked', true);
        $('#passengerBox_' + checkboxIndex).removeClass('hide');

      }
    } else {
      if (checkboxIndex != -1) {
        $('#passengerBox_' + checkboxIndex).addClass('hide');
        $('#travelPassenger_' + checkboxIndex).prop('checked', false);
      }

    }


  }

  removeTraveller(val, checkboxIndex) {

    var passengerName = this.passengerForm.controls['traveller_first_name' + val]['value'];
    const index = this.travllersArray.indexOf(val, 0);
    if (checkboxIndex != -1)
      $('#passengerBox_' + checkboxIndex).addClass('hide');
    if (index > -1) {
      this.travllersArray.splice(index, 1);
    }

    if (checkboxIndex == -1) {
      const index1 = this.travllersArrayM.indexOf(val, 0);
      if (index1 > -1) {
        this.travllersArrayM.splice(index1, 1);
      }
    }


    if (this.travellerlist.length > 0) {
      var trvList = [];
      for (let i of this.travellerlist) {
        var trvlist = i;
        var combineName = trvlist.firstName;
        trvList.push({ name: combineName });
      }
      for (var index1 in trvList) {
        var fullName = trvList[index1]['name'];
        if (fullName == passengerName) {
          this.disableCheckbox[index1] = true;
          this.modalcheckedvalue[index1] = false;
          this.selectedCheckbox.splice(index1, 1);
          break;
        }
      }
    }
    this.passengerFormCount--;
    this.passengerForm.removeControl('traveller_title' + val);
    this.passengerForm.removeControl('traveller_dob' + val);
    this.passengerForm.removeControl('traveller_first_name' + val);
    this.passengerForm.removeControl('traveller_last_name' + val);


    this.passengerForm.clearValidators();
    this.passengerForm.updateValueAndValidity();
    this.travellers.splice(val, 1);

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
  checksavedtraveller() {
    let checksavedtravConfig = this.serviceSettings.enablesavedTraveller
    if (checksavedtravConfig == 1) {
      var requestParams = {
        'customerId': this.REWARD_CUSTOMERID
      };

      var postsavedTravellers = {
        postData: this.EncrDecr.set(JSON.stringify(requestParams))
      };

      this.rest.getCustomertravellerInfo(postsavedTravellers).subscribe(response => {
        // let respData = JSON.parse(this.EncrDecr.get(response.result ));
        let resp = response['errorcode'];
        if (response['errorcode'] == 0) {

          if (response['value'].length > 0) {
            response['value'] = response['value'].sort(function (a, b) {
              var x = a['age']; var y = b['age'];
              return ((x > y) ? -1 : ((x < y) ? 1 : 0));
            });
          }
          this.travellerlist = response['value'];


          this.filterTravellerList = this.travellerlist.filter(function (tra) {
            return tra.age > 1;
          });

          this.adultTravellerList = this.filterTravellerList.filter(function (tra) {
            return tra.age>0
          });



          for (let i = 0; i < this.travellerlist.length; i++) {

            if (this.filterTravellerList[i]) {
                this.saveTravellerId[this.filterTravellerList[i].id] = -1
            }
          }


        }
      }), (err: HttpErrorResponse) => {
        console.log('Something went wrong !');

      }
    }
  }

  gstNumberCheck(event) {
    let inputVal: string = event.target.value;
    var characterReg = /^([0]{1}[1-9]{1}|[1]{1}[0-9]{1}|[2]{1}[0-7]{1}|[2]{1}[9]{1}|[3]{1}[0-7]{1})[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}[a-zA-Z0-9]{3}$/;
    // console.log(characterReg.test(inputVal));
    if (characterReg.test(inputVal)) {
      this.gstshow = true;
      this.gstSelected = true;
    } else {
      this.gstshow = false;
      this.gstSelected = false;
    }

  }

  getCustomerGstDetails() {
    if (this.enableGST == 1) {
      var requestParams = {
        'customerId': this.REWARD_CUSTOMERID
      };
      var requestParamsEncrpt = {
        postData: this.EncrDecr.set(JSON.stringify(requestParams))
      };
      this.rest.getCustomerGstDetails(requestParamsEncrpt).subscribe(response => {
        // let respData = JSON.parse(this.EncrDecr.get(response.result ));
        if (response['errorcode'] == 0) {

          if (response['value'].length > 0) {
            response['value'] = response['value'].sort(function (a, b) {
              var x = a['id']; var y = b['id'];
              return ((x > y) ? -1 : ((x < y) ? 1 : 0));
            });
          }

          this.GSTList = response['value'];
          this.GSTListLength = this.GSTList.length;
          if (this.GSTListLength > 0) {
            this.getGSTShow = true;
          } else {
            this.getGSTShow = false;
          }
        }
      });
    } else {
      this.getGSTShow = false;
    }
    for (let i = 0; i < this.GSTListLength; i++) {
      this.isCheckedGST[i] = false;
    }
  }
  fillupGSTDetailOnCheck($event, data, GSTIndex) {


    this.gstshow = true;
    this.gstSelected = true;



    if ($event.target.checked) {
      this.selectedGST.push(GSTIndex);
      this.checkedGST.push({
        "gstNumber": data.gstNumber,
        "gstName": data.gstName,
        "address": data.address,
        "pinCode": data.pinCode,
        "city": data.city,
        "state": data.state,
      });
      var checkedGSTLength = this.checkedGST.length;

      this.passengerForm['controls']['gstNumber'].setValue(this.checkedGST[checkedGSTLength - 1].gstNumber);
      this.passengerForm['controls']['gstBusinessName'].setValue(this.checkedGST[checkedGSTLength - 1].gstName);
      this.passengerForm['controls']['gstAddress'].setValue(this.checkedGST[checkedGSTLength - 1].address);
      this.passengerForm['controls']['gstPincode'].setValue(this.checkedGST[checkedGSTLength - 1].pinCode);
      this.passengerForm['controls']['gstCity'].setValue(this.checkedGST[checkedGSTLength - 1].city);
      this.passengerForm['controls']['gstState'].setValue(this.checkedGST[checkedGSTLength - 1].state);
      this.isCheckedGST[GSTIndex] = true;
    } else {
      this.selectedGST.pop(GSTIndex);
      this.isCheckedGST[GSTIndex] = false;
      this.checkedGST.pop({
        "gstNumber": data.gstNumber,
        "gstName": data.gstName,
        "address": data.address,
        "pinCode": data.pinCode,
        "city": data.city,
        "state": data.state,
      });
      if (this.passengerForm.controls['gstNumber'].value == data.gstNumber) {
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
  saveTravellerFunc() {
    var saveTravellerArray: any = [];
    var ii = 1;

    if (this.travllersArray.length > 0) {
      for (let i of this.travllersArray) {

        var checksaveTraveller;
        if (this.passengerForm.controls['saveTraveller']['value'] == true) {
          checksaveTraveller = 1;
        } else {
          checksaveTraveller = 0;
        }

        if (checksaveTraveller == 1) {
          var gender;
          if (this.passengerForm.controls['passengerGender' + i]['value'] == "Male") {
            gender = 'M';
          } else if (this.passengerForm.controls['passengerGender' + i]['value'] == "Female") {
            gender = 'F';
          } else {
            gender = this.passengerForm.controls['passengerGender' + i]['value'];
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

  


    if (this.enablesavedTraveller == 1 && saveTravellerArray.length > 0) {
      var requestParamsEncrpt = {
        postData: this.EncrDecr.set(JSON.stringify(saveTravellerArray))
      };
      this.rest.saveCustomertravellerInfo(requestParamsEncrpt).subscribe(response => {
      })
    }
  }


  saveCustomerGst() {
    if (this.passengerForm['controls']['saveGST'].value == true) {
      var saveGSTArray: any = [];
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
        postData: this.EncrDecr.set(JSON.stringify(saveGSTArray))
      };
      this.rest.saveCustomerGstDetails(requestParamsEncrpt).subscribe(response => {
        // console.log(response);
      })
    }
  }


  expandItemsTraveller() {
    if (this.isTravellerExpanded == false) {
      this.isTravellerExpanded = true;
    } else if (this.isTravellerExpanded == true) {
      this.isTravellerExpanded = false;
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

    if (e.action == 'done') {

      $('#bookingprocessExpires').modal('show');
    }



  }


  getCountryList() {
    this._flightService.getCountryList().subscribe((res: any) => {
      this.countryJson = res.partnerResponse.countryList;
    })
  }


  calculateEMI(amount: number) {
    return Math.round((amount + (amount * (this.EMI_interest / 100))) / 12);
  }





  triggerBack() {


  }

   resetPopups(){
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

  goBack() {
    this.resetPopups();
    this.router.navigateByUrl('/');


  }

  ngOnDestroy(): void {
    this.resetPopups();
    if (this.sessionTimer) {
      clearInterval(this.sessionTimer);
    }
  }


  // get rendom string value
  getRandomString(length: any) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }




  paxInfo = []; 
  contactDatails: any;
  continueWithNewFareInterval: any;


  continueTravellerDetails() {
      this.gotoTop();
    this.steps = 2;
    this.completedSteps = 2;
 
  }
orderReferenceNumber:any;
 
  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
  gstReset() {
    $("input[type=radio][name=GSTList]").prop('checked', false);
    for (let i = 0; i < this.GSTListLength; i++) {
      this.isCheckedGST[i] = false;
    }

    this.passengerForm['controls']['gstNumber'].setValue('');
    this.passengerForm['controls']['gstBusinessName'].setValue('');
    this.passengerForm['controls']['gstAddress'].setValue('');
    this.passengerForm['controls']['gstPincode'].setValue('');
    this.passengerForm['controls']['gstCity'].setValue('');
    this.passengerForm['controls']['gstState'].setValue('');
  }


  moveTab(page) {
    this.gotoTop();
    if(page<5){
    //this.totalCollectibleAmount=this.totalCollectibleAmount-this.coupon_amount;
    this.coupon_amount=0;
    }

    if(page<4){
    //  this.totalCollectibleAmount=this.totalCollectibleAmount-this.partnerConvFee;
    this.partnerConvFee=0;
    }

    if (page <= this.completedSteps) {
      this.steps = page;
      this.completedSteps = page;
    }
  }



  reciveflexiAmount(values) {
    this.showFlexipay = true;
    if (values[0].key == 15) {
      this.flexipaysummry = true;
      this.flexiDiscount = Number(values[0].value);
      this.totalCollectibleAmount = (Number(this.totalCollectibleAmountFromPartnerResponse) ) - Number(this.coupon_amount) - Number(this.flexiDiscount);
      this.sendflexiFare = (Number(this.totalCollectibleAmountFromPartnerResponse) ) - Number(this.coupon_amount);
      // console.log(this.sendflexiFare)
      sessionStorage.setItem(this.searchBusKey + '-totalFare', String(this.totalCollectibleAmount));
    } else if (values[0].key !== 15) {
      this.flexipaysummry = false;
      this.flexiDiscount = 0;
      this.flexiIntrest = Number(values[0].value);
      this.flexiDiscount = 0;
      this.totalCollectibleAmount = (Number(this.totalCollectibleAmountFromPartnerResponse) ) - Number(this.coupon_amount);
      this.sendflexiFare = this.totalCollectibleAmount;
      sessionStorage.setItem(this.searchBusKey + '-totalFare', String(this.totalCollectibleAmount));
    }
  }

  recivetotalFare($event) {
    this.flexipaysummry = false;
    this.flexiDiscount = 0;
    this.totalCollectibleAmount = (Number(this.totalCollectibleAmountFromPartnerResponse) ) - Number(this.coupon_amount);

  }

  /***----- APPLY COUPON (--parent--) ------***/
  receiveCouponDetails($event) {

    if ($event.type == 0) {
      this.indexCoupon = $event.couponOptions;
      this.coupon_id = this.indexCoupon.coupon_id;
      this.coupon_name = this.indexCoupon.coupon_name;
      this.coupon_code = this.indexCoupon.coupon_code;
      this.coupon_amount = this.indexCoupon.coupon_amount;
      this.totalCollectibleAmount = Number(this.totalCollectibleAmountFromPartnerResponse) - (Number(this.coupon_amount));
      this.sendflexiFare = (Number(this.totalCollectibleAmountFromPartnerResponse) ) - (Number(this.coupon_amount));
      sessionStorage.setItem(this.searchBusKey + '-totalFare', String(this.totalCollectibleAmount));
    } else {
      this.coupon_id = '';
      this.coupon_name = '';
      this.coupon_code = '';
      this.coupon_amount = 0;
      this.totalCollectibleAmount = Number(this.totalCollectibleAmountFromPartnerResponse) - (Number(this.coupon_amount));
      this.sendflexiFare = (Number(this.totalCollectibleAmountFromPartnerResponse) ) - (Number(this.coupon_amount));
      sessionStorage.setItem(this.searchBusKey + '-totalFare', String(this.totalCollectibleAmount));
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
    sessionStorage.setItem(this.searchBusKey + '-totalFare', String(this.totalCollectibleAmount));
  }

  isCollapseShow(identifyCollpase) {

    if (identifyCollpase == 'BaseFare') {
      this.isCollapseBasefare = !this.isCollapseBasefare;
    } else if (identifyCollpase == 'vas') {
      this.isCollapseVas = !this.isCollapseVas;
    } else if (identifyCollpase == 'discount') {
      this.isCollapseDiscount = !this.isCollapseDiscount;
    } else {
      this.isCollapse = !this.isCollapse;
    }

  }


}
