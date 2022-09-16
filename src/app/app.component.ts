import {Component, OnInit,Inject,HostListener, AfterViewInit, Renderer2,ChangeDetectorRef} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {NavigationStart,NavigationEnd, Router,ActivatedRoute} from '@angular/router';
import {AppConfig} from './configs/app.config';
import { CookieService } from 'ngx-cookie-service';
import { SimpleGlobal } from 'ng2-simple-global';
import { Location } from '@angular/common';
import { BnNgIdleService } from 'bn-ng-idle';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CountdownModule } from 'ngx-countdown';
import { CountdownConfig, CountdownEvent } from 'ngx-countdown'; 
import { RestapiService} from 'src/app/shared/services/restapi.service';
import { HttpClient, HttpHeaders, HttpErrorResponse , HttpParams} from '@angular/common/http';
 import { DeviceDetectorService } from 'ngx-device-detector';
import {environment} from '../environments/environment';
import { AppConfigService } from './app-config.service';
import {EncrDecrService} from 'src/app/shared/services/encr-decr.service';
import { CommonHelper } from 'src/app/shared/utils/common-helper';
import { DOCUMENT } from '@angular/common';

declare var $: any;
export interface DialogData {
 beforeExpiry:boolean; 
 afterExpiry:boolean; 
}



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})


export class AppComponent implements OnInit {

        isOnline: boolean;
        public assetPath:string; 
        public domainName:string; 
        public domainPath:string; 
        isMobile:boolean=false;
        showHeader:boolean=true;
        mobileClassName:string=''; 
        showOrientation:boolean=false; 
        importantMessage:string;
        deviceInfo = null;
         menuActiveClass:string=''; 
         getVouchersList:any=[];
           dealsoffers:any=[];
   serviceSettings:any;googleAnalyticsKey:any;
     DOMAIN_SETTINGS:string;
     
     
  constructor(private cdref: ChangeDetectorRef,private rest:RestapiService,private location:Location,private title: Title,
              private router: Router,private cookieService: CookieService,private sg: SimpleGlobal,private bnIdle: BnNgIdleService,public dialog: MatDialog, private deviceService: DeviceDetectorService,private activatedRoute: ActivatedRoute,private appConfigService:AppConfigService,private EncrDecr: EncrDecrService, public commonHelper: CommonHelper,@Inject(DOCUMENT) private document: any,
              private renderer: Renderer2) {
        
                
	//14 Minutes (60*14)
	this.bnIdle.startWatching(60*14).subscribe((res) => {
	if(res) {

    //closing all dialogs before session expiry
   // console.log(dialog.openDialogs)
                    if (dialog.openDialogs.length > 0) {
                        dialog.closeAll();
                    }

		const dialogRef = this.dialog.open(AlertDialogComponent, {
                panelClass: 'alert_Timer',
                disableClose: true,
                id: 'messageforSessionDialog1',
		            width: '310px',
                height: 'auto',
		data: {beforeExpiry: true,afterExpiry:false}
		});

    this.bnIdle.stopTimer();
    dialogRef.afterClosed().subscribe(result => {  this.bnIdle.startWatching(60*14);     });
	}
	})

    
	let urlToSplit =this.location.path();
	let unification =urlToSplit.split("/");

	switch (unification[1]) {
	case ('diners'):
	this.assetPath="diners/";
        this.domainPath="diners/";
        this.domainName='DINERS';
 	break;
	case ('infinia'):
	this.assetPath="infinia/";
        this.domainPath="infinia/";
        this.domainName='INFINIA';
	break;
	case ('regalia'):
	this.assetPath="regalia/";
        this.domainPath="regalia/";
        this.domainName='REGALIA';
	break;
  case ('regalia_gold'):
	this.assetPath="regalia_gold/";
        this.domainPath="regalia_gold/";
        this.domainName='REGALIA_GOLD';
  	break;
	case ('corporate'):
	this.assetPath="corporate/";
        this.domainPath="corporate/";
        this.domainName='CORPORATE';
	break;
	case ('business'):
	this.assetPath="business/";
        this.domainPath="business/";
        this.domainName='BUSINESS';
	break;
	default:
	this.assetPath="";
        this.domainPath="";
        this.domainName='SMARTBUY';
	break;
	}  

        this.sg['domainPath'] = this.domainPath;
        this.sg['domainName'] = this.domainName;
        this.sg['assetPath'] = this.assetPath;
        

        this.serviceSettings=this.appConfigService.getConfig();
        this.googleAnalyticsKey=this.serviceSettings.googleAnalyticsKey;
        this.serviceSettings=this.appConfigService.getConfig();
        this.DOMAIN_SETTINGS=this.serviceSettings.DOMAIN_SETTINGS[this.domainName];
        
  }
  
