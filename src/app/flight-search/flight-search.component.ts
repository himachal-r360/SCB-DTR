import {
  AfterViewInit,
  Component,
  Directive,
  ElementRef,
  HostListener,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild, Input, Output, EventEmitter, ComponentFactoryResolver

} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FlightService } from '../common/flight.service';
import { StyleManagerService } from 'src/app/shared/services/style-manager.service';
import { SimpleGlobal } from 'ng2-simple-global';
import { environment } from '../../environments/environment';
import { MatDatepicker } from '@angular/material/datepicker';
import { ElasticsearchService } from 'src/app/shared/services/elasticsearch.service';
import * as moment from 'moment';
import { debug } from 'console';
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


export class FlightSearchComponent implements OnInit, OnDestroy {
  @ViewChild('toCityInput') toCityInput!: ElementRef;
  @ViewChild('fromCityInput') fromCityInput!: ElementRef;
  @ViewChild('toCityDiv') toCityDiv!: ElementRef;
  @ViewChild('picker') datePicker: MatDatepicker<Date>;
  @Input() modifySearch;
  @Input() isViewPartner: string;
  displayPartners: boolean = false;
  cdnUrl: any;
  sub?: Subscription;
  loader = false;
  show = false;
  newDate = new Date();
  cityList: any;
  flightList: any;
  fromFlightList = false;
  toFlightList = false;
  selectedDate?: any;
  // cityName:any;
  fromAirpotName: any = 'from airport';
  fromCityName: any = 'From';
  toCityName: any = 'To';
  toAirpotName: any = 'to airport';
  departureDate: any = "";
  arrivalDate: any = "";
  returnDate: any;
  oneWayDate: any;
  SearchCityName: any;
  continueSearchFlights: any = []
  submitted = false;
  // for passenger dropdown
  totalPassenger: number = 1;
  disableParent: boolean = false;
  disablechildren: boolean = false;
  disableinfants: boolean = false;
  dateValidation: boolean = false;
  continueSearchVal: any;
  minDate = new Date();
  isMobile: boolean = false;
  isClosed: boolean = true;
  isFromorNot: boolean = false;
  searchData: any;
  flightClassVal: any;
  showTravellerBlock = false;
  isDisabled = false;
  windowItem = window;
  navItemActive: any;
  isShowPartner = false;
  sameCity;
  multiCityArrCount = 1;
  multiCityArrMaxCount = 5;
  multiCityArrayM = [];
  multicityForm:any = this._fb.group({});

