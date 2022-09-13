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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { Router,ActivatedRoute } from '@angular/router';
import { FlightService } from '../../common/flight.service';
import { StyleManagerService } from 'src/app/shared/services/style-manager.service';
import { SimpleGlobal } from 'ng2-simple-global';
import {environment} from '../../../environments/environment';
import { MatDatepicker } from '@angular/material/datepicker';
import { ElasticsearchService } from 'src/app/shared/services/elasticsearch.service';
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
  selector: 'app-bus-search',
  templateUrl: './bus-search.component.html',
  styleUrls: ['./bus-search.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],

})


export class BusSearchComponent implements OnInit,  OnDestroy {
  @ViewChild('toCityInput') toCityInput!: ElementRef;
  @ViewChild('fromCityInput') fromCityInput!:ElementRef;
  @ViewChild('toCityDiv') toCityDiv!:ElementRef;
 @ViewChild('picker') datePicker: MatDatepicker<Date>;
   cdnUrl: any;
  fromCityName :any ='From city';
  toCityName:any ='To city';
  fromStateName:any='From city';
  toStateName:any='From city';
  departureDate:any = "";
  recentDepartureDate : any = "";
  continueSearchBuss:any=[];
  submitted = false;
   searchBusForm: FormGroup;
        dateValidation: boolean = false;
        continueSearchVal:any;
        minDate = new Date();
        isMobile:boolean = false;
        isClosed:boolean = true;
        isDisabled = false;
        windowItem = window;
        navItemActive:any;
        sameCity;
        private lastKeypress = 0;
        private queryText = '';
        travelFromOptions: any[];
        travelToOptions: any[];
        defaultTravelOptions: any[];
        searchTravelFromHeader:string="Popular Cities";
        searchTravelToHeader:string="Popular Cities";

  constructor(
    public _styleManager: StyleManagerService,
    public route: ActivatedRoute,
      public router: Router,
      private formBuilder: FormBuilder,
      private _busService: FlightService,private ngZone:NgZone,private sg: SimpleGlobal,private es: ElasticsearchService

    ) {
      this.cdnUrl = environment.cdnUrl+this.sg['assetPath'];
      
          //Bus Form
      this.searchBusForm = this.formBuilder.group({
        searchFrom: ['', Validators.required],
        searchTo: ['', Validators.required],
        fromTravelCode: ['', Validators.required],
        toTravelCode: ['', Validators.required],
        fromState: ['', Validators.required],
        toState: ['', Validators.required],
        departure: ['', Validators.required]
	}, {
       validators: MustMatch('fromTravelCode', 'toTravelCode')
     });
      
      
      window.onresize = (e) =>
      {
          this.ngZone.run(() => {
            this.isMobile = window.innerWidth < 991 ?  true : false;
          });
      }
      setTimeout(() => {
        this._styleManager.setScript('custom', `assets/js/custom.js`);
     }, 10);

 	this.defaultTravelOptions=[
	{"_source":{"stateId":"","name":"Bangalore","id":"3","state":"Karnataka"}},
	{"_source":{"stateId":"","name":"Chennai","id":"102","state":"Tamilnadu"}},
	{"_source":{"stateId":"","name":"Tirupathi","id":"1885","state":"Andhra Pradesh"}},
	{"_source":{"stateId":"","name":"Pune","id":"626","state":"Maharashtra"}},
	{"_source":{"stateId":"","name":"Mumbai","id":"649","state":"Maharashtra"}},
	{"_source":{"stateId":"","name":"Mangalore","id":"489","state":"Karnataka"}},
	{"_source":{"stateId":"","name":"Kolkata","id":"1308","state":"West Bengal"}},
	{"_source":{"stateId":"","name":"Hyderabad","id":"6","state":"Telangana"}},
	{"_source":{"stateId":"","name":"Goa","id":"615","state":"Goa"}},
	{"_source":{"stateId":"","name":"Delhi","id":"1492","state":"New Delhi"}}
	];
       this.travelFromOptions= this.defaultTravelOptions;
       this.travelToOptions= this.defaultTravelOptions;
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    }

