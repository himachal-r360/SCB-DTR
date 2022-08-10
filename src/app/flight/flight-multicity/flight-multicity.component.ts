import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { FlightService } from 'src/app/common/flight.service';

@Component({
  selector: 'app-flight-multicity',
  templateUrl: './flight-multicity.component.html',
  styleUrls: ['./flight-multicity.component.sass']
})
export class FlightMulticityComponent implements OnInit {
  sub?: Subscription;
  searchData:any;
  constructor(private route: ActivatedRoute,private _flightService:FlightService) { }

  ngOnInit(): void {
    this.getQueryParamData();
    this.flightSearch();
  }

  getQueryParamData(){
    const params = this.route.snapshot.queryParams;
    this.searchData = params
    console.log(params, "params");
  }

  flightSearch() {
    let searchObj = (this.searchData);
    console.log(searchObj ,"searchObj");
    this.sub = this._flightService.flightList(searchObj).subscribe((res: any) => {
      console.log(res , "response");
      // this.flightList = this.ascPriceSummaryFlighs(res.response.onwardFlights);
      // this.oneWayDate = res.responseDateTime;
      // this._flightService.flightListData = this.flightList;
      // this.flightListWithOutFilter = this.flightList;

    }, (error) => { console.log(error) });

  }

}