  private lastKeypress = 0;
  private queryText = '';
  flightFromOptions: any[];
  flightToOptions: any[];
  defaultFlightOptions: any[];
  searchFlightFromHeader: string = "Popular Cities";
  searchFlightToHeader: string = "Popular Cities";
  flightData: any = this._fb.group({
    flightfrom: ['', [Validators.required]],
    flightto: ['', [Validators.required]],
    fromCity: ['', [Validators.required]],
    toCity: ['', [Validators.required]],
    fromContry: ['', [Validators.required]],
    toContry: ['', [Validators.required]],
    fromAirportName: ['', [Validators.required]],
    toAirportName: ['', [Validators.required]],
    flightclass: ['E'],
    flightdefault: [],
    departure: ['', [Validators.required]],
    arrival: ['',],
    adults: ['1', [Validators.required]],
    child: ['0'],
    infants: ['0'],
    mobFromAddress: [''],
    mobToAddress: [''],
    travel: ['', [Validators.required]]
  }, {
    validators: MustMatch('flightfrom', 'flightto')
  });
  constructor(
    public _styleManager: StyleManagerService,
    public route: ActivatedRoute,
    public router: Router,
    private _fb: FormBuilder,
    private _flightService: FlightService, private ngZone: NgZone, private sg: SimpleGlobal, private es: ElasticsearchService

  ) {
    this.cdnUrl = environment.cdnUrl + this.sg['assetPath'];
    window.onresize = (e) => {
      //ngZone.run will help to run change detection
      this.ngZone.run(() => {
        this.isMobile = window.innerWidth < 991 ? true : false;
      });
    }
    setTimeout(() => {
      this._styleManager.setScript('custom', `assets/js/custom.js`);
    }, 10);

    this.defaultFlightOptions = [
      { "_source": { "city": "New Delhi", "airport_code": "DEL", "airport_name": "Indira Gandhi Airport", "country_code": "IN" } },
      { "_source": { "city": "Mumbai", "airport_code": "BOM", "airport_name": "Chatrapati Shivaji Airport", "country_code": "IN" } },
      { "_source": { "city": "Bangalore", "airport_code": "BLR", "airport_name": "Kempegowda International Airport", "country_code": "IN" } },
      { "_source": { "city": "Goa", "airport_code": "GOI", "airport_name": "Dabolim Airport", "country_code": "IN" } },
      { "_source": { "city": "Chennai", "airport_code": "MAA", "airport_name": "Chennai Airport", "country_code": "IN" } },
      { "_source": { "city": "Kolkata", "airport_code": "CCU", "airport_name": "Netaji Subhas Chandra Bose Airport", "country_code": "IN" } },
      { "_source": { "city": "Hyderabad", "airport_code": "HYD", "airport_name": "Hyderabad Airport", "country_code": "IN" } },
    ];
    this.flightFromOptions = this.defaultFlightOptions;
    this.flightToOptions = this.defaultFlightOptions;


  }

  public Error = (controlName: string, errorName: string) => {
    return this.flightData.controls[controlName].hasError(errorName);
  };
  ngOnInit(): void {
    this.route.url.subscribe(url => {
      this._flightService.showHeader(true);
      this.displayPartners = this.isViewPartner == "false" ? false : true;
      this.isMobile = window.innerWidth < 991 ? true : false;
      // this.selectDate('DepartureDate');
      let continueSearchValLs: any = localStorage.getItem('continueSearch');
      if (continueSearchValLs != null) {
        this.continueSearchVal = JSON.parse(continueSearchValLs);
      }
      this.setSearchFilterData()
    });
  }


  currentPeriodClicked(datePicker: any , item) {
    let date = datePicker.target.value
    console.log(item, "date");
    item.depart=date;
    /*
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
    */
  }

  currentPeriodArrivalClicked(datePicker: any) {
    /*let date = datePicker.target.value
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
    }*/
  }


