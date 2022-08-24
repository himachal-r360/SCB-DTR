import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { SimpleGlobal } from 'ng2-simple-global';
import { AppConfigService } from 'src/app/app-config.service';
import { RestapiService } from 'src/app/shared/services/restapi.service';
import { environment } from 'src/environments/environment';
import { EncrDecrService } from 'src/app/shared/services/encr-decr.service';

@Component({
  selector: 'app-deals',
  templateUrl: './deals.component.html',
  styleUrls: ['./deals.component.scss']
})
export class DealsComponent implements OnInit {

  constructor(public rest: RestapiService, private sg: SimpleGlobal, @Inject(DOCUMENT) private document: any, private appConfigService: AppConfigService,private EncrDecr: EncrDecrService) {
    
    this.serviceSettings = this.appConfigService.getConfig();
    this.cdnUrl = environment.cdnUrl;
    this.cdnUrl = environment.cdnUrl+this.sg['assetPath'];
    this.domainRedirect = environment.MAIN_SITE_URL + this.sg['domainPath'];
    this.cdnDealUrl = environment.cdnDealUrl;
    this.siteUrl = environment.MAIN_SITE_URL;
    this.getDeals();
 
  }
   domainRedirect: string;  
   serviceSettings: any;
   cdnUrl: any;
   cdnDealUrl: any;
   siteUrl: any;
   topDeals = [];
   showDealListLoader: Boolean = false;
   showDealList: Boolean = false;
   redirectPopupTrigger: number = 0; redirectPopupPartner; redirectPopupType; redirectPopupUrl; redirectPopupHeader; redirectPopupImpmessage; redirectPopupMessage; redirectPopup;
   redirectPopupTriggerTimestamp;
  ngOnInit(): void {

    
  }

  dealOptions: any = {
    loop: false,
    navText: ['<span class="left_arrow" [style.opacity]="myCarousel.isLast ? 0:1"><img src="' + environment.cdnUrl + 'images/smartbuy/icons/left-arrow.svg"></span>', '<span class="right_arrow" ><img src="' + environment.cdnUrl + 'images/smartbuy/icons/right-arrow.svg"></span>'],
    margin:20,
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
  onImgError(event) {
    event.target.src = 'https://d157777v0iph40.cloudfront.net/smartbuy3.0/images/offers/hdfcbank.jpg';

  }
  //Get Deals
  getDeals(){
    var getDealParam = { postData: this.EncrDecr.set(JSON.stringify({ programName: this.sg['domainName'], category: 'All', sub_category: 'All'})) };
    console.log(this.sg['domainName']);
    this.rest.getDeals(JSON.stringify(getDealParam)).subscribe(result => {
      if (result.status == 'success') {
        this.showDealList = true;
        this.showDealListLoader = false;
        this.topDeals = (result.result['hits']); 
      } else {
        this.showDealListLoader = false;
        this.topDeals = [];
      }
    });
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
}