  public Error = (controlName: string, errorName: string) => {
    return this.searchBusForm.controls[controlName].hasError(errorName);
  };
  ngOnInit(): void {
    //     this.route.url.subscribe(url =>{
   this._busService.showHeader(true);
    this.isMobile = window.innerWidth < 991 ?  true : false;
    let continueSearchValLs:any= localStorage.getItem('continueSearchBus');
    if(continueSearchValLs!=null){
      this.continueSearchVal =JSON.parse(continueSearchValLs);
    }
    this.setSearchFilterData()
  // });
  }


   searchAutoComplete($event,field,device) {
       let keycode = $event.which;
       if($event.keyCode==13){
	}else if ($event.keyCode != 40 && $event.keyCode != 38 ){
        if (true) {
        this.queryText = $event.target.value;
        if(this.queryText && this.queryText.length > 0){
        //Elastic Search
        let searchParam = {
        searchDisplayForm: 'bus',
        queryText: this.queryText
        };

        this.es.esSearch(searchParam).subscribe(res => {
        //On Enter Key Pressed
         if(keycode==13){
          if(res.hits.total > 0){
                if(field=='searchFrom'){
                 this.searchTravelFromHeader='Result';
                this.travelFromOptions = this.defaultTravelOptions;
                this.onFromClick(res.hits.hits[0],device);
                }else{
                  this.searchTravelToHeader='Result';
                this.travelToOptions = this.defaultTravelOptions;
                this.onToClick(res.hits.hits[0],device);
                }
      
          }
         }

        if(field=='searchFrom'){
          this.searchTravelFromHeader='Result';
        this.travelFromOptions=res.hits.hits;
        }else{
          this.searchTravelToHeader='Result';
        this.travelToOptions=res.hits.hits;
        }
        });
        }

       }else{
        if(field=='searchFrom'){
          this.searchTravelFromHeader='Popular Cities';
          this.travelFromOptions= this.defaultTravelOptions;
        }else{
          this.searchTravelToHeader='Popular Cities';
          this.travelToOptions= this.defaultTravelOptions;
        }
       
       }
      }
    }


  onFromClick(values,device) {
        values=values['_source'];
        this.searchBusForm['controls']['searchFrom'].setValue(values.name);
        this.searchBusForm['controls']['fromTravelCode'].setValue(values.id);
        this.searchBusForm['controls']['fromState'].setValue(values.state);
        this.fromCityName=values.name;
        this.fromStateName=values.state;
        this.travelFromOptions= this.defaultTravelOptions;
        
         setTimeout(() => {
        let toCityDivElement:any=document.getElementById("toCityDiv");
        toCityDivElement?.click();
        this.toCityInput.nativeElement.focus();
        }, 100);
  
  }

  onToClick(values,device) {
        values=values['_source'];
        this.searchBusForm['controls']['searchTo'].setValue(values.name);
        this.searchBusForm['controls']['toTravelCode'].setValue(values.id);
                       this.searchBusForm['controls']['toState'].setValue(values.state);
        this.toCityName=values.name;
        this.toStateName=values.state;
        this.travelToOptions= this.defaultTravelOptions;
        
     setTimeout(() => {
       // this.datePicker.open();
        $('.flight-to-data').addClass('flight-from-hide');
      }, 100);
  }
  
  
        minDateMlite =  new Date();
        openMliteDatePicker(field){
        $('#bus_departure_mlite').modal('show');
        }

        onSelectMliteDate(event,field){
        this.departureDate =event;
        }


  setSearchFilterData() {
   let lastSearch:any=localStorage.getItem('busLastSearchNew');
    if(lastSearch != null || lastSearch != undefined){
      lastSearch= JSON.parse(lastSearch);
        this.fromCityName=lastSearch.searchFrom;
        this.toCityName=lastSearch.searchTo; 
        this.fromStateName=lastSearch.fromState;
        this.toStateName=lastSearch.toState;
        this.searchBusForm['controls']['searchFrom'].setValue(lastSearch.searchFrom);
        this.searchBusForm['controls']['searchTo'].setValue(lastSearch.searchTo);
        this.searchBusForm['controls']['fromTravelCode'].setValue(lastSearch.fromTravelCode);
        this.searchBusForm['controls']['toTravelCode'].setValue(lastSearch.toTravelCode);
        this.searchBusForm['controls']['fromState'].setValue(lastSearch.fromState);
        this.searchBusForm['controls']['toState'].setValue(lastSearch.toState);

        this.recentDepartureDate = this.calculateDiff(new Date(lastSearch.departure));

        if(this.recentDepartureDate) { this.departureDate = new Date(lastSearch.departure); }

        this.searchBusForm.get('departure').setValue(moment(this.departureDate).format('YYYY-MM-DD'));
    }else{
        this.fromCityName='Delhi';
        this.toCityName='Mumbai';
        this.fromStateName='New Delhi';
        this.toStateName='Maharashtra';
        this.searchBusForm['controls']['searchFrom'].setValue('Delhi');
        this.searchBusForm['controls']['searchTo'].setValue('Mumbai');
        this.searchBusForm['controls']['fromTravelCode'].setValue(1492);
        this.searchBusForm['controls']['toTravelCode'].setValue(649);
        
        this.searchBusForm['controls']['fromState'].setValue('New Delhi');
        this.searchBusForm['controls']['toState'].setValue('Maharashtra');
    }
  }
  
