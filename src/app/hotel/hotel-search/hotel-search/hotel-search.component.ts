import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HotelService } from 'src/app/common/hotel.service';

@Component({
  selector: 'app-hotel-search',
  templateUrl: './hotel-search.component.html',
  styleUrls: ['./hotel-search.component.sass']
})
export class HotelSearchComponent implements OnInit ,OnDestroy {
  hotelSearchForm:any; 
  sub:Subscription;
  hotelList:any;

  constructor( private _fb: FormBuilder, private _hotelService:HotelService) { 
    this.hotelSearchForm = this._fb.group({
      checkIn: ['2022-09-06'],
      checkOut: ['2022-09-07'],
      noOfRooms: ['1'],
      city: ['New Delhi'],
      country: ['IN'],
      scr: ['INR'],
      sct:['IN'],
      hotelName:[''],
      latitude:[''],
      longitude:[''],
      area:[''],
      hotelId:[''],
      rooms:[[{"room":1,"numberOfAdults":"2","numberOfChildren":"0"}]],
      channel:['Web'],
      programName:['SMARTBUY'],
      pageNumber:[0],
      limit:[0],
      numberOfRooms:[1]
    });
  }

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  searchHotel(){
     this.sub =  this._hotelService.getHotelList(this.hotelSearchForm.value).subscribe((res:any)=>{
       this.hotelList = res;    
      console.log(this.hotelList, "hotel search ")
      },(error)=>{console.log(error)});
  }


  


}
