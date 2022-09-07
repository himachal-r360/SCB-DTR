import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { reduce, Subscription } from 'rxjs';
import { HotelService } from 'src/app/common/hotel.service';
import * as moment from 'moment';

@Component({
  selector: 'app-hotel-search',
  templateUrl: './hotel-search.component.html',
  styleUrls: ['./hotel-search.component.sass']
})
export class HotelSearchComponent implements OnInit, OnDestroy {
  hotelSearchForm: any;
  sub: Subscription;
  hotelList: any;
  cityList: any;
  totalAdultsCount: number = 1;
  totalChildCount: number = 0;

  @ViewChild('hideShowCity') hideShowCity: ElementRef;
  @ViewChild('showHideGuest') showHideGuest: ElementRef;

  constructor(private _fb: FormBuilder, private _hotelService: HotelService) {
    this.hotelSearchForm = this._fb.group({
      checkIn: ['2022-09-06'],
      checkOut: ['2022-09-07'],
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
      numberOfRooms: [1]
    });
  }

  ngOnInit(): void {

  }

  showCity(val) {
    if (val == 'show') {
      this.hideShowCity.nativeElement.style.display = "block";
    }
    else {
      this.hideShowCity.nativeElement.style.display = "none";
    }

  }

  //Increase Child and adult value
  increaseCount(i, item, title) {
    console.log(this.hotelSearchForm.value);
    let totalCount;
    // let checkTotalCountValue;
    let adultBtn: any = document.getElementById('adultBtn_' + i);
    let childBtn: any = document.getElementById('childBtn_' + i);
    if (title == "child") {
      item.value.numberOfChildren = +item.value.numberOfChildren + 1;
    }
    else {
      item.value.numberOfAdults = +item.value.numberOfAdults + 1;
      
    }
    totalCount = parseInt(item.value.numberOfAdults) + parseInt(item.value.numberOfChildren);
    totalCount > 4 ? childBtn.disabled = true : childBtn.disabled = false;
    totalCount > 4 ? adultBtn.disabled = true : adultBtn.disabled = false;
    // checkTotalCountValue = totalCount > 5 ? alert("Can add only 5 guests in a room") : '';
    this.showTotalCountOfAdult()
    this.showTotalCountsOfChild()
  }

  //Decrease child and adult value
  decreaseCount(i, item, title) {
    let totalCount;
    let adultBtn: any = document.getElementById('adultBtn_' + i);
    let childBtn: any = document.getElementById('childBtn_' + i);
    if (title == "child") {
      item.value.numberOfChildren = +item.value.numberOfChildren - 1;
    }
    else {
      item.value.numberOfAdults = +item.value.numberOfAdults - 1;
    }
    totalCount = parseInt(item.value.numberOfAdults) + parseInt(item.value.numberOfChildren);
    totalCount < 5 ? childBtn.disabled = false : childBtn.disabled = true;
    totalCount < 5 ? adultBtn.disabled = false : adultBtn.disabled = true;
    this.showTotalCountOfAdult();
    this.showTotalCountsOfChild();
  }

  showTotalCountOfAdult() {
    let totalOfAdults: any;
    totalOfAdults = this.hotelSearchForm.value.rooms
    this.totalAdultsCount = totalOfAdults.filter((item) => item.numberOfAdults)
      .map((item) => +item.numberOfAdults)
      .reduce((sum, current) => sum + current);
  }


  showTotalCountsOfChild() {
    let totalOfChild: any;
    totalOfChild = this.hotelSearchForm.value.rooms
    this.totalChildCount = totalOfChild.filter((item) => item.numberOfChildren)
      .map((item) => +item.numberOfChildren)
      .reduce((sum, current) => sum + current);
  }

  showGuest(val) {
    if (val == 'show') {
      this.showHideGuest.nativeElement.style.display = "block";
    }
    else {
      this.showHideGuest.nativeElement.style.display = "none";
    }
  }

  get roomsDetails(): FormArray {
    return this.hotelSearchForm.controls["rooms"] as FormArray;
  }

  personDetails(): FormGroup {
    return this._fb.group({
      room: [1],
      numberOfAdults: ['1'],
      numberOfChildren: ['0']
    })
  }

  addDetails() {
    this.roomsDetails.push(this.personDetails());
    this.showTotalCountOfAdult();
  }

  removeDetails(i: number) {
    this.roomsDetails.removeAt(i);
    this.showTotalCountOfAdult();
    this.showTotalCountsOfChild();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ConvertObjToQueryString(obj: any) {

    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }

  searchHotel() {
    debugger;
    // let date = moment(date).format('YYYY-MM-DD')
    this.hotelSearchForm.value.checkIn = moment(this.hotelSearchForm.value.checkIn).format('YYYY-MM-DD');
    this.hotelSearchForm.value.checkOut = moment(this.hotelSearchForm.value.checkOut).format('YYYY-MM-DD');
    this.hotelSearchForm.value.noOfRooms = this.hotelSearchForm.value.rooms.length;
    this.hotelSearchForm.value.numberOfRooms = this.hotelSearchForm.value.rooms.length;
    this.hotelSearchForm.value;
    
    // this.sub = this._hotelService.getHotelList(this.hotelSearchForm.value).subscribe((res: any) => {
    //   this.hotelList = res;
    //   console.log(this.hotelSearchForm.value);
    //   console.log(this.hotelList, "hotel search ")
    // }, (error) => { console.log(error) });

  }





}