  calculateDiff(dateSent){
    let currentDate = new Date();
    dateSent = new Date(dateSent);

    var diff = Math.floor((Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate()) - Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) ) /(1000 * 60 * 60 * 24));

    if(diff >= 0) { return true; } else { return false }

   }

  
  swap() {
      
        var FromData = {
        searchFrom: this.searchBusForm.value.searchFrom,
        fromTravelCode:this.searchBusForm.value.fromTravelCode,
        fromState : this.searchBusForm.value.fromState
        }
        

        this.searchBusForm.get('searchFrom').setValue(this.searchBusForm.value.searchTo );
        this.searchBusForm.get('fromTravelCode').setValue(this.searchBusForm.value.toTravelCode );
        this.searchBusForm.get('fromState').setValue(this.searchBusForm.value.toState );
       
        this.fromCityName = this.searchBusForm.value.searchTo;
        this.fromStateName = this.searchBusForm.value.toState;

        this.searchBusForm.get('searchTo').setValue(FromData.searchFrom );
        this.searchBusForm.get('toTravelCode').setValue(FromData.fromTravelCode );
        this.searchBusForm.get('toState').setValue(FromData.fromState );
     
        this.toCityName =  FromData.searchFrom;
        this.toStateName = FromData.fromState;

  }

  busSearchCallBack(param:any){
      let searchValueAllobj=param;
      let continueSearch:any=localStorage.getItem('continueSearchBus');
      if(continueSearch==null){
        this.continueSearchBuss=[];
      }
      if(continueSearch!=null && continueSearch.length>0){
        this.continueSearchBuss=JSON.parse(continueSearch);
        this.continueSearchBuss=this.continueSearchBuss.filter((item:any)=>{
          if(item.searchFrom!=searchValueAllobj.searchFrom || item.searchTo!=searchValueAllobj.searchTo)
          {
              return item;
          }
        })
      }
      if(this.continueSearchBuss.length>3){
        this.continueSearchBuss=this.continueSearchBuss.slice(0,3);
      }
      this.continueSearchBuss.unshift(searchValueAllobj);// unshift/push - add an element to the beginning/end of an array
      localStorage.setItem('continueSearchBus',JSON.stringify(this.continueSearchBuss));
  }


  sameCityValidation = false;
  busSearch() {
      this.submitted = true;

        if(this.searchBusForm.value.fromTravelCode!= this.searchBusForm.value.toTravelCode){
        this.sameCityValidation = false
        }
        else {
        this.sameCityValidation = true;
        }

      if (this.searchBusForm.invalid || this.sameCityValidation == true) {
      return
     } else {
      let searchValue = this.searchBusForm.value;
      this.busSearchCallBack(searchValue);
      localStorage.setItem('busLastSearchNew',JSON.stringify(searchValue));
      searchValue.departure = moment(searchValue.departure).format('YYYY-MM-DD');
      let url;
      url = "bus/search?" + decodeURIComponent(this.ConvertObjToQueryString((searchValue)));
      this.router.navigateByUrl(url);
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
    this._styleManager.removeScript('custom');
  }


  
  FixedLengthDisplay(value:string)
  {
    if(this.isMobile)
    {
      if(value.length > 18)
      {
          var response = value.substring(0, 15)+"...";
          return response;
      }
      else{
        return value;
      }
    }
    else{
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
