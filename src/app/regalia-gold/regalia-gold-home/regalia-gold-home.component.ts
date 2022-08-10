import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { SimpleGlobal } from 'ng2-simple-global';
import { AppConfigService } from 'src/app/app-config.service';
import { RestapiService } from 'src/app/shared/services/restapi.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-regalia-gold-home',
  templateUrl: './regalia-gold-home.component.html',
  styleUrls: ['./regalia-gold-home.component.scss']
})
export class RegaliaGoldHomeComponent implements OnInit {

  
  constructor(public rest: RestapiService, private sg: SimpleGlobal, @Inject(DOCUMENT) private document: any, private appConfigService: AppConfigService) {
  
    this.serviceSettings = this.appConfigService.getConfig();
    this.cdnUrl = environment.cdnUrl+this.sg['assetPath'];
    this.cdnDealUrl = environment.cdnDealUrl;
    this.siteUrl = environment.MAIN_SITE_URL;
     this.customer_login=this.sg['customerLogin'];
    
 
  }
 
   serviceSettings: any;
   cdnUrl: any;
   cdnDealUrl: any;
   siteUrl: any;
   customer_login:boolean=false;
   

  ngOnInit(): void {
   // console.log(this.sg.'customerLogin']);
     console.log(this.serviceSettings);
  }

}
