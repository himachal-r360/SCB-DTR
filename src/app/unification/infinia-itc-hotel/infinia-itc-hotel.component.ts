import { Component, NgZone, OnInit } from '@angular/core';
import { SimpleGlobal } from 'ng2-simple-global';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AppConfigService } from 'src/app/app-config.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-infinia-itc-hotel',
  templateUrl: './infinia-itc-hotel.component.html',
  styleUrls: ['./infinia-itc-hotel.component.scss']
})
export class InfiniaItcHotelComponent implements OnInit {
  isMobile:boolean = true;

  serviceSettings: any;
  cdnUrl: any;
  cdnDealUrl: any;
  siteUrl: any;
  customOptions: OwlOptions = {
    loop: false,
    autoplay:false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
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





  constructor(private ngZone:NgZone ,private sg: SimpleGlobal, private appConfigService: AppConfigService) {
    window.onresize = (e) =>
    {
        this.ngZone.run(() => {
          this.isMobile = window.innerWidth < 991 ? true : false;
        });

    };
    this.serviceSettings = this.appConfigService.getConfig();
    this.cdnUrl = environment.cdnUrl+this.sg['assetPath'];
    this.cdnDealUrl = environment.cdnDealUrl;
    this.siteUrl = environment.MAIN_SITE_URL;


  }

  ngOnInit(): void {
    this.isMobile = window.innerWidth < 991 ? true : false;

  }

}

