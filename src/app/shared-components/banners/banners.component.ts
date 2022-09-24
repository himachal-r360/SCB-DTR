import { Component, OnInit, Inject, Renderer2, ElementRef, ViewChild,OnDestroy,ViewEncapsulation, Input} from '@angular/core';
import { environment } from './../../../environments/environment';
import { RestapiService } from 'src/app/shared/services/restapi.service';
import { SimpleGlobal } from 'ng2-simple-global';
import { DOCUMENT } from '@angular/common';
import { AppConfigService } from './../../app-config.service';
import { APP_CONFIG, AppConfig } from './../../configs/app.config';
import { Router } from '@angular/router';
import {EncrDecrService} from 'src/app/shared/services/encr-decr.service';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { createMask } from '@ngneat/input-mask';
import * as moment from 'moment';
import { formatDate } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss']
})
export class BannersComponent implements OnInit {

  constructor(private spinnerService: NgxSpinnerService,public rest: RestapiService, private sg: SimpleGlobal, @Inject(DOCUMENT) private document: any, private appConfigService: AppConfigService, private router: Router,private EncrDecr: EncrDecrService,private fb: FormBuilder,private cookieService: CookieService) {

   this.serviceSettings = this.appConfigService.getConfig();
   this.cdnUrl = environment.cdnUrl+this.sg['assetPath'];
   this.cdnDealUrl = environment.cdnDealUrl;
   this.siteUrl = environment.MAIN_SITE_URL;
   this.DOMAIN_SETTINGS = this.serviceSettings.DOMAIN_SETTINGS[this.sg['domainName']];
   this.createForm();
    this.domainRedirect = environment.MAIN_SITE_URL + this.sg['domainPath'];
    this.DOMAIN_SETTINGS = this.serviceSettings.DOMAIN_SETTINGS[this.sg['domainName']];
    this.busUrl = environment.BUS_SITE_URL[this.sg['domainName']];
 }
  public mask = {
    guide: true,
    showMask : true,
    mask: [/\d/, /\d/, '/', /\d/, /\d/, '/',/\d/, /\d/,/\d/, /\d/]
  };
  DOMAIN_SETTINGS: any;
  angForm: FormGroup;
  mainBanners:any[];
  serviceSettings: any;
  cdnUrl: any;
  cdnDealUrl: any;
  siteUrl: any;
  points_available :any;
  wb_spend:any; 
  wb_perc:any;
  tb_perc:any;
  customerInfo:any[];
  mb_perc:any;
  IsgoldCardDetails:boolean=true;
  IsgoldCardDetailsModel:boolean=false;
  is_tb_progressbar:boolean=false;
  is_wb_progressbar:boolean=false;
  display_tb:boolean=false;
  display_wb:boolean=false;
  display_mb_link:boolean=false;
  display_wb_spend:boolean=false;
  display_wb_link:boolean=false;
  is_mb_progressbar:boolean=false;
  IsCardError:boolean=true;
  CardErrorMsg:any;
  customeravailablepoints: any;
  card_no: any;
  current_available_points: any;
  last_stmt_points: any;
  isLogged: Boolean;
  XSRFTOKEN: string;
 recentSearch = [];
  recentSearchFlag = false;
  recentData: any = [];
  allCookies: any = [];
  recentsearchData: any = [];
  recentsearchDataAll: any = [];
  cookie_all: any = [];
  cookie_redirectUrl: boolean = false;
  cookie_redirectNavigation: boolean = false;
 domainRedirect: string;
busUrl: any;
topBanner: any = [];
  topBannerSbRecommands: any = [];
  topBannerSub: any = [];
  topBannerRecentSearch: any = [];
  circle_box: Boolean = true;

