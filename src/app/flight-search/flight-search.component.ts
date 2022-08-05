import {
  AfterViewInit,
  Component,
  Directive,
  ElementRef,
  HostListener,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,Input, Output, EventEmitter

} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FlightService } from '../common/flight.service';
import { StyleManagerService } from 'src/app/shared/services/style-manager.service';
import { SimpleGlobal } from 'ng2-simple-global';
import {environment} from '../../environments/environment';
import { MatDatepicker } from '@angular/material/datepicker'
import * as moment from 'moment';
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
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],

})


export class FlightSearchComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('toCityInput') toCityInput!: ElementRef;
  @ViewChild('fromCityInput') fromCityInput!:ElementRef;
  @ViewChild('toCityDiv') toCityDiv!:ElementRef;
 @ViewChild('picker') datePicker: MatDatepicker<Date>;
 @Input() modifySearch;
 @Input() isViewPartner: string;
 displayPartners:boolean = false;
   cdnUrl: any;
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
  isShowPartner = false;

  constructor(
    public _styleManager: StyleManagerService,
      public router: Router,
      private _fb: FormBuilder,
      private _flightService: FlightService,private ngZone:NgZone,private sg: SimpleGlobal

    ) {
      this.cdnUrl = environment.cdnUrl+this.sg['assetPath'];
      window.onresize = (e) =>
      {
          //ngZone.run will help to run change detection
          this.ngZone.run(() => {
            this.isMobile = window.innerWidth < 991 ?  true : false;
          });
      }
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
    fromCity: ['',[Validators.required]],
    toCity: ['',[Validators.required]],
    fromContry: ['',[Validators.required]],
    toContry: ['',[Validators.required]],
        fromAirportName: ['',[Validators.required]],
    toAirportName: ['',[Validators.required]],
    flightclass: ['E'],
    flightdefault: [],
    departure:['',[Validators.required]],
    arrival: ['',],
    adults: ['1',[Validators.required]],
    child: ['0'],
    infants: ['0'],
    travel: ['',[Validators.required]]
  });
  public Error = (controlName: string, errorName: string) => {
    return this.flightData.controls[controlName].hasError(errorName);
  };
  ngOnInit(): void {
console.log(this.isViewPartner)
   this._flightService.showHeader(true);
   this.displayPartners = this.isViewPartner=="false" ? false : true;
    this.isMobile = window.innerWidth < 991 ?  true : false;
    // this.selectDate('DepartureDate');
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
    this.SearchCityName = evt.target.value.trim().toLowerCase();
    this.getCityList(evt.target.value.trim().toLowerCase());

  }

  toList(evt: any) {
    this.fromFlightList = false;
    this.toFlightList = true;
    this.SearchCityName = evt.target.value.trim().toLowerCase();
    this.getCityList(evt.target.value.trim().toLowerCase());
  }

  selectFromFlightList(para1: any) {
        this.flightData.get('flightfrom').setValue(para1.id);
        this.flightData.get('fromCity').setValue(para1.city);
        this.flightData.get('fromContry').setValue(para1.country_code);
        this.flightData.get('fromAirportName').setValue(para1.airport_name);

        this.fromAirpotName = para1.airport_name;
        this.fromCityName = para1.city;

        this.fromFlightList = false;
        let removeClassToCity = document.getElementById('removeClassToCity');
        removeClassToCity?.classList.remove('flight-from-hide');
        setTimeout(() => {
        let toCityDivElement:any=document.getElementById("toCityDiv");
        toCityDivElement?.click();
        this.toCityInput.nativeElement.focus();
        }, 50);

  }

  selectToFlightList(para2: any) {
        this.flightData.get('flightto').setValue(para2.id);
        this.flightData.get('toCity').setValue(para2.city);
        this.flightData.get('toContry').setValue(para2.country_code);
        this.flightData.get('toAirportName').setValue(para2.airport_name);
        this.toAirpotName = para2.airport_name;
        this.toCityName = para2.city;
        this.toFlightList = false;
        this.datePicker.open();
  }

  adultsVal:any
  childVal:any
  infantsVal:any

  setSearchFilterData() {
   let lastSearch:any=localStorage.getItem('lastSearch');
    if(lastSearch != null || lastSearch != undefined){
      lastSearch= JSON.parse(lastSearch);
        this.flightData.get('adults').setValue(lastSearch.adults);
        this.flightData.get('child').setValue(lastSearch.child);      
        this.flightData.get('flightclass').setValue(lastSearch.flightclass );
        this.flightData.get('flightdefault').setValue(lastSearch.flightdefault);
        this.flightData.get('flightfrom').setValue(lastSearch.flightfrom);
        this.flightData.get('flightto').setValue(lastSearch.flightto);
        this.flightData.get('fromAirportName').setValue(lastSearch.fromAirportName);
        this.flightData.get('fromCity').setValue(lastSearch.fromCity);

        this.flightData.get('fromContry').setValue(lastSearch.fromContry);
        this.flightData.get('infants').setValue(lastSearch.infants);
        this.flightData.get('toAirportName').setValue(lastSearch.toAirportName);
        this.flightData.get('toCity').setValue(lastSearch.toCity);
        this.flightData.get('toContry').setValue(lastSearch.toContry);
        this.flightData.get('travel').setValue(lastSearch.travel);

        this.fromCityName = lastSearch.fromCity;
        this.toCityName = lastSearch.toCity;

        this.fromAirpotName = lastSearch.fromAirportName;
        this.toAirpotName = lastSearch.toAirportName;

        /*
         if(lastSearch.departure)
        this.flightData.get('departure').setValue(moment(lastSearch.departure).format('YYYY-MM-DD'));

        if(lastSearch.arrival)
        this.flightData.get('arrival').setValue(moment(lastSearch.arrival).format('YYYY-MM-DD'));
        */



      //  this.flightData.value.departure=this.flightData.value.departure.getFullYear()+'-' +(this.flightData.value.departure.getMonth()+ 1)+'-' +this.flightData.value.departure.getDate();
       this.departureDate = new Date(lastSearch.departure);
       if(lastSearch.arrival != '' && lastSearch.arrival != undefined && lastSearch.arrival != null) {
        this.arrivalDate = new Date(lastSearch.arrival);
       }
      this.flightClassVal = lastSearch.flightclass;
      this.adultsVal = lastSearch.adults;
      this.childVal = lastSearch.child;
      this.infantsVal = lastSearch.infants;
      this.totalPassenger =parseInt(this.adultsVal) + parseInt(this.childVal) + parseInt(this.infantsVal);
      if(lastSearch.arrival != null && lastSearch.arrival != undefined && lastSearch.arrival != ""){
        this.navItemActive = "Round Trip"
      }

    }


  }

  flightSearchCallBack(param:any){
      let searchValueAllobj=param;
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
  }



  flightSearch() {
    this.submitted = true;
    this.selectedDate = this.flightData.value.departure;
    if(this.flightData.value.departure!="" && this.flightData.value.departure!=undefined){
      this.dateValidation=false;
     this.flightData.value.departure=this.flightData.value.departure.getFullYear()+'-' +(this.flightData.value.departure.getMonth()+ 1)+'-' +this.flightData.value.departure.getDate();
    }
    else{
      this.dateValidation=true;
    }
    if(this.flightData.value.arrival!="" && this.flightData.value.arrival!=undefined ){
       this.flightData.value.arrival=this.flightData.value.arrival.getFullYear()+'-' +(this.flightData.value.arrival.getMonth()+ 1)+'-' +this.flightData.value.arrival.getDate();
      this.flightData.get('flightdefault').setValue('R');
    }else{
    this.flightData.get('flightdefault').setValue('O');
    }
    
        if(this.flightData.value.fromContry=='IN' && this.flightData.value.toContry=='IN' ){
         this.flightData.get('travel').setValue('DOM');
        }else{
         this.flightData.get('travel').setValue('INT');
        }


    if(this.flightData.invalid || this.dateValidation==true){
      return
    }
    else {
      let searchValue = this.flightData.value;


      this.flightSearchCallBack(searchValue);

      localStorage.setItem('lastSearch',JSON.stringify(searchValue));

      searchValue.departure=moment(searchValue.departure).format('YYYY-MM-DD');

      if(searchValue.arrival)
       searchValue.arrival=moment(searchValue.arrival).format('YYYY-MM-DD');

        let url;
        if(this.flightData.value.fromContry=='IN' && this.flightData.value.toContry=='IN' ){
        if(this.flightData.value.arrival == null || this.flightData.value.arrival == undefined ||this.flightData.value.arrival == "") {
           url="flight-list?"+decodeURIComponent(this.ConvertObjToQueryString((searchValue)));
          this.router.navigateByUrl(url);
        }
        else{
           url="flight-roundtrip?"+decodeURIComponent(this.ConvertObjToQueryString((searchValue)));
          this.router.navigateByUrl(url);
        }
        }else{
           url="flight-int?"+decodeURIComponent(this.ConvertObjToQueryString((searchValue)));
          this.router.navigateByUrl(url);

       }




        // (error) => { console.log(error) });
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
    var FromData = {flightFrom: this.flightData.value.flightfrom,fromAirpotName:this.flightData.value.fromAirportName,fromCityName: this.flightData.value.fromCity,fromContry : this.flightData.value.fromContry }

        this.flightData.get('flightfrom').setValue(this.flightData.value.flightto );
        this.flightData.get('fromCity').setValue(this.flightData.value.toCity);
        this.flightData.get('fromContry').setValue(this.flightData.value.toContry);
        this.flightData.get('fromAirportName').setValue(this.flightData.value.toAirportName);
        this.fromAirpotName = this.flightData.value.toAirportName ;
        this.fromCityName  = this.flightData.value.toCity ;
        this.flightData.get('flightto').setValue(FromData.flightFrom );
        this.flightData.get('toCity').setValue(FromData.fromCityName);
        this.flightData.get('toContry').setValue(FromData.fromContry);
        this.flightData.get('toAirportName').setValue(FromData.fromAirpotName);
        this.toAirpotName = FromData.fromAirpotName;
        this.toCityName = FromData.fromCityName;

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

  navBarLink(navItem:any){
    this.navItemActive = navItem;
    if(this.navItemActive == 'One Way'){
      this.arrivalDate = '';
    }
  }

  showPartner(){
    this.isShowPartner = true;
  }

  hidePartner(){
    this.isShowPartner = false;
  }


}
