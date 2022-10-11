import { JsonpClientBackend } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import {
  Component,
  ElementRef,
  HostListener,
  NgZone,
  OnInit,
  ViewChild

} from '@angular/core';
import { Router } from '@angular/router';
import { FlightService } from '../common/flight.service';
import { StyleManagerService } from 'src/app/shared/services/style-manager.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { SimpleGlobal } from 'ng2-simple-global';
import {environment} from '../../environments/environment';
import { AppConfigService } from '../app-config.service';
declare var $: any;



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [  ],

})


export class HomeComponent implements OnInit {
 payzrestriction:boolean=false;
  cdnUrl: any;
  DOMAIN_SETTINGS: any;
  serviceSettings: any;
  continueSearchVal:any;
        continueSearchValBus:any;
        continueSearchValTrain:any;
        continueSearchValHotel:any;
  windowItem = window;
  isMobile:boolean = false;
  customOptions: OwlOptions = {
    loop: true,
    autoplay:true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    margin: 10,
    // navText: ['', ''],
    responsive: {
      0: {
        items: 1.2
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


  DomasticFlightsOptions: OwlOptions = {
    loop: true,
    autoplay:false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 1000,
    margin: 20,
    nav: true, 
    navText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"],
    responsive: {
      0: {
        items: 1.2
      },
      400: {
        items: 1.2 
      },
      740: {
        items: 2.2
      },
      940: {
        items: 4
      }
    }    
  }

  existingOffer: OwlOptions = {
    loop: true,
    autoplay:false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 1000,
    margin: 20,
    nav: true, 
    navText:[ "<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"],
    responsive: {
      0: {
        items: 1.2
      },
      400: {
        items: 1.2 
      },
      740: {
        items: 2.2
      },
      940: {
        items: 3
      }
    }    
  }


  trendingRoutes = [  ];

  popularDomasticRoutes = [  ];

  exitingOffers = [  ];
 navItemActive:string='flight';

  constructor(
    public _styleManager: StyleManagerService,
      public router: Router,
      private _flightService: FlightService,private appConfigService: AppConfigService,private ngZone:NgZone,private sg: SimpleGlobal,private elementRef: ElementRef,private cookieService: CookieService

    ) {
    this.cdnUrl = environment.cdnUrl+this.sg['assetPath'];
    
    
    
      this.trendingRoutes = [
    {id:1 , fromCity: 'Mumbai',toCity:'Bangaluru',totalFare:'3,528' , active: false, fromImg:this.cdnUrl+'images/trending/1.png' , toImg:'assets/images/trending/2.png'  },
    {id:2, fromCity: 'Mumbai',toCity:'Bangaluru',totalFare:'3,528' , active: false, fromImg:this.cdnUrl+'images/trending/1.png' , toImg:'assets/images/trending/2.png'  },
    {id:3, fromCity: 'Mumbai',toCity:'Bangaluru',totalFare:'3,528' , active: false, fromImg:this.cdnUrl+'images/trending/1.png' , toImg:'assets/images/trending/2.png'  },
    {id:4, fromCity: 'Mumbai',toCity:'Bangaluru',totalFare:'3,528' , active: false, fromImg:this.cdnUrl+'images/trending/1.png' , toImg:'assets/images/trending/2.png'  },
  ]

  this.popularDomasticRoutes = [
    {fromCity:'Delhi',toCity:'Mumbai',date:'Thu, 6 Jan', totalFare:'3,668', image:this.cdnUrl+'images/Popular/2.png'},
    {fromCity:'Delhi',toCity:'Mumbai',date:'Thu, 6 Jan', totalFare:'3,668', image:this.cdnUrl+'images/Popular/3.png'},
    {fromCity:'Delhi',toCity:'Mumbai',date:'Thu, 6 Jan', totalFare:'3,668', image:this.cdnUrl+'images/Popular/4.png'},
    {fromCity:'Delhi',toCity:'Mumbai',date:'Thu, 6 Jan', totalFare:'3,668', image:this.cdnUrl+'images/Popular/5.png'},
  ]

  this.exitingOffers = [
    {date:'31, Jan 2022' , title:'First Domestic Flight Booking' ,totalFare:'1500', image:this.cdnUrl+'images/smartbuy/offers/1.png'},
    {date:'31, Jan 2022' , title:'First Domestic Flight Booking' ,totalFare:'1500', image:this.cdnUrl+'images/smartbuy/offers/2.png'},
    {date:'31, Jan 2022' , title:'First Domestic Flight Booking' ,totalFare:'1500', image:this.cdnUrl+'images/smartbuy/offers/1.png'},
    {date:'31, Jan 2022' , title:'First Domestic Flight Booking' ,totalFare:'1500', image:this.cdnUrl+'images/smartbuy/offers/3.png'},
    {date:'31, Jan 2022' , title:'First Domestic Flight Booking' ,totalFare:'1500', image:this.cdnUrl+'images/smartbuy/offers/1.png'},
  ]
    
    
    this.serviceSettings = this.appConfigService.getConfig();
     this.DOMAIN_SETTINGS = this.serviceSettings.DOMAIN_SETTINGS[this.sg['domainName']];
    if(router.url){
        switch (router.url) {
        case ('/'+this.sg['domainPath']+'compare-fly'):
        this.navItemActive = 'flight';
        break;
        case ('/'+this.sg['domainPath']+'compare-stay'):
        this.navItemActive = 'hotel';
        break;
        case ('/'+this.sg['domainPath']+'bus'):
        this.navItemActive = 'bus';
        break;
        case ('/'+this.sg['domainPath']+'train'): 
        this.navItemActive = 'train';
        break;
        case ('/'+this.sg['domainPath']+'train/pnr'):
        this.navItemActive = 'pnr';
        break;
        default:
        this.navItemActive ='flight';
        break;
        }  
     }
      window.onresize = (e) =>
      {
          //ngZone.run will help to run change detection
          this.ngZone.run(() => {
            this.isMobile = window.innerWidth < 991 ?  true : false;
          });
      }

    }


  ngOnInit(): void {

    this._flightService.showHeader(true);

    this.isMobile = window.innerWidth < 991 ? true : false;

    let continueSearchValLs: any = localStorage.getItem(environment.continueFlightSearch);
    if (continueSearchValLs != null) {
      this.continueSearchVal = JSON.parse(continueSearchValLs);
      
      
      console.log(this.continueSearchVal);
    }
    let continueSearchValBusParse: any = localStorage.getItem(environment.continueSearchBus);
    if (continueSearchValBusParse != null) {
      this.continueSearchValBus = JSON.parse(continueSearchValBusParse);
    }
    let continueSearchValTrainParse: any = localStorage.getItem(environment.continueSearchTrain);
    if (continueSearchValTrainParse != null) {
      this.continueSearchValTrain = JSON.parse(continueSearchValTrainParse);

    }
    let continueSearchValHotelParse: any = localStorage.getItem(environment.continueSearchHotel);
    if (continueSearchValHotelParse != null) {
      this.continueSearchValHotel = JSON.parse(continueSearchValHotelParse);

    }
    
    
        const cookieExistsp: boolean = this.cookieService.check(this.serviceSettings.payzapp_cookiename);
        if(cookieExistsp){  
            this.payzrestriction=true;
        }else{
             this.payzrestriction=false;
        } 
    
    


  }
  navBarLink(item){
   
   this.navItemActive=item;
  
  }

  ConvertObjToQueryString(obj:any)
  {

    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }
  
  continueSearchMulti(param:any){
  
  
  let url=this.sg['domainPath']+"flight-multicity?"+decodeURIComponent(this.ConvertObjToQueryString(param));
      this.router.navigateByUrl(url);
  
  }
  


  continueSearch(param:any){
  
  
    if(param.fromContry=='IN' && param.toContry=='IN' ){
    if(param.arrival == "" || param.arrival == undefined || param.arrival == null ){
      let url=this.sg['domainPath']+"flight-list?"+decodeURIComponent(this.ConvertObjToQueryString(param));
      this.router.navigateByUrl(url);
    }
    else {
      let url=this.sg['domainPath']+"flight-roundtrip?"+decodeURIComponent(this.ConvertObjToQueryString(param));
      this.router.navigateByUrl(url);
    }
    }else{
      let url=this.sg['domainPath']+"flight-int?"+decodeURIComponent(this.ConvertObjToQueryString((param)));
          this.router.navigateByUrl(url);

       }

  }

  continueSearchHotel(param:any){
    let  url = this.sg['domainPath']+"hotel-list?" + decodeURIComponent(this.ConvertObjToQueryStringForHotel((param)));
    this.router.navigateByUrl(url);
 }

  continueSearchBus(param:any){
     let  url = this.sg['domainPath']+"bus/search?" + decodeURIComponent(this.ConvertObjToQueryString((param)));
      this.router.navigateByUrl(url);

  }
  continueSearchTrain(param:any){
    let  url = this.sg['domainPath']+"train/search?" + decodeURIComponent(this.ConvertObjToQueryString((param)));
      this.router.navigateByUrl(url);

  }


  ConvertObjToQueryStringForHotel(obj: any) {
    var str = [];
    for (var p in obj) {
      if (obj.hasOwnProperty(p)) {
        if (typeof (obj[p]) == "object") {
          let objRooms: any = obj[p];
          for (var i = 0; i < objRooms.length; i++) {
            let objRoomObj: any = objRooms[i];
            for (var roomField in objRoomObj) {
              if (objRoomObj.hasOwnProperty(roomField)) {
                str.push(encodeURIComponent(roomField) + "[" + i + "]=" + encodeURIComponent(objRoomObj[roomField]));
              }
            }
          }
        } else {
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
      }
    }
    return str.join("&");
  }
}
