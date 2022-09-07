import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SimpleGlobal } from 'ng2-simple-global';
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
  docKey:string;
  cdnUrl: any;
  CheckInDate:Date;
  CheckoutDate:Date;
  City:string;
  Country: string;

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
      checkIn: ['2022-09-08'],
      checkOut: ['2022-09-09'],
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
      console.log(this.hotelList)
      if(this.container)
      {
        this.container.clear();
      }
     this.intialData();
    }, (error) => { console.log(error) });

  }
}
