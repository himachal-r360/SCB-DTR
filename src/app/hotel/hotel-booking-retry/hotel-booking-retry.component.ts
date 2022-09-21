import { Component, OnInit, OnDestroy, DebugNode, NgModule, ViewChild, ChangeDetectorRef, ElementRef, Inject, ɵConsole, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { FlightService } from 'src/app/common/flight.service';
import { Location } from '@angular/common';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { SimpleGlobal } from 'ng2-simple-global';
import { environment } from '../../../environments/environment';
import { AppConfigService } from '../../app-config.service';
import { EncrDecrService } from 'src/app/shared/services/encr-decr.service';
import { RestapiService } from 'src/app/shared/services/restapi.service';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import alertifyjs from 'alertifyjs';
import * as moment from 'moment';
import { DOCUMENT, NgStyle, DecimalPipe, DatePipe } from '@angular/common';
import { CountdownConfig, CountdownEvent } from 'ngx-countdown';
import { stringify } from '@angular/compiler/src/util';


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
  selector: 'app-hotel-booking-retry',
  templateUrl: './hotel-booking-retry.component.html',
  styleUrls: ['./hotel-booking-retry.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class HotelBookingRetryComponent implements OnInit, OnDestroy {
        savedCards: any = [];
        XSRFTOKEN: string;
        IsDcemiEligibleFlag: boolean = false;
        isFlexipayEligibleFlag: boolean = false;
        sendflexiFare: any;
        flexiIntrest: any;
        showFlexipay: any;
        flexipaysummry: any;
        flexiDiscount: any;
        checkoutData:any;
        searchData:any=[];
        searchHotelKey: string;
        totalBaseFare: number;
        totalFare: number = 0;
        intialTotalFare: number = 0;
        totalTax: number;
        partnerDiscount:number;
        totalAdult:number = 0;
        totalChild:number = 0;
        completedSteps = 2;
        loaderValue = 10;
        cdnUrl: any;
        serviceSettings: any;
        customerInfo: any;
        coupon_code: any;
        coupon_amount: number = 0;
        voucher_amount:number=0;
        voucher_code:string='';
        REWARD_CUSTOMERID: string= '0000';
        REWARD_EMAILID: string;
        REWARD_MOBILE: string;
        REWARD_CUSTOMERNAME: string;
        REWARD_TITLE: string;
        partnerToken: any;
        EMI_interest: number = 16;
        EMIAvailableLimit: number = 3000;
        sessionTimer: any = 3;
        steps: any =2;
        mobileNumber: any;
        showLoader: number = 1;
        serviceId: string = 'Flight';
        isMobile: boolean = true;
        convenience_fee: number = 0;
        fetchOrderId:string;
           provisionalBookingId:string;
        superPnr:string;
          fareData: any = [];

  constructor(private el: ElementRef,private ref: ChangeDetectorRef,   private _flightService: FlightService, private route: ActivatedRoute, private router: Router, private sg: SimpleGlobal, private appConfigService: AppConfigService, private EncrDecr: EncrDecrService, public rest: RestapiService, private modalService: NgbModal, @Inject(DOCUMENT) private document: any) {
    this.route.url.subscribe(url => {
      this.cdnUrl = environment.cdnUrl + this.sg['assetPath'];
      this.serviceSettings = this.appConfigService.getConfig();
    });

  }
  

 ngAfterContentChecked() {
     }
  ngOnInit(): void {
      this.fetchOrderId=atob(this.route.snapshot.queryParamMap.get('bookingId'));
      this.resetPopups();
      this.steps = 2;
      this.isMobile = window.innerWidth < 991 ? true : false;
      if (this.isMobile) {
        this._flightService.showHeader(false);
      } else {
        this._flightService.showHeader(true);
      }

      /*** SESSION */
      setTimeout(() => {
        //Check Laravel Seesion
        if (this.sg['customerInfo']) {
          this.customerInfo = this.sg['customerInfo'];
           var customerInfo = this.sg['customerInfo'];
            if (customerInfo["org_session"] == 1) {
             // console.log(this.fetchOrderId);return;
                var getOrder = {
                "order_ref_num": this.fetchOrderId,
                }

                var getOrderParam = {
                postData: this.EncrDecr.set(JSON.stringify(getOrder))
                };
                this.rest.getOrderDetail(getOrderParam).subscribe(results => { 
                if (results.result) {
                let result = JSON.parse(this.EncrDecr.get(results.result));
              if (customerInfo["guestLogin"] == true) {
                this.REWARD_CUSTOMERID = customerInfo["id"];
                this.XSRFTOKEN = customerInfo["XSRF-TOKEN"];
                this.IsDcemiEligibleFlag = true;
                this.isFlexipayEligibleFlag = true;
              } else {
                this.fareData=result.fare;     
                this.checkoutData=result;
                this.searchHotelKey=result.search_input.session_hotels_key;
                this.partnerToken = result.partnerToken;
                this.totalFare = Number(result.fare.total_amount);
                this.intialTotalFare= Number(result.fare.total_amount);
                this.totalBaseFare = Number(result.fare.totalBaseFare);
                this.totalTax = Number(result.fare.total_tax);
                this.partnerDiscount = Number(result.fare.partnerDiscount);
                this.orderReferenceNumber=result.hoteldetails.provid;
                this.provisionalBookingId=result.hoteldetails.booking_code;
                this.coupon_code=result.fare.couponcode;
                this.coupon_amount=result.fare.discount;
                this.voucher_amount=result.fare.voucher_amount;
                this.searchData=result.hotelSessionData.queryHotelData;
                sessionStorage.setItem(this.searchHotelKey + '-clientTransactionId', this.provisionalBookingId);
                sessionStorage.setItem(this.searchHotelKey + '-orderReferenceNumber', this.orderReferenceNumber);
                sessionStorage.setItem(this.searchHotelKey + '-ctype', 'hotels');
                sessionStorage.setItem(this.searchHotelKey + '-totalFare', String(this.totalFare));
                sessionStorage.setItem(this.searchHotelKey + '-passData', this.EncrDecr.set(JSON.stringify(this.checkoutData)));
                sessionStorage.setItem(this.searchHotelKey + '-passFareData', btoa(JSON.stringify(this.fareData)));
                 
                this.syncCustomer(customerInfo);
                  
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
              }
              }
              });
            
            } else {
              this.REWARD_CUSTOMERID = '0000';
              this.REWARD_EMAILID = '';
              this.REWARD_MOBILE = '';
              this.REWARD_CUSTOMERNAME = '';
              this.XSRFTOKEN = 'NULL';
              if (environment.localInstance == 0)
                this.document.location.href = environment.MAIN_SITE_URL + this.sg['domainPath'] + 'check-login';
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


  }

 syncCustomer(customerInfo){
        this.REWARD_CUSTOMERID = customerInfo["id"];
        this.REWARD_EMAILID = customerInfo["email"];
        this.REWARD_MOBILE = customerInfo["mobile"];
        this.REWARD_TITLE = customerInfo["title"];
        this.REWARD_CUSTOMERNAME = customerInfo["firstname"] + " " + customerInfo["lastname"];
        this.XSRFTOKEN = customerInfo["XSRF-TOKEN"];
 }        

isPaynowClicked:boolean=false;
continuePayment(){
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
        if($(".addCardTab[aria-selected='true']").attr("aria-selected"))
        $('.btn-pay-card').trigger('click');

        if($(".addRupayTab[aria-selected='true']").attr("aria-selected"))
        $('.btn-pay-rupay').trigger('click');

        break;  

        case 'tab-emi': 
        if($(".ccemiTab[aria-selected='true']").attr("aria-selected"))
        $('.btn-pay-emi-cc').trigger('click');
         
        break;  
         case 'tab-testPg': 
        $('.btn-pay-test').trigger('click');
        break;  
      }

}
 
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
      sessionStorage.setItem(this.searchHotelKey + '-totalFare', String(this.totalFare));
  }

  recivetotalFare($event) {
    this.flexipaysummry = false;
    this.flexiDiscount = 0;
    this.totalFare = (Number(this.intialTotalFare) + Number(this.convenience_fee)) - Number(this.coupon_amount)- Number(this.voucher_amount);

  }


  bookingSessionExpires(e: CountdownEvent) {

    if (e.action == 'done') {
     this.triggerBack();
      //$('#bookingprocessExpires').modal('show');
    }

  }


  calculateEMI(amount: number) {
    return Math.round((amount + (amount * (this.EMI_interest / 100))) / 12);
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


  triggerBack() {
    $('#bookingprocessFailed').modal('hide');
    this.resetPopups();
    let url = "hotel-list?" + decodeURIComponent(this.ConvertObjToQueryString(this.searchData));
    this.router.navigateByUrl(url);
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


  orderReferenceNumber:any;


  ngOnDestroy(): void {
    this.resetPopups();
    if (this.sessionTimer) {
      clearInterval(this.sessionTimer);
    }
  }




}

