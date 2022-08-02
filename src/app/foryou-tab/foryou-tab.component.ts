import { Component, OnInit, Inject, Renderer2, ElementRef, ViewChild,OnDestroy,ViewEncapsulation} from '@angular/core';
import { environment } from '../../environments/environment';
import { RestapiService } from 'src/app/shared/services/restapi.service';
import { EncrDecrService } from 'src/app/shared/services/encr-decr.service';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { SimpleGlobal } from 'ng2-simple-global';
import { DOCUMENT } from '@angular/common';
import { AppConfigService } from '../app-config.service';
import { APP_CONFIG, AppConfig } from '../configs/app.config';
import { PayService } from 'src/app/shared/services/pay.service'
import { CommonHelper } from 'src/app/shared/utils/common-helper';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatBottomSheet, MatBottomSheetRef, MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import * as moment from 'moment';
import { formatDate } from '@angular/common';
import { StyleManagerService } from 'src/app/shared/services/style-manager.service';
import { FlightService } from '../common/flight.service';

declare var $: any;
@Component({
  selector: 'app-foryou-tab',
  templateUrl: './foryou-tab.component.html',
  styleUrls: ['./foryou-tab.component.scss']
})
export class ForyouTabComponent implements OnInit, OnDestroy {
public modeselectDealCat = 'All';
public modeselectDealSubCat= 'All';
public modeselectTrending= 'All';
  date: { year: number, month: number };
  serviceSettings: any;
  navigation = 'arrows';
  showShoppingItems: Boolean = false;
  cdnUrl: any;
  cdnDealUrl: any;
  siteUrl: any;
  customerInfo: any[];
  saveCard: any;
  custCardsAvailable: Boolean;
  customercards: any; primaryCust: any;
  selectedCardDetails: any;
  customeravailablepoints: any;
  errorMsg0: any = "";
  XSRFTOKEN: string;
  response1: any = [];
  amazonCategories = [];
  amazonProducts = [];
  amazonRecommendProducts = [];
  topBanner: any = [];
  topBannerSbRecommands: any = [];
  topBannerSub: any = [];
  topBannerRecentSearch: any = [];
  topDeals = [];
  topDealCategory = [];
  topDealSubCategory = [];
  
  selectedDealCategory: any = "All";
  selectedDealSubCategory: any = "All";
  
  domainRedirect: string;
  foryouPartners = [];
  foryouBrands = [];
  recentSearch = [];
  recentSearchFlag = false;
  recentData: any = [];
  allCookies: any = [];
  isLogged: Boolean;
  circle_box: Boolean = true;
  showProductListLoader: Boolean = false;
  showProductList: Boolean = true;
  DOMAIN_SETTINGS: any;
  showDealListLoader: Boolean = false;
  showDealList: Boolean = false;
  busUrl: any;
  show_earnpoints: boolean = false;
  cardType: any = '';
  c_value: any = '';
  recentsearchData: any = [];
   recentsearchDataAll: any = [];
  cookie_all: any = [];
  cookie_redirectUrl: boolean = false;
  cookie_redirectNavigation: boolean = false;
  bannerSlide:number=1;
  poweredByPartners:[];

  constructor(public _styleManager: StyleManagerService,public rest: RestapiService, private EncrDecr: EncrDecrService, private http: HttpClient, private sg: SimpleGlobal, @Inject(DOCUMENT) private document: any, private appConfigService: AppConfigService, private pay: PayService, private commonHelper: CommonHelper, private cookieService: CookieService, private _travelBottomSheet: MatBottomSheet, private activatedRoute: ActivatedRoute, private router: Router,  private _flightService: FlightService) {
     this._flightService.showHeader(true);
   
    this.serviceSettings = this.appConfigService.getConfig();
    this.cdnUrl = environment.cdnUrl;
    this.cdnDealUrl = environment.cdnDealUrl;
    this.siteUrl = environment.MAIN_SITE_URL;
    this.showShoppingItems = this.serviceSettings.showShoppingItems;
    this.domainRedirect = environment.MAIN_SITE_URL + this.sg['domainPath'];
    this.foryouPartners = this.serviceSettings.foryou_partners;
    this.foryouBrands = this.serviceSettings.foryou_brands;
    this.DOMAIN_SETTINGS = this.serviceSettings.DOMAIN_SETTINGS[this.sg['domainName']];
    this.busUrl = environment.BUS_SITE_URL[this.sg['domainName']];
    this.poweredByPartners = this.serviceSettings.poweredByPartners;
    console.log((this.poweredByPartners));

     if(this.serviceSettings['new_ui_ux']==0){   
      this.router.navigate([this.sg['domainPath'] + '**']);
     } 
    
     this._styleManager.setStyle('owl-default', `assets/library/owl.carousel/assets/owl.theme.default.min.css`);
     this._styleManager.setScript('owl', `assets/library/owl.carousel/owl.carousel.min.js`);

  }
  
