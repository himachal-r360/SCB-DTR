import { JsonpClientBackend } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  Directive,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,

} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FlightService } from '../common/flight.service';
import { StyleManagerService } from 'src/app/shared/services/style-manager.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { MulticityHomeComponent } from './multicity/multicity.component';

declare var $: any;
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],

})


export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('toCityInput') toCityInput!: ElementRef;
  @ViewChild('fromCityInput') fromCityInput!:ElementRef;
  @ViewChild('toCityDiv') toCityDiv!:ElementRef;
  @ViewChild(MulticityHomeComponent) MulticityHomeComponentchild!: MulticityHomeComponent;

  sub?: Subscription;
  loader = false;
  show = false;
  newDate = new Date();
  cityList: any;
  flightList: any;
  fromFlightList = false;
  toFlightList = false;
  selectedDate?:any;
  // cityName:any;
  fromFlightId:any;
  toFlightId:any;
  fromAirpotName:any ='from airport';
  fromCityName :any ='From';
  toCityName:any ='To';
  toAirpotName:any = 'to airport';
  departureDate:any = "";
  arrivalDate:any = "";
  returnDate:any;
  oneWayDate :any;
  SearchCityName:any;
  continueSearchFlights:any=[]
  submitted = false;
  // for passenger dropdown
  totalPassenger: number = 1;
  disableParent: boolean = false;
  disablechildren: boolean = false;
  disableinfants: boolean = false;
  dateValidation: boolean = false;
  continueSearchVal:any;
  fromContryName:any;
  toContryName:any;
  minDate = new Date();
  isMobile:boolean = false;
  isClosed:boolean = true;
  isFromorNot:boolean = false;
  searchData:any;
  flightClassVal:any;
  showTravellerBlock = false;
  isDisabled = false;
  windowItem = window;
  navItemActive:any;
  isShownMulticityTab: boolean = false ;
  isShownOneRoundway: boolean = true ;

  customOptions: OwlOptions = {
    loop: true,
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
        items: 1.2
      },
      400: {
        items: 1.2
      },
      740: {
        items: 1.2
      },
      940: {
        items: 1.2
      }
    },
    nav: false
  }


  constructor(
  public _styleManager: StyleManagerService,
    public router: Router,
    private _fb: FormBuilder,
    private _flightService: FlightService

  ) {

    setTimeout(() => {
      this._styleManager.setStyle('bootstrap-select', `assets/css/bootstrap-select.min.css`);
      this._styleManager.setStyle('daterangepicker', `assets/css/daterangepicker.css`);
      this._styleManager.setScript('bootstrap-select', `assets/js/bootstrap-select.min.js`);
      this._styleManager.setScript('custom', `assets/js/custom.js`);
   }, 10);

  }
  flightData: any = this._fb.group({
    flightfrom: ['',[Validators.required]],
    flightto: ['',[Validators.required]],
    flightclass: ['E'],
    flightdefault: ['O'],
    departure:[''],
    arrival: [''],
    adults: ['1'],
    child: ['0'],
    infants: ['0'],
    travel: ['DOM']
  });
  public Error = (controlName: string, errorName: string) => {
    return this.flightData.controls[controlName].hasError(errorName);
  };
  ngOnInit(): void {

   this._flightService.showHeader(true);

    this.isMobile = window.innerWidth < 991 ?  true : false;
    this.selectDate('DepartureDate');
    let continueSearchValLs:any= localStorage.getItem('continueSearch');
    if(continueSearchValLs!=null){
      this.continueSearchVal =JSON.parse(continueSearchValLs);
    }

    this.setSearchFilterData()

  }
  ngAfterViewInit(): void {

  }

  currentPeriodClicked(datePicker:any){
    let date = datePicker.target.value
    if(date && this.navItemActive !== "Round Trip"){
      setTimeout(() => {
        if(this.isMobile == false) {
          let openTravellers = document.getElementById('openTravellers')
          openTravellers?.click();
        }
        else if(this.isMobile)  {
          this.openTravellerBlock();
        }
      }, 50);
    }
    if(date && this.navItemActive == "Round Trip"){
      setTimeout(() => {
        if(this.isMobile == false) {
          let datePickerArrivalOpen=document.getElementById("datePickerArrival");
          datePickerArrivalOpen?.click();
        }
        else if(this.isMobile)  {
          this.openTravellerBlock();
        }
      }, 50);
    }

  }

  currentPeriodArrivalClicked(datePicker:any) {
    let date = datePicker.target.value
  if(date && this.navItemActive == "Round Trip"){
    setTimeout(() => {
      if(this.isMobile == false) {
        let openTravellers = document.getElementById('openTravellers')
        openTravellers?.click();
      }
      else if(this.isMobile)  {
        this.openTravellerBlock();
      }
    }, 50);
  }
}

  selectDate(control: string) {
    let dep;
    // $('#'+control).daterangepicker({
    //   format: "yyyy/mm/dd",
    //   startDate: new Date(),
    //   singleDatePicker: true,
    //   //  todayBtn: 1,
    //   autoclose: true,
    // })
    // .datepicker('setDate', dep).on('changeDate', (e: any) => {
    //   dep = this.flightData.value.departure;
    //   dep = e.format()
    //   this.selectDate = dep;
    //   // this.newDate = e.format()
    //   // dep = e.format()
    // });
    // const a = this;
    // $('#' + control).daterangepicker(
    //   {
    //     singleDatePicker: true,
    //     showDropdowns: false,
    //     format: 'yyyy/mm/dd',
    //     startDate: new Date(),
    //     //  todayBtn: 1,
    //     autoclose: true,
    //   },
    //   function (start: any, end: any, label: string) {

    //     a.departureDate = start._d;
    //     a.departureDate = start._d;
    //     a.flightData.value.departure = start._d
    //     a.dateValidation=false;

    //   }
    // );

    // $('.single-datepicker').datepicker({
    //     format: 'mm/dd/yyyy',
    //     startDate: '02/20/2018',
    // });
  }

  // convertDate(str:any) {
  //   var date = new Date(str),
  //     mnth = ("0" + (date.getMonth() + 1)).slice(-2),
  //     day = ("0" + date.getDate()).slice(-2);
  //   return [date.getFullYear(), mnth, day].join("-");
  // }
  getCityList(SearchCityName:string) {
    this.sub = this._flightService
      .getCityList(SearchCityName)
      .subscribe((res: any) => {
        this.cityList = res.hits.hits;

      });
  }

  fromList(evt: any) {
    this.toFlightList = false;
    this.fromFlightList = true;
    // this.SearchCityName = evt.target.value.trim().toLowerCase();
    // this.flightData.flightfrom=this.SearchCityName;
    this.SearchCityName = evt.target.value.trim().toLowerCase();

    // if(evt.target.value.trim().toLowerCase().length>3){
    //   //this.flightData.flightfrom=evt.target.value.trim().toLowerCase();
    //   this.getCityList(evt.target.value.trim().toLowerCase());
    // }
    this.getCityList(evt.target.value.trim().toLowerCase());
  }

  toList(evt: any) {
    this.fromFlightList = false;
    this.toFlightList = true;
    this.SearchCityName = evt.target.value.trim().toLowerCase();

    //this.flightData.flightto=this.SearchCityName;
    // if(evt.target.value.trim().toLowerCase().length>3){
    //   //this.flightData.flightfrom=evt.target.value.trim().toLowerCase();
    //   this.getCityList(evt.target.value.trim().toLowerCase());
    // }
    this.getCityList(evt.target.value.trim().toLowerCase());
  }

  selectFromFlightList(para1: any) {

    this.flightData.value.flightto = localStorage.getItem('toCityId');
    localStorage.setItem('fromCityId' ,para1.id);
    this.flightData.value.flightfrom = para1.id;
    this.fromFlightId = para1.id;
    this.fromAirpotName = para1.airport_name;
    this.fromCityName = para1.city;
    this.fromContryName = para1.country;
    localStorage.setItem('fromCity', this.fromCityName);
    this.fromFlightList = false;
    let removeClassToCity = document.getElementById('removeClassToCity');
    removeClassToCity?.classList.remove('flight-from-hide');
    // this.toFlightList = true;
    setTimeout(() => {
      // if(!this.isMobile)
      // {
        let toCityDivElement=document.getElementById("toCityDiv");
        toCityDivElement?.click();
        this.toCityInput.nativeElement.focus();
      // }
    }, 50);

  }

  selectToFlightList(para2: any) {
    this.flightData.value.flightfrom=localStorage.getItem('fromCityId');
    localStorage.setItem('toCityId' ,para2.id);
    this.flightData.value.flightto = para2.id;
    this.toFlightId = para2.id;
    // this.cityName = para2.city;
    this.toAirpotName = para2.airport_name;
    this.toCityName = para2.city;
    this.toContryName = para2.country;
    localStorage.setItem('toCity' ,this.toCityName);
    this.toFlightList = false;
    setTimeout(() => {
      let datePickerOpen=document.getElementById("datePickerOpen");
      datePickerOpen?.click();
    }, 50);
  }

  adultsVal:any
  childVal:any
  infantsVal:any
  flightTimingfrom:any;
  flightTimingto:any;

  setSearchFilterData() {
      this.searchData = sessionStorage.getItem('searchVal');
      if(this.searchData != null || this.searchData != undefined){
      let searchObj = JSON.parse(this.searchData);
      this.fromCityName = searchObj.fromCity;
      this.toCityName = searchObj.toCity;
      this.departureDate = new Date(searchObj.departure);
      this.arrivalDate = new Date(searchObj.arrival);
      this.flightClassVal = searchObj.flightclass;
      this.adultsVal = searchObj.adults;
      this.childVal = searchObj.child;
      this.infantsVal = searchObj.infants;
      this.fromAirpotName = searchObj.fromAirportName;
      this.toAirpotName = searchObj.toAirportName;
      this.flightTimingfrom = searchObj.flightfrom
      this.flightTimingto = searchObj.flightto
      this.fromFlightId = searchObj.flightfrom;
      this.toFlightId = searchObj.flightto;
      this.flightData.get('flightfrom').setValue(searchObj.flightfrom)
      this.flightData.get('flightto').setValue(searchObj.flightto)
      this.flightData.get('arrival').setValue(new Date(this.arrivalDate))
      this.flightData.get('departure').setValue(new Date(this.departureDate))
      this.flightData.get('flightclass').setValue(this.flightClassVal);
      this.flightData.get('adults').setValue(searchObj.adults);
      this.flightData.get('child').setValue(this.childVal);
      this.flightData.get('infants').setValue(this.infantsVal);
      this.flightData.value.infants = this.infantsVal;
      this.totalPassenger =parseInt(this.adultsVal) + parseInt(this.childVal) + parseInt(this.infantsVal);
    }

  }

  flightSearch() {
    debugger;
    this.submitted = true;
    this.flightData.value.flightto = this.toFlightId;
    this.flightData.value.flightfrom = this.fromFlightId;
    this.selectedDate = this.flightData.value.departure;
    if(this.flightData.value.departure!="" && this.flightData.value.departure!=undefined){
      this.dateValidation=false;
      this.flightData.value.departure=this.flightData.value.departure.getFullYear()+'-' +(this.flightData.value.departure.getMonth()+ 1)+'-' +this.flightData.value.departure.getDate();
    }
    else{
      this.dateValidation=true;
    }
    if(this.flightData.value.arrival!="" && this.flightData.value.arrival!=undefined && this.flightData.value.arrival!=null ){
      this.flightData.value.arrival=this.flightData.value.arrival.getFullYear()+'-' +(this.flightData.value.arrival.getMonth()+ 1)+'-' +this.flightData.value.arrival.getDate();
    }

    if(this.flightData.invalid || this.dateValidation==true){
      return
    }
    else {
      // this.loader = true;

      //this.flightData.get('departure').setValue(this.departureDate.getFullYear()+'-' +(this.departureDate.getMonth()+ 1)+'-' +this.departureDate.getDate())
      let searchValue = this.flightData.value;

      let otherSearchValueObj={'fromAirportName':this.fromAirpotName,'toAirportName': this.toAirpotName,'toCity' :this.toCityName,'fromCity': this.fromCityName ,'fromContry':this.fromContryName,'toContry':this.toContryName}

      let searchValueAllobj=Object.assign(searchValue,otherSearchValueObj);

      let continueSearch:any=localStorage.getItem('continueSearch');
      if(continueSearch==null){
        this.continueSearchFlights=[];
      }

      if(continueSearch!=null && continueSearch.length>0){
        this.continueSearchFlights=JSON.parse(continueSearch);
        this.continueSearchFlights=this.continueSearchFlights.filter((item:any)=>{
          if(item.flightfrom!=searchValueAllobj.flightfrom || item.flightto!=searchValueAllobj.flightto)
          {
              return item;
          }
        })
      }
      if(this.continueSearchFlights.length>3){
        this.continueSearchFlights=this.continueSearchFlights.slice(0,3);
      }
      this.continueSearchFlights.unshift(searchValueAllobj);// unshift/push - add an element to the beginning/end of an array

      localStorage.setItem('continueSearch',JSON.stringify(this.continueSearchFlights));
      sessionStorage.setItem('searchVal', JSON.stringify(searchValueAllobj));
      localStorage.setItem('fromAirportName', this.fromAirpotName);
      localStorage.setItem('toAirportName', this.toAirpotName);
      // this.sub = this._flightService.flightList(this.flightData.value).subscribe((res: any) => {
      //   this.show = true;
      //   this.flightList = res.response.onwardFlights;
      //   this.oneWayDate = res.responseDateTime;
      //   this._flightService.flightListData = this.flightList;
      //   this._flightService.flightListDate = this.oneWayDate;
        let query:any = sessionStorage.getItem('searchVal');
        if(this.flightData.value.arrival == null || this.flightData.value.arrival == undefined ||this.flightData.value.arrival == "") {
          let url="flight-list?"+decodeURIComponent(this.ConvertObjToQueryString(JSON.parse(query)));
          this.router.navigateByUrl(url);
        }
        else{
          let url="flight-roundtrip?"+decodeURIComponent(this.ConvertObjToQueryString(JSON.parse(query)));
          this.router.navigateByUrl(url);
        }
        //this.router.navigate(['flight-list'],  { queryParams: { flights : decodeURIComponent(this.ConvertObjToQueryString(JSON.parse(query)))}});


      // }, (error) => { console.log(error) });

    }
  }
  ConvertObjToQueryString(obj:any)
  {

    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }
  ngOnDestroy(): void {
    this.sub?.unsubscribe();

        this._styleManager.removeStyle('bootstrap-select');
        this._styleManager.removeStyle('daterangepicker');
        this._styleManager.removeScript('bootstrap-select');
        this._styleManager.removeScript('custom');
  }

  continueSearch(param:any){
    sessionStorage.setItem('searchVal', JSON.stringify(param));
    this.setSearchFilterData()
    if(param.arrival == "" || param.arrival == undefined || param.arrival == null ){
      let url="flight-list?"+decodeURIComponent(this.ConvertObjToQueryString(param));
      this.router.navigateByUrl(url);
    }
    else {
      let url="flight-roundtrip?"+decodeURIComponent(this.ConvertObjToQueryString(param));
      this.router.navigateByUrl(url);
    }
  }

  increaseAdult() {
    if (parseInt(this.flightData.value.adults) < 9) {
      this.flightData
        .get('adults')
        .setValue(parseInt(this.flightData.value.adults) + 1);
      this.totalPassenger =
        parseInt(this.flightData.value.adults) +
        parseInt(this.flightData.value.child) +
        parseInt(this.flightData.value.infants);
      if (this.totalPassenger == 9) {
        this.disableParent = true;
        this.disablechildren = true;
        this.disableinfants = true;
      }
    }
    //this.flightData.value.adults = parseInt(this.flightData.value.adults) + 1;
  }
  decreaseAdult() {
    if (parseInt(this.flightData.value.adults) > 1) {
      this.flightData
        .get('adults')
        .setValue(parseInt(this.flightData.value.adults) - 1);
      this.totalPassenger =
        parseInt(this.flightData.value.adults) +
        parseInt(this.flightData.value.child) +
        parseInt(this.flightData.value.infants);
      if (this.totalPassenger < 9) {
        this.disableParent = false;
        this.disablechildren = false;
        if (
          parseInt(this.flightData.value.infants) ==
          parseInt(this.flightData.value.adults)
        ) {
          this.disableinfants = true;
        } else {
          this.disableinfants = false;
        }
      }
    }

    //  this.flightData.value.adults = parseInt(this.flightData.value.adults) - 1;
  }
  increaseChild() {
    if (parseInt(this.flightData.value.child) < 9) {
      this.flightData
        .get('child')
        .setValue(parseInt(this.flightData.value.child) + 1);
      this.totalPassenger =
        parseInt(this.flightData.value.adults) +
        parseInt(this.flightData.value.child) +
        parseInt(this.flightData.value.infants);
      if (this.totalPassenger == 9) {
        this.disableParent = true;
        this.disablechildren = true;
        this.disableinfants = true;
      }
    }
  }
  decreaseChild() {
    if (parseInt(this.flightData.value.child) > 0) {
      this.flightData
        .get('child')
        .setValue(parseInt(this.flightData.value.child) - 1);
      this.totalPassenger =
        parseInt(this.flightData.value.adults) +
        parseInt(this.flightData.value.child) +
        parseInt(this.flightData.value.infants);
      if (this.totalPassenger < 9) {
        this.disableParent = false;
        this.disablechildren = false;
        if (
          parseInt(this.flightData.value.infants) ==
          parseInt(this.flightData.value.adults)
        ) {
          this.disableinfants = true;
        } else {
          this.disableinfants = false;
        }
      }
    }
  }
  increaseInfant() {
    if (
      parseInt(this.flightData.value.infants) <
      parseInt(this.flightData.value.adults)
    ) {
      if (parseInt(this.flightData.value.infants) < 9) {
        this.flightData
          .get('infants')
          .setValue(parseInt(this.flightData.value.infants) + 1);
        this.totalPassenger =
          parseInt(this.flightData.value.adults) +
          parseInt(this.flightData.value.child) +
          parseInt(this.flightData.value.infants);
        if (this.totalPassenger == 9) {
          this.disableParent = true;
          this.disablechildren = true;
          this.disableinfants = true;
        } else {
          if (
            parseInt(this.flightData.value.infants) ==
            parseInt(this.flightData.value.adults)
          ) {
            this.disableinfants = true;
          } else {
            this.disableinfants = false;
          }
        }
      }
    }
  }
  decreaseInfant() {
    if (parseInt(this.flightData.value.infants) > 0) {
      this.flightData
        .get('infants')
        .setValue(parseInt(this.flightData.value.infants) - 1);
      this.totalPassenger =
        parseInt(this.flightData.value.adults) +
        parseInt(this.flightData.value.child) +
        parseInt(this.flightData.value.infants);
      if (this.totalPassenger < 9) {
        this.disableParent = false;
        this.disablechildren = false;
        this.disableinfants = false;
      }
    }
  }

  swap()
  {
    var FromData = {flightFrom: this.flightData.value.flightfrom,fromAirpotName:this.fromAirpotName,fromCityName: this.fromCityName  }
    this.flightData.value.flightfrom = this.flightData.value.flightto ;
    this.fromAirpotName = this.toAirpotName;
    this.fromCityName  = this.toCityName;
    localStorage.setItem('fromCity', this.toCityName);
    this.flightData.value.flightto = FromData.flightFrom;
    // this.cityName = para2.city;
    this.toAirpotName = FromData.fromAirpotName;
    this.toCityName = FromData.fromCityName;
    localStorage.setItem('toCity' ,FromData.fromCityName);

  }

  onClose(){
    // var element = document.querySelector('.flight-from-data')
    // element?.classList.add('form-hide');
  }

  onOpen()
  {
    if(this.isMobile)
    {
      var element = document.querySelector('.flight-from-data')
      element?.classList.remove('form-hide');
    }
  }

openTravellerBlock(){
  this.showTravellerBlock =! this.showTravellerBlock;
}

closeTravllerBlock(){
  this.showTravellerBlock =! this.showTravellerBlock;

}

getClassVal(val:any){
  this.flightData.value.flightclass =  val;
}

navBarLink(navItem: any) {
  this.navItemActive = navItem;

  if (this.navItemActive == 'Multicity') {

      this.isShownMulticityTab = true;
      this.isShownOneRoundway = false;

  }  else {

      this.isShownMulticityTab = false;
      this.isShownOneRoundway = true;

  }

}


}
