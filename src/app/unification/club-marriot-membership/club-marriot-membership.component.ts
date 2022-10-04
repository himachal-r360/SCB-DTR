import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-club-marriot-membership',
  templateUrl: './club-marriot-membership.component.html',
  styleUrls: ['./club-marriot-membership.component.scss']
})
export class ClubMarriotMembershipComponent implements OnInit {
  membership = [
    { title: "Unique Dining Experience", offerMsg: 'Up to a 20% off on the food and beverage bill at the restaurants ', img: "assets/images/club-merriot/Rectangle 10011.png" },
    { title: "Endless Travel",  offerMsg: 'Up to a 20% off on the Best Available Rates on rooms at participating Marriott hotels in India ', img: "assets/images/club-merriot/Rectangle 10015.png" },
    { title: "Blissfull Relaxation", offerMsg: '20% off on Spa services at participating Marriott spas in India between', img: "assets/images/club-merriot/Rectangle 10016.png" },
    { title: "Marriott Certificates", offerMsg: 'One certificate each for upgrade to next category room and 30% off on Best available rate on base category of room', img: "assets/images/club-merriot/Rectangle 10017.png" }

  ]

  inClud = [
    {title:"Weekends at Marriot" , desc:"Unwind and relax with a short gateway over the weekend" ,img:"assets/images/infinia/experiences/experiences1.png"},
    {title:"Weekends at Marriot" , desc:"Unwind and relax with a short gateway over the weekend" ,img:"assets/images/infinia/experiences/experiences1.png"},
    {title:"Weekends at Marriot" , desc:"Unwind and relax with a short gateway over the weekend" ,img:"assets/images/infinia/experiences/experiences1.png"}
  ]

  customOptions: OwlOptions = {
    loop: false,
    autoplay:false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    margin: 10,
    navText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: true
  }
  

  constructor() { }

  ngOnInit(): void {
  }

}
