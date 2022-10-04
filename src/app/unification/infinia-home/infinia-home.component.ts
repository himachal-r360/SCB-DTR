import { Component, OnInit } from '@angular/core';
import { SimpleGlobal } from 'ng2-simple-global';
import { AppConfigService } from 'src/app/app-config.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-infinia-home',
  templateUrl: './infinia-home.component.html',
  styleUrls: ['./infinia-home.component.scss']
})
export class InfiniaHomeComponent implements OnInit {
  
  
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

  showHideMember(){
    $('#Points').css("display", "none");
    $('#activePoint').removeClass('common-table-title-active');
    $('#Membership').css("display", "block");
    $('#activeMember').addClass('common-table-title-active');
  }

  showHidePoints(){
    $('#Membership').css("display", "none");
    $('#activeMember').removeClass('common-table-title-active');
    $('#Points').css("display", "block");
    $('#activePoint').addClass('common-table-title-active');
  }

  showHideGolf(title){
    if(title == "Unlimited"){
      $('#support').css("display", "none");
      $('#Priority').css("display", "none");
      $('#Unlimited').css("display", "block");
      $('#golfActive').addClass('common-table-title-active');
      $('#supportActive').removeClass('common-table-title-active');
      $('#PriorityActive').removeClass('common-table-title-active');
    }
    if(title == "Premium"){
      $('#support').css("display", "block");
      $('#Priority').css("display", "none");
      $('#Unlimited').css("display", "none");
      $('#supportActive').addClass('common-table-title-active');
      $('#golfActive').removeClass('common-table-title-active');
      $('#PriorityActive').removeClass('common-table-title-active');
    }
    if(title == "Priority"){
      $('#Unlimited').css("display", "none");
      $('#support').css("display", "none");
      $('#Priority').css("display", "block");
      $('#PriorityActive').addClass('common-table-title-active');
      $('#supportActive').removeClass('common-table-title-active');
      $('#golfActive').removeClass('common-table-title-active');
    }
  }

  hideShowTravelBenefit(title){
    if(title == "Complimentary"){
      $('#ITCHotels').css("display", "block");
      $('#UnlimitedAccess').css("display", "none");
      $('#UnlimitedAccessActive').removeClass('common-table-title-active');
      $('#ITCHotelsActive').addClass('common-table-title-active');
    }
    if(title=="Unlimited"){
      $('#UnlimitedAccess').css("display", "block");
      $('#ITCHotels').css("display", "none");
      $('#ITCHotelsActive').removeClass('common-table-title-active');
      $('#UnlimitedAccessActive').addClass('common-table-title-active');
    }
  }

  hideShowDiningBenefit(title){
    if(title=="1"){
      $('#DineoutComplimentary').css("display", "block");
      $('#Dineoutmembership').css("display", "none");
      $('#DineoutmembershipActive').removeClass('common-table-title-active');
      $('#DineoutComplimentaryActive').addClass('common-table-title-active');
    }
    if(title=="2"){
      $('#Dineoutmembership').css("display", "block");
      $('#DineoutComplimentary').css("display", "none");
      $('#DineoutComplimentaryActive').removeClass('common-table-title-active');
      $('#DineoutmembershipActive').addClass('common-table-title-active');
    }
  }

  hideShowCoreReward(title){
    if(title=="1"){
      $('#RewardAccrual').css("display", "block");
      $('#RewardRedemption').css("display", "none");
      $('#RewardRedemptionActive').removeClass('common-table-title-active');
      $('#RewardAccrualActive').addClass('common-table-title-active');
    }
    if(title=="2"){
      $('#RewardRedemption').css("display", "block");
      $('#RewardAccrual').css("display", "none");
      $('#RewardAccrualActive').removeClass('common-table-title-active');
      $('#RewardRedemptionActive').addClass('common-table-title-active');
    }
  }

  
  welcomeBenefit(title){
    if(title){
      $('#redeemWelcome'+title).toggleClass('d-none');
      $('#addActiveToggle'+title).toggleClass('Process-item-active' )
    }

  }

  navTitle = 'WelcomeBenefits';
  scrollToElement(element, title): void {
    this.navTitle = title
    element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  }


  



}
