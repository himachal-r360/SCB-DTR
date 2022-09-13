import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SimpleGlobal } from 'ng2-simple-global';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-hotel-detail',
  templateUrl: './hotel-detail.component.html',
  styleUrls: ['./hotel-detail.component.sass']
})
export class HotelDetailComponent implements OnInit {

  HotelDetail :any;
  PriceSummery:any;
  DocKey:string;
  Hotelkey: string;
  cdnUrl: any;
  selectedTab = 'Overview'
  Facilities:any = [
    {name:'Room Service',image:'assets/images/hotel/Offered/1.png'},
    {name:'Gym',image:'assets/images/hotel/Offered/2.png'},
    {name:'Pool',image:'assets/images/hotel/Offered/3.png'},
    {name:'Bar',image:'assets/images/hotel/Offered/4.png'},
    {name:'Doctor on call',image:'assets/images/hotel/Offered/5.png'},
    {name:'Internet',image:'assets/images/hotel/Offered/6.png'},
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
    // navText: ['', ''],
    responsive: {
      0: {
        items: 8
      },
      400: {
        items: 8
      },
      740: {
        items: 8
      },
      940: {
        items: 8
      }
    },
    nav: false
  }

  constructor( public route: ActivatedRoute, private router: Router,private sg: SimpleGlobal) {
    this.cdnUrl = environment.cdnUrl+this.sg['assetPath'];
   }

  ngOnInit(): void {
    this.route.url.subscribe(url => {
      console.log(url)
      const urlParam = this.route.snapshot.queryParams;
      var Details = JSON.parse(sessionStorage.getItem(urlParam.searchHotelKey));
      console.log(Details)
      this.HotelDetail =Details.hotel;
      this.PriceSummery = Details.PriceSummary;
      this.Hotelkey =Details.hotelkey;
      this.DocKey = Details.docKey;
    });
  }

}
