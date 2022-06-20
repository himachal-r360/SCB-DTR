import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightListComponent } from './flight-list/flight-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';





const routes: Routes = [
  {
    path:"flight-list" ,component:FlightListComponent
  }
];

@NgModule({
  declarations: [
    FlightListComponent,
    
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)

    
  ],
  exports: [RouterModule]
})
export class FlightModule { }
