import {Component, Inject, OnInit,ChangeDetectionStrategy,HostListener,HostBinding,ElementRef,Input, ViewChild, TemplateRef, ViewEncapsulation,EventEmitter,NgZone} from '@angular/core';
import {APP_CONFIG, AppConfig} from '../configs/app.config';
import { CookieService } from 'ngx-cookie-service';
import {NavigationStart,NavigationEnd, Router,ActivatedRoute} from '@angular/router';
import { SimpleGlobal } from 'ng2-simple-global';
import { RestapiService} from 'src/app/shared/services/restapi.service';
import { HttpClient, HttpHeaders, HttpErrorResponse , HttpParams} from '@angular/common/http';
import { Subscription } from 'rxjs';
import {EncrDecrService} from 'src/app/shared/services/encr-decr.service';
import { DOCUMENT } from '@angular/common';
import { DeviceDetectorService } from 'ngx-device-detector';
import {environment} from '../../environments/environment';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatBottomSheet, MatBottomSheetRef,MAT_BOTTOM_SHEET_DATA,MatBottomSheetConfig} from '@angular/material/bottom-sheet';
import {CartService} from 'src/app/shared/services/cart.service';
import { CommunicationService } from 'src/app/shared/services/communication.service';
import { AppConfigService } from '../app-config.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonHelper } from 'src/app/shared/utils/common-helper';
import { DomSanitizer } from '@angular/platform-browser';
import {trigger, state, style, animate, transition} from '@angular/animations';
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import { ElasticsearchService } from 'src/app/shared/services/elasticsearch.service';
import { FlightService } from '../common/flight.service';
import { ConditionalExpr } from '@angular/compiler';
import { Console } from 'console';

declare var $: any;
declare var jQuery: any;
declare const annyang: any;



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss',],
  encapsulation: ViewEncapsulation.None,
 //changeDetection: ChangeDetectionStrategy.OnPush,
 animations: [
    trigger('rotatedState', [
      state('default', style({ transform: 'rotate(0)' })),
      state('rotated', style({ transform: 'rotate(-180deg)' })),
      transition('rotated => default', animate('200ms ease-out')),
      transition('default => rotated', animate('200ms ease-in'))
    ])
  ]

 
})

export class HeaderComponent implements OnInit {
  

        now:any=[];
  rd_site_url: any;shop_site_url;
        loginUrl:string='check-login?g=1';
        addtocart: boolean = false;
        counter:number = 1;
        public shoppingcart:boolean = false;
        public buttonName:any = 'Shoppingcart';MatBottomSheetRef
        cdnUrl: any;busUrl: any;trainUrl:any;freshMenuUrl:any;natgeoUrl:any;golfUrl:any;dreamfolksUrl:any;
        showCart: any;
        navbarOpen;
        navbarOpenMenu;
        headerSubscription: Subscription;
        appConfig: any;
        activeMenu:string;
        searchBarValue:string;
        domainPath:string;
        domainName:string;
        importantMessage:string;
        assetPath:string;
        enablePrivileges:any;
        menuItems: any[];
        progressBarMode: string;
        currentLang: string;
        public customerInfo: any[];
        customer_full_name:string;
        public customerLogin: any;
        public guestLogin: boolean=false;
        showSearchBoxTop: boolean=false;
        domainRedirect: string;
        sub_domain_redirection_url:string;
        menuParam:any = [];
        showSearchBox = false;
        showdcEMI= false;
        dcemi_offer_image='';
        dcemi_offer_url='';
        topSearch= false;
        private lastKeypressSearch = 0;
        private queryTextSearch = '';
        searchResults:any = [];
        showmHeader = false;
        showmNav:string;
        DOMAIN_SETTINGS:any;
        menuOfferDropdown:number = 0;
        serviceSettings:any;
        dcEMICashback;
        fp_popup_control:number = 0;
        serviceId:any;
        displayCart:boolean = false;
        scrollMenu:boolean=false;
        @Input() set showMobileHeader(p: boolean){ this.showmHeader=p;  };
        @Input() set mobileClassName(p: string){ this.showmNav=p;  };
        @Input() set importantMessageText(p: string){ this.importantMessage=p;  };
        deviceInfo = null;
        cartresponse:any=[];
        @Input() menuActiveClass;
        @Input()  dealsoffers;
        @Input()  getVouchersList;
        cartDetails: any=[];
        carttotal: number;
        cartData: boolean = false;
        cartitems:any=[];
        itemQty:Number;Qty:any;
        customeravailablepoints:any;customeravailableStatus:Boolean=false;
        FM_BULKORDER_QTYLIMIT:any=15;
        ShowCookiePopup:boolean=false;
        Cookies:any = {'GA':false,'GTM':false,'AL':false};
        AcceptAllBtn:boolean=false;
        SaveCloseBtn:boolean=true;
        showHeader:any;  showMenu:boolean=true;
        enablePushBox:boolean=false;
        enableQuesBox:boolean=true;
        enableQuesBoxNew:boolean=true;
        enablePushContentBox:boolean=false;
        notifyOpacity:boolean=false;
        pushNotification_disable:boolean=false;
        enablePushTitle:boolean=false;
        notificationContainer:boolean=false;
        disableContainer:boolean=false;
        enableContextBox:boolean = false;
        viewMoreBox:boolean = true;
        viewLessBox:boolean = false;
        prefere:any=[];
        toastPush:boolean=false;
        pushPopup:any;
        pushcount:any=0;
        pushid:any;
        pushids:any=[];
        read:any=[];
        filterHtml:any;
        contentHtml:any;
        htmltoast:any;
        html:any;
        analytics:any;
        state: string = 'default';
        new_header_footer:any=0;
        showName:string;
        pushcountavail:any;

        ShowCookieTab:boolean=false;
        cookieMessage;cookieAgree;cookieMessageType;cookieConsent:boolean=false;cookieExpiredDate: any = new Date();
        disclimerConsent:boolean=false;
        is_main:number=0;
        voiceActiveSectionDisabled: boolean = true;
        voiceActiveSectionError: boolean = false;
        voiceActiveSectionSuccess: boolean = false;
        voiceActiveSectionListening: boolean = false;
        voiceText: any;
        parsed_date:any;
        relative_to:any;
        push_ids:any;
        cdnnotifyUrl:any;
        isMobile:boolean= false;
        delta:any;
        payzrestriction:boolean=false;
        cardList:any=[];
        showcards:boolean=false;
        mainRedirect:any;
	notificationball:boolean=true;

