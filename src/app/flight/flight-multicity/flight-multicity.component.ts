import { ViewportScroller } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SimpleGlobal } from 'ng2-simple-global';
import { repeat, Subscription } from 'rxjs';
import { FlightService } from 'src/app/common/flight.service';
import { environment } from 'src/environments/environment';

declare var $: any;
@Component({
  selector: 'app-flight-multicity',
  templateUrl: './flight-multicity.component.html',
  styleUrls: ['./flight-multicity.component.sass']
})
export class FlightMulticityComponent implements OnInit {
  cdnUrl: any;
  loader:boolean = false;
  sub?: Subscription;
  searchData:any;
  selectedTrip:number = 0;
  selectedTripData:any;
  flightList:any=  [];
  WithoutFilterFlightList : any = [];

  @ViewChild('itemsContainer', { read: ViewContainerRef }) container: ViewContainerRef;
  @ViewChild('item', { read: TemplateRef }) template: TemplateRef<any>;

pageIndex: number = 26;
ITEMS_RENDERED_AT_ONCE=25;
nextIndex=0;

  loadData() {
     if (this.pageIndex >= this.flightList.length) {
     return false;
      }else{
     this.nextIndex = this.pageIndex + this.ITEMS_RENDERED_AT_ONCE;

     if(this.nextIndex > this.flightList.length){
     this.nextIndex=this.flightList.length;
     }

    for (let n = this.pageIndex; n < this.nextIndex ; n++) {
     const context = {
        item: [this.flightList[n]]
      };

      this.container.createEmbeddedView(this.template, context);
    }
     this.pageIndex += this.ITEMS_RENDERED_AT_ONCE;

   }

   //$('.scrollToTop').trigger('click');
}


 private intialData() {
  this.loader = true;
    for (let n = 0; n <this.ITEMS_RENDERED_AT_ONCE ; n++) {
      if(this.flightList[n] != undefined)
      {
        const context = {
          item: [this.flightList[n]]
        };

        this.container.createEmbeddedView(this.template, context);
      }

    }
    this.loader = false;
    //this.pageIndex += this.ITEMS_RENDERED_AT_ONCE;
    //  this.gotoTop();
}

  constructor(private route: ActivatedRoute,private _flightService:FlightService,private sg: SimpleGlobal , private scroll: ViewportScroller) {
    this.cdnUrl = environment.cdnUrl+this.sg['assetPath'];
    $(window).scroll(function(this) {
      if($(window).scrollTop() + $(window).height() > $(document).height() - 300) {
        $('#endOfPage').trigger('click');
      }
    });
   }

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
    this.selectedTripData = this.searchData[0];
    var element = document.getElementById('Sector-area');
    if(element)
    {
      element.style.gridTemplateColumns = 'repeat('+this.searchData.length+',1fr)';
    }
    console.log(flightSearchArr, "flightSearchArr");
  }

  flightSearch() {
    this.loader = true;
    let searchObj = (this.searchData);
    console.log(searchObj , "getMulticityList");

    console.log(searchObj ,"searchObj");
    this.sub = this._flightService.getMulticityList(searchObj).subscribe((res: any) => {
      console.log(res , "response");
      this.WithoutFilterFlightList = res.response.journeys;
      this.flightList = res.response.journeys[0].sectors;
      console.log(this.flightList)
      if(this.container)
      {
        this.container.clear();
        this.intialData();
      }

      // this.flightList = this.ascPriceSummaryFlighs(res.response.onwardFlights);
      // this.oneWayDate = res.responseDateTime;
      // this._flightService.flightListData = this.flightList;
      // this.flightListWithOutFilter = this.flightList;

    }, (error) => { console.log(error) });

  }

  activeSelectedTrip(i : number)
  {
    this.selectedTripData = this.searchData[i];
    this.selectedTrip = i;
    this.flightList = [];
    this.flightList = this.WithoutFilterFlightList[i].sectors;
    if(this.container)
      {
        this.container.clear();
        this.intialData();
      }
  }

}
