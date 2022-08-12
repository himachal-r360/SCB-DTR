import { JsonpClientBackend } from '@angular/common/http';
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
declare var $: any;



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [  ],

})


export class HomeComponent implements OnInit {
  cdnUrl: any;
  continueSearchVal:any;
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
  // $this = $(this),
  // $items = $this.data("items") ? $this.data("items") : 1,
  // $loop = $this.attr("data-loop") ? $this.data("loop") : true,
  // $navdots = $this.data("nav-dots") ? $this.data("nav-dots") : false,
  // $navarrow = $this.data("nav-arrow") ? $this.data("nav-arrow") : true,
  // $autoplay = $this.attr("data-autoplay") ? $this.data("autoplay") : false,
  // $autospeed = $this.attr("data-autospeed") ? $this.data("autospeed") : 5000,
  // $smartspeed = $this.attr("data-smartspeed") ? $this.data("smartspeed") : 1000,
  // $autohgt = $this.data("autoheight") ? $this.data("autoheight") : false,
  // $space = $this.attr("data-space") ? $this.data("space") : 30,
  // $animateOut = $this.attr("data-animateOut") ? $this.data("animateOut") : false;

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


  trendingRoutes = [
    {id:1 , fromCity: 'Mumbai',toCity:'Bangaluru',totalFare:'3,528' , active: false, fromImg:'assets/images/trending/1.png' , toImg:'assets/images/trending/2.png'  },
    {id:2, fromCity: 'Mumbai',toCity:'Bangaluru',totalFare:'3,528' , active: false, fromImg:'assets/images/trending/1.png' , toImg:'assets/images/trending/2.png'  },
    {id:3, fromCity: 'Mumbai',toCity:'Bangaluru',totalFare:'3,528' , active: false, fromImg:'assets/images/trending/1.png' , toImg:'assets/images/trending/2.png'  },
    {id:4, fromCity: 'Mumbai',toCity:'Bangaluru',totalFare:'3,528' , active: false, fromImg:'assets/images/trending/1.png' , toImg:'assets/images/trending/2.png'  },
  ]

  popularDomasticRoutes = [
    {fromCity:'Delhi',toCity:'Mumbai',date:'Thu, 6 Jan', totalFare:'3,668', image:'assets/images/Popular/2.png'},
    {fromCity:'Delhi',toCity:'Mumbai',date:'Thu, 6 Jan', totalFare:'3,668', image:'assets/images/Popular/3.png'},
    {fromCity:'Delhi',toCity:'Mumbai',date:'Thu, 6 Jan', totalFare:'3,668', image:'assets/images/Popular/4.png'},
    {fromCity:'Delhi',toCity:'Mumbai',date:'Thu, 6 Jan', totalFare:'3,668', image:'assets/images/Popular/5.png'},
  ]

  exitingOffers = [
    {date:'31, Jan 2022' , title:'First Domestic Flight Booking' ,totalFare:'1500', image:'assets/images/smartbuy/offers/1.png'},
    {date:'31, Jan 2022' , title:'First Domestic Flight Booking' ,totalFare:'1500', image:'assets/images/smartbuy/offers/2.png'},
    {date:'31, Jan 2022' , title:'First Domestic Flight Booking' ,totalFare:'1500', image:'assets/images/smartbuy/offers/1.png'},
    {date:'31, Jan 2022' , title:'First Domestic Flight Booking' ,totalFare:'1500', image:'assets/images/smartbuy/offers/3.png'},
    {date:'31, Jan 2022' , title:'First Domestic Flight Booking' ,totalFare:'1500', image:'assets/images/smartbuy/offers/1.png'},
  ]
 navItemActive:string='flight';

  constructor(
    public _styleManager: StyleManagerService,
      public router: Router,
      private _flightService: FlightService,private ngZone:NgZone,private sg: SimpleGlobal

    ) {
    this.cdnUrl = environment.cdnUrl+this.sg['assetPath'];
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

    this.isMobile = window.innerWidth < 991 ?  true : false;
    let continueSearchValLs:any= localStorage.getItem('continueSearch');
    if(continueSearchValLs!=null){
      this.continueSearchVal =JSON.parse(continueSearchValLs);
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

  continueSearch(param:any){
  
    if(param.fromContry=='IN' && param.toContry=='IN' ){
    if(param.arrival == "" || param.arrival == undefined || param.arrival == null ){
      let url="flight-list?"+decodeURIComponent(this.ConvertObjToQueryString(param));
      this.router.navigateByUrl(url);
    }
    else {
      let url="flight-roundtrip?"+decodeURIComponent(this.ConvertObjToQueryString(param));
      this.router.navigateByUrl(url);
    }
    }else{
      let     url="flight-int?"+decodeURIComponent(this.ConvertObjToQueryString((param)));
          this.router.navigateByUrl(url);

       }

  }



}
