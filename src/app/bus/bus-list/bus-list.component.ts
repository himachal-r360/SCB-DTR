import { AfterViewInit, Component, ComponentFactoryResolver, ElementRef, HostListener,  OnDestroy, OnInit, ViewChild,ViewContainerRef,TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BusService } from 'src/app/shared/services/bus.service';
import { Location, ViewportScroller } from '@angular/common';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { Options } from '@angular-slider/ngx-slider';
import { SELECT_ITEM_HEIGHT_EM } from '@angular/material/select/select';
import { SimpleGlobal } from 'ng2-simple-global';
import {environment} from '../../../environments/environment';
import { StyleManagerService } from 'src/app/shared/services/style-manager.service';
import { AppConfigService } from '../../app-config.service';
import {EncrDecrService} from 'src/app/shared/services/encr-decr.service';
import { DOCUMENT, NgStyle, DecimalPipe, DatePipe } from '@angular/common';
import { formatNumber } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams} from '@angular/common/http';
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

declare var $: any;

@Component({
  selector: 'app-busnew-list',
  templateUrl: './bus-list.component.html',
  styleUrls: ['./bus-list.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class BusNewlistComponent implements OnInit, AfterViewInit, OnDestroy {
   queryBusData:any;
   searchData: any;
  busList: any = [];
  busResponse:any;
  newDate = Date();
  loader = false;
  isMobile:boolean=false;
  minPrice: number = 0;
  maxPrice: number = 10000;
  resetMinPrice: number = 0;
  resetMaxPrice: number = 10000;
   math = Math;
  minDate = new Date();
  options: Options = {
    floor: 0,
    ceil: 1000,
    translate: (value: number): string => {
      return '';
    }
  };
 

  cdnUrl: any;

          @ViewChild('itemsContainer', { read: ViewContainerRef }) container: ViewContainerRef;
          @ViewChild('item', { read: TemplateRef }) template: TemplateRef<any>;

        pageIndex: number = 26;
        ITEMS_RENDERED_AT_ONCE=25;
        nextIndex=0;

        private loadData() {
             if (this.pageIndex >= this.busList.length) {
             return false;
              }else{
             this.nextIndex = this.pageIndex + this.ITEMS_RENDERED_AT_ONCE;

             if(this.nextIndex > this.busList.length){
             this.nextIndex=this.busList.length;
             }

            for (let n = this.pageIndex; n < this.nextIndex ; n++) {
             const context = {
                item: [this.busList[n]]
              };

              this.container.createEmbeddedView(this.template, context);
            }
             this.pageIndex += this.ITEMS_RENDERED_AT_ONCE;

           }

        }


         private intialData() {
            for (let n = 0; n <this.ITEMS_RENDERED_AT_ONCE ; n++) {
              if(this.busList[n] != undefined)
              {
                const context = {
                  item: [this.busList[n]]
                };

                this.container.createEmbeddedView(this.template, context);
              }

            }
        }
   serviceSettings:any;

  constructor(private EncrDecr: EncrDecrService, private appConfigService:AppConfigService, public _styleManager: StyleManagerService,private _busService: BusService, public route: ActivatedRoute, private router: Router, private location: Location, private sg: SimpleGlobal, private scroll: ViewportScroller)  {
     this.cdnUrl = environment.cdnUrl+this.sg['assetPath'];
      this.serviceSettings=this.appConfigService.getConfig();
       this._styleManager.setScript('custom', `assets/js/custom.js`);

      $(window).scroll(function(this) {
        if($(window).scrollTop() + $(window).height() > $(document).height() - 300) {
          $('#endOfPage').trigger('click');
        }
      });
       this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

@HostListener('window:resize', ['$event']) resizeEvent(event: Event) {
  this.isMobile = window.innerWidth < 991 ?  true : false;
}

ngOnInit(): void {
        this.isMobile = window.innerWidth < 991 ?  true : false;
        this.resetPopups();
        this.gotoTop();
        this.loader = true;
        this.getQueryParamData(null);
        this.busSearch();

  }

        getQueryParamData(paramObj: any) {
        const params = this.route.snapshot.queryParams;
        this.queryBusData = params;
        this.searchData = params;

        }
        resetPopups(){
        $(".modal").hide();
        $("body").removeAttr("style");
        $(".modal-backdrop").remove();
        }

        ngAfterViewInit(): void {
        setTimeout(() => {
        this.Initslider();
        }, 200);
        }


  convertDate(str: any) {
    var date = new Date(str),
      mnth = ('0' + (date.getMonth() + 1)).slice(-2),
      day = ('0' + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join('-');
  }



  applySortingMobile() {

    let body = document.getElementsByTagName('body')[0];
    body.classList.remove("noscroll");
    let sortingBtn = document.getElementById('sortMobileFilter');
    if(sortingBtn)
    {
      sortingBtn.style.display = 'none';
    }
  }

  // Bus popular filter
  BusPopularFilterBusData(popularItems: any) {
    popularItems.active = !popularItems.active;

  }

  resetAllFilters() {
    
  }



 
  busSearch() {
    this.loader = true;
   this._busService.getBuses((this.searchData)).subscribe(data => {
   this.busResponse =  data;
   
     if (this.busResponse && this.busResponse.forwardTrips && this.busResponse.forwardTrips.length > 0) {
     this.busList = this.busResponse.forwardTrips;
     }
     console.log(this.busList);
   
   
   },
   (err: HttpErrorResponse) => {
   });
    
    


  }


  ngOnDestroy(): void {
        this._styleManager.removeScript('custom');
  }


  ConvertObjToQueryString(obj: any) {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }


  goSearch(){
    this.router.navigate(['/bus']);
  }

  Initslider() {
    var $that = this;
    $that.sliderRange($that, $that.minPrice, $that.maxPrice);
  }
  sliderRange($that: this, minPrice: number, maxPrice: number) {
    $that.options = {
      floor: minPrice,
      ceil: maxPrice,
      translate: (value: number): string => {
        return '';
      }
    };
    this.resetMinPrice = minPrice;
    this.resetMaxPrice = maxPrice;
  }
  onMinValueChange(event: any) {
    this.minPrice = event;
    if (this.minPrice != null) {
      if(!this.isMobile)
      {
      }

    }

  }
  onMaxValueChange(event: any) {
    this.maxPrice = event;
    if (this.maxPrice != null) {
      if(!this.isMobile)
      {
      }
    }
    if(!this.isMobile)
    {
    }
  }


  GetMinAndMaxPriceForFilter() {
    if (this.busList.length > 0) {
      this.minPrice = this.busList[0].priceSummary[0].totalFare;
      this.maxPrice = this.busList[0].priceSummary[0].totalFare;
      this.busList.forEach((z: any) => {
        var temp = z.priceSummary[0].totalFare;
        if (temp < this.minPrice) {
          this.minPrice = temp;
        }
        if (temp > this.maxPrice) {
          this.maxPrice = temp;
        }
      });
      this.Initslider();
    }
    else {
      this.minPrice = 0;
      this.maxPrice = 10000;
    }
  }


  gotoTop() {
       window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
});
  }
  

  openMobileFilterSection()
  {
      let body = document.getElementsByTagName('body')[0];
  body.classList.add("noscroll");
    var filterDiv = document.getElementById('sortMobileFilter');
    if(filterDiv)
    {
      filterDiv.style.display = 'block';
    }

  }

  CloseSortingSection()
  {
      let body = document.getElementsByTagName('body')[0];
  body.classList.remove("noscroll");
    var filterDiv = document.getElementById('sortMobileFilter');
    if(filterDiv)
    {
      filterDiv.style.display = 'none';
    }
  }
  onApplyFilter(){
      let body = document.getElementsByTagName('body')[0];
  body.classList.remove("noscroll");
    var filterDiv = document.getElementById('sortMobileFilter');
    if(filterDiv)
    {
      filterDiv.style.display = 'none';
    }
  }


}