 @ViewChild("content") modalContent: TemplateRef<any>;
  constructor(private _flightService:FlightService,private ngZone: NgZone,private modalService: NgbModal,
  private cookieService: CookieService, private router: Router,private sg: SimpleGlobal, public rest:RestapiService,private EncrDecr: EncrDecrService,@Inject(DOCUMENT) private document: any,private _elRef: ElementRef, public deviceService: DeviceDetectorService, private cartService: CartService,private dialog: MatDialog,private communicate: CommunicationService,private appConfigService:AppConfigService, public commonHelper: CommonHelper,protected htmlSanitizer: DomSanitizer,private es: ElasticsearchService, private activatedRoute: ActivatedRoute, private _DisclaimerSheetComponent:MatBottomSheet) {
        this.isMobile = window.innerWidth < 991 ?  true : false;
  
     setTimeout(() => {
    //Check Laravel Seesion
        if(this.sg['customerInfo']){
         var customer_cookie;
          if(this.sg['customerInfo'].customer_cookie == 1)customer_cookie = 1;
          
            if(this.sg["customerInfo"]["guestLogin"]==true){
            this.guestLogin=true;
              this.customerLogin = false;
            }else{
          if(customer_cookie == 1){
               this.customerInfo = this.sg['customerInfo'];
               this.customer_full_name=this.customerInfo['firstname']+' '+this.customerInfo['lastname'];
             if(this.fp_popup_control==1 && sessionStorage.getItem("showfp")=="1"){
              this.showModal();  
              sessionStorage.setItem("showfp", "0");
              } 
  
              this.customerLogin = true;
              if (this.customerInfo.hasOwnProperty('ccustomer')){
                this.customeravailableStatus=true;
                this.customeravailablepoints=(Number(this.customerInfo['ccustomer'].points_available)).toLocaleString('en-IN'); 
                if(this.customerInfo['ccustomer'].card_variant)
                this.sg['card_variant'] = this.customerInfo['ccustomer'].card_variant;
                else
                 this.sg['card_variant'] = 'Other Credit/Debit Card';

              }else{
                this.customeravailableStatus=false;
                this.customeravailablepoints="";
                 this.sg['card_variant'] = 'Other Credit/Debit Card';
              }

		if(sessionStorage.getItem("showdcEMI")!="0"){
			this.showdcEMI=true;
			this.dcemi_offer_image=sessionStorage.getItem("dcemi_offer_image");
			this.dcemi_offer_url=sessionStorage.getItem("dcemi_offer_url");
			sessionStorage.setItem("showdcEMI", "0");

               }
      

          }else{
              this.customerInfo =[];
              this.customerLogin = false;
               this.sg['card_variant'] = 'Other Credit/Debit Card';
          }
        }  
        
      }

      
  }, 50);
  
  
  
  
    this.serviceSettings=this.appConfigService.getConfig();
    this.FM_BULKORDER_QTYLIMIT=AppConfig.FM_BULKORDER_QTYLIMIT;
    
        this.cookieMessage=this.serviceSettings.cookieMessage;
        this.cookieAgree=this.serviceSettings.cookieAgree;
    
        const cookieExists: boolean = this.cookieService.check(this.serviceSettings.cookieName);
        
        if(this.serviceSettings.COOKIE_CONSENT_ENABLED){
        switch(this.serviceSettings.COOKIE_CONSENT_TYPE) { 
        case 3: { 
         
        break; 
        } 
        case 2: { 
                if(cookieExists){  
                this.cookieConsent=false;
                }else{
                 this.cookieConsent=true;
                }
            this.cookieMessageType='new';    
        break; 
        } 
        case 4: { 
                if(cookieExists){  
                this.cookieConsent=false;
                }else{
                 this.cookieConsent=true;
                }
           this.cookieMessageType='updated';          
        break; 
        } 
        default: { 
                if(cookieExists){  
                this.cookieConsent=false;
                }else{
                 this.cookieConsent=true;
                }
           this.cookieMessageType='old';          
        break; 
        } 
        } 
        }else{
        this.cookieConsent=false;
        }
    

    this.is_main=environment.IS_MAIN;
    this.cdnUrl = environment.cdnUrl+this.sg['assetPath'];
    this.cdnnotifyUrl = environment.cdnnotifyUrl+this.sg['assetPath'];
    this.busUrl = environment.BUS_SITE_URL[this.sg['domainName']];
    this.trainUrl = environment.TRAIN_SITE_URL[this.sg['domainName']];
    this.showCart=this.serviceSettings.DOMAIN_SETTINGS[this.sg['domainName']]['FRESHMENU'];
    this.freshMenuUrl = environment.FRESHMENU_SITE_URL[this.sg['domainName']];
    this.rd_site_url=environment.RD_SITE_URL[this.sg['domainName']];
    this.shop_site_url=environment.SHOPTIMIZE_SITE_URL[this.sg['domainName']];
   
    this.natgeoUrl = environment.NATGEO_SITE_URL[this.sg['domainName']];
    this.golfUrl = environment.GOLF_SITE_URL[this.sg['domainName']];
    this.dreamfolksUrl = environment.DREAMFOLKS_SITE_URL[this.sg['domainName']];
    
    this.domainPath=this.sg['domainPath'];
    this.assetPath=this.sg['assetPath'];
    this.domainName=this.sg['domainName'];
  //  console.log(this.domainName=this.sg['domainName']);

    this.enablePrivileges=this.serviceSettings.enablePrivileges;
    
    
    this.DOMAIN_SETTINGS=this.serviceSettings.DOMAIN_SETTINGS[this.sg['domainName']];
    
    this.menuOfferDropdown=this.serviceSettings.menuOfferDropdown;
    this.fp_popup_control = this.serviceSettings.home_page_banner;
    this.scrollMenu=this.serviceSettings.scrollMenu;
    this.new_header_footer=this.serviceSettings.DOMAIN_SETTINGS[this.sg['domainName']]['new_header_footer'];
    
           const cookieExistsp: boolean = this.cookieService.check(this.serviceSettings.payzapp_cookiename);
                if(cookieExistsp){  
                    this.payzrestriction=true;
                }else{
                     this.payzrestriction=false;
                } 
                
                
     if(this.serviceSettings.notifications==1){   
    //FCM Analytics
   /*const firebaseConfig = {
            'messagingSenderId': '542467933836',
            'apiKey': 'AIzaSyAYOC_9NVfLasdyx1d4CBEqdlcECAOtlFg',
            'projectId': 'sbnotification-602a8',
            'appId': '1:542467933836:web:dba008412c18db79669da9',
            'measurementId':'G-B203KPTBR1',
    };
    const app = initializeApp(firebaseConfig);
    this.analytics = getAnalytics(app);
    //FCM Analytics
    */
   }
    if (this.cookieService.get("push_enable")!='undefined') { 
        this.enablePushTitle = true;
        this.getNotification();
       
    }
    Window["myComponent"] = this;
 
  }

  
  toast(val,index){

    var html;
    switch(val['type']){
              case 'TEXT':
                 html ='<div class="toast_push " id="toast_'+index+'"  >'+
                                                 '<div class="toast-body" > <div class="toast-wrapper"> <button type="button" class="ml-2 mb-1 close close_btn"  data-bs-dismiss="toast_push"   aria-label="Close" (click)="toastClose()" onclick="Window.myComponent.toastClose('+index+')">'+
                          '<span class="toast-close" aria-hidden="true" >&times;</span>'+
                        '</button><div class="toast-wrap" (click)="trackEventToastClick()" onclick="Window.myComponent.trackEventToastClick(\''+val['redirect_url']+'\','+val['id']+')">  <a href="'+val['redirect_url']+'">  <img src="'+this.cdnUrl+'images/push-icon.svg" class="img-fluid push-image-placeholder" alt="..."  ><div class="text-truncate"><h6 class="toast-font" style="-webkit-box-orient: vertical;">'+val['title']+'</h6><p class="toast-para" style="-webkit-box-orient: vertical;">'+val['text']+'</p></div></div></a></div>'+
                                                '</div></div>';
              break;
              
                case 'TEXT_LOGO':
                  var subimage_url = '';
                  if(val['serviceToken'] !=null ){
  
                     subimage_url=val['serviceToken'].toLowerCase();
                 }else if(val['tag'] !=null){
  
                     subimage_url=val['tag'].toLowerCase();
                 }else{
  
                     subimage_url='';
                 }
                 subimage_url = this.cdnnotifyUrl+'services/'+subimage_url+'.png';
                 var image_url = ''
                 if(val['image_url'] != null && val['image_url'] != ''){
                    image_url=val['image_url'];
                  }else if(val['logo_url'] !=null && val['logo_url'] !=''){
                    image_url=val['logo_url'];
                  }else if(val['partner_token'] != null && val['partner_token'] != ''){
                    image_url=this.cdnnotifyUrl+'partner/'+val['partner_token'].toLowerCase()+'.png';
                  }else{
                    image_url='';
                  }
                 html ='<div class="toast_push " id="toast_'+index+'"  >'+
                                                 '<div class="toast-body" ><div class="toast-wrapper"> <button type="button" class="ml-2  close close_btn"  data-bs-dismiss="toast_push"   aria-label="Close" (click)="toastClose()" onclick="Window.myComponent.toastClose('+index+')">'+
                                                 '<span class="toast-close" aria-hidden="true" >&times;</span>'+
                                               '</button></div> <div class="toast-wrap col-md-12 p-0" (click)="trackEventToastClick()" onclick="Window.myComponent.trackEventToastClick(\''+val['redirect_url']+'\','+val['id']+')"><a href="'+val['redirect_url']+'" target="_blank">  <div class="row"><div class="col-2 "><div class="push-wrapper-new"><img src="'+image_url+'" class="" alt="..." style="max-width: fit-content;"  ><img class="notify-pos-abs" src="'+subimage_url+'" alt=""/></div></div><div class="text-truncate-new col-10">'+
                        '<h4 style="-webkit-box-orient: vertical;">'+val['title']+' </h4>'+
                                          '<h5 style="-webkit-box-orient: vertical;">'+val['text']+' </h5>'+
                                          '<p style="-webkit-box-orient: vertical;"> '+this.converttime(val['created_at'])+'</p></div></div></div>'+
                                                '</div></div></a>';
              break;
              case 'TEXT_IMAGE':
                 html ='<div class="toast_push " id="toast_'+index+'"  >'+
                          '<div class="toast-body" > <div class="toast-wrapper"> <button type="button" class="ml-2 mb-1 close close_btn"  data-bs-dismiss="toast_push"   aria-label="Close" (click)="toastClose()" onclick="Window.myComponent.toastClose('+index+')">'+
                          '<span class="toast-close" aria-hidden="true" >&times;</span>'+
                         '</button><div class="toast-wrap" (click)="trackEventToastClick()" onclick="Window.myComponent.trackEventToastClick(\''+val['redirect_url']+'\','+val['id']+')">  <a href="'+val['redirect_url']+'">  <div class="text-truncate ng-truncate"><h6 class="toast-font ng-font" style="-webkit-box-orient: vertical;">'+val['title']+'</h6><p class="toast-para ng-para" style="-webkit-box-orient: vertical;">'+val['text']+'</p><img src="'+val['image_url']+'" class="img-fluid push-image-placeholder ng-img-placeholder" alt="..."  ></div></div></a></div>'+
                          '</div></div>';
              break;
            }
            return html;

  }
  converttime(date_str){
    if (!date_str) {return;}
    date_str = $.trim(date_str);
    date_str = date_str.replace(/\.\d\d\d+/,""); // remove the milliseconds
    date_str = date_str.replace(/-/,"/").replace(/-/,"/"); //substitute - with /
    date_str = date_str.replace(/T/," ").replace(/Z/," UTC"); //remove T and substitute Z with UTC
    date_str = date_str.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"); // +08:00 -> +0800
    this.parsed_date = new Date(date_str);
    this.relative_to = (arguments.length > 1) ? arguments[1] : new Date(); //defines relative to what ..default is now
    this.delta = <number>((this.relative_to.getTime()-this.parsed_date)/1000);
    this.delta=(this.delta<2)?2:this.delta;
    var r = '';
    if (this.delta < 60) {
    r = this.delta + ' seconds ago';
    } else if(this.delta < 120) {
    r = 'a minute ago';
    } else if(this.delta < (45*60)) {
    r = (<number>(this.delta / 60, 10)).toString() + ' minutes ago';
    } else if(this.delta < (2*60*60)) {
    r = 'an hour ago';
    } else if(this.delta < (24*60*60)) {
    r = '' + (<number>(this.delta / 3600, 10)).toString() + ' hours ago';
    } else if(this.delta < (48*60*60)) {
    r = 'a day ago';
    } else {
    r = (<number>(this.delta / 86400, 10)).toString() + ' days ago';
    }
    return r;
  }
     receiveVoiceSearchResults($event) {
        $('.sb_search').val($event);
        this.showSearchBox = true;
        this.topSearch=false;
        this.queryTextSearch = $event;
        this.searchBarValue = $event;

        let searchParam = {
        searchDisplayForm: 'shopping',
        queryText: this.queryTextSearch
        };
         this.es.esSearch(searchParam).subscribe(res => {
         console.log('f');
         if( res.hits.hits.length == 0){ 
         this.topSearch=true;
         }
         this.searchResults =res.hits.hits;
         });

    }
  enablePushClick(){
    if (!this.cookieService.get("push_enable")) { 
      this.cookieService.set('push_enable','1', null, '/', null, null, null);
    }
       this.enableQuesBox=false;
       this.enableQuesBoxNew=false;
        this.enablePushContentBox=true;
       this.getNotification();
    // }
      this.enablePushBox=true;
      this.enablePushTitle = true;
      this.notifyOpacity = true;
      $('.myaccount-drop').removeClass('show');
  }
  enableMoreClick() {
    
    this.enableContextBox = true;
    this.viewMoreBox = false;
    this.viewLessBox = true;
  }
  enableLessClick() {
    this.enableContextBox = false;
    this.viewMoreBox = true;
    this.viewLessBox = false;
  }

  
  toastClose(pushpopid){
    document.getElementById('toast_'+pushpopid).style.display = 'none'
    this.toastPush=false;
  }
  clear(){
    this.searchBarValue = null;
  }