   ngOnDestroy() {
    this._styleManager.removeStyle('owl-default');
    this._styleManager.removeScript('owl');
  }
  
 loadTopBanner(l) {
        window.scrollTo(0, 0);
        setTimeout(function () {
        $(document).ready(function () {
        var current;
        var owl_slider;

        var sync1 = $(".topBannerSlider");
        var sync2 = $(".navigation-thumbs");

        var thumbnailItemClass = '.owl-item';

        var slides = sync1.owlCarousel({
        items: 1,
        responsiveClass: true,
        autoplayHoverPause: true,
        autoplay: true,
        loop:true,
        lazyLoad: true,
                 
        nav: false,
        dots: false,
        autoplayTimeout:3000,
        }).on('translate.owl.carousel', syncPosition);

        function syncPosition(el) {

        owl_slider = $(this).data('owl.carousel');
        var loop = owl_slider.options.loop;

        if(loop){
        var count = el.item.count-1;
        var current = Math.round(el.item.index - (el.item.count/2) - .5);
        if(current < 0) {
        current = count;
        }
        if(current > count) {
        current = 0;
        }
        }else{
        current = el.item.index;
        }

        var owl_thumbnail = sync2.data('owl.carousel');
        var itemClass = "." + owl_thumbnail.options.itemClass;


        var thumbnailCurrentItem = sync2
        .find(itemClass)
        .removeClass("synced")
        .eq(current);

        $('.bgbox').css('visibility', 'hidden');
        thumbnailCurrentItem.addClass('synced');
        $('.bgbox-' + current).css('visibility', 'visible');

        if (!thumbnailCurrentItem.hasClass('active')) {
        var duration = 300;
        sync2.trigger('to.owl.carousel',[current, duration, true]);
        }
        }
        var thumbs = sync2.owlCarousel({
        items:l,
        loop:false,
        margin:0,
        autoplay:true,
        mouseDrag:false,
        touchDrag:false,
        pullDrag:false,
        freeDrag:false,
                
        nav: false,
        dots: false,
        onInitialized: function (e) {
        var thumbnailCurrentItem =  $(e.target).find(thumbnailItemClass).eq(this._current);
        thumbnailCurrentItem.addClass('synced');
        $('.bgbox').css('visibility', 'hidden');
        $('.bgbox-' + this._current).css('visibility', 'visible');
        },
        })
        .on('click', thumbnailItemClass, function(e) {
        e.preventDefault();
        var duration = 300;
        var itemIndex =  $(e.target).parents(thumbnailItemClass).index();
        sync1.trigger('to.owl.carousel',[itemIndex, duration, true]);

        }).on("changed.owl.carousel", function (el) {
        var number = el.item.index;
        owl_slider = sync1.data('owl.carousel');
        owl_slider.to(number, 100, true);
        });

        });
        }, 300);
 }

