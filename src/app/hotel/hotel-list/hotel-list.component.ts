import { Component, ElementRef, HostListener, NgZone, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SimpleGlobal } from 'ng2-simple-global';
import { Subscription } from 'rxjs';
import { ChangeContext, Options, PointerType } from 'ng5-slider';
import { HotelService } from 'src/app/common/hotel.service';
import { environment } from 'src/environments/environment';
import { FlightService } from 'src/app/common/flight.service';
import { Location } from '@angular/common';
import xss from 'xss';
declare var $: any;
@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.scss']
})
export class HotelListComponent implements OnInit, OnDestroy {
  hotelSearchForm: any;
  hotelList: any;
  hotelWithoutFilterList: any;
  docKey: string;
  cdnUrl: any;
  CheckInDate: Date;
  CheckoutDate: Date;
  City: string;
  Country: string;
  minPrice: number = 0;
  maxPrice: number = 1000;
  resetMinPrice: number = 0;
  resetMaxPrice: number = 1000;
  isMobile: boolean = true;
  partnerArr: any = [];
  loader: boolean = false;
  loaderValue = 10;
  dummyForLoader = Array(10).fill(0).map((x, i) => i);
  isResponse: boolean = true;
  @ViewChild('closeModel') closeModel: ElementRef

  options: Options = {
    floor: 0,
    ceil: 1000,
    step: 10,
    translate: (value: number): string => {
      return '';
    }
  };
  totalGuest = 0;
  starFiltersList: any = [
    { active: false, value: '5' },
    { active: false, value: '4' },
    { active: false, value: '3' },
    { active: false, value: '2' },
    { active: false, value: '1' }
  ]

  amenityList: any = [
    { name: 'Gym', value: 'gym', active: false },
    { name: 'Wireless', value: 'wireless', active: false },
    { name: 'Projector', value: 'projector', active: false },
    { name: 'Swimming', value: 'swimming', active: false },
    { name: 'Breakfast', value: 'breakfast', active: false },
    { name: 'Bar', value: 'bar', active: false },
    { name: 'Cafe', value: 'cafe', active: false },
    { name: 'AirConditioner', value: 'airConditioner', active: false },
    { name: 'Packing', value: 'packing', active: false },
    { name: 'Lounge', value: 'lounge', active: false },
    { name: 'Business Centre', value: 'businessCentre', active: false },
    { name: 'Conference Room', value: 'conferenceRoom', active: false },
    { name: 'Elevator', value: 'elevator', active: false },
    { name: 'Room Service', value: 'roomService', active: false },
    { name: 'Power Backup', value: 'powerBackup', active: false },
    { name: 'Restaurant', value: 'restaurant', active: false }
  ]

  specialOffers = [
    { name: 'Offers 1', active: false },
    { name: 'Offers 2', active: false },
    { name: 'Offers 3', active: true },
  ]

  houseRules = [
    { name: 'Entire Property', active: false },
    { name: 'Star Host', active: false },
    { name: 'Caretaker', active: false },
    { name: 'Homestays', active: true },
  ]

  bookingPreferences = [
    { name: 'Entire Property', active: false },
    { name: 'Caretaker', active: false },
    { name: 'Instant Book', active: true },
    { name: 'Homestays', active: false },
  ]

  populateFilter = [
    { name: 'Apartment', active: false },
    { name: 'ApartHotel', active: false },
    { name: 'Holiday Home', active: false },
    { name: 'Camping', active: false },
    { name: 'Villas', active: false },
    { name: 'Resorts', active: false },
  ]

  priceSortingFilteritems = [
    { name: 'P_L_H', active: false, value: 'Low to High', image: './assets/images/icons/price-l.png', activeImage: './assets/images/icons/active_lth.png', sortValue: 'Price' },
    { name: 'P_H_L', active: false, value: 'High to Low', image: './assets/images/icons/price-h.png', activeImage: './assets/images/icons/active_lth.png', sortValue: 'Price' },
    { name: 'S_L_H', active: false, value: 'Low to High', image: './assets/hotel/icon/Star-l.png', activeImage: './assets/images/icons/active_lth.png', sortValue: 'Star' },
    { name: 'S_H_L', active: false, value: 'High to Low', image: './assets/hotel/icon/Star-l.png', activeImage: './assets/images/icons/active_lth.png', sortValue: 'Star' },
    { name: 'Trending', active: true, value: 'Trending Hotels', image: './assets/hotel/icon/Trending.png', activeImage: './assets/images/icons/active_lth.png', sortValue: '' },
  ]

