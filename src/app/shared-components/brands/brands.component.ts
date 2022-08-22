import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { SimpleGlobal } from 'ng2-simple-global';
import { AppConfigService } from 'src/app/app-config.service';
import { RestapiService } from 'src/app/shared/services/restapi.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent implements OnInit {

  constructor(public rest: RestapiService, private sg: SimpleGlobal, @Inject(DOCUMENT) private document: any, private appConfigService: AppConfigService) {
    
    this.domainRedirect = environment.MAIN_SITE_URL + this.sg['domainPath'];
    this.serviceSettings = this.appConfigService.getConfig();
    this.cdnUrl = environment.cdnUrl;
    this.cdnUrl = environment.cdnUrl+this.sg['assetPath'];
    this.cdnDealUrl = environment.cdnDealUrl;
    this.siteUrl = environment.MAIN_SITE_URL;
    this.foryouBrands = this.serviceSettings.foryou_brands;
    
 
  }
  redirectPopupTrigger: number = 0; 
  redirectPopupPartner; 
  redirectPopupType; 
  redirectPopupUrl; 
  redirectPopupHeader; 
  redirectPopupImpmessage; 
  redirectPopupMessage; 
  redirectPopup;
  redirectPopupTriggerTimestamp;
  foryouBrands = [];
  serviceSettings: any;
  cdnUrl: any;
  cdnDealUrl: any;
  siteUrl: any;
  domainRedirect: string;
  ngOnInit(): void {

  }

  brandOptions: any = {
    loop: false,
    autoplay: true,
    autoplayTimeout: 8000,
    autoplayHoverPause: true,
    margin: 10,

    responsiveClass: true,
    responsive: {
      0: {
        items: 2.3,
        nav: false,
        dots: false
      },
      600: {
        items: 5,
        nav: false,
        dots: false
      },
      1000: {
        items: 6,
        nav: false,
        dots: false
      }
    }
  }
  redirectUrl(partner, type, url) {
    const current = new Date();
    if (url) {
      let partnerData = this.serviceSettings['lang']['popup_redirections'][partner];
      this.redirectPopupHeader = partnerData[partner + '_title'];
      this.redirectPopupImpmessage = partnerData[partner + '_pup_importantText'];
      this.redirectPopupMessage = partnerData[partner + '_pup_dearcustomer'];

      if (type == 1){
        this.redirectPopup = 1;
        console.log(this.domainRedirect + 'insta-redirection/shopredirectLink?u=' + (window.btoa(url)));
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

  

}