  ngOnInit() {
    

     setTimeout(() => {
     
     
    //Check Laravel Seesion
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
          if (this.customerInfo['ccustomer'] && this.customerInfo['ccustomer'].points_available && (this.customerInfo['ccustomer'].points_available != undefined || this.customerInfo['ccustomer'].points_available != null))
            this.customeravailablepoints = (Number(this.customerInfo['ccustomer'].points_available)).toLocaleString('en-IN');
          this.initiateCards();
             }

          }else{
              this.customerInfo =[];
              this.isLogged = false;
               this.sg['card_variant'] = 'Other Credit/Debit Card';
          }
        
      }
     // console.log(this.sg['customerInfo']);
    //  console.log(this.customerInfo);
    //   console.log(this.isLogged);
      
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
        this.loadTopBanner(this.topBanner.length);
        if (typeof result.result[0].foryouSbrecommand != 'undefined' && result.result[0].foryouSbrecommand.length > 0) {
          this.topBannerSbRecommands = (result.result[0].foryouSbrecommand);
        }
        
        var allCookies_key = [];
        if (localStorage.getItem('FlightRecentSearch') !== null) allCookies_key.push('FlightRecentSearch');
        if (localStorage.getItem('HotelRecentSearch') !== null) allCookies_key.push('HotelRecentSearch');
        if (localStorage.getItem('busLastSearch') !== null) allCookies_key.push('busLastSearch');
        if (localStorage.getItem('trainLastSearch') !== null) allCookies_key.push('trainLastSearch');

