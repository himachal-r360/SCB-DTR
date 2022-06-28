import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightListComponent } from './flight-list/flight-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DurationTimePipe } from '../pipes/duration-time.pipe';
import { FlightDetailComponent } from './flight-detail/flight-detail.component';
import { MaterialModule } from '../material.module';
import { DirectiveModule } from '../directives/directive.module';





const routes: Routes = [
  {
    path:"flight-list" ,component:FlightListComponent
  },
  {
    path:"flight-details" ,component:FlightDetailComponent
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
    RouterModule.forRoot(routes),
  MaterialModule,
  DirectiveModule

  ],
  exports: [RouterModule]
})
export class FlightModule { }
