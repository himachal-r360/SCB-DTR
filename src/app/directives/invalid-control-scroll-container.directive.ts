import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appInvalidControlScrollContainer]'
})
export class InvalidControlScrollContainerDirective {
  readonly containerEl: HTMLElement = this.el.nativeElement;

  constructor(private el: ElementRef) { }

}
