import { Component, OnInit, Inject, Renderer2, ElementRef, ViewChild,OnDestroy,ViewEncapsulation, Input} from '@angular/core';
import { environment } from './../../../environments/environment';
import { RestapiService } from 'src/app/shared/services/restapi.service';
import { SimpleGlobal } from 'ng2-simple-global';
import { DOCUMENT } from '@angular/common';
import { AppConfigService } from './../../app-config.service';
import { APP_CONFIG, AppConfig } from './../../configs/app.config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss']
})
export class BannersComponent implements OnInit {

  constructor(public rest: RestapiService, private sg: SimpleGlobal, @Inject(DOCUMENT) private document: any, private appConfigService: AppConfigService, private router: Router) {
  
   this.serviceSettings = this.appConfigService.getConfig();
   this.cdnUrl = environment.cdnUrl+this.sg['assetPath'];
   this.cdnDealUrl = environment.cdnDealUrl;
   this.siteUrl = environment.MAIN_SITE_URL;
   

 }

  mainBanners:any[];
  serviceSettings: any;
  cdnUrl: any;
  cdnDealUrl: any;
  siteUrl: any;

  ngOnInit(): void {

    this.rest.getRegaliaGoldList().subscribe(res => {
      this.mainBanners = res.mainBanners.diners;
      console.log(this.mainBanners)
    });


}
benefitsLink(){
  this.router.navigate(['/regalia_gold/know-your-card']);
}

}
