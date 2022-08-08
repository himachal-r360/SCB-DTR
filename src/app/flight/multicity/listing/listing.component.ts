import { Component, OnInit } from '@angular/core';
import { FlightService } from 'src/app/common/flight.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss']
})
export class ListingComponent implements OnInit {
  isMobile:boolean= true;
  loader = false;
  sub?: Subscription;
  constructor(private _flightService: FlightService) { }

  ngOnInit(): void {
    this.isMobile = window.innerWidth < 991 ?  true : false;
    this.loader = true;
    this.multicitySearch();
  }
  multicitySearch(){
    this.loader = true;
    this.sub = this._flightService
              .multicityList('')
              .subscribe((res: any) => {
                
    });
  }

}