  ngOnInit(): void {
    
      if(this.sg['customerInfo']){
       var customer_cookie;
        if(this.sg['customerInfo'].customer_cookie == 1)customer_cookie = 1;
        
        if(customer_cookie == 1){
             this.customerInfo = this.sg['customerInfo'];
                
           if(this.customerInfo["guestLogin"]==true){
            this.isLogged = false;
           }else{
            this.isLogged = true;
          if (this.customerInfo.hasOwnProperty('ccustomer')) {
          if (this.customerInfo['ccustomer'].card_variant)
            this.sg['card_variant'] = this.customerInfo['ccustomer'].card_variant;
          else
            this.sg['card_variant'] = 'Other Credit/Debit Card';
        } else {
          this.sg['card_variant'] = 'Other Credit/Debit Card';
        }


        this.isLogged = true;
        this.XSRFTOKEN = this.customerInfo["XSRF-TOKEN"];
        this.rest.updateCardDetails(this.customerInfo);
        if (this.customerInfo['ccustomer'] && this.customerInfo['ccustomer'].points_available && (this.customerInfo['ccustomer'].points_available != undefined || this.customerInfo['ccustomer'].points_available != null)){
             this.card_no="xx"+(Number(this.customerInfo['ccustomer'].last4digit));
            this.customeravailablepoints = (Number(this.customerInfo['ccustomer'].points_available));
            this.current_available_points=Number(this.customerInfo['ccustomer'].current_available_points);
            this.last_stmt_points=Number(this.customerInfo['ccustomer'].last_stmt_points);
        //  this.customeravailablepoints = (Number(this.customerInfo['ccustomer'].points_available)).toLocaleString('en-IN');
          this.IsgoldCardDetails=false;
          this.IsgoldCardDetailsModel=true;
         }
        //this.initiateCards();
           }

	/* For Recent Search */
     //Top Banner
    var getBannerParam = { postData: this.EncrDecr.set(JSON.stringify({ programName: this.sg['domainName'], type: 'foryou-top' })) };
    this.rest.getBanner(JSON.stringify(getBannerParam)).subscribe(result => {
      if (result.status == 'success') {
        if (typeof result.result[0].foryouMain != 'undefined' && result.result[0].foryouMain.length > 0) {
          this.topBanner = (result.result[0].foryouMain);
          this.circle_box = true;
        } else {
          this.topBanner = [{
            "image": this.cdnUrl + "images/banners/mobile/default_foryou_full.jpg",
            "full_image": this.cdnUrl + "images/banners/desktop/default_foryou_full.jpg",
            "brand": this.cdnUrl + "images/banners/hdfc.svg",
            "title": "hdfc",
            "redriect_url": "",
            "bg_color_code": "#012748"
          }];
          this.circle_box = false;
        }
        if (typeof result.result[0].foryouSbrecommand != 'undefined' && result.result[0].foryouSbrecommand.length > 0) {
          this.topBannerSbRecommands = (result.result[0].foryouSbrecommand);
        }
        
        var allCookies_key = [];
        if (localStorage.getItem(environment.flightLastSearch) !== null) allCookies_key.push(environment.flightLastSearch);
        if (localStorage.getItem(environment.hotelLastSearch) !== null) allCookies_key.push(environment.hotelLastSearch);
        if (localStorage.getItem(environment.busLastSearch) !== null) allCookies_key.push(environment.busLastSearch);
        if (localStorage.getItem(environment.trainLastSearch) !== null) allCookies_key.push(environment.trainLastSearch);

        if (localStorage.getItem(environment.flightLastSearch) !== null || localStorage.getItem(environment.hotelLastSearch) !== null || localStorage.getItem(environment.busLastSearch) !== null || localStorage.getItem(environment.trainLastSearch) !== null) {

          Object.values(allCookies_key).forEach(data => {

            let item = localStorage.getItem(data);
           
            var url;
            if (data == environment.flightLastSearch || data == environment.hotelLastSearch) {

              if (data == environment.flightLastSearch && localStorage.getItem(environment.flightLastSearch) !== null) {
               
               var searchValue = JSON.parse(item);
               
                var type = 'flight';
                var searchFrom = searchValue.fromCity;
                var searchTo = searchValue.toCity;
                
                var dateformat = searchValue.departure;
                var strdate = new Date(dateformat);
                var date = moment(strdate).format('ddd, MMM Do');
                
               if(searchValue.fromContry=='IN' && searchValue.toContry=='IN' ){    
                if(searchValue.arrival == "" || searchValue.arrival == undefined || searchValue.arrival == null ){
                 url="/flight-list?"+decodeURIComponent(this.ConvertObjToQueryString(searchValue));
                }
                else {
                 url="/flight-roundtrip?"+decodeURIComponent(this.ConvertObjToQueryString(searchValue));
                }
               }else{
                url="/flight-int?"+decodeURIComponent(this.ConvertObjToQueryString((searchValue)));
             }

              }
              else if (data == environment.hotelLastSearch && localStorage.getItem(environment.hotelLastSearch) !== null) {
                var get_valueall = atob(item);
                var get_value = JSON.parse(get_valueall).slice(-1)[0];
console.log("hotel "+ JSON.stringify( get_value));
                var dateformat = get_value.checkin;
                var strdate = new Date(dateformat);
                var date = moment(strdate).format('ddd, MMM Do');

                var type = 'hotel';
                var searchFrom = get_value.cityname;
                var searchTo = get_value.city_id;

                let diff = new Date().getTime() - strdate.getTime();

                if (diff > 0) {
                   url = '/compare-stay';
                } else {

                   url = this.domainRedirect + 'Hotels_lists?cityname=' + get_value.cityname + '&city_id=' + get_value.city_id + '&country=' + get_value.country + '&hotel_name=' + get_value.hotel_name + '&lattitude=' + get_value.lattitude + '&longitude=' + get_value.longitude + '&hotel_id=' + get_value.hotel_id + '&area=' + get_value.area + '&label_name=' + get_value.label_name + '&checkin=' + get_value.checkin + '&checkout=' + get_value.checkout + '&num_rooms=' + get_value.num_rooms + '&numberOfAdults1=' + get_value.numberOfAdults1 + '&numberOfChildren1=' + get_value.numberOfChildren1 + '&t=ZWFybg%3D%3D&hotel_search_done=' + get_value.hotel_search_done + '&hotel_modify=' + get_value.hotel_modify + '';
                }

              }
              
            } else {
              
              var get_value = JSON.parse(item);
              if (data == environment.busLastSearch && localStorage.getItem(environment.busLastSearch) !== null) {

                var dateformat = get_value.departure;
                var strdate = new Date(dateformat);
                var date = moment(strdate).format('ddd, MMM Do');

                var type = 'bus';

                let diff = new Date().getTime() - strdate.getTime();

                if (diff > 0) {

                   url = '/bus'; 
                } else {

                   url = '/bus/search?searchFrom=' + get_value.searchFrom + '&searchTo=' + get_value.searchTo + '&fromTravelCode=' + get_value.fromTravelCode + '&toTravelCode=' + get_value.toTravelCode + '&departure=' + get_value.departure + '';
                }
                var searchFrom = get_value.searchFrom;
                var searchTo = get_value.searchTo;
              }
              else if (data == environment.trainLastSearch && localStorage.getItem(environment.trainLastSearch) !== null) {
                var dateformat = get_value.departure;
                var strdate = new Date(dateformat);
                var date = moment(strdate).format('ddd, MMM Do');

                var type = 'train';

                let diff = new Date().getTime() - strdate.getTime();

                if (diff > 0) {

                   url = '/train';
                } else {

                   url = '/train/search?searchFrom=' + get_value.searchFrom + '&searchTo=' + get_value.searchTo + '&fromTravelCode=' + get_value.fromTravelCode + '&toTravelCode=' + get_value.toTravelCode + '&departure=' + get_value.departure + '';

                }
                var searchFrom = get_value.searchFrom;
                var searchTo = get_value.searchTo;

              }

            }

            
            if (date == undefined) { var dates = new Date(); var date = moment(dates).format('ddd, MMM Do'); }
          
        //  if(searchFrom!=undefined){
          var from =   searchFrom.split('(');  
          if(type=='hotel') { var from =   searchFrom; var searfrom = from; } else { var from =   searchFrom.split('(');  var searfrom = from[0]; }

          if(type=='hotel') { var to =   searchTo; var searto = to; } else { var to =   searchTo.split('(');  var searto = to[0]; }
          
            this.cookie_all.push({
              type: type,
              date: dateformat,
              showdate: date,
              searchFrom: searfrom,
              searchTo: searto,
              Redirecturl: url
            });
          });
          this.cookie_all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); 
          this.recentsearchData = this.cookie_all.slice(0, 2);
          this.recentsearchDataAll = this.cookie_all.slice(0, 4);

         // }
        }
        
        if (typeof this.recentsearchData != undefined || this.recentsearchData.length == 0 || typeof result.result[0].foryouRecentSearch != undefined) {
          this.topBannerRecentSearch = result.result[0].foryouRecentSearch;
	console.log(this.topBannerRecentSearch);
        }

        //RecentSearch
        if (this.serviceSettings.COOKIE_CONSENT_ENABLED) {

          var cookieName = 'busSearchN';

          const cookieExistsConsent: boolean = this.cookieService.check(this.serviceSettings.cookieName);
          if (cookieExistsConsent) {
            var coval = this.cookieService.get(this.serviceSettings.cookieName);
            if (coval == '1') {
              const cookieExists: boolean = this.cookieService.check(cookieName);
              if (cookieExists) {
                const cookieValue: any = JSON.parse(this.cookieService.get(cookieName));
                this.recentSearchFlag = true;
                this.recentData = cookieValue.reverse();
              } else {
                this.recentSearchFlag = false;
              }
            } else {
              this.recentSearchFlag = false;
            }

          }
        } else {
          const cookieExists: boolean = this.cookieService.check(cookieName);
          if (cookieExists) {
            const cookieValue: any = JSON.parse(this.cookieService.get(cookieName));
            this.recentSearchFlag = true;
            this.recentData = cookieValue.reverse();
          } else {
            this.recentSearchFlag = false;
          }
        }


      } 


    }); 
	/* For Recent Search ends here */


        }else{
            this.customerInfo =[];
            this.isLogged = false;
             this.sg['card_variant'] = 'Other Credit/Debit Card';
        }
      
    }   
    this.rest.getRegaliaGoldList().subscribe(res => {
      this.mainBanners = res.mainBanners.diners;
    });
     var params_arg = {
      _token:this.sg['customerInfo']['XSRF-TOKEN']
      };
      var params = {
        postData:this.EncrDecr.set(JSON.stringify(params_arg))
      };
     this.rest.getMilestoneDetail(JSON.stringify(params)).subscribe(res => {
        if(res.status!=undefined && res.status==true){
          if(res.milestone_detail.benefits_availed.wb.show_benefit==0 && res.milestone_detail.benefits_availed.tb.show_benefit==1){
            this.display_tb=true;
            this.display_wb=false;
            this.is_wb_progressbar=false;
          }
          else if(res.milestone_detail.benefits_availed.wb.can_avail==1 && res.milestone_detail.benefits_availed.wb.show_benefit==1){
            this.display_wb_link=true;
            this.display_wb_spend=false;
            this.wb_spend = res.milestone_detail.benefits_availed.wb.spends.ACHIEVED_SPEND_AMOUNT;
            this.display_wb=true;
            this.is_wb_progressbar=false;
          }else if(res.milestone_detail.benefits_availed.wb.can_avail==0 && res.milestone_detail.benefits_availed.wb.show_benefit==1){
            this.display_wb_link=false;
            this.display_wb_spend=true;
            this.wb_spend = res.milestone_detail.benefits_availed.wb.spends.ACHIEVED_SPEND_AMOUNT;
            this.display_wb=true; 
            this.wb_perc = ((res.milestone_detail.benefits_availed.wb.spends.ACHIEVED_SPEND_AMOUNT / res.milestone_detail.benefits_availed.wb.spends.TARGET_SPEND_AMOUNT)*100);
            this.is_wb_progressbar=true;
          }
          if(res.milestone_detail.benefits_availed.pv.previous_quarter.can_avail==1||res.milestone_detail.benefits_availed.pv.current_quarter.can_avail==1){
                 this.display_mb_link=true;
                 this.is_mb_progressbar=false;
          }else{
            this.mb_perc = ((res.milestone_detail.benefits_availed.pv.current_quarter.spends.ACHIEVED_SPEND_AMOUNT / res.milestone_detail.benefits_availed.pv.current_quarter.spends.TARGET_SPEND_AMOUNT)*100);
            this.display_mb_link=false;
            this.is_mb_progressbar=true;
          }
        }else{
          this.display_tb=true;
          this.display_mb_link=true;
        }
    });

