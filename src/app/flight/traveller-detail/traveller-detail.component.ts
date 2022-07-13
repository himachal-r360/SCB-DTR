import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightService } from 'src/app/common/flight.service';
import { FareSummaryComponent } from '../fare-summary/fare-summary.component';
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
  selector: 'app-traveller-detail',
  templateUrl: './traveller-detail.component.html',
  styleUrls: ['./traveller-detail.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class TravellerDetailComponent implements OnInit,OnDestroy {
  travelerDetails:any={};
  travellerDetailsArr:any;
  toggleAdult:boolean= false;
  toggleChild:boolean = false;
  infantToggle:boolean = false;
  adultDetailList:any[]=[];
  checked:any= false;
  whatsAppCheck:boolean = true;
  gstNumber:any
  mobileNumber:any;
  email:any
  InputArray:any;
  adultArr:any;
  adultArrData:any;
  flightDetails:any
  selectedVendor:any;
  adultsCount:number=0;
  EMIAvailableLimit: number = 3000;
  EMI_interest: number = 16;
  randomFlightDetailKey:any;
  sessionTimer:any = 3;
  timeLeft:any = 900;
  BaseFare:any;
  Tax:any;
  TotalFare:any;
  baggageInfo:any;
  travellerDetailsForm!:any;
  
  // adultDetail!:FormArray;
  
  
  // addAdultDetail: any = this._fb.group({
  //   firstName:['',[Validators.required]],
  //   lastName:['',[Validators.required]],
  //   dateOfBirth:['',[Validators.required]],
  //   gender:[]
  // })

  addChildDetail: any = this._fb.group({
    firstName:[],
    lastName:[],
    dateOfBirth:[],
    gender:[]
  })

  // addChildDetail: any = this._fb.group({})

  addInfantDetail: any = this._fb.group({
  
  })


  constructor(private _fb: FormBuilder, private _flightService:FlightService ,private route:ActivatedRoute ,private router:Router) {
    this.startTimer();
    this.travellerDetailsForm = this._fb.group({
      adult : this._fb.array([]),
      child : this._fb.array([]),
      infant : this._fb.array([]),
    })
    

   }

  ngOnInit(): void {  


    this.getQueryParamData()
    let parseVal:any = sessionStorage.getItem('searchVal')
    this.travelerDetails = JSON.parse(parseVal);
    // this.travelerDetails.adults=parseInt(this.travelerDetails.adults);
    // this.adultsCount=parseInt(this.travelerDetails.adults);
    // this.travelerDetails.child=parseInt(this.travelerDetails.child);
    // this.travelerDetails.infants=parseInt(this.travelerDetails.infants);
    // console.log(this.travelerDetails);
    this.InputArray =
    {
      adult: this.GetArrOfTravellerDetails(parseInt(this.travelerDetails.adults)),
      child:this.GetArrOfTravellerDetails(parseInt(this.travelerDetails.child)),
      infants:this.GetArrOfTravellerDetails(parseInt(this.travelerDetails.infants)),
      email:"",
      mobileNumber:"",
      gstNumber:"",
    }
    // this.adultArr=this.GetArrOfTravellerDetails(parseInt(this.travelerDetails.adults));
    //   this.addAdultDetail = this.InputArray.adult;
    //   this.addChildDetail = this.InputArray.adult;
    //   this.addInfantDetail = this.InputArray.infants;
    this.getFlightDetails()

  }

  addAdultForm(){
    this.toggleAdult =! this.toggleAdult
    let adults = this.travellerDetailsForm.get('adult') as FormArray;
    adults.push(this._fb.group({
      // Id:['', [Validators.required]],
      firstName:['', [Validators.required]],
      lastName:['', [Validators.required]],
      dateOfBirth:['', [Validators.required]],
      gender:['Male']
    }));
    console.log(adults , "adult");
    
  }

  // addAdult(){
  //   this.toggleAdult =! this.toggleAdult
  //   let adult = this.travellerDetailsForm.get('customerInfo') as FormArray;
  //   adult.push(this._fb.group({
  //     firstName : ['', [Validators.required]],
  //     lastName : ['', [Validators.required]],
  //     dateOfBirth:['',[Validators.required]],
  //     gender:['Male']
  //   }));
  // }

  public Error = (controlName: string, errorName: string) => {
    return this.travellerDetailsForm.controls[controlName].hasError(errorName);
  };

  getQueryParamData() {
    this.route.queryParams
      .subscribe((params: any) => {
        this.randomFlightDetailKey = params.searchFlightKey;
        sessionStorage.getItem(this.randomFlightDetailKey);
      });
   }


  getFlightDetails(){
    let flightDetailsArrVal:any=sessionStorage.getItem(this.randomFlightDetailKey);
    let param=JSON.parse(flightDetailsArrVal);
      if(param!=null){
        this.flightDetails = param.flights;
        this.selectedVendor = param.priceSummary;  
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
      }
  }




  getAdultGenderValue(gender:any , i:any){
    // this.InputArray.adult[i].gender = gender; 
    
    this.travellerDetailsForm.value.adult[i].gender = gender; 
    console.log(this.travellerDetailsForm);
    if(gender == "Male"){ }
    else if(gender == "Female"){}
  }
  getChildGenderValue(gender:any , i:any){
    this.travellerDetailsForm.value.child[i].gender = gender; 
    // this.InputArray.child[i].gender = gender;
    if(gender == "Male"){}
    else if(gender == "Female"){}
  }
  getInfantsGenderValue(gender:any , i:any){
    this.travellerDetailsForm.value.intant[i].gender = gender; 
    // this.InputArray.infants[i].gender = gender;
    if(gender == "Male"){}
    else if(gender == "Female" ){}
  }

  GetArrOfTravellerDetails(detailsCount:any)
  {
    console.log(detailsCount);
    
      //let resultArr=[];
      for(let i=0;i<detailsCount;i++){
          // let traverller_obj={Id:i, firstName:'', lastName:'', dateOfBirth:'' ,gender:'Male'}
          // resultArr.push(traverller_obj);
          this.addAdultForm();
      }
      //return resultArr;
  }
  
  
  postAdultDetails(){
    this.toggleAdult =! this.toggleAdult
    // this.InputArray.adult.push();
    this.travellerDetailsArr= this.InputArray;
    
    
    // this.adultArrData.push();
 
    // let travellerDetailsObj={adults:[],Child:[],infant:[] }
    //   let traverller_obj={Id:0, FirstName:'', LastName:'', DOB:''};
    //   let adultArr=[];
    //       for(let i=0;i<adult;i++){
    //       traverller_obj={Id:i, FirstName:'', LastName:'', DOB:''}
    //       console.log(traverller_obj);
    //       adultArr.push(traverller_obj);
    //   }

  }

  postChildDetails(){
    this.toggleChild =! this.toggleChild
    this.InputArray.child.push();
    this.travellerDetailsArr= this.InputArray;
    
  }

  postInfantDetails(){
    this.infantToggle =! this.infantToggle
    this.InputArray.infants.push();
    this.travellerDetailsArr= this.InputArray;
    

  }

  saveTravellerHistory(para:any){
    this.checked = para.target.checked;
    localStorage.setItem('isCheckedTravellerDetails', this.checked);
    if(this.checked == true){
      let saveTravellerDetailsArr :any ;
      saveTravellerDetailsArr = this.InputArray
      localStorage.setItem('travellerDetailsArray' , JSON.stringify(saveTravellerDetailsArr));
    }
  }
  
  calculateEMI(amount: number) {
    return Math.round((amount + (amount * (this.EMI_interest / 100))) / 12);
  }

  
  continueTravellerDetails(){
    // if(this.InputArray){
    //   return
    // }
    // else{
    //   localStorage.setItem('finalTravellerDetail',JSON.stringify(this.InputArray));  
    // }
    this.travellerDetailsForm.markAllAsTouched();
  }

  ngOnDestroy(): void {
    if(this.sessionTimer){
      clearInterval(this.sessionTimer);
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
  

}
