import { Component, OnInit, Input, Output, EventEmitter,Inject } from '@angular/core';
import { BusHelper } from 'src/app/shared/utils/bus-helper';
import {APP_CONFIG, AppConfig} from '../../configs/app.config';
import {environment} from '../../../environments/environment';
import { SimpleGlobal } from 'ng2-simple-global';
@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  @Input() onwardResults: any[];
  @Output() childEvent = new EventEmitter();
  @Input() boardingpoints:any[];
  @Output() boardingfilterEvent = new EventEmitter();
  @Input() droppingpoints:any[];
  @Output() droppingfilterEvent = new EventEmitter();
  @Input() availableClasses:any[];
  @Output() classesfilterEvent = new EventEmitter();
  @Input() operators:any[];
  @Output() operatorsfilterEvent = new EventEmitter();
  @Output() removeallfilters = new EventEmitter();
  @Input() departureTimeFilter:any[];
  @Input() amenities:any[];
  @Output() amenitiesfilterEvent = new EventEmitter();
  @Output() applyFilter = new EventEmitter();
  @Output() searchboard = new EventEmitter();

  @Output() arrivalFilterEvent = new EventEmitter();
  @Input() arrivalTimeFilter:any[];

  @Output() removeDeparturefilters = new EventEmitter();

  @Output() removeArrivalTimefilters = new EventEmitter();

  @Output() removeClassesfilters = new EventEmitter();

  @Output() removeamenitiesfilters = new EventEmitter();

  panelOpenState = false;

  filterDeparture = [];
  question = [];
  filterArrival = [];
  filterClasses = [];
  properties = [BusHelper];
  appConfig: any;
 cdnUrl: any;
 domainName:any;
  constructor(public busHelper: BusHelper,@Inject(APP_CONFIG) appConfig: any,private sg: SimpleGlobal) {  
    this.appConfig = appConfig;this.cdnUrl = environment.cdnUrl+this.sg['assetPath'];
    this.domainName = this.sg['domainName']
   }

  ngOnInit() {
    this.question = this.onwardResults;
  }

  ngAfterViewInit() {

  }


  updateDepartureTimeFilter(appt) {
    this.childEvent.emit(appt);
  }

  updateArrivalTimeFilter(appt) {
    this.arrivalFilterEvent.emit(appt);
  }

  updateBoardingFilter(appt) {
    this.boardingfilterEvent.emit(appt);
  }
  updateDroppingFilter(appt) {
    this.droppingfilterEvent.emit(appt);
  }
  
  updateClassesFilter(appt) {
    this.classesfilterEvent.emit(appt);
  }
  updateOperatorsFilter(appt) {
    this.operatorsfilterEvent.emit(appt);
  }
  updateamenitiesFilter(appt) {
    this.amenitiesfilterEvent.emit(appt);
  }
  
  clearSelectionAll(){
    this.removeallfilters.emit();
    this.applyFil();
  }

  onlyClearSelectionAll(){
    this.removeallfilters.emit();
  }

  applyFil(){
    this.applyFilter.emit();
    let body = document.getElementsByTagName('body')[0];
	  body.classList.remove("noscroll");
  }

  searchboarding(type,input:any){
    var emitter = {'type':type, 'input':input}
    this.searchboard.emit(emitter);
  }

  clearDepartureSelection(){
    this.removeDeparturefilters.emit();
  }

  clearArrivalTimeSelection(){
    this.removeArrivalTimefilters.emit();
  }

  clearClassesSelection(){
    this.removeClassesfilters.emit();
  }

  clearAmenitiesSelection(){
    this.removeamenitiesfilters.emit();
  }

}
