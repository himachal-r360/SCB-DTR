import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotelSearchModule } from './hotel-search/hotel-search.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { HotelListComponent } from './hotel-list/hotel-list.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path:'hotel-list',component:HotelListComponent}
]

@NgModule({
  declarations: [
    HotelListComponent
  ],
  imports: [
    CommonModule,
    HotelSearchModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule
    
  ],
  exports: [RouterModule],
})
export class HotelModule { }
