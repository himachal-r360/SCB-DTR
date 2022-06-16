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
  departureDate:any = new Date();
  returnDate:any;
  oneWayDate :any;
  SearchCityName:any;

  // for passenger dropdown
  totalPassenger: number = 1;
  disableParent: boolean = false;
  disablechildren: boolean = false;
  disableinfants: boolean = false;
  fromCityValidation = false;
  toCityValidation = false;
  departDateValidation = false;
  flightData: any = this._fb.group({
    flightfrom: [''],
    flightto: [''],
    flightclass: ['E'],
    flightdefault: ['O'],
    departure: [""],
    arrival: [''],
    adults: ['1'],
    child: ['0'],
    infants: ['0'],
    travel: ['DOM'],
  });

  public error = (controlName: string, errorName: string) => {
    return this.flightData.controls[controlName].hasError(errorName);
  }

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

  ngOnInit(): void {
    this.getCityList();
    this.selectDate('DepartureDate');

    $(document).click(function (e: any) {
      var containerLeft = $('.select-root-left');
      if (!$(e.target).closest(containerLeft).length) {
        $('.flight-from-data').addClass('flight-from-hide');
      } else {
        $('#fromCitySearch').val('');
        $('.flight-from-data').removeClass('flight-from-hide');
      }

      var containerRight = $('.select-root-right');
      if (!$(e.target).closest(containerRight).length) {
        $('.flight-to-data').addClass('flight-from-hide');
      } else {
        $('#toCitySearch').val('');
        $('.flight-to-data').removeClass('flight-from-hide');
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
    $('.class-select').selectpicker();
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
    console.log('hi');
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
        debugger
        console.log(start._d);
        a.departureDate = start._d;
        a.flightData.value.departure = start._d

        a.departureDate = start._d  ;

        console.log(a.departureDate)
        console.log(end);
        console.log(label);
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
  getCityList() {
    this.sub = this._flightService
      .getCityList(this.SearchCityName)
      .subscribe((res: any) => {
        this.cityList = res.hits.hits;
        console.log(this.cityList);
      });
  }

  fromList(evt: any) {
    this.toFlightList = false;
    this.fromFlightList = true;
    this.SearchCityName = evt.target.value.trim().toLowerCase();

    this.getCityList();
  }

  toList(evt: any) {
    this.fromFlightList = false;
    this.toFlightList = true;
    this.SearchCityName = evt.target.value.trim().toLowerCase();
    this.getCityList();
  }

  selectFromFlightList(para1: any) {
    debugger;
    console.log(para1);
    this.flightData.value.flightfrom = para1.id;
    this.fromAirpotName = para1.airport_name;
    this.fromCityName = para1.city;
    localStorage.setItem('fromCity', this.fromCityName);
    this.fromFlightList = false;
    console.log(para1.id);
  }

  selectToFlightList(para2: any) {
    debugger;
    this.flightData.value.flightto = para2.id;
    // this.cityName = para2.city;
    this.toAirpotName = para2.airport_name;
    this.toCityName = para2.city;
    localStorage.setItem('toCity' ,this.toCityName);
    this.toFlightList = false;
    console.log(para2);
    console.log(this.flightData.value.flightto);
  }

  flightSearch() {
    
    if(this.flightData.invalid){
      debugger
      return
    }
    else {
      this.loader = true;
      this.selectedDate = this.flightData.value.departure;
      console.log(this.selectDate);
      this.flightData.value.departure=this.departureDate.getFullYear()+'-' +(this.departureDate.getMonth()+ 1)+'-' +this.departureDate.getDate();
      //this.flightData.get('departure').setValue(this.departureDate.getFullYear()+'-' +(this.departureDate.getMonth()+ 1)+'-' +this.departureDate.getDate())
      let searchValue = JSON.stringify(this.flightData.value);
      localStorage.setItem('searchVal', searchValue);
      localStorage.setItem('fromAirportName', this.fromAirpotName);
      localStorage.setItem('toAirportName', this.toAirpotName);
      this.sub = this._flightService.flightList(this.flightData.value).subscribe((res: any) => {
        this.loader = false;
        this.show = true;
        this.flightList = res.response.onwardFlights;
        this.oneWayDate = res.responseDateTime;
        console.log(this.oneWayDate , "res");
        this._flightService.flightListData = this.flightList;
        this._flightService.flightListDate = this.oneWayDate;
        console.log(this.flightList , "flight Search");
        let query:any = localStorage.getItem('searchVal');
        this.router.navigate(['flight-list']);
        // { queryParams: { flights : JSON.stringify(query) }}
        
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

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
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