  trackEventNotificationClick(urls,id){
    this.getCountClicked(id);
    let trackUrlParams = new HttpParams()
	.set('current_url', window.location.href)
	.set('category', 'push notification view')
	.set('event', 'Enable Push notification')
	.set('metadata','{"url":"' + urls + '"}');
  
	 const track_body: string = trackUrlParams.toString();
	 this.rest.trackEvents( track_body).subscribe(result => {});
   this.analyticsLogEvent('notification_click',id,urls);
  }

  trackEventToastClick(toastUrls,id){
    let trackUrlParams = new HttpParams()
	.set('current_url', window.location.href)
	.set('category', 'Push Notification toast')
	.set('event', 'Push Notification offer click action toast')
	.set('metadata','{"url":"' + toastUrls + '"}');
  
	 const track_body: string = trackUrlParams.toString();
	 this.rest.trackEvents( track_body).subscribe(result => {});
   this.analyticsLogEvent('notification_click',id,toastUrls);
  }

  onImgError(event) {
    event.target.src = this.cdnUrl + 'notification/services/default.png';

  }
  
closeCookieConsent(value){
  if(value==1){
    this.Cookies.GA=true;
    this.Cookies.AL=true;
    this.Cookies.GTM=true;
  }
  else if(value==2){
    this.Cookies.GA=false;
    this.Cookies.AL=false;
    this.Cookies.GTM=false;
  }
  else if(value==3){
      var cookie_value=['SN'];
      if(this.Cookies.GA==true){
        cookie_value.push('GA');
      }
      if(this.Cookies.AL==true){
        cookie_value.push('AL');
      }
      if(this.Cookies.GTM==true){
        cookie_value.push('GTM');
      }
      value=cookie_value;
  }
	let urlParams = new HttpParams()
	.set('name', 'accept-cookie')
	.set('value',value);
  
	const body: string = urlParams.toString();
	
        this.rest.setCookieConsent( body).subscribe(result => {
	 this.cookieConsent=false;
   this.ShowCookiePopup=false;
	});
	}
	
