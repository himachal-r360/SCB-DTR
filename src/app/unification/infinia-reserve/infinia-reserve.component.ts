import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-infinia-reserve',
  templateUrl: './infinia-reserve.component.html',
  styleUrls: ['./infinia-reserve.component.scss']
})
export class InfiniaReserveComponent implements OnInit {
  tabList = ['Infinia Reserve', 'Lifestyle Benefits', 'Travel Benefits', 'Emergency Support & Insurance', 'No Charges', 'Network Offers', 'Rewards', 'Welcome & Renewal Benefits', 'Infinia Reserve Smartbuy Portal'];
  securedCardImg = [
    {
      title: '100% limit coverage in case of fraudulent transactions.',
      img: '/assets/infinia/images/know-your-card/secured_1.png'
    },
    {
      title: 'Dedicated Risk management desk which supports with transaction declines/ authorisation issues.',
      img: '/assets/infinia/images/know-your-card/secured_2.png'
    },
    {
      title: 'Easy limit enhancements for large transactions.',
      img: '/assets/infinia/images/know-your-card/secured_3.png'
    }
  ];
  constructor() { }

  ngOnInit() {
  }

}
