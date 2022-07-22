import {Component, Inject, OnInit,ChangeDetectionStrategy,Input} from '@angular/core';
import { SimpleGlobal } from 'ng2-simple-global';
import {APP_CONFIG, AppConfig} from '../configs/app.config';
import {environment} from '../../environments/environment';
import { AppConfigService } from '../app-config.service';
import { CookieService } from 'ngx-cookie-service';
import {Router,ActivatedRoute} from '@angular/router';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
domainPath:string;
assetPath:string;
domainName:string;
appConfig: any;
cdnUrl: any;
domainRedirect: string;
enablePrivileges:any;
conciergeNumber_footer:any;
serviceSettings:any;
programEmail:any;
DOMAIN_SETTINGS:string;
new_header_footer:any=0;
currentYear: number=new Date().getFullYear();

  constructor(private sg: SimpleGlobal,private appConfigService:AppConfigService,private cookieService: CookieService,private activatedRoute: ActivatedRoute,private router: Router,@Inject(DOCUMENT) private document: any) { 
    this.domainPath=this.sg['domainPath'];
    this.assetPath=this.sg['assetPath'];
    this.cdnUrl = environment.cdnUrl+this.sg['assetPath']; 
    this.domainName=this.sg['domainName'];
     this.serviceSettings=this.appConfigService.getConfig();
    this.DOMAIN_SETTINGS=this.serviceSettings.DOMAIN_SETTINGS[this.sg['domainName']];
    this.enablePrivileges=this.serviceSettings.enablePrivileges;

       if(this.serviceSettings.COOKIE_CONSENT_ENABLED){
        switch(this.serviceSettings.COOKIE_CONSENT_TYPE) { 
        case 3: { 
        if(this.serviceSettings.adobeLanuch){
		try {
			var s = document.createElement("script");
			s.type = "text/javascript";
			s.src = this.serviceSettings.adobeLanuchScriptUrl;
			 document.body.appendChild(s);
		} catch (ex) {
		console.error('Error appending adobe analytics');
		console.error(ex);
		}
	
	
          }
        break; 
        } 
        default: { 
         const cookieExists: boolean = this.cookieService.check(this.serviceSettings.cookieName);
          if(cookieExists){  
          if(this.serviceSettings.adobeLanuch){
		try {
			var s = document.createElement("script");
			s.type = "text/javascript";
			s.src = this.serviceSettings.adobeLanuchScriptUrl;
			 document.body.appendChild(s);
		} catch (ex) {
		console.error('Error appending adobe analytics');
		console.error(ex);
		}
	
	  }
       }        
        break; 
        } 
        } 
      }
     
     
  }
  
   
  ngOnInit() {
    this.domainRedirect=environment.MAIN_SITE_URL+this.domainPath;
    this.conciergeNumber_footer = AppConfig.concierge.conciergeNumber_footer;
    this.programEmail = AppConfig.concierge.programEmail;

  }
   redirectPopupTrigger:number=0; redirectPopupPartner;redirectPopupType;redirectPopupUrl;redirectPopupHeader;redirectPopupImpmessage;redirectPopupMessage;redirectPopup;
   redirectPopupTriggerTimestamp;



    clickUrl(url){
     if(environment.IS_MAIN==1){
      const current = new Date();
        this.redirectPopupTriggerTimestamp=current.getTime();
        this.redirectPopupTrigger=1;
        this.redirectPopup=2;
        this.redirectPopupUrl=this.domainRedirect+url;
     }else{
     this.document.location.href =environment.MAIN_SITE_URL+url;
     }
    }

}


