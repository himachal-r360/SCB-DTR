import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotelSearchModule } from './hotel-search/hotel-search.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HotelSearchModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
    
  ]
})
export class HotelModule { }
