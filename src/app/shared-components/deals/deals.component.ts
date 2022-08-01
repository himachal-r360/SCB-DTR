import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { SimpleGlobal } from 'ng2-simple-global';
import { AppConfigService } from 'src/app/app-config.service';
import { RestapiService } from 'src/app/shared/services/restapi.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-deals',
  templateUrl: './deals.component.html',
  styleUrls: ['./deals.component.scss']
})
export class DealsComponent implements OnInit {

  constructor(public rest: RestapiService, private sg: SimpleGlobal, @Inject(DOCUMENT) private document: any, private appConfigService: AppConfigService) {
  
    this.serviceSettings = this.appConfigService.getConfig();
    this.cdnUrl = environment.cdnUrl;
    this.cdnUrl = environment.cdnUrl+this.sg['assetPath'];

    this.cdnDealUrl = environment.cdnDealUrl;
    this.siteUrl = environment.MAIN_SITE_URL;
    
 
  }
 
   serviceSettings: any;
   cdnUrl: any;
   cdnDealUrl: any;
   siteUrl: any;

  ngOnInit(): void {

    
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


  


}
