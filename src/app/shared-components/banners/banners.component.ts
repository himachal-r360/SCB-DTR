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
  points_available :any;
  wb_spend:any; 
  wb_perc:any;

  mb_perc:any;
  is_wb_progressbar:boolean=false;
  is_mb_progressbar:boolean=false;
  ngOnInit(): void {

    this.rest.getRegaliaGoldList().subscribe(res => {
      this.mainBanners = res.mainBanners.diners;
      //console.log("TEst");
      //console.log(this.mainBanners)
    });

     this.rest.getMilestoneDetail().subscribe(res => {
        console.log(res.milestone_detail.benefits_availed);
        this.wb_spend = res.milestone_detail.benefits_availed.wb.spends.ACHIEVED_SPEND_AMOUNT;
        if(res.milestone_detail.benefits_availed.wb.can_avail==1){
          this.is_wb_progressbar=false;
        }else{
          this.wb_perc = ((res.milestone_detail.benefits_availed.wb.spends.ACHIEVED_SPEND_AMOUNT / res.milestone_detail.benefits_availed.wb.spends.TARGET_SPEND_AMOUNT)*100);
          this.is_wb_progressbar=true;
        }
        if(res.milestone_detail.benefits_availed.pv.previous_quarter.can_avail==1||res.milestone_detail.benefits_availed.pv.current_quarter.can_avail==1){
               this.is_mb_progressbar=false;
        }else{
          this.mb_perc = ((res.milestone_detail.benefits_availed.pv.current_quarter.spends.ACHIEVED_SPEND_AMOUNT / res.milestone_detail.benefits_availed.pv.current_quarter.spends.TARGET_SPEND_AMOUNT)*100);
          this.is_mb_progressbar=true;
        }
        console.log( this.is_wb_progressbar);

      //  this.mb_perc=100;
        //this.mb_spend = res.milestone_detail.benefits_availed.pv.spends.ACHIEVED_SPEND_AMOUNT;
        // this.mb_perc = Math.round((res.milestone_detail.benefits_availed.pv.spends.ACHIEVED_SPEND_AMOUNT / res.milestone_detail.benefits_availed.pv.spends.TARGET_SPEND_AMOUNT)*100);
        // console.log(this.wb_perc);
    });

     this.rest.availablePoints().subscribe(res => {
       // console.log("availablePoints");
      //  console.log(res);
        if(res.status=="true"){
            this.points_available=res.points_available;
            console.log(this.points_available);
         }
    }); 
}
benefitsLink(){
  this.router.navigate(['/regalia_gold/know-your-card']);
}

}