   closeDisClimerConsent(value){
          $('#disclamierPopup').modal('hide');
        let urlParams = new HttpParams()
        .set('name', 'accept-cookie')
        .set('value',value)
        .set('type','DISCLAIMER');
        const body: string = urlParams.toString();
        this.rest.setCookieConsent( body).subscribe();
        return;
     }	
	


  enablePushBtn(){
    this.cookieService.set('push_enable','1', null, '/', null, null, null);
    this.enableQuesBox=false;
    this.enableQuesBoxNew=false;
    this.enablePushContentBox=true;
    this.enablePushTitle = true;
    this.getNotification();

  }
  getNotification(){
    this.rest.getNotification().subscribe(result => {
      this.filterHtml = this.htmlSanitizer.bypassSecurityTrustHtml(result.filterhtml);
      this.contentHtml = this.htmlSanitizer.bypassSecurityTrustHtml(result.html);
      this.pushcount = result.result.length;
        console.log(result);
        
        const unreadId = [];
        const readId = [];
        var blue_dott=""; var classs="";
        result.result.forEach((v, k) =>  {    
       
              if((unreadId.indexOf(unreadId) === -1)){
                unreadId.push(v['id']);         
              } 
            // console.log(document.getElementById("offers-tab-content_" + v['id']).classList.contains("clicked_" + v['id']));
             var idcondition = document.getElementById("offers-tab-content_" + v['id']);
		if(idcondition){
              var condition = document.getElementsByClassName("clicked_" + v['id']).length>0;
              if(condition && (readId.indexOf(readId) === -1)) {
                readId.push(v['id']);
              }
		}
                  this.analyticsLogEvent('notification_received',v['id'],v['redirect_url']);

        });
				
		// console.log(readId.length);
		// console.log(unreadId.length);
          if(this.cookieService.get('push_status') != undefined)
          {	
		if(this.cookieService.get('read_notify'))this.notificationball = false;   

              if((readId.length === unreadId.length) ) {
		
		//if(filtered){
                  this.cookieService.set('read_notify','1', null, '/', null, null, null);
                  $('#notify-boll').removeClass('img-number');        
                  $('#notify-boll').removeClass('number'); 
		this.notificationball = false;                           
              } else {    
                              
                 /* this.cookieService.set('read_notify','0', null, '/', null, null, null);
                  $('#notify-boll').addClass('img-number');     
                  $('#notify-boll').addClass('number'); 
		this.notificationball = true;  */ 
              }

          } else {
              this.cookieService.set('read_notify','0', null, '/', null, null, null);
                $('#notify-boll').addClass('img-number');    
                $('#notify-boll').addClass('number'); 
              // readId = [];
              // unreadId = [];
          }
		

            //console.log(unreadId+"   ---    "+readId);  
      
    });
  }

    analyticsLogEvent(event,id,url){
    var customerid ='';
    if(this.customerInfo != undefined && this.customerInfo.hasOwnProperty('id')){
      customerid=this.customerInfo['id']
    }
    
    // logEvent(this.analytics, event,{
    //           notification_url: url,
    //           notification_id: id,
    //           customer_id: customerid,
    //         });
  }