  Facilities: any =
    [
      { name: 'Room Service', value: 'roomService', image: 'assets/images/hotel/amenities/18X18/room-service-svgrepo-com-2.svg' },
      { name: 'Gym', value: 'gym', image: 'assets/images/hotel/amenities/18X18/GYm.svg' },
      { name: 'Pool', value: 'swimming', image: 'assets/images/hotel/amenities/18X18/pool.svg' },
      { name: 'Bar', value: 'bar', image: 'assets/images/hotel/amenities/18X18/Baar.svg' },
      { name: 'AC', value: 'airConditioner', image: 'assets/images/hotel/amenities/18X18/AC_18.svg' },
      { name: 'Internet', value: 'wireless', image: 'assets/images/hotel/amenities/18X18/Wireless.svg' },
      { name: 'Breakfast', value: 'breakfast', image: 'assets/images/hotel/amenities/18X18/BreakFast.svg' },
      { name: 'Business Centre', value: 'businessCentre', image: 'assets/images/hotel/amenities/18X18/Business_Center.svg' },
      { name: 'Cafe', value: 'cafe', image: 'assets/images/hotel/amenities/18X18/Cafe.svg' },
      { name: 'Conference Room', value: 'conferenceRoom', image: 'assets/images/hotel/amenities/18X18/Conference_Room.svg' },
      { name: 'Elevator', value: 'elevator', image: 'assets/images/hotel/amenities/18X18/Elevator.svg' },
      { name: 'Lounge', value: 'lounge', image: 'assets/images/hotel/amenities/18X18/Lounge.svg' },
      { name: 'Packing', value: 'packing', image: 'assets/images/hotel/amenities/18X18/Packing.svg' },
      { name: 'Power Backup', value: 'powerBackup', image: 'assets/images/hotel/amenities/18X18/Power_Backup.svg' },
      { name: 'Projector', value: 'projector', image: 'assets/images/hotel/amenities/18X18/Projector.svg' },
      { name: 'Restaurant', value: 'restaurant', image: 'assets/images/hotel/amenities/18X18/restaurant-svgrepo-com-2.svg' },
    ]

  showMoreAmenity: boolean = false;
  SearchText: string = '';
  searchData: any;
  hotelSearchData: any;
  sub: Subscription;

  @ViewChild('itemsContainer', { read: ViewContainerRef }) container: ViewContainerRef;
  @ViewChild('item', { read: TemplateRef }) template: TemplateRef<any>;
  @ViewChild('showFilter') showFilter: ElementRef;

  pageIndex: number = 11;
  ITEMS_RENDERED_AT_ONCE = 10;
  nextIndex = 0;

