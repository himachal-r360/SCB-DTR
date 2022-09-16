import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BusHelper } from 'src/app/shared/utils/bus-helper';
import {environment} from '../../../environments/environment';
import { SimpleGlobal } from 'ng2-simple-global';
import { ActivatedRoute, Router } from '@angular/router'; 
@Component({
  selector: 'app-trains-filter',
  templateUrl: './trains-filter.component.html',
  styleUrls: ['./trains-filter.component.scss']
})
export class TrainsFilterComponent implements OnInit {
   @Input() fromStationcode:string;
   @Input() toStationcode:string;

   @Input() availableClasses: any[];
   @Output() departEvent = new EventEmitter();
   @Output() arriveEvent = new EventEmitter();
   @Output() availableClassesEvent = new EventEmitter();

   @Input() fromStations:any[];
   @Output() fromStationsEvent = new EventEmitter();
   @Input() toStations:any[];
   @Output() toStationsEvent = new EventEmitter();
   @Output() removeallfilters = new EventEmitter();
   @Input() departureTimeFilter:any[];
   @Input() arrivalTimeFilter:any[];
   @Input() avlQuota:any[];
   @Input() trainTypes:any[];
   @Output()trainTypesEvent = new EventEmitter();
   @Output()searchboard = new EventEmitter();
   @Output() applyFilter = new EventEmitter();
   @Output() selectedQuotaEvent = new EventEmitter();
    cdnUrl: any;
    isMobile:boolean= true;
      constructor(private sg: SimpleGlobal,private activatedRoute: ActivatedRoute) { 

      this.cdnUrl = environment.cdnUrl+this.sg['assetPath']; 
      this.fromStationcode = this.activatedRoute.snapshot.queryParamMap.get('fromTravelCode');
      this.toStationcode = this.activatedRoute.snapshot.queryParamMap.get('toTravelCode'); 
      }
    
  ngOnInit() {
    this.isMobile = window.innerWidth < 991 ?  true : false;
this.cdnUrl = environment.cdnUrl+this.sg['assetPath'];

   
  }


  updateDepartureTimeFilter(appt) { 
    //  console.log(appt);
      this.departEvent.emit(appt);
    }
    updateArrivalTimeFilter(appt){
      this.arriveEvent.emit(appt);
    }

    updateAvailableClassFilter(appt){
      this.availableClassesEvent.emit(appt);
    }
    updateTrainTypeFilter(appt){
      this.trainTypesEvent.emit(appt);
    }
    updateFromStationFilter(appt){
      this.fromStationsEvent.emit(appt);
    }
    updateToStationFilter(appt){
      this.toStationsEvent.emit(appt);
    }
    updateTosSelectedQuota(appt){
      this.selectedQuotaEvent.emit(appt);
    }

    searchboarding(type,input:any){
      var emitter = {'type':type, 'input':input}
      this.searchboard.emit(emitter);
  }

  clearSelectionAll(){
    this.removeallfilters.emit();
    this.applyFil();
    }
    onlyClearSelectionAll(){
      if(this.isMobile){
        $('#seniorcitizen').trigger('click');
        $('.quotas').prop('checked', false);
      this.updateTosSelectedQuota('');
      }
      
      this.removeallfilters.emit();
    }

    applyFil(){
      this.applyFilter.emit();
      }
}
