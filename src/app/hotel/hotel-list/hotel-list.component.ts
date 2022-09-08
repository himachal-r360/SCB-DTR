import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SimpleGlobal } from 'ng2-simple-global';
import { Options } from 'ng5-slider';
import { HotelService } from 'src/app/common/hotel.service';
import { environment } from 'src/environments/environment';
declare var $: any;
@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.sass']
})
export class HotelListComponent implements OnInit {

  hotelSearchForm: any;
  hotelList:any;
  hotelWithoutFilterList:any;
  docKey:string;
  cdnUrl: any;
  CheckInDate:Date;
  CheckoutDate:Date;
  City:string;
  Country: string;
  minPrice: number = 0;
  maxPrice: number = 1000;
  resetMinPrice: number = 0;
  resetMaxPrice: number = 1000;
  options: Options = {
    floor: 0,
    ceil: 1000,
    translate: (value: number): string => {
      return '';
    }
  };

  starFiltersList:any = [
    { active: false, value: '5'},
    { active: false, value: '4'},
    { active: false, value: '3'},
    { active: false, value: '2'},
    { active: false, value: '1'}
  ]

  amenityList:any =[
    {name:'Gym',value:'gym',active:false},
    {name:'Wireless',value:'wireless',active:false},
    {name:'Projector',value:'projector',active:false},
    {name:'Swimming',value:'swimming',active:false},
    {name:'Breakfast',value:'breakfast',active:false},
    {name:'Bar',value:'bar',active:false},
    {name:'Cafe',value:'cafe',active:false},
    {name:'AirConditioner',value:'airConditioner',active:false},
    {name:'Packing',value:'packing',active:false},
    {name:'Lounge',value:'lounge',active:false},
    {name:'Business Centre',value:'businessCentre',active:false},
    {name:'Conference Room',value:'conferenceRoom',active:false},
    {name:'Elevator',value:'elevator',active:false},
    {name:'Room Service',value:'roomService',active:false},
    {name:'Power Backup',value:'powerBackup',active:false},
    {name:'Restaurant',value:'restaurant',active:false}
  ]

  showMoreAmenity:boolean = false;
  SearchText:string = '';

  @ViewChild('itemsContainer', { read: ViewContainerRef }) container: ViewContainerRef;
  @ViewChild('item', { read: TemplateRef }) template: TemplateRef<any>;

  pageIndex: number = 26;
        ITEMS_RENDERED_AT_ONCE=25;
        nextIndex=0;

         loadData() {
             if (this.pageIndex >= this.hotelList.length) {
             return false;
              }else{
             this.nextIndex = this.pageIndex + this.ITEMS_RENDERED_AT_ONCE;

             if(this.nextIndex > this.hotelList.length){
             this.nextIndex=this.hotelList.length;
             }

            for (let n = this.pageIndex; n < this.nextIndex ; n++) {
             const context = {
                item: [this.hotelList[n]]
              };

              this.container.createEmbeddedView(this.template, context);
            }
             this.pageIndex += this.ITEMS_RENDERED_AT_ONCE;

           }

           //$('.scrollToTop').trigger('click');
        }


         private intialData() {
            for (let n = 0; n <this.ITEMS_RENDERED_AT_ONCE ; n++) {
              if(this.hotelList[n] != undefined)
              {
                const context = {
                  item: [this.hotelList[n]]
                };

                this.container.createEmbeddedView(this.template, context);
              }

            }
            //this.pageIndex += this.ITEMS_RENDERED_AT_ONCE;
            //  this.gotoTop();
        }

  constructor(private _fb: FormBuilder, private _hotelService: HotelService,private sg: SimpleGlobal) {
    this.cdnUrl = environment.cdnUrl+this.sg['assetPath'];
    this.hotelSearchForm = this._fb.group({
      checkIn: ['2022-09-09'],
      checkOut: ['2022-09-10'],
      noOfRooms: ['1'],
      city: ['New Delhi'],
      country: ['IN'],
      scr: ['INR'],
      sct: ['IN'],
      hotelName: [''],
      latitude: [''],
      longitude: [''],
      area: [''],
      hotelId: [''],
      // rooms:[[{"room":1,"numberOfAdults":"2","numberOfChildren":"0"}]],
      rooms: this._fb.array([
        { room: 1, numberOfAdults: '1', numberOfChildren: '0' }
      ]),
      channel: ['Web'],
      programName: ['SMARTBUY'],
      pageNumber: [0],
      limit: [0],
      numberOfRooms: [1],
      countryName : 'India'
    });

    $(window).scroll(function(this) {
      if($(window).scrollTop() + $(window).height() > $(document).height() - 300) {
        $('#endOfPage').trigger('click');
      }
    });
  }


