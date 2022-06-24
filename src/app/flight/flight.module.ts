import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightListComponent } from './flight-list/flight-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DurationTimePipe } from '../pipes/duration-time.pipe';
import { FlightDetailComponent } from './flight-detail/flight-detail.component';





const routes: Routes = [
  {
    path:"flight-list" ,component:FlightListComponent
  },
  {
    path:"flight-details/:id" ,component:FlightDetailComponent
  }
];

@NgModule({
  declarations: [
    FlightListComponent,
    DurationTimePipe,
    FlightDetailComponent
    
    
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