    //  this.rest.availablePoints().subscribe(res => {
    //     if(res.status=="true"){x
    //         this.points_available=res.points_available;
    //      }
    // }); 
}
welcome_benefitsLink(){
     if(this.is_wb_progressbar==false)
      window.location.href = this.DOMAIN_SETTINGS['sub_domain_redirection_milestone_url']+'milestone';
     else
      return false;
}
milestone_benefitsLink(){
    if(this.is_mb_progressbar==false)
      window.location.href = this.DOMAIN_SETTINGS['sub_domain_redirection_milestone_url']+'milestone';
    else
      return false;
}
travel_benefitsLink(){
   if(this.display_tb==true)
         window.location.href = this.DOMAIN_SETTINGS['sub_domain_redirection_milestone_url']+'travel';
       else
         return false;
}
benefitsLink(){
 this.router.navigate([this.sg['domainPath']+'know-your-card']);
}
 createForm() {
  this.angForm = this.fb.group({
     mobile_no: ['', [Validators.required,Validators.minLength(10),Validators.maxLength(10),Validators.pattern(/^-?(0|[1-9]\d*)?$/)] ],
     last_4_digit: ['', [Validators.required,Validators.minLength(4),Validators.maxLength(4),Validators.pattern(/^-?(0|[1-9]\d*)?$/) ]],
     dob: ['', Validators.required ],
     save_card: [''],
  });
}

