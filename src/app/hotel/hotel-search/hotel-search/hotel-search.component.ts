import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HotelService } from 'src/app/common/hotel.service';

@Component({
  selector: 'app-hotel-search',
  templateUrl: './hotel-search.component.html',
  styleUrls: ['./hotel-search.component.sass']
})
export class HotelSearchComponent implements OnInit ,OnDestroy {
  hotelSearchForm:any; 
  sub:Subscription;
  hotelList:any;
  cityList:any;

  @ViewChild('hideShowCity')hideShowCity:ElementRef;
  @ViewChild('showHideGuest')showHideGuest:ElementRef;

  constructor( private _fb: FormBuilder, private _hotelService:HotelService) { 
    this.hotelSearchForm = this._fb.group({
      checkIn: ['2022-09-06'],
      checkOut: ['2022-09-07'],
      noOfRooms: ['1'],
      city: ['New Delhi'],
      country: ['IN'],
      scr: ['INR'],
      sct:['IN'],
      hotelName:[''],
      latitude:[''],
      longitude:[''],
      area:[''],
      hotelId:[''],
      // rooms:[[{"room":1,"numberOfAdults":"2","numberOfChildren":"0"}]],
      rooms:this._fb.array([
       { room: 1, numberOfAdults: '1',numberOfChildren:'0'}
      ]),
      channel:['Web'],
      programName:['SMARTBUY'],
      pageNumber:[0],
      limit:[0],
      numberOfRooms:[1]
    });
  }

  ngOnInit(): void {
    
  }

  showCity(val){
    if(val == 'show'){
      this.hideShowCity.nativeElement.style.display="block";
    }
    else{
      this.hideShowCity.nativeElement.style.display="none";
    }
      
  }

  increaseChild(i) {
    debugger
    let parseChild:any;
    let totalChild:any = this.roomsDetails.controls[i].get('numberOfChildren').setValue(parseChild + 1);
    if(parseChild < 5)  {
    totalChild = parseChild.setValue()
   
  }
  console.log(totalChild);
  
    
  // if (parseInt(this.flightData.value.child) < 9) {
  //   this.flightData
  //     .get('child')
  //     .setValue(parseInt(this.flightData.value.child) + 1);
  //   this.totalPassenger =
  //     parseInt(this.flightData.value.adults) +
  //     parseInt(this.flightData.value.child) +
  //     parseInt(this.flightData.value.infants);
  //   if (this.totalPassenger == 9) {
  //     this.disableParent = true;
  //     this.disablechildren = true;
  //     this.disableinfants = true;
  //   }
  // }
       

 
  }

  decreaseChild(i) {
    // if (parseInt(this.flightData.value.child) > 0) {
    //   this.flightData
    //     .get('child')
    //     .setValue(parseInt(this.flightData.value.child) - 1);
    //   this.totalPassenger =
    //     parseInt(this.flightData.value.adults) +
    //     parseInt(this.flightData.value.child) +
    //     parseInt(this.flightData.value.infants);
    //   if (this.totalPassenger < 9) {
    //     this.disableParent = false;
    //     this.disablechildren = false;
    //     if (
    //       parseInt(this.flightData.value.infants) ==
    //       parseInt(this.flightData.value.adults)
    //     ) {
    //       this.disableinfants = true;
    //     } else {
    //       this.disableinfants = false;
    //     }
    //   }
    // }
  }


  showGuest(val){
    if(val == 'show'){
      this.showHideGuest.nativeElement.style.display="block";
    }
    else{
      this.showHideGuest.nativeElement.style.display="none";
    }
  }

  get roomsDetails() : FormArray {
    return this.hotelSearchForm.controls["rooms"] as FormArray
  }

  personDetails(): FormGroup {
    return this._fb.group({
      room: [],
      numberOfAdults: [''],
      numberOfChildren:['']
    })
 }

 addDetails() {
  this.roomsDetails.push(this.personDetails());
}

removeDetails(i:number) {
  this.roomsDetails.removeAt(i);
}


  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  searchHotel(){
    debugger;
     this.sub =  this._hotelService.getHotelList(this.hotelSearchForm.value).subscribe((res:any)=>{
       this.hotelList = res;
      console.log(this.hotelList, "hotel search ")
      },(error)=>{console.log(error)});
  }


  


}
