import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SimpleGlobal } from 'ng2-simple-global';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Subscription } from 'rxjs';
import { HotelService } from 'src/app/common/hotel.service';
import { environment } from 'src/environments/environment';
declare var $: any;
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
  checkin:any;
  checkout:any;
  hotelAmenity:any=[];
  currentLink :string;
  Facilities:any =
    {
    'roomService':{name:'Room Service',value:'roomService',image:'assets/images/hotel/Offered/hotelDetail_roomService.svg'},
    'gym':{name:'Gym',value:'gym',image:'assets/images/hotel/Offered/hotelDetail_gym.svg'},
    'swimming':{name:'Pool',value:'swimming',image:'assets/images/hotel/Offered/swimming1.svg'},
    'bar':{name:'Bar',value:'bar',image:'assets/images/hotel/Offered/bar1.svg'},
    'airConditioner':{name:'Air Conditioner',value:'airConditioner',image:'assets/images/hotel/Offered/airConditioner1.svg'},
    'wireless':{name:'Internet',value:'wireless',image:'assets/images/hotel/Offered/hotelDetail_wifi.svg'},
    'breakfast':{name:'Breakfast',value:'breakfast',image:'assets/images/hotel/Offered/breakfast.svg'},
    'businessCentre':{name:'Business Centre',value:'businessCentre',image:'assets/images/hotel/Offered/hotelDetail_wifi.svg'},
    'cafe':{name:'Cafe',value:'cafe',image:'assets/images/hotel/Offered/cafe1.svg'},
    'conferenceRoom':{name:'Conference Room',value:'conferenceRoom',image:'assets/images/hotel/Offered/hotelDetail_wifi.svg'},
    'elevator':{name:'Elevator',value:'elevator',image:'assets/images/hotel/Offered/hotelDetail_wifi.svg'},
    'lounge':{name:'Lounge',value:'lounge',image:'assets/images/hotel/Offered/hotelDetail_wifi.svg'},
    'packing':{name:'Packing',value:'packing',image:'assets/images/hotel/Offered/hotelDetail_wifi.svg'},
    'powerBackup':{name:'Power Backup',value:'powerBackup',image:'assets/images/hotel/Offered/hotelDetail_wifi.svg'},
    'projector':{name:'Projector',value:'projector',image:'assets/images/hotel/Offered/projector1.svg'},
    'restaurant':{name:'Restaurant',value:'restaurant',image:'assets/images/hotel/Offered/hotelDetail_restaurant.svg'},
  }

  @ViewChild('WideImageOwl', { static: false }) WideImageOwl: any;

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
  WideImageCustomOptions: OwlOptions = {
    loop: false,
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
    nav: false,
    navText : ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"]

  }
  ThumbNailImageCustomOptions: OwlOptions = {
    loop: false,
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
        items: 10
      },
      400: {
        items: 10
      },
      740: {
        items: 10
      },
      940: {
        items: 10
      }
    },
    nav: true,
    navText : ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"]

  }
  sub:Subscription;
  constructor( public route: ActivatedRoute, private router: Router,private sg: SimpleGlobal, private _hotelService: HotelService) {
    this.cdnUrl = environment.cdnUrl+this.sg['assetPath'];
   }

  ngOnInit(): void {
    this.route.url.subscribe(url => {
      console.log(url)
      const urlParam = this.route.snapshot.queryParams;
      this.currentLink = '/'+url[0].path+'/'+urlParam.searchHotelKey;
      var Details = JSON.parse(sessionStorage.getItem(urlParam.searchHotelKey));
      console.log(Details)
      for (var key in Details.hotel.hotelInfo.amenity) {
        if(Details.hotel.hotelInfo.amenity[key] == 1)
        {
          this.hotelAmenity.push(key);
        }
    }
      this.PriceSummery = Details.PriceSummary;
      this.Hotelkey =Details.hotelkey;
      this.DocKey = Details.docKey;
      this.GetHotelDetails();
    });
  }

  GetHotelDetails() {
    var Request = {docKey:this.DocKey,hotelId:this.Hotelkey,partnerName:this.PriceSummery.partnerName}
    this.sub = this._hotelService.getHotelDetail(Request).subscribe((res: any) => {
     console.log(res);
     this.HotelDetail = res.response[" hotelInfo"];
     let CurrentDate = new Date();
     this.checkin = new Date(CurrentDate.getFullYear()+'-'+(CurrentDate.getMonth()+1)+'-'+CurrentDate.getDate()+' ' +this.HotelDetail.checkIn);
     this.checkout = new Date(CurrentDate.getFullYear()+'-'+(CurrentDate.getMonth()+1)+'-'+CurrentDate.getDate()+' ' +this.HotelDetail.checkOut);
    }, (error) => { console.log(error) });

  }

  onSectionChange(id:any,name:any)
  {
    this.selectedTab = name;
    var container = $(document);
   var position = parseInt($('#'+id).offset().top )- 130
        $(document).scrollTop(position);
    //$(id).scrollTop(0)
     //window.location.href = this.currentLink +id
    //this.router.navigateByUrl(this.currentLink +id);
    //this.router.navigate([id], {relativeTo:this.route})
  }
  onImageClick(index:number)
  {
    this.WideImageOwl.to('Id_'+index);
  }
}
