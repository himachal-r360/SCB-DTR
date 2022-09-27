import { Component, OnInit, OnDestroy, DebugNode, NgModule, ViewChild, ChangeDetectorRef, ElementRef, Inject, ɵConsole, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { FlightService } from 'src/app/common/flight.service';
import { Location } from '@angular/common';
import { SimpleGlobal } from 'ng2-simple-global';
import { environment } from '../../../environments/environment';
import { AppConfigService } from '../../app-config.service';
import { EncrDecrService } from 'src/app/shared/services/encr-decr.service';
import { RestapiService } from 'src/app/shared/services/restapi.service';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import * as moment from 'moment';
import { DOCUMENT, NgStyle, DecimalPipe, DatePipe } from '@angular/common';
import { CountdownConfig, CountdownEvent } from 'ngx-countdown';
import { stringify } from '@angular/compiler/src/util';
declare var $: any;
@Component({
  selector: 'app-flight-booking-retry',
  templateUrl: './flight-booking-retry.component.html',
  styleUrls: ['./flight-booking-retry.component.scss']
})
export class FlightBookingRetryComponent implements OnInit, OnDestroy {
  savedCards: any = [];
  XSRFTOKEN: string;
  IsDcemiEligibleFlag: boolean = false;
  isFlexipayEligibleFlag: boolean = false;
  sendflexiFare: any;
  flexiIntrest: any;
  showFlexipay: any;
  flexipaysummry: any;
  flexiDiscount: any;
  priceSummaryResponse: any;
  pricingId: any;
  itineraryid: any;
  partnerConvFee: number = 0;
  old_fare: number = 0;
  new_fare: number = 0;
  flightSessionData: any;
  flightInfo: any;
  itinararyResponse: any;
  enableVAS: number = 0;
  completedSteps = 1;
  loaderValue = 10;
  maxAdults: number;
  maxChilds: number;
  maxInfants: number;
  cdnUrl: any;
  serviceSettings: any;
  flightClasses: any;
  whatsappFeature: number = 0;
  customerInfo: any;
  coupon_code: any;
  coupon_amount: number = 0;
  voucher_amount:number=0;
  voucher_code:string='';
  vas_amount: number = 0;
  REWARD_CUSTOMERID: string= '0000';
  REWARD_EMAILID: string;
  REWARD_MOBILE: string;
  REWARD_CUSTOMERNAME: string;
  REWARD_TITLE: string;
  totalCollectibleAmount: any;
  totalCollectibleAmountFromPartnerResponse: any;
  totalCollectibleAmountFromPartnerResponseOrg: any;
  onwardAmount: any;
  returnAmount: any;
  convenience_fee: number = 0;
  partnerToken: any;
  flightOnwardDetails: any;
  flightReturnDetails: any;

  selectedOnwardVendor: any;
  selectedReturnVendor: any;

  countryJson: any;
  EMI_interest: number = 16;
  EMIAvailableLimit: number = 3000;
  totalOnwardDuration: number = 0;
  totalReturnDuration: number = 0
  randomFlightDetailKey: any;
  searchData: any;
  searchDataOrg:any;
  BaseFare: any;
  Tax: any;
  TotalFare: any;
  AdtFare: number = 0;
  ChildFare: number = 0;
  InfantTotalFare: number = 0;
  sessionTimer: any = 3;

  AdtQuantity: number = 0;
  ChildQuantity: number = 0;
  InfantQuantity: number = 0;

  AdtBaseFare: number = 0;
  ChildBaseFare: number = 0;
  InfantBaseFare: number = 0;

  steps: any =5;

  travelerDetails: any = {};
  mobileNumber: any;
  showLoader: number = 1;
  serviceId: string = 'Flight';
  isMobile: boolean = true;
  isCollapseBasefare: boolean = false;
  isCollapseDiscount: boolean = false;
  isCollapseVas: boolean = false;
  isCollapse: boolean = false;

  fetchOrderId:string;

  constructor(private el: ElementRef,private ref: ChangeDetectorRef,  private _flightService: FlightService, private route: ActivatedRoute, private router: Router, private sg: SimpleGlobal, private appConfigService: AppConfigService, private EncrDecr: EncrDecrService, public rest: RestapiService, @Inject(DOCUMENT) private document: any) {
    this.route.url.subscribe(url => {
      this.cdnUrl = environment.cdnUrl + this.sg['assetPath'];
      this.serviceSettings = this.appConfigService.getConfig();
      this.flightClasses = this.serviceSettings.flightClasses;
    });

  }
  

 ngAfterContentChecked() {
     }
  ngOnInit(): void {
      this.randomFlightDetailKey=this.route.snapshot.queryParamMap.get('bookingId');
      this.fetchOrderId=atob(this.route.snapshot.queryParamMap.get('bookingId'));
      this.resetPopups();
      this.steps = 5;
      this.isMobile = window.innerWidth < 991 ? true : false;
      if (this.isMobile) {
        this._flightService.showHeader(false);
      } else {
        this._flightService.showHeader(true);
      }


      /*** SESSION */
      sessionStorage.removeItem("coupon_amount");
      setTimeout(() => {
        //Check Laravel Seesion
        if (this.sg['customerInfo']) {
          this.customerInfo = this.sg['customerInfo'];
           var customerInfo = this.sg['customerInfo'];
            if (customerInfo["org_session"] == 1) {
              // console.log(customerInfo)
              
            
                var getOrder = {
                "order_ref_num": this.fetchOrderId,
                }

                var getOrderParam = {
                postData: this.EncrDecr.set(JSON.stringify(getOrder))
                };
                this.rest.getOrderDetail(getOrderParam).subscribe(results => { 
          
                if (results.result) {
                let result = JSON.parse(this.EncrDecr.get(results.result));
            
             /* if (customerInfo["guestLogin"] == true) {
                this.REWARD_CUSTOMERID = customerInfo["id"];
                this.XSRFTOKEN = customerInfo["XSRF-TOKEN"];
                this.IsDcemiEligibleFlag = true;
                this.isFlexipayEligibleFlag = true;
              } else {*/
                this.flightSessionData=result.flightSessionData;
                this.searchData = (this.flightSessionData.queryFlightData);
                this.searchDataOrg = this.searchData ;
                
                setTimeout(() => {
                }, 10);
                if( this.flightSessionData['travel_type']=='M') {
                //Multicity
                this.maxAdults = Number(this.searchData[0].adults);
                this.maxChilds = Number(this.searchData[0].child);
                this.maxInfants = Number(this.searchData[0].infants);
                this.travelerDetails['adults'] = this.searchData[0].adults;
                this.travelerDetails['child'] = this.searchData[0].child;
                this.travelerDetails['infants'] = this.searchData[0].infants;
                this.partnerToken = this.flightSessionData.onwardFlights[0]['priceSummery']['partnerName'];
                this.flightOnwardDetails = this.flightSessionData.onwardFlights; 
                this.selectedOnwardVendor = this.flightSessionData.onwardFlights[0]['priceSummery'];
                this.searchData['adults'] = this.searchData[0].adults;
                this.searchData['child'] = this.searchData[0].child;
                this.searchData['infants'] = this.searchData[0].infants;
                this.searchData['flightclass'] = this.searchData[0].flightclass;

                this.searchData['travel'] = 'DOM';
                for (let j = 0; j < this.flightSessionData.queryFlightData.length; j++) {
                if(this.flightSessionData.queryFlightData[j]['fromContry'] != 'IN' || this.flightSessionData.queryFlightData[j]['toContry'] != 'IN'){
                this.searchData['travel'] = 'INT';
                }
                }
                this.flightReturnDetails = [];
                }else{
                this.maxAdults = Number(this.searchData.adults);
                this.maxChilds = Number(this.searchData.child);
                this.maxInfants = Number(this.searchData.infants);
                this.travelerDetails = this.searchData;


                if (this.flightSessionData.travel == 'DOM') {
                this.flightOnwardDetails = this.flightSessionData.onwardFlights;
                this.selectedOnwardVendor = this.flightSessionData.onwardPriceSummary;
                this.selectedReturnVendor = this.flightSessionData.returnPriceSummary;

                if (this.flightSessionData.returnFlights)
                this.flightReturnDetails = this.flightSessionData.returnFlights;
                else
                this.flightReturnDetails = [];

                } else {

                this.flightOnwardDetails = this.flightSessionData.onwardFlights;
                this.selectedOnwardVendor = this.flightSessionData.onwardPriceSummary;
                this.selectedReturnVendor = [];


                if (this.flightSessionData.returnFlights)
                this.flightReturnDetails = this.flightSessionData.returnFlights;
                else
                this.flightReturnDetails = [];
                }
                this.partnerToken = this.selectedOnwardVendor.partnerName;
                } 
                  this.BaseFare =  Number(result.flightDetails.fare.totalbf);
                this.Tax =  Number(result.flightDetails.fare.others);
                this.TotalFare =  Number(result.flightDetails.fare.totalFare);
                
                this.totalCollectibleAmount = Number(result.flightDetails.fare.totalFare)- Number(result.flightDetails.fare.discount)- Number(result.flightDetails.fare.voucher_amount);
                this.totalCollectibleAmountFromPartnerResponse = Number(result.flightDetails.fare.totalFare);
                this.totalCollectibleAmountFromPartnerResponseOrg = Number(result.flightDetails.fare.totalFare);
                this.voucher_amount= Number(result.flightDetails.fare.voucher_amount);
             
                
                this.convenience_fee =  Number(result.flightDetails.fare.partnerConvFee);
                this.partnerConvFee =  Number(result.flightDetails.fare.partnerConvFee);
                this.coupon_amount =  Number(result.flightDetails.fare.discount);
                
                this.AdtQuantity =  this.maxAdults;
                this.AdtBaseFare =  Number(result.flightDetails.fare.pass_break.ADT);
                this.ChildQuantity =   this.maxAdults;
                this.ChildBaseFare =  Number(result.flightDetails.fare.pass_break.CHD);
                this.InfantQuantity =   this.maxAdults;
                this.InfantBaseFare =  Number(result.flightDetails.fare.pass_break.INF);
                 
                 
                sessionStorage.setItem(this.randomFlightDetailKey + '-clientTransactionId', result.itineraryid);
                sessionStorage.setItem(this.randomFlightDetailKey + '-orderReferenceNumber', this.fetchOrderId);
                sessionStorage.setItem(this.randomFlightDetailKey + '-ctype', 'flights');
                sessionStorage.setItem(this.randomFlightDetailKey + '-totalFare', String(this.totalCollectibleAmount));
                sessionStorage.setItem(this.randomFlightDetailKey + '-passData', this.EncrDecr.set(JSON.stringify(result)));
                sessionStorage.setItem(this.randomFlightDetailKey + '-passFareData', btoa(JSON.stringify(result.flightDetails.fare)));
                 
                 this.syncCustomer(customerInfo);
                  
                this.enableVAS = this.serviceSettings.enabledVAS[this.partnerToken];
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
             // }
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
        this.searchData = (this.flightSessionData.queryFlightData);
        setTimeout(() => {
       // $("#infoprocess").modal('show');
        }, 10);
        if( this.flightSessionData['travel_type']=='M') {
        //Multicity
        this.maxAdults = Number(this.searchData[0].adults);
        this.maxChilds = Number(this.searchData[0].child);
        this.maxInfants = Number(this.searchData[0].infants);
        this.travelerDetails['adults'] = this.searchData[0].adults;
        this.travelerDetails['child'] = this.searchData[0].child;
        this.travelerDetails['infants'] = this.searchData[0].infants;
        this.partnerToken = this.flightSessionData.onwardFlights[0]['priceSummery']['partnerName'];
        this.flightOnwardDetails = this.flightSessionData.onwardFlights; 
        this.selectedOnwardVendor = this.flightSessionData.onwardFlights[0]['priceSummery'];
        this.searchData['adults'] = this.searchData[0].adults;
        this.searchData['child'] = this.searchData[0].child;
        this.searchData['infants'] = this.searchData[0].infants;
        this.searchData['flightclass'] = this.searchData[0].flightclass;

        this.searchData['travel'] = 'DOM';
        for (let j = 0; j < this.flightSessionData.queryFlightData.length; j++) {
        if(this.flightSessionData.queryFlightData[j]['fromContry'] != 'IN' || this.flightSessionData.queryFlightData[j]['toContry'] != 'IN'){
        this.searchData['travel'] = 'INT';
        }
        }
        this.flightReturnDetails = [];
        }else{

        this.maxAdults = Number(this.searchData.adults);
        this.maxChilds = Number(this.searchData.child);
        this.maxInfants = Number(this.searchData.infants);
        this.travelerDetails = this.searchData;


        if (this.flightSessionData.travel == 'DOM') {
        this.flightOnwardDetails = this.flightSessionData.onwardFlights;
        this.selectedOnwardVendor = this.flightSessionData.onwardPriceSummary;
        this.selectedReturnVendor = this.flightSessionData.returnPriceSummary;

        if (this.flightSessionData.returnFlights)
        this.flightReturnDetails = this.flightSessionData.returnFlights;
        else
        this.flightReturnDetails = [];
        } else {

        this.flightOnwardDetails = this.flightSessionData.onwardFlights;
        this.selectedOnwardVendor = this.flightSessionData.onwardPriceSummary;
        this.selectedReturnVendor = [];


        if (this.flightSessionData.returnFlights)
        this.flightReturnDetails = this.flightSessionData.returnFlights;
        else
        this.flightReturnDetails = [];
        }

        this.partnerToken = this.selectedOnwardVendor.partnerName;
        } 

        this.enableVAS = this.serviceSettings.enabledVAS[this.partnerToken];
        //console.log(this.partnerToken);
        //console.log(this.enableVAS);

        this.REWARD_CUSTOMERID = customerInfo["id"];
        this.REWARD_EMAILID = customerInfo["email"];
        this.REWARD_MOBILE = customerInfo["mobile"];
        this.REWARD_TITLE = customerInfo["title"];

        this.REWARD_CUSTOMERNAME = customerInfo["firstname"] + " " + customerInfo["lastname"];
        this.XSRFTOKEN = customerInfo["XSRF-TOKEN"];

        }        




isPaynowClicked:boolean=false;
continuePayment(){
//console.log($(".accordion-button:not(.collapsed)").attr("id"));
switch ($(".accordion-button:not(.collapsed)").attr("id")) {
        case 'tab-savedCards':
        $('.btn-pay-saved-card').trigger('click');
        console.log('dddd');
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
        
        if($(".addCardTab[aria-selected='true']").attr("aria-selected")){
        $('.btn-pay-card').trigger('click');
        }else if($(".addRupayTab[aria-selected='true']").attr("aria-selected")){
        $('.btn-pay-rupay').trigger('click');
        }else{
         $('.btn-pay-rupay').trigger('click');
        }

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
     this.triggerBack();
    }

  }


  calculateEMI(amount: number) {
    return Math.round((amount + (amount * (this.EMI_interest / 100))) / 12);
  }

 
  ConvertObjToQueryStringMutlticity(obj: any) {
    var strUrl = "";
    for (var i = 0; i < obj.length; i++) {
      var str: any = [];
      let obj1: any = obj[i];
      for (var p in obj1) {
        if (obj1.hasOwnProperty(p)) {
          str.push(encodeURIComponent(p) + "[" + i + "]=" + encodeURIComponent(obj1[p]));
        }
      }
      strUrl = strUrl + "&" + str.join("&");
    }
    return strUrl

  }
  triggerBack() {
    $('#bookingprocessFailed').modal('hide');
    let url;
    this.resetPopups();
    
     if( this.flightSessionData['travel_type']=='M') {
      url = "flight-multicity?" + decodeURIComponent(this.ConvertObjToQueryStringMutlticity(this.searchDataOrg))
    }else{
    if (this.searchData.travel == 'DOM') {
      if (this.searchData.flightdefault == 'R')
        url = "flight-roundtrip?" + decodeURIComponent(this.ConvertObjToQueryString((this.searchData)));
      else
        url = "flight-list?" + decodeURIComponent(this.ConvertObjToQueryString((this.searchData)));
    } else {
      url = "flight-int?" + decodeURIComponent(this.ConvertObjToQueryString((this.searchData)));
    }
    }
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

  ngOnDestroy(): void {
    this.resetPopups();
    if (this.sessionTimer) {
      clearInterval(this.sessionTimer);
    }
  }

  orderReferenceNumber:any;

  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }


  reciveflexiAmount(values) {
    this.showFlexipay = true;
    if (values[0].key == 15) {
      this.flexipaysummry = true;
      this.flexiDiscount = Number(values[0].value);
      this.totalCollectibleAmount = (Number(this.totalCollectibleAmountFromPartnerResponse) ) - Number(this.coupon_amount) - Number(this.flexiDiscount) - Number(this.voucher_amount);
      this.sendflexiFare = (Number(this.totalCollectibleAmountFromPartnerResponse) ) - Number(this.coupon_amount)- Number(this.voucher_amount);
      // console.log(this.sendflexiFare)
      sessionStorage.setItem(this.randomFlightDetailKey + '-totalFare', String(this.totalCollectibleAmount));
    } else if (values[0].key !== 15) {
      this.flexipaysummry = false;
      this.flexiDiscount = 0;
      this.flexiIntrest = Number(values[0].value);
      this.flexiDiscount = 0;
      this.totalCollectibleAmount = (Number(this.totalCollectibleAmountFromPartnerResponse) ) - Number(this.coupon_amount)- Number(this.voucher_amount);
      this.sendflexiFare = this.totalCollectibleAmount;
      sessionStorage.setItem(this.randomFlightDetailKey + '-totalFare', String(this.totalCollectibleAmount));
    }
  }

  recivetotalFare($event) {
    this.flexipaysummry = false;
    this.flexiDiscount = 0;
    this.totalCollectibleAmount = (Number(this.totalCollectibleAmountFromPartnerResponse) ) - Number(this.coupon_amount)- Number(this.voucher_amount);

  }

  receivePointsPlus($event) {
    this.voucher_code=$event.code;
    this.voucher_amount=$event.value;
   console.log($event);
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

