import { Component, NgZone, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-infinia-home',
  templateUrl: './infinia-home.component.html',
  styleUrls: ['./infinia-home.component.scss']
})
export class InfiniaHomeComponent implements OnInit {
  showMembership = true;
  isMobile:boolean = true;
  showPoint = false;
  customOptions: OwlOptions = {
    loop: false,
    autoplay:false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    margin: 10,
    navText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: false
  }

  benefitList = [{
    title: 'Unique Dining experience', desc: 'Up to a 20% off on the food and beverage bill at the restaurants',
    img:'./assets/images/infinia/Benefits/1.svg'
  },
  {
    title: 'Endless Travel', desc: 'Up to a 20% off on the Best Available Rates on rooms at participating Marriott hotels in India',
    img:'./assets/images/infinia/Benefits/2.svg'
  },
  {
    title: 'Blissfull Relaxation', desc: '20% off on Spa services at participating Marriott spas in India between',
    img:'./assets/images/infinia/Benefits/3.svg'
  },
  {
    title: 'Marriott certificates', desc: 'One certificate each for upgrade to next category room and 30% off on Best available rate on base category of room',
    img:'./assets/images/infinia/Benefits/4.svg'
  }
]

lifeStyleBenefit = [{
  title:'Unlimited Complimentary golf games at leading courses across India and select courses across the world',
  img:'./assets/images/infinia/lifestyle/1.svg'
},
{
  title:'Unlimited complimentary Golf coaching at select golf courses across India.',
  img:'./assets/images/infinia/lifestyle/2.svg'
}
]

premiumSport = [
  {title:'Golf Booking',img:'./assets/images/infinia/lifestyle/3.svg'},
  {title:'Itinerary planning and reservation assistance',img:'./assets/images/infinia/lifestyle/4.svg'},
  {title:'Private dining assistance',img:'./assets/images/infinia/lifestyle/5.svg'},
  {title:'International gift delivery',img:'./assets/images/infinia/lifestyle/6.svg'},
  {title:'Event planning and referrals & much more',img:'./assets/images/infinia/lifestyle/7.svg'},
]

  constructor(private ngZone:NgZone) {
    window.onresize = (e) =>
    {
        this.ngZone.run(() => {
          this.isMobile = window.innerWidth < 991 ? true : false;
        });
    };
   }

  ngOnInit(): void {
    this.isMobile = window.innerWidth < 991 ? true : false;
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
