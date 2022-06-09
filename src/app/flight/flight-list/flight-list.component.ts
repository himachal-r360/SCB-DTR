import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FlightService } from 'src/app/common/flight.service';
declare var $: any;


@Component({
  selector: 'app-flight-list',
  templateUrl: './flight-list.component.html',
  styleUrls: ['./flight-list.component.css']
})
export class FlightListComponent implements OnInit, OnDestroy {
  flightList:any =[];
  newDate = Date();
  loader = false;
  fromCityName: any;
  toCityName: any;
  depart:any;
  flightClassVal:any;
  adultsVal:any;
  childVal:any;
  infantsVal:any

  sub?: Subscription;
  show = false;
  cityList: any;
  fromFlightList = false;
  toFlightList = false;
  selectedDate?: any;
  cityName: any;
  fromAirpotName: any = 'from airport';
  toAirpotName: any = 'to airport';
  searchData:any;
  EMIAvailableLimit:number = 3000;
 EMI_interest:number = 16;

  departureDate: any = new Date();
  returnDate: any;
  oneWayDate: any;
  // flightListDate = this._flightService.flightListDate;
  flightListDate:any;
  totalPassenger: number = 1;
  disableParent: boolean = false;
  disablechildren: boolean = false;
  disableinfants: boolean = false;

  flightListMod:any;

  flightDataModify: any = this._fb.group({
    // flightfrom: ['DEL'],
    // flightto: ['BLR'],
    // flightclass: ['E'],
    // flightdefault: ['O'],
    // departure: [this.newDate],
    // arrival: [''],
    // adults: ['1'],
    // child: ['0'],
    // infants: ['0'],
    // travel: ['DOM'],
    flightfrom: [],
    flightto: [],
    flightclass: [],
    flightdefault: ['O'],
    departure: [],
    arrival: [''],
    adults: [],
    child: [],
    infants: [],
    travel: ['DOM'],
  });



  constructor(private _flightService: FlightService, private _fb: FormBuilder) { }

