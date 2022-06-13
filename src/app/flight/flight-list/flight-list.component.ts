import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FlightService } from 'src/app/common/flight.service';
declare var $: any;

@Component({
  selector: 'app-flight-list',
  templateUrl: './flight-list.component.html',
  styleUrls: ['./flight-list.component.css'],
})
export class FlightListComponent implements OnInit, AfterViewInit, OnDestroy {
  flightList: any = [];
  newDate = Date();
  loader = false;
  fromCityName: any;
  toCityName: any;
  depart: any;
  flightClassVal: any;
  adultsVal: any;
  childVal: any;
  infantsVal: any;

  sub?: Subscription;
  show = false;
  SearchCityName: any;
  cityList: any;
  fromFlightList = false;
  toFlightList = false;
  selectedDate?: any;
  cityName: any;
  fromAirpotName: any = 'from airport';
  toAirpotName: any = 'to airport';
  searchData: any;
  EMIAvailableLimit: number = 3000;
  EMI_interest: number = 16;
  departureDate: any = new Date();
  returnDate: any;
  oneWayDate: any;
  // flightListDate = this._flightService.flightListDate;
  flightListDate: any;
  totalPassenger: number = 1;
  disableParent: boolean = false;
  disablechildren: boolean = false;
  disableinfants: boolean = false;
  flightTimingfrom:any;
  flightTimingto:any;

  flightListMod:any;
  RefundableFaresCount:number=0;
  nonStopCount:number=0;
  foodAllowanceCount:number=0;
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
  refundFilterStatus:boolean= false;
  flightListWithOutFilter: any=[];


  constructor(private _flightService: FlightService, private _fb: FormBuilder) { }

