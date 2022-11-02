import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { SimpleGlobal } from 'ng2-simple-global';
import { AppConfigService } from 'src/app/app-config.service';
import { RestapiService } from 'src/app/shared/services/restapi.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-unification-benefits',
  templateUrl: './benefits.component.html',
  styleUrls: ['./benefits.component.scss']
})
export class BenefitsComponent implements OnInit {

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
  tabList = ['Infinia Reserve', 'Lifestyle Benefits', 'Travel Benefits', 'Emergency Support & Insurance', 'No Charges', 'Network Offers', 'Rewards', 'Welcome & Renewal Benefits', 'Infinia Reserve Smartbuy Portal'];
  securedCardImg = [
    {
      title: '100% limit coverage in case of fraudulent transactions.',
      img: '/assets/infinia/images/know-your-card/secured_1.png'
    },
    {
      title: 'Dedicated Risk management desk which supports with transaction declines/ authorisation issues.',
      img: '/assets/infinia/images/know-your-card/secured_2.png'
    },
    {
      title: 'Easy limit enhancements for large transactions.',
      img: '/assets/infinia/images/know-your-card/secured_3.png'
    }
  ];
  ngOnInit(): void {
  }

}
