import { JsonpClientBackend } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FlightService } from '../common/flight.service';
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
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
  // fromCityValidation = false;
  // toCityValidation = false;
  // departDateValidation = false;
  
  //get f() { return this.flightData.controls; }


  // flightData: any = this._fb.group({
  //   depart: ["2022-06-15"],
  //   channel: ["web"],
  //   arrive: [""],
  //   leavingFrom: ["DEL"],
  //   infants: ["0"],
  //   child: ["0"],
  //   goingTo: ["BLR"],
  //   travel: ["DOM"],
  //   classType: ["E"],
  //   defaultType: ["O"],
  //   sortBy: ["asc"],
  //   count_t: ["1"],
  //   adultsq: ["1"]
  // })

  // flightData: any = this._fb.group({
  //   flightfrom: ["DEL"],
  //   flightto: ["BLR"],
  //   flightclass: ["E"],
  //   flightdefault: ["O"],
  //   departure: ["2022-05-31"],
  //   arrival: [":"],
  //   adults: ["1"],
  //   child: ["0"],
  //   infants: ["0"],
  //   travel: ["DOM"],

  // })
  constructor(
    public router: Router,
    private _fb: FormBuilder,
    private _flightService: FlightService
  ) {}
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
    //this.getCityList();
    this.selectDate('DepartureDate');
    let continueSearchValLs:any= localStorage.getItem('continueSearch');
    debugger;
    if(continueSearchValLs!=null){
      this.continueSearchVal =JSON.parse(continueSearchValLs).reverse();
    }
    
    $(document).click(function (e: any) {
      var containerLeft = $('.select-root-left');
      if (!$(e.target).closest(containerLeft).length) {
        $('.flight-from-data').addClass('flight-from-hide');
      } else {
        $('#fromCitySearch1').val('');
        $('.flight-from-data').removeClass('flight-from-hide');
        $("#fromCitySearch1").trigger("focus");
      }

      var containerRight = $('.select-root-right');
      if (!$(e.target).closest(containerRight).length) {
        $('.flight-to-data').addClass('flight-from-hide');
      } else {
        $('#toCitySearch1').val('');
        $('.flight-to-data').removeClass('flight-from-hide');
        $("#toCitySearch1").trigger("focus");
      }

      var TravellersDropdown = $('.Travellers-dropdown');
      if (!$(e.target).closest(TravellersDropdown).length) {
        $('.Travellers-dropdown-data').addClass('Travellershide');
      } else {
        $('.Travellers-dropdown-data').removeClass('Travellershide');
      }
      var Preferredtitle = $('.Preferred-title');
      if (!$(e.target).closest(Preferredtitle).length) {
        $('.Preferred-data').addClass('Preferred-hide');
      } else {
        $('.Preferred-data').removeClass('Preferred-hide');
      }

    });
  }
  ngAfterViewInit(): void {
   setTimeout(() => {
    $('.class-select').selectpicker();
   }, 500);
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
    //   // console.log(this.newDate ,"new date");
    //   // dep = e.format()

    //    console.log(this.selectDate);
    // });
    const a = this;
    $('#' + control).daterangepicker(
      {
        singleDatePicker: true,
        showDropdowns: false,
        format: 'yyyy/mm/dd',
        startDate: new Date(),
        //  todayBtn: 1,
        autoclose: true,
      },
      function (start: any, end: any, label: string) {
        
        a.departureDate = start._d;
        a.departureDate = start._d;
        a.flightData.value.departure = start._d
        a.dateValidation=false;
        
      }
    );

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
    this.fromAirpotName = para1.airport_name;
    this.fromCityName = para1.city;
    this.fromContryName = para1.country;
    
    localStorage.setItem('fromCity', this.fromCityName);
    this.fromFlightList = false;
  }

  selectToFlightList(para2: any) {
    
    this.flightData.value.flightfrom=localStorage.getItem('fromCityId');
    localStorage.setItem('toCityId' ,para2.id);
    this.flightData.value.flightto = para2.id;
    // this.cityName = para2.city;
    this.toAirpotName = para2.airport_name;
    this.toCityName = para2.city;
    this.toContryName = para2.country;
    
    localStorage.setItem('toCity' ,this.toCityName);
    this.toFlightList = false;
  }


  // isValidation:boolean=false;
  // flightSearchValidation() {
  //   debugger;
  //   // if(this.flightData.value.flightfrom == "" || this.flightData.value.flightfrom == undefined || this.flightData.value.flightto == "" || this.flightData.value.flightto == undefined ||  this.flightData.value.departure == "" || this.flightData.value.departure == undefined ){
  //   //   this.toCityValidation =  true;
  //   //   this.fromCityValidation =  true;
  //   //   this.departDateValidation = true;
  //   //   this.isValidation=true;
  //   //   //return
  //   // }
  //   // else 
  //   if(this.flightData.value.flightfrom == "" || this.flightData.value.flightfrom == undefined ){
  //     this.fromCityValidation =  true;
  //     this.isValidation=true;
  //     //return
  //   }
  //  else if(this.flightData.value.flightto == "" || this.flightData.value.flightto == undefined ){
  //     this.toCityValidation =  true;
  //     this.isValidation=true;
  //     //return
  //   }
  //   else if(this.flightData.value.departure == "" || this.flightData.value.departure == undefined ){
  //     this.departDateValidation =  true;
  //     this.isValidation=true;
  //     //return
  //   }
  // }
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
    if(this.flightData.invalid || this.dateValidation==true){
      return
    }
    else {
      this.loader = true;
      
      //this.flightData.get('departure').setValue(this.departureDate.getFullYear()+'-' +(this.departureDate.getMonth()+ 1)+'-' +this.departureDate.getDate())
      let searchValue = this.flightData.value;
      
      let otherSearchValueObj={'fromAirportName':this.fromAirpotName,'toAirportName': this.toAirpotName,'toCity' :this.toCityName,'fromCity': this.fromCityName ,'fromContry':this.fromContryName,'toContry':this.toContryName}
      
      let searchValueAllobj=Object.assign(searchValue,otherSearchValueObj);
      let continueSearch:any=localStorage.getItem('continueSearch');
      if(continueSearch==null){
        this.continueSearchFlights=[];
      }
      debugger;
      if(continueSearch!=null && continueSearch.length>0){
        this.continueSearchFlights=JSON.parse(continueSearch);
      }
      this.continueSearchFlights.push(searchValueAllobj);
      localStorage.setItem('continueSearch',JSON.stringify(this.continueSearchFlights));
      localStorage.setItem('searchVal', JSON.stringify(searchValueAllobj));
      localStorage.setItem('fromAirportName', this.fromAirpotName);
      localStorage.setItem('toAirportName', this.toAirpotName);
      this.sub = this._flightService.flightList(this.flightData.value).subscribe((res: any) => {
        this.loader = false;
        this.show = true;
        this.flightList = res.response.onwardFlights;
        this.oneWayDate = res.responseDateTime;
        this._flightService.flightListData = this.flightList;
        this._flightService.flightListDate = this.oneWayDate;
        let query:any = localStorage.getItem('searchVal');
        
        
        let url="flight-list?"+decodeURIComponent(this.ConvertObjToQueryString(JSON.parse(query)));
        this.router.navigateByUrl(url);
        //this.router.navigate(['flight-list'],  { queryParams: { flights : decodeURIComponent(this.ConvertObjToQueryString(JSON.parse(query)))}});
       
        
      }, (error) => { console.log(error) });
        
    }
   
    //this.flightData.get('departure').setValue(this.departureDate)
    // this.sub = this._flightService.flightList(this.flightData.value).subscribe(
    //   (res: any) => {
    //     this.loader = false;
    //     this.show = true;
    //     this.flightList = res.response.onwardFlights;
    //     this._flightService.flightListData = this.flightList;
    //     console.log(this.flightList, 'flight Search');
    //     this.router.navigate(['flight-list']);
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );
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
  }

  continueSearch(param:any){
    // let query:any = localStorage.getItem('searchVal');
    let url="flight-list?"+decodeURIComponent(this.ConvertObjToQueryString(param));
    this.router.navigateByUrl(url);
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
}