 ngAfterContentChecked() {
    this.cdref.detectChanges();    
     }
  
   ngAfterViewInit() {
    let loader = this.renderer.selectRootElement('#loader_1');
    this.renderer.setStyle(loader, 'display', 'none');
  }

  
  private appendGaTrackingCode() {
    try {
      const script = document.createElement('script');
      script.innerHTML = `
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
        ga('create', '` + this.googleAnalyticsKey + `', 'auto');
        ga('send', 'pageview');
      `;
      document.body.appendChild(script);
    } catch (ex) {
     console.error('Error appending google analytics');
     console.error(ex);
    }
  }
  


  ngOnInit() {
    this.title.setTitle('Smartbuy');
   this.onEvents();


   var impMessageArg = {
    clientToken:'HDFC243'
    };
  
    var impMessage = {
    postData:this.EncrDecr.set(JSON.stringify(impMessageArg))
    };
  
    this.rest.impMessage( JSON.stringify(impMessage)).subscribe(results => {
    if(results.result.message=='success'){
          this.importantMessage=results.result.data;
         
    }else{
            this.importantMessage='';
    }
    });
    
        this.getVouchersList =this.serviceSettings.voucher_lists;
        if(this.DOMAIN_SETTINGS['OFFER']){
        this.rest.getDealsOffers().subscribe(response => {
        if(response.status=='success'){
        this.dealsoffers = response.result;
        }
        });
        } 
    if (environment.IS_MAIN == 1) {
     
       this.rest.verifyDomain().subscribe(response => {

            const responseData1=(response.result);
         const cArray = responseData1.split("::");
         var reload=0;
         if(cArray[0] !='' && this.cookieService.get("disclaimer") != cArray[0]){
           this.cookieService.set('disclaimer',cArray[0], null, '/', null, null, null);
          reload++;
         } 
         
          if(this.cookieService.get(this.serviceSettings.customer_cookiename) != cArray[1]){
           this.cookieService.set(this.serviceSettings.customer_cookiename,encodeURIComponent(cArray[1]), null, '/', null, null, null);
          reload++;
         } 
     
         if(cArray[2]!='' &&this.cookieService.get(this.serviceSettings.consent_cookie_name) != cArray[2]){
            this.cookieService.set(this.serviceSettings.consent_cookie_name,cArray[2], null, '/', null, null, null);
           reload++;
        } 
        if(environment.LOCALJSON !='true')
        if(reload>0)  location.reload();
     
      });
     

   } 
  }
@HostListener("window:resize", [])
  onResize() {
  this.checkOrientation();
  }

 checkOrientation() {

}

