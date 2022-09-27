import { AfterViewInit, Component, ElementRef,  EventEmitter,    HostListener,    Input,  OnInit, Output,  ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { debounceTime, fromEvent, map, reduce, switchMap } from 'rxjs';
import { HotelService } from 'src/app/common/hotel.service';
import * as moment from 'moment';
import { ActivatedRoute,  Router } from '@angular/router';
import { SimpleGlobal } from 'ng2-simple-global';
import { ElasticsearchService } from 'src/app/shared/services/elasticsearch.service';
import { environment } from '../../../../environments/environment';
declare var $: any;
@Component({
  selector: 'app-hotel-search',
  templateUrl: './hotel-search.component.html',
  styleUrls: ['./hotel-search.component.css']
})
export class HotelSearchComponent implements OnInit ,AfterViewInit{
  cdnUrl: any;
  hotelSearchForm: any;
  hotelList: any;
  cityList: any;
  totalAdultsCount: number = 2;
  totalChildCount: number = 0;
  getSearchValue:any;
  queryText:any;
  submitted:boolean = false;
  latestDate = new Date();
  minCheckoutDate = new Date();
  cityName = 'New Delhi';
  continueSearchHotel;
  searchEvent;
  isMobile:boolean= true;

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
  ];
  defaultHotelOptions=[
    {"_source":{"full_content":"Mumbai, Maharashtra, India","city":"Mumbai","countryName":"India","country":"IN"}},
    {"_source":{"full_content":"Bangalore, Karnataka, India","city":"Bangalore","countryName":"India","country":"IN"}},
    {"_source":{"full_content":"New Delhi, Delhi NCR, India","city":"New Delhi","countryName":"India","country":"IN"}},
    {"_source":{"full_content":"Chennai, Tamil Nadu, India","city":"Chennai","countryName":"India","country":"IN"}},
    {"_source":{"full_content":"Goa, India","city":"Goa","countryName":"India","country":"IN"}},
    {"_source":{"full_content":"Kolkata, West Bengal, India","city":"Kolkata","countryName":"India","country":"IN"}},
    {"_source":{"full_content":"Hyderabad, Andhra Pradesh, India","city":"Hyderabad","countryName":"India","country":"IN"}},
    {"_source":{"full_content":"Jaipur, Rajasthan, India","city":"Jaipur","countryName":"India","country":"IN"}},
    {"_source":{"full_content":"Cochin, Kerala, India","city":"Cochin","countryName":"India","country":"IN"}},
    {"_source":{"full_content":"London, Greater London, United Kingdom","city":"London","countryName":"United Kingdom","country":"UK"}},
    {"_source":{"full_content":"Dubai, Dubai Emirate, United Arab Emirates","city":"Dubai","countryName":" United Arab Emirates","country":"AE"}},
    {"_source":{"full_content":"Bangkok, Bangkok Province, Thailand","city":"Bangkok","countryName":" Thailand","country":"TH"}},

    ];
  @ViewChild('hideShowCity') hideShowCity: ElementRef;
  @ViewChild('showHideGuest') showHideGuest: ElementRef;
  @ViewChild('citySearchRef') citySearchRef: ElementRef;
  @ViewChild('checkIn') checkIn: ElementRef;
  @ViewChild('checkOut') checkOut: ElementRef;


  @HostListener('window:resize', ['$event']) resizeEvent(event: Event) {
    this.isMobile = window.innerWidth < 991 ?  true : false;
  }



  startAt;
  constructor(private _fb: FormBuilder, private _hotelService: HotelService , private router:Router , private route:ActivatedRoute,private sg: SimpleGlobal) {
   this.cdnUrl = environment.cdnUrl+this.sg['assetPath'];
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
      rooms: this._fb.array( [   ] ),
      channel: ['Web'],
      programName: ['SMARTBUY'],
      pageNumber: [0],
      limit: [0],
      numberOfRooms: [1],
      totalGuest:[]
    });
    this.minCheckoutDate.setDate( this.minCheckoutDate.getDate() + 1 );
   
  }

  ngOnInit(): void {
    this.isMobile = window.innerWidth < 991 ?  true : false;
    this.getSearchValue = localStorage.getItem(environment.hotelLastSearch);

    if(this.getSearchValue != undefined || this.getSearchValue != null){
      this.getSearchValueLocalStorage();
    }else{

        let roomArr= [
        { room: 1, numberOfAdults: '2', numberOfChildren: '0', childrenAge:[0]  }
        ]
        roomArr.forEach((x) => {
        this.hotelSearchForm.value.rooms = ""
        this.roomsDetails.push(this.modifyDetails(x));
        });

    }
  }

  public Error = (controlName: string, errorName: string) => {
    return this.hotelSearchForm.controls[controlName].hasError(errorName);
  };


  getSearchValueLocalStorage() {

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
        const d = new Date(modifySearchValue.checkIn);
       d.setDate(d.getDate() + 1);
       this.minCheckoutDate = d;

    }
  }
  //Increase Child and adult value
  increaseCount(i, item, title) {
    let totalCount;
    let childTotalCount;
    let adultTotalCount;
    let adultBtn: any = document.getElementById('adultBtn_' + i);
    let childBtn: any = document.getElementById('childBtn_' + i);
    if (title == "child") {
      item.value.numberOfChildren = +item.value.numberOfChildren + 1;
    }
    else {
      item.value.numberOfAdults = +item.value.numberOfAdults + 1;
    }
    childTotalCount = parseInt(item.value.numberOfChildren);
    adultTotalCount = parseInt(item.value.numberOfAdults);
    totalCount = parseInt(item.value.numberOfAdults) + parseInt(item.value.numberOfChildren);
    // adultTotalCound > 3 ? adultBtn.disabled = true : adultBtn.disabled = false;
    // childTotalCount > 2 ? childBtn.disabled = true : childBtn.disabled = false;
    totalCount > 4 || childTotalCount > 2 ? childBtn.disabled = true : childBtn.disabled = false;
    totalCount > 4 || adultTotalCount > 3 ? adultBtn.disabled = true : adultBtn.disabled = false;
    this.showTotalCountOfAdult()
    this.showTotalCountsOfChild()

  }

  //Decrease child and adult value
  decreaseCount(i, item, title) {
    let totalCount;
    let childTotalCount;
    let adultTotalCount;
    let adultBtn: any = document.getElementById('adultBtn_' + i);
    let childBtn: any = document.getElementById('childBtn_' + i);
    if (title == "child") {
      item.value.numberOfChildren = +item.value.numberOfChildren - 1;
        var lastCommaIndex = item.value.childrenAge.lastIndexOf(",");
        if(lastCommaIndex !=-1)
        item.value.childrenAge = item.value.childrenAge.substr(0,lastCommaIndex);

    if (this.submitted) {
      var rooms = this.hotelSearchForm.value.rooms;
      var j = 0;
      var isvalid = true;
        rooms.forEach(z => {
        if(z.numberOfChildren >0 ){
        if(Array.isArray(z.childrenAge))
        var childrenAgeArray = z.childrenAge;
        else
        var childrenAgeArray = z.childrenAge.split(',');

        let loopvalid=0;
        for(let i=0;i<(childrenAgeArray.length);i++){
        if(childrenAgeArray[i] < 1) loopvalid++;
        }

        if(childrenAgeArray.length > 0 && z.numberOfChildren  == childrenAgeArray.length && loopvalid == 0 ){
        var id = document.getElementById("error_" + j)
        id.hidden = true;
        isvalid = true;
        }else{
        var id = document.getElementById("error_" + j)
        id.hidden = false;
        isvalid = false;
        }
        j++;
        }
        });
      if (!isvalid) {
        var id1 = document.getElementById("error_AllAge")
        id1.hidden = false;
      }
      else {
        var id1 = document.getElementById("error_AllAge")
        id1.hidden = true;
      }
    }
    
    
    }
    else {
      item.value.numberOfAdults = +item.value.numberOfAdults - 1;
    }
    adultTotalCount = parseInt(item.value.numberOfAdults);
    childTotalCount = parseInt(item.value.numberOfChildren);
    totalCount = parseInt(item.value.numberOfAdults) + parseInt(item.value.numberOfChildren);
    totalCount < 5  ? childBtn.disabled = false : childBtn.disabled = true;
    totalCount < 5  ? adultBtn.disabled = false : adultBtn.disabled = true;
    totalCount > 4 || childTotalCount > 2 ? childBtn.disabled = true : childBtn.disabled = false;
    totalCount > 4 || adultTotalCount > 3 ? adultBtn.disabled = true : adultBtn.disabled = false;
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
    totalOfChild = this.hotelSearchForm.value.rooms;
    this.totalChildCount =0;
       for(let i=0;i<(totalOfChild.length);i++){
       this.totalChildCount+= Number(totalOfChild[i]['numberOfChildren']);
        }
   // this.totalChildCount = totalOfChild.filter((item) => item.numberOfChildren).map((item) => +item.numberOfChildren).reduce((sum, current) => sum + current);
  }


  get roomsDetails(): FormArray {
    return this.hotelSearchForm.controls["rooms"] as FormArray;
  }

  personDetails(): FormGroup {
    return this._fb.group({
        room: [1],
        numberOfAdults: ['2'],
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

  onSelectCity(param) {
    this.hotelSearchForm['controls']['city'].setValue(param._source.city);
    this.hotelSearchForm['controls']['countryName'].setValue(param._source.countryName);
    this.hotelSearchForm['controls']['country'].setValue(param._source.country);
    this.cityName = this.hotelSearchForm.value.city;
     $('.hotel-search-list').hide();
    this.checkIn.nativeElement.click()
  }
focusInput(){
        setTimeout(() => {
        $('.hotel-search-list').show();
        $('#citySearchRef').focus();
        }, 10);
}
  checkInDate(event){
    event = event.target.value;
    this.hotelSearchForm.value.checkIn = moment(event).format('YYYY-MM-DD');
          const d = new Date(event);
       d.setDate(d.getDate() + 1);

       var compare1 = new Date(d).getTime();
       var compare2 = new Date(this.hotelSearchForm.value.checkOut).getTime();

       this.minCheckoutDate = d;
      if (compare1 > compare2) {
        this.hotelSearchForm.value.checkOut = moment(this.minCheckoutDate).format('YYYY-MM-DD');
        this.hotelSearchForm['controls']['checkOut'].setValue(moment(this.minCheckoutDate).format('YYYY-MM-DD'));
      }

    this.checkOut.nativeElement.click();
  }

  checkOutDate(event){
    event = event.target.value;
    this.hotelSearchForm.value.checkOut = moment(event).format('YYYY-MM-DD');
    this.showHideGuest.nativeElement.style.display = "block";
  }

  getAgeValue(ageArray,index){
  if(ageArray[index] !=0 && ageArray[index] != undefined && ageArray[index] != null){
  if (ageArray.indexOf(',') > -1) {
  const myArray = ageArray.split(",");
  return myArray[index];
  }else{
  if(Array.isArray(ageArray))
  return ageArray[index];
  else
  return ageArray;
  }
  }
  }

  onSelectAge(event, item, i) {

    let ageArr: any = [];
    let selectAge1: any = document.getElementById('selectAge1_' + i);
    let selectAge2: any = document.getElementById('selectAge2_' + i);
    let selectAge3: any = document.getElementById('selectAge3_' + i);
    if (selectAge1 != null) {
      ageArr = [selectAge1.value]
    }
    if (selectAge1 != null && selectAge2 != null) {
      ageArr = [selectAge1.value, selectAge2.value]
    }
    if (selectAge1 != null && selectAge2 != null && selectAge3 != null) {
      ageArr = [selectAge1.value, selectAge2.value, selectAge3.value]
    }

    item.value.childrenAge = ageArr;

    if (this.submitted) {
      var rooms = this.hotelSearchForm.value.rooms;
      var j = 0;
      var isvalid = true;
        rooms.forEach(z => {
        if(z.numberOfChildren >0 ){
        if(Array.isArray(z.childrenAge))
        var childrenAgeArray = z.childrenAge;
        else
        var childrenAgeArray = z.childrenAge.split(',');

        let loopvalid=0;
        for(let i=0;i<(childrenAgeArray.length);i++){
        if(childrenAgeArray[i] < 1) loopvalid++;
        }

        if(childrenAgeArray.length > 0 && z.numberOfChildren  == childrenAgeArray.length && loopvalid == 0 ){
        var id = document.getElementById("error_" + j)
        id.hidden = true;
        isvalid = true;
        }else{
        var id = document.getElementById("error_" + j)
        id.hidden = false;
        isvalid = false;
        }
        j++;
        }
        });
      if (!isvalid) {
        var id1 = document.getElementById("error_AllAge")
        id1.hidden = false;
      }
      else {
        var id1 = document.getElementById("error_AllAge")
        id1.hidden = true;
      }
    }
  

  }





  ngAfterViewInit(): void {
    fromEvent(this.citySearchRef.nativeElement, 'input').pipe(
      debounceTime(300),
      map((e: any) => this.searchEvent = e.target.value),
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

  searchHotel() {
    this.submitted = true;
    var rooms = this.hotelSearchForm.value.rooms;
    var i = 0;
    var isvalid = true;
    rooms.forEach(z => {
    if(z.numberOfChildren >0 ){
    if(Array.isArray(z.childrenAge))
     var childrenAgeArray = z.childrenAge;
    else
    var childrenAgeArray = z.childrenAge.split(',');

        let loopvalid=0;
        for(let i=0;i<(childrenAgeArray.length);i++){
        if(childrenAgeArray[i] < 1) loopvalid++;
        }

     if(childrenAgeArray.length > 0 && z.numberOfChildren  == childrenAgeArray.length && loopvalid == 0 ){
         var id = document.getElementById("error_" + i)
        id.hidden = true;
         isvalid = true;
     }else{
        var id = document.getElementById("error_" + i)
        id.hidden = false;
        isvalid = false;
     }
    
      }else{
      this.hotelSearchForm.value.rooms[i]['childrenAge']='';
      }
        i++;
    });

    if (this.hotelSearchForm.invalid) {
      return
    } else if (!isvalid) {
      var id1 = document.getElementById("error_AllAge")
      id1.hidden = false;
      return
    }
    else {
      var id1 = document.getElementById("error_AllAge")
      id1.hidden = true;
      this.hotelSearchForm.value.checkIn = moment(this.hotelSearchForm.value.checkIn).format('YYYY-MM-DD');
      this.hotelSearchForm.value.checkOut = moment(this.hotelSearchForm.value.checkOut).format('YYYY-MM-DD');
      this.hotelSearchForm.value.numberOfRooms = this.hotelSearchForm.value.rooms.length;
      this.hotelSearchForm.value.noOfRooms = this.hotelSearchForm.value.rooms.length;
      this.hotelSearchForm.value.totalGuest = this.totalAdultsCount + this.totalChildCount;
      
      localStorage.setItem(environment.hotelLastSearch, JSON.stringify(this.hotelSearchForm.value));
      let url = "hotel-list?" + decodeURIComponent(this.ConvertObjToQueryString(this.hotelSearchForm.value));
      this.hotelSearchCallBack(this.hotelSearchForm.value)
      this.router.navigateByUrl(url);
    }

  }

  onSelectMliteDate(event, field) {

    if (field == 'checkin') {
      this.hotelSearchForm['controls']['checkIn'].setValue(event);
             const d = new Date(event);
       d.setDate(d.getDate() + 1);
      var compare1 = new Date(d).getTime();
       var compare2 = new Date(this.hotelSearchForm.value.checkOut).getTime();
       this.minCheckoutDate = d;
  
      if (compare1 > compare2) {
        this.hotelSearchForm.value.checkOut = moment(this.minCheckoutDate).format('YYYY-MM-DD');
        this.hotelSearchForm['controls']['checkOut'].setValue(moment(this.minCheckoutDate).format('YYYY-MM-DD'));
      }
    } else {
      this.hotelSearchForm['controls']['checkOut'].setValue(moment(event).format('YYYY-MM-DD'));
    }


  }
  mliteChecout:boolean=false;
  closeCheckout(){
    $('#flight_arrival_mlite').modal('hide');
   this.mliteChecout=false;
  }
  
  
  openMliteDatePicker(field, rtype) {
    if (field == 'checkin') {
        this.mliteChecout=false;
      $('#flight_arrival_mlite').modal('hide');
      $('#flight_departure_mlite').modal('show');
    } else {
        this.mliteChecout=true;
     setTimeout(() => {
      $('#flight_arrival_mlite').modal('show');
      $('#flight_departure_mlite').modal('hide');
      }, 30);

    }

  }
}


