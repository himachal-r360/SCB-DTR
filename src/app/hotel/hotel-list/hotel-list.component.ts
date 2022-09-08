import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SimpleGlobal } from 'ng2-simple-global';
import { Subscription } from 'rxjs';
import { HotelService } from 'src/app/common/hotel.service';
import { environment } from 'src/environments/environment';
declare var $: any;
@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.sass']
})
export class HotelListComponent implements OnInit,OnDestroy {
  hotelSearchForm: any;
  hotelList:any;
  docKey:string;
  cdnUrl: any;
  CheckInDate:Date;
  CheckoutDate:Date;
  City:string;
  Country: string;
  searchData:any;
  hotelSearchData:any;
  sub:Subscription;

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

  constructor(private _fb: FormBuilder, private _hotelService: HotelService,private sg: SimpleGlobal ,private route:ActivatedRoute) {
    this.cdnUrl = environment.cdnUrl+this.sg['assetPath'];
    this.hotelSearchForm = this._fb.group({
      checkIn: [],
      checkOut: [],
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
      rooms: this._fb.array([
        { room: 1, numberOfAdults: '1', numberOfChildren: '0' }
      ]),
      channel: ['Web'],
      programName: ['SMARTBUY'],
      pageNumber: [0],
      limit: [0],
      numberOfRooms: [1],
      countryName : ['India']
    });

    $(window).scroll(function(this) {
      if($(window).scrollTop() + $(window).height() > $(document).height() - 300) {
        $('#endOfPage').trigger('click');
      }
    });
  }


  ngOnInit(): void {
    this.getSearchData();
    this.searchHotel();
  }

  getSearchData(){
    const urlParam = this.route.snapshot.queryParams;
    this.searchData =  urlParam;
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
    this.hotelSearchForm.get('noOfRooms').setValue(this.searchData.noOfRooms);
    this.getQueryParamData();
  }

  getQueryParamData() {
    debugger;
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
    this.hotelSearchData = hotelSearchArr;
    this.hotelSearchForm.value.rooms = this.hotelSearchData;
    // this.searchData.forEach((z)=>{
    //   z.isSelected = false;
    //   z.selectedFlight = null
    // });
    // this.selectedTripData = this.searchData[0];
    // this.TotalPassenger = parseInt(this.selectedTripData.adults) + parseInt(this.selectedTripData.infants) + parseInt(this.selectedTripData.child);

  }



  searchHotel() {
    this.CheckInDate = this.hotelSearchForm.value.checkIn;
    this.CheckoutDate = this.hotelSearchForm.value.checkOut;
    this.City =  this.hotelSearchForm.value.city;
    this.Country = this.hotelSearchForm.value.countryName;
    this.sub = this._hotelService.getHotelList(this.hotelSearchForm.value).subscribe((res: any) => {
      this.docKey = res.response.docKey;
      this.hotelList = res.response.hotels;
      if(this.container)
      {
        this.container.clear();
      }
     this.intialData();
    }, (error) => { console.log(error) });

  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
