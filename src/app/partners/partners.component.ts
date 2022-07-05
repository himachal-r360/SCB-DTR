import { Component, OnInit } from '@angular/core';
import {APP_CONFIG, AppConfig} from '../configs/app.config';
import {environment} from '../../environments/environment';
import { AppConfigService } from '../app-config.service';
import { SimpleGlobal } from 'ng2-simple-global';

@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.scss']
})
export class PartnersComponent implements OnInit {

  cdnUrl: any;
  appConfig: any;
  serviceSettings:any;
  getVouchersList:any=[];
  partner_lists:any=[];
  
  constructor(private appConfigService:AppConfigService, private sg: SimpleGlobal) {
        this.serviceSettings=this.appConfigService.getConfig();
        this.cdnUrl = environment.cdnUrl+this.sg['assetPath'];
        this.getVouchersList =this.serviceSettings.voucher_lists;
        this.partner_lists =this.serviceSettings.partner_lists;
      console.log(this.getVouchersList);
   }

  

  ngOnInit(): void {
  }

 
   

}
