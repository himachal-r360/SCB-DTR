import { Directive, HostListener, HostBinding, ElementRef } from '@angular/core';
declare var $: any;
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
          if(this.elRef.nativeElement.querySelector('.RadioClass'))
          {
            if(this.elRef.nativeElement.querySelector('.RadioClass').checked == true)
            {
            console.log('ddddd');
              this.elRef.nativeElement
              .querySelector('.dropdown')
              .classList.remove('flight-from-hide')
            }
            else{


              var isClass = this.elRef.nativeElement
              .querySelector('.dropdown')
              .classList.contains('flight-from-hide')
              $(".dropdown").addClass('flight-from-hide');
              if(isClass)
              {
                this.elRef.nativeElement
                .querySelector('.dropdown')
                .classList.toggle('flight-from-hide')

                this.elRef.nativeElement.querySelector('.RadioClass').checked = true;
              }
              else{
                this.elRef.nativeElement.querySelector('.RadioClass').checked = true;
              }
            }
          }
         else{
          $(".dropdown").addClass('flight-from-hide');
            this.elRef.nativeElement
            .querySelector('.dropdown')
            .classList.remove('flight-from-hide')
         }
        }
        else{
         // if(element.closest('.showless-close'))
          {
            this.elRef.nativeElement
            .querySelector('.dropdown')
            .classList.add('flight-from-hide')
          }
        }

      }
      constructor(private elRef:ElementRef){}

}