  onEvents() {
  
  
     $(".dropdown").hover(function(){
 $('.list-travel').removeClass("hideDrop");
});
     this.checkOrientation();
        if(this.serviceSettings.COOKIE_CONSENT_ENABLED){
        switch(this.serviceSettings.COOKIE_CONSENT_TYPE) { 
        case 3: { 
               const cookieExists: boolean = this.cookieService.check(this.serviceSettings.EXT_COOKIE_CONSENT_NAME);
                if(cookieExists){  
                let decryptcoval: any = {}
                var coval= this.cookieService.get(this.serviceSettings.EXT_COOKIE_CONSENT_NAME);
                decryptcoval= this.commonHelper.parseQuery(coval);
                if(decryptcoval && decryptcoval.interactionCount=='1'){
                this.appendGaTrackingCode();
                var s = document.createElement("script");
                s.type = "text/javascript";
                s.src = this.serviceSettings.adobeLanuchScriptUrl;
                document.body.appendChild(s);
                }
             } 
        
        break; 
        } 
        case 2: { 
                const cookieExists: boolean = this.cookieService.check(this.serviceSettings.cookieName);
                if(cookieExists){  
                var coval2= this.cookieService.get(this.serviceSettings.cookieName);
                var coval3=JSON.parse(coval2);
                if(coval3.categories.includes('GA')){
                this.appendGaTrackingCode();
                }
                if(this.serviceSettings.adobeLanuch && coval3.categories.includes('AL')){
                var s = document.createElement("script");
                s.type = "text/javascript";
                s.src = this.serviceSettings.adobeLanuchScriptUrl;
                document.body.appendChild(s);
                }
               }    
        break; 
        } 
        default: { 
                const cookieExists: boolean = this.cookieService.check(this.serviceSettings.cookieName);
                if(cookieExists){  
                var dcoval= this.cookieService.get(this.serviceSettings.cookieName);
                if(dcoval=='1'){
                if(this.serviceSettings.enableGa)
                this.appendGaTrackingCode();
                 if(this.serviceSettings.adobeLanuch){
                var s = document.createElement("script");
                s.type = "text/javascript";
                s.src = this.serviceSettings.adobeLanuchScriptUrl;
                document.body.appendChild(s);
                }
                }
             } 
         
        break; 
        } 
        } 
      }
     
    
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
	if(this.activatedRoute.snapshot.queryParamMap.get('channel')=='payzapp' || sessionStorage.getItem("channel")=="payzapp"){
	this.showHeader=false;
	sessionStorage.setItem("channel", "payzapp");
	}else{
     this.deviceInfo = this.deviceService.getDeviceInfo();
      const isMobile = this.deviceService.isMobile();
      this.isMobile=isMobile;
      const isTablet = this.deviceService.isTablet();
      const isDesktopDevice = this.deviceService.isDesktop();

        var pageUrl=event.urlAfterRedirects.split('?')[0];
        if(isDesktopDevice){
         this.mobileClassName='';
         /* console.log(pageUrl); */
                switch (pageUrl) {
               
                case '/foryou' :
                this.menuActiveClass='foryou';
                break;
                case '/bus/search': case '/bus/checkout' :
                       case '/bus' :  
                this.menuActiveClass='bus';
                break;
                
                     case '/compare-fly': case '/multicity': case '/flight-list': case '/flight-roundtrip': case '/flight-int': case '/flight-multicity':
                this.menuActiveClass='flight';
                break;
                          case '/compare-stay' :  
                this.menuActiveClass='hotel';
                break;
                
                  case '/train':  case '/train/pnr': case '/train/search' : case '/train/checkout' :
                this.menuActiveClass='train';
                break;
                default:
                  this.menuActiveClass='foryou';
                break;

          }   
  
        }else{

        
       }
     
      }
      } 
      
    });
  }
  scrollTop(){
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
});
  }


  
  
}


@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html'
})
export class AlertDialogComponent {
 beforeExpiry:boolean=false; 
 afterExpiry:boolean=false; 
 cdnUrl: any;

 constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<AlertDialogComponent>,private location: Location,  private router: Router,private rest:RestapiService,private sg: SimpleGlobal) {
    //this.dialogRef.updateSize('150vw','150vw')
  this.cdnUrl = environment.cdnUrl;
    this.beforeExpiry=data.beforeExpiry;
     this.afterExpiry=data.afterExpiry;

 
  }

  startOver(): void {
      this.dialogRef.close(true);

      let urlToSplit =this.location.path();
      let unification =urlToSplit.split("/");
      if(urlToSplit.search('natgeo')!=-1){
        this.router.navigate([this.sg['domainPath']+'/natgeo']);
      }else if(urlToSplit.search('freshmenu')!=-1){
        this.router.navigate([this.sg['domainPath']+'/freshmenu']);
      }else{
        window.location.href =environment.MAIN_SITE_URL;
      }
  }


  startOverContinue(): void {
    this.dialogRef.close(true);
  }
  onFinishedTimerSeesion(e: CountdownEvent): void {
    sessionStorage.clear();
    this.beforeExpiry=false;
    this.afterExpiry=true;
  }

}
function ngAfterViewInit() {
  throw new Error('Function not implemented.');
}