  ngOnInit(): void {
    this.searchHotel();
  }
  searchHotel() {
    this.CheckInDate = this.hotelSearchForm.value.checkIn;
    this.CheckoutDate = this.hotelSearchForm.value.checkOut;
    this.City =  this.hotelSearchForm.value.city;
    this.Country = this.hotelSearchForm.value.countryName;
     this._hotelService.getHotelList(this.hotelSearchForm.value).subscribe((res: any) => {

      this.docKey = res.response.docKey;
      this.hotelList = res.response.hotels;
      this.hotelWithoutFilterList = res.response.hotels;
      console.log(this.hotelList)
      this.GetMinAndMaxPriceForFilter();
      this.AllFilteredData();
    }, (error) => { console.log(error) });

  }

  AllFilteredData()
  {
    //Star Filter Start
    let hotelWithoutFilterList = this.hotelWithoutFilterList;
    const hotelListConst = hotelWithoutFilterList.map((b: any) => ({ ...b }));
    this.hotelList = hotelListConst;

     var StarFiltereddata = [];
    this.starFiltersList.forEach(z=>{
      var data = [];
      if(z.active)
      {

          data = this.hotelList.filter(x=>{
            return x.hotelInfo.starRating == z.value;
          })

          StarFiltereddata.push(...data);

      }
    });
    console.log(StarFiltereddata);
    if(StarFiltereddata.length > 0)
    {
      this.hotelList = StarFiltereddata;
    }

    //Star Filter End

    //Price Filter Start
    if (this.hotelList.length > 0) {
      var min_price = this.minPrice;
      var max_price = this.maxPrice;
      var filteredPrice: any[] = [];
      this.hotelList.filter((e: any) => {
        var filtered = e.priceSummary.filter(z=>
          {
            return z.price >= min_price && z.price<=max_price
          });
        if(filtered.length > 0)
        {
          filteredPrice.push(e);
        }
      });
      this.hotelList = filteredPrice;
    }
    //Price Filter End

    //Amenity Filter Start

    if (this.hotelList.length > 0) {
      var applyFilter = false;
      var AmenityFiltered = [];
      this.amenityList.forEach(z=>{
        if(z.active == true)
        {
          applyFilter = true;
          var data = []
          data =  this.hotelList.filter((e: any) => {
            return e.hotelInfo.amenity[z.value] == 1
          });
          AmenityFiltered.push(...data);
        }
      });
      if(applyFilter)
      {
        this.hotelList = AmenityFiltered;
      }

    }

    //Amenity Filter End

    //Search Text Filter Start
      if(this.SearchText !='')
      {
        if (this.hotelList.length > 0) {
          var data =  this.hotelList.filter((e: any) => {
            return e.hotelInfo.name.includes(this.SearchText);
          });
          this.hotelList = data;
        }
      }
    //Search Text Filter End
    if(this.container)
    {
      this.container.clear();
    }
   this.intialData();
  }


  StarFilter(item:any)
  {
      item.active = !item.active;
      this.AllFilteredData();
  }

  ResetStarFilter()
  {
    this.starFiltersList.filter((item: any) => { item.active = false; return item; })
    this.AllFilteredData();
  }

  onMinValueChange(event: any) {
    this.minPrice = event;
    if (this.minPrice != null) {
      this.AllFilteredData();
    }

  }
  onMaxValueChange(event: any) {
    this.maxPrice = event;
    if (this.maxPrice != null) {
      this.AllFilteredData();
    }
  }

  Initslider() {
    var $that = this;
    $that.sliderRange($that, $that.minPrice, $that.maxPrice);
  }
  sliderRange($that: this, minPrice: number, maxPrice: number) {
    $that.options = {
      floor: minPrice,
      ceil: maxPrice,
      translate: (value: number): string => {
        return '';
      }
    };
    this.resetMinPrice = minPrice;
    this.resetMaxPrice = maxPrice;
  }

  GetMinAndMaxPriceForFilter() {
    if (this.hotelList.length > 0) {
      this.minPrice = this.hotelList[0].priceSummary[0].price;
      this.maxPrice = this.hotelList[0].priceSummary[0].price;
      this.hotelList.forEach((z: any) => {
        z.priceSummary.forEach(x=>{
          var temp = x.price;
          if (temp < this.minPrice) {
            this.minPrice = temp;
          }
          if (temp > this.maxPrice) {
            this.maxPrice = temp;
          }
        });

      });
      this.Initslider();
    }
    else {
      this.minPrice = 0;
      this.maxPrice = 10000;
    }
  }

  ResetPriceFilter()
  {
    this.minPrice = this.resetMinPrice;
    this.maxPrice = this.resetMaxPrice;
    this.Initslider();
    this.AllFilteredData();
  }

  amenityFilter(item:any)
  {
    item.active = !item.active;
    this.AllFilteredData();
  }
  ResetAmenityFilter()
  {
    this.amenityList.filter((item: any) => { item.active = false; return item; })
    this.AllFilteredData();
  }

  ResetAllFilter()
  {
    this.ResetStarFilter();
    this.ResetPriceFilter();
    this.ResetAmenityFilter();

  }

  onSearchInput()
  {
      this.AllFilteredData();
  }
}
