import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
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
    const urlParam = this.route.snapshot.queryParams;
    this.searchData = urlParam;
    var flightSearchArr=[];
    for(var i=0;i<5;i++) // for generating array by object.
    {
      var objKeys=Object.keys(urlParam); // get all object Keys
      var objSearch={};
      for(var j=0;j<objKeys.length;j++)
      {

            if(objKeys[j].indexOf("["+i+"]")>-1)
            {
                var objKey= objKeys[j].substring(0, objKeys[j].length-3);
            var objKeyVal =urlParam[objKeys[j]];
            objSearch[objKey]=objKeyVal;
            }
      }
        console.log(objSearch)
        if(objSearch!=null && objSearch!=undefined && Object.keys(objSearch).length){
          flightSearchArr.push(objSearch); // Add object in array.
        }
    }
    this.searchData = flightSearchArr;
    console.log(flightSearchArr, "flightSearchArr");
  }

  flightSearch() {
    let searchObj = (this.searchData);
    console.log(searchObj , "getMulticityList");

    console.log(searchObj ,"searchObj");
    this.sub = this._flightService.getMulticityList(searchObj).subscribe((res: any) => {
      console.log(res , "response");
      // this.flightList = this.ascPriceSummaryFlighs(res.response.onwardFlights);
      // this.oneWayDate = res.responseDateTime;
      // this._flightService.flightListData = this.flightList;
      // this.flightListWithOutFilter = this.flightList;

    }, (error) => { console.log(error) });

  }

}
