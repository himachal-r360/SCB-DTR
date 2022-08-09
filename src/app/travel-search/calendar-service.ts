import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class CalendarService {

  closeCalendarSource = new BehaviorSubject<boolean>(false);
  isCloseCalander = this.closeCalendarSource.asObservable();

  constructor() { }

  closeCalander(message: boolean) {
    this.closeCalendarSource.next(message)
  }

}
