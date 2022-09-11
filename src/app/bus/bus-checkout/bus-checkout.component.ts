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
import { stringify } from '@angular/compiler/src/util';
import { AbstractControl } from '@angular/forms';
import { BusResponse } from 'src/app/entites/bus-response';
import { NgxSpinnerService } from "ngx-spinner";
import { Subscription } from 'rxjs';
import { APP_CONFIG, AppConfig } from '../../configs/app.config';
import { CommonHelper } from 'src/app/shared/utils/common-helper';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BusService } from 'src/app/shared/services/bus.service';
import { CheckoutBottomSheetComponent } from './bottom-sheet/bottom-sheet.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { PlatformLocation } from '@angular/common';
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
  selector: 'app-bus-checkout',
  templateUrl: './bus-checkout.component.html',
  styleUrls: ['./bus-checkout.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class BusCheckoutComponent implements OnInit, OnDestroy {
  isMobile: boolean = true;
  completedSteps = 1;
  steps = 1;
  sessionTimer: any = 3;
  serviceId: string = 'RedBus';
  template: string = '<div class="app-loading-new"><div class="logo"></div></div>'
  pgCharges: number = 0;
  errorMsg: any;
  validateUser: boolean = true;
  bookingFee: any;
  cdnUrl: any;
  showpassbox = false;
  gstshow = false;
  hideDelay = new FormControl(2000);
  bpName: any;
  dpName: any;
  bpTime: any;
  dpTime: any;
  totalFareStr: string;
  convertpipe: any;
  saveTravllerShow: Boolean = false; getTravllerShow: Boolean = false;
  getGSTShow: Boolean = false;
  blockResponse: BusResponse;
  busSubscription: Subscription;
  searchArray: any = [];
  ctype: string = 'redbus';
  searchBusKey: string;
  seacthResult: any = [];
  onward: any = [];
  totalBaseFare: number;
  totalFare: number = 0;
  intialTotalFare: number = 0;
  totalTax: number;
  assetPath: string;
  passengerCount: any = [];
  passengerForm: FormGroup;
  submitted = false;
  success = false;
  blockKey: string;
  passengerData: any = [];
  passengerContactData: any = [];
  gstDetails: any = [];
  itineraryParam: any = [];
  clientTransactionId: string;
  orderReferenceNumber: string;
  convenience_fee: number = 0;
  REWARD_CUSTOMERID: string;
  REWARD_EMAILID: string;
  REWARD_MOBILE: string;
  REWARD_FIRSTNAME: string;
  REWARD_LASTNAME: string;
  busData: any = [];
  fareData: any = [];
  savedCards: any = [];
  defaultPrimary: number = 0;
  whatsappFeature: number = 0;
  gstSelected: boolean = false;
  appConfig: any;
  domainPath: string;
  domainRedirect: string;
  testError: any;
  XSRFTOKEN: string;
  statesdump: any = [];
  seatResponse: any = [];
  IsDcemiEligibleFlag: boolean = false;
  enableGST: any; enablesavedTraveller: number = 0;
  boardingpointName: any;
  droppingpointName: any;
  boardingpointTime: any;
  droppingPointTime: any;
  boardingDate: any;
  droppingDate: any;
  printdoj: boolean = false;
  boardingID: any;
  droppingID: any;
  actualboarding: any;
  actualdropping: any;
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
  SeatNumber: any;
      passengerSelectedArray:any={};
  saveAdultTravellerId = [];
  saveInfantTravellerId = [];
  passengerArray = [];
  passengerFormCount: number = 1;

  constructor(private _flightService: FlightService, @Inject(APP_CONFIG) appConfig: any, public rest: RestapiService, private EncrDecr: EncrDecrService, private http: HttpClient, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute,
    private sg: SimpleGlobal, @Inject(DOCUMENT) private document: any, public commonHelper: CommonHelper, private location: Location, private dialog: MatDialog, private busService: BusService, private router: Router,
    private _bottomSheet: MatBottomSheet, private _decimalPipe: DecimalPipe, private spinnerService: NgxSpinnerService, plocation: PlatformLocation, private titleService: Title, private appConfigService: AppConfigService, private modalService: NgbModal) {

    this.serviceSettings = this.appConfigService.getConfig();

    if (this.serviceSettings.DOMAIN_SETTINGS[this.sg['domainName']]['BUS'] != 1) {
      this.router.navigate(['/**']);
    }
    this.domainName = this.sg['domainName'];
    this.assetPath = this.sg['assetPath'];
    this.appConfig = appConfig;
    this.domainPath = this.sg['domainPath'];
    this.cdnUrl = environment.cdnUrl + this.sg['assetPath'];
    this.statesdump = require('src/assets/data/states.json');
    this.whatsappFeature = this.serviceSettings.whatsappFeature;
    this.enableGST = this.serviceSettings.enableSavedGST;
    this.enablesavedTraveller = this.serviceSettings.enablesavedTraveller;
    this.passengerArray = [];
    this.passengerFormCount = 1;
    plocation.onPopState(() => {
      history.go(1);
    });
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
      sessionStorage.setItem(this.searchBusKey + '-passData', this.EncrDecr.set(JSON.stringify(this.busData)));
      sessionStorage.setItem(this.searchBusKey + '-totalFare', String(this.totalFare));
    } else {
      this.coupon_id = '';
      this.coupon_name = '';
      this.coupon_code = '';
      this.coupon_amount = 0;
      if (this.flexiDiscount == undefined) this.flexiDiscount = 0;
      this.totalFare = (Number(this.intialTotalFare) + Number(this.convenience_fee)) - (Number(this.coupon_amount) + Number(this.flexiDiscount));
      this.sendflexiFare = (Number(this.intialTotalFare) + Number(this.convenience_fee)) - (Number(this.coupon_amount));
      this.createItinerarydata();
      sessionStorage.setItem(this.searchBusKey + '-passData', this.EncrDecr.set(JSON.stringify(this.busData)));
      sessionStorage.setItem(this.searchBusKey + '-totalFare', String(this.totalFare));
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
    sessionStorage.setItem(this.searchBusKey + '-passData', this.EncrDecr.set(JSON.stringify(this.busData)));
    sessionStorage.setItem(this.searchBusKey + '-totalFare', String(this.totalFare));
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



  ngOnInit() {
    this.titleService.setTitle('Home | RedBus');

    this.activatedRoute.url.subscribe(url => {
      this.buttonSubmitted = false;
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
            setTimeout(function () { this.validateUser = false; }.bind(this), 1000);
            this.REWARD_CUSTOMERID = '0000';
            this.REWARD_EMAILID = '';
            this.REWARD_MOBILE = '';
            this.REWARD_FIRSTNAME = '';
            this.REWARD_LASTNAME = '';
          } else {
            var customerInfo = this.sg['customerInfo'];
            if (customerInfo["org_session"] == 1) {
              this.customerInfo = customerInfo;
              setTimeout(function () { this.validateUser = false; }.bind(this), 1000);

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
                if (this.enablesavedTraveller == 1) {
                  this.getCustomertravellerInfo();
                }
                if (this.enableGST == 1) {
                  this.getCustomerGstDetails();
                }
                if (this.saveTravllerShow == false) {
                  this.passengerForm.patchValue({
                    passengerFirstName0: customerInfo["firstname"],
                    passengerLastName0: customerInfo["lastname"]
                  });
                }
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
              setTimeout(function () { this.validateUser = false; }.bind(this), 1000);
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
          setTimeout(function () { this.validateUser = false; }.bind(this), 1000);
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

      //this.savedCards=[{"id":7730,"card_display_name":"4059 xxx 8794 HDFC","type":"VISA","card_id":"zJOyDltPQZcfMjLqOlDjHQJ966czxP1srxQFTUrZi6TNvxgY4l\/wPchjhQ\/MCPuN"},{"id":7731,"card_display_name":"4059 xxx 9999 HDFC","type":"VISA","card_id":"ddddd"}];

      // this.searchBusKey = this.activatedRoute.snapshot.params['searchBusKey'];
      this.searchBusKey = this.activatedRoute.snapshot.queryParamMap.get('searchBusKey');
      this.seacthResult = JSON.parse(sessionStorage.getItem(this.searchBusKey));
      var lengthofboarding = this.seacthResult.busdetails.boardingTimes.length;
      var lengthofDropping = this.seacthResult.busdetails.droppingTimes.length;

      for (var i = 0; i < lengthofboarding; i++) {
        if (this.seacthResult.busdetails.boardingTimes[i].boardingPointId == this.seacthResult.boarding) {

          this.boardingpointName = this.seacthResult.busdetails.boardingTimes[i].address.replace(/[^a-zA-Z0-9 - ]/g, "") + ", " + this.seacthResult.busdetails.boardingTimes[i].location.replace(/[^a-zA-Z0-9 - ]/g, "") + " (" + this.seacthResult.busdetails.boardingTimes[i].landmark.replace(/[^a-zA-Z0-9 - ]/g, "") + ")";

          // this.boardingpointName = this.seacthResult.busdetails.boardingTimes[i].address;
          this.boardingpointTime = this.seacthResult.busdetails.boardingTimes[i].ctime;
          this.boardingDate = this.seacthResult.busdetails.boardingTimes[i].nextday;

          // this.boardingID = this.seacthResult.busdetails.boardingTimes[i].nextday;
        }
      }
      if (this.boardingDate == '') {
        this.printdoj = true;
        this.actualboarding = this.seacthResult.busdetails.doj;
      }
      else {
        this.printdoj = false;
        this.actualboarding = this.boardingDate;
        // this.actualboarding = moment(date, 'DD-MM-YYYY');
      }



      for (var i = 0; i < lengthofDropping; i++) {
        if (this.seacthResult.busdetails.droppingTimes[i].boardingPointId == this.seacthResult.dropping) {
          // this.droppingpointName = this.seacthResult.busdetails.droppingTimes[i].address;

          if (typeof this.seacthResult.busdetails.droppingTimes[i] === "undefined") {
            this.droppingpointName = 'NA';
          } else {
            this.droppingpointName = this.seacthResult.busdetails.droppingTimes[i].address.replace(/[^a-zA-Z0-9 - ]/g, "") + ", " + this.seacthResult.busdetails.droppingTimes[i].location.replace(/[^a-zA-Z0-9 - ]/g, "") + " (" + this.seacthResult.busdetails.droppingTimes[i].landmark.replace(/[^a-zA-Z0-9 - ]/g, "") + ")";
          }

          this.droppingPointTime = this.seacthResult.busdetails.droppingTimes[i].ctime;
          this.droppingDate = this.seacthResult.busdetails.droppingTimes[i].nextday;
          // this.droppingID = this.seacthResult.busdetails.boardingTimes[i].nextday;
        }
      }

      if (this.droppingDate == '') {
        this.actualdropping = this.seacthResult.busdetails.arrivalTime;
      } else {

        this.actualdropping = this.droppingDate;

      }


      if (this.seacthResult != null) {
        this.onward = this.seacthResult.busdetails;
        var fares = this.seacthResult.seatdetails;
        this.seatResponse = this.seacthResult.seatResponse;
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
          totalFare: totalFare + totalbookingFee,
          totalTax: totalTax,
          data: fares,
          totalbookingFee: totalbookingFee,
          totalseats: fares.length,
          singlePassengerbasefare: fares[0].baseFare,
        }

        this.totalFare = Number(totalFare) + Number(totalbookingFee);
        this.intialTotalFare = Number(totalFare) + Number(totalbookingFee);
        this.convertpipe = this._decimalPipe.transform(this.totalFare, '1.2');
        this.totalFareStr = String(this.convertpipe.replace(/,/g, ""));
        for (var i = 0; i < Number(this.passengerCount); i++) {
          var firstname;
          var lastname;
          if (i == 0) {
            firstname = '';
            lastname = '';
          } else {
            firstname = '';
            lastname = '';
          }
          jobGroup.addControl('passengerid' + i, new FormControl(0));
          jobGroup.addControl('passengerFirstName' + i, new FormControl(firstname, [Validators.required, Validators.pattern(this.patternName), Validators.minLength(2)]));
          jobGroup.addControl('passengerLastName' + i, new FormControl(lastname, [Validators.required, Validators.pattern(this.patternNameLastName)]));
          jobGroup.addControl('passengerAge' + i, new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.max(125)]));
          jobGroup.addControl('passengerGender' + i, new FormControl('', Validators.required));
          jobGroup.addControl('saveTraveller', new FormControl(''));
          
          this.passengerSelectedArray[i]=0;
          
        }

      

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
        this.router.navigate(['/' + this.sg['domainPath'], 'bus']);
      }

      //setTimeout(function() {  console.log(this.REWARD_CUSTOMERID);this.getCustomertravellerInfo(); }.bind(this), 2000);


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

  chooseFromSavedTravellers() {
    this.isExpanded = false;
    this.modalService.open(this.modalTraveller, { centered: true }).result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
      // console.log(this.isChecked);
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  @ViewChild("contentGST") modalGST: TemplateRef<any>;
  expandItems(formId) {

    this.expandid = formId;
    this.isExpanded = true;
    this.isExpandedStretch=false;
  }

  expandItemsstretch(formId) {

    this.expandid = formId;
    this.isExpanded = false;
    this.isExpandedStretch=true;

  }


  triggerBack() {


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
  getCustomertravellerInfo() {

    if (this.enablesavedTraveller == 1) {
      this.saveTravllerShow = true;
      var requestParams = {
        'customerId': this.REWARD_CUSTOMERID
      };
      var requestParamsEncrpt = {
        postData: this.EncrDecr.set(JSON.stringify(requestParams))
      };
      this.rest.getCustomertravellerInfo(requestParamsEncrpt).subscribe(response => {
        // let respData = JSON.parse(this.EncrDecr.get(response.result ));
        let resp = response['errorcode'];
        if (response['errorcode'] == 0) {

          if (response['value'].length > 0) {
            response['value'] = response['value'].sort(function (a, b) {
              var x = a['id']; var y = b['id'];
              return ((x > y) ? -1 : ((x < y) ? 1 : 0));
            });
          }

          this.travellerlist = response['value'];
          this.travellerlistLength = this.travellerlist.length;
          if (this.travellerlistLength > 0) {
            this.getTravllerShow = true;
          } else {
            this.getTravllerShow = false;
          }
          for (let i = 0; i < this.travellerlistLength; i++) {
            this.disableCheckbox[i] = false;
            this.isChecked[i] = false;
          }
        }
      });
    } else {
      this.getTravllerShow = false;
      //this.saveTravllerShow=false;
    }
  }
  
  
  
  
  fillupTravellerDetailOnCheck($event, data, travellerformid, travellerid, travellerIndex) {

    const sum = travellerformid + 1;

    const sum1 = travellerformid - 1;

    if ($event.target.checked) {
      console.log("checked inside if "+travellerformid+travellerIndex);
      
      this.passengerSelectedArray[travellerformid]=1;
      

      this.passengerForm.controls['passengerid' + travellerformid].setValue(data.id);
      this.passengerForm.controls['passengerFirstName' + travellerformid].setValue(data.firstName);
      this.passengerForm.controls['passengerLastName' + travellerformid].setValue(data.lastName);
      this.passengerForm.controls['passengerAge' + travellerformid].setValue(data.age);
      this.passengerForm.controls['passengerGender' + travellerformid].setValue(data.gender);

     /* for (let i = 0; i < this.travellerlistLength; i++) {
        
        let allTraverlID = this.travellerlist[i].id;
        if (data.id == travellerid && travellerIndex == i) {
      
          this.isChecked[i] = true;
          console.log("for if "+travellerformid+i);

        } else {
          console.log("for else  "+travellerformid+i);

          console.log("i "+i+' sum '+sum+' travellerIndex '+ travellerIndex);

          if(travellerformid!=i){

            this.isChecked[i] = false;
            this.disableCheckbox[sum]=true;

          } else{

            this.isChecked[i+i] = false;
            this.disableCheckbox[i+i]=false;
          }

            
      

        }

      }*/


    } else {
     this.passengerSelectedArray[travellerformid]=0;
      
      this.passengerForm.controls['passengerid' + travellerformid].setValue(0);
      this.passengerForm.controls['passengerFirstName' + travellerformid].setValue('');
      this.passengerForm.controls['passengerLastName' + travellerformid].setValue('');
      this.passengerForm.controls['passengerAge' + travellerformid].setValue('');
      this.passengerForm.controls['passengerGender' + travellerformid].setValue('');
      // this.disableCheckbox[travellerIndex]=true;
      console.log("uncheck "+travellerformid+travellerformid);


    /*  for (let i = 0; i < this.travellerlistLength; i++) {
        console.log("uncheck for "+travellerformid+i);
        let allTraverlID = this.travellerlist[i].id;
        if (data.id == travellerid && travellerIndex == i) {
          console.log("uncheck if"+travellerformid+i);
          this.isChecked[i] = true;
          this.disableCheckbox[i]=true;
        } else {
          console.log("uncheck else"+travellerformid+i);
          this.isChecked[i] = false;
        
          this.isChecked[travellerIndex] = false;
          this.isChecked[sum1] = false;

          this.disableCheckbox[i]=false;

        }

      }
*/


    }

      var checkboxVal = $("input.pass_checkBox_"+ travellerformid +"[type='checkbox']:not(:checked)").val();
        console.log(this.passengerSelectedArray);
          console.log(checkboxVal);


    /*
      console.log("data " + JSON.stringify(data));
      console.log("index " + travellerIndex);
          if($event.target.checked){                
                this.isChecked[travellerIndex]=true; 
                if(!(this.selectedCheckbox.includes(travellerIndex))){
                      this.selectedCheckbox.push(travellerIndex);
                }
                this.checkedList.push({ 
                                        "sno":        data.id,
                                        "firstName":  data.firstName,
                                        "lastName":   data.lastName,
                                        "age":        data.age,
                                        "gender":     data.gender
                                      });
                var checkedListLength=this.checkedList.length;
                var isFilledData = false;
               
                    if(this.passengerForm.controls['passengerFirstName' + travellerIndex].value=="" && this.passengerForm.controls['passengerLastName' + travellerIndex].value==""){
                    isFilledData = true;
                        var gender;
                        if((this.checkedList[checkedListLength-1].gender == 'M') || (this.checkedList[checkedListLength-1].gender == 'Male')) {
                          gender = 'Male'
                        }else if((this.checkedList[checkedListLength-1].gender == 'F') || (this.checkedList[checkedListLength-1].gender == 'Female')){
                          gender = 'Female';
                        }
                  //   
                        this.passengerForm.controls['passengerFirstName' + travellerIndex].setValue(this.checkedList[checkedListLength-1].firstName);
                        this.passengerForm.controls['passengerLastName' + travellerIndex].setValue(this.checkedList[checkedListLength-1].lastName);
                        this.passengerForm.controls['passengerAge' + travellerIndex].setValue(this.checkedList[checkedListLength-1].age);
                        this.passengerForm.controls['passengerGender' + travellerIndex].setValue(gender);
                      
                    }
                
                if(isFilledData == false){
                $event.target.checked = false;
                  this.isChecked[travellerIndex]=false;
                  this.disableCheckbox[travellerIndex]=true;
                this.selectedCheckbox = this.arrayRemove(this.selectedCheckbox, travellerIndex);
                this.selectedCheckbox.splice(travellerIndex,1);
                this.checkedList = this.arrayRemove(this.checkedList, {  
                                                                    "sno":        data.id, 
                                                                    "firstName":  data.firstName,
                                                                    "lastName":   data.lastName,
                                                                    "age":        data.age,
                                                                    "gender":     data.gender
                                                                  });
                }
          }else{      
                this.isChecked[travellerIndex]=false;
                this.selectedCheckbox = this.arrayRemove(this.selectedCheckbox, travellerIndex);
                this.checkedList = this.arrayRemove(this.checkedList, {  
                                                                    "sno":        data.id, 
                                                                    "firstName":  data.firstName,
                                                                    "lastName":   data.lastName,
                                                                    "age":        data.age,
                                                                    "gender":     data.gender
                                                                  });
                for(var i=0;i<this.passengerCount;i++){
                  if((this.passengerForm.controls['passengerFirstName' + i].value==data.firstName) && (this.passengerForm.controls['passengerLastName' + i].value==data.lastName)){
                      this.passengerForm.controls['passengerFirstName' + i].setValue('');
                      this.passengerForm.controls['passengerLastName' + i].setValue('');
                      this.passengerForm.controls['passengerAge' + i].setValue('');
                      this.passengerForm.controls['passengerGender' + i].setValue('');
                      break;
                  }
                }
          }
          if((this.selectedCheckbox.length == this.passengerCount)){
            for(let i=0;i<this.travellerlistLength;i++){
              if(this.selectedCheckbox.includes(i)){ 
                this.disableCheckbox[i]=false;
              }else{              
                this.disableCheckbox[i]=true;
              }
            }
          }else{
            for(let i=0;i<this.travellerlistLength;i++){ 
                this.disableCheckbox[i]=false;
            }
          }
          let trackUrlParams = new HttpParams()
          .set('current_url', window.location.href)
          .set('category', 'RedBus')
          .set('event', 'Checkout traveller info')
          .set('metadata','{"traveller_info":"'+this.EncrDecr.set(JSON.stringify(this.checkedList))+'","customerid":"'+this.EncrDecr.set(JSON.stringify(this.REWARD_CUSTOMERID))+'"}');
          
           const track_body: string = trackUrlParams.toString();
           this.rest.trackEvents( track_body).subscribe(result => {});
           */
  }
  saveTravellerFunc(saveTravellerArray) {
    var requestParamsEncrpt = {
      postData: this.EncrDecr.set(JSON.stringify(saveTravellerArray))
    };
    this.rest.saveCustomertravellerInfo(requestParamsEncrpt).subscribe(response => {
    })
  }

  saveTravellerConsent() {
    alertify.alert('I give consent to Reward360 to store personal information which I am entering on my own accord to facilitate convenience in future for quick data entry while undertaking transaction completion across all/diverse merchant offering on Reward360 hosted platform. This information includes Title, First Name, Last Name, Date of Birth, Mobile Number, Gender, Email ID, Passport Details and GST details. I understand that this information is not being stored by HDFC Bank under any facility and HDFC Bank will not be held responsible should any issue arise related to this data storage.').setHeader('<b>Save this traveller for your future travel</b>');
  }

  saveGSTConsent() {
    alertify.alert('I give consent to Reward360 to store personal information which I am entering on my own accord to facilitate convenience in future for quick data entry while undertaking transaction completion across all/diverse merchant offering on Reward360 hosted platform. This information includes Title, First Name, Last Name, Date of Birth, Mobile Number, Gender, Email ID, Passport Details and GST details. I understand that this information is not being stored by HDFC Bank under any facility and HDFC Bank will not be held responsible should any issue arise related to this data storage.').setHeader('<b>Save this GST for your future travel</b>');
  }

  arrayRemove(arr, value) {
    return arr.filter(function (ele) {
      return ele != value;
    });
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
    this.passengerForm.get('saveGST').clearValidators();

    this.passengerForm.controls['gstNumber'].updateValueAndValidity();
    this.passengerForm.controls['gstBusinessName'].updateValueAndValidity();
    this.passengerForm.controls['gstAddress'].updateValueAndValidity();
    this.passengerForm.controls['gstCity'].updateValueAndValidity();
    this.passengerForm.controls['gstPincode'].updateValueAndValidity();
    this.passengerForm.controls['gstState'].updateValueAndValidity();
    this.passengerForm.controls['saveGST'].updateValueAndValidity();

    // if(this.gstSelected){
    //   if(this.enableGST==1){
    //     this.getCustomerGstDetails();
    //   }
    // }else{
    this.passengerForm['controls']['gstNumber'].setValue('');
    this.passengerForm['controls']['gstBusinessName'].setValue('');
    this.passengerForm['controls']['gstAddress'].setValue('');
    this.passengerForm['controls']['gstCity'].setValue('');
    this.passengerForm['controls']['gstPincode'].setValue('');
    this.passengerForm['controls']['gstState'].setValue('');
    this.passengerForm['controls']['saveGST'].setValue('');
    // }


  }

  passengerFormerror: number = 0;
  ageValidError: any;
  ageCheck($event, i) { //System should not allow user to proceed when the traveller age is below "12" ,and if traveller is one.
    //if(i==0){
    if (i == this.defaultPrimary) {
      var age = this.passengerForm.controls['passengerAge' + i]['value'];
      if (!(Number(age) >= 12)) {
        this.ageValidError = "Primary traveller's age should be above 11 years";
        this.passengerFormerror = 1;
      } else {
        this.ageValidError = "";
        this.passengerFormerror = 0;
      }
    } else {
      this.ageValidError = "";
      this.passengerFormerror = 0;
    }
  }
  setPrimary(passengerRow) {
    this.defaultPrimary = passengerRow;
    var age = this.passengerForm.controls['passengerAge' + this.defaultPrimary]['value'];
    if (!(Number(age) >= 12)) {
      this.ageValidError = "Primary traveller's age should be above 11 years";
      this.passengerFormerror = 1;
    } else {
      this.ageValidError = "";
      this.passengerFormerror = 0;
    }
  }

  buttonSubmitted: boolean = false;
  createBusItinerary() {
    this.submitted = true;
    this.buttonSubmitted = true;
    var checkage = this.passengerForm.controls['passengerAge' + this.defaultPrimary]['value'];
    if (!(Number(checkage) >= 12)) {
      this.ageValidError = "Primary traveller's age should be above 11 years";
      this.passengerFormerror = 1;
    } else {
      this.ageValidError = "";
      this.passengerFormerror = 0;
    }

    if (this.gstSelected == true) {
      this.passengerForm.controls['gstNumber'].setValidators([Validators.required, Validators.pattern("^[a-zA-Z0-9]*$"), Validators.minLength(15)]);
      this.passengerForm.controls['gstBusinessName'].setValidators([Validators.required, Validators.pattern("^[a-z A-Z 0-9]*$"), Validators.minLength(2)]);
      this.passengerForm.controls['gstAddress'].setValidators([Validators.required, Validators.pattern("^[a-z A-Z 0-9 # /,-]*$"), Validators.minLength(2)]);
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

    if (this.passengerForm.invalid || this.passengerFormerror == 1) {
      this.buttonSubmitted = false;
      return;
    } else {
      this.spinnerService.show();
      this.buttonLoading = true;
      this.passengerData = [];
      var passengerDataAPI = [];
      var saveTravellerArray: any = [];
      for (var i = 0; i < Number(this.passengerCount); i++) {
        var primary = false;
        if (i == this.defaultPrimary) {
          var primary = true;
        }
        var mobile = this.passengerForm.controls['passengerMobile']['value'];
        var email = this.passengerForm.controls['passengerEmail']['value'];

        var gender;
        if (this.passengerForm.controls['passengerGender' + i]['value'] == "Male") {
          gender = 'M';
        } else if (this.passengerForm.controls['passengerGender' + i]['value'] == "Female") {
          gender = 'F';
        } else {
          gender = this.passengerForm.controls['passengerGender' + i]['value'];
        }

        var saveTraveller;
        if (this.passengerForm.controls['saveTraveller']['value'] == true)
          saveTraveller = 1;
        else
          saveTraveller = 0;
        var passdata: any = [];

        passdata = {
          name: this.passengerForm.controls['passengerFirstName' + i]['value'].trim() + " " + this.passengerForm.controls['passengerLastName' + i]['value'].trim(),
          age: this.passengerForm.controls['passengerAge' + i]['value'],
          gender: this.passengerForm.controls['passengerGender' + i]['value'],
          mobile: mobile,
          address: "",
          email: email,
          primary: primary,
          saveTraveller: saveTraveller
        };

        passengerDataAPI.push({
          "seatName": this.seacthResult.seatdetails[i].name,
          "serviceTax": this.seacthResult.seatdetails[i].serviceTaxAbsolute,
          "fare": this.seacthResult.seatdetails[i].fare,
          "operatorServiceCharge": this.seacthResult.seatdetails[i].operatorServiceChargeAbsolute,
          "ladiesSeat": this.seacthResult.seatdetails[i].ladiesSeat,
          "passenger": passdata
        });
        if (saveTraveller == 1) {
          saveTravellerArray.push({
            "age": this.passengerForm.controls['passengerAge' + i]['value'],
            "birthPreference": "",
            "concessionType": "",
            "customerId": this.REWARD_CUSTOMERID,
            "dateOfBirth": "",
            "emailId": email,
            "firstName": this.passengerForm.controls['passengerFirstName' + i]['value'].trim(),
            "gender": gender,
            "id": this.passengerForm.controls['passengerid' + i]['value'],
            "lastName": this.passengerForm.controls['passengerLastName' + i]['value'].trim(),
            "mobileNumber": mobile,
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

      }
      if (this.enablesavedTraveller == 1 && saveTravellerArray.length > 0)
        this.saveTravellerFunc(saveTravellerArray);

      var whatsappFlag;
      if (this.whatsappFeature == 1)
        whatsappFlag = this.passengerForm.controls['whatsappFlag']['value'];
      else
        whatsappFlag = 0;

      this.passengerContactData = {
        "whatsappFlag": whatsappFlag,
        "mobile": mobile,
        "firstName": this.passengerForm.controls['passengerFirstName' + this.defaultPrimary]['value'] + " " + this.passengerForm.controls['passengerLastName' + this.defaultPrimary]['value'],
        "gst": "",
        "title": "",
        "email": email,
        "country_code": "91",
        "lastName": ""
      }

      var saved_GST_flag; var saveGSTArray: any = [];


      if (this.gstSelected) {
        if (this.passengerForm.controls['saveGST']['value'] == true) {
          saved_GST_flag = 1;
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
          if (this.enablesavedTraveller == 1)
            this.saveGSTfunc(saveGSTArray);
        } else {
          saved_GST_flag = 0;
        }
        this.gstDetails = {
          "address": this.passengerForm.controls['gstAddress']['value'],
          "city": this.passengerForm.controls['gstCity']['value'],
          "gstNumber": this.passengerForm.controls['gstNumber']['value'],
          "name": this.passengerForm.controls['gstBusinessName']['value'],
          "pincode": this.passengerForm.controls['gstPincode']['value'],
          "state": this.passengerForm.controls['gstState']['value'],
        }
      } else {
        this.gstDetails = {
          "address": '',
          "city": '',
          "gstNumber": '',
          "name": '',
          "pincode": '',
          "state": '',
        }
      }

      this.passengerData = passengerDataAPI;
      var postd1 = this.seacthResult;
      this.itineraryParam = {
        "customer_id": this.REWARD_CUSTOMERID,
        "tripId": this.onward.id,
        "total_price": this.totalFareStr,
        "source": this.onward.source,
        "coupon_code": this.coupon_code,
        "discount_amount": this.coupon_amount,
        "serviceToken": "BUS",
        "convenience_fee": this.convenience_fee,
        "partner_amount": this.intialTotalFare,
        "serviceName": "Bus",
        "operator": this.onward.travels,
        "boardingPointId": this.seacthResult.boarding,
        "droppingPointId": this.seacthResult.dropping,
        "osVersion": "",
        "destination": this.onward.destination,
        "orderId": 1,
        "busApiProvider": "RedBus",
        "clientName": "HDFC243",
        "partnerName": "RedBus",
        "passengerBookingDetails": passengerDataAPI,
        "gstDetails": this.gstDetails,
        "amenities": this.onward.amenities,
        "busType": this.onward.busType,
        "busTypeId": this.onward.busTypeId,
        "partialCancellationAllowed": this.onward.partialCancellationAllowed,
        "rating": this.onward.rating,
        "vehicleType": this.onward.vehicleType,
        "programName": this.sg['domainName'],
        "bpDpSeatlayout": postd1.busdetails.rtc,
        "saved_GST_flag": saved_GST_flag
      };
      //console.log(this.itineraryParam);

      var itineraryParam = {
        postData: this.EncrDecr.set(JSON.stringify(this.itineraryParam))
      };

      //this.spinnerService.show();
      this.busSubscription = this.busService.blockbusSeats(JSON.stringify(itineraryParam)).subscribe(data => {

        let dData = JSON.parse(this.EncrDecr.get(data.result));
        this.buttonSubmitted = false;
        this.blockResponse = <BusResponse>dData;
        var orderId = this.blockResponse.orderId;
        var keyStatus = this.blockResponse.errorCode;
        this.errorMsg = 'Oops! Partner giving bad response. Please try another bus operator.';
        this.Button_loading = "Processing...";
        if (keyStatus != 1) {
          this.blockKey = this.blockResponse.blockKey;
          this.clientTransactionId = this.blockResponse.blockKey;
          this.orderReferenceNumber = this.blockResponse.orderId;
          this.busData = this.itineraryParam;
          this.convenience_fee = this.blockResponse.convenience_fee;
          this.createItinerarydata();
          let Total = Number(this.totalFare) + Number(this.convenience_fee);
          this.totalFare = Number(Total);

          var saveCheckoutData = {
            orderReferenceNumber: this.orderReferenceNumber,
            busData: this.EncrDecr.set(JSON.stringify(this.busData))
          };

          let trackUrlParams = new HttpParams()
            .set('current_url', window.location.href)
            .set('category', 'RedBus')
            .set('event', 'Save Checkout')
            .set('metadata', '{"save_checkout":"' + this.EncrDecr.set(JSON.stringify(JSON.stringify(saveCheckoutData))) + '"}');

          const track_body: string = trackUrlParams.toString();
          this.rest.trackEvents(track_body).subscribe(result => { });

          this.busService.saveCheckout(JSON.stringify(saveCheckoutData)).subscribe(rdata => {

            if (rdata == 1) {
              sessionStorage.setItem(this.searchBusKey + '-clientTransactionId', this.blockResponse.blockKey);
              sessionStorage.setItem(this.searchBusKey + '-orderReferenceNumber', this.blockResponse.orderId);
              sessionStorage.setItem(this.searchBusKey + '-ctype', this.ctype);
              sessionStorage.setItem(this.searchBusKey + '-totalFare', String(this.totalFare));
              sessionStorage.setItem(this.searchBusKey + '-passData', this.EncrDecr.set(JSON.stringify(this.busData)));
              sessionStorage.setItem(this.searchBusKey + '-passFareData', btoa(JSON.stringify(this.fareData)));
              this.spinnerService.hide();
              this.buttonSubmitted = false;
              this.steps = 2;
              this.completedSteps = 2;
            } else {
              this.spinnerService.hide();
              this.buttonSubmitted = false;
              this.buttonLoading = false;
              const dialogRef = this.dialog.open(ConfirmationDialog, {
                width: '600px',
                disableClose: true,
                id: 'messageforMliteDialog',
                data: {
                  messageData: this.errorMsg,
                  backSearchData: this.seacthResult
                }
              });

            }
          });


        } else {
          this.spinnerService.hide();
          this.buttonSubmitted = false;
          this.buttonLoading = false;
          const dialogRef = this.dialog.open(ConfirmationDialog, {
            width: '600px',
            disableClose: true,
            id: 'messageforMliteDialog',
            data: {
              messageData: this.errorMsg,
              backSearchData: this.seacthResult
            }
          });
        }
      },
        (err: HttpErrorResponse) => {
          this.buttonSubmitted = false;
          this.spinnerService.hide();
          this.buttonLoading = false;
          const dialogRef = this.dialog.open(ConfirmationDialog, {
            width: '600px',
            disableClose: true,
            id: 'messageforMliteDialog',
            data: {
              messageData: this.errorMsg,
              backSearchData: this.seacthResult
            }
          });
        });
    }

    let trackUrlParams = new HttpParams()
      .set('current_url', window.location.href)
      .set('category', 'RedBus')
      .set('event', 'Passenger Itinerary data')
      .set('metadata', '{"createItinerarydata":"' + this.EncrDecr.set(JSON.stringify(JSON.stringify(itineraryParam))) + '","customerid":"' + this.EncrDecr.set(JSON.stringify(this.REWARD_CUSTOMERID)) + '"}');

    const track_body: string = trackUrlParams.toString();
    this.rest.trackEvents(track_body).subscribe(result => { });

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
    var busDetails: any = [];
    var onwards: any = [];
    var fare: any = [];
    var postd = this.seacthResult;
    var datePipe = new DatePipe('en-US');
    var dtime = datePipe.transform(postd.busdetails.departureTime, 'HH:mm');
    var atime = datePipe.transform(postd.busdetails.arrivalTime, 'HH:mm');
    var duration = this.commonHelper.timeDifferMin(postd.busdetails.arrivalTime, postd.busdetails.departureTime);

    var droppingTimes = postd.busdetails.droppingTimes;

    var droppingTimesPointName = droppingTimes.filter(a => {
      return a['boardingPointId'] == postd.dropping ? a.boardingPointName != -1 : '';
    });

    var droppingTime = droppingTimes.filter(a => {
      return a['boardingPointId'] == postd.dropping ? a.ctime != -1 : '';
    });
    //console.log(droppingTime)


    var boardingTimes = postd.busdetails.boardingTimes;

    var boardingTimesPointName = boardingTimes.filter(a => {
      return a['boardingPointId'] == postd.boarding ? a.boardingPointName != -1 : '';
    });

    var bordingTime = boardingTimes.filter(a => {
      return a['boardingPointId'] == postd.boarding ? a.ctime != -1 : '';
    });

    this.bpName = boardingTimesPointName[0].boardingPointName.replace(/[^a-zA-Z0-9 - ]/g, "") + ", " + boardingTimesPointName[0].location.replace(/[^a-zA-Z0-9 - ]/g, "") + " (" + boardingTimesPointName[0].landmark.replace(/[^a-zA-Z0-9 - ]/g, "") + ")";
    var droppingLandmark;
    if (typeof droppingTimesPointName[0] === "undefined") {
      this.dpName = 'NA';
      this.dpTime = 'NA';
      droppingLandmark = '';
    } else {
      this.dpName = droppingTimesPointName[0].boardingPointName.replace(/[^a-zA-Z0-9 - ]/g, "") + ", " + droppingTimesPointName[0].location.replace(/[^a-zA-Z0-9 - ]/g, "") + " (" + droppingTimesPointName[0].landmark.replace(/[^a-zA-Z0-9 - ]/g, "") + ")";
      this.dpTime = droppingTime[0].ctime, 'HH:mm';
      droppingLandmark = droppingTimesPointName[0].landmark.replace(/[^a-zA-Z0-9 - ]/g, "");
    }
    this.bpTime = bordingTime[0].ctime, 'HH:mm'

    let bpNextDayDate;
    if (this.boardingDate == '') {
      bpNextDayDate = '';
    }
    else {
      bpNextDayDate = "(" + datePipe.transform(this.boardingDate, 'dd-MMM') + ")";
    }

    //	console.log(this.bpTime + "  "+this.dpTime )
    //console.log(boardingTimesPointName[0].locat;ion.replace(/[^a-zA-Z0-9 - ]/g, ""));
    //console.log(boardingTimesPointName[0].boardingPointName);
    onwards = {
      "arrivaldate": datePipe.transform(this.actualdropping, 'EEE dd MMM yyyy'),
      "departdate": datePipe.transform(this.actualboarding, 'EEE dd MMM yyyy'),
      "arrivetime": this.droppingPointTime,
      "dp": this.droppingpointName,
      "source": postd.fromTravelCode,
      "departtime": this.boardingpointTime,
      "bp": this.boardingpointName,
      "busStartTime": postd.busdetails.departureTime,
      "destination": postd.toTravelCode,
      "duration": duration,
      "bpNextDayDate": bpNextDayDate,
      "skey": "",
      "refund": {
        "data": {
          "CancellationCharges": {
            'list': postd.busdetails.cancellationPolicies
          }
        }
      },
      "travelname": postd.busdetails.travels

    }
    //console.log(onwards);
    fare = {
      "total_tax": this.fareData.totalTax,
      "total_amount": this.fareData.totalFare,
      "obasefare": this.fareData.totalBaseFare,
      "ototaltax": this.fareData.totalTax,
      "ototalfare": this.fareData.totalFare,
      "total_bf": this.fareData.totalBaseFare,
      "bookingFee": this.fareData.totalbookingFee
    }
    busDetails = {
      "onwards": onwards,
      "passengerBookingDetails": this.passengerData,
      "fare": fare
    }
    var ttype;
    if (postd.busdetails.rtc == true) {

      var myString = this.onward.travels.replace(/ /g, "").toUpperCase();
      var result = myString.match(/\((.*)\)/);
      if (result != null)
        ttype = result[1];
      else
        ttype = myString;
    } else {
      ttype = '';
    }

    var saved_GST_flag;
    if (this.passengerForm.controls['saveGST']['value'] == 1)
      saved_GST_flag = 1;
    else
      saved_GST_flag = 0;

    this.busData = {
      "customer_id": this.REWARD_CUSTOMERID,
      "sourceName": postd.searchFrom,
      "discount": this.coupon_amount,
      "destinationName": postd.searchTo,
      "clientToken": "HDFC243",
      "travelType": ttype,
      "coupon_code": this.coupon_code,
      "orderId": this.orderReferenceNumber,
      "tripId": this.onward.id,
      "total_price": this.totalFare,
      "source": this.onward.source,
      "discount_amount": this.coupon_amount,
      "serviceToken": "BUS",
      "convenience_fee": this.convenience_fee,
      "partner_amount": this.intialTotalFare,
      "serviceName": "Bus",
      "operator": this.onward.travels,
      "boardingPointId": this.seacthResult.boarding,
      "droppingPointId": this.seacthResult.dropping,
      "osVersion": "",
      "destination": this.onward.destination,
      "busApiProvider": "RedBus",
      "clientName": "HDFC243",
      "partnerName": "RedBus",
      "contactDetails": this.passengerContactData,
      "busDetails": busDetails,
      "bpDpSeatlayout": postd.busdetails.rtc,
      "amenities": postd.busdetails.amenities,
      "busType": postd.busdetails.busType,
      "busTypeId": postd.busdetails.busTypeId,
      "partialCancellationAllowed": postd.busdetails.partialCancellationAllowed,
      "rating": postd.busdetails.rating,
      "vehicleType": postd.busdetails.vehicleType,
      "gstDetails": this.gstDetails,
      "bpLandMark": boardingTimesPointName[0].landmark.replace(/[^a-zA-Z0-9 - ]/g, ""),
      "dpLandMark": droppingLandmark,
      "programName": this.sg['domainName'],
      "cprogramName": this.sg['domainName'],
      "seatResponse": this.seatResponse,
      "saved_GST_flag": saved_GST_flag
    }
  }

  receivePgCharges($event) {
    this.pgCharges = $event;

  }

  goback() {
    this.searchArray = {
      searchFrom: this.seacthResult.searchFrom,
      searchTo: this.seacthResult.searchTo,
      fromTravelCode: this.seacthResult.fromTravelCode,
      toTravelCode: this.seacthResult.toTravelCode,
      departure: this.seacthResult.departure,
    };
    this.router.navigate([this.sg['domainPath'] + '/bus/search/'], {
      queryParams: this.searchArray
    });
  }
  closemsg() {
    let floorElements = document.getElementsByClassName("passenger-note" + "-" + this.domainName) as HTMLCollectionOf<HTMLElement>;
    return floorElements[0].style.display = 'none';
  }

  onFinishedTimer() {
    this.searchArray = {
      searchFrom: this.seacthResult.searchFrom,
      searchTo: this.seacthResult.searchTo,
      fromTravelCode: this.seacthResult.fromTravelCode,
      toTravelCode: this.seacthResult.toTravelCode,
      departure: this.seacthResult.departure,
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


  openBottomSheet() {
    this._bottomSheet.open(CheckoutBottomSheetComponent, {

      data: {
        onwardtravel: this.onward.travels,
        seacthresultFrom: this.seacthResult.searchFrom,
        seacthesultTo: this.seacthResult.searchTo,
        bordingPoint: this.boardingpointName,
        droppingpoint: this.droppingpointName,
        onwardDep: this.boardingpointTime,
        onwardarrv: this.droppingPointTime,
        onwardbusType: this.onward.busType,
        seacthResult: this.seacthResult.seatdetails,
        tBaseFare: this.fareData.totalBaseFare,
        tTax: this.fareData.totalTax,
        convFee: this.convenience_fee,
        coupAmt: this.coupon_amount,
        totfare: this.totalFare,
        onwTime: this.actualboarding,
        onwArrivalTime: this.actualdropping,
        busType: this.onward.busType,
        indexCoupon: this.indexCoupon,
        bookingFee: this.fareData.totalbookingFee,
        flexiDiscount: this.flexiDiscount

      }
    });
  }

}






@Component({
  selector: 'confirmation-dialog',
  templateUrl: 'dialog.html',
})
export class ConfirmationDialog {
  searchArray: any = [];
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private location: Location, private router: Router, private sg: SimpleGlobal) { }

  onYesClick(): void {
    this.dialogRef.close(true);
    if (typeof this.data.backSearchData.searchFrom === 'undefined') { } else {
      this.searchArray = {
        searchFrom: this.data.backSearchData.searchFrom,
        searchTo: this.data.backSearchData.searchTo,
        fromTravelCode: this.data.backSearchData.fromTravelCode,
        toTravelCode: this.data.backSearchData.toTravelCode,
        departure: this.data.backSearchData.departure,
      };
      this.router.navigate([this.sg['domainPath'] + '/bus/search/'], {
        queryParams: this.searchArray
      });
    }
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

    this.router.navigate([this.sg['domainPath'] + '/bus/search/'], {
      queryParams: this.backSearchData
    });
    this.dialogRef.close(true);
  }


}
