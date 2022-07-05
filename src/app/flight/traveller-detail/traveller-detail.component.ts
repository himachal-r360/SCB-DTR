import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { FlightService } from 'src/app/common/flight.service';
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
  travelerDetails:any;
  toggleAdult:boolean= false;
  toggleChild:boolean = false;
  infantToggle:boolean = false;
  adultDetailList:any[]=[];
  activeMaleClass:boolean=true;
  activeFemaleClass:boolean= false;
  InputArray:any;
  adultArrData:any;
  addAdultDetail: any = this._fb.group({
    firstName:[],
    lastName:[],
    dateOfBirth:[],
    gender:["Male"]
  })
  addChildDetail: any = this._fb.group({
    firstName:[],
    lastName:[],
    dateOfBirth:[],
    gender:[]
  })
  addInfantDetail: any = this._fb.group({
    firstName:[],
    lastName:[],
    dateOfBirth:[],
    gender:[]
  })

  constructor(private _fb: FormBuilder, private _flightService:FlightService) { }

  ngOnInit(): void {  
    let parseVal:any = localStorage.getItem('searchVal')
    this.travelerDetails = JSON.parse(parseVal);
    // console.log(this.travelerDetails);
    
    this.InputArray=
    {
      adult: this.GetArrOfTravellerDetails(parseInt(this.travelerDetails.adults)),
      child:this.GetArrOfTravellerDetails(parseInt(this.travelerDetails.child)),
      infants:this.GetArrOfTravellerDetails(parseInt(this.travelerDetails.infants))
    }
    console.log(this.InputArray);
  }

  getGenderValue(gender:any){
    if(gender == "Male"){
      this.addAdultDetail.value.gender = gender;
      this.activeMaleClass = true;
      this.activeFemaleClass = false;
    }
    else if(gender == "Female"){
      this.addAdultDetail.value.gender = gender;
      this.activeMaleClass = false;
      this.activeFemaleClass = true;
    }
 
     console.log(gender) ;

  }

  GetArrOfTravellerDetails(detailsCount:any)
  {
      let resultArr=[];
      for(let i=0;i<detailsCount;i++){
          let traverller_obj={Id:i, firstName:'', lastName:'', dateOfBirth:''}
          resultArr.push(traverller_obj);
      }
      return resultArr;
  }
  
  
  postAdultDetails(){
    this.toggleAdult =! this.toggleAdult
    // this.addAdultDetail.value.firstName = this.InputArray.adult.firstName
    console.log(this.InputArray,"form");
    this.InputArray.adult.push();
    this.adultArrData.push();
 
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

  }

  postInfantDetails(){

  }
    

}
