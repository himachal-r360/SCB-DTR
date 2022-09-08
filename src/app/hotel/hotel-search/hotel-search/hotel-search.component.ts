import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup} from '@angular/forms';
import { reduce } from 'rxjs';
import { HotelService } from 'src/app/common/hotel.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { ElasticsearchService } from 'src/app/shared/services/elasticsearch.service';

@Component({
  selector: 'app-hotel-search',
  templateUrl: './hotel-search.component.html',
  styleUrls: ['./hotel-search.component.sass']
})
export class HotelSearchComponent implements OnInit{
  hotelSearchForm: any;
  hotelList: any;
  cityList: any;
  totalAdultsCount: number = 1;
  totalChildCount: number = 0;
  getSearchValue:any;
  private queryText = '';
  @ViewChild('hideShowCity') hideShowCity: ElementRef;
  @ViewChild('showHideGuest') showHideGuest: ElementRef;
  

  constructor(private _fb: FormBuilder, private _hotelService: HotelService , private router:Router) {
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
      rooms: this._fb.array(
        [
          { room: 1, numberOfAdults: '1', numberOfChildren: '0' }
        ]

      ),
      channel: ['Web'],
      programName: ['SMARTBUY'],
      pageNumber: [0],
      limit: [0],
      numberOfRooms: [1]
    });
  }

  ngOnInit(): void {
    this.getSearchValueLocalStorage();
  }

  showCity(val) {
    if (val == 'show') {
      this.hideShowCity.nativeElement.style.display = "block";
    }
    else {
      this.hideShowCity.nativeElement.style.display = "none";
    }
  }

  getSearchValueLocalStorage() {
    this.getSearchValue = localStorage.getItem('hotelSearch')
    let modifySearchValue = JSON.parse(this.getSearchValue);
    let roomArr = modifySearchValue.rooms;
    if (modifySearchValue != undefined) {
      this.hotelSearchForm = this._fb.group({
        checkIn: [modifySearchValue.checkIn],
        checkOut: [modifySearchValue.checkOut],
        noOfRooms: [modifySearchValue.noOfRooms],
        city: [modifySearchValue.city],
        country: [modifySearchValue.country],
        scr: [modifySearchValue.scr],
        sct: [modifySearchValue.sct],
        hotelName: [modifySearchValue.hotelName],
        latitude: [modifySearchValue.latitude],
        longitude: [modifySearchValue.longitude],
        area: [modifySearchValue.area],
        hotelId: [modifySearchValue.hotelId],
        rooms: this._fb.array([]),
        channel: [modifySearchValue.channel],
        programName: [modifySearchValue.programName],
        limit: [modifySearchValue.limit],
        numberOfRooms: [modifySearchValue.numberOfRooms]
      });
      roomArr.forEach((x) => {
        this.hotelSearchForm.value.rooms = ""
        this.roomsDetails.push(this.modifyDetails(x));
      });
      this.showTotalCountOfAdult();
      this.showTotalCountsOfChild();
    }
  }
  //Increase Child and adult value
  increaseCount(i, item, title) {
    let totalCount;
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

  modifyDetails(x):FormGroup {
    return this._fb.group({
      room: [x.room],
      numberOfAdults: [x.numberOfAdults],
      numberOfChildren: [x.numberOfChildren]
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

  searchAutoComplete($event) {
    
   
  }

   onCitySearchClick(){

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

  searchHotel() {
    this.hotelSearchForm.value.checkIn = moment(this.hotelSearchForm.value.checkIn).format('YYYY-MM-DD');
    this.hotelSearchForm.value.checkOut = moment(this.hotelSearchForm.value.checkOut).format('YYYY-MM-DD');
    this.hotelSearchForm.value.noOfRooms = this.hotelSearchForm.value.rooms.length;
    this.hotelSearchForm.value.numberOfRooms = this.hotelSearchForm.value.rooms.length;
    localStorage.setItem('hotelSearch', JSON.stringify(this.hotelSearchForm.value));
    let url = "hotel-list?" + decodeURIComponent(this.ConvertObjToQueryString(this.hotelSearchForm.value));
    this.router.navigateByUrl(url);
  }





}
