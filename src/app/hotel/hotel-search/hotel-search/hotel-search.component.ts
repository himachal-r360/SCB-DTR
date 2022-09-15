import { AfterViewInit, Component, ElementRef,  EventEmitter,  Input,  OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { debounceTime, fromEvent, map, reduce, switchMap } from 'rxjs';
import { HotelService } from 'src/app/common/hotel.service';
import * as moment from 'moment';
import { ActivatedRoute,  Router } from '@angular/router';
import { ElasticsearchService } from 'src/app/shared/services/elasticsearch.service';

@Component({
  selector: 'app-hotel-search',
  templateUrl: './hotel-search.component.html',
  styleUrls: ['./hotel-search.component.css']
})
export class HotelSearchComponent implements OnInit ,AfterViewInit{
  hotelSearchForm: any;
  hotelList: any;
  cityList: any;
  totalAdultsCount: number = 1;
  totalChildCount: number = 0;
  getSearchValue:any;
  queryText:any;
  submitted:boolean = false;
  latestDate = new Date();
  cityName = 'New Delhi';
  continueSearchHotel;
  childAgeArr = [
    { value: 2 },
    { value: 3 },
    { value: 4 },
    { value: 5 },
    { value: 6 },
    { value: 7 },
    { value: 8 },
    { value: 9 },
    { value: 10 },
    { value: 11 }
  ]
  @ViewChild('hideShowCity') hideShowCity: ElementRef;
  @ViewChild('showHideGuest') showHideGuest: ElementRef;
  @ViewChild('citySearchRef') citySearchRef: ElementRef;
  @ViewChild('checkIn') checkIn: ElementRef;
  @ViewChild('checkOut') checkOut: ElementRef;

  

 
  

  constructor(private _fb: FormBuilder, private _hotelService: HotelService , private router:Router , private route:ActivatedRoute) {
    this.hotelSearchForm = this._fb.group({
      checkIn: ['',[Validators.required]],
      checkOut: ['',[Validators.required]],
      noOfRooms: ['1'],
      city: ['New Delhi',[Validators.required]],
      country: ['IN'],
      scr: ['INR'],
      sct: ['IN'],
      hotelName: [''],
      latitude: [''],
      longitude: [''],
      area: [''],
      hotelId: [''],
      countryName:['India'],
      rooms: this._fb.array(
        [
          { room: 1, numberOfAdults: '1', numberOfChildren: '0', childrenAge:[]  }
        ]

      ),
      channel: ['Web'],
      programName: ['SMARTBUY'],
      pageNumber: [0],
      limit: [0],
      numberOfRooms: [1],
      totalGuest:[]
    });
  }

  ngOnInit(): void {
    this.getSearchValueLocalStorage();
    
    
  }

  public Error = (controlName: string, errorName: string) => {
    return this.hotelSearchForm.controls[controlName].hasError(errorName);
  };

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
    this.cityName = modifySearchValue.city
    let roomArr = modifySearchValue.rooms;
    if (modifySearchValue != undefined) {
      this.hotelSearchForm = this._fb.group({
        checkIn: [modifySearchValue.checkIn],
        checkOut: [modifySearchValue.checkOut],
        noOfRooms: [modifySearchValue.noOfRooms],
        city: [this.cityName],
        country: [modifySearchValue.country],
        countryName:[modifySearchValue.countryName],
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
        numberOfRooms: [modifySearchValue.numberOfRooms],
        totalGuest:[modifySearchValue.totalGuest]
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
    let childTotalCount;
    let adultBtn: any = document.getElementById('adultBtn_' + i);
    let childBtn: any = document.getElementById('childBtn_' + i);
    if (title == "child") {
      item.value.numberOfChildren = +item.value.numberOfChildren + 1;
    }
    else {
      item.value.numberOfAdults = +item.value.numberOfAdults + 1;
    }
    childTotalCount = parseInt(item.value.numberOfChildren);
    totalCount = parseInt(item.value.numberOfAdults) + parseInt(item.value.numberOfChildren);
    // childTotalCount > 2 ? childBtn.disabled = true : childBtn.disabled = false;
    totalCount > 4 || childTotalCount > 2 ? childBtn.disabled = true : childBtn.disabled = false;
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
        numberOfChildren: ['0'],
        childrenAge:['0']
      })
  }

  modifyDetails(x):FormGroup {
    return this._fb.group({
      room: [x.room],
      numberOfAdults: [x.numberOfAdults],
      numberOfChildren: [x.numberOfChildren],
      childrenAge:[x.childrenAge]
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
  
  onSelectCity(param){
    this.hotelSearchForm.value.city = param._source.city;
    this.cityName = this.hotelSearchForm.value.city;
    this.hotelSearchForm.value.countryName = param._source.countryName; 
    this.hideShowCity.nativeElement.style.display = "none";
    this.checkIn.nativeElement.click()
  }

  checkInDate(event){
    event = event.target.value;
    this.hotelSearchForm.value.checkIn = moment(event).format('YYYY-MM-DD');
    this.checkOut.nativeElement.click();
  }

  checkOutDate(event){
    event = event.target.value;
    this.hotelSearchForm.value.checkOut = moment(event).format('YYYY-MM-DD');
    this.showHideGuest.nativeElement.style.display = "block";
  }

  onSelectAge(event ,item , i){
    let ageArr:any = [];
    let selectAge1:any = document.getElementById('selectAge1_' + i);
    let selectAge2:any = document.getElementById('selectAge2_' + i);
    let selectAge3:any = document.getElementById('selectAge3_' + i);
    if(selectAge1 != null){
      ageArr = [selectAge1.value]
    }
    if(selectAge1 != null && selectAge2 != null){
      ageArr = [selectAge1.value,selectAge2.value]
    }
    if(selectAge1 != null && selectAge2 != null && selectAge3 != null){
      ageArr = [selectAge1.value,selectAge2.value,selectAge3.value]
    }
    item.value.childrenAge = ageArr;
    
  }



 

  ngAfterViewInit(): void {
    fromEvent(this.citySearchRef.nativeElement, 'input').pipe(
      debounceTime(300),
      map((e: any) => e.target.value),
      switchMap(value => this._hotelService.getHotelCityList(value)))
      .subscribe((res: any) => { this.queryText = res.hits.hits; })
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

  hotelSearchCallBack(param: any) {
    let searchValueAllobj = param;
    let continueSearch: any = localStorage.getItem('continueSearchForHotel');
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
    localStorage.setItem('continueSearchForHotel', JSON.stringify(this.continueSearchHotel));
  }

  searchHotel() {
    debugger;
      this.submitted = true;
      if(this.hotelSearchForm.invalid){
        return 
      }
      else {
      this.hotelSearchForm.value.checkIn = moment(this.hotelSearchForm.value.checkIn).format('YYYY-MM-DD');  
      this.hotelSearchForm.value.numberOfRooms = this.hotelSearchForm.value.rooms.length;   
      this.hotelSearchForm.value.noOfRooms = this.hotelSearchForm.value.rooms.length;
      this.hotelSearchForm.value.totalGuest = this.totalAdultsCount + this.totalChildCount;
      localStorage.setItem('hotelSearch', JSON.stringify(this.hotelSearchForm.value));
      let url = "hotel-list?" + decodeURIComponent(this.ConvertObjToQueryString(this.hotelSearchForm.value));
      this. hotelSearchCallBack(this.hotelSearchForm.value)
      this.router.navigateByUrl(url);
    }

  }





}
