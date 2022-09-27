import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { SimpleGlobal } from 'ng2-simple-global';
import { AppConfigService } from 'src/app/app-config.service';
import { RestapiService } from 'src/app/shared/services/restapi.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-unification-home',
  templateUrl: './unification-home.component.html',
  styleUrls: ['./unification-home.component.scss']
})
export class UnificationHomeComponent implements OnInit {

  
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
   customerInfo:any[];
   isLogged: Boolean;
   

  ngOnInit(): void {
      if(this.sg['customerInfo']){
        var customer_cookie;
        if(this.sg['customerInfo'].customer_cookie == 1)
          customer_cookie = 1;
        if(customer_cookie == 1){
             this.customerInfo = this.sg['customerInfo'];
           if(this.customerInfo["guestLogin"]==true){
            this.isLogged = false;
           }else{
            this.isLogged = true;
            this.isLogged = true;
          }
        }else{
            this.customerInfo =[];
            this.isLogged = false;
        }
    }   
  }

}