  searchAutoComplete($event, field, device, index:any) {
    console.log(index);
    console.log(field);
    
    let keycode = $event.which;
    if ($event.keyCode != 40 && $event.keyCode != 38) {
      if ($event.timeStamp - this.lastKeypress > 0) {
        this.queryText = $event.target.value;
        if (this.queryText && this.queryText.length > 0) {

          let searchParam = {
            searchDisplayForm: 'flights',
            queryText: this.queryText
          };

          this.es.esSearch(searchParam).subscribe(res => {
            //On Enter Key Pressed
            if (keycode == 13) {
              if (res.hits.total > 0) {
                if (field == 'fromCity') {
                  this.searchFlightFromHeader = 'Result';
                  this.flightFromOptions = this.defaultFlightOptions;
                  this.onFromClick(res.hits.hits[0], device,index);
                } else {
                  this.searchFlightToHeader = 'Result';
                  this.flightToOptions = this.defaultFlightOptions;
                  this.onToClick(res.hits.hits[0], device,index);
                }

              }
            }

            if (field == 'fromCity') {
              this.searchFlightFromHeader = 'Result';
              this.flightFromOptions = res.hits.hits;
            } else {
              this.searchFlightToHeader = 'Result';
              this.flightToOptions = res.hits.hits;
            }

          });


        } else {

          if (field == 'fromCity') {
            this.flightFromOptions = this.defaultFlightOptions;
            this.searchFlightFromHeader = 'Popular Cities';
          } else {
            this.flightToOptions = this.defaultFlightOptions;
            this.searchFlightToHeader = 'Popular Cities';
          }

        }
      }
    }
  }
  onFromClick(values, device, index) {
    if (index != undefined || index != null) {
      values = values['_source'];
      this.multiCityArrayM[index-1]["fromCity"]=values.city;
      this.multiCityArrayM[index-1]["leavingFrom"]=values.airport_code;
      this.multiCityArrayM[index-1]["fromContry"]=values.country_code;
      this.multiCityArrayM[index-1]["fromAirportName"]=values.airport_name;
      // this.multicityForm['controls']['fromCity'+index].setValue(values.city);
      // this.multicityForm['controls']['leavingFrom'+index].setValue(values.airport_code);
      // this.multicityForm['controls']['fromContry'].setValue(values.country_code);
      // this.multicityForm['controls']['fromAirportName'].setValue(values.airport_name);
      this.flightFromOptions = this.defaultFlightOptions;
      this.fromAirpotName =  values.airport_name;
      this.fromCityName = values.city;
      setTimeout(() => {
        let toCityDivElement: any = document.getElementById("toCityDiv");
        toCityDivElement?.click();
        this.toCityInput.nativeElement.focus();
      }, 100);
    }
    else{
      values = values['_source'];
      this.flightData['controls']['fromCity'].setValue(values.city);
      this.flightData['controls']['flightfrom'].setValue(values.airport_code);
      this.flightData['controls']['fromContry'].setValue(values.country_code);
      this.flightData['controls']['fromAirportName'].setValue(values.airport_name);
      this.flightFromOptions = this.defaultFlightOptions;
      this.fromAirpotName = values.airport_name;
      this.fromCityName = values.city;
      console.log(this.fromAirpotName);
      
      setTimeout(() => {
        let toCityDivElement: any = document.getElementById("toCityDiv");
        toCityDivElement?.click();
        this.toCityInput.nativeElement.focus();
      }, 100);
    }
  }

  onToClick(values, device,index:any) {

    if (index != undefined || index != null) {
      values = values['_source'];
      this.multiCityArrayM[index-1]["toCity"]=values.city;  
      this.multiCityArrayM[index-1]["goingTo"]=values.airport_code;
      this.multiCityArrayM[index-1]["toContry"]=values.country_code;
      this.multiCityArrayM[index-1]["toAirportName"]=values.airport_name;
      // this.multicityForm['controls']['fromCity'+index].setValue(values.city);
      // this.multicityForm['controls']['leavingFrom'+index].setValue(values.airport_code);
      // this.multicityForm['controls']['fromContry'].setValue(values.country_code);
      // this.multicityForm['controls']['fromAirportName'].setValue(values.airport_name);
      this.toAirpotName =  values.airport_name;
      this.toCityName = values.city;
      setTimeout(() => {
        let toCityDivElement: any = document.getElementById("toCityDiv");
        toCityDivElement?.click();
        this.toCityInput.nativeElement.focus();
      }, 100);
     }
     else{
      values = values['_source'];
      this.flightData['controls']['toCity'].setValue(values.city);
      this.flightData['controls']['flightto'].setValue(values.airport_code);
      this.flightData['controls']['toContry'].setValue(values.country_code);
      this.flightData['controls']['toAirportName'].setValue(values.airport_name);
      this.toAirpotName = values.airport_name;
      this.toCityName = values.city;
      setTimeout(() => {
        this.datePicker.open();
        $('.flight-to-data').addClass('flight-from-hide');
      }, 100);
     }

  }
  minDateFlightToMlite = new Date();
  minDateMlite = new Date();
  openMliteDatePicker(field, rtype) {

    if (rtype == 1) {
      this.navItemActive = "Round Trip"
    }

    if (field == 'departure') {
      $('#flight_arrival_mlite').modal('hide');
      $('#flight_departure_mlite').modal('show');
    } else {
      $('#flight_arrival_mlite').modal('show');
      $('#flight_departure_mlite').modal('hide');
    }

  }

