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
  travelerDetails:any={};
  travellerDetailsArr:any;
  toggleAdult:boolean= false;
  toggleChild:boolean = false;
  infantToggle:boolean = false;
  adultDetailList:any[]=[];
  activeMaleClass:boolean=true;
  activeFemaleClass:boolean= false;
  activeChildMaleClass:boolean = true;
  activeChildFemaleClass:boolean = false
  activeInfantMaleClass:boolean = true;
  activeInfantFemaleClass:boolean = false;
  checked:any= false;
  whatsAppCheck:boolean = true;
  gstNumber:any
  mobileNumber:any;
  email:any
  InputArray:any;

  adultArr:any;
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
  adultsCount:number=0;

  constructor(private _fb: FormBuilder, private _flightService:FlightService) { }

  ngOnInit(): void {  
    let parseVal:any = localStorage.getItem('searchVal')
    this.travelerDetails = JSON.parse(parseVal);
    
    // this.travelerDetails.adults=parseInt(this.travelerDetails.adults);
    // this.adultsCount=parseInt(this.travelerDetails.adults);
    // this.travelerDetails.child=parseInt(this.travelerDetails.child);
    // this.travelerDetails.infants=parseInt(this.travelerDetails.infants);
    // console.log(this.travelerDetails);
    this.InputArray=
    {
      adult: this.GetArrOfTravellerDetails(parseInt(this.travelerDetails.adults)),
      child:this.GetArrOfTravellerDetails(parseInt(this.travelerDetails.child)),
      infants:this.GetArrOfTravellerDetails(parseInt(this.travelerDetails.infants)),
    }
    this.adultArr=this.GetArrOfTravellerDetails(parseInt(this.travelerDetails.adults));
    console.log(this.checked);
    console.log(this.InputArray);
  }

  getAdultGenderValue(gender:any , i:any){
    this.InputArray.adult[i].gender = gender; 
    if(gender == "Male"){
      this.activeMaleClass = !this.activeMaleClass;
      this.activeFemaleClass = !this.activeFemaleClass;
    }
    else if(gender == "Female"){
      this.activeMaleClass = !this.activeMaleClass;
      this.activeFemaleClass = !this.activeFemaleClass;
    }
  }

  getChildGenderValue(gender:any , i:any){
    this.InputArray.child[i].gender = gender;
    if(gender == "Male"){
      this.activeChildMaleClass =! this.activeChildMaleClass;
      this.activeChildFemaleClass =! this.activeChildFemaleClass;
    }
    else if(gender == "Female"){
      this.activeChildMaleClass =! this.activeChildMaleClass;
      this.activeChildFemaleClass =! this.activeChildFemaleClass;
    }
  }
  getInfantsGenderValue(gender:any , i:any){
    this.InputArray.infants[i].gender = gender;
    if(gender == "Male"){
      this.activeInfantMaleClass =! this.activeInfantMaleClass;
      this.activeInfantFemaleClass =! this.activeInfantFemaleClass;
    }
    else if(gender == "Female" ){
      this.InputArray.infants[i].gender = gender;
      this.activeInfantMaleClass =! this.activeInfantMaleClass;
      this.activeInfantFemaleClass =! this.activeInfantFemaleClass;
    }
  }
  GetArrOfTravellerDetails(detailsCount:any)
  {
      let resultArr=[];
      for(let i=0;i<detailsCount;i++){
          let traverller_obj={Id:i, firstName:'', lastName:'', dateOfBirth:'' ,gender:''}
          resultArr.push(traverller_obj);
      }
      return resultArr;
  }
  
  
  postAdultDetails(){
    this.toggleAdult =! this.toggleAdult
    // this.InputArray.adult.push();
    this.travellerDetailsArr= this.InputArray;
    console.log(this.travellerDetailsArr , "traveller");
    console.log(this.InputArray.adult,"adult");
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
    console.log(this.InputArray.child,"child");
  }

  postInfantDetails(){
    this.infantToggle =! this.infantToggle
    this.InputArray.infants.push();
    this.travellerDetailsArr= this.InputArray;
    console.log(this.InputArray.infants,"Infants");

  }

  saveTravellerHistory(para:any){
    this.checked = para.target.checked;
    localStorage.setItem('isCheckedTravellerDetails', this.checked);
    if(this.checked == true){
      let saveTravellerDetailsArr :any ;
      saveTravellerDetailsArr = this.InputArray
      console.log(saveTravellerDetailsArr,"save details");
      
      localStorage.setItem('travellerDetailsArray' , JSON.stringify(saveTravellerDetailsArr));
    }
  }
    

}
