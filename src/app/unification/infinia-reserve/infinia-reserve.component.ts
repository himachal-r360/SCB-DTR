import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-infinia-reserve',
  templateUrl: './infinia-reserve.component.html',
  styleUrls: ['./infinia-reserve.component.scss']
})
export class InfiniaReserveComponent implements OnInit {
  tabList = [{ title: 'Infinia Reserve', status: true },
  { title: 'Lifestyle Benefits', status: false },
  { title: 'Travel Benefits', status: false },
  { title: 'Emergency Support & Insurance', status: false },
  { title: 'No Charges', status: false },
  { title: 'Network Offers', status: false },
  { title: 'Rewards', status: false },
  { title: 'Welcome & Renewal Benefits', status: false },
  { title: 'Infinia Reserve Smartbuy Portal', status: false },
  ];
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

  scrollToElement(navData) {
    this.tabList.filter(data => {
      if(data.title == navData.title){
        data.status = true;
      }
      else {
        data.status = false;
      }
    })
    // navData.title.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  }
}
