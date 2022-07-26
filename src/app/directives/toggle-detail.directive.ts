import { Directive, HostListener, HostBinding, ElementRef } from '@angular/core';

@Directive({
    selector:'[appToggleDetail]'
})
export class ToggleDetailDirective{

   // @HostBinding('class.flight-from-hide') isOpen = false;
    // @HostListener('click') toggleDropdown(){
    //     this.isOpen=!this.isOpen;
    // }
    @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
      var element = event?.target as HTMLElement

        //this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;
        if(this.elRef.nativeElement.contains(event.target) && !element.closest('.not-close'))
        {

          this.elRef.nativeElement
          .querySelector('.dropdown')
          .classList.toggle('flight-from-hide')
        }

      }
      constructor(private elRef:ElementRef){}

}