  ngOnInit(): void {
    this.flightList=this._flightService.flightListData;

    $(".js-range-slider").ionRangeSlider({
      type: "double",
      min: 0,
      max: 1000,
      from: 200,
      to: 500,
      prefix: "$",
      grid: true
    });

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
    });

    this.getCityList()

    this.setSearchFilterData();


    // console.log(this.searchData , "Search value");
    // console.log(this.searchData.value.flightclass , "Search value 2");

  }
  setSearchFilterData()
  {
    debugger
    this.searchData = localStorage.getItem('searchVal');
    let searchObj = JSON.parse(this.searchData);
    this.fromCityName = searchObj.flightfrom;
    this.toCityName = searchObj.flightto;
    this.departureDate =  searchObj.departure;
    this.flightClassVal = searchObj.flightclass;
    this.adultsVal = searchObj.adults;
    this.childVal = searchObj.child;
    this.infantsVal = searchObj.infants
    // this.departureDate = this.depart;
    //$('#DepartureDate').val(new Date(searchObj.departure));
    this.selectDate('DepartureDate',new Date(searchObj.departure));
    this.flightDataModify.value.flightfrom = this.fromCityName;
    this.flightDataModify.value.flightto = this.toCityName;
    this.flightDataModify.value.departure = this.departureDate;
    this.flightDataModify.value.flightclass = this.flightClassVal;
    this.flightDataModify.value.adults = searchObj.adults;
    this.flightDataModify.value.child = this.childVal;
    this.flightDataModify.value.infants = this.infantsVal;
    this.totalPassenger = parseInt(this.adultsVal) + parseInt(this.childVal)  + parseInt(this.infantsVal) ;
    console.log(this.totalPassenger);

    // if(this.totalPassenger  == 2 ) {
    //   this.totalPassenger = parseInt(this.adultsVal) +  this.childVal + this.infantsVal;
    // }
    // {
    //   this.totalPassenger = 1;
    // }
    console.log( this.flightDataModify.value.adults , "adult val");

  }
  selectDate(control: string,date:Date) {

    let dep;
    const a = this;
    $('#' + control).daterangepicker(
      {
        singleDatePicker: true,
        showDropdowns: false,
        format: 'yyyy/mm/dd',
        startDate: date,
        //  todayBtn: 1,
        autoclose: true,
      },
      function (start: any, end: any, label: string) {
        console.log(start._d);
        a.departureDate = start._d;
        a.flightDataModify.value.departure = start._d
        console.log(end);
        console.log(label);
      }
    );
  }

  getCityList() {
    this.sub = this._flightService
      .getCityList(this.cityList)
      .subscribe((res: any) => {
        this.cityList = res.hits.hits;
        console.log(this.cityList);
      });
  }


  increaseAdult() {
    if (parseInt(this.flightDataModify.value.adults) < 9) {
      this.flightDataModify
        .get('adults')
        .setValue(parseInt(this.flightDataModify.value.adults) + 1);
      this.totalPassenger =
        parseInt(this.flightDataModify.value.adults) +
        parseInt(this.flightDataModify.value.child) +
        parseInt(this.flightDataModify.value.infants);
      if (this.totalPassenger == 9) {
        this.disableParent = true;
        this.disablechildren = true;
        this.disableinfants = true;
      }
    }
    //this.flightDataModify.value.adults = parseInt(this.flightDataModify.value.adults) + 1;
  }

  decreaseAdult() {
    if (parseInt(this.flightDataModify.value.adults) > 1) {
      this.flightDataModify
        .get('adults')
        .setValue(parseInt(this.flightDataModify.value.adults) - 1);
      this.totalPassenger =
        parseInt(this.flightDataModify.value.adults) +
        parseInt(this.flightDataModify.value.child) +
        parseInt(this.flightDataModify.value.infants);
      if (this.totalPassenger < 9) {
        this.disableParent = false;
        this.disablechildren = false;
        if (
          parseInt(this.flightDataModify.value.infants) ==
          parseInt(this.flightDataModify.value.adults)
        ) {
          this.disableinfants = true;
        } else {
          this.disableinfants = false;
        }
      }
    }

    //  this.flightDataModify.value.adults = parseInt(this.flightDataModify.value.adults) - 1;
  }

  increaseChild() {
    if (parseInt(this.flightDataModify.value.child) < 9) {
      this.flightDataModify
        .get('child')
        .setValue(parseInt(this.flightDataModify.value.child) + 1);
      this.totalPassenger =
        parseInt(this.flightDataModify.value.adults) +
        parseInt(this.flightDataModify.value.child) +
        parseInt(this.flightDataModify.value.infants);
      if (this.totalPassenger == 9) {
        this.disableParent = true;
        this.disablechildren = true;
        this.disableinfants = true;
      }
    }
  }

  decreaseChild() {
    if (parseInt(this.flightDataModify.value.child) > 0) {
      this.flightDataModify
        .get('child')
        .setValue(parseInt(this.flightDataModify.value.child) - 1);
      this.totalPassenger =
        parseInt(this.flightDataModify.value.adults) +
        parseInt(this.flightDataModify.value.child) +
        parseInt(this.flightDataModify.value.infants);
      if (this.totalPassenger < 9) {
        this.disableParent = false;
        this.disablechildren = false;
        if (
          parseInt(this.flightDataModify.value.infants) ==
          parseInt(this.flightDataModify.value.adults)
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
      parseInt(this.flightDataModify.value.infants) <
      parseInt(this.flightDataModify.value.adults)
    ) {
      if (parseInt(this.flightDataModify.value.infants) < 9) {
        this.flightDataModify
          .get('infants')
          .setValue(parseInt(this.flightDataModify.value.infants) + 1);
        this.totalPassenger =
          parseInt(this.flightDataModify.value.adults) +
          parseInt(this.flightDataModify.value.child) +
          parseInt(this.flightDataModify.value.infants);
        if (this.totalPassenger == 9) {
          this.disableParent = true;
          this.disablechildren = true;
          this.disableinfants = true;
        } else {
          if (
            parseInt(this.flightDataModify.value.infants) ==
            parseInt(this.flightDataModify.value.adults)
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
    if (parseInt(this.flightDataModify.value.infants) > 0) {
      this.flightDataModify
        .get('infants')
        .setValue(parseInt(this.flightDataModify.value.infants) - 1);
      this.totalPassenger =
        parseInt(this.flightDataModify.value.adults) +
        parseInt(this.flightDataModify.value.child) +
        parseInt(this.flightDataModify.value.infants);
      if (this.totalPassenger < 9) {
        this.disableParent = false;
        this.disablechildren = false;
        this.disableinfants = false;
      }
    }
  }

  fromList(evt: any) {
    this.toFlightList = false;
    this.fromFlightList = true;
    this.cityList = evt.target.value.trim().toLowerCase();
    this.getCityList();
  }

  toList(evt: any) {
    this.fromFlightList = false;
    this.toFlightList = true;
    this.cityList = evt.target.value.trim().toLowerCase();
    this.getCityList();
  }


  selectFromFlightList(para1: any) {
    debugger;
    console.log(para1);
    this.flightDataModify.value.flightfrom = para1.id;
    this.fromAirpotName = para1.airport_name;
    this.fromCityName = para1.city;
    // localStorage.setItem('fromCity', this.fromCityName);
    this.fromFlightList = false;
    console.log(para1.id);
  }

  selectToFlightList(para2: any) {
    debugger;
    this.flightDataModify.value.flightto = para2.id;
    this.cityName = para2.city;
    this.toAirpotName = para2.airport_name;
    this.toCityName = para2.city;
    // localStorage.setItem('toCity', this.toCityName);
    this.toFlightList = false;
    console.log(para2);
    console.log(this.flightDataModify.value.flightto);
  }



  convertDate(str:any) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  flightSearch() {
    debugger;
    // this.loader = true;
    this.selectedDate = this.flightDataModify.value.departure;
    debugger;
    this.flightDataModify.value.departure = this.convertDate(this.selectedDate);
    //this.flightDataModify.get('departure').setValue(this.convertDate(this.selectedDate));
    this.flightDataModify.value.departure=this.departureDate.getFullYear()+'-' +(this.departureDate.getMonth()+ 1)+'-' +this.departureDate.getDate();
    this.sub = this._flightService.flightList(this.flightDataModify.value).subscribe((res: any) => {
      console.log(res, "flight res");
      this.flightList = res.response.onwardFlights;
      this.oneWayDate = res.responseDateTime;
      console.log(this.oneWayDate, "res");
      this._flightService.flightListData = this.flightList;
      // this._flightService.flightListDate = this.oneWayDate;
      console.log(this.flightList, "flight Search");
    }, (error) => { console.log(error) });
  }


  ngOnDestroy(): void {

    localStorage.clear();
    this.sub?.unsubscribe();
  }


  HideShowCompareToFly(i:number)
  {
   var element = document.getElementById("CompareToFly_"+i);
   if(element?.classList.contains("flight-details-box-hide"))
   {
    element.classList.remove("flight-details-box-hide");
   }
   else{
    element?.classList.add("flight-details-box-hide");
   }
  }
}
