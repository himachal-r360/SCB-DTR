import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightListComponent } from './flight-list/flight-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DurationTimePipe } from '../pipes/duration-time.pipe';





const routes: Routes = [
  {
    path:"flight-list" ,component:FlightListComponent
  }
];

@NgModule({
  declarations: [
    FlightListComponent,
    DurationTimePipe
    
    
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
