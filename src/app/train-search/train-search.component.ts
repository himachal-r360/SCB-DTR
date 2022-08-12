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
import { FlightService } from '../common/flight.service';
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
  selector: 'app-train-search',
  templateUrl: './train-search.component.html',
  styleUrls: ['./train-search.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],

})


export class TrainSearchComponent implements OnInit,  OnDestroy {
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
  continueSearchTrain:any=[]
  submitted = false;
   searchTrainForm: FormGroup;
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
       private _trainService: FlightService,
      private formBuilder: FormBuilder,
      private ngZone:NgZone,private sg: SimpleGlobal,private es: ElasticsearchService

    ) {
      this.cdnUrl = environment.cdnUrl+this.sg['assetPath'];
      
          //Train Form
      this.searchTrainForm = this.formBuilder.group({
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
    }

  public Error = (controlName: string, errorName: string) => {
    return this.searchTrainForm.controls[controlName].hasError(errorName);
  };
  ngOnInit(): void {
         this.route.url.subscribe(url =>{
   this._trainService.showHeader(true);
    this.isMobile = window.innerWidth < 991 ?  true : false;
    let continueSearchValLs:any= localStorage.getItem('continueSearchTrain');
    if(continueSearchValLs!=null){
      this.continueSearchVal =JSON.parse(continueSearchValLs);
    }
    this.setSearchFilterData()
   });
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
        searchDisplayForm: 'train',
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
        this.searchTrainForm['controls']['searchFrom'].setValue(values.name);
        this.searchTrainForm['controls']['fromTravelCode'].setValue(values.id);
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
        this.searchTrainForm['controls']['searchTo'].setValue(values.name);
        this.searchTrainForm['controls']['toTravelCode'].setValue(values.id);
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
        $('#train_departure_mlite').modal('show');
        }

        onSelectMliteDate(event,field){
        this.departureDate =event;
        }


  setSearchFilterData() {
   let lastSearch:any=localStorage.getItem('trainLastSearch');
    if(lastSearch != null || lastSearch != undefined){
      lastSearch= JSON.parse(lastSearch);
        this.fromCityName=lastSearch.searchFrom;
        this.toCityName=lastSearch.searchTo;
        this.fromStateName=lastSearch.fromState;
        this.toStateName=lastSearch.toState;
        this.searchTrainForm['controls']['searchFrom'].setValue(lastSearch.searchFrom);
        this.searchTrainForm['controls']['searchTo'].setValue(lastSearch.searchTo);
        this.searchTrainForm['controls']['fromTravelCode'].setValue(lastSearch.fromTravelCode);
        this.searchTrainForm['controls']['toTravelCode'].setValue(lastSearch.toTravelCode);
        this.searchTrainForm['controls']['fromState'].setValue(lastSearch.fromState);
        this.searchTrainForm['controls']['toState'].setValue(lastSearch.toState);
        this.departureDate = new Date(lastSearch.departure);
        this.searchTrainForm.get('departure').setValue(moment(this.departureDate).format('YYYY-MM-DD'));
    }else{
        this.fromCityName='Delhi';
        this.toCityName='Mumbai';
        this.fromStateName='New Delhi';
        this.toStateName='Maharashtra';
        this.searchTrainForm['controls']['searchFrom'].setValue('Delhi');
        this.searchTrainForm['controls']['searchTo'].setValue('Mumbai');
        this.searchTrainForm['controls']['fromTravelCode'].setValue(1492);
        this.searchTrainForm['controls']['toTravelCode'].setValue(649);
        
        this.searchTrainForm['controls']['fromState'].setValue('New Delhi');
        this.searchTrainForm['controls']['toState'].setValue('Maharashtra');
    }
  }
  
  
  swap() {
      
        var FromData = {
        searchFrom: this.searchTrainForm.value.searchFrom,
        fromTravelCode:this.searchTrainForm.value.fromTravelCode,
        fromState : this.searchTrainForm.value.fromState
        }

        this.searchTrainForm.get('searchFrom').setValue(this.searchTrainForm.value.searchTo );
        this.searchTrainForm.get('fromTravelCode').setValue(this.searchTrainForm.value.toTravelCode );
        this.searchTrainForm.get('fromState').setValue(this.searchTrainForm.value.toState );
       
        this.fromCityName = this.searchTrainForm.value.searchTo;
        this.fromStateName = this.searchTrainForm.value.toState;

        this.searchTrainForm.get('searchTo').setValue(FromData.searchFrom );
        this.searchTrainForm.get('toTravelCode').setValue(FromData.fromTravelCode );
        this.searchTrainForm.get('toState').setValue(FromData.fromState );
     
        this.toCityName =  FromData.searchFrom;
        this.toStateName = FromData.fromState;

  }

  trainSearchCallBack(param:any){
      let searchValueAllobj=param;
      let continueSearch:any=localStorage.getItem('continueSearch');
      if(continueSearch==null){
        this.continueSearchTrain=[];
      }
      if(continueSearch!=null && continueSearch.length>0){
        this.continueSearchTrain=JSON.parse(continueSearch);
        this.continueSearchTrain=this.continueSearchTrain.filter((item:any)=>{
          if(item.searchFrom!=searchValueAllobj.searchFrom || item.searchTo!=searchValueAllobj.searchTo)
          {
              return item;
          }
        })
      }
      if(this.continueSearchTrain.length>3){
        this.continueSearchTrain=this.continueSearchTrain.slice(0,3);
      }
      this.continueSearchTrain.unshift(searchValueAllobj);// unshift/push - add an element to the beginning/end of an array
      localStorage.setItem('continueSearch',JSON.stringify(this.continueSearchTrain));
  }


  sameCityValidation = false;
  trainSearch() {
      this.submitted = true;

        if(this.searchTrainForm.value.fromTravelCode!= this.searchTrainForm.value.toTravelCode){
        this.sameCityValidation = false
        }
        else {
        this.sameCityValidation = true;
        }

      if (this.searchTrainForm.invalid || this.sameCityValidation == true) {
      return
     } else {
      let searchValue = this.searchTrainForm.value;
      this.trainSearchCallBack(searchValue);
      localStorage.setItem('trainLastSearch',JSON.stringify(searchValue));
      searchValue.departure = moment(searchValue.departure).format('YYYY-MM-DD');
      alert('Submitted'); return;
      let url;
      url = "flight-int?" + decodeURIComponent(this.ConvertObjToQueryString((searchValue)));
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
