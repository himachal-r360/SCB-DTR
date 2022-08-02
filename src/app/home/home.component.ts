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
    if(param.arrival == "" || param.arrival == undefined || param.arrival == null ){
      let url="flight-list?"+decodeURIComponent(this.ConvertObjToQueryString(param));
      this.router.navigateByUrl(url);
    }
    else {
      let url="flight-roundtrip?"+decodeURIComponent(this.ConvertObjToQueryString(param));
      this.router.navigateByUrl(url);
    }
  }


}