HotelRecentSearch(){
 if (localStorage.getItem("HotelRecentSearch") != null) {
   var HotelRecentSearchResult = JSON.parse(window.atob(localStorage.getItem("HotelRecentSearch")));
  /* for (let cok = 0; cok < HotelRecentSearchResult.length; cok++) {
   if (HotelRecentSearchResult[cok]['city_id'] == search_values_setCookieHotel[0].city_id && HotelRecentSearchResult[cok]['checkin'] == search_values_setCookieHotel[0].checkin && HotelRecentSearchResult[cok]['checkout'] == search_values_setCookieHotel[0].checkout) {
      HotelRecentSearchResult.splice(cok, 1);
   }
   }
   search_values_setCookieHotel= HotelRecentSearchResult.concat(search_values_setCookieHotel)
   if (search_values_setCookieHotel.length >= 3) {
     search_values_setCookieHotel=search_values_setCookieHotel.reverse().slice(0,3).reverse();
   } */
 }
}
onSubmit(){
     this.angForm.markAllAsTouched();
     if (this.angForm.invalid){
       return false; 
     }
     this.customerInfo = this.sg['customerInfo']; 
     this.card_no="xx"+this.angForm.controls['last_4_digit'].value;
      let URLparams = {
         "mobile": this.angForm.controls['mobile_no'].value,
         "customer_id": this.customerInfo["customerid"],
         "programName":this.sg['domainName'],
         "last4digit":this.angForm.controls['last_4_digit'].value,
         "_token":this.customerInfo["XSRF-TOKEN"],
         "DOB":this.angForm.controls['dob'].value,
         "user_id":this.customerInfo["id"],
         'modal':'REWARD',
         'type' : 'available_points',
         'clientToken':this.sg['domainName'],
         'services_id':7,
         'partner_id':1,
         'savecard':this.angForm.controls['save_card'].value,
       }
       var EncURLparams = {
         postData: this.EncrDecr.set(JSON.stringify(URLparams))
       };
      this.rest.AvailablePoints(EncURLparams).subscribe(res => {
         if(res.error_code=="100"){
            document.getElementById('unlockCardPopup').click();
            this.IsgoldCardDetails=false;
            this.IsgoldCardDetailsModel=true;
            this.angForm.reset();
            this.spinnerService.show();  
            this.customeravailablepoints=res.points_available;
            this.current_available_points=res.current_available_points;
            this.last_stmt_points=res.last_stmt_points;
          }else{
               this.IsCardError=false;
               this.CardErrorMsg=res.message;
          }    

       }); 
  }

ConvertObjToQueryString(obj:any)
  {

    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }
onGoToPage(url){
  this.router.navigateByUrl(url);
  }
}
