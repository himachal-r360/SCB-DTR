import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotelSearchComponent } from './hotel-search/hotel-search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';




@NgModule({
  declarations: [
    HotelSearchComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

  ],
  exports: [HotelSearchComponent  ],
})
export class HotelSearchModule { }
