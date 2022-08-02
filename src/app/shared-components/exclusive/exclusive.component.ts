import { Component, OnInit, Inject, Renderer2, ElementRef, ViewChild,OnDestroy,ViewEncapsulation, Input} from '@angular/core';
import { environment } from './../../../environments/environment';
import { RestapiService } from 'src/app/shared/services/restapi.service';
import { SimpleGlobal } from 'ng2-simple-global';
import { DOCUMENT } from '@angular/common';
import { AppConfigService } from './../../app-config.service';
import { APP_CONFIG, AppConfig } from './../../configs/app.config';

@Component({
  selector: 'app-exclusive',
  templateUrl: './exclusive.component.html',
  styleUrls: ['./exclusive.component.scss']
})
export class ExclusiveComponent implements OnInit {

  constructor(public rest: RestapiService, private sg: SimpleGlobal, @Inject(DOCUMENT) private document: any, private appConfigService: AppConfigService) {
  
    this.serviceSettings = this.appConfigService.getConfig();
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

  exclusiveOptions: any = {
    loop: false,
    autoplay: true,
    autoplayTimeout: 8000,
    autoplayHoverPause: true,
    margin: 30,

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
        items: 6,
        nav: false,
        dots: false
      }
    }
  }

}
