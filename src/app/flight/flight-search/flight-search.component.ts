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
import { FlightService } from '../../common/flight.service';
import { StyleManagerService } from 'src/app/shared/services/style-manager.service';
import { SimpleGlobal } from 'ng2-simple-global';
import { environment } from '../../../environments/environment';
import { MatDatepicker } from '@angular/material/datepicker';
import { ElasticsearchService } from 'src/app/shared/services/elasticsearch.service';
import { AppConfigService } from '../../app-config.service';
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
  @Input() showHorizontalSearch;


  displayPartners: boolean = false;
  cdnUrl: any;
  sub?: Subscription;
  loader = false;
  show = false;
  newDate = new Date();
  cityList: any;
  multiCityAddCount:number=3;
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
  fromCountryName:any = '';
  toCountryName:any = '';
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
  flightClassVal: any='E';
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
  startAt:any=[];
  mliteChecoutMulti:any=[];
  private lastKeypress = 0;
  public bannerImg:boolean=false;
  private queryText = '';
  flightFromOptions: any[];
  flightToOptions: any[];
  defaultFlightOptions: any[];
  multicityLastSearch = localStorage.getItem(environment.multicityLastSearch);
  searchFlightFromHeader: string = "Popular Searches";
  searchFlightToHeader: string = "Popular Searches";
  flightData: any = this._fb.group({
    flightfrom: ['', [Validators.required]],
    flightto: ['', [Validators.required]],
    fromCity: ['', [Validators.required]],
    toCity: ['', [Validators.required]],
    fromContry: ['', [Validators.required]],
    fromCountryFullName:[''],
    toCountryFullName:[''],
    toContry: ['', [Validators.required]],
    fromAirportName: ['', [Validators.required]],
    toAirportName: ['', [Validators.required]],
    flightclass: ['E'],
    flightdefault: ['O'],
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
        this.multiCityAddCount= this.serviceSettings.multiCityMaxCount;
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

     this.router.routeReuseStrategy.shouldReuseRoute = () => false;

  }
 ngAfterContentChecked() {
   // this.cd.detectChanges();
     }
  public Error = (controlName: string, errorName: string) => {
    return this.flightData.controls[controlName].hasError(errorName);
  };

  public MulticityError = (controlName: string, errorName: string) => {
  //  debugger;
    return this.multicityForm.controls[controlName ].hasError(errorName);
  };

  ngOnInit(): void {

        if(this.router.url){
        switch (this.router.url) {
        case ('/'+this.sg['domainPath']+'multicity'):
         this.navItemActive = 'Multicity';
        localStorage.setItem('isMulticitySearch','true');
        var multicity = localStorage.getItem(environment.multicityLastSearch);
        if(multicity != null && multicity != ''  )
        {
        this.callMutlicityFunc = false;
        }
        if (this.callMutlicityFunc == true) {
        this.addMuticitySerchVal()
        }
        this.callMutlicityFunc = false;

        break;

        }
     }
        this.mliteChecoutMulti[0]=false;
        this.mliteChecoutMulti[1]=false;
        this.mliteChecoutMulti[2]=false;
        this.mliteChecoutMulti[3]=false;
        this.mliteChecoutMulti[4]=false;

      this._flightService.showHeader(true);
      this.displayPartners = this.isViewPartner == "false" ? false : true;
      this.isMobile = window.innerWidth < 991 ? true : false;
      let continueSearchValLs: any = localStorage.getItem(environment.continueFlightSearch);
      if (continueSearchValLs != null) {
        this.continueSearchVal = JSON.parse(continueSearchValLs);
      }
      this.setSearchFilterData()


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
      this.startAt[i+1]== new Date(date);
      this.minDateArray[i+1] = new Date(date);
    }


    // this.multicityForm.get('departure'+ (item.multiCityArrCount - 1)).setValue(item.departure);
    this.minDateR=date;
  }
  currentMobilePeriodClicked(datePicker: any, item , i) {
  
    let date = datePicker;
    date = moment(date).format('YYYY-MM-DD')
    item.value.departure = date;
    this.startAt[i] = date;
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
     this.startAt[i+1]== new Date(date);
      this.minDateArray[i+1] = new Date(date);
    }


    // this.multicityForm.get('departure'+ (item.multiCityArrCount - 1)).setValue(item.departure);
    this.minDateR=date;
  

  }
  
  closeCheckoutMulticity(i){
    $('#flight_departure_mlite'+i).modal('hide');
    this.mliteChecoutMulti[i]=false;
  }
  
  currentPeriodArrivalClicked(datePicker: any) {

  }

  fromCitySelect(i:number){
   // debugger;
    setTimeout(() => {
      if(i != null ){
        $('.from-flight-open_' + i).addClass('flight-from-hide');
        $('#showFlightFrom_' + i).removeClass('flight-from-hide');
      }
      else{
        $('.flight-to-data').addClass('flight-from-hide');
        $('#showFlightFrom').removeClass('flight-from-hide');
      }
    }, 100);

  }

  searchAutoComplete($event, field, device, index: any) {
  // debugger
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
                if (field == 'fromCity'+index) {
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
   //debugger
    // this.fromCityInput.nativeElement.focus();
    if (index != undefined || index != null) {
      this.multicityFormArr.controls[i].get('flightfrom').setValue( values['_source'].airport_code)
      this.multicityFormArr.controls[i].get('fromCity').setValue(values['_source'].city)
      this.multicityFormArr.controls[i].get('fromContry').setValue(values['_source'].country_code)
      this.multicityFormArr.controls[i].get('fromAirportName').setValue(values['_source'].airport_name)
      this.multicityFormArr.controls[i].get('fromCountryFullName').setValue(values['_source'].country)
      index.value.fromCity=values['_source'].city;
      index.value.flightfrom = values['_source'].airport_code;
      index.value.fromContry = values['_source'].country_code;
      index.value.fromAirportName = values['_source'].airport_name;
      index.value.fromCountryFullName = values['_source'].country;
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
      this.flightData['controls']['fromCountryFullName'].setValue(values.country);
      this.flightFromOptions = this.defaultFlightOptions;
      this.fromAirpotName = values.airport_name;
      this.fromCityName = values.city;
      this.fromCountryName = values.country
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
      this.multicityFormArr.controls[i].get('toCountryFullName').setValue(values['_source'].country);
      index.value.toCity=values['_source'].city;
      index.value.flightto = values['_source'].airport_code;
      index.value.toContry = values['_source'].country_code;
      index.value.toAirportName = values['_source'].airport_name;
      index.value.toCountryFullName = values['_source'].country;

      if((this.multicityFormArr.controls.length-1) > i)
      {
        this.multicityFormArr.controls[i+1].get('flightfrom').setValue(values['_source'].airport_code)
        this.multicityFormArr.controls[i+1].get('fromCity').setValue(values['_source'].city)
        this.multicityFormArr.controls[i+1].get('fromContry').setValue(values['_source'].country_code)
        this.multicityFormArr.controls[i+1].get('fromAirportName').setValue(values['_source'].airport_name)
        this.multicityFormArr.controls[i+1].get('fromCountryFullName').setValue(values['_source'].country);
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
      this.flightData['controls']['toCountryFullName'].setValue(values.country);
      this.toAirpotName = values.airport_name;
      this.toCityName = values.city;
      this.toCountryName = values.country
      setTimeout(() => {
      //  this.datePicker.open();
        $('.flight-to-data').addClass('flight-from-hide');
      }, 100);
    }

  }
  minDateFlightToMlite = new Date();
  minDateMlite = new Date();
  openMliteDatePicker(field, rtype) {

    if (rtype == 1) {
        this.mliteChecout=false;
      this.navItemActive = "Round Trip"
        this.mliteChecout=true;
      
    }

    if (field == 'departure') {
            this.mliteChecout=false;
      $('#flight_arrival_mlite').modal('hide');
      $('#flight_departure_mlite').modal('show');
    } else {
        this.mliteChecout=true;
        
             setTimeout(() => {
       $('#flight_arrival_mlite').modal('show');
      }, 100);
    
      $('#flight_departure_mlite').modal('hide');
    }

  }
  
 
  openMulticityMliteDatePicker(index:number) {
   this.mliteChecoutMulti[index]=true;
   
     setTimeout(() => {
       $('#flight_departure_mlite'+index).modal('show');
      }, 100);
    

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

  focusInput(i,type){
    setTimeout(() => {
   if (!this.isMobile) {
   if(i==-1){
      if(type=='from'){
      // $('#fromCitySearch').select();
        $('#fromCitySearch').focus();
      }else {
      //$('#toCityMob').select();
       $('#toCityMob').focus();

      }
     }else{
     if(type=='from'){
      // $('.fromCitySearch'+i).select();
        $('.fromCitySearch'+i).focus();
      }else {
      //$('.toCitySearch'+i).select();
       $('.toCitySearch'+i).focus();

      }
     }
    }else{
       if(i==-1){
      if(type=='from'){
       //$('#fromCitySearch').select();
        $('#fromCitySearch').focus();
      }else {
      //$('#toCitySearch').select();
      $('#toCitySearch').focus();
      }
     }else{
       if(type=='from'){
       //$('.fromCitySearch'+i).select();
        $('.fromCitySearch'+i).focus();
      }else {
      //$('.toCity'+i').select();
      $('.toCity'+i).focus();
      }
     }

    }
    }, 10);
  }


  adultsVal: any=1;
  childVal : any=0;
  infantsVal:  any=0;
  flightFromInput: any;
  setSearchFilterData() {
    let lastSearch: any = localStorage.getItem(environment.flightLastSearch);
      var multicity = localStorage.getItem(environment.multicityLastSearch);
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
        var adaults = 1;
        var child = 0;
        var infants = 0;
        var Flightclass = 'E';
        this.multicityFormArr = this.multicityForm.get('multicityFormArr') as FormArray;
        var isOldDate = false;
        data.forEach((z)=>{
          if(new Date(z.departure).setHours(0,0,0,0) < (new Date()).setHours(0,0,0,0))
          {
            isOldDate = true;
          }
          if(isOldDate)
          {
            z.departure = '';
          }
          this.multicityFormArr.push(this.multiCityArrAddItemsDefault(z));
          adaults = z.adults;
          child = z.child;
          infants = z.infants;
          Flightclass= z.flightclass;
          this.minDateArray.push(new Date(z.departure))
        });
        this.flightClassVal = Flightclass;
        this.adultsVal = adaults;
        this.childVal = child;
        this.infantsVal = infants;
        this.totalPassenger = parseInt(this.adultsVal) + parseInt(this.childVal) + parseInt(this.infantsVal);
        this.flightData.value.infants = infants;
        this.flightData.value.child = child;
        this.flightData.value.adaults = adaults;
        this.flightData.value.flightclass = Flightclass;
        this.flightData.get('adults').setValue(adaults);
        this.flightData.get('child').setValue(child);
        this.flightData.get('infants').setValue(infants);
        this.flightData.get('flightclass').setValue(Flightclass);
        if(this.modifySearch)
        {
          this.isDisplayModifiedMulticity = true;
        }

      }
      
      //console.log(multicity);
      
       if(multicity == null   ){
      var multicity1:any=[];
      multicity1.push({"flightfrom":"DEL","flightto":"BOM","adults":"1","child":"0","infants":"0","channel":"Web","travel":"DOM","departure":"","fromCity":"New Delhi","toCity":"Mumbai","fromContry":"IN","toContry":"IN","fromCountryFullName":"India","toCountryFullName":"India","fromAirportName":"Indira Gandhi Airport","toAirportName":"Chatrapati Shivaji Airport","flightclass":"E","defaultType":"M","sortBy":"asc","isSelected":false,"selectedFlight":null});
      
      multicity1.push({"flightfrom":"BOM","flightto":"BLR","adults":"1","child":"0","infants":"0","channel":"Web","travel":"DOM","departure":"","fromCity":"Mumbai","toCity":"Bangalore","fromContry":"IN","toContry":"IN","fromCountryFullName":"India","toCountryFullName":"India","fromAirportName":"Chatrapati Shivaji Airport","toAirportName":"Kempegowda International Airport","flightclass":"E","defaultType":"M","sortBy":"asc","isSelected":false,"selectedFlight":null});
      multicity1.push({"flightfrom":"BLR","flightto":"MAA","adults":"1","child":"0","infants":"0","channel":"Web","travel":"DOM","departure":"","fromCity":"Bangalore","toCity":"Chennai","fromContry":"IN","toContry":"IN","fromCountryFullName":"India","toCountryFullName":"India","fromAirportName":"Kempegowda International Airport","toAirportName":"Chennai International Airport","flightclass":"E","defaultType":"M","sortBy":"asc","isSelected":false,"selectedFlight":null});
      
       var data1 =(multicity1);
       this.multicitySearchData = data1;
       
        this.multicityForm = this._fb.group({
          multicityFormArr: this._fb.array([])
        })
        var adaults = 1;
        var child = 0;
        var infants = 0;
        var Flightclass = 'E';
        this.multicityFormArr = this.multicityForm.get('multicityFormArr') as FormArray;
        var isOldDate = false;
        data1.forEach((z)=>{
          if(new Date(z.departure).setHours(0,0,0,0) < (new Date()).setHours(0,0,0,0))
          {
            isOldDate = true;
          }
          if(isOldDate)
          {
            z.departure = '';
          }
          
          this.multicityFormArr.push(this.multiCityArrAddItemsDefault(z));
          adaults = z.adults;
          child = z.child;
          infants = z.infants;
          Flightclass= z.flightclass;
          this.minDateArray.push(new Date(z.departure))
        });
        this.flightClassVal = Flightclass;
        this.adultsVal = adaults;
        this.childVal = child;
        this.infantsVal = infants;
        this.totalPassenger = parseInt(this.adultsVal) + parseInt(this.childVal) + parseInt(this.infantsVal);
        this.flightData.value.infants = infants;
        this.flightData.value.child = child;
        this.flightData.value.adaults = adaults;
        this.flightData.value.flightclass = Flightclass;
        this.flightData.get('adults').setValue(adaults);
        this.flightData.get('child').setValue(child);
        this.flightData.get('infants').setValue(infants);
        this.flightData.get('flightclass').setValue(Flightclass);
        if(this.modifySearch)
        {
          this.isDisplayModifiedMulticity = true;
        }

      
      }
       if (lastSearch != null || lastSearch != undefined) {
        lastSearch = JSON.parse(lastSearch)
        // this.flightData.get('adults').setValue(lastSearch.adults);
        // this.flightData.get('child').setValue(lastSearch.child);
        // this.flightData.get('flightclass').setValue(lastSearch.flightclass);
        this.flightData.get('flightdefault').setValue(lastSearch.flightdefault);
        this.flightData.get('flightfrom').setValue(lastSearch.flightfrom);
        this.flightData.get('flightto').setValue(lastSearch.flightto);
        this.flightData.get('fromAirportName').setValue(lastSearch.fromAirportName);
        this.flightData.get('fromCity').setValue(lastSearch.fromCity);
        this.flightData.get('fromContry').setValue(lastSearch.fromContry);
        //this.flightData.get('infants').setValue(lastSearch.infants);
        this.flightData.get('toAirportName').setValue(lastSearch.toAirportName);
        this.flightData.get('toCity').setValue(lastSearch.toCity);
        this.flightData.get('toContry').setValue(lastSearch.toContry);
        this.flightData.get('travel').setValue(lastSearch.travel);
        this.flightData.get('fromCountryFullName').setValue(lastSearch.fromCountryFullName);
        this.flightData.get('toCountryFullName').setValue(lastSearch.toCountryFullName);
        this.fromCityName = lastSearch.fromCity;
        this.toCityName = lastSearch.toCity;
        if(lastSearch.fromCountryFullName)
        this.fromCountryName = lastSearch.fromCountryFullName;
        else
         this.fromCountryName ='';
        if(lastSearch.toCountryFullName)
        this.toCountryName = lastSearch.toCountryFullName;
        else
        this.toCountryName ='';

        this.fromAirpotName = lastSearch.fromAirportName;
        this.toAirpotName = lastSearch.toAirportName;
        this.departureDate = new Date(lastSearch.departure);
        if (lastSearch.arrival != '' && lastSearch.arrival != undefined && lastSearch.arrival != null && lastSearch.arrival !='null') {
          this.arrivalDate = new Date(lastSearch.arrival);
        }
        if(this.departureDate < (new Date()).setHours(0,0,0,0))
        {
          this.departureDate = '';
          this.arrivalDate = '';
          this.minDate = new Date();
          this.minDateR = new Date();
        }
        else{
          this.minDateR=this.departureDate;
        }
        this.flightData.get('departure').setValue(moment(this.departureDate).format('YYYY-MM-DD'));
 if(isMulticity!='true')
 {
  this.flightData.get('adults').setValue(lastSearch.adults);
  this.flightData.get('child').setValue(lastSearch.child);
  this.flightData.get('flightclass').setValue(lastSearch.flightclass);
  this.flightData.get('infants').setValue(lastSearch.infants);
  this.flightClassVal = lastSearch.flightclass;
  this.adultsVal = lastSearch.adults;
  this.childVal = lastSearch.child;
  this.infantsVal = lastSearch.infants;
  this.totalPassenger = parseInt(this.adultsVal) + parseInt(this.childVal) + parseInt(this.infantsVal);
 }

        if (lastSearch.arrival != null && lastSearch.arrival != undefined && lastSearch.arrival != "" && isMulticity !='true') {
          this.navItemActive = "Round Trip"
          this.flightData.controls["arrival"].setValidators(Validators.required);
          this.flightData.controls["arrival"].updateValueAndValidity();
        }
       }else{

        this.fromCityName='New Delhi';
        this.toCityName='Mumbai';
        this.fromAirpotName='Indira Gandhi Airport';
        this.toAirpotName='Chatrapati Shivaji Airport';
        this.fromCountryName = 'India';
        this.toCountryName = 'India';
        this.flightData['controls']['fromCity'].setValue('New Delhi');
        this.flightData['controls']['toCity'].setValue('Mumbai');
        this.flightData['controls']['flightfrom'].setValue('DEL');
        this.flightData['controls']['flightto'].setValue('BOM');
        this.flightData['controls']['fromCountryFullName'].setValue('India');
        this.flightData['controls']['toCountryFullName'].setValue('India');
        this.flightData['controls']['fromContry'].setValue('IN');
        this.flightData['controls']['fromAirportName'].setValue('Indira Gandhi Airport');
        this.flightData['controls']['toContry'].setValue('IN');
        this.flightData['controls']['toAirportName'].setValue('Chatrapati Shivaji Airport');


        } 




  }

  flightSearchCallBack(param: any) {
    let searchValueAllobj = param;
    let continueSearch: any = localStorage.getItem(environment.continueFlightSearch);
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
    localStorage.setItem(environment.continueFlightSearch, JSON.stringify(this.continueSearchFlights));
  }


  sameCityValidation = false;
  flightSearch() {
   // debugger;
    this.submitted = true;
    
    
   // console.log(this.flightData.value);return;
    
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
    
    if(!this.flightData.value.flightclass){
    this.flightData.value.flightclas='E';
    }

    if (this.flightData.invalid || this.dateValidation == true) {
      return
    }
    else {
      if(this.isMobile)
      {
        this.flightData.get('flightclass').setValue(this.flightClassVal);
      }

      let searchValue = this.flightData.value;


      this.flightSearchCallBack(searchValue);

      localStorage.setItem(environment.flightLastSearch,JSON.stringify(searchValue));
      searchValue.departure = moment(searchValue.departure).format('YYYY-MM-DD');

      if (searchValue.arrival)
        searchValue.arrival = moment(searchValue.arrival).format('YYYY-MM-DD');

      let url;
      if (this.flightData.value.fromContry == 'IN' && this.flightData.value.toContry == 'IN') {
        if (this.flightData.value.arrival == null || this.flightData.value.arrival == undefined || this.flightData.value.arrival == "") {
          url = this.sg['domainPath']+"flight-list?" + decodeURIComponent(this.ConvertObjToQueryString((searchValue)));
          this.router.navigateByUrl(url);
        }
        else {
          url = this.sg['domainPath']+"flight-roundtrip?" + decodeURIComponent(this.ConvertObjToQueryString((searchValue)));
          this.router.navigateByUrl(url);
        }
      } else {
        url = this.sg['domainPath']+"flight-int?" + decodeURIComponent(this.ConvertObjToQueryString((searchValue)));
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
      else {
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
      this.adultsVal=this.flightData.value.adults;
      this.childVal=this.flightData.value.child;
      this.infantsVal=this.flightData.value.infants;

    }
    //this.flightData.value.adults = parseInt(this.flightData.value.adults) + 1;
  }
  decreaseAdult() {
    if (parseInt(this.flightData.value.adults) > 1) {
      if(parseInt(this.flightData.value.adults) <=parseInt(this.flightData.value.infants))
      {
        this.flightData
        .get('adults')
        .setValue(parseInt(this.flightData.value.adults) - 1);
        this.flightData
        .get('infants')
        .setValue(parseInt(this.flightData.value.infants) - 1);
      }
      else{
        this.flightData
        .get('adults')
        .setValue(parseInt(this.flightData.value.adults) - 1);
      }
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
            this.adultsVal=this.flightData.value.adults;
      this.childVal=this.flightData.value.child;
      this.infantsVal=this.flightData.value.infants;
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
            this.adultsVal=this.flightData.value.adults;
      this.childVal=this.flightData.value.child;
      this.infantsVal=this.flightData.value.infants;
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
            this.adultsVal=this.flightData.value.adults;
      this.childVal=this.flightData.value.child;
      this.infantsVal=this.flightData.value.infants;
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
      this.adultsVal=this.flightData.value.adults;
      this.childVal=this.flightData.value.child;
      this.infantsVal=this.flightData.value.infants;
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
          this.adultsVal=this.flightData.value.adults;
      this.childVal=this.flightData.value.child;
      this.infantsVal=this.flightData.value.infants;
  }
  mliteChecout:boolean=false;
  closeCheckout(){
    $('#flight_arrival_mlite').modal('hide');
   this.mliteChecout=false;
  }
  
  swap() {
    var FromData = { flightFrom: this.flightData.value.flightfrom, fromAirpotName: this.flightData.value.fromAirportName, fromCityName: this.flightData.value.fromCity, fromContry: this.flightData.value.fromContry,fromCountryFullName: this.flightData.value.fromCountryFullName }

    this.flightData.get('flightfrom').setValue(this.flightData.value.flightto);
    this.flightData.get('fromCity').setValue(this.flightData.value.toCity);
    this.flightData.get('fromContry').setValue(this.flightData.value.toContry);
     this.flightData.get('fromCountryFullName').setValue(this.flightData.value.toCountryFullName);

    this.flightData.get('fromAirportName').setValue(this.flightData.value.toAirportName);
    this.fromAirpotName = this.flightData.value.toAirportName;
    this.fromCityName = this.flightData.value.toCity;
    this.flightData.get('flightto').setValue(FromData.flightFrom);
    this.flightData.get('toCity').setValue(FromData.fromCityName);
    this.flightData.get('toContry').setValue(FromData.fromContry);
      this.flightData.get('toCountryFullName').setValue(FromData.fromCountryFullName);
    this.flightData.get('toAirportName').setValue(FromData.fromAirpotName);
    this.toAirpotName = FromData.fromAirpotName;
    this.toCityName = FromData.fromCityName;

  }
  swapMulticity(index:number)
  {
    var FromData = { flightFrom: this.multicityFormArr.controls[index].get('flightfrom').value, fromAirpotName: this.multicityFormArr.controls[index].get('fromAirportName').value, fromCityName: this.multicityFormArr.controls[index].get('fromCity').value, fromContry: this.multicityFormArr.controls[index].get('fromContry').value,fromCountryFullName: this.multicityFormArr.controls[index].get('fromCountryFullName').value}
    var ToData = { flightTo: this.multicityFormArr.controls[index].get('flightto').value, toAirpotName: this.multicityFormArr.controls[index].get('toAirportName').value, toCityName: this.multicityFormArr.controls[index].get('toCity').value, toContry: this.multicityFormArr.controls[index].get('toContry').value,toCountryFullName: this.multicityFormArr.controls[index].get('toCountryFullName').value}
  if(ToData.flightTo != null && ToData.flightTo != '')
  {
    this.multicityFormArr.controls[index].get('flightfrom').setValue( ToData.flightTo)
    this.multicityFormArr.controls[index].get('fromCity').setValue(ToData.toCityName)
    this.multicityFormArr.controls[index].get('fromContry').setValue(ToData.toContry)
    this.multicityFormArr.controls[index].get('fromAirportName').setValue(ToData.toAirpotName)
    this.multicityFormArr.controls[index].get('fromCountryFullName').setValue(ToData.toCountryFullName)

    this.multicityFormArr.controls[index].get('flightto').setValue(FromData.flightFrom)
    this.multicityFormArr.controls[index].get('toCity').setValue(FromData.fromCityName)
    this.multicityFormArr.controls[index].get('toContry').setValue(FromData.fromContry)
    this.multicityFormArr.controls[index].get('toAirportName').setValue(FromData.fromAirpotName)
    this.multicityFormArr.controls[index].get('toCountryFullName').setValue(FromData.fromCountryFullName);
  }

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
    this.flightData.get('flightclass').setValue(val);
    this.flightClassVal = val;
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
      var multicity = localStorage.getItem(environment.multicityLastSearch);
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
    var LastFromCountryFullName = '';
    var LastToCountryFullName = '';

    if(this.multicityFormArr)
    {
      lengthofControls = this.multicityFormArr.controls.length;
      LastToAirportCode = this.multicityFormArr.controls[lengthofControls - 1].get('flightto').value;

       LastTocity = LastToAirportCode == '' ? this.multicityFromCityName: this.multicityFormArr.controls[lengthofControls - 1].get('toCity').value;
       LastFromCountryFullName = LastToAirportCode== ''? this.multicityFromCityName: this.multicityFormArr.controls[lengthofControls - 1].get('toCountryFullName').value;
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
        fromCountryFullName:[LastFromCountryFullName],
        toCountryFullName:[],
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
       fromCountryFullName:[obj.fromCountryFullName],
       toCountryFullName:[obj.toCountryFullName],
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
    if(this.multicityFormArr['controls'].length > this.multiCityAddCount){
      this.multicityFormArr['controls'].pop();
    }

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
      localStorage.setItem(environment.multicityLastSearch,multicitySearchValue)
      url = this.sg['domainPath']+"flight-multicity?" + decodeURIComponent(this.ConvertObjToQueryStringMutlticity(this.multicityFormArr.value))
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



