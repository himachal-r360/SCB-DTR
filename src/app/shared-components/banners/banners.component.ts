import { Component, OnInit, Inject, Renderer2, ElementRef, ViewChild,OnDestroy,ViewEncapsulation, Input} from '@angular/core';
import { environment } from './../../../environments/environment';
import { RestapiService } from 'src/app/shared/services/restapi.service';
import { SimpleGlobal } from 'ng2-simple-global';
import { DOCUMENT } from '@angular/common';
import { AppConfigService } from './../../app-config.service';
import { APP_CONFIG, AppConfig } from './../../configs/app.config';
import { Router } from '@angular/router';
import {EncrDecrService} from 'src/app/shared/services/encr-decr.service';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { createMask } from '@ngneat/input-mask';
@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss']
})
export class BannersComponent implements OnInit {

  constructor(private spinnerService: NgxSpinnerService,public rest: RestapiService, private sg: SimpleGlobal, @Inject(DOCUMENT) private document: any, private appConfigService: AppConfigService, private router: Router,private EncrDecr: EncrDecrService,private fb: FormBuilder) {

   this.serviceSettings = this.appConfigService.getConfig();
   this.cdnUrl = environment.cdnUrl+this.sg['assetPath'];
   this.cdnDealUrl = environment.cdnDealUrl;
   this.siteUrl = environment.MAIN_SITE_URL;

   this.createForm();
 }
  public mask = {
    guide: true,
    showMask : true,
    mask: [/\d/, /\d/, '/', /\d/, /\d/, '/',/\d/, /\d/,/\d/, /\d/]
  };
  angForm: FormGroup;
  mainBanners:any[];
  serviceSettings: any;
  cdnUrl: any;
  cdnDealUrl: any;
  siteUrl: any;
  points_available :any;
  wb_spend:any; 
  wb_perc:any;
  customerInfo:any[];
  mb_perc:any;
  IsgoldCardDetails:boolean=true;
  IsgoldCardDetailsModel:boolean=false;
  is_wb_progressbar:boolean=false;
  is_mb_progressbar:boolean=false;
  IsCardError:boolean=true;
  CardErrorMsg:any;
  customeravailablepoints: any;
  isLogged: Boolean;
  XSRFTOKEN: string;
  ngOnInit(): void {
    
      if(this.sg['customerInfo']){
       var customer_cookie;
        if(this.sg['customerInfo'].customer_cookie == 1)customer_cookie = 1;
        
        if(customer_cookie == 1){
             this.customerInfo = this.sg['customerInfo'];
                
           if(this.customerInfo["guestLogin"]==true){
            this.isLogged = false;
           }else{
            this.isLogged = true;
          if (this.customerInfo.hasOwnProperty('ccustomer')) {
          if (this.customerInfo['ccustomer'].card_variant)
            this.sg['card_variant'] = this.customerInfo['ccustomer'].card_variant;
          else
            this.sg['card_variant'] = 'Other Credit/Debit Card';
        } else {
          this.sg['card_variant'] = 'Other Credit/Debit Card';
        }


        this.isLogged = true;
        this.XSRFTOKEN = this.customerInfo["XSRF-TOKEN"];
        this.rest.updateCardDetails(this.customerInfo);
        if (this.customerInfo['ccustomer'] && this.customerInfo['ccustomer'].points_available && (this.customerInfo['ccustomer'].points_available != undefined || this.customerInfo['ccustomer'].points_available != null)){
          this.customeravailablepoints = (Number(this.customerInfo['ccustomer'].points_available)).toLocaleString('en-IN');
          this.IsgoldCardDetails=false;
          this.IsgoldCardDetailsModel=true;
         }
        //this.initiateCards();
           }

        }else{
            this.customerInfo =[];
            this.isLogged = false;
             this.sg['card_variant'] = 'Other Credit/Debit Card';
        }
      
    }   
    this.rest.getRegaliaGoldList().subscribe(res => {
      this.mainBanners = res.mainBanners.diners;
    });
     console.log(this.sg);
     var params_arg = {
      _token:this.sg['customerInfo']['XSRF-TOKEN']
      };
      var params = {
        postData:this.EncrDecr.set(JSON.stringify(params_arg))
      };
     this.rest.getMilestoneDetail(JSON.stringify(params)).subscribe(res => {
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
    });

    //  this.rest.availablePoints().subscribe(res => {
    //     if(res.status=="true"){
    //         this.points_available=res.points_available;
    //      }
    // }); 
}
benefitsLink(){
  this.router.navigate(['/regalia_gold/know-your-card']);
}
 createForm() {
  this.angForm = this.fb.group({
     mobile_no: ['', [Validators.required,Validators.minLength(10),Validators.maxLength(10),Validators.pattern(/^-?(0|[1-9]\d*)?$/)] ],
     last_4_digit: ['', [Validators.required,Validators.minLength(4),Validators.maxLength(4),Validators.pattern(/^-?(0|[1-9]\d*)?$/) ]],
     dob: ['', Validators.required ]
  });
}

HotelRecentSearch(){
 if (localStorage.getItem("HotelRecentSearch") != null) {
   var HotelRecentSearchResult = JSON.parse(window.atob(localStorage.getItem("HotelRecentSearch")));
   console.log(HotelRecentSearchResult);
  /* for (let cok = 0; cok < HotelRecentSearchResult.length; cok++) {
   if (HotelRecentSearchResult[cok]['city_id'] == search_values_setCookieHotel[0].city_id && HotelRecentSearchResult[cok]['checkin'] == search_values_setCookieHotel[0].checkin && HotelRecentSearchResult[cok]['checkout'] == search_values_setCookieHotel[0].checkout) {
      HotelRecentSearchResult.splice(cok, 1);
   }
   }
   search_values_setCookieHotel= HotelRecentSearchResult.concat(search_values_setCookieHotel)
   if (search_values_setCookieHotel.length >= 3) {
     search_values_setCookieHotel=search_values_setCookieHotel.reverse().slice(0,3).reverse();
   } */
 }
}
onSubmit(){
     this.angForm.markAllAsTouched();
     if (this.angForm.invalid){
       return false; 
     }
     this.customerInfo = this.sg['customerInfo']; 
      let URLparams = {
         "mobile": this.angForm.controls['mobile_no'].value,
         "customer_id": this.customerInfo["customerid"],
         "programName":this.sg['domainName'],
         "last4digit":this.angForm.controls['last_4_digit'].value,
         "_token":this.customerInfo["XSRF-TOKEN"],
         "DOB":this.angForm.controls['dob'].value,
         "savecard":1,
         "user_id":this.customerInfo["id"],
         'modal':'REWARD',
         'type' : 'available_points',
         'clientToken':this.sg['domainName'],
         'services_id':7,
         'partner_id':1,
       }
       var EncURLparams = {
         postData: this.EncrDecr.set(JSON.stringify(URLparams))
       };
      this.rest.AvailablePoints(EncURLparams).subscribe(res => {
         if(res.error_code=="100"){
            document.getElementById('unlockCardPopup').click();
            this.IsgoldCardDetails=false;
            this.IsgoldCardDetailsModel=true;
            this.angForm.reset();
            this.spinnerService.show();  
            this.customeravailablepoints=res.points_available;
          }else{
               this.IsCardError=false;
               this.CardErrorMsg=res.message;
          }    

       }); 
  }
}
