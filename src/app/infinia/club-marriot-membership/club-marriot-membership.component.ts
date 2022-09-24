import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-club-marriot-membership',
  templateUrl: './club-marriot-membership.component.html',
  styleUrls: ['./club-marriot-membership.component.sass']
})
export class ClubMarriotMembershipComponent implements OnInit {
  membership = [
    { title: "Unique Dining Experience", offerMsg: 'Up to a 20% off on the food and beverage bill at the restaurants ', img: "assets/images/club-merriot/Rectangle 10011.png" },
    { title: "Endless Travel",  offerMsg: 'Up to a 20% off on the Best Available Rates on rooms at participating Marriott hotels in India ', img: "assets/images/club-merriot/Rectangle 10015.png" },
    { title: "Blissfull Relaxation", offerMsg: '20% off on Spa services at participating Marriott spas in India between', img: "assets/images/club-merriot/Rectangle 10016.png" },
    { title: "Marriott Certificates", offerMsg: 'One certificate each for upgrade to next category room and 30% off on Best available rate on base category of room', img: "assets/images/club-merriot/Rectangle 10017.png" }

  ]
  

  constructor() { }

  ngOnInit(): void {
  }

}
