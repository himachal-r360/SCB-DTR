import { Injectable, EventEmitter,  } from "@angular/core";
@Injectable()
export class CommunicationService {
   
    constructor() {
        this.receivedFilter = new EventEmitter<any[]>();
        this.receivedFilter2 = new EventEmitter<any[]>();
        this.receivedFilter3 = new EventEmitter<any[]>();
        this.receivedFilter4 = new EventEmitter<Boolean>();
        this.receivedFilter5 = new EventEmitter<Boolean>();
        this.receivedFilter6 = new EventEmitter<Boolean>();
        this.receivedFilter7 = new EventEmitter<any>();
    }
    // 1
    item: any[];
    receivedFilter: EventEmitter<any>;
    raiseEvent(item: any[]) {
       // this.item = item;
        this.receivedFilter.emit(item);
    }


    // 2
    item2: any[];
    receivedFilter2: EventEmitter<any>;
    raiseEvent2(item2: any[]) {
        // this.item = item;
        this.receivedFilter2.emit(item2);
    }
    

    //3
    item3: any[];
    receivedFilter3: EventEmitter<any>;
    raiseEvent3(item3: any[]) {
        // this.item = item;
        this.receivedFilter3.emit(item3);
    }

    //4
    item4: Boolean;
    receivedFilter4: EventEmitter<any>;
    raiseEvent4(item4: Boolean) {
        this.receivedFilter4.emit(item4);
    }

    //5
    item5: Boolean;
    receivedFilter5: EventEmitter<any>;
    raiseEvent5(item5: Boolean) {   
        this.receivedFilter5.emit(item5);
    }


    //6
    item6: Boolean;
    receivedFilter6: EventEmitter<any>;
    raiseEvent6(item6: Boolean) { 
        this.receivedFilter6.emit(item6);
    }

    //7 to update available points in header 
    item7: any;
    receivedFilter7: EventEmitter<any>;
    raiseEvent7(item7: any) { 
        this.receivedFilter7.emit(item7);
    }

}
