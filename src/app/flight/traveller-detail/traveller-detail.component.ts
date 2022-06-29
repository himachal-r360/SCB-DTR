import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
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
  addAdultDetail: any = this._fb.group({
      firstName:[],
      lastName:[],
      dateOfBirth:[]
  })
  addChildDetail: any = this._fb.group({
    firstName:[],
    lastName:[],
    dateOfBirth:[]
})

addInfantDetail: any = this._fb.group({
  firstName:[],
  lastName:[],
  dateOfBirth:[]
})



  constructor(private _fb: FormBuilder,) { }

  ngOnInit(): void {  
    let parseVal:any = localStorage.getItem('searchVal')
    this.travelerDetails = JSON.parse(parseVal);
    console.log(this.travelerDetails ,"travel details");

  }

  postAdultDetails(){
    this.toggleAdult =! this.toggleAdult
    if(this.toggleAdult == false){
      console.log(this.addAdultDetail.value);
    }
    
  }

  postChildDetails(){

  }

  postInfantDetails(){

  }
    

}