  disablePushBtn(){
    this.enablePushBox=false;
    this.notifyOpacity = false;

  }
  disablePushBtnCancel(){
    this.enablePushBox=false;
    this.disableContainer=!this.disableContainer;
  }
  enableCartBox:boolean=false;
  notifyOpacityCart:boolean=false;
 
  disableCartBtn(){
    this.enableCartBox=false;
    this.notifyOpacityCart = false;
      this.shoppingcart = false;
  }
  
  
  enableCartClick(){
      $('.myaccount-drop').removeClass('show');
      this.enableCartBox=true;
      this.notifyOpacityCart = true;
       this.shoppingcart = true;
  }
  
  disPushBtn(){
    this.enablePushBox=false;
    this.enableQuesBox=true;
    this.enableQuesBoxNew=true;
    this.disableContainer=!this.disableContainer;
    this.notificationContainer=false;
    this.enablePushContentBox=false;
    this.cookieService.delete('push_enable', '/');
    this.enablePushTitle = false;
    this.pushNotification_disable=false;
  }
  removeDisablemodal(){
    this.enablePushBox=false;
    this.pushNotification_disable=false;

  }
  disPushBtnmob(){
    this.notificationContainer=false;
    this.enablePushContentBox=false;
    this.pushNotification_disable=true;
  }
  toggleNotification(){
    var preference = this.cookieService.get("preference-data");
    preference=JSON.parse(preference);
    // for (var index in preference) {
    //   this.prefere.push(index);
    // }
    
    this.notificationContainer=!this.notificationContainer;
    this.disableContainer=false;
    this.state = (this.state === 'default' ? 'rotated' : 'default');
  }
  toggleDisNoti(){
    this.disableContainer=!this.disableContainer;
    this.notificationContainer=false;

  }
  toggleCheckBox(element){
    
    return (this.prefere.indexOf(element) != -1) ? true : false;
  }