        if (localStorage.getItem('FlightRecentSearch') !== null || localStorage.getItem('HotelRecentSearch') !== null || localStorage.getItem('busLastSearch') !== null || localStorage.getItem('trainLastSearch') !== null) {

          Object.values(allCookies_key).forEach(data => {

            let item = localStorage.getItem(data);

            if (data == 'FlightRecentSearch' || data == 'HotelRecentSearch') {

              if (data == 'FlightRecentSearch' && localStorage.getItem('FlightRecentSearch') !== null) {

                var get_valueall = atob(item);
                var get_value = JSON.parse(get_valueall).slice(-1)[0];

                var dateformat = get_value.flightdeparture;
                var strdate = new Date(dateformat);
                var date = moment(strdate).format('ddd, MMM Do');

                var type = 'flight';

                var searchFrom = get_value.flightfrom;
                var searchTo = get_value.flightto;

                let diff = new Date().getTime() - strdate.getTime();

                if (diff > 0) {

                  var url = this.domainRedirect + 'compare-fly';

                } else {

                  var url = this.domainRedirect + 'flights/search?Default=' + get_value.Default + '&adults=' + get_value.adults + '&child=' + get_value.child + '&class=' + get_value.class + '&fcode=' + get_value.fcode + '&flightdeparture=' + get_value.flightdeparture + '&flightfrom=' + get_value.flightfrom + '&flightreturn=' + get_value.flightreturn + '&flightto=' + get_value.flightto + '&infants=' + get_value.infants + '&tcode=' + get_value.tcode + '&t=ZWFybg==';

                }

              }
              else if (data == 'HotelRecentSearch' && localStorage.getItem('HotelRecentSearch') !== null) {
                var get_valueall = atob(item);
                var get_value = JSON.parse(get_valueall).slice(-1)[0];

                var dateformat = get_value.checkin;
                var strdate = new Date(dateformat);
                var date = moment(strdate).format('ddd, MMM Do');

                var type = 'hotel';
                var searchFrom = get_value.cityname;
                var searchTo = get_value.city_id;

                let diff = new Date().getTime() - strdate.getTime();

                if (diff > 0) {
                  var url = this.domainRedirect + 'compare-stay';
                } else {

                  var url = this.domainRedirect + 'Hotels_lists?cityname=' + get_value.cityname + '&city_id=' + get_value.city_id + '&country=' + get_value.country + '&hotel_name=' + get_value.hotel_name + '&lattitude=' + get_value.lattitude + '&longitude=' + get_value.longitude + '&hotel_id=' + get_value.hotel_id + '&area=' + get_value.area + '&label_name=' + get_value.label_name + '&checkin=' + get_value.checkin + '&checkout=' + get_value.checkout + '&num_rooms=' + get_value.num_rooms + '&numberOfAdults1=' + get_value.numberOfAdults1 + '&numberOfChildren1=' + get_value.numberOfChildren1 + '&t=ZWFybg%3D%3D&hotel_search_done=' + get_value.hotel_search_done + '&hotel_modify=' + get_value.hotel_modify + '';
                }

              }

            } else {

              var get_value = JSON.parse(item);
              if (data == 'busLastSearch' && localStorage.getItem('busLastSearch') !== null) {

                var dateformat = get_value.departure;
                var strdate = new Date(dateformat);
                var date = moment(strdate).format('ddd, MMM Do');

                var type = 'bus';

                let diff = new Date().getTime() - strdate.getTime();

                if (diff > 0) {

                  var url = this.domainRedirect + 'lite/bus';
                } else {

                  var url = this.domainRedirect + 'lite/bus/search?searchFrom=' + get_value.searchFrom + '&searchTo=' + get_value.searchTo + '&fromTravelCode=' + get_value.fromTravelCode + '&toTravelCode=' + get_value.toTravelCode + '&departure=' + get_value.departure + '';
                }
                var searchFrom = get_value.searchFrom;
                var searchTo = get_value.searchTo;
              }
              else if (data == 'trainLastSearch' && localStorage.getItem('trainLastSearch') !== null) {
                var dateformat = get_value.departure;
                var strdate = new Date(dateformat);
                var date = moment(strdate).format('ddd, MMM Do');

                var type = 'train';

                let diff = new Date().getTime() - strdate.getTime();

                if (diff > 0) {

                  var url = this.domainRedirect + 'lite/train';
                } else {

                  var url = this.domainRedirect + 'lite/train-list?searchFrom=' + get_value.searchFrom + '&searchTo=' + get_value.searchTo + '&fromTravelCode=' + get_value.fromTravelCode + '&toTravelCode=' + get_value.toTravelCode + '&departure=' + get_value.departure + '';

                }
                var searchFrom = get_value.searchFrom;
                var searchTo = get_value.searchTo;

              }

            }
            if (date == undefined) { var dates = new Date(); var date = moment(dates).format('ddd, MMM Do'); }
        
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
          
        }
        
        if (typeof this.recentsearchData != undefined || this.recentsearchData.length == 0 || typeof result.result[0].foryouRecentSearch != undefined) {
          this.topBannerRecentSearch = result.result[0].foryouRecentSearch;
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


      } else {
        this.showDealList = false;
        this.showDealListLoader = false;
        this.topBanner = [];
      }

      

    }); 
      
    
      
  }, 50);
  

    if (this.showShoppingItems && this.DOMAIN_SETTINGS['AMAZON_PANTRY']==1) {
      //Shopping Products   
      var getShoopingParam = { postData: this.EncrDecr.set(JSON.stringify({ programName: this.sg['domainName'], category: 'All' })) };
      this.rest.getShoopingProducts(JSON.stringify(getShoopingParam)).subscribe(result => {
        if (result.status == 'success') {
          this.showShoppingItems = true;
          this.showProductListLoader = false;
          this.amazonProducts = (result.result['hits']);
          this.amazonCategories = result.result['aggregations'];
        } else {
          this.amazonProducts = [];
        }
      });
    }


  

    //Get Deals
    var getDealParam = { postData: this.EncrDecr.set(JSON.stringify({ programName: this.sg['domainName'], category: 'All', sub_category: 'All'})) };
    this.rest.getDeals(JSON.stringify(getDealParam)).subscribe(result => {
      if (result.status == 'success') {
        this.showDealList = true;
        this.showDealListLoader = false;
        this.topDeals = (result.result['hits']);
       //this.topDealCategory = result.result['aggregations'];
        
        if(result.result['aggregations']['category_filter']){
        this.topDealCategory= result.result['aggregations']['category_filter']['buckets'];
        }
        
        if(result.result['sub_aggregations']['sub_category_filter']){
        this.topDealSubCategory= result.result['sub_aggregations']['sub_category_filter']['buckets'];
        }
      } else {
        this.showShoppingItems = false;
        this.showProductListLoader = false;
        this.topDeals = [];
      }
    });



    let queryParamMap = this.activatedRoute.snapshot.queryParamMap;
    if (queryParamMap.keys[0])
      this.redirectUrl(queryParamMap.keys[0], 0, '');

    this.showBlockno = 2;


  }

  showBlockno = 0;
  showBlock(blockno) {
    this.showBlockno = blockno;
  }
 
 goToNew(path){
     if(environment.IS_MAIN==1){
        const current = new Date();
        this.redirectPopupTriggerTimestamp=current.getTime();
        this.redirectPopupTrigger=1;
        this.redirectPopup=2;
        this.redirectPopupUrl=environment.ANGULAR_SITE_URL+path;
     }else{
        this.router.navigate([this.sg['domainPath']+path]);
     }
    }
  
  goTo(path) {
    if (environment.IS_MAIN == 1) {
      const current = new Date();
      this.redirectPopupTriggerTimestamp = current.getTime();
      this.redirectPopupTrigger = 1;
      this.redirectPopup = 2;
      this.redirectPopupUrl = environment.ANGULAR_SITE_URL + path;
    } else {
     this.document.location.href = environment.ANGULAR_SITE_URL + path;
    }
  }
  initiateCards() {
    this.show_earnpoints = this.serviceSettings.show_earnpoints;
    let service_value = this.serviceSettings.savingCalculator;
    this.cardType = this.sg['card_variant'];
    this.c_value = service_value[this.cardType]['Amazon Shopping'];

    this.saveCard = AppConfig.saveCard;
    if (this.saveCard == 1) {
      this.getCardDetails();		//fetch card details for normal login
      //UPDATE AVAILABLE POINTS 
      if (this.custCardsAvailable == true) {
        this.pay.updateavaliablepoints().subscribe(res => {
          if (res['points_available'] && (res['points_available'] != undefined || res['points_available'] != null)) {
            this.customeravailablepoints = res['points_available'].toLocaleString('en-IN');
          } else {
            let msg = "Points not updated";
            if (res['message'] != undefined) {
              msg = res['message'];
            }
          }
        }), (err: HttpErrorResponse) => {
          var message = 'Something went wrong';
          console.log(message);
        };
      }
    }
  }

  selectedCard(e) {
    this.selectedCardDetails = e.value;
    this.checkAvailablePointsforSavedCard();
  }

  selectAmazonCategory(e) {
    this.showProductList = false;
    this.showProductListLoader = true;
    var getShoopingParam = { postData: this.EncrDecr.set(JSON.stringify({ programName: this.sg['domainName'], category: e.value })) };
    this.rest.getShoopingProducts(JSON.stringify(getShoopingParam)).subscribe(result => {
      if (result.status == 'success') {
        this.showProductList = true;
        this.showProductListLoader = false;
        this.amazonProducts = (result.result['hits']);
      } else {
        this.showProductList = false;
        this.showProductListLoader = false;
        this.amazonProducts = [];
      }
    });
  }

  selectDealCategory(e) {
    this.showDealList = false;
    this.showDealListLoader = true;
    this.topDealSubCategory=[];
     this.selectedDealCategory=e.value;
     this.modeselectDealCat = this.selectedDealCategory;
     
    var getDealParam = { postData: this.EncrDecr.set(JSON.stringify({ programName: this.sg['domainName'], category: e.value,sub_category:'All' })) };
    this.rest.getDeals(JSON.stringify(getDealParam)).subscribe(result => {
    
    
      if (result.status == 'success') {
        this.showDealList = true;
        this.showDealListLoader = false;
        this.topDeals = (result.result['hits']);
        
        if(result.result['sub_aggregations']['sub_category_filter']){
        this.topDealSubCategory= result.result['sub_aggregations']['sub_category_filter']['buckets'];
        } 
         
       
      } else {
        this.showDealList = false;
        this.showDealListLoader = false;
        this.topDeals = [];
      }
    });

  }
  
  
  selectDealSubCategory(e) {
    this.showDealList = false;
    this.showDealListLoader = true;
      this.modeselectDealSubCat = e.value;
    var getDealParam = { postData: this.EncrDecr.set(JSON.stringify({ programName: this.sg['domainName'],sub_category: e.value , category: this.selectedDealCategory })) };
    this.rest.getDeals(JSON.stringify(getDealParam)).subscribe(result => {
      if (result.status == 'success') {
        this.showDealList = true;
        this.showDealListLoader = false;
        this.topDeals = (result.result['hits']);
        
      } else {
        this.showDealList = false;
        this.showDealListLoader = false;
        this.topDeals = [];
      }
    });

  }
  
  
  onImgError(event) {
    event.target.src = this.cdnUrl + 'images/banners/mobile/default_foryou_full.jpg';

  }
  
    onImgErrorDeals(event) {
    event.target.src = 'https://d157777v0iph40.cloudfront.net/smartbuy3.0/images/offers/hdfcbank.jpg';

  }

  onImgErrorFull(event) {
    event.target.src = this.cdnUrl + 'images/banners/desktop/default_foryou_full.jpg';

  }

  checkAvailablePointsforSavedCard() {
    var request = {
      "takecard": this.selectedCardDetails,
      "type": "available_points",
      "bin": "",
      "clientToken": this.sg['domainName'].toUpperCase(),
      "ctype": 'redbus',
      "modal": "DIGITAL",
      "noopt": 1,
      "customer_id": this.customerInfo["customerid"],
      "programName": this.sg['domainName'],
      "_token": this.XSRFTOKEN
    };
    var passData = {
      postData: this.EncrDecr.set(JSON.stringify(request))
    };
    this.pay.getcustomercardpoints(passData).subscribe(response => {
      if (this.response1['status'] != undefined && (this.response1['status'] == true || this.response1['status'] == 'true')) {
        this.errorMsg0 = ""
        this.customeravailablepoints = (Number(this.response1['points_available'])).toLocaleString('en-IN');

      } else {
        this.errorMsg0 = "Something went wrong";
        if (this.response1['message'] != undefined) {
          this.errorMsg0 = this.response1['message'];
        }
      }
    }), (err: HttpErrorResponse) => {
      var message = 'Something went wrong';
      this.errorMsg0 = "";
    };
  }

  getCardDetails() {
    const urlParams = new HttpParams()
      .set('postData', 'XXXXX')
    const body: string = urlParams.toString();
    this.rest.getupdateCardDetails().subscribe(response => {
      if (response.hasOwnProperty('customercards')) {
        let customercards = response.customercards;
        this.customercards = customercards;
        if (customercards.length > 0) {
          this.custCardsAvailable = true;
          //get primary card detail
          for (let i = 0; i < customercards.length; i++) {
            if (customercards[i].is_primary == 1) {
              this.selectedCardDetails = customercards[i].id;
            }
          }
        } else {
          this.custCardsAvailable = false;
        }
      } else {
        this.custCardsAvailable = false;
      }


    }), (err: HttpErrorResponse) => {
      var message = 'Something went wrong';
      console.log(message);
    };
  }

  banner_thumb_num: number = 0;

  onSlideBanner(event) {
    if (event.current) {
      const imageIndex = parseInt(event.current.replace("slideId_", ""), 10);
      this.banner_thumb_num = imageIndex;
    }

  }


  trendingOptions: any = {
    loop: true,
    navText: ['<span class="left_arrow" [style.opacity]="myCarousel.isLast ? 0:1"><img src="' + environment.cdnUrl + 'images/smartbuy/icons/left-arrow.svg"></span>', '<span class="right_arrow" ><img src="' + environment.cdnUrl + 'images/smartbuy/icons/right-arrow.svg"></span>'],

    responsiveClass: true,
    responsive: {
      0: {
        items: 1.5,
        nav: false,
        dots: false,
        margin: 10
      },
      600: {
        items: 2.5,
        nav: true,
        dots: true
      },
      1000: {
        items: 4.4,
        nav: true,
        dots: true
      },
      1400: {
        items: 6,
        nav: true,
        dots: true,
      }
    }

  }
  
  
    dealOptions: any = {
    loop: false,
    navText: ['<span class="left_arrow" [style.opacity]="myCarousel.isLast ? 0:1"><img src="' + environment.cdnUrl + 'images/smartbuy/icons/left-arrow.svg"></span>', '<span class="right_arrow" ><img src="' + environment.cdnUrl + 'images/smartbuy/icons/right-arrow.svg"></span>'],
    margin:25,
    responsiveClass: true,
    responsive: {
      0: {
        items: 1.8,
        nav: false,
        dots: false,
        margin: 10
      },
      600: {
        items: 3,
        nav: true,
        dots: true
      },
      1000: {
        items: 4,
        nav: true,
        dots: true,
      },
      1400: {
        items: 4,
        nav: true,
        dots: true,
      }
    }

  }



  brandOptions: any = {
    loop: true,
    autoplay: true,
    autoplayTimeout: 8000,
    autoplayHoverPause: true,
    margin: 15,

    responsiveClass: true,
    responsive: {
      0: {
        items: 2.5,
        nav: false,
        dots: false
      },
      600: {
        items: 5,
        nav: false,
        dots: false
      },
      1000: {
        items: 7,
        nav: false,
        dots: false
      }
    }
  }



  OpenTravelBottomSheet(service): void {
    const config: MatBottomSheetConfig = {
      panelClass: 'bottom-sheet-TravelerContainer',
      data: { service: service }
    };
    this._travelBottomSheet.open(TravelSheetBottomComponent, config);
  }


  redirectPopupTrigger: number = 0; redirectPopupPartner; redirectPopupType; redirectPopupUrl; redirectPopupHeader; redirectPopupImpmessage; redirectPopupMessage; redirectPopup;
  redirectPopupTriggerTimestamp;


  redirectUrl(partner, type, url) {
    const current = new Date();
    if (url) {
      let partnerData = this.serviceSettings['lang']['popup_redirections'][partner];
      this.redirectPopupHeader = partnerData[partner + '_title'];
      this.redirectPopupImpmessage = partnerData[partner + '_pup_importantText'];
      this.redirectPopupMessage = partnerData[partner + '_pup_dearcustomer'];

      if (type == 1){
        this.redirectPopup = 1;
        this.redirectPopupUrl = this.domainRedirect + 'insta-redirection/shopredirectLink?u=' + (window.btoa(url));
      }else{
        this.redirectPopup = 1;
        this.redirectPopupUrl = this.domainRedirect + 'popup-redirection/' + partner;
      }
      this.redirectPopupPartner = partner;
      this.redirectPopupType = type;
      this.redirectPopupTrigger = 1;
    
      this.redirectPopupTriggerTimestamp = current.getTime();
    }
  }

  redirectDisUrl(url) {
    if (environment.IS_MAIN == 1) {
      this.document.location.href = environment.MAIN_SITE_URL + url;
    } else {
      const current = new Date();
      this.redirectPopupTriggerTimestamp = current.getTime();
      this.redirectPopupTrigger = 1;
      this.redirectPopup = 2;
      this.redirectPopupUrl = this.domainRedirect + url;
    }
  }

  clickUrl(url) {
    if (environment.IS_MAIN == 1) {
      const current = new Date();
      this.redirectPopupTriggerTimestamp = current.getTime();
      this.redirectPopupTrigger = 1;
      this.redirectPopup = 2;
      this.redirectPopupUrl = this.domainRedirect + url;
    } else {
      this.document.location.href = environment.MAIN_SITE_URL + url;
    }
  }

}


@Component({
  selector: 'app-travel-sheet-bottom',
  templateUrl: './travel-sheet-bottom.component.html',
  styleUrls: ['./foryou-tab.component.scss']
})
export class TravelSheetBottomComponent implements OnInit {
  searchDisplayForm;
  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any, private _TravelBottomSheet: MatBottomSheet, private _bottomSheetRef: MatBottomSheetRef<TravelSheetBottomComponent>) {
    this.searchDisplayForm = this.data.service;

  }
  ngOnInit() {}
  closeBottomSheet() {
    this._TravelBottomSheet.dismiss();
  }
}


