import { NgModule, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RedirectPopupComponent } from './redirect-popup.component';

@NgModule({
  declarations: [RedirectPopupComponent
  ],
  imports: [
    CommonModule, 
  ],
  providers: [],
  exports: [RedirectPopupComponent],
  schemas: [],
})
export class RedirectPopupModule { }
