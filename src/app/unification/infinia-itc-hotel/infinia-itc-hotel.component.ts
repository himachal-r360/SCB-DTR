import { Component, OnInit } from '@angular/core';
import { SimpleGlobal } from 'ng2-simple-global';
import { AppConfigService } from 'src/app/app-config.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-infinia-itc-hotel',
  templateUrl: './infinia-itc-hotel.component.html',
  styleUrls: ['./infinia-itc-hotel.component.scss']
})
export class InfiniaItcHotelComponent implements OnInit {

  
  serviceSettings: any;
  cdnUrl: any;
  cdnDealUrl: any;
  siteUrl: any;

  constructor(private sg: SimpleGlobal, private appConfigService: AppConfigService) { 
    this.serviceSettings = this.appConfigService.getConfig();
    this.cdnUrl = environment.cdnUrl+this.sg['assetPath'];
    this.cdnDealUrl = environment.cdnDealUrl;
    this.siteUrl = environment.MAIN_SITE_URL;
  }

  ngOnInit(): void {
  }

}
