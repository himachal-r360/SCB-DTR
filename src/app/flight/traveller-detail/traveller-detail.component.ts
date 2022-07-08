import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
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
export class TravellerDetailComponent implements OnInit {
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
  
 

  addAdultDetail: any = this._fb.group({

  })
  // addChildDetail: any = this._fb.group({
  //   firstName:[],
  //   lastName:[],
  //   dateOfBirth:[],
  //   gender:[]
  // })

  addChildDetail: any = this._fb.group({})

  addInfantDetail: any = this._fb.group({
  
  })


  constructor(private _fb: FormBuilder, private _flightService:FlightService) { }

  ngOnInit(): void {  
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
    this.adultArr=this.GetArrOfTravellerDetails(parseInt(this.travelerDetails.adults));

      this.addAdultDetail = this.InputArray.adult;
      this.addChildDetail = this.InputArray.adult;
      this.addInfantDetail = this.InputArray.infants;

      
      console.log(this.addAdultDetail , "adult form")
      console.log(this.addInfantDetail,"infant form");
      console.log(this.addChildDetail,"child form");

    
    this.getFlightDetails()
    
  }

  getFlightDetails(){
    let flightDetailsArrVal:any=sessionStorage.getItem("flightDetailsArr");
    let param=JSON.parse(flightDetailsArrVal);
      if(param!=null){
        this.flightDetails = param.flights;
        this.selectedVendor = param.priceSummary;  
      }
  }

  getAdultGenderValue(gender:any , i:any){
    this.InputArray.adult[i].gender = gender; 
    if(gender == "Male"){
      
    }
    else if(gender == "Female"){
      
    }
  }

  getChildGenderValue(gender:any , i:any){
    this.InputArray.child[i].gender = gender;
    if(gender == "Male"){
    
    }
    else if(gender == "Female"){
    
    }
  }
  getInfantsGenderValue(gender:any , i:any){
    this.InputArray.infants[i].gender = gender;
    if(gender == "Male"){
      
    }
    else if(gender == "Female" ){
      
    }
  }
  GetArrOfTravellerDetails(detailsCount:any)
  {
      let resultArr=[];
      for(let i=0;i<detailsCount;i++){
          let traverller_obj={Id:i, firstName:'', lastName:'', dateOfBirth:'' ,gender:'Male'}
          resultArr.push(traverller_obj);
      }
      return resultArr;
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
    if(this.InputArray){
      return
    }
    else{
      localStorage.setItem('finalTravellerDetail',JSON.stringify(this.InputArray));  
      console.log("called function");

    }
      
   
  }

}
