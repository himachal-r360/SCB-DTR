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
import { Subscription } from 'rxjs';
import { BusService } from '../common/bus.service';
import { StyleManagerService } from 'src/app/shared/services/style-manager.service';
import { SimpleGlobal } from 'ng2-simple-global';
import {environment} from '../../environments/environment';
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
 @Input() modifySearch;
 @Input() isViewPartner: string;
   cdnUrl: any;
  sub?: Subscription;
  show = false;
  newDate = new Date();
  selectedDate?:any;
  // cityName:any;
  fromCityName :any ='From city';
  toCityName:any ='To city';
  departureDate:any = "";
  continueSearchBuss:any=[]
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
        busFromOptions: any[];
        busToOptions: any[];
        defaultBusOptions: any[];
        searchBusFromHeader:string="Popular Cities";
        searchBusToHeader:string="Popular Cities";
        
        
        

        

  constructor(
    public _styleManager: StyleManagerService,
    public route: ActivatedRoute,
      public router: Router,
      private formBuilder: FormBuilder,
      private _busService: BusService,private ngZone:NgZone,private sg: SimpleGlobal,private es: ElasticsearchService

    ) {
      this.cdnUrl = environment.cdnUrl+this.sg['assetPath'];
      
          //Bus Form
      this.searchBusForm = this.formBuilder.group({
        busFrom: ['', Validators.required],
        busTo: ['', Validators.required],
        fromBusCode: ['', Validators.required],
        toBusCode: ['', Validators.required],
        fromBusState: ['', Validators.required],
        toBusState: ['', Validators.required],
        busDeparture: ['', Validators.required]
	});
      
      
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

 	this.defaultBusOptions=[
	{"_source":{"stateId":"","name":"Bangalore","id":"3","state":"Bangalore"}},
	{"_source":{"stateId":"","name":"Chennai","id":"102","state":"Chennai"}},
	{"_source":{"stateId":"","name":"Tirupathi","id":"1885","state":"Tirupathi"}},
	{"_source":{"stateId":"","name":"Pune","id":"626","state":"Pune"}},
	{"_source":{"stateId":"","name":"Mumbai","id":"649","state":"Mumbai"}},
	{"_source":{"stateId":"","name":"Mangalore","id":"489","state":"Mangalore"}},
	{"_source":{"stateId":"","name":"Kolkata","id":"1308","state":"Kolkata"}},
	{"_source":{"stateId":"","name":"Hyderabad","id":"6","state":"Hyderabad"}},
	{"_source":{"stateId":"","name":"Goa","id":"615","state":"Goa"}},
	{"_source":{"stateId":"","name":"Delhi","id":"1492","state":"Delhi"}}
	];
     this.busFromOptions= this.defaultBusOptions;
	this.busToOptions= this.defaultBusOptions;


    }

  public Error = (controlName: string, errorName: string) => {
    return this.searchBusForm.controls[controlName].hasError(errorName);
  };
  ngOnInit(): void {
         this.route.url.subscribe(url =>{

   this._busService.showHeader(true);
    this.isMobile = window.innerWidth < 991 ?  true : false;
    // this.selectDate('DepartureDate');
    let continueSearchValLs:any= localStorage.getItem('continueSearch');
    if(continueSearchValLs!=null){
      this.continueSearchVal =JSON.parse(continueSearchValLs);
    }
    this.setSearchFilterData()
   });
  }


  currentPeriodClicked(datePicker:any){

  }

  currentPeriodArrivalClicked(datePicker:any) {

}


   searchAutoComplete($event,field,device) {
       let keycode = $event.which;
       if($event.keyCode==13){
	}else if ($event.keyCode != 40 && $event.keyCode != 38 ){
        if ($event.timeStamp - this.lastKeypress > 0) {
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
             
                if(field=='busFrom'){
                 this.searchBusFromHeader='Result';
                this.busFromOptions = this.defaultBusOptions;
                this.onFromClick(res.hits.hits[0],device);
                }else{
                  this.searchBusToHeader='Result';
                this.busToOptions = this.defaultBusOptions;
                this.onToClick(res.hits.hits[0],device);
                }
      
          }
         }

        if(field=='busFrom'){
          this.searchBusFromHeader='Result';
        this.busFromOptions=res.hits.hits;
        }else{
          this.searchBusToHeader='Result';
        this.busToOptions=res.hits.hits;
        }
        });
        }

       }else{
        if(field=='busFrom'){
          this.searchBusFromHeader='Popular Cities';
          this.busFromOptions= this.defaultBusOptions;
        }else{
          this.searchBusToHeader='Popular Cities';
          this.busToOptions= this.defaultBusOptions;
        }
       
       }
      }
    }


  onFromClick(values,device) {
        values=values['_source'];
        this.searchBusForm['controls']['busFrom'].setValue(values.name);
        this.searchBusForm['controls']['fromBusCode'].setValue(values.id);
        this.fromCityName=values.name;
        this.busFromOptions= this.defaultBusOptions;
  
  }

  onToClick(values,device) {
        values=values['_source'];
        this.searchBusForm['controls']['busTo'].setValue(values.name);
        this.searchBusForm['controls']['toBusCode'].setValue(values.id);
        this.toCityName=values.name;
        this.busToOptions= this.defaultBusOptions;
  }
  
  

  
   minDateBusToMlite =  new Date();
          minDateMlite =  new Date();
   openMliteDatePicker(field,rtype){
        $('#bus_arrival_mlite').modal('hide');
        $('#bus_departure_mlite').modal('show');
   }

     onSelectMliteDate(event,field){
        this.departureDate =event;
        this.minDateBusToMlite=event;
    }


  busFromInput:any;
  setSearchFilterData() {
   let lastSearch:any=localStorage.getItem('busLastSearch');
    if(lastSearch != null || lastSearch != undefined){
      lastSearch= JSON.parse(lastSearch);

    }


  }

  busSearchCallBack(param:any){
      let searchValueAllobj=param;
      let continueSearch:any=localStorage.getItem('continueSearch');
      if(continueSearch==null){
        this.continueSearchBuss=[];
      }
      if(continueSearch!=null && continueSearch.length>0){
        this.continueSearchBuss=JSON.parse(continueSearch);
        this.continueSearchBuss=this.continueSearchBuss.filter((item:any)=>{
          if(item.busFrom!=searchValueAllobj.busFrom || item.busTo!=searchValueAllobj.busTo)
          {
              return item;
          }
        })
      }
      if(this.continueSearchBuss.length>3){
        this.continueSearchBuss=this.continueSearchBuss.slice(0,3);
      }
      this.continueSearchBuss.unshift(searchValueAllobj);// unshift/push - add an element to the beginning/end of an array
      localStorage.setItem('continueSearch',JSON.stringify(this.continueSearchBuss));
  }


  sameCityValidation = false;
  busSearch() {
   
/*
      this.busSearchCallBack(searchValue);

      localStorage.setItem('busLastSearch',JSON.stringify(searchValue));

      searchValue.departure = moment(searchValue.departure).format('YYYY-MM-DD');

      if (searchValue.arrival)
        searchValue.arrival = moment(searchValue.arrival).format('YYYY-MM-DD');

        let url;
        if(this.searchBusForm.value.fromContry=='IN' && this.searchBusForm.value.toContry=='IN' ){
        if(this.searchBusForm.value.arrival == null || this.searchBusForm.value.arrival == undefined ||this.searchBusForm.value.arrival == "") {
           url="bus-list?"+decodeURIComponent(this.ConvertObjToQueryString((searchValue)));
          this.router.navigateByUrl(url);
        }
        else {
          url = "bus-roundtrip?" + decodeURIComponent(this.ConvertObjToQueryString((searchValue)));
          this.router.navigateByUrl(url);
        }
      } else {
        url = "bus-int?" + decodeURIComponent(this.ConvertObjToQueryString((searchValue)));
        this.router.navigateByUrl(url);
      }
    }*/
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

        this._styleManager.removeScript('custom');
  }




  swap()
  {
  

  }

  onClose(){
  }

  onOpen()
  {
    if(this.isMobile)
    {
      var element = document.querySelector('.bus-from-data')
      element?.classList.remove('form-hide');
    }
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
