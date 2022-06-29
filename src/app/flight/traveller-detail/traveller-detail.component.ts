import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-traveller-detail',
  templateUrl: './traveller-detail.component.html',
  styleUrls: ['./traveller-detail.component.css']
})
export class TravellerDetailComponent implements OnInit {
  travelerDetails:any;
  constructor() { }

  ngOnInit(): void {  
    let parseVal:any = localStorage.getItem('searchVal')
    this.travelerDetails = JSON.parse(parseVal);
    console.log(this.travelerDetails ,"travel details");
    

  }

}