  loadData() {
    if (this.pageIndex >= this.hotelList.length) {
      return false;
    } else {
      this.nextIndex = this.pageIndex + this.ITEMS_RENDERED_AT_ONCE;

      if (this.nextIndex > this.hotelList.length) {
        this.nextIndex = this.hotelList.length;
      }

      for (let n = this.pageIndex; n < this.nextIndex; n++) {
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
    for (let n = 0; n < this.ITEMS_RENDERED_AT_ONCE; n++) {
      if (this.hotelList[n] != undefined) {
        const context = {
          item: [this.hotelList[n]]
        };

        this.container.createEmbeddedView(this.template, context);
      }

    }
    //this.pageIndex += this.ITEMS_RENDERED_AT_ONCE;
    //  this.gotoTop();
  }

  constructor(private _fb: FormBuilder, private _hotelService: HotelService, private sg: SimpleGlobal, private route: ActivatedRoute, private _flightService: FlightService, private location: Location, private router: Router) {
    this.cdnUrl = environment.cdnUrl + this.sg['assetPath'];
    this.hotelSearchForm = this._fb.group({
      checkIn: [],
      checkOut: [],
      noOfRooms: ['1'],
      city: [],
      country: ['IN'],
      scr: ['INR'],
      sct: ['IN'],
      hotelName: [''],
      latitude: [''],
      longitude: [''],
      area: [''],
      hotelId: [''],
      rooms: this._fb.array([
        { room: 1, numberOfAdults: '1', numberOfChildren: '0', childrenAge: [] }
      ]),
      channel: ['Web'],
      programName: ['SMARTBUY'],
      pageNumber: [0],
      limit: [0],
      numberOfRooms: [1],
      countryName: ['India'],
      totalGuest: []
    });

    $(window).scroll(function (this) {
      if ($(window).scrollTop() + $(window).height() > $(document).height() - 300) {
        $('#endOfPage').trigger('click');
      }
    });
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;


  }

  /*@HostListener('window:resize', ['$event']) resizeEvent(event: Event) {
    this.isMobile = window.innerWidth < 991 ?  true : false;
  }*/


  ngOnInit(): void {
    this.isMobile = window.innerWidth < 991 ? true : false;
    // this.sub = this.route.url.subscribe(url =>{
    this.isResponse = true;
    this.loader = true;
      this.resetPopups();
    this.getSearchData();
    if (this.isMobile)
      this.headerHideShow(null);
    this.searchHotel();
    // });
  }

  getSearchData() {
    // console.log(this.route.snapshot.queryParams)
    const urlParam = this.route.snapshot.queryParams;
    this.searchData = urlParam;
    this.hotelSearchForm.get('checkIn').setValue(this.searchData.checkIn);
    this.hotelSearchForm.get('checkOut').setValue(this.searchData.checkOut);
    this.hotelSearchForm.get('city').setValue(this.searchData.city);
    this.hotelSearchForm.get('country').setValue(this.searchData.country);
    this.hotelSearchForm.get('scr').setValue(this.searchData.scr);
    this.hotelSearchForm.get('sct').setValue(this.searchData.sct);
    this.hotelSearchForm.get('hotelName').setValue(this.searchData.hotelName);
    this.hotelSearchForm.get('latitude').setValue(this.searchData.latitude);
    this.hotelSearchForm.get('longitude').setValue(this.searchData.longitude);
    this.hotelSearchForm.get('area').setValue(this.searchData.area);
    this.hotelSearchForm.get('hotelId').setValue(this.searchData.hotelId);
    this.hotelSearchForm.get('channel').setValue(this.searchData.channel);
    this.hotelSearchForm.get('programName').setValue(this.searchData.programName);
    this.hotelSearchForm.get('limit').setValue(this.searchData.limit);
    this.hotelSearchForm.get('numberOfRooms').setValue(this.searchData.numberOfRooms);
    this.hotelSearchForm.get('countryName').setValue(this.searchData.countryName);
    this.hotelSearchForm.get('noOfRooms').setValue(this.searchData.noOfRooms);
    this.hotelSearchForm.get('totalGuest').setValue(this.searchData.totalGuest);
    this.getQueryParamData();
  }

  getQueryParamData() {
    const urlParam = this.route.snapshot.queryParams;
    this.hotelSearchData = urlParam;
    var hotelSearchArr = [];
    for (var i = 0; i < 5; i++) // for generating array by object.
    {
      var objKeys = Object.keys(urlParam); // get all object Keys
      var objSearch = {};
      
   
      
      for (var j = 0; j < objKeys.length; j++) {
        if (objKeys[j].indexOf("[" + i + "]") > -1) {
          var objKey = objKeys[j].substring(0, objKeys[j].length - 3);
          var objKeyVal = urlParam[objKeys[j]];
          objSearch[objKey] = objKeyVal;
        }
      }

      if (objSearch != null && objSearch != undefined && Object.keys(objSearch).length) {
        hotelSearchArr.push(objSearch); // Add object in array.
      }
    }
    
    
    this.hotelSearchForm.value.rooms = hotelSearchArr;
   // console.log(this.hotelSearchForm.value);
      localStorage.setItem(environment.hotelLastSearch, JSON.stringify(this.hotelSearchForm.value));
     this. hotelSearchCallBack(this.hotelSearchForm.value);

  }
  
    continueSearchHotel;
    hotelSearchCallBack(param: any) {
    let searchValueAllobj = param;
    let continueSearch: any = localStorage.getItem(environment.continueSearchHotel);
    if (continueSearch == null) {
      this.continueSearchHotel = [];
    }
    if (continueSearch != null && continueSearch.length > 0) {
      this.continueSearchHotel = JSON.parse(continueSearch);
      this.continueSearchHotel = this.continueSearchHotel.filter((item: any) => {
        if (item.city != searchValueAllobj.city) {
          return item;
        }
      })
    }
    if (this.continueSearchHotel.length > 3) {
      this.continueSearchHotel = this.continueSearchHotel.slice(0, 3);
    }
    this.continueSearchHotel.unshift(searchValueAllobj);// unshift/push - add an element to the beginning/end of an array
    localStorage.setItem(environment.continueSearchHotel, JSON.stringify(this.continueSearchHotel));
  }
  resetPopups() {

    $(".modal").hide();
    $("body").removeAttr("style");
    $(".modal-backdrop").remove();
  }
  headerHideShow(event: any) {
    this.isMobile = window.innerWidth < 991 ? true : false;
    if (this.isMobile) {
      this._flightService.showHeader(false);
    } else {
      this._flightService.showHeader(true);
    }
  }



  searchHotel() {
    this.loader = true;
    this.CheckInDate = this.hotelSearchForm.value.checkIn;
    this.CheckoutDate = this.hotelSearchForm.value.checkOut;
    this.City = this.hotelSearchForm.value.city;
    this.Country = this.hotelSearchForm.value.countryName;
    this.sub = this._hotelService.getHotelList(this.hotelSearchForm.value).subscribe((res: any) => {
      this.loader = false;
      if (res.response.hotels) {
        if (res.response.hotels.length > 0) {
          this.isResponse = true
        }
        else {
          this.isResponse = false
        }
      }
      else {
        this.isResponse = false
      }
      this.docKey = res.response.docKey;
      this.hotelList = res.response.hotels;
      this.hotelWithoutFilterList = res.response.hotels;
      this.GetMinAndMaxPriceForFilter();
      this.GetPartners();
      this.AllFilteredData();
    }, (error) => {
      this.isResponse = false;
      this.loader = false;
    });

  }

  AllFilteredData() {
    //Star Filter Start
    this.resetSorttingWithScroll();
    let hotelWithoutFilterList = this.hotelWithoutFilterList;
    const hotelListConst = hotelWithoutFilterList.map((b: any) => ({ ...b }));
    this.hotelList = hotelListConst;
    var applyStar = false;
    var StarFiltereddata = [];
    this.starFiltersList.forEach(z => {
      var data = [];
      if (z.active) {
        applyStar = true;
        data = this.hotelList.filter(x => {
          return x.hotelInfo.starRating == z.value;
        })

        StarFiltereddata.push(...data);

      }
    });
    if (applyStar) {
      this.hotelList = StarFiltereddata;
      
    }

    //Star Filter End

    //Price Filter Start
    if (this.hotelList.length > 0) {
      var min_price = this.minPrice;
      var max_price = this.maxPrice;
      var filteredPrice: any[] = [];
      this.hotelList.filter((e: any) => {
        var filtered = e.priceSummary.filter(z => {
          return z.price >= min_price && z.price <= max_price
        });
        if (filtered.length > 0) {
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
      this.amenityList.forEach(z => {
        if (z.active == true) {
          applyFilter = true;
          var data = []
          data = this.hotelList.filter((e: any) => {
            return e.hotelInfo.amenity[z.value] == 1
          });
          AmenityFiltered.push(...data);
        }
      });
      if (applyFilter) {
        this.hotelList = AmenityFiltered;
      }



    }

    //Amenity Filter End


    //Search Text Filter Start
    if (this.SearchText != '') {
      if (this.hotelList.length > 0) {
        var data = this.hotelList.filter((e: any) => {
          return e.hotelInfo.name.toLowerCase().includes(this.SearchText.toLowerCase());
        });
        this.hotelList = data;
      }
    }
    // shortings
    this.priceSortingFilteritems.filter((item: any) => {
      if (item.name == 'P_L_H' && item.active == true) {
        this.hotelList.sort((a: any, b: any) => a.priceSummary[0].price - b.priceSummary[0].price);
      }
      else if (item.name == 'P_H_L' && item.active == true) {
        this.hotelList.sort((a: any, b: any) => b.priceSummary[0].price - a.priceSummary[0].price);
      }
      else if (item.name == 'S_L_H' && item.active == true) {
        this.hotelList.sort((a: any, b: any) => a.hotelInfo.starRating - b.hotelInfo.starRating);
      }
      else if (item.name == 'S_H_L' && item.active == true) {
        this.hotelList.sort((a: any, b: any) => b.hotelInfo.starRating - a.hotelInfo.starRating);
      }
    })


    //Search Text Filter End
    //partner Filter start
    this.filteredPartner();
    //partner Filter end
    if (this.container) {
      this.container.clear();
    }
    this.intialData();
  }



  StarFilter(item: any) {
    item.active = !item.active;
    if (!this.isMobile) {
      this.AllFilteredData();
    }
  }

  ResetStarFilter() {
    this.starFiltersList.filter((item: any) => { item.active = false; return item; })
    this.AllFilteredData();
  }
  onUserChangeEnd(changeContext: ChangeContext): void {
    if (changeContext.pointerType === PointerType.Min) {
      this.minPrice = changeContext.value;
    }
    else {
      this.maxPrice = changeContext.highValue;
    }
    if (!this.isMobile) {
      this.AllFilteredData();
    }
  }

  // onMinValueChange(event: any) {
  //   this.minPrice = event;
  //   if (this.minPrice != null) {
  //     if(!this.isMobile)
  //     {
  //       this.AllFilteredData();
  //     }
  //   }

  // }
  // onMaxValueChange(event: any) {
  //   this.maxPrice = event;
  //   if (this.maxPrice != null) {
  //     if(!this.isMobile)
  //     {
  //       this.AllFilteredData();
  //     }
  //   }
  // }

  Initslider() {
    var $that = this;
    $that.sliderRange($that, $that.minPrice, $that.maxPrice);
  }
  sliderRange($that: this, minPrice: number, maxPrice: number) {
    $that.options = {
      floor: minPrice,
      ceil: maxPrice,
      step: 10,

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
        z.priceSummary.forEach(x => {
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

  ResetPriceFilter() {
    this.minPrice = this.resetMinPrice;
    this.maxPrice = this.resetMaxPrice;
    this.Initslider();
    this.AllFilteredData();
  }

  amenityFilter(item: any) {
    item.active = !item.active;
    if (!this.isMobile) {
      this.AllFilteredData();
    }
  }
  ResetAmenityFilter() {
    this.amenityList.filter((item: any) => { item.active = false; return item; })
    this.AllFilteredData();
  }

  ResetAllFilter() {
    this.ResetStarFilter();
    this.ResetPriceFilter();
    this.ResetAmenityFilter();
    this.ResetPartnerFilter();
  }

  onSearchInput() {
    this.AllFilteredData();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }


  BookingSummery(hotelkey: string, hotel: any, selectedPartner: any) {
    let hotelDetailsArr: any = {
      "docKey": this.docKey,
      "hotelkey": hotelkey,
      "hotel": hotel,
      "PriceSummary": selectedPartner,
      "QueryData": this.hotelSearchForm.value
    };
    let randomHotelDetailKey = btoa(this.docKey + hotelkey + selectedPartner.partnerName);
    sessionStorage.setItem(randomHotelDetailKey, JSON.stringify(hotelDetailsArr));
    let url = 'hotel-detail?searchHotelKey=' + randomHotelDetailKey;

    setTimeout(() => {
      this.router.navigateByUrl(url);
    }, 10);

  }
  backClicked() {
    this.location.back();
  }

  goToModifySearch(){
    this.router.navigate(['compare-fly']);
  }

  showHideFilterMobile(val: string) {
    if (val == 'show') {
      this.showFilter.nativeElement.style.display = 'block';
    }
    else {
      this.showFilter.nativeElement.style.display = 'none';
    }

  }
  resetSorttingWithScroll()
  {
    this.pageIndex= 11;
    this.ITEMS_RENDERED_AT_ONCE = 10;
    this.nextIndex = 0;
  }
  hotelSortingMobile(val) {
    let selectedVal = val;
    this.resetSorttingWithScroll();
    this.priceSortingFilteritems.filter((item: any) => {
      item.active = false;
      if (item.name == selectedVal) {
        item.active = true;
      }
      return item;
    });
    if (!this.isMobile) {
      this.AllFilteredData();
    }
  }
  hotelSorting(event: any) {
    let selectedVal = event.target.value;
    this.resetSorttingWithScroll();
    this.priceSortingFilteritems.filter((item: any) => {
      item.active = false;
      if (item.name == selectedVal) {
        item.active = true;
      }
      return item;
    });
    this.AllFilteredData();
  }

  shortings() {
    this.priceSortingFilteritems.filter((item: any) => {
      if (item.name == 'P_L_H' && item.active == true) {
        this.hotelList.sort((a: any, b: any) => a.priceSummary[0].price - b.priceSummary[0].price);
      }
      else if (item.name == 'P_H_L' && item.active == true) {
        this.hotelList.sort((a: any, b: any) => b.priceSummary[0].price - a.priceSummary[0].price);
      }
      else if (item.name == 'S_L_H' && item.active == true) {
        this.hotelList.sort((a: any, b: any) => a.hotelInfo.starRating - b.hotelInfo.starRating);
      }
      else if (item.name == 'S_H_L' && item.active == true) {
        this.hotelList.sort((a: any, b: any) => b.hotelInfo.starRating - a.hotelInfo.starRating);
      }
    })


  }

  GetPartners() {
    this.hotelList.forEach(z => {
      z.priceSummary.map((a: any) => {
        if (!this.partnerArr.find(b => b.partnerName == a.partnerName)) {
          this.partnerArr.push({ partnerName: a.partnerName, active: false });
        }
      });
    });
    // console.log(this.partnerArr)
  }

  partnerFilter(item: any) {
    item.active = !item.active;
    if (!this.isMobile) {
      this.AllFilteredData();
    }

  }

  filteredPartner() {
    let FilteredArray = [];
    var isFilter = false;
    if (this.partnerArr.filter(z => z.active == true).length > 0) {
      isFilter = true;
    }
    this.hotelList.forEach(z => {
      let FilterPartner = [];
      z.priceSummary.map((b: any) => {
        if (this.partnerArr.find(a => a.partnerName == b.partnerName).active) {
          FilterPartner.push(b);

        }
      });
      if (FilterPartner.length > 0 && isFilter) {
        FilteredArray.push(z);
        z.priceSummary = FilterPartner;
      }

    });
    if (isFilter) {
      this.hotelList = FilteredArray;
    }

  }

  ResetPartnerFilter() {
    this.partnerArr.filter((item: any) => { item.active = false; return item; })
    this.AllFilteredData();
  }
  ApplyFilter() {
    this.showHideFilterMobile('hide');
    this.AllFilteredData();
  }

  showAminitiesList: any = [];
  showAminities(item) {
    this.showAminitiesList = item.hotelInfo.amenity;

  }


  amenityCount(data) {
    let retVal = "";
    let obj: any = Object.values(data)
    obj = obj.reduce((prev: any, next: any) => {
      return prev + next;

    });
    if (obj > 3) {
      obj = obj - 3;
      retVal = obj + "+";
    }

    return retVal;

  }
  closeAmenityModelDiv: boolean = true;

  closeAmenityModel() {
    $('#moreAmenities').modal('hide');
  }

}