  onPreferenceSubmit(data:FormsModule){

  }
  showModal() {
    this.modalService.open(this.modalContent, { centered: true, windowClass: 'flexi_popContent' }).result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
	CloseCookieMark(){
    this.ShowCookiePopup=false;
    this.ShowCookieTab=false;
  }
  checkCheckBoxCookievalue(event){
    this.SaveCloseBtn=false;
    this.AcceptAllBtn=true;
  }


	
  ShowCookiePopUp(value){
    this.cookieConsent=false;
     this.ShowCookiePopup=value;
  }
  ShowCookieTabBtn(value){
     this.ShowCookieTab=value;
  }

  ngAfterViewInit(){
    
   if (!annyang) {
    $('.mic-span').hide();
   }
      this.deviceInfo = this.deviceService.getDeviceInfo();
        if(this.serviceSettings.DISCLAIMER_ENABLED){
        const cookieExistsDisclimer: boolean = this.cookieService.check(this.serviceSettings.cookieDisclaimerName);
         if(!cookieExistsDisclimer){
         
          if(this.deviceService.isMobile()){
               setTimeout(()=>{                          
                this.OpenDisclaimerMobile();
                }, 3000);
           
          }else{
           setTimeout(function() {
           $('#sb_dis_popup').trigger('click');   }, 3000);
          }
        }  
        }
          var update=0;
        if(this.deviceInfo.browser == "Chrome" && this.deviceInfo.browser_version <23){
		 update=1;
	}
	if(this.deviceInfo.browser  == 'Safari' &&this.deviceInfo.browser_version  <6){
		 update=1;
	}
	if(this.deviceInfo.browser  == 'Msie' && this.deviceInfo.browser_version <10){
		 update=1;
	}
	if(this.deviceInfo.browser =='Firefox' && this.deviceInfo.browser_version  <15){
		 update=1;
	}
	if(update == 1 && sessionStorage.getItem("browserDetectionShown")!="1"){
	        sessionStorage.setItem("browserDetectionShown", "1");
      $('#myModal').modal('show');
	}
  }
  
  ngOnInit() {

    this.mainRedirect=this.DOMAIN_SETTINGS['main_domain_url']+'/';

    this.domainRedirect=this.DOMAIN_SETTINGS['sub_domain_redirection_url']+'/'+this.domainPath;
    this.sub_domain_redirection_url=this.DOMAIN_SETTINGS['sub_domain_redirection_url']+'/';
    if(this.DOMAIN_SETTINGS['FRESHMENU'])
    this.getcart();

       
       this.router.events.subscribe((event: any) => {
	if (event instanceof NavigationEnd) {
	
	 if (event.url.includes("train-traveller") || event.url.includes("bus/booking") ||  event.url.includes("freshmenu/review-order") ) 
	this.loginUrl='check-login';
	else
	this.loginUrl='check-login?g=1';
	
	 if (event.url.includes("compare-fly")) 
          this.activeMenu='compare-fly';
         else if (event.url.includes("flights")) 
          this.activeMenu='compare-fly';
         else
           this.activeMenu='home';

        }
    });

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
      if(event.url.includes('freshmenu')){
        this.displayCart = true;
      }else{
        this.displayCart = false;
      }
    }
    });



      let queryParamMap=this.activatedRoute.snapshot.queryParamMap;
    	if(queryParamMap.keys[0])
    	 this.redirectUrlpopup(queryParamMap.keys[0],0,'smartbuy');

      /*this.customerInfo=  JSON.parse(this.EncrDecr.get('drw6SKRtkeqkTBiXIayqU5HyPwGeiveIXQzuz/KGDsQq9voz8OBqnyumqoqWhUuxRGwQAcwa6Lm/pES4C3pOhnz0JOc2xmIeYFuC2LDYt2+9dhekELisHSTBHbIchrIkeGf6q8KafxHJ1uTCm+Viqh04rkThML9wSQjbTHGsKr/di5FuMSBZKkM9x54/c5YKyWk21WLS5LC1J9e2syYncmY2dOdbpO94WJgc4udqIOGQFlzqptKFugCzph4sMg00y7tLpzFBXj5ZMPzeVtI1WbvjZ6J97k/h0NvdoPy+uZ1u1ggZht8htFI/eodX6decl0Qfe956+fRCewg5AYpAC1oT6Me9GDXOojqCORK5O7MoqTfBuEQYFleGQtIzV783Y2VmVvdmdusnVyI29JncPA=='));
      this.customerLogin=true;*/
      this.getAllcards();     
  
    }
    
    initializeVoiceRecognitionCallback(): void {
        annyang.addCallback('error', (err) => {
        if(err.error === 'network'){
        this.voiceText = "Internet is require";
        annyang.abort();
        this.ngZone.run(() => this.voiceActiveSectionSuccess = true);
        } else if (this.voiceText === undefined) {
        this.ngZone.run(() => this.voiceActiveSectionError = true);
        annyang.abort();
        }
        });
        annyang.addCallback('soundstart', (res) => {
        this.ngZone.run(() => this.voiceActiveSectionListening = true);
        });

        annyang.addCallback('end', () => {
        if (this.voiceText === undefined) {
        this.ngZone.run(() => this.voiceActiveSectionError = true);
        annyang.abort();
        }
        });

        annyang.addCallback('result', (userSaid) => {
        this.ngZone.run(() => this.voiceActiveSectionError = false);

        let queryText: any = userSaid[0];

        annyang.abort();

        this.voiceText = queryText;
        this.receiveVoiceSearchResults(queryText);
        this.ngZone.run(() => this.voiceActiveSectionListening = false);
        this.ngZone.run(() => this.voiceActiveSectionSuccess = true);
        });
        }

        startVoiceRecognition(): void {
        this.voiceActiveSectionDisabled = false;
        this.voiceActiveSectionError = false;
        this.voiceActiveSectionSuccess = false;
        this.voiceText = undefined;

        if (annyang) {
      
        let commands = {
        'demo-annyang': () => { }
        };

        annyang.addCommands(commands);

        this.initializeVoiceRecognitionCallback();
      
        annyang.start({ autoRestart: false });
        }else{
             $('.mic-span').hide();
        }
        }

        closeVoiceRecognition(): void {
        this.voiceActiveSectionDisabled = true;
        this.voiceActiveSectionError = false;
        this.voiceActiveSectionSuccess = false;
        this.voiceActiveSectionListening = false;
        this.voiceText = undefined;

        if(annyang){
     
        annyang.abort();
        }
        }
    
    showcartIcon:Boolean=true;
    ngOnChanges() {  
    
    this._flightService.currentHeader.subscribe((res) => this.showHeader=res);
      //show-hide menu list 
      this.communicate.receivedFilter4.subscribe((item: Boolean) => {
        this.showcartIcon=item; 
      });
      //update customer available points
      this.communicate.receivedFilter7.subscribe((item7: any) => {
        this.customeravailablepoints=(Number(item7)).toLocaleString('en-IN'); 
      });
    }
  
	 @HostListener('document:click', ['$event'])
		hostClick(event) {

		if (this.showSearchBox && !this._elRef.nativeElement.contains(event.target)){
		this.showSearchBox = false;
		}
	    
	  }
	 toggleNavbar() {
	    this.navbarOpen = !this.navbarOpen;
    }
    menuMobile(val){
      this.navbarOpen = false;
      this.navbarOpenMenu = !this.navbarOpenMenu;
      this.showName = val;
    }
    
    goBack(){
      this.navbarOpenMenu = false;
      this.navbarOpen = true;
    }
    

    
    
    getcart(){
      this.cartService.getcartdetails().subscribe(data => {
        this.cartService.updatecartdetails(data);
        this.cartresponse = data;
        this.updatecarthtml();
    },(err: HttpErrorResponse) => {
          var message = 'Sorry, there seems to be some technical issues. Please try again after some time.';
         // console.log(message);
    });
    }

	searchBar($event) {
	this.queryTextSearch = $event.target.value;
	if(this.queryTextSearch.length > 2) {
	this.showSearchBox = true;
	this.topSearch=false;
	//if ($event.timeStamp - this.lastKeypressSearch > 100) {

        let searchParam = {
        searchDisplayForm: 'shopping',
        queryText: this.queryTextSearch
        };
         this.es.esSearch(searchParam).subscribe(res => {
         if( res.hits.hits.length == 0) this.topSearch=true;
         this.searchResults =res.hits.hits;
         });

	//}
	//this.lastKeypressSearch = $event.timeStamp;
         }
	}
	
	 onKeyDownEvent(event: any) {
          if(event.target.value){	 
	  if(this.serviceSettings.enableAlgolia)
         this.document.location.href = this.DOMAIN_SETTINGS['main_domain_url']+'/offer_search?offers%5Bquery%5D='+escape(event.target.value);
        else
        this.document.location.href = this.DOMAIN_SETTINGS['main_domain_url']+'/offer_search?q='+escape(event.target.value);
	 }
	 }

       onSearchClick(searchOption) {
       
         if(this.serviceSettings.enableAlgolia)
         this.document.location.href = this.DOMAIN_SETTINGS['main_domain_url']+'/offer_search?offers%5Bquery%5D='+escape(searchOption['fields']['name'][0]);
        else
        this.document.location.href = this.DOMAIN_SETTINGS['main_domain_url']+'/offer_search?q='+escape(searchOption['fields']['name'][0]);
       }

	toggleSearchBox(){
	this.showSearchBoxTop=!this.showSearchBoxTop;
	}
	
	megaMenuEvent (event){
	 if(event=='show')
	 $(".redeem-menu,.overlay-hover-redeem").addClass("show-overlay-menu");
	 else
	  $(".redeem-menu,.overlay-hover-redeem").removeClass("show-overlay-menu");
	
	}
	
		
	megaMenuFeaturesEvent (event){
	 if(event=='show')
	 $(".redeem-menu-features,.overlay-features").addClass("show-overlay-menu");
	 else
	  $(".redeem-menu-features,.overlay-features").removeClass("show-overlay-menu");
	
  }
  expEvent(event){ 
    if(event=='show')
    $(".exp-menu-features,.overlay-features").addClass("show-overlay-menu");
    else
     $(".exp-menu-features,.overlay-features").removeClass("show-overlay-menu");
   
   }

  shopping() { 
      this.cartService.cartDetails.subscribe(cartresponse => this.cartresponse = cartresponse);
      if(this.cartresponse != undefined && this.cartresponse.status != undefined){
          //this.Qty=0;
          this.updatecarthtml();
          this.shoppingcart = true;
          if(this.shoppingcart)  
          this.buttonName = "Hide";
          else
          this.buttonName = "Show";
      }
  }
  emptycart(){
    this.cartService.emptycart('freshmenu').subscribe(data => {
      this.cartService.updatecartdetails(data); 
      this.callshowcart();
    },(err: HttpErrorResponse) => {
        var message = 'Sorry, there seems to be some technical issues. Please try again after some time.';
      //  console.log(message);
    });
  }
  callshowcart(){
    let element: HTMLElement = document.getElementsByClassName('showcart')[0] as HTMLElement;
    element.click();
  }
  updateCartCount() {
    this.cartService.cartDetails.subscribe(cartresponse => this.cartresponse = cartresponse);
    if(this.cartresponse != undefined && this.cartresponse.status != undefined){
          this.updatecarthtml();
    }
  }
    showhidecart(){ 
      this.shoppingcart = !this.shoppingcart;
    }
    count() {
      this.addtocart = !this.addtocart;
    }
    closeDcemiOffer(){
      this.showdcEMI=false;
      sessionStorage.setItem("showdcEMI", "0");
    }
    closeBrowserSupport(){
      this.showdcEMI=false;
    }
    updatecarthtml(){
      this.itemQty=0; 
      var response = JSON.parse(JSON.stringify(this.cartresponse));
      this.cartDetails = [];
      if(response.status == "true" && response.cartitems != undefined){
          this.cartitems = response.cartitems; 
          for (var key in this.cartitems) {
            if (this.cartitems.hasOwnProperty(key)) {
              var val = this.cartitems[key];
              this.itemQty += this.cartitems[key].qty;
              this.cartDetails.push(val);
            }
          }
          //BULK ORDER - storing item quantity in session storage
          //sessionStorage.setItem('qty',JSON.stringify(this.itemQty));
          this.Qty=this.itemQty;
          this.cartData = true;
          this.carttotal = response.totalamount;
        }
    }
    updatecart(rowid,action){
      //BULK ORDER
        if(action==1){
          if(this.Qty >= Number(this.FM_BULKORDER_QTYLIMIT)){
            this.openBulkOrder();
            return;
          }
        }
        var cqty = this.cartitems[rowid].qty; 
        var partner = this.cartitems[rowid].options.partnerToken; 
        var qty= cqty + 1;
        if(action != 1) qty= cqty - 1;
        var p ={
          rowId:rowid,
          qty:qty,
          partnerToken:partner
        }
        var ParamStr = JSON.stringify(p);
        //**** GET SHOPPING MENU FOR THAT LOCATION
        this.cartService.updatecart(ParamStr).subscribe(data => {
          this.cartresponse = data;
          this.cartService.updatecartdetails(this.cartresponse);
          this.updatecarthtml();

          //update item count when cart item inc/dec in mini cart
          var item6:Boolean = true;
          this.communicate.raiseEvent6(item6); 

          this.shoppingcart = true;
          // let element: HTMLElement = document.getElementsByClassName('updatecart')[0] as HTMLElement;
          // element.click();
        },(err: HttpErrorResponse) => {
            var message = 'Sorry, there seems to be some technical issues. Please try again after some time.';
           // console.log(message);
        });
      
    }
    placeorder(){ 
      //BULK ORDER
      //var qty=JSON.parse(sessionStorage.getItem('qty'));
      if(this.Qty >= Number(this.FM_BULKORDER_QTYLIMIT)){
        this.openBulkOrder();
        return;
      }else{
        var searchArray = {service:'freshmenu'};
        this.shoppingcart = false;
        this.router.navigate([this.sg['domainPath']+'freshmenu/review-order'], { queryParams: searchArray  });
      }
    }
    openBulkOrder(){
      let message = "It's your bulk order";
      const dialogRefBulkOrder = this.dialog.open(bulkOrderdialogHeader,
        {
        width:'600px',
        data: {
          messageData: message
        }
      });
    }
    onClickedOutsideCartFilter(e: Event) {
      this.shoppingcart=false;
    }
    showExperience:Boolean;
    onClickedOutsideExperience(e: Event) {
      this.showExperience=false;
    }
    onClickExperience(){
      this.showExperience=true;
    }
    
    checkRedirectDomain(){
    if(this.serviceSettings.sub_domain_redirection==1){
     this.toggleNavbar();
     
     const isDesktopDevice = this.deviceService.isDesktop();
     
      if(isDesktopDevice){
      const dialogRef = this.dialog.open(RedirectDialog, {
      autoFocus: false,
       panelClass: 'alert_covid',
        width: '800px',
       data: {
       mside:0,
          redirectUrl:  this.DOMAIN_SETTINGS['main_domain_url']+'/deals'
        },
      disableClose: true
    });
      }else{
          const dialogRef = this.dialog.open(RedirectDialog, {
      autoFocus: false,
       panelClass: 'alert_covid',
        width: '96vw',
        maxWidth: '96vw',
       data: {
       mside:1,
          redirectUrl:  this.DOMAIN_SETTINGS['main_domain_url']+'/deals'
        },
      disableClose: false
    });
      }

    
    }else{
    window.location.href = this.DOMAIN_SETTINGS['main_domain_url']+'/deals';
    }
    
    }


 redirectPopupTrigger:number=0; redirectPopupPartner;redirectPopupType;redirectPopupUrl;redirectPopupHeader;redirectPopupImpmessage;redirectPopupMessage;redirectPopup;
   redirectPopupTriggerTimestamp;
    redirectUrlpopup(partner,type,url){
    const current = new Date();
    if(url){
        let partnerData=this.serviceSettings['lang']['popup_redirections'][partner];
        this.redirectPopupHeader=partnerData[partner+'_title'];
        this.redirectPopupImpmessage=partnerData[partner+'_pup_importantText'];
        this.redirectPopupMessage=partnerData[partner+'_pup_dearcustomer'];

        if(type==1){
        this.redirectPopupUrl= this.domainRedirect+'insta-redirection/shopredirectLink?u='+(window.btoa(url));
         this.redirectPopup=1;
        }else{
        this.redirectPopupUrl= this.DOMAIN_SETTINGS['sub_domain_redirection_url']+'/'+'popup-redirection/'+partner ;
         this.redirectPopup=1;
        } 
    
        this.redirectPopupPartner=partner;
        this.redirectPopupType=type;
        this.redirectPopupTrigger=1;
       
        this.redirectPopupTriggerTimestamp=current.getTime();
      }
       this.navbarOpen =false;
     } 
     
    redirectDisUrl(searchOption){
      let url;
        
       if(this.serviceSettings.enableAlgolia)
        url= this.DOMAIN_SETTINGS['main_domain_url']+'/offer_search?offers[refinementList][category][0]='+escape(searchOption);
        else
       url= this.DOMAIN_SETTINGS['main_domain_url']+'/offer_search?categories='+escape(searchOption);
       
    
      if(environment.IS_MAIN==1){
       this.document.location.href =url;
       }else{
        const current = new Date();
        this.redirectPopupTriggerTimestamp=current.getTime();
        this.redirectPopupTrigger=1;
        this.redirectPopup=2;
        this.redirectPopupUrl=url;
        }
         this.navbarOpen =false;
     } 

    clickUrl(url){
     if(environment.IS_MAIN==1){
      const current = new Date();
        this.redirectPopupTriggerTimestamp=current.getTime();
        this.redirectPopupTrigger=1;
        this.redirectPopup=2;
        this.redirectPopupUrl=this.DOMAIN_SETTINGS['sub_domain_redirection_url']+'/'+url;
     }else{
     this.document.location.href =this.DOMAIN_SETTINGS['sub_domain_redirection_url']+'/'+url;
     }
      this.navbarOpen =false;
    }
    
   clickUrlBlank(url){
     if(environment.IS_MAIN==1){
      const current = new Date();
        this.redirectPopupTriggerTimestamp=current.getTime();
        this.redirectPopupTrigger=1;
        this.redirectPopup=2;
        this.redirectPopupUrl=this.DOMAIN_SETTINGS['sub_domain_redirection_url']+'/'+url;
     }else{
  
      window.open(this.serviceSettings.sub_domain_redirection_url+'/'+url,"_blank");
     //window.open(this.DOMAIN_SETTINGS['sub_domain_redirection_url']+'/'+url,"_blank");
     }
      this.navbarOpen =false;
    }
    
     clickUrlmilestone(url){
     if(environment.IS_MAIN==1){
      const current = new Date();
        this.redirectPopupTriggerTimestamp=current.getTime();
        this.redirectPopupTrigger=1;
        this.redirectPopup=2;
        this.redirectPopupUrl=this.DOMAIN_SETTINGS['sub_domain_redirection_url']+'/'+url;
     }else{
     this.document.location.href =this.DOMAIN_SETTINGS['sub_domain_redirection_milestone_url']+'/'+url;
     }
      this.navbarOpen =false;
    }
    
    goTo(path){
     if(environment.IS_MAIN==1){
        const current = new Date();
        this.redirectPopupTriggerTimestamp=current.getTime();
        this.redirectPopupTrigger=1;
        this.redirectPopup=2;
        this.redirectPopupUrl=environment.ANGULAR_SITE_URL+path;
     }else{
     if(path !='foryou' && path !='compare-fly' && path !='bus' && path !='train'  && path !='train/pnr')
      this.document.location.href =this.DOMAIN_SETTINGS['sub_domain_redirection_new_url']+'/'+path;
     else
     this.router.navigate([this.sg['domainPath']+path]);
     }
      this.navbarOpenMenu = false;
      this.navbarOpen =false;
    }
    
    
    getCountClicked(id) {
      this.push_ids = [];
      if(!this.cookieService.get("push_status")){
          this.push_ids.push(id);
          this.cookieService.set('push_status',JSON.stringify(this.push_ids), null, '/', null, null, null);
          // console.log('if',this.push_ids);
      }else{
          this.push_ids = JSON.parse(this.cookieService.get("push_status"));
           if(!this.push_ids.includes(id)){
              this.push_ids.push(id);
              // console.log('else',this.push_ids);
            }
             this.cookieService.set('push_status',JSON.stringify(this.push_ids), null, '/', null, null, null);
            
      }

  }
    
    OpenDisclaimerMobile(): void {
    const config: MatBottomSheetConfig = {
      panelClass: 'mobileDiscalimer-container',
       data: {
          redirectUrl:  this.DOMAIN_SETTINGS['sub_domain_redirection_url']
        }
    };
    this._DisclaimerSheetComponent.open(DisclaimerBottomSheetComponent, config);
  }

      getAllcards()
      {
         this.cartService.getAllCards().subscribe(resp =>{
         // console.log('=====>>',resp);
          if(typeof resp.status != undefined && resp.status === true){
            this.cardList=resp['cardList'];
            this.showcards = true;
          }

        }),(err:HttpErrorResponse)=>{
           alert("Something went wrong, please try again");
          //this.router.navigate([this.sg['domainPath'] + 'milestone']);
        };
      }
    
  }


  export interface DIalogData{
    messageData: string;
  }
  @Component({
   selector: 'bulkorder-header-dialog',
   templateUrl: './bulk-order-dialog.html',
   styleUrls: ['./header.component.scss']
  })
  export class bulkOrderdialogHeader {
    cdnUrl: any;FM_BULKORDER_PHONENO: any;FM_BULKORDER_EMAIL: any;FM_BULKORDER_NOTE: any;
    constructor(public dialogRef: MatDialogRef<bulkOrderdialogHeader>, @Inject(MAT_DIALOG_DATA) public data: DIalogData) {
      this.cdnUrl = environment.cdnUrl;
      this.FM_BULKORDER_PHONENO=AppConfig.FM_BULKORDER_PHONENO;
      this.FM_BULKORDER_EMAIL=AppConfig.FM_BULKORDER_EMAIL;
      this.FM_BULKORDER_NOTE=AppConfig.FM_BULKORDER_NOTE;
    }
    bulkClose(){
      this.dialogRef.close();
    }
  }
  
  
  @Component({
  templateUrl: 'redirect-popup.html',
  styleUrls: ['./header.component.scss']
})
export class RedirectDialog {
  cdnUrl: any;domainName:any;redirectUrl:any;mside:any;
  constructor(
    public dialogRef: MatDialogRef<RedirectDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,private sg: SimpleGlobal,) { 
      this.domainName = this.sg['domainName'];
      this.redirectUrl=data.redirectUrl;
      this.mside=data.mside;
       this.cdnUrl = environment.cdnUrl+this.sg['assetPath'];
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

}


@Component({
  selector: 'app-mobileDisclaimer-bottom',
  templateUrl: './disclaimerBottomSheet.component.html',
  styleUrls: ['./header.component.scss']
})
export class DisclaimerBottomSheetComponent implements OnInit {
   cdnUrl: string;
   domainRedirect:string;
  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any,private sg: SimpleGlobal,public rest:RestapiService, private _DisclaimerSheetComponent: MatBottomSheet, private _bottomSheetRef: MatBottomSheetRef<DisclaimerBottomSheetComponent>) {
  
        this.cdnUrl = environment.cdnUrl+this.sg['assetPath'];
        this.domainRedirect=data.redirectUrl;

  }
 ngOnInit() {}
  closeSheet() {
      let urlParams = new HttpParams()
        .set('name', 'accept-cookie')
        .set('value','1')
        .set('type','DISCLAIMER');
        const body: string = urlParams.toString();
        this.rest.setCookieConsent( body).subscribe(result => {
         this._DisclaimerSheetComponent.dismiss();
        });
    
  }
}
