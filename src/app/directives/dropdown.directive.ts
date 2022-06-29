import { Directive, HostListener, HostBinding, ElementRef } from '@angular/core';

@Directive({
    selector:'[appDropdown]'
})
export class DropdownDirective{

   // @HostBinding('class.flight-from-hide') isOpen = false;
    // @HostListener('click') toggleDropdown(){
    //     this.isOpen=!this.isOpen;
    // }
    @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
        //this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;
        if(this.elRef.nativeElement.contains(event.target))
        {
          //console.log(this.elRef.nativeElement)
          this.elRef.nativeElement
          .querySelector('.dropdown')
          .classList.remove('flight-from-hide');
        }
        else{
          //console.log(this.elRef.nativeElement)
          this.elRef.nativeElement
          .querySelector('.dropdown')
          .classList.add('flight-from-hide');
        }

      }
      constructor(private elRef:ElementRef){}

}