  ngOnInit(): void {

    this.flightList=this._flightService.flightListData;
    console.log(this.flightList);

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
    this.getCityList();
    this.setSearchFilterData();
    this.flightSearch();
    
    
    // console.log(this.searchData , "Search value");
    // console.log(this.searchData.value.flightclass , "Search value 2");
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.Initslider();
    }, 500);
  }
  setSearchFilterData()
  {
    // debugger

    this.searchData = localStorage.getItem('searchVal');
    let searchObj = JSON.parse(this.searchData);
    this.fromCityName = localStorage.getItem('fromCity'); //searchObj.flightfrom;
    this.toCityName = localStorage.getItem('toCity');
    this.departureDate = searchObj.departure;
    this.flightClassVal = searchObj.flightclass;
    this.adultsVal = searchObj.adults;
    this.childVal = searchObj.child;
    this.infantsVal = searchObj.infants;
    this.fromAirpotName = localStorage.getItem('fromAirportName');
    this.toAirpotName = localStorage.getItem('toAirportName');
    this.flightTimingfrom = searchObj.flightfrom
    this.flightTimingto = searchObj.flightto
    // this.departureDate = this.depart;

    this.flightDataModify.value.flightfrom = searchObj.flightfrom;
    this.flightDataModify.value.flightto = searchObj.flightto;
    //$('#DepartureDate').val(new Date(searchObj.departure));
    this.selectDate('DepartureDate', new Date(searchObj.departure));
    console.log(this.departureDate);
    // this.flightDataModify.value.flightfrom = this.fromCityName;
    // this.flightDataModify.value.flightto = this.toCityName;
    this.flightDataModify.value.departure = this.departureDate;
    this.flightDataModify.value.flightclass = this.flightClassVal;
    this.flightDataModify.value.adults = searchObj.adults;
    this.flightDataModify.value.child = this.childVal;
    this.flightDataModify.value.infants = this.infantsVal;
    this.totalPassenger =
      parseInt(this.adultsVal) +
      parseInt(this.childVal) +
      parseInt(this.infantsVal);
    console.log(this.totalPassenger);
    console.log(this.flightDataModify.value.adults, 'adult val');
  }
  selectDate(control: string, date: Date) {
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
        a.flightDataModify.value.departure = start._d;
        console.log(end);
        console.log(label);
      }
    );
  }

  getCityList() {
    this.sub = this._flightService
      .getCityList(this.SearchCityName)
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
    debugger;

    this.toFlightList = false;
    this.fromFlightList = true;
    // this.cityList = evt.target.value.trim().toLowerCase();
    this.SearchCityName = evt.target.value.trim().toLowerCase();
    this.getCityList();
  }

  toList(evt: any) {
    debugger;

    this.fromFlightList = false;
    this.toFlightList = true;
    //  this.cityList = evt.target.value.trim().toLowerCase();
    this.SearchCityName = evt.target.value.trim().toLowerCase();
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

  convertDate(str: any) {
    var date = new Date(str),
      mnth = ('0' + (date.getMonth() + 1)).slice(-2),
      day = ('0' + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join('-');
  }

  // Flight Timings Filter
  FlightTimingsFilterFlightData(val:string)
  {
    debugger;
    if($("#Flight_Timings .flighttiming-list").hasClass("active")){
      $("#Flight_Timings .flighttiming-list").removeClass('active');
    }
    $("#Flight_Timings .flighttiming-list[value="+val+"]").addClass('active');
    this.popularFilterFlightData();
  }
  
  resetFlightTimings()
  {
    $("#Flight_Timings .flighttiming-list").removeClass('active');
    this.popularFilterFlightData();
  }
  // Flight Stops Filter
  FlightStopsFilterFlightData(val:string)
  {
    debugger;
    $("#Flight_Stops .Stops-list").removeClass('active');
    // if($("#Flight_Stops .Stops-list").hasClass("active")){
    //   $("#Flight_Stops .Stops-list").removeClass('active');
    // }
    $("#Flight_Stops .Stops-list[value="+val+"]").addClass('active');
    this.popularFilterFlightData();
  }

  resetFlightStops()
  {
    $("#Flight_Stops .Stops-list").removeClass('active');
    this.popularFilterFlightData();
  }

  //It is used for clear filters of Popular filter
  resetPopularFilter()
  {
    $('#popular-filters').find('input:checkbox').prop('checked', false);
    this.popularFilterFlightData();
  }
  //It is used for searching flights with left side filters.
  popularFilterFlightData()
  {
    let updatedflightList=[];
    // debugger;
    let isfilterRefundableFares=false;
    let isfilterNonStop=false;
    let isfilterMorningDepartures=false;
    let isfilterMealsIncluded=false;

    let isfilterFlightTiming=false;
    let filterFlightTimingval:string="";

    let isfilterFlightStops=false;
    let filterFlightStopsval:string="";


    let popularFilter=$("#popular-filters input[type=checkbox]:checked");
    for(let j=0;j<popularFilter.length;j++){
      isfilterRefundableFares=popularFilter[j].value=="Refundable-Fares"?true:false;
      isfilterNonStop=popularFilter[j].value=="non-stop"?true:false;
      isfilterMorningDepartures=popularFilter[j].value=="Morning-Departures"?true:false;
      isfilterMealsIncluded=popularFilter[j].value=="Meals-Included"?true:false;
    }
    let flightListWithOutFilter=this.flightListWithOutFilter;
    const flightListConst=flightListWithOutFilter.map((b:any)=>({...b}));
    this.flightList=flightListConst;
    
    if($("#Flight_Timings .flighttiming-list").hasClass("active")){
      isfilterFlightTiming=true;
      filterFlightTimingval=$("#Flight_Timings .flighttiming-list.active").attr("value");
    }
    if($("#Flight_Stops .Stops-list").hasClass("active")){
      isfilterFlightStops=true;
      filterFlightStopsval=$("#Flight_Stops .Stops-list.active").attr("value");
    }

    for(let i=0;i<this.flightList.length;i++){
      let singleFlightList=[];
      singleFlightList=this.flightList[i].flights;

      let isNonStop=false;
      let isRefundableFares=false;
      let isMealsInclude = false;
      let isFlightTiming = false;
      let isFlightStops = false;

      if(singleFlightList!=null && singleFlightList!=undefined){
        if(isfilterNonStop==true || isfilterRefundableFares==true || isfilterMealsIncluded==true || isfilterFlightTiming==true || isfilterFlightStops==true){
          if(isfilterNonStop==true){ 
            if(singleFlightList.filter(function(e:any){if(e.stops==0){return e}}).length>0)
            {
              isNonStop=true;
            }
          }
          if(isfilterRefundableFares==true){
            if(this.flightList[i].priceSummary.filter(function(e:any){if(e.refundStatus==1){return e}}).length>0)
            {
              isRefundableFares=true;
            }
          }
          if(isfilterMealsIncluded==true){
            let singleFlightPriceSummaryMeal=[]
            singleFlightPriceSummaryMeal=this.flightList[i].priceSummary.filter(function(e:any){if(e.foodAllowance !="null"){return e}});

            if(singleFlightPriceSummaryMeal.length>0)
            {
              this.flightList[i].priceSummary=[];
              this.flightList[i].priceSummary=singleFlightPriceSummaryMeal;
              isMealsInclude=true;
            }
            // isMealsInclude=true;
          }
          if(isfilterFlightTiming==true){
            let singleFlightTiming=[]
             //Flight Timing Filter
            var current_date = new Date(this.departureDate),
            current_year =current_date.getFullYear(),
            current_mnth =current_date.getMonth(),
            current_day =current_date.getDate();

            var date1 = new Date(current_year, current_mnth, current_day,  0, 1); // 0:01 AM
            var date2 = new Date(current_year, current_mnth, current_day, 6, 1); // 6:01 AM
            var date3 = new Date(current_year, current_mnth, current_day, 12, 1); // 12:01 PM
            var date4 = new Date(current_year, current_mnth, current_day, 18, 1); // 18:01 PM
            var date5 = new Date(current_year, current_mnth, current_day, 23, 59); // 23:59 PM
            singleFlightTiming=singleFlightList.filter(function(e:any){
              //0_6
              if(filterFlightTimingval=="0_6" && new Date(e.departureDateTime)>date1 && new Date(e.departureDateTime)<date2){
                return e;
              }
              //6_12
              else if(filterFlightTimingval=="6_12" && new Date(e.departureDateTime)>date2 && new Date(e.departureDateTime)<date3){
                return e;
              }
              //12_18
              else if(filterFlightTimingval=="12_18" && new Date(e.departureDateTime)>date3 && new Date(e.departureDateTime)<date4){
                return e;
              }
              //18_0
              else if(filterFlightTimingval=="18_0" && new Date(e.departureDateTime)>date4 && new Date(e.departureDateTime)<date5){
                return e;
              }
            });
            if(singleFlightTiming.length>0){
              isFlightTiming=true;
            }
          }
          if(isfilterFlightStops==true){
            let singleFlightStops=[];
             //Flight Stops Filter
            singleFlightStops=singleFlightList.filter(function(e:any){
              //0 - no_stops
              if(filterFlightStopsval=="no_stops" && e.stops==0){
                return e;
                //singleFlightList.filter(function(e:any){if(e.stops==0){return e}}).length>0
              }
              //1
              else if(filterFlightStopsval=="1_stops" && e.stops==1){
                return e;
              }
              //2+
              else if(filterFlightStopsval=="2plus_stops" && e.stops>1){
                return e;
              }
            });
            if(singleFlightStops.length>0){
              isFlightStops=true;
            }
          }
          if((isNonStop==true || isRefundableFares==true || isMealsInclude==true) || isFlightTiming==true || isFlightStops==true){
            updatedflightList.push(this.flightList[i]);
          }
        }
        else{
          updatedflightList.push(this.flightList[i]);
        }
      }
    }

    this.flightList=updatedflightList;

    //it is used for getting values of count.
    this.RefundableFaresCount=0;
    this.nonStopCount=0;
    this.foodAllowanceCount = 0;
    if(this.flightList.length>0){
      this.flightList.filter((e:any)=>{
          var flights=e.flights.filter((d:any)=>{if(d.stops==0){ return d;}}); // Non-Stop count
          console.log(flights)
          if(flights.length>0){
            this.nonStopCount+=1;
          }
          var flights=e.priceSummary.filter((d:any)=>{if(d.refundStatus==1){ return d;}}); // Refundable Fares Count
          if(flights.length>0){
            this.RefundableFaresCount+=1;
          }
          var flights=e.priceSummary.filter((d:any)=>{if(d.foodAllowance!=null){ return d;}});// Meals Included Count
          if(flights.length>0){
            this.foodAllowanceCount+=1;
          }
          //return flights;
      })
      
    //Ascending Descending Order
      let priceAscDesc=$("#priceAscDesc").val();
      if(priceAscDesc=="P_L_H"){
        this.flightList.sort((a:any,b:any) => a.priceSummary[0].totalFare-b.priceSummary[0].totalFare);
      }
      else if(priceAscDesc=="P_H_L"){
        this.flightList.sort((a:any,b:any) => b.priceSummary[0].totalFare-a.priceSummary[0].totalFare);
      }
    }
    //StopOverFilter
    if(this.flightList.length > 0)
    {
     var start = parseInt($('.price-value').text().replace(' hrs',''));
     var end = parseInt($('.price-value2').text().replace(' hrs',''));
     var filteredStopOver :any[] = [];
    this.flightList.forEach((e:any)=>{
      var flights =[];
           e.flights.forEach((d:any)=>{
            if((d.duration / 60)/60  >= start && (d.duration / 60 /60) <= end)
            {
              flights.push(d);
            }
          })
          if(flights.length > 0)
          {
            filteredStopOver.push(e);
          }

      });
      this.flightList = filteredStopOver;
    }
    debugger;
    console.log(this.flightList);
  }

  getAirlinelist() {
    let airlineNameArr =[];
    this.flightList ;
    for(let j=0;j<this.flightList.length;j++){
      let singleFlightList=[];
      singleFlightList=this.flightList[j].flights;
      let priceSummaryList = this.flightList[j].priceSummary;

      for(let h=0;h<singleFlightList.length;h++){
        let airlineName = singleFlightList[h].airlineName
        // for(let p=0;p<priceSummaryList.length;p++) {
        //   let priceSummary = priceSummaryList[p].totalFare
        //   console.log(priceSummary, "price summary");
        //   if(airlineNameArr.filter((d:any)=>{if(d.airlineName==airlineName){ return d;}}).length<1){
         
        //   }
        //   if(airlineNameArr.filter((d:any)=>{if(d.priceSummary){ return d;}}).length<1) {

        //   }
        //   let airlineNameObj= {
        //     "airlineName":airlineName,
        //     "price":priceSummary
        //   };
        //   airlineNameArr.push(airlineNameObj);
        // }
      }
      airlineNameArr.push("");
    }
    // let airlineNameObj= {
    //   "airlineName":"indigo3",
    //   "price":5000
    // };
    // airlineNameArr.push(airlineNameObj);
    console.log(airlineNameArr , "flightlistname");
    
      //this.flightList
  }
 
  

  flightSearch() {
    debugger;
    // this.loader = true;
    // this.selectedDate = this.flightDataModify.value.departure;
    this.searchData = localStorage.getItem('searchVal');
    let searchObj = JSON.parse(this.searchData);
    if (
      this.flightDataModify.value.flightfrom == null ||
      this.flightDataModify.value.flightfrom == undefined
    ) {
      this.flightDataModify.value.flightfrom = searchObj.flightfrom;
    }
    if (
      this.flightDataModify.value.flightto == null ||
      this.flightDataModify.value.flightto == undefined
    ) {
      this.flightDataModify.value.flightto = searchObj.flightto;
    }
    if (
      this.flightDataModify.value.departure == null ||
      this.flightDataModify.value.departure == undefined
    ) {
      this.flightDataModify.value.departure = searchObj.departure;
    }

    debugger;
    // this.flightDataModify.value.departure = this.convertDate(this.selectedDate);
    //this.flightDataModify.get('departure').setValue(this.convertDate(this.selectedDate));
    // this.flightDataModify.value.departure=this.departureDate.getFullYear()+'-' +(this.departureDate.getMonth()+ 1)+'-' +this.departureDate.getDate();
    this.sub = this._flightService.flightList(this.flightDataModify.value).subscribe((res: any) => {
      // console.log(res, "flight res");
      this.flightList = res.response.onwardFlights;
      this.oneWayDate = res.responseDateTime;
      // console.log(this.oneWayDate, "res");
      this._flightService.flightListData = this.flightList;
      // this._flightService.flightListDate = this.oneWayDate;
      // console.log("flight Search -->",this.flightList);
      this.flightListWithOutFilter=this.flightList;
      this.getAirlinelist();
      this.popularFilterFlightData()
    }, (error) => { console.log(error) });
    console.log(this.flightListWithOutFilter);
   
  }

  ngOnDestroy(): void {
    localStorage.clear();
    this.sub?.unsubscribe();
  }

  HideShowCompareToFly(i: number) {
    var element = document.getElementById('CompareToFly_' + i);
    if (element?.classList.contains('flight-details-box-hide')) {
      element.classList.remove('flight-details-box-hide');
    } else {
      element?.classList.add('flight-details-box-hide');
    }
  }

  calculateEMI(amount:number)
  {
return Math.round((amount + (amount *(this.EMI_interest /100))) / 12);
  }
  swap() {
    var FromData = {
      flightFrom: this.flightDataModify.value.flightfrom,
      fromAirpotName: this.fromAirpotName,
      fromCityName: this.fromCityName,
    };
    this.flightDataModify.value.flightfrom =
      this.flightDataModify.value.flightto;
    this.fromAirpotName = this.toAirpotName;
    this.fromCityName = this.toCityName;
    localStorage.setItem('fromCity', this.toCityName);
    this.flightDataModify.value.flightto = FromData.flightFrom;
    // this.cityName = para2.city;
    this.toAirpotName = FromData.fromAirpotName;
    this.toCityName = FromData.fromCityName;
    localStorage.setItem('toCity', FromData.fromCityName);
  }
  Initslider() {
   var  $that = this;
    $('.js-range-slider').ionRangeSlider({
      type: 'double',
      min: 0,
      max: 1000,
      from: 200,
      to: 500,
      prefix: '$',
      grid: true,
    });

    $('#price-range-submit').hide();

    $('#min_price,#max_price').on('change', function () {
      $('#price-range-submit').show();

      var min_price_range = parseInt($('#min_price').val());

      var max_price_range = parseInt($('#max_price').val());

      if (min_price_range > max_price_range) {
        $('#max_price').val(min_price_range);
      }

      $('#slider-range').slider({
        values: [min_price_range, max_price_range],
      });
    });

    $('#min_price,#max_price').on('paste keyup', function () {
      $('#price-range-submit').show();

      var min_price_range = parseInt($('#min_price').val());

      var max_price_range = parseInt($('#max_price').val());

      if (min_price_range == max_price_range) {
        max_price_range = min_price_range + 100;

        $('#min_price').val(min_price_range);
        $('#max_price').val(max_price_range);
      }

      $('#slider-range').slider({
        values: [min_price_range, max_price_range],
      });
      $('#slider-range').slider({
        range: true,
        orientation: 'horizontal',
        min: 0,
        max: 10000,
        values: [0, 10000],
        step: 100,
        slide: function (event: any, ui: any) {
          if (ui.values[0] == ui.values[1]) {
            return false;
          }

          $('#min_price').val(ui.values[0]);
          $('#max_price').val(ui.values[1]);
          return;
        },
      });

      $('#min_price').val($('#slider-range').slider('values', 0));
      $('#max_price').val($('#slider-range').slider('values', 1));
    });

    $('#slider-range,#price-range-submit').click(function () {
      var min_price = $('#min_price').val();
      var max_price = $('#max_price').val();

      $('#searchResults').text(
        'Here List of products will be shown which are cost between ' +
          min_price +
          ' ' +
          'and' +
          ' ' +
          max_price +
          '.'
      );
    });

    $('.price-slider').slider({
      range: true,
      min: 0,
      max: 24,
      values: [0, 20],
      slide: function (event: any, ui: any) {
        $('.price-value').text(ui.values[0] + ' hrs');
        $('.price-value2').text(ui.values[1] + ' hrs');
        $that.popularFilterFlightData();
      },
    });
    $('.price-value').text($('.price-slider').slider('values', 0) + ' hrs');
    $('.price-value2').text($('.price-slider').slider('values', 1) + ' hrs');
  }

  ResetStopOver()
  {
    $('.price-slider').slider('values', 0,0)
    $('.price-slider').slider('values', 1,24)
    $('.price-value').text($('.price-slider').slider('values', 0) + ' hrs');
    $('.price-value2').text($('.price-slider').slider('values', 1) + ' hrs');
    this.popularFilterFlightData();
  }
}
