import { Component, DebugNode, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightService } from 'src/app/common/flight.service';
import { Location } from '@angular/common';







declare var $: any;

@Component({
  selector: 'app-flight-detail',
  templateUrl: './flight-detail.component.html',
  styleUrls: ['./flight-detail.component.css']
})
export class FlightDetailComponent implements OnInit ,OnDestroy {
  flightDetails:any;
  selectedVendor:any;
  flightIcons:any;
  airportsNameJson:any;
  EMI_interest: number = 16;
  EMIAvailableLimit: number = 3000;
  getsearchVal:any;
  parseSearchVal:any;
  getFlightDetailLocalStorage:any;
  totalDuration:number=0;
  randomFlightDetailKey:any;
  BaseFare:any;
  Tax:any;
  TotalFare:any;
  sessionTimer:any = 3;
  timeLeft:any = 900;
  baggageInfo:any;
  flightDetailsArrVal:any;


  constructor(private _flightService:FlightService, private route:ActivatedRoute ,private router:Router) { 
    this.startTimer();
  }

  ngOnInit(): void {
    this.getQueryParamData();
    this.getsearchVal = sessionStorage.getItem('searchVal');
    this.parseSearchVal = JSON.parse(this.getsearchVal);
    this.getFlightIcon();
    this.getAirpotsList();
    // setTimeout(() => {
    this.getFlightDetails();

    // }, 100);
  }

  getQueryParamData() {
      this.route.queryParams
        .subscribe((params: any) => {
        this.randomFlightDetailKey = params.searchFlightKey
          sessionStorage.getItem(this.randomFlightDetailKey);
        });
  }

  getFlightDetails(){
    //this._flightService.getFlightDetailsVal()

     this.flightDetailsArrVal=sessionStorage.getItem(this.randomFlightDetailKey);
    let param=JSON.parse(this.flightDetailsArrVal);
      if(param!=null){
        this.flightDetails = param.flights;
        this.selectedVendor = param.priceSummary;
        this.selectedVendor = param.priceSummary;
        // var onwardFlightFareKey = (param.priceSummary.clearTripFareKey != undefined && param.priceSummary.clearTripFareKey != null  ? param.priceSummary.clearTripFareKey : "");
        var onwardFlightFareKey = JSON.parse(param.priceSummary.ctFareObject);
        var body = {
          "docKey": param.docKey,
          "flightKeys": [
            param.flightKey
          ],
          "partnerName": this.selectedVendor.partnerName,
          // "onwardFlightFareKey": onwardFlightFareKey,
          "onwardFlightFareKey": onwardFlightFareKey.ItineraryKey,
          "returnFlightFareKey": "",
          "splrtFlight": this.selectedVendor.splrtFareFlight
        }
        this.getFlightInfo(body);
        this.durationCalc();
      }

    // this._flightService.getFlightDetailsVal().subscribe((param:any)=>{
    //   if(param!=null){
    //     this.flightDetails = param.flights;
    //     this.selectedVendor = param.priceSummary;
    //   }
    // })
  }

    // Get flight Icons
    getFlightIcon(){
      this._flightService.getFlightIcon().subscribe((res:any)=>{
        this.flightIcons = res;
      })
    }

    ConvertObjToQueryString(obj: any) {
      var str = [];
      for (var p in obj)
        if (obj.hasOwnProperty(p)) {
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
      return str.join("&");
    }


    startTimer() {
      this.sessionTimer = setInterval(() => {
        if(this.timeLeft > 0) {
          this.timeLeft--;
        
        } else if( this.timeLeft == 0) {
          // setTimeout(() => {
            let searchVal:any = sessionStorage.getItem('searchVal')
            let url="flight-list?"+ this.ConvertObjToQueryString(JSON.parse(searchVal));
            this.router.navigateByUrl(url);
          //  });
        }
      },1000)
    
    }
    


  // get airport list
  getAirpotsList() {
    this._flightService.getAirportName().subscribe((res:any)=>{
      this.airportsNameJson = res;
    })
  }

  calculateEMI(amount: number) {
    return Math.round((amount + (amount * (this.EMI_interest / 100))) / 12);
  }

  // getLayoverHour(obj1:any, obj2:any)
  // {

  //   let dateHour:any;
  //   if(obj2!=null || obj2!=undefined)
  //   {

  //     let obj2Date=new Date(obj2.departureDateTime);
  //     let obj1Date=new Date(obj1.arrivalDateTime);
  //     dateHour=(obj2Date.valueOf()-obj1Date.valueOf())/1000;

  //   }
  //   return dateHour;
  // }
  dateHour:any;
  getLayoverHour(obj1:any, obj2:any)
  {
    if(obj2!=null || obj2!=undefined)
    {
      let obj2Date=new Date(obj2.departureDateTime);
      let obj1Date=new Date(obj1.arrivalDateTime);
      this.dateHour=(obj2Date.valueOf()-obj1Date.valueOf())/1000;
    }
  }

  durationCalc(){
    this.totalDuration=0;
    for(let i = 0;i<this.flightDetails.length;i++){
      this.totalDuration+=this.flightDetails[i].duration;
      if(this.flightDetails[i+1]!=null && this.flightDetails[i+1]!=undefined){
        this.getLayoverHour(this.flightDetails[i],this.flightDetails[i+1]);
      }
    }
  }

  changeFareRuleTab(event:any){
    $('.flight-extra-content').hide();
    $('.flight-extra-tabs li a').removeClass('flight-extra-tabs-active');
    var Element = document.getElementById(event.target.dataset['bind']);
    Element!.style.display = 'block';
    event.target.classList.add('flight-extra-tabs-active');
  }


  getFlightInfo(param:any)
  {
    this._flightService.getFlightInfo(param).subscribe((res: any) => {
      if(res.statusCode ==200)
      {
        this.BaseFare =res.response.comboFare.onwardBaseFare;
        this.Tax =res.response.comboFare.onwardTax;
        this.TotalFare =res.response.comboFare.onwardTotalFare;
        this.baggageInfo = res.response.onwardFlightDetails
        }
    }, (error) => { console.log(error) });
  }

  ngOnDestroy(): void {
    if(this.sessionTimer){
      clearInterval(this.sessionTimer);
    }
  }

  sendFlightDetails(){
    let randomFlightDetailKey = this.getRandomString(44);
    sessionStorage.setItem(randomFlightDetailKey, this.flightDetailsArrVal);
    let url = 'flight-booking/traveller-detail?searchFlightKey=' + randomFlightDetailKey;
    this.router.navigateByUrl(url);
  }

  // get rendom string value
  getRandomString(length: any) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random()*charactersLength));
    }
    return result;
  }

}
