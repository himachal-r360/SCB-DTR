import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.sass']
})
export class HotelListComponent implements OnInit {
  searchData:any;
  constructor(private route:ActivatedRoute) { }

  ngOnInit(): void {
  }


}
