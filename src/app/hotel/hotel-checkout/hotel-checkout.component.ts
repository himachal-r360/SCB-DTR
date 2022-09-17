import { Component, OnInit, OnDestroy, NgModule, ChangeDetectorRef, ElementRef, Inject, ɵConsole, Input, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
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
import { NgxSpinnerService } from "ngx-spinner";
import { APP_CONFIG, AppConfig } from '../../configs/app.config';
import { CommonHelper } from 'src/app/shared/utils/common-helper';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { MatDialogModule, MatDialogActions } from '@angular/material/dialog';
import { parse } from 'path';
declare let alertify: any;
declare var $: any;
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

@Component({
  selector: 'app-hotel-checkout',
  templateUrl: './hotel-checkout.component.html',
  styleUrls: ['./hotel-checkout.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class HotelCheckoutComponent implements OnInit, OnDestroy {
        partnerToken: any;
        selectedHotel:any=[];
        hotelData:any=[];
        searchData:any=[];
        isMobile: boolean = true;
        completedSteps = 1;
        steps = 1;
        sessionTimer: any = 3;
        serviceId: string = 'RedBus';
        pgCharges: number = 0;
        errorMsg: any;
        cdnUrl: any;
        gstshow = false;
        convertpipe: any;
        getGSTShow: Boolean = false;
        searchArray: any = [];
        ctype: string = 'redbus';
        searchHotelKey: string;
        searchResult: any = [];
        totalBaseFare: number;
        totalFare: number = 0;
        intialTotalFare: number = 0;
        totalTax: number;
        partnerDiscount:number;
        assetPath: string;
        passengerCount: any = [];
        passengerForm: FormGroup;
        submitted = false;
        success = false;
        passengerData: any = [];
        passengerContactData: any = [];
        gstDetails: any = [];
        itineraryParam: any = [];
        orderReferenceNumber: string;
        convenience_fee: number = 0;
        REWARD_CUSTOMERID: string;
        REWARD_EMAILID: string;
        REWARD_MOBILE: string;
        REWARD_FIRSTNAME: string;
        REWARD_LASTNAME: string;
        fareData: any = [];
        savedCards: any = [];
        whatsappFeature: number = 0;
        gstSelected: boolean = false;
        appConfig: any;
        domainPath: string;
        domainRedirect: string;
        XSRFTOKEN: string;
        IsDcemiEligibleFlag: boolean = false;
        enableGST: any; enablesavedTraveller: number = 0;
        showFlexipay: any;
        flexipaysummry: any;
        flexiDiscount: any;
        flexiIntrest: any;
        isFlexipayEligibleFlag: boolean = false;
        serviceSettings: any;
        activecheckbox: boolean = true;
        sendflexiFare: any;
        customerInfo: any;
        domainName: any;
        isExpanded: boolean = false;
        isGstExpanded: boolean = false;
        isCollapseBasefare: boolean = false;
        isCollapseDiscount: boolean = false;
        isCollapseVas: boolean = false;
        isCollapse: boolean = false;
        passengerSelectedArray:any={};
        totalAdult:number = 0;
        totalChild:number = 0;

  constructor(private el: ElementRef,public _irctc: IrctcApiService,private _flightService: FlightService, @Inject(APP_CONFIG) appConfig: any, public rest: RestapiService, private EncrDecr: EncrDecrService, private http: HttpClient, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute,
    private sg: SimpleGlobal, @Inject(DOCUMENT) private document: any, public commonHelper: CommonHelper, private location: Location, private dialog: MatDialog,  private router: Router, private _decimalPipe: DecimalPipe, private spinnerService: NgxSpinnerService, private titleService: Title, private appConfigService: AppConfigService, private modalService: NgbModal) {

    this.serviceSettings = this.appConfigService.getConfig();
    if (this.serviceSettings.DOMAIN_SETTINGS[this.sg['domainName']]['HOTEL'] != 1) {
      this.router.navigate(['/**']);
    }
    this.domainName = this.sg['domainName'];
    this.assetPath = this.sg['assetPath'];
    this.appConfig = appConfig;
    this.domainPath = this.sg['domainPath'];
    this.cdnUrl = environment.cdnUrl + this.sg['assetPath'];
    this.whatsappFeature = this.serviceSettings.whatsappFeature;
    this.enableGST = this.serviceSettings.enableSavedGST;
    this.enablesavedTraveller = this.serviceSettings.enablesavedTraveller;
    this.partnerToken = 'Redbus';
    alertify.set('notifier', 'position', 'bottom-center');
  }
  loaderValue = 10;
  public Button_loading: any = 'Processing...';
  public buttonstatus: boolean = false;
  public buttonLoading: boolean = false;
  coupon_id: any;
  indexCoupon: any;
  coupon_name: any; coupon_code: any; remove_Coupon: any;
  send_RemoveCouponDetail: any;
  coupon_amount: number = 0;
  continueStatus: boolean = false;
  patternName = /^\S[a-z A-Z]+$/;
  emailPattern = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
  patternNameLastName = /^\S[a-z A-Z]*$/;
  AvoidSpace($event) {
    var keycode = $event.which;
    if (keycode == 32)
      event.preventDefault();
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
    if ((keycode >= 33 && keycode <= 47) || (keycode >= 91 && keycode <= 96) ||
      (keycode >= 48 && keycode <= 64) || (keycode == 8377) || (keycode >= 123 && keycode <= 126)) {
      event.preventDefault();
    }
  }
  /*special char & rupee symbol ( Rs.)*/
  specialcharInput($event) {
    var keycode = $event.which;
    if ((keycode >= 33 && keycode <= 47) || (keycode >= 91 && keycode <= 96) || (keycode >= 60 && keycode <= 64) ||
      (keycode >= 123 && keycode <= 126) || (keycode == 8377) || (keycode == 8364) || (keycode == 128) || (keycode == 163) ||
      (keycode == 165)) {
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
  //flexipay calculation

  reciveflexiAmount(values) {
    this.showFlexipay = true;
    if (values[0].key == 15) {
      this.flexipaysummry = true;
      this.flexiDiscount = Number(values[0].value);
      this.totalFare = (Number(this.intialTotalFare) + Number(this.convenience_fee)) - Number(this.coupon_amount) - Number(this.flexiDiscount);
      this.sendflexiFare = (Number(this.intialTotalFare) + Number(this.convenience_fee)) - Number(this.coupon_amount);
      // console.log(this.sendflexiFare)
      //sessionStorage.setItem(this.searchTrainKey + '-totalFare', String(this.totalCollectibleAmount));
    } else if (values[0].key !== 15) {
      this.flexipaysummry = false;
      this.flexiDiscount = 0;
      this.flexiIntrest = Number(values[0].value);
      this.flexiDiscount = 0;
      this.totalFare = (Number(this.intialTotalFare) + Number(this.convenience_fee)) - Number(this.coupon_amount);
      this.sendflexiFare = this.totalFare;
      //sessionStorage.setItem(this.searchTrainKey + '-totalFare', String(this.totalCollectibleAmount));
    }
  }

  ngOnDestroy(): void {
    this.resetPopups();
    if (this.sessionTimer) {
      clearInterval(this.sessionTimer);
    }
  }
  recivetotalFare($event) {
    this.flexipaysummry = false;
    this.flexiDiscount = 0;
    this.totalFare = (Number(this.intialTotalFare) + Number(this.convenience_fee)) - Number(this.coupon_amount);

  }
  /***----- APPLY COUPON (--parent--) ------***/
  receiveCouponDetails($event) {
    if ($event.type == 0) {
      this.indexCoupon = $event.couponOptions;
      this.coupon_id = this.indexCoupon.coupon_id;
      this.coupon_name = this.indexCoupon.coupon_name;
      this.coupon_code = this.indexCoupon.coupon_code;
      this.coupon_amount = this.indexCoupon.coupon_amount;
      // this.coupon_amount = 200;
      if (this.flexiDiscount == undefined) this.flexiDiscount = 0;

      this.totalFare = (Number(this.intialTotalFare) + Number(this.convenience_fee)) - (Number(this.coupon_amount) + Number(this.flexiDiscount));
      this.sendflexiFare = (Number(this.intialTotalFare) + Number(this.convenience_fee)) - (Number(this.coupon_amount));
      this.createItinerarydata();
      sessionStorage.setItem(this.searchHotelKey + '-passData', this.EncrDecr.set(JSON.stringify(this.hotelData)));
      sessionStorage.setItem(this.searchHotelKey + '-totalFare', String(this.totalFare));
    } else {
      this.coupon_id = '';
      this.coupon_name = '';
      this.coupon_code = '';
      this.coupon_amount = 0;
      if (this.flexiDiscount == undefined) this.flexiDiscount = 0;
      this.totalFare = (Number(this.intialTotalFare) + Number(this.convenience_fee)) - (Number(this.coupon_amount) + Number(this.flexiDiscount));
      this.sendflexiFare = (Number(this.intialTotalFare) + Number(this.convenience_fee)) - (Number(this.coupon_amount));
      this.createItinerarydata();
      sessionStorage.setItem(this.searchHotelKey + '-passData', this.EncrDecr.set(JSON.stringify(this.hotelData)));
      sessionStorage.setItem(this.searchHotelKey + '-totalFare', String(this.totalFare));
    }
  }

  /**----------REMOVE COUPON----------**/
  removeCoupon(coupon_id, coupon_amount) {
    this.coupon_id = '';
    this.coupon_name = '';
    this.coupon_code = '';
    this.coupon_amount = 0;
    this.totalFare = (Number(this.intialTotalFare) + Number(this.convenience_fee)) - Number(this.coupon_amount);
    this.createItinerarydata();
    this.sendflexiFare = (Number(this.intialTotalFare) + Number(this.convenience_fee)) - (Number(this.coupon_amount));
    sessionStorage.setItem(this.searchHotelKey + '-passData', this.EncrDecr.set(JSON.stringify(this.hotelData)));
    sessionStorage.setItem(this.searchHotelKey + '-totalFare', String(this.totalFare));
  }





  ngOnInit() {
    this.titleService.setTitle('Home | Hotels');

    this.activatedRoute.url.subscribe(url => {
      this.resetPopups();
      this.steps = 1;
      this.isMobile = window.innerWidth < 991 ? true : false;
      if (this.isMobile) {
        this._flightService.showHeader(false);
      } else {
        this._flightService.showHeader(true);
      }

      setTimeout(() => {
        //Check Laravel Seesion
        if (this.sg['customerInfo']) {
          if (sessionStorage.getItem("channel") == "payzapp") {
            var customerInfo = this.sg['customerInfo'];
            this.customerInfo = customerInfo;
            this.XSRFTOKEN = customerInfo["XSRF-TOKEN"];
            this.REWARD_CUSTOMERID = '0000';
            this.REWARD_EMAILID = '';
            this.REWARD_MOBILE = '';
            this.REWARD_FIRSTNAME = '';
            this.REWARD_LASTNAME = '';
          } else {
            var customerInfo = this.sg['customerInfo'];
            if (customerInfo["org_session"] == 1) {
              this.customerInfo = customerInfo;

              if (customerInfo["guestLogin"] == true) {
                this.REWARD_CUSTOMERID = customerInfo["id"];
                this.XSRFTOKEN = customerInfo["XSRF-TOKEN"];
                this.IsDcemiEligibleFlag = true;
                this.isFlexipayEligibleFlag = true;
                this.enablesavedTraveller = 0;
              } else {
                this.REWARD_CUSTOMERID = customerInfo["id"];
                this.REWARD_EMAILID = customerInfo["email"];
                this.REWARD_MOBILE = customerInfo["mobile"];
                this.REWARD_FIRSTNAME = customerInfo["firstname"];
                this.REWARD_LASTNAME = customerInfo["lastname"];
                this.XSRFTOKEN = customerInfo["XSRF-TOKEN"];
          
                if (this.enableGST == 1) {
                  this.getCustomerGstDetails();
                }
                  this.passengerForm.patchValue({
                    passengerFirstName: customerInfo["firstname"],
                    passengerLastName: customerInfo["lastname"]
                  });
                this.passengerForm.patchValue({
                  passengerMobile: customerInfo["mobile"],
                  passengerEmail: customerInfo["email"]
                });
                if (this.serviceSettings.PAYSETTINGS[this.sg['domainName']][this.serviceId].DEBIT_EMI == 1) {
                  //Check Dc Emi Eligible
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
              }
            } else {
              this.REWARD_CUSTOMERID = '0000';
              this.REWARD_EMAILID = '';
              this.REWARD_MOBILE = '';
              this.REWARD_FIRSTNAME = '';
              this.REWARD_LASTNAME = '';
              this.XSRFTOKEN = 'NULL';
              if (environment.localInstance == 0) {
                this.document.location.href = environment.MAIN_SITE_URL + this.sg['domainPath'] + 'check-login';
              }
            }

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
                  //  let resp = result;
                  this.isFlexipayEligibleFlag = resp.status;
              })
            }
          }

        } else {
          this.REWARD_CUSTOMERID = '0000';
          this.REWARD_EMAILID = '';
          this.REWARD_MOBILE = '';
          this.REWARD_FIRSTNAME = '';
          this.REWARD_LASTNAME = '';
          this.XSRFTOKEN = 'NULL';
          if (environment.localInstance == 0) {
            this.document.location.href = environment.MAIN_SITE_URL + this.sg['domainPath'] + 'check-login';
          }
        }

      }, 50);

      this.loaderValue = 10;
      const myInterval3 = setInterval(() => {
        this.loaderValue = this.loaderValue + 10;

        if (this.loaderValue == 110) {
          this.loaderValue = 10;
        }
      }, 600);
      //Auth verify ends here
      $("#infoprocess").modal('show');
      setTimeout(() => {
        $('#infoprocess').modal('hide');
      }, 2000);

      sessionStorage.removeItem("coupon_amount");
      const jobGroup: FormGroup = new FormGroup({});
      this.searchHotelKey = this.activatedRoute.snapshot.queryParamMap.get('searchHotelKey');
      this.searchResult = JSON.parse(sessionStorage.getItem(this.searchHotelKey));

        if(!this.searchResult){
        this.router.navigate(['/compare-stay']);
        }
        
        this.searchData=this.searchResult.queryHotelData;
        this.searchData.rooms.forEach((z)=>{
        this.totalAdult += parseInt(z.numberOfAdults);
        this.totalChild += parseInt(z.numberOfChildren);
        })
      
        this.selectedHotel=this.searchResult.selectedHotel;
   
        
        this.totalFare = Number(this.selectedHotel.rateBreakdown.total);
        this.intialTotalFare = Number(this.selectedHotel.rateBreakdown.total);
       
        this.totalBaseFare = Number(this.selectedHotel.rateBreakdown.baseFare);
        this.totalTax = Number(this.selectedHotel.rateBreakdown.tax);
         this.partnerDiscount = Number(this.selectedHotel.rateBreakdown.partnerDiscount);
        
         console.log(this.searchResult);

      if (this.searchResult != null) {
        jobGroup.addControl('passengerId' , new FormControl());
        jobGroup.addControl('passengerTitle', new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]));
        jobGroup.addControl('passengerFirstName', new FormControl('', [Validators.required, Validators.pattern(this.patternName), Validators.minLength(2), Validators.maxLength(26)]));
        jobGroup.addControl('passengerLastName', new FormControl('', [Validators.required, Validators.pattern(this.patternName), Validators.minLength(2), Validators.maxLength(26)]));
        jobGroup.addControl('passengerMobile', new FormControl(this.REWARD_MOBILE, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10)]));
        jobGroup.addControl('passengerEmail', new FormControl(this.REWARD_EMAILID, [Validators.required, Validators.pattern(this.emailPattern)]));
        jobGroup.addControl('passengerAgree', new FormControl('', [Validators.required, Validators.pattern('true')]));

        jobGroup.addControl('whatsappFlag', new FormControl('1'));
        jobGroup.addControl('gstNumber', new FormControl(''));
        jobGroup.addControl('gstBusinessName', new FormControl(''));
        jobGroup.addControl('gstAddress', new FormControl(''));
        jobGroup.addControl('gstCity', new FormControl(''));
        jobGroup.addControl('gstPincode', new FormControl(''));
        jobGroup.addControl('gstState', new FormControl(''));
        jobGroup.addControl('saveGST', new FormControl('1'));

        this.passengerForm = jobGroup;
        this.domainRedirect = environment.MAIN_SITE_URL + this.sg['domainPath'] + this.domainPath;
        if (this.sg['domainPath'] != '') {
          this.domainRedirect = environment.MAIN_SITE_URL + this.domainPath;
        }
      } else {
        this.router.navigate(['/' + this.sg['domainPath'], 'compare-stay']);
      }



    });
    
  }


  /*--------Save traveller & gst info----------*/
  travellerlist: any[];
  travellerlistLength: Number;
  checkedList: any = [];
  disableCheckbox: any = [];
  selectedCheckbox: any = [];
  GSTList: any = [];
  GSTListLength: any;
  selectedGST: any = [];
  checkedGST: any = [];
  disableGSTCheckbox: any = [];
  expandid: any;
  isExpandedStretch : boolean = false;
  @ViewChild("contentTraveller") modalTraveller: TemplateRef<any>;


  @ViewChild("contentGST") modalGST: TemplateRef<any>;
  expandItems(formId) {
   
    this.expandid = formId;
  }

  expandItemsstretch(formId) {
    this.expandid = 'n'; //setting dummy value so that process will work without flaw.
  }


  triggerBack() {
    $('#bookingprocessFailed').modal('hide');
    let url;
    this.resetPopups();
    url = "hotel-list?searchFrom="+this.searchResult.searchFrom+"&searchTo="+this.searchResult.searchTo+"&fromTravelCode="+this.searchResult.fromTravelCode+"&toTravelCode="+this.searchResult.toTravelCode+"&fromState="+this.searchResult.toTravelCode+"&toState="+this.searchResult.toState+"&departure="+this.searchResult.departure;
    this.router.navigateByUrl(url);
  }
  
  

  bookingSessionExpires(e: CountdownEvent) {
    if (e.action == 'done') {
      $('#bookingprocessExpires').modal('show');
    }
  }
  
  resetPopups() {

    $(".modal").hide();
    $("body").removeAttr("style");
    $(".modal-backdrop").remove();
  }

  goBack() {
    this.resetPopups();
    this.router.navigateByUrl('/');


  }
  gstExpandItems() {
    if (this.isGstExpanded == false) {
      this.isGstExpanded = true;
    } else if (this.isGstExpanded == true) {
      this.isGstExpanded = false;
    }
  }
  chooseFromSavedGST() {
    this.modalService.open(this.modalGST, { centered: true }).result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  isChecked: any = []; isCheckedGST: any = [];

  saveGSTConsent() {
    alertify.alert('I give consent to Reward360 to store personal information which I am entering on my own accord to facilitate convenience in future for quick data entry while undertaking transaction completion across all/diverse merchant offering on Reward360 hosted platform. This information includes Title, First Name, Last Name, Date of Birth, Mobile Number, Gender, Email ID, Passport Details and GST details. I understand that this information is not being stored by HDFC Bank under any facility and HDFC Bank will not be held responsible should any issue arise related to this data storage.').setHeader('<b>Save this GST for your future travel</b>');
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

        if (response['value'].length > 0) {
          response['value'] = response['value'].sort(function (a, b) {
            var x = a['id']; var y = b['id'];
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
          });
        }

        if (response['errorcode'] == 0) {
          //this.GSTList = response['value'].slice(0, 3);
          this.GSTList = response['value'];
          this.GSTListLength = this.GSTList.length;
          if (this.GSTListLength > 0) {
            this.getGSTShow = true;
          } else {
            this.getGSTShow = false;
          }

          for (let i = 0; i < this.GSTListLength; i++) {
            this.isCheckedGST[i] = false;
          }
        }
      });
    } else {
      this.getGSTShow = false;
    }
  }
  saveGSTfunc(saveGSTArray) {
    //console.log(saveGSTArray);
    var requestParamsEncrpt = {
      postData: this.EncrDecr.set(JSON.stringify(saveGSTArray))
    };
    this.rest.saveCustomerGstDetails(requestParamsEncrpt).subscribe(response => {
      // console.log(response);
    })
  }
  fillupGSTDetailOnCheck($event, data, GSTIndex) {
    for(let i=0;i<this.GSTListLength;i++){
      this.isCheckedGST[i]=false;
    }
    if ($event.target.checked) {
      this.isCheckedGST[GSTIndex] = true;
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

    } else {
      this.isCheckedGST[GSTIndex] = false;
      this.selectedGST.pop(GSTIndex);
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
  gstReset() {

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
  travellerReset() {
    this.selectedCheckbox = [];
    for (let i = 0; i < this.travellerlistLength; i++) {
      this.isChecked[i] = false;
      this.disableCheckbox[i] = false;
    }
    for (var i = 0; i < this.passengerCount; i++) {
      this.passengerForm.controls['passengerFirstName' + i].setValue('');
      this.passengerForm.controls['passengerLastName' + i].setValue('');
      this.passengerForm.controls['passengerAge' + i].setValue('');
      this.passengerForm.controls['passengerGender' + i].setValue('');
    }
  }
  /*---------------------end------------------------*/
  
        state:any;
response: any = [];
   pincodeError:any;
    urlparam:any;
    cityList:any;
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
            },
            (err: HttpErrorResponse) => {
                var message='Something went wrong !';
             alertify.error(message, '').delay(3);
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
  
  
  stateSelect: any;
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
  



  passengerFormerror: number = 0;
  
  createBusItinerary() {
    this.submitted = true;

  }
  isPaynowClicked: boolean = false;
  continuePayment() {
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
        if ($(".addCardTab[aria-selected='true']").attr("aria-selected"))
          $('.btn-pay-card').trigger('click');

        if ($(".addRupayTab[aria-selected='true']").attr("aria-selected"))
          $('.btn-pay-rupay').trigger('click');

        break;

      case 'tab-emi':
        if ($(".ccemiTab[aria-selected='true']").attr("aria-selected"))
          $('.btn-pay-emi-cc').trigger('click');


        break;


      case 'tab-testPg':
        $('.btn-pay-test').trigger('click');
        break;
    }

  }

  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
  gotoTopmiddle() {
    window.scroll({
      top: 500,
      left: 0,
      behavior: 'smooth'
    });
  }
  moveTab(page) {
    this.gotoTop();
    if (page < 2) {
      this.totalFare = this.intialTotalFare;
      this.coupon_amount = 0;
    }



    if (page <= this.completedSteps) {
      this.steps = page;
      this.completedSteps = page;
    }
  }
  createItinerarydata() {


    var saved_GST_flag;
    if (this.passengerForm.controls['saveGST']['value'] == 1)
      saved_GST_flag = 1;
    else
      saved_GST_flag = 0;


  }

  receivePgCharges($event) {
    this.pgCharges = $event;

  }

  goback() {
    this.searchArray = {
      searchFrom: this.searchResult.searchFrom,
      searchTo: this.searchResult.searchTo,
      fromTravelCode: this.searchResult.fromTravelCode,
      toTravelCode: this.searchResult.toTravelCode,
      departure: this.searchResult.departure,
    };
    this.router.navigate([this.sg['domainPath'] + '/hotel-list/'], {
      queryParams: this.searchArray
    });
  }
  closemsg() {
    let floorElements = document.getElementsByClassName("passenger-note" + "-" + this.domainName) as HTMLCollectionOf<HTMLElement>;
    return floorElements[0].style.display = 'none';
  }

  onFinishedTimer() {
    this.searchArray = {
      searchFrom: this.searchResult.searchFrom,
      searchTo: this.searchResult.searchTo,
      fromTravelCode: this.searchResult.fromTravelCode,
      toTravelCode: this.searchResult.toTravelCode,
      departure: this.searchResult.departure,
    };


    const dialogRef = this.dialog.open(ExpiryDialog, {
      panelClass: 'custom-dialog-container',
      disableClose: true,
      id: 'messageforSessionDialog',
      width: '310px',
      height: 'auto',
      data: {
        searchArray: this.searchArray
      }
    });

  }

}





@Component({
  selector: 'expiry-alert-dialog',
  templateUrl: './expiry-dialog.component.html'
})
export class ExpiryDialog {
  backSearchData: any;
  appConfig: any;
  cdnUrl: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ExpiryDialog>, private location: Location, private router: Router, @Inject(APP_CONFIG) appConfig: any, private sg: SimpleGlobal) {
    this.backSearchData = data.searchArray;
    this.appConfig = appConfig;
    this.cdnUrl = environment.cdnUrl + this.sg['assetPath'];
  }

  startOver(): void {
    $('#cloaseSavepop').trigger("click");
    $('#cloaseSavegst').trigger("click");

    this.router.navigate([this.sg['domainPath'] + '/hotel-list/'], {
      queryParams: this.backSearchData
    });
    this.dialogRef.close(true);
  }


}