  onSelectMliteDate(event, field) {

    if (field == 'departure') {
      this.departureDate = event;
      this.minDateFlightToMlite = event;
      var compare1 = new Date(event).getTime();
      var compare2 = new Date(this.arrivalDate).getTime();
      if (compare1 > compare2) {
        this.arrivalDate = event;
        this.flightData['controls']['arrival'].setValue(event);
      }


    } else {
      this.arrivalDate = event;
    }


  }


  adultsVal: any
  childVal: any
  infantsVal: any
  flightFromInput: any;
  setSearchFilterData() {
    let lastSearch: any = localStorage.getItem('flightLastSearch');
    if (lastSearch != null || lastSearch != undefined) {
      lastSearch = JSON.parse(lastSearch);
      this.flightData.get('adults').setValue(lastSearch.adults);
      this.flightData.get('child').setValue(lastSearch.child);
      this.flightData.get('flightclass').setValue(lastSearch.flightclass);
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
      if (lastSearch.arrival != '' && lastSearch.arrival != undefined && lastSearch.arrival != null) {
        this.arrivalDate = new Date(lastSearch.arrival);
      }
      this.flightClassVal = lastSearch.flightclass;
      this.adultsVal = lastSearch.adults;
      this.childVal = lastSearch.child;
      this.infantsVal = lastSearch.infants;
      this.totalPassenger = parseInt(this.adultsVal) + parseInt(this.childVal) + parseInt(this.infantsVal);
      if (lastSearch.arrival != null && lastSearch.arrival != undefined && lastSearch.arrival != "") {
        this.navItemActive = "Round Trip"
      }

    }


  }

  flightSearchCallBack(param: any) {
    let searchValueAllobj = param;
    let continueSearch: any = localStorage.getItem('continueSearch');
    if (continueSearch == null) {
      this.continueSearchFlights = [];
    }
    if (continueSearch != null && continueSearch.length > 0) {
      this.continueSearchFlights = JSON.parse(continueSearch);
      this.continueSearchFlights = this.continueSearchFlights.filter((item: any) => {
        if (item.flightfrom != searchValueAllobj.flightfrom || item.flightto != searchValueAllobj.flightto) {
          return item;
        }
      })
    }
    if (this.continueSearchFlights.length > 3) {
      this.continueSearchFlights = this.continueSearchFlights.slice(0, 3);
    }
    this.continueSearchFlights.unshift(searchValueAllobj);// unshift/push - add an element to the beginning/end of an array
    localStorage.setItem('continueSearch', JSON.stringify(this.continueSearchFlights));
  }

