import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { SimpleGlobal } from 'ng2-simple-global';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Subscription } from 'rxjs';
import { HotelService } from 'src/app/common/hotel.service';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
import { FlightService } from 'src/app/common/flight.service';
declare var $: any;
@Component({
  selector: 'app-hotel-detail',
  templateUrl: './hotel-detail.component.html',
  styleUrls: ['./hotel-detail.component.scss']
})
export class HotelDetailComponent implements OnInit {

  GoogleAPI_Key = environment.GOOGLEMAP_API;
  GOOGLE_MAP_URL:any;
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
  SelectedQueryParam:any;
  loaderValue:number;
  TotalAdult:number = 0;
  TotalChild:number = 0;
  Facilities:any =
    {
    'roomService':{name:'Room Service',value:'roomService',image:'assets/images/hotel/amenities/54X54/room-service-svgrepo-com-1.svg'},
    'gym':{name:'Gym',value:'gym',image:'assets/images/hotel/amenities/54X54/GYm.svg'},
    'swimming':{name:'Pool',value:'swimming',image:'assets/images/hotel/amenities/54X54/pool.svg'},
    'bar':{name:'Bar',value:'bar',image:'assets/images/hotel/amenities/54X54/Baar.svg'},
    'airConditioner':{name:'Air Conditioner',value:'airConditioner',image:'assets/images/hotel/amenities/54X54/AC_54.svg'},
    'wireless':{name:'Internet',value:'wireless',image:'assets/images/hotel/amenities/54X54/Wireless.svg'},
    'breakfast':{name:'Breakfast',value:'breakfast',image:'assets/images/hotel/amenities/54X54/BreakFast.svg'},
    'businessCentre':{name:'Business Centre',value:'businessCentre',image:'assets/images/hotel/amenities/54X54/Business_Center.svg'},
    'cafe':{name:'Cafe',value:'cafe',image:'assets/images/hotel/amenities/54X54/Cafe.svg'},
    'conferenceRoom':{name:'Conference Room',value:'conferenceRoom',image:'assets/images/hotel/amenities/54X54/Conference_Room.svg'},
    'elevator':{name:'Elevator',value:'elevator',image:'assets/images/hotel/amenities/54X54/Elevator.svg'},
    'lounge':{name:'Lounge',value:'lounge',image:'assets/images/hotel/amenities/54X54/Lounge.svg'},
    'packing':{name:'Packing',value:'packing',image:'assets/images/hotel/amenities/54X54/Packing.svg'},
    'powerBackup':{name:'Power Backup',value:'powerBackup',image:'assets/images/hotel/amenities/54X54/Power_Backup.svg'},
    'projector':{name:'Projector',value:'projector',image:'assets/images/hotel/amenities/54X54/Projector.svg'},
    'restaurant':{name:'Restaurant',value:'restaurant',image:'assets/images/hotel/amenities/54X54/restaurant-svgrepo-com-1.svg'},
  }

