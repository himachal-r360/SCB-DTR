import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotelSearchComponent } from './hotel-search/hotel-search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { DirectiveModule } from 'src/app/directives/directive.module';





@NgModule({
  declarations: [
    HotelSearchComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    DirectiveModule

  ],
  exports: [HotelSearchComponent  ],
})
export class HotelSearchModule { }