  // Search flight
  sameCityValidation = false;
  flightSearch() {
    console.log(this.multiCityArrayM,"multiCityArrayM");
    this.submitted = true;
    if (this.flightData.value.departure != "" && this.flightData.value.departure != undefined) {
      this.dateValidation = false;
      this.flightData.value.departure = this.flightData.value.departure.getFullYear() + '-' + (this.flightData.value.departure.getMonth() + 1) + '-' + this.flightData.value.departure.getDate();
    }
    else {
      this.dateValidation = true;
    }
    // if (this.flightData.formCity != this.flightData.toCity) {
    //   this.sameCityValidation = false
    // }
    // else {
    //   this.sameCityValidation = true;

    // }

    if (this.flightData.value.arrival != "" && this.flightData.value.arrival != undefined) {
      this.flightData.value.arrival = this.flightData.value.arrival.getFullYear() + '-' + (this.flightData.value.arrival.getMonth() + 1) + '-' + this.flightData.value.arrival.getDate();
      this.flightData.get('flightdefault').setValue('R');
    } else {
      this.flightData.get('flightdefault').setValue('O');
    }

    if (this.flightData.value.fromContry == 'IN' && this.flightData.value.toContry == 'IN') {
      this.flightData.get('travel').setValue('DOM');
    } else {
      this.flightData.get('travel').setValue('INT');
    }

    if (this.flightData.invalid || this.dateValidation == true) {
      return
    }
    else {
      let searchValue = this.flightData.value;
      let searchMulticityValue = this.multiCityArrayM;
      console.log(searchMulticityValue , 'searchMulticityValue');
      
      this.flightSearchCallBack(searchValue);

      localStorage.setItem('flightLastSearch', JSON.stringify(searchValue));

      searchValue.departure = moment(searchValue.departure).format('YYYY-MM-DD');

      if (searchValue.arrival)
        searchValue.arrival = moment(searchValue.arrival).format('YYYY-MM-DD');

      let url;
      if (this.flightData.value.fromContry == 'IN' && this.flightData.value.toContry == 'IN') {
        if (this.flightData.value.arrival == null || this.flightData.value.arrival == undefined || this.flightData.value.arrival == "") {
          url = "flight-list?" + decodeURIComponent(this.ConvertObjToQueryString((searchValue)));
          this.router.navigateByUrl(url);
        }
        else {
          url = "flight-roundtrip?" + decodeURIComponent(this.ConvertObjToQueryString((searchValue)));
          this.router.navigateByUrl(url);
        }
      } else {
        url = "flight-int?" + decodeURIComponent(this.ConvertObjToQueryString((searchValue)));
        this.router.navigateByUrl(url);
      }
      if(this.navItemActive == "Multicity") {
        url = "flight-multicity?" + decodeURIComponent(this.ConvertObjToQueryStringMutlticity(searchMulticityValue))
        this.router.navigateByUrl(url)
      }
    }
  }

  ConvertObjToQueryString(obj: any) {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }

