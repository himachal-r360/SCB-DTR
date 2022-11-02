import { Component, NgZone, OnInit ,Inject } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { SimpleGlobal } from 'ng2-simple-global';
import { AppConfigService } from 'src/app/app-config.service';
import { environment } from 'src/environments/environment';
import { DOCUMENT } from '@angular/common';
import { RestapiService} from 'src/app/shared/services/restapi.service';


@Component({
  selector: 'app-club-marriot-membership',
  templateUrl: './club-marriot-membership.component.html',
  styleUrls: ['./club-marriot-membership.component.scss']
})
export class ClubMarriotMembershipComponent implements OnInit {
  isMobile:boolean = true;
  memberShip = [
    { title: "<strong>Unique Dining Experience</strong>", offerMsg: 'Up to a 20% off on the food and beverage bill at the restaurants ', img: "assets/images/club-merriot/Rectangle 10011.png" },
    { title: "<strong>Endless <br> Travel</strong>",  offerMsg: 'Up to a 20% off on the Best Available Rates on rooms at participating Marriott hotels in India ', img: "assets/images/club-merriot/Rectangle 10015.png" },
    { title: "<strong>Blissfull <br> Relaxation</strong>", offerMsg: '20% off on Spa services at participating Marriott spas in India between', img: "assets/images/club-merriot/Rectangle 10016.png" },
    { title: "<strong>Marriott <br> Certificates</strong>", offerMsg: 'One certificate each for upgrade to next category room and 30% off on Best available rate on base category of room', img: "assets/images/club-merriot/Rectangle 10017.png" }

  ]

  inClud = [
    {title:"Weekends at Marriot" , desc:"Unwind and relax with a short gateway over the weekend" ,img:"assets/images/infinia/experiences/experiences1.png"},
    {title:"Weekends at Marriot" , desc:"Unwind and relax with a short gateway over the weekend" ,img:"assets/images/infinia/experiences/experiences1.png"},
    {title:"Weekends at Marriot" , desc:"Unwind and relax with a short gateway over the weekend" ,img:"assets/images/infinia/experiences/experiences1.png"}
  ]



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
    nav: true
  }

  membershipOptions: OwlOptions = {
    loop: false,
    autoplay:false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    margin: 10,
    navText: [],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1.2
      },
      740: {
        items: 1.2
      },
      940: {
        items: 1.2
      }
    },
    nav: false
  }



  constructor(private ngZone:NgZone ,public restApi:RestapiService,private sg: SimpleGlobal, private appConfigService: AppConfigService,@Inject(DOCUMENT) private document: any) {
    window.onresize = (e) =>
    {
        this.ngZone.run(() => {
          this.isMobile = window.innerWidth < 991 ? true : false;
        });
    };
    this.serviceSettings = this.appConfigService.getConfig();
    console.log(this.serviceSettings);
    this.cdnUrl = environment.cdnUrl+this.sg['assetPath'];
    this.cdnDealUrl = environment.cdnDealUrl;
    this.siteUrl = environment.MAIN_SITE_URL;
    this.clubmarriott_redirection_url = this.serviceSettings.clubmarriott_redirection_url;
   }



  serviceSettings: any;
  cdnUrl: any;
  cdnDealUrl: any;
  siteUrl: any;
  enrol_membership_disabled:boolean=false;
  clubmarriott_redirection_url:string;


  ngOnInit(): void {
    this.isMobile = window.innerWidth < 991 ? true : false;
     var customerInfo = this.sg['customerInfo'];
      if (customerInfo["org_session"] == 1) {
      }else{
        if (environment.localInstance == 0) {
          this.document.location.href = environment.MAIN_SITE_URL + this.sg['domainPath'] + 'check-login';
        }
      }
  }
  enrol_membership(){
     this.enrol_membership_disabled=true;
     this.restApi.enrol_membership().subscribe(response => {
        this.enrol_membership_disabled=false;
        if(response.status !=undefined && response.status=="true"){
         console.log(response);
          window.open(
            this.clubmarriott_redirection_url,
            '_blank'
          );
        }else{
          alert(response.msg);
        }
     });
  }
}
