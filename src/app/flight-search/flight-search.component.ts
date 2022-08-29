import {
  AfterViewInit,
  Component,
  Directive,
  ElementRef,
  HostListener,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild, Input, Output, EventEmitter,ChangeDetectorRef

} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FlightService } from '../common/flight.service';
import { StyleManagerService } from 'src/app/shared/services/style-manager.service';
import { SimpleGlobal } from 'ng2-simple-global';
import { environment } from '../../environments/environment';
import { MatDatepicker } from '@angular/material/datepicker';
import { ElasticsearchService } from 'src/app/shared/services/elasticsearch.service';
import { AppConfigService } from '../app-config.service';
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
  fromAirpotName: any = '';
  fromCityName: any = '';
  toCityName: any = '';
  multicityFromCityName:any = '';
  multicityToCityName:any = '';
  multicityFromAirpotName: any = "";
  multicityToAirpotName: any = '';
  toAirpotName: any = '';
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
  minDateR = new Date();
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
  multicityForm :FormGroup;
  multicityFormArr:FormArray;
  multicitySearchData:any=[];
  minDateArray:any = [];
  private lastKeypress = 0;
  private queryText = '';
  flightFromOptions: any[];
  flightToOptions: any[];
  defaultFlightOptions: any[];
  multicityLastSearch = localStorage.getItem('multicityLastSearch');
  searchFlightFromHeader: string = "Popular Searches";
  searchFlightToHeader: string = "Popular Searches";
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
  enableFlightServices:any;
   serviceSettings:any;
   isDisplayModifiedMulticity:boolean = false;
   isMulticity:boolean = false;
  constructor(private cd: ChangeDetectorRef,
    public _styleManager: StyleManagerService, private appConfigService:AppConfigService,
    public route: ActivatedRoute,
      public router: Router,
      private _fb: FormBuilder,
      private _flightService: FlightService,private ngZone:NgZone,private sg: SimpleGlobal,private es: ElasticsearchService

    ) {
      this.cdnUrl = environment.cdnUrl+this.sg['assetPath'];
       this.serviceSettings=this.appConfigService.getConfig();
        this.enableFlightServices= this.serviceSettings.poweredByPartners['flights'];
      window.onresize = (e) =>
      {
          //ngZone.run will help to run change detection
          this.ngZone.run(() => {
            this.isMobile = window.innerWidth < 991 ?  true : false;
          });
      }
      setTimeout(() => {
        this._styleManager.setScript('custom', `assets/js/custom.js`);
     }, 10);

     	this.defaultFlightOptions=[
	{"_source":{"city":"New Delhi","airport_code":"DEL","airport_name":"Indira Gandhi Airport","country_code":"IN","country":"India"}},
	{"_source":{"city":"Mumbai","airport_code":"BOM","airport_name":"Chatrapati Shivaji Airport","country_code":"IN","country":"India"}},
	{"_source":{"city":"Bangalore","airport_code":"BLR","airport_name":"Kempegowda International Airport","country_code":"IN","country":"India"}},
	{"_source":{"city":"Goa","airport_code":"GOI","airport_name":"Dabolim Airport","country_code":"IN","country":"India"}},
	{"_source":{"city":"Chennai","airport_code":"MAA","airport_name":"Chennai Airport","country_code":"IN","country":"India"}},
	{"_source":{"city":"Kolkata","airport_code":"CCU","airport_name":"Netaji Subhas Chandra Bose Airport","country_code":"IN","country":"India"}},
	{"_source":{"city":"Hyderabad","airport_code":"HYD","airport_name":"Hyderabad Airport","country_code":"IN","country":"India"}},
	];
     this.flightFromOptions= this.defaultFlightOptions;
	this.flightToOptions= this.defaultFlightOptions;

    this.multicityForm = this._fb.group({
      multicityFormArr: this._fb.array([this.multiCityArrAddItems()])
    });

    return;

  }
 ngAfterContentChecked() {
    this.cd.detectChanges();
     }
  public Error = (controlName: string, errorName: string) => {
    return this.flightData.controls[controlName].hasError(errorName);
  };

  public MulticityError = (controlName: string, errorName: string) => {
  //  debugger;
    return this.multicityForm.controls[controlName ].hasError(errorName);
  };

  ngOnInit(): void {
    this.route.url.subscribe(url => {
      this._flightService.showHeader(true);
      this.displayPartners = this.isViewPartner == "false" ? false : true;
      this.isMobile = window.innerWidth < 991 ? true : false;
      let continueSearchValLs: any = localStorage.getItem('continueSearch');
      if (continueSearchValLs != null) {
        this.continueSearchVal = JSON.parse(continueSearchValLs);
      }
      this.setSearchFilterData()
    });


  }

  currentPeriodClickedN(datePicker: any) {
    let date = datePicker.target.value
    this.minDateR=date;

  }
  currentPeriodClicked(datePicker: any, item,i) {
    let date = datePicker.target.value
    date = moment(date).format('YYYY-MM-DD')
    item.value.departure = date;
    this.multicityFormArr.controls[i].get('departure').setValue(item.value.departure)
    if(this.multicityFormArr.controls.length -1 > i){
      for(var j = i+1; j< this.multicityFormArr.controls.length;j++)
      {
        this.multicityFormArr.controls[j].get('departure').setValue('')
      }
    }
    this.multicityFormArr.controls[i].get('departure').setValue(item.value.departure)
    if(this.minDateArray.length -1 > i)
    {
      this.minDateArray[i+1] = new Date(date);
    }


    // this.multicityForm.get('departure'+ (item.multiCityArrCount - 1)).setValue(item.departure);
    this.minDateR=date;
  }
  currentMobilePeriodClicked(datePicker: any, item , i) {
    let date = datePicker;
    date = moment(date).format('YYYY-MM-DD')
    item.value.departure = date;
    this.multicityFormArr.controls[i].get('departure').setValue(item.value.departure)
     if(this.minDateArray.length -1 > i)
    {
      this.minDateArray[i+1] = new Date(date);
    }
    // this.multicityForm.get('departure'+ (item.multiCityArrCount - 1)).setValue(item.departure);

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


  searchAutoComplete($event, field, device, index: any) {
    let keycode = $event.which;
    if ($event.keyCode != 40 && $event.keyCode != 38) {
      if (true) {
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
                  this.onFromClick(res.hits.hits[0], device, index , null);

                } else {
                  this.searchFlightToHeader = 'Result';
                  this.flightToOptions = this.defaultFlightOptions;
                  this.onToClick(res.hits.hits[0], device, index ,null);

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
  onFromClick(values, device, index , i) {
   // debugger
    // this.fromCityInput.nativeElement.focus();
    if (index != undefined || index != null) {
      this.multicityFormArr.controls[i].get('flightfrom').setValue( values['_source'].airport_code)
      this.multicityFormArr.controls[i].get('fromCity').setValue(values['_source'].city)
      this.multicityFormArr.controls[i].get('fromContry').setValue(values['_source'].country_code)
      this.multicityFormArr.controls[i].get('fromAirportName').setValue(values['_source'].airport_name)
      index.value.fromCity=values['_source'].city;
      index.value.flightfrom = values['_source'].airport_code;
      index.value.fromContry = values['_source'].country_code;
      index.value.fromAirportName = values['_source'].airport_name;
      values = values['_source'];
      this.flightFromOptions = this.defaultFlightOptions;
      // this.fromAirpotName = values.airport_name;
      // this.fromCityName = values.city;
      setTimeout(() => {
        let toCityDivElement: any = document.getElementById("toCityDiv_" + i);
        toCityDivElement?.click();
        this.toCityInput.nativeElement.focus();
      }, 100);
    }
    else {
      values = values['_source'];
      this.flightData['controls']['fromCity'].setValue(values.city);
      this.flightData['controls']['flightfrom'].setValue(values.airport_code);
      this.flightData['controls']['fromContry'].setValue(values.country_code);
      this.flightData['controls']['fromAirportName'].setValue(values.airport_name);
      this.flightFromOptions = this.defaultFlightOptions;
      this.fromAirpotName = values.airport_name;
      this.fromCityName = values.city;
      setTimeout(() => {
        let toCityDivElement: any = document.getElementById("toCityDiv");
        toCityDivElement?.click();
        this.toCityInput.nativeElement.focus();

      }, 100);
    }
  }

  onToClick(values, device, index, i) {
   // debugger
    // this.toCityInput.nativeElement.focus();
    if (index != undefined || index != null) {
      this.multicityFormArr.controls[i].get('flightto').setValue(values['_source'].airport_code)
      this.multicityFormArr.controls[i].get('toCity').setValue(values['_source'].city)
      this.multicityFormArr.controls[i].get('toContry').setValue(values['_source'].country_code)
      this.multicityFormArr.controls[i].get('toAirportName').setValue(values['_source'].airport_name)
      index.value.toCity=values['_source'].city;
      index.value.flightto = values['_source'].airport_code;
      index.value.toContry = values['_source'].country_code;
      index.value.toAirportName = values['_source'].airport_name;
      if((this.multicityFormArr.controls.length-1) > i)
      {
        this.multicityFormArr.controls[i+1].get('flightfrom').setValue(values['_source'].airport_code)
        this.multicityFormArr.controls[i+1].get('fromCity').setValue(values['_source'].city)
        this.multicityFormArr.controls[i+1].get('fromContry').setValue(values['_source'].country_code)
        this.multicityFormArr.controls[i+1].get('fromAirportName').setValue(values['_source'].airport_name)
      }
      values = values['_source'];

      // this.toAirpotName = values.airport_name;
      // this.toCityName = values.city;
      setTimeout(() => {
        //let datePickerMulticity = document.getElementById('datePickerMulticity_' + i);
        //datePickerMulticity.click();
        $('.flight-to-data').addClass('flight-from-hide');
      }, 100);
    }
    else {
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

  openMulticityMliteDatePicker(index:number) {

      $('#flight_departure_mlite'+index).modal('show');

  }

  onSelectMliteDate(event, field) {

    if (field == 'departure') {
      this.departureDate = event;
      this.minDateFlightToMlite = event;
       this.minDateR = event;
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
    let lastSearch: any = localStorage.getItem('flightLastSearchNew');
      var multicity = localStorage.getItem('multicityLastSearch');
      var isMulticity =   localStorage.getItem('isMulticitySearch');
      if(multicity != null && multicity != ''  )
      {
        var data = JSON.parse(multicity);
        this.multicitySearchData = data;
        if(isMulticity!=undefined && isMulticity=='true'&& isMulticity!=null )
        {
          this.navItemActive = 'Multicity';
        }
        this.multicityForm = this._fb.group({
          multicityFormArr: this._fb.array([])
        })
        this.multicityFormArr = this.multicityForm.get('multicityFormArr') as FormArray;
        data.forEach((z)=>{
          this.multicityFormArr.push(this.multiCityArrAddItemsDefault(z));
          this.minDateArray.push(new Date(z.departure))
        });
        if(this.modifySearch)
        {
          this.isDisplayModifiedMulticity = true;
        }

      }
       if (lastSearch != null || lastSearch != undefined) {
        lastSearch = JSON.parse(lastSearch)
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
        this.departureDate = new Date(lastSearch.departure);
        this.minDateR=this.departureDate;
        this.flightData.get('departure').setValue(moment(this.departureDate).format('YYYY-MM-DD'));
        if (lastSearch.arrival != '' && lastSearch.arrival != undefined && lastSearch.arrival != null) {
          this.arrivalDate = new Date(lastSearch.arrival);
        }
        this.flightClassVal = lastSearch.flightclass;
        this.adultsVal = lastSearch.adults;
        this.childVal = lastSearch.child;
        this.infantsVal = lastSearch.infants;
        this.totalPassenger = parseInt(this.adultsVal) + parseInt(this.childVal) + parseInt(this.infantsVal);
        if (lastSearch.arrival != null && lastSearch.arrival != undefined && lastSearch.arrival != "" && isMulticity !='true') {
          this.navItemActive = "Round Trip"
        }
       }else{

        this.fromCityName='New Delhi';
        this.toCityName='Mumbai';
        this.fromAirpotName='Indira Gandhi Airport';
        this.toAirpotName='Chatrapati Shivaji Airport';

        this.flightData['controls']['fromCity'].setValue('New Delhi');
        this.flightData['controls']['toCity'].setValue('Mumbai');
        this.flightData['controls']['flightfrom'].setValue('DEL');
        this.flightData['controls']['flightto'].setValue('BOM');

        this.flightData['controls']['fromContry'].setValue('IN');
        this.flightData['controls']['fromAirportName'].setValue('Indira Gandhi Airport');
        this.flightData['controls']['toContry'].setValue('IN');
        this.flightData['controls']['toAirportName'].setValue('Chatrapati Shivaji Airport');


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


  sameCityValidation = false;
  flightSearch() {
    this.submitted = true;
    if (this.flightData.value.departure != "" && this.flightData.value.departure != undefined) {
      this.dateValidation = false;
    }
    else {
      this.dateValidation = true;
    }
    if (this.flightData.formCity != this.flightData.toCity) {
      this.sameCityValidation = false
    }
    else {
      this.sameCityValidation = true;
    }

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


      this.flightSearchCallBack(searchValue);

      localStorage.setItem('flightLastSearchNew',JSON.stringify(searchValue));
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

  ConvertObjToQueryStringMutlticity(obj: any) {
    var strUrl = "";
    for (var i = 0; i < obj.length; i++) {
      var str: any = [];
      let obj1: any = obj[i];
      for (var p in obj1) {
        if (obj1.hasOwnProperty(p)) {
          str.push(encodeURIComponent(p) + "[" + i + "]=" + encodeURIComponent(obj1[p]));
        }
      }
      strUrl = strUrl + "&" + str.join("&");
    }
    return strUrl

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
    if(this.flightData.value.infants >= this.flightData.value.adults){
        alert("Number of Infants cannot exceed the number of Adults.")
    }
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
            parseInt(this.flightData.value.infants) >
            parseInt(this.flightData.value.adults)
          ) {
            this.disableinfants = true;

          }
          else {
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
  callMutlicityFunc = true;
  navBarLink(navItem: any) {

    this.navItemActive = navItem;
    let datePickerArrival = document.getElementById('datePickerArrival');
    let datePickerOpen = document.getElementById('datePickerOpen');
    this.submitted = false;
    if(this.navItemActive == 'Round Trip'){

      this.minDateFlightToMlite=this.departureDate;
      this.flightData.controls["arrival"].setValidators(Validators.required);
      this.flightData.controls["arrival"].updateValueAndValidity();

   }else{
       this.arrivalDate = '';
       this.flightData.controls["arrival"].setValue('');
       this.flightData.controls["arrival"].clearValidators();
       this.flightData.controls["arrival"].updateValueAndValidity();
   }


    if (this.navItemActive == 'Multicity') {
      localStorage.setItem('isMulticitySearch','true');
      var multicity = localStorage.getItem('multicityLastSearch');
      if(multicity != null && multicity != ''  )
      {
        this.callMutlicityFunc = false;
      }
      datePickerOpen.classList.add('roundtrip-area-root-departure');
      datePickerArrival.style.display = 'none'
      if (this.callMutlicityFunc == true) {
        this.addMuticitySerchVal()
      }
      this.callMutlicityFunc = false;
    }
    else {
      localStorage.setItem('isMulticitySearch','false');
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
    this.addNewCitySearchInput();
  }

   multiCityArrAddItems() {
    var lengthofControls =0;
    var LastTocity = this.multicityFromCityName;
    var LastToAirportCode = '';
    var LastToAirportName = this.multicityFromAirpotName;
    var LastToCountryName = '';

    if(this.multicityFormArr)
    {
      lengthofControls = this.multicityFormArr.controls.length;
      LastToAirportCode = this.multicityFormArr.controls[lengthofControls - 1].get('flightto').value;

       LastTocity = LastToAirportCode == '' ? this.multicityFromCityName: this.multicityFormArr.controls[lengthofControls - 1].get('toCity').value;

       LastToAirportName = LastToAirportCode == '' ? this.multicityFromAirpotName : this.multicityFormArr.controls[lengthofControls - 1].get('toAirportName').value;
       LastToCountryName = LastToAirportCode == '' ? '' : this.multicityFormArr.controls[lengthofControls - 1].get('toContry').value;
       this.minDateArray.push(new Date(this.multicityFormArr.controls[lengthofControls - 1].get('departure').value));
    }
    else{
        this.minDateArray.push(this.minDate);
    }

     return this._fb.group({
      flightfrom:[LastToAirportCode,[Validators.required]],
      flightto:['',[Validators.required]],
        adults:[this.flightData.value.adults],
        child:[this.flightData.value.child],
        infants:[this.flightData.value.infants],
        channel:['Web'],
        travel:['DOM'],
        departure:['',[Validators.required]],
        fromCity:[LastTocity],
        toCity:[this.multicityToCityName],
        fromContry:[LastToCountryName],
        toContry:[],
        fromAirportName:[LastToAirportName],
        toAirportName:[this.multicityToAirpotName],
        flightclass:[this.flightData.value.flightclass],
        defaultType:['M'],
        sortBy:['asc'],
      }
      ,{
        validators: MustMatch('flightfrom', 'flightto')
    }
)
   }
   multiCityArrAddItemsDefault(obj:any) {
    return this._fb.group({
       flightfrom:[obj.flightfrom,[Validators.required]],
       flightto:[obj.flightto,[Validators.required]],
       adults:[obj.adults],
       child:[obj.child],
       infants:[obj.infants],
       channel:['Web'],
       travel:['DOM'],
       departure:[obj.departure,[Validators.required]],
       fromCity:[obj.fromCity],
       toCity:[obj.toCity],
       fromContry:[obj.fromContry],
       toContry:[obj.toContry],
       fromAirportName:[obj.fromAirportName],
       toAirportName:[obj.toAirportName],
       flightclass:[obj.flightclass],
       defaultType:['M'],
       sortBy:['asc'],
     }, {
      validators: MustMatch('flightfrom', 'flightto')
  })
  }

  addNewCitySearchInput() {
    this.multicityFormArr = this.multicityForm.get('multicityFormArr') as FormArray;
    this.multicityFormArr.push(this.multiCityArrAddItems());
  }

  removeMutlicityInput(index:number)  {
    this.multicityFormArr = this.multicityForm.get('multicityFormArr') as FormArray;
    this.multicityFormArr.removeAt(index)
  }

  searchMulticityFlight() {
   // debugger
    this.submitted = true;
    this.multicityFormArr = this.multicityForm.get('multicityFormArr') as FormArray
    if (this.multicityForm.invalid) {
      return
    }
    else {
      let url;
      this.multicityFormArr.value.forEach((z)=>{
        z.adults = this.flightData.value.adults;
        z.infants = this.flightData.value.infants;
        z.child = this.flightData.value.child;
        z.flightclass = this.flightData.value.flightclass;
      });
      let multicitySearchValue = JSON.stringify(this.multicityFormArr.value);
      localStorage.setItem('multicityLastSearch',multicitySearchValue)
      url = "flight-multicity?" + decodeURIComponent(this.ConvertObjToQueryStringMutlticity(this.multicityFormArr.value))
      this.router.navigateByUrl(url)
    }
  }

  FixedLengthDisplay(value: string) {
    if (this.isMobile) {
      if (value.length > 18) {
        var response = value.substring(0, 15) + "...";
        return response;
      }
      else {
        return value;
      }
    }
    else {
      return value;
    }

  }



  // Auto fill value in multicity
  // autoFillMutlicityVal() {
  //   debugger;
  //   this.multiCityArrayM[1].fromCity = this.multiCityArrayM[0].toCity;
  //   this.multiCityArrayM[1].flightfrom = this.multiCityArrayM[0].flightto;
  //   this.multiCityArrayM[1].fromAirportName = this.multiCityArrayM[0].toAirportName;
  //   this.multiCityArrayM[1].fromContry = this.multiCityArrayM[0].toContry;
  //   this.multicityForm.value.fromCity1 = this.multiCityArrayM[0].toCity;
  //   this.multicityForm.value.flightfrom1 = this.multiCityArrayM[0].flightto;
  //   this.multicityForm.value.fromAirportName1 = this.multiCityArrayM[0].toAirportName;
  //   this.multicityForm.value.fromContry1 = this.multiCityArrayM[0].toContry;

  //   if (this.multiCityArrayM[2] != null && this.multiCityArrayM[2] != "" && this.multiCityArrayM[2] != undefined) {
  //     this.multiCityArrayM[2].fromCity = this.multiCityArrayM[1].toCity;
  //     this.multiCityArrayM[2].flightfrom = this.multiCityArrayM[1].flightto;
  //     this.multiCityArrayM[2].fromAirportName = this.multiCityArrayM[1].toAirportName;
  //     this.multiCityArrayM[2].fromContry = this.multiCityArrayM[1].toContry;
  //     this.multicityForm.value.fromCity2 = this.multicityForm.value.toCity1;
  //     this.multicityForm.value.flightfrom2 = this.multicityForm.value.flightto1;
  //     this.multicityForm.value.fromAirportName2 = this.multicityForm.value.toAirportName1;
  //     this.multicityForm.value.fromContry2 = this.multicityForm.value.toContry1;
  //   }
  //   if (this.multiCityArrayM[3] != null && this.multiCityArrayM[3] != "" && this.multiCityArrayM[3] != undefined) {
  //     this.multiCityArrayM[3].fromCity = this.multiCityArrayM[2].toCity;
  //     this.multiCityArrayM[3].flightfrom = this.multiCityArrayM[2].flightto;
  //     this.multiCityArrayM[3].fromAirportName = this.multiCityArrayM[2].toAirportName;
  //     this.multiCityArrayM[3].fromContry = this.multiCityArrayM[2].toContry;
  //     this.multicityForm.fromCity3 = this.multicityForm.toCity2;
  //     this.multicityForm.flightfrom3 = this.multicityForm.flightto2;
  //     this.multicityForm.fromAirportName3 = this.multicityForm.toAirportName2;
  //     this.multicityForm.fromContry3 = this.multicityForm.toContry2;

  //   }
  //   if (this.multiCityArrayM[4] != null && this.multiCityArrayM[4] != "" && this.multiCityArrayM[4] != undefined) {
  //     this.multiCityArrayM[4].fromCity = this.multiCityArrayM[3].toCity;
  //     this.multiCityArrayM[4].flightfrom = this.multiCityArrayM[3].flightto;
  //     this.multiCityArrayM[4].fromAirportName = this.multiCityArrayM[3].toAirportName;
  //     this.multiCityArrayM[4].fromContry = this.multiCityArrayM[3].toContry;
  //     this.multicityForm.fromCity4 = this.multicityForm.toCity3;
  //     this.multicityForm.flightfrom4 = this.multicityForm.flightto3;
  //     this.multicityForm.fromAirportName4 = this.multicityForm.toAirportName3;
  //     this.multicityForm.fromContry4 = this.multicityForm.toContry3;
  //   }
  // }


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



