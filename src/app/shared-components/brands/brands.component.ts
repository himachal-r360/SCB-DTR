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
  
    this.serviceSettings = this.appConfigService.getConfig();
    this.cdnUrl = environment.cdnUrl;
    this.cdnUrl = environment.cdnUrl+this.sg['assetPath'];
    this.cdnDealUrl = environment.cdnDealUrl;
    this.siteUrl = environment.MAIN_SITE_URL;
    this.foryouBrands = this.serviceSettings.foryou_brands;
    
 
  }
  foryouBrands = [];
   serviceSettings: any;
   cdnUrl: any;
   cdnDealUrl: any;
   siteUrl: any;

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

  

}
