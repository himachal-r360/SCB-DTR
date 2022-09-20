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
          voucher_amount:number=0;
  voucher_code:string='';
        sessionTimer: any = 3;
        serviceId: string = 'Hotel';
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
        provisionalBookingId:string;
        superPnr:string;
        itineraryResponse: any = [];
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
  
    alertify.set('notifier', 'position', 'bottom-center');
  }
  noOfDays=1;
  showGstBox:boolean=false;
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
      this.totalFare = (Number(this.intialTotalFare) + Number(this.convenience_fee)) - Number(this.coupon_amount) - Number(this.flexiDiscount)- Number(this.voucher_amount);
      this.sendflexiFare = (Number(this.intialTotalFare) + Number(this.convenience_fee)) - Number(this.coupon_amount)- Number(this.voucher_amount);
    } else if (values[0].key !== 15) {
      this.flexipaysummry = false;
      this.flexiDiscount = 0;
      this.flexiIntrest = Number(values[0].value);
      this.flexiDiscount = 0;
      this.totalFare = (Number(this.intialTotalFare) + Number(this.convenience_fee)) - Number(this.coupon_amount)- Number(this.voucher_amount);
      this.sendflexiFare = this.totalFare;
    }
    
     this.createItinerarydata();
      sessionStorage.setItem(this.searchHotelKey + '-passData', this.EncrDecr.set(JSON.stringify(this.checkoutData)));
      sessionStorage.setItem(this.searchHotelKey + '-totalFare', String(this.totalFare));
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
    this.totalFare = (Number(this.intialTotalFare) + Number(this.convenience_fee)) - Number(this.coupon_amount)- Number(this.voucher_amount);

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

      this.totalFare = (Number(this.intialTotalFare) + Number(this.convenience_fee)) - (Number(this.coupon_amount) + Number(this.flexiDiscount))- Number(this.voucher_amount);
      this.sendflexiFare = (Number(this.intialTotalFare) + Number(this.convenience_fee)) - (Number(this.coupon_amount))- Number(this.voucher_amount);
      sessionStorage.setItem(this.searchHotelKey + '-totalFare', String(this.totalFare));
    } else {
      this.coupon_id = '';
      this.coupon_name = '';
      this.coupon_code = '';
      this.coupon_amount = 0;
      if (this.flexiDiscount == undefined) this.flexiDiscount = 0;
      this.totalFare = (Number(this.intialTotalFare) + Number(this.convenience_fee)) - (Number(this.coupon_amount) + Number(this.flexiDiscount))- Number(this.voucher_amount);
      this.sendflexiFare = (Number(this.intialTotalFare) + Number(this.convenience_fee)) - (Number(this.coupon_amount))- Number(this.voucher_amount);
    }
     this.createItinerarydata();
      sessionStorage.setItem(this.searchHotelKey + '-passData', this.EncrDecr.set(JSON.stringify(this.checkoutData)));
      sessionStorage.setItem(this.searchHotelKey + '-totalFare', String(this.totalFare));
  }

  /**----------REMOVE COUPON----------**/
  removeCoupon(coupon_id, coupon_amount) {
    this.coupon_id = '';
    this.coupon_name = '';
    this.coupon_code = '';
    this.coupon_amount = 0;
    this.totalFare = (Number(this.intialTotalFare) + Number(this.convenience_fee)) - Number(this.coupon_amount)- Number(this.voucher_amount);
    this.sendflexiFare = (Number(this.intialTotalFare) + Number(this.convenience_fee)) - (Number(this.coupon_amount))- Number(this.voucher_amount);
    
     this.createItinerarydata();
      sessionStorage.setItem(this.searchHotelKey + '-passData', this.EncrDecr.set(JSON.stringify(this.checkoutData)));
      sessionStorage.setItem(this.searchHotelKey + '-totalFare', String(this.totalFare));
  }

  receivePointsPlus($event) {
    this.voucher_code=$event.code;
    this.voucher_amount=$event.value;
    
      this.createItinerarydata();
      sessionStorage.setItem(this.searchHotelKey + '-passData', this.EncrDecr.set(JSON.stringify(this.checkoutData)));
      sessionStorage.setItem(this.searchHotelKey + '-totalFare', String(this.totalFare));
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
    //this.titleService.setTitle('Home | Hotels');

    this.activatedRoute.url.subscribe(url => {
      this.resetPopups();
      this.steps = 1;
      this.isMobile = window.innerWidth < 991 ? true : false;
      if (this.isMobile) {
        this._flightService.showHeader(false);
      } else {
        this._flightService.showHeader(true);
      }
        
        const jobGroup: FormGroup = new FormGroup({});
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
                    passengerLastName: customerInfo["lastname"],
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
    this.syncData();
    });
    
  }

  syncData(){
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
        
          
        this.noOfDays=moment(this.searchData.checkOut).diff(moment(this.searchData.checkIn).format('YYYY-MM-DD'), 'days');
       
        this.selectedHotel=this.searchResult.selectedHotel;
        this.partnerToken = this.searchResult.PriceSummery.partnerName;
        this.totalFare = Number(this.selectedHotel.rateBreakdown.total);
        this.intialTotalFare= Number(this.selectedHotel.rateBreakdown.total);
        this.totalBaseFare = Number(this.selectedHotel.rateBreakdown.baseFare);
        this.totalTax = Number(this.selectedHotel.rateBreakdown.tax);
        this.partnerDiscount = Number(this.selectedHotel.rateBreakdown.partnerDiscount);
        
         let bookingCode=this.selectedHotel.roomType.bookingCode;
        
        if(bookingCode.slice(0,2) !=16 && this.totalFare >=1000 && this.enableGST == 1)
        this.showGstBox=true;
        
         console.log(this.searchResult);

      if (this.searchResult != null) {
        this.domainRedirect = environment.MAIN_SITE_URL + this.sg['domainPath'] + this.domainPath;
        if (this.sg['domainPath'] != '') {
          this.domainRedirect = environment.MAIN_SITE_URL + this.domainPath;
        }
      } else {
        this.router.navigate(['/' + this.sg['domainPath'], 'compare-stay']);
      }

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
    this.resetPopups();
    let url = "hotel-list?" + decodeURIComponent(this.ConvertObjToQueryString(this.searchData));
    this.router.navigateByUrl(url);
  }
  
    gstmodalcheckedvalue:any = false;
    openmodal(content) {
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  bookingSessionExpires(e: CountdownEvent) {
    if (e.action == 'done') {
      $('#bookingprocessExpires').modal('show');
    }
  }
  
  
  ConvertObjToQueryString(obj: any) {
    var str = [];
    for (var p in obj) {
      if (obj.hasOwnProperty(p)) {
        if (typeof (obj[p]) == "object") {
          let objRooms: any = obj[p];
          for (var i = 0; i < objRooms.length; i++) {
            let objRoomObj: any = objRooms[i];
            for (var roomField in objRoomObj) {
              if (objRoomObj.hasOwnProperty(roomField)) {
                str.push(encodeURIComponent(roomField) + "[" + i + "]=" + encodeURIComponent(objRoomObj[roomField]));
              }
            }
          }
        } else {
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
      }
    }
    return str.join("&");
  }

  
  resetPopups() {

    $(".modal").hide();
    $("body").removeAttr("style");
    $(".modal-backdrop").remove();
  }

  goBack() {
    this.resetPopups();
    this.router.navigateByUrl('/compare-stay');


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

  convertToUpperCase($event) {
    $event.target.value = $event.target.value.toUpperCase();
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
  



  mmtTxnKey:any;
  createHotelItinerary() {
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

  
   if (this.passengerForm.invalid ) {
        let target;
        target = this.el.nativeElement.querySelector('.ng-invalid:not(form)');
        if (target) {
        if( target.id =='agree_terms'){
        $(document).scrollTop($(document).height());
        }else{
        target.scrollIntoView();
        (target as HTMLElement).focus();
        }
        }
      return;
    } else {
    

    
        if(this.partnerToken=='Cleartrip'){
         this.itineraryProcess();
        }else{
        /********Check Availablity***********/
                $('#infoprocess').modal('show');
        this.loaderValue = 10;
        const myInterval1 = setInterval(() => {
        this.loaderValue = this.loaderValue + 10;
        if (this.loaderValue == 110) {
        this.loaderValue = 10;
        }
        }, 700);
    
        
          let rooms:any=[];
                
        for(let i=0;i<(this.searchData.rooms.length);i++){
         rooms.push({
        "childrenAge": this.searchData.rooms[i]['childrenAge'],
        "numberOfAdults":this.searchData.rooms[i]['numberOfAdults'],
        "numberOfChildren": this.searchData.rooms[i]['numberOfChildren'],
        "room":  this.searchData.rooms[i]['room'],
        "roomRatePlanId":this.selectedHotel.roomType.roomTypeCode,
        "roomTypeId": this.selectedHotel.roomType.roomTypeId,
        "bookingCode": this.selectedHotel.roomType.bookingCode
        });
        }
        
       
        let checkAvailablity;
        checkAvailablity={
        "checkIn": this.searchResult.hotel_detail.checkIn,
        "checkOut": this.searchResult.hotel_detail.checkOut,
        "clientName": "HDFC243",
        "cityName":  this.searchResult.hotel_detail.city,
        "noOfRooms":this.searchData.numberOfRooms,
        "hotelId": this.searchResult.Hotelkey,
        "blockid_quantity": [
        {
        "blockId": this.searchResult.selectedHotel.roomType.roomTypeId,
        "quantity": this.searchData.numberOfRooms
        }
        ],
        "roomIds": [
        this.searchResult.selectedHotel.roomType.roomTypeId
        ],
        "guestCurrency": "INR",
        "guestCountry": "IN",
        "scr": "INR",
        "sct": "IN",
        "partnerName": this.partnerToken,
        "rooms": rooms
        };
        
        var requestParams = {
        postData: this.EncrDecr.set(JSON.stringify(checkAvailablity))
        };
        
        
        this.rest.checkAvailabilityHotel(requestParams).subscribe(results => {
        $('#infoprocess').modal('hide');
         let response = JSON.parse(this.EncrDecr.get(results.result));
         if(response && response.response && response.response.mmtTxnKey &&  response.response.mmtTxnKey !=''){
         this.mmtTxnKey=response.response.mmtTxnKey;
          this.itineraryProcess();
         }else{
          clearInterval(myInterval1);
        setTimeout(() => {
        $('#infoprocess').modal('hide');
        $('#bookingprocessFailed').modal('show');
        }, 20);
         
         }

        }), (err: HttpErrorResponse) => {
        clearInterval(myInterval1);
        setTimeout(() => {
        $('#infoprocess').modal('hide');
        $('#bookingprocessFailed').modal('show');
        }, 20);
        }
        
        
        }
        
    }

  }
  
  
  itineraryProcess(){
  
       var gender; 
       switch (this.passengerForm.controls['passengerTitle']['value']) {
        case 'Mr':
        gender='MALE';
        break;
        case 'Mrs':
        gender='FEMALE';
        break;
        case 'Ms':
        gender='FEMALE';
        break;
        default:
        gender='Male';

        }
        let room_values:any=[];
        
        
      if (this.gstSelected) {
        this.gstDetails = {
          "city": this.passengerForm.controls['gstCity']['value'],
          "address": this.passengerForm.controls['gstAddress']['value'],
          "gstNumber": this.passengerForm.controls['gstNumber']['value'],
          "name": this.passengerForm.controls['gstBusinessName']['value'],
          "pincode": this.passengerForm.controls['gstPincode']['value'],
          "state": this.passengerForm.controls['gstState']['value']
        }
        if (this.enablesavedTraveller == 1)
          this.saveCustomerGst();
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
        
        
        for(let i=0;i<(this.searchData.rooms.length);i++){
         room_values.push({
        "childrenAge": this.searchData.rooms[i]['childrenAge'],
        "numberOfAdults":this.searchData.rooms[i]['numberOfAdults'],
        "numberOfChildren": this.searchData.rooms[i]['numberOfChildren'],
        "room":  this.searchData.rooms[i]['room'],
        "roomRatePlanId":this.selectedHotel.roomType.roomTypeCode,
        "roomTypeId": this.selectedHotel.roomType.roomTypeId
        });
        }
        
        this.itineraryParam ={
        "bookingAmount":this.selectedHotel.rateBreakdown.total,
        "bookingCode": this.selectedHotel.roomType.bookingCode,
        "checkIn": this.searchData.checkIn,
        "checkOut": this.searchData.checkOut,
        "clientName": "HDFC243",
        "couponCode": "",
        "customer-ip-address": "",
        "customerId": this.REWARD_CUSTOMERID,
        "customerInfo": {
        "title": this.passengerForm.controls['passengerTitle']['value'],
        "firstName": this.passengerForm.controls['passengerFirstName']['value'],
        "lastName": this.passengerForm.controls['passengerLastName']['value'],
        "email": this.passengerForm.controls['passengerEmail']['value'],
        "mobile": this.passengerForm.controls['passengerMobile']['value'],
        "city": "",
        "country": "",
        "postalCode": "",
        "paxType": "ADULT",
        "gender": gender,
        "state": "",
        "streetAddress1": "",
        "nationality": ""
        },
         "gst": this.gstDetails,
        "discountAmount": 0,
        "hotelId": this.searchResult.Hotelkey,
        "mobileCountryCode": 91,
        "noOfRooms": this.searchData.numberOfRooms,
        "operator": "",
        "orderId": "",
        "osVersion": "web",
        "partnerName": this.partnerToken,
        "roomTypeCode": this.selectedHotel.roomType.roomTypeCode,
        "mmtTxnKey":this.mmtTxnKey,
        "rooms": room_values,
        "serviceName": "Hotel"
        };
        
        this.resetPopups();

         $('#infoprocess').modal('show');
        this.loaderValue = 10;
        const myInterval2 = setInterval(() => {
        this.loaderValue = this.loaderValue + 10;
        if (this.loaderValue == 110) {
        this.loaderValue = 10;
        }
        }, 700);


      var requestParamsEncrpt = {
        postData: this.EncrDecr.set(JSON.stringify(this.itineraryParam))
      };
      this.rest.createHotelItinerary(requestParamsEncrpt).subscribe(results => {
        let response = JSON.parse(this.EncrDecr.get(results.result));
            
        if (response && response['response'] && response['response']['provisionalBookingId']) {
        this.itineraryResponse=response['response'];
        this.orderReferenceNumber=response['response']['order_id'];
        this.provisionalBookingId=response['response']['provisionalBookingId'];
        this.superPnr=response['response']['superPnr'];
        this.saveCheckout(myInterval2);
        }else{
        clearInterval(myInterval2);
        setTimeout(() => {
        $('#infoprocess').modal('hide');
        $('#bookingprocessFailed').modal('show');
        }, 20);
        }
      
      }), (err: HttpErrorResponse) => {
        clearInterval(myInterval2);
        setTimeout(() => {
          $('#infoprocess').modal('hide');
          $('#bookingprocessFailed').modal('show');
        }, 20);
      }
  
  
  }
  
  
  
  
  saveCheckout(interval){
      this.createItinerarydata();
    //  console.log(this.checkoutData);return;
    var saveCheckoutData = {
      orderReferenceNumber: this.orderReferenceNumber,
      flightData: this.EncrDecr.set(JSON.stringify(this.checkoutData))
    };

console.log(this.orderReferenceNumber);
    let trackUrlParams = new HttpParams()
      .set('current_url', window.location.href)
      .set('category', 'Hotel')
      .set('event', 'Save Checkout')
      .set('metadata', '{"save_checkout":"' + this.EncrDecr.set(JSON.stringify(JSON.stringify(saveCheckoutData))) + '"}');

    const track_body: string = trackUrlParams.toString();
    this.rest.trackEvents(track_body).subscribe(result => { });

    this.rest.saveCheckout(JSON.stringify(saveCheckoutData)).subscribe(rdata => {
      if (rdata == 1) {
        sessionStorage.setItem(this.searchHotelKey + '-clientTransactionId', this.provisionalBookingId);
        sessionStorage.setItem(this.searchHotelKey + '-orderReferenceNumber', this.orderReferenceNumber);
        sessionStorage.setItem(this.searchHotelKey + '-ctype', 'hotels');
        sessionStorage.setItem(this.searchHotelKey + '-totalFare', String(this.totalFare));
        sessionStorage.setItem(this.searchHotelKey + '-passData', this.EncrDecr.set(JSON.stringify(this.checkoutData)));
        sessionStorage.setItem(this.searchHotelKey + '-passFareData', btoa(JSON.stringify(this.fareData)));
        clearInterval(interval);

        this.gotoTop();
         this.steps = 2;
         this.completedSteps = 2;
        setTimeout(() => {
          $('#infoprocess').modal('hide');
        }, 10);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          $('#infoprocess').modal('hide');
          $('#bookingprocessFailed').modal('show');
        }, 10);
      }
    });

  }
  
  isPaynowClicked: boolean = false;
  continuePayment() {
    //console.log($(".accordion-button:not(.collapsed)").attr("id"));return;
    switch ($(".accordion-button:not(.collapsed)").attr("id")) {
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
  
  checkoutData:any;
  createItinerarydata() {


 var whatsappFlag;
      if (this.whatsappFeature == 1)
        whatsappFlag = this.passengerForm.controls['whatsappFlag']['value'];
      else
        whatsappFlag = 0;
       
    
        let tmp_searchResult:any={};
        tmp_searchResult['queryHotelData'] =this.searchResult['queryHotelData'];  
        tmp_searchResult['selectedHotel'] =this.searchResult['selectedHotel'];   
      
    //  console.log(tmp_searchResult);return;  
    let all_room_array:any={};
    
      for(let i=0;i<(this.searchData.rooms.length);i++){
        all_room_array['room'+(i+1)]=[];
        all_room_array['room'+(i+1)]={
        "adult": Number(this.searchData.rooms[i]['numberOfAdults']),
        "child": Number(this.searchData.rooms[i]['numberOfChildren']),
        "bedTypeId": 0,
        "smokingPreference": "",
        "specialrequests": ""
        };
        }
        
    
    //console.log(all_room_array); console.log(a);return;
        
        this.fareData = {
        "total_tax": this.totalTax,
        "total_amount": this.intialTotalFare,
        "partnerDiscount":this.partnerDiscount,
        "totalDiscount": 0,
        "totalBaseFare": this.totalBaseFare,
        "couponDiscount": 0,
        "discount": this.coupon_amount,
        "voucher_amount": this.voucher_amount,
        "voucher_code": this.voucher_code,
        "couponcode": "",
        "totalFare":this.intialTotalFare
        };    
        
        
    let roomTypeId=this.selectedHotel.roomType.roomTypeId;
    let currentDate=moment(this.searchData.checkIn).format('DD-MM-YYYY');
    
    let farebreakup:any={};
    
    farebreakup[currentDate]=[];
    
    farebreakup[currentDate]={
      "dis": 0,
      "total": this.intialTotalFare,
      "basefare": this.totalBaseFare,
      "partnerDiscount":this.partnerDiscount,
      "tax": this.totalTax
    };
    
    
    
    let checkoutData = {
    "provisionalBookingId": this.provisionalBookingId,
    "booking_code": this.selectedHotel.roomType.bookingCode,
    "hotelid": this.searchResult.Hotelkey,
    "superPnr": this.superPnr,
    "hoteldetails": {
    "booking-date":moment().format('YYYY-MM-DD'),
    "number-of-nights":  this.noOfDays,
    "number-of-room-nights": this.noOfDays,
    "country": this.searchData.country,
    "check-in-date": this.searchData.checkIn,
    "check-out-date": this.searchData.checkOut,
    "check-in-time": this.searchResult.hotel_detail.checkIn,
    "check-out-time": this.searchResult.hotel_detail.checkOut,
    "city":  this.searchData.city,
    "number-of-rooms": this.searchData.numberOfRooms,
    "hotelid": this.searchResult.Hotelkey,
    "hotelname": this.searchResult.hotel_detail.hotelName,
    "hoteladdress": this.searchResult.hotel_detail.address,
    "hotelImageUrl": this.searchResult.hotel_detail.images[0]['wideAngleImageUrl'],
    "room_type_id": this.selectedHotel.roomType.roomTypeId,
    "room_type_code": this.selectedHotel.roomType.roomTypeCode,
    "room_dec": this.selectedHotel.roomType.roomDescription,
    "hotelratings":  this.searchResult.hotel_detail.hotelRatings[0]['rating'],
    "provid": this.provisionalBookingId,
    "booking_code": this.selectedHotel.roomType.bookingCode,
    "roomdetails": all_room_array,
    "inclusions": {
      "inclusion": []
    }
  },
  "fare": this.fareData,
  "partner_amount": this.intialTotalFare,
  "discount": 0,
  "coupon_code": "",
  "farebreakup":farebreakup,
  "partnerToken": this.partnerToken,
  "serviceToken": "Hotel",
  /*"hotel_details": {
    "response": {
      "partnerName": this.partnerToken,
      "validResponse": true,
      "hotelInfo": this.searchResult.hotel_detail
    },
    "statusCode": 200,
    "responseDateTime": ""
  },*/
  "room_details_book": {
    roomTypeId: {
      "roomTypeId": this.selectedHotel.roomType.roomTypeId,
      "roomTypeCode": this.selectedHotel.roomType.roomTypeCode,
      "bookingCode": this.selectedHotel.roomType.bookingCode,
      "roomname": this.selectedHotel.roomType.roomDescription,
      "price": this.intialTotalFare,
      "noOFRoomsLeft": "",
      "maxOccupancy": "",
      "guessadded": this.totalAdult,
      "childadded":  this.totalChild,
      "roomsadded": this.searchData.numberOfRooms
    }
  },
  "search_input": {
    "cityname": this.searchData.city+', '+this.searchData.countryName,
    "city_id": this.searchData.city,
    "country": this.searchData.country,
    "hotel_name": "",
    "lattitude": "",
    "longitude": "",
    "hotel_id": "",
    "area": "",
    "label_name": "",
    "checkin": moment( this.searchData.checkIn).format('DD MMM YYYY'),
    "checkout": moment( this.searchData.checkOut).format('DD MMM YYYY'),
    "num_rooms": this.searchData.numberOfRooms,
    "numberOfAdults": this.totalAdult,
    "numberOfChildren": this.totalChild,
    "t": "ZWFybg==",
    "hotel_search_done": "0",
    "hotel_modify": "0",
    "arrive": moment( this.searchData.checkOut).format('DD/MM/YYYY'),
    "depart": moment( this.searchData.checkIn).format('DD/MM/YYYY'),
    "session_hotels_key": this.searchHotelKey
  },
  "room_input": {
    "image": this.selectedHotel.imageInfo.wideAngleImageurl,
    "room_dec": this.selectedHotel.roomType.roomDescription,
    "room_type_code":   this.selectedHotel.roomType.roomTypeCode,
    "bookingCode":   this.selectedHotel.roomType.bookingCode,
    "room_type_id": this.selectedHotel.roomType.roomTypeId,
    "room_title":this.selectedHotel.roomType.roomTitle,
    "room_total": this.intialTotalFare,
    "room_left": "",
    "room_max_occupancy": "",
    "booking_code":  this.selectedHotel.roomType.bookingCode,
    "provisional-booking-required": "",
    "roomcount": this.searchData.noOfRooms,
    "addedguest": this.totalAdult,
    "addedchild": this.totalChild,
    "t": "ZWFybg=="
  },
  "contactDetails": {
    "title": this.passengerForm.controls['passengerTitle']['value'],
    "firstName": this.passengerForm.controls['passengerFirstName']['value'],
    "lastName": this.passengerForm.controls['passengerLastName']['value'],
    "mobile": this.passengerForm.controls['passengerMobile']['value'],
    "email": this.passengerForm.controls['passengerEmail']['value']
  },
  "guest_data": {
    "provid": "",
    "AdultId1": "",
    "title": this.passengerForm.controls['passengerTitle']['value'],
    "firstName": this.passengerForm.controls['passengerFirstName']['value'],
    "lastName": this.passengerForm.controls['passengerLastName']['value'],
    "mobile": this.passengerForm.controls['passengerMobile']['value'],
    "email": this.passengerForm.controls['passengerEmail']['value'],
    "whatsappFlag": whatsappFlag,
    "gst_number": this.passengerForm.controls['gstNumber']['value'],
    "gst_name": this.passengerForm.controls['gstBusinessName']['value'],
    "gst_address": this.passengerForm.controls['gstAddress']['value'],
    "gst_city": this.passengerForm.controls['gstCity']['value'],
    "gst_pincode": this.passengerForm.controls['gstPincode']['value'],
    "gst_state":this.passengerForm.controls['gstState']['value']
  },
  "order_ref_num": this.orderReferenceNumber,
  "amd_url": "",
  "redirect_url": "",
  "sessionKey":this.searchHotelKey,
   "docKey": this.searchResult.docKey,
   "itineraryRequest":this.itineraryParam,
  "hotelSessionData":tmp_searchResult
};


this.checkoutData=checkoutData;
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
