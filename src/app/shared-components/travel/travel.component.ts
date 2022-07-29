import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { SimpleGlobal } from 'ng2-simple-global';
import { AppConfigService } from 'src/app/app-config.service';
import { RestapiService } from 'src/app/shared/services/restapi.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-travel',
  templateUrl: './travel.component.html',
  styleUrls: ['./travel.component.scss']
})
export class TravelComponent implements OnInit {

  constructor(public rest: RestapiService, private sg: SimpleGlobal, @Inject(DOCUMENT) private document: any, private appConfigService: AppConfigService) {
  
    this.serviceSettings = this.appConfigService.getConfig();
    this.cdnUrl = environment.cdnUrl;
    this.cdnDealUrl = environment.cdnDealUrl;
    this.siteUrl = environment.MAIN_SITE_URL;
    
 
  }
 
   serviceSettings: any;
   cdnUrl: any;
   cdnDealUrl: any;
   siteUrl: any;

  ngOnInit(): void {
  }

}