  ConvertObjToQueryStringMutlticity(obj1:any){
  var strUrl="";
  for(var i=0;i<this.multiCityArrayM.length;i++){
    var str:any = [];
    obj1=this.multiCityArrayM[i];
    for (var p in obj1){
      if (obj1.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "["+i+"]=" + encodeURIComponent(obj1[p]));
      }
    }
    
    return strUrl=strUrl+"&"+str.join("&");
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();

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

  swap() {
    var FromData = { flightFrom: this.flightData.value.flightfrom, fromAirpotName: this.flightData.value.fromAirportName, fromCityName: this.flightData.value.fromCity, fromContry: this.flightData.value.fromContry }
    this.flightData.get('flightfrom').setValue(this.flightData.value.flightto);
    this.flightData.get('fromCity').setValue(this.flightData.value.toCity);
    this.flightData.get('fromContry').setValue(this.flightData.value.toContry);
    this.flightData.get('fromAirportName').setValue(this.flightData.value.toAirportName);
    this.fromAirpotName = this.flightData.value.toAirportName;
    this.fromCityName = this.flightData.value.toCity;
    this.flightData.get('flightto').setValue(FromData.flightFrom);
    this.flightData.get('toCity').setValue(FromData.fromCityName);
    this.flightData.get('toContry').setValue(FromData.fromContry);
    this.flightData.get('toAirportName').setValue(FromData.fromAirpotName);
    this.toAirpotName = FromData.fromAirpotName;
    this.toCityName = FromData.fromCityName;


  }

  onClose() {
    // var element = document.querySelector('.flight-from-data')
    // element?.classList.add('form-hide');
  }

  onOpen() {
    if (this.isMobile) {
      var element = document.querySelector('.flight-from-data')
      element?.classList.remove('form-hide');
    }
  }

  openTravellerBlock() {
    this.showTravellerBlock = !this.showTravellerBlock;
  }

  closeTravllerBlock() {
    this.showTravellerBlock = !this.showTravellerBlock;
  }

  getClassVal(val: any) {
    this.flightData.value.flightclass = val;
  }

  // trip select navigation
  callMutlicityFunc = true;
  navBarLink(navItem: any) {
    this.navItemActive = navItem;
    let datePickerArrival = document.getElementById('datePickerArrival');
    let datePickerOpen = document.getElementById('datePickerOpen');
    if (this.navItemActive == 'One Way') {
      this.arrivalDate = '';
    }
    if (this.navItemActive == 'Multicity') {
      datePickerOpen.classList.add('roundtrip-area-root-departure');
      datePickerArrival.style.display = 'none'
      if(this.callMutlicityFunc == true) {
        this.addMuticitySerchVal()
      }
      this.callMutlicityFunc = false;
    }
    else {
      datePickerOpen.classList.remove('roundtrip-area-root-departure');
      datePickerArrival.style.display = ''
    }
  }

  showPartner() {
    this.isShowPartner = true;
  }

  hidePartner() {
    this.isShowPartner = false;
  }

  addMuticitySerchVal() {

      this.multiCityAdd();
      this.multiCityAdd();
    
  }
  multiCityAdd() {
    debugger;
    if ((this.multiCityArrayM.length) < (this.multiCityArrMaxCount)) {
      let multiCityObj={
        leavingFrom:'',
        goingTo:'',
        adults:this.flightData.value.adults,
        child:this.flightData.value.child,
        infants:this.flightData.value.infants,
        classType:this.flightData.value.flightclass,
        multiCityArrCount:this.multiCityArrCount,
        fromCity:this.fromCityName,
        fromAirportName:this.fromAirpotName,
        fromContry:this.multicityForm.fromContry,
        toContry:this.multicityForm.toContry,
        toCity:this.toCityName,
        toAirportName:this.toAirpotName,
        depart:this.multicityForm.value.depart,
        channel:'Web',
        travel:'DOM',
        defaultType:'M',
        
      }
      this.multiCityArrayM.push(multiCityObj);
      console.log(this.multiCityArrayM,"this.multiCityArrayM");
      var i = Number(this.multiCityArrCount);
      // let leavingFrom = this.multicityForm.leavingFrom;
      // let goingTo = this.multicityForm.goingTo;
      // let adults = this.flightData.value.adults;
      // let child = this.flightData.value.child;
      // let infants = this.flightData.value.infants;
      // let channel = 'Web' ;
      // let travel = 'DOM' ;
      // let depart = multiCityObj.depart;
      // let fromCity = this.multicityForm.fromCity;
      // let toCity = this.multicityForm.toCity;
      // let fromContry = this.multicityForm.fromContry;
      // let toContry = this.multicityForm.fromContry;
      // let fromAirportName = this.multicityForm.fromAirportName;
      // let toAirportName = this.multicityForm.toAirportName;
      // let classType = this.flightData.value.classType;
      // let defaultType = 'M';

      
      this.multicityForm.addControl('leavingFrom' + i, new FormControl(multiCityObj.leavingFrom, [Validators.required]));
      this.multicityForm.addControl('goingTo' + i, new FormControl(multiCityObj.goingTo, [Validators.required]));
      this.multicityForm.addControl('adults' + i, new FormControl(multiCityObj.adults));
      this.multicityForm.addControl('child' + i, new FormControl(multiCityObj.child));
      this.multicityForm.addControl('infants' + i, new FormControl(multiCityObj.infants));
      this.multicityForm.addControl('channel' + i, new FormControl(multiCityObj.channel));
      this.multicityForm.addControl('travel' + i, new FormControl(multiCityObj.travel));
      this.multicityForm.addControl('depart' + i, new FormControl(multiCityObj.depart, [Validators.required]));
      this.multicityForm.addControl('fromCity' + i, new FormControl(multiCityObj.fromCity));
      this.multicityForm.addControl('toCity' + i, new FormControl(multiCityObj.toCity));
      this.multicityForm.addControl('fromContry' + i, new FormControl(multiCityObj.fromContry));
      this.multicityForm.addControl('toContry' + i, new FormControl(multiCityObj.toContry));
      this.multicityForm.addControl('fromAirportName' + i, new FormControl(multiCityObj.fromAirportName));
      this.multicityForm.addControl('toAirportName' + i, new FormControl(multiCityObj.toAirportName));
      this.multicityForm.addControl('classType' + i, new FormControl(multiCityObj.classType));
      this.multicityForm.addControl('defaultType' + i, new FormControl(multiCityObj.defaultType));
      // this.multicityForm.value.depart = this.multicityForm.value.depart.getFullYear() + '-' + (this.multicityForm.value.depart.getMonth() + 1) + '-' + this.multicityForm.value.depart.getDate();
      console.log(this.multicityForm.value);
      // if (this.searchData.travel == 'INT') {
      //   this.passengerForm.addControl('adult_passport_num' + i, new FormControl('', [Validators.required]));
      //   this.passengerForm.addControl('adult_passport_expiry_date' + i, new FormControl('', [Validators.required]));
      //   this.passengerForm.addControl('adult_passport_issue_date' + i, new FormControl('', [Validators.required]));
      //   this.passengerForm.addControl('adult_passport_issuing_country' + i, new FormControl('', [Validators.required]));
      //   this.passengerForm.addControl('adult_pax_nationality' + i, new FormControl('', [Validators.required]));
      //   // this.passengerForm.addControl('adult_pax_birthcountry' + i, new FormControl('', [Validators.required]));
      //   // this.passengerForm.addControl('adult_dom_pax_nationality' + i, new FormControl('', [Validators.required]));


      //   this.passengerForm['controls']['adult_passport_num' + i].setValue(adult_passport);
      //   this.passengerForm['controls']['adult_passport_expiry_date' + i].setValue(adult_passport_expiry_date);
      //   this.passengerForm['controls']['adult_passport_issue_date' + i].setValue(adult_passport_issue_date);
      //   this.passengerForm['controls']['adult_passport_issuing_country' + i].setValue(adult_passport_issuing_country);
      //   this.passengerForm['controls']['adult_pax_nationality' + i].setValue(adult_pax_nationality);
      //   //this.passengerForm['controls']['adult_pax_birthcountry' + i].setValue(adult_pax_birthcountry);


      //   this.passengerForm.controls['adult_passport_num' + i].updateValueAndValidity();
      //   this.passengerForm.controls['adult_passport_expiry_date' + i].updateValueAndValidity();
      //   this.passengerForm.controls['adult_passport_issue_date' + i].updateValueAndValidity();
      //   this.passengerForm.controls['adult_passport_issuing_country' + i].updateValueAndValidity();
      //   this.passengerForm.controls['adult_pax_nationality' + i].updateValueAndValidity();
      //   // this.passengerForm.controls['adult_pax_birthcountry' + i].updateValueAndValidity();
      //   //  this.passengerForm.controls['adult_dom_pax_nationality' + i].updateValueAndValidity();
      // }




      // this.passengerForm.controls['passengerMobile'].setValidators([Validators.required, Validators.pattern("^[6-9][0-9]{9}$"), Validators.minLength(10)]);
      // this.passengerForm.controls['passengerEmail'].setValidators([Validators.required, Validators.pattern(this.emailPattern)]);
      // this.passengerForm.controls['passengerMobile'].updateValueAndValidity();
      // this.passengerForm.controls['passengerEmail'].updateValueAndValidity();



      this.multiCityArrCount++;


    }
  }

}
export function MustMatch(controlName: any, matchingControlName: any) {
  {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors['MustMatch']) {
        return;
      }
      else if (control.value == matchingControl.value) {
        matchingControl.setErrors({ MustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

}
