import { Directive, Input, HostListener, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as $ from 'jquery';

@Directive({ selector: '[accessible-form]' })
export class AccessibleForm {

    @Input('form') form: NgForm;

    constructor(private el: ElementRef) {

    }

    @HostListener('submit', ['$event'])
    onSubmit(event) {
        event.preventDefault();

        if (!this.form.valid) {
            let target;

            target = this.el.nativeElement.querySelector('.ng-invalid')

            if (target) {
                $('html,body').animate({ scrollTop: $(target).offset().top }, 'slow');
                target.focus();
            }
        }
    }

}

