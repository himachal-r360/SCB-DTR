import { Component, NgZone, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-infinia-itc-hotel',
  templateUrl: './infinia-itc-hotel.component.html',
  styleUrls: ['./infinia-itc-hotel.component.scss']
})
export class InfiniaItcHotelComponent implements OnInit {
  isMobile:boolean = true;
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

}
