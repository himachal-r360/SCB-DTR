import { Directive, HostListener, HostBinding, ElementRef, ViewChild } from '@angular/core';

@Directive({
    selector:'[appHotelDropdown]'
})
export class HotelDropdownDirective{

   
    @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
      var element = event?.target as HTMLElement
      let citySearchRef = document.getElementById('citySearchRef');
      // debugger;
        if(this.elRef.nativeElement.contains(event.target) && !element.classList.contains('close-mobile'))
        {
          
          this.elRef.nativeElement
          .querySelector('.dropdown')
          .classList.remove('flight-from-hide');
        }
        else{
          this.elRef.nativeElement
          .querySelector('.dropdown')
          .classList.add('flight-from-hide')
        }

      }
      constructor(private elRef:ElementRef){}

}