  @ViewChild('WideImageOwl', { static: false }) WideImageOwl: any;
    isMobile: boolean = true;
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
    loop: true,
    autoplay:true,
    mouseDrag: false,
    touchDrag: false,
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
  MobileThumbNailImageCustomOptions: OwlOptions = {
    loop: true,
    autoplay:true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    margin: 10,
    // navText: ['', ''],
    responsive: {
      0: {
        items: 4.2
      },
      400: {
        items: 4.2
      },
      740: {
        items: 4.2
      },
      940: {
        items: 4.2
      }
    },
    nav: true,
    navText : ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"]

  }
  MobilecustomOptions: OwlOptions = {
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
        items: 3
      },
      400: {
        items: 3
      },
      740: {
        items: 3
      },
      940: {
        items: 3
      }
    },
    nav: false
  }
  sub:Subscription;
  constructor( public route: ActivatedRoute, private router: Router,private sg: SimpleGlobal, private _hotelService: HotelService,private _sanitizer: DomSanitizer,private location: Location , private _flightService:FlightService) {
    this.cdnUrl = environment.cdnUrl+this.sg['assetPath'];
   }

  ngOnInit(): void {

    this.route.url.subscribe(url => {
    this.isMobile = window.innerWidth < 991 ? true : false;
      //console.log(this.checkin)
      this.isMobile = window.innerWidth < 991 ?  true : false;
      const urlParam = this.route.snapshot.queryParams;
      this.currentLink = '/'+url[0].path+'/'+urlParam.searchHotelKey;
      var Details = JSON.parse(sessionStorage.getItem(urlParam.searchHotelKey));
     // console.log(Details)
      for (var key in Details.hotel.hotelInfo.amenity) {
        if(Details.hotel.hotelInfo.amenity[key] == 1)
        {
          this.hotelAmenity.push(key);
        }
    }
      this.PriceSummery = Details.PriceSummary;
      this.Hotelkey =Details.hotelkey;
      this.DocKey = Details.docKey;
      this.SelectedQueryParam = Details.QueryData;
   this.SelectedQueryParam.rooms.forEach((z)=>{
    this.TotalAdult += parseInt(z.numberOfAdults);
    this.TotalChild += parseInt(z.numberOfChildren);
   })
    this.resetPopups();
      if(this.isMobile)
      this.headerHideShow(null);
      this.GetHotelDetails();
    });
  }
  resetPopups() {

    $(".modal").hide();
    $("body").removeAttr("style");
    $(".modal-backdrop").remove();
  }
  GetHotelDetails() {
    $("#bookingprocess").modal('show')
    this.loaderValue = 10;
  const myInterval3 = setInterval(() => {
    this.loaderValue = this.loaderValue + 10;

    if (this.loaderValue == 110) {
      this.loaderValue = 10;
    }
  }, 300);
    var Request = {docKey:this.DocKey,hotelId:this.PriceSummery.hotelId,partnerName:this.PriceSummery.partnerName}
    this.sub = this._hotelService.getHotelDetail(Request).subscribe((res: any) => {
    // console.log(res , "responce");
     if(res && res.response && res.response[" hotelInfo"]){
     this.HotelDetail = res.response[" hotelInfo"];
     let CurrentDate = new Date();

     this.checkin = new Date(CurrentDate.getFullYear()+'-'+(CurrentDate.getMonth()+1)+'-'+CurrentDate.getDate()+' ' +this.HotelDetail.checkIn);
     this.checkout = new Date(CurrentDate.getFullYear()+'-'+(CurrentDate.getMonth()+1)+'-'+CurrentDate.getDate()+' ' +this.HotelDetail.checkOut);
    //  var url = 'https://www.google.com/maps/embed/v1/view?key='+this.GoogleAPI_Key+'&center='+this.HotelDetail.latitude+','+this.HotelDetail.longitude+'&zoom=18';

    var url = 'https://www.google.com/maps/embed/v1/place?key='+this.GoogleAPI_Key+'&q='+this.HotelDetail.latitude+','+this.HotelDetail.longitude+'&zoom=18'
     this.GOOGLE_MAP_URL = this._sanitizer.bypassSecurityTrustResourceUrl(url)
     $("#bookingprocess").modal('hide')
     clearInterval(myInterval3);
     }else{
      $("#bookingprocess").modal('hide');
       $("#bookingprocessFailed").modal('show');

     }


    }, (error) => {
       $("#bookingprocess").modal('hide');
       $("#bookingprocessFailed").modal('show');
       });

  }

  onSectionChange(id:any,name:any)
  {
    this.selectedTab = name;
    var container = $(document);
    if(!this.isMobile)
    {
      var position = parseInt($('#'+id).offset().top )- 130
      $(document).scrollTop(position);
    }
   else{
    var position = parseInt($('#'+id).offset().top )
        $(document).scrollTop(position);
   }
    //$(id).scrollTop(0)
     //window.location.href = this.currentLink +id
    //this.router.navigateByUrl(this.currentLink +id);
    //this.router.navigate([id], {relativeTo:this.route})
  }
   onBooking(item)
  {

        let hotelDetailsArr: any = {
        "docKey": this.DocKey,
        "Hotelkey": this.Hotelkey,
        "queryHotelData": this.SelectedQueryParam,
        "PriceSummery": this.PriceSummery,
        "selectedHotel": item,
        "hotel_detail": this.HotelDetail
        };

//console.log(hotelDetailsArr);
        let randomHotelDetailKey = btoa(item.roomType.bookingCode+this.PriceSummery.partnerName);
        sessionStorage.setItem(randomHotelDetailKey, JSON.stringify(hotelDetailsArr));
        let url = 'hotel-checkout?searchHotelKey=' + randomHotelDetailKey;

        setTimeout(() => {
        this.router.navigateByUrl(url);
        }, 10);


}
  onImageClick(index:number)
  {
    this.WideImageOwl.to('Id_'+index);
  }
  backClicked(){
  this.resetPopups();
    let url = "hotel-list?" + decodeURIComponent(this.ConvertObjToQueryString(this.SelectedQueryParam));
    this.router.navigateByUrl(url);
  }


  ConvertObjToQueryString(obj: any) {
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

  headerHideShow(event:any) {
    this.isMobile = window.innerWidth < 991 ?  true : false;
    if(this.isMobile){
     this._flightService.showHeader(false);
    }else{
    this._flightService.showHeader(true);
    }
  }

  CloseModal()
  {
    $("#moreAmenities").modal('hide')
   
  }

   
  goToModifySearch(){
    this.router.navigate(['compare-stay']);
  }
  

  showCancellationDetail(i){
  $('#showCancellation_' + i).show();
  }

  closeCancellation(i){
         setTimeout(() => {
           $('#showCancellation_' + i).hide();
        }, 10);
   // $('#showCancellation_' + i).addClass('d-none');
    
  }
}
