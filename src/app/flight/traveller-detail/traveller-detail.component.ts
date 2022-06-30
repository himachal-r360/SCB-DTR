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
    console.log(this.travelerDetails ,"travel details");
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

  postAdultDetails(){
    this.toggleAdult =! this.toggleAdult
    if(this.toggleAdult == false){
      this.adultDetailList.push(this.addAdultDetail.value)
      this.addAdultDetail.reset()
      // this._flightService.setTravellerDetails(JSON.stringify(this.addAdultDetail.value));

    }
  }


  


  postChildDetails(){

  }

  postInfantDetails(){

  }
    

}
