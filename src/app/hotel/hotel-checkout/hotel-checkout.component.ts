import { Component, OnInit, NgModule, ChangeDetectorRef, ElementRef, Inject, ɵConsole, Input, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import alertifyjs from 'alertifyjs';
import * as moment from 'moment';
import { DOCUMENT, NgStyle, DecimalPipe, DatePipe } from '@angular/common';
import { CountdownConfig, CountdownEvent } from 'ngx-countdown';
import { stringify } from '@angular/compiler/src/util';
import { AbstractControl } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { Subscription } from 'rxjs';
import { APP_CONFIG, AppConfig } from '../../configs/app.config';
import { CommonHelper } from 'src/app/shared/utils/common-helper';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HotelService } from 'src/app/common/hotel.service';
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
  selector: 'app-hotel-checkout',
  templateUrl: './hotel-checkout.component.html',
  styleUrls: ['./hotel-checkout.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class HotelCheckoutComponent implements OnInit {
  partnerToken: any;
  isMobile: boolean = true;
  completedSteps = 1;
  steps = 1;
  sessionTimer: any = 3;
  serviceId: string = 'hotel';
  template: string = '<div class="app-loading-new"><div class="logo"></div></div>'
  pgCharges: number = 0;
  errorMsg: any;
  validateUser: boolean = true;
  bookingFee: any;
  cdnUrl: any;
  showpassbox = false;
  gstshow = false;
  hideDelay = new FormControl(2000);
  isCollapseBasefare: boolean = false;
  isCollapseDiscount: boolean = false;
  isCollapseVas: boolean = false;
  isCollapse: boolean = false;
  convenience_fee: number = 0;
  totalBaseFare: number;
  totalFare: number = 0;
  intialTotalFare: number = 0;
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
   IsDcemiEligibleFlag: boolean = false;
  enableGST: any; enablesavedTraveller: number = 0;
    fareData: any = [];
  savedCards: any = [];
  defaultPrimary: number = 0;
  whatsappFeature: number = 0;
    appConfig: any;
  domainPath: string;
  domainRedirect: string;
  testError: any;
  XSRFTOKEN: string;
  statesdump: any = [];
  assetPath: string;

  constructor(private el: ElementRef, @Inject(APP_CONFIG) appConfig: any, public rest: RestapiService, private EncrDecr: EncrDecrService, private http: HttpClient, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute,
    private sg: SimpleGlobal, @Inject(DOCUMENT) private document: any, public commonHelper: CommonHelper, private location: Location, private dialog: MatDialog, private hotelService: HotelService, private router: Router,
    private _bottomSheet: MatBottomSheet, private _decimalPipe: DecimalPipe, private spinnerService: NgxSpinnerService, plocation: PlatformLocation, private titleService: Title, private appConfigService: AppConfigService, private modalService: NgbModal) {

    this.serviceSettings = this.appConfigService.getConfig();

    

    if (this.serviceSettings.DOMAIN_SETTINGS[this.sg['domainName']]['HOTEL'] != 1) {
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
    this.partnerToken = 'Yatra'; // make it dynamic
    
    
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

  // ngOnDestroy(): void {
  //   this.resetPopups();
  //   if (this.sessionTimer) {
  //     clearInterval(this.sessionTimer);
  //   }
  // }
  recivetotalFare($event) {
    this.flexipaysummry = false;
    this.flexiDiscount = 0;
    this.totalFare = (Number(this.intialTotalFare) + Number(this.convenience_fee)) - Number(this.coupon_amount);

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
    this.isMobile = window.innerWidth < 991 ? true : false;

  }
    resetPopups() {

    // $(".modal").hide();
    // $("body").removeAttr("style");
    // $(".modal-backdrop").remove();
  }

  goBack() {
    // this.resetPopups();
    // this.router.navigateByUrl('/');


  }
}