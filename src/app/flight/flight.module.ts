import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightListComponent } from './flight-list/flight-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DurationTimePipe } from '../pipes/duration-time.pipe';
import { FlightDetailComponent } from './flight-detail/flight-detail.component';
import { MaterialModule } from '../material.module';
import { TravellerDetailComponent } from './traveller-detail/traveller-detail.component';
import { FlightStepperNavComponent } from './flight-stepper-nav/flight-stepper-nav.component';
import { FareSummaryComponent } from './fare-summary/fare-summary.component';
import { DirectiveModule } from '../directives/directive.module';
import { NgxSliderModule } from '@angular-slider/ngx-slider';





const routes: Routes = [
  {
    path:"flight-list" ,component:FlightListComponent
  },
  {
    path:"flight-details" ,component:FlightDetailComponent
  },
  {
    path:"flight-booking" ,component:FlightStepperNavComponent,  children: [
      {
        path: 'flight-details',
        component: FlightDetailComponent,
      },
      {
        path: 'traveller-detail',
        component: TravellerDetailComponent,
      },
    ]
  }
];

@NgModule({
  declarations: [
    FlightListComponent,
    DurationTimePipe,
    FlightDetailComponent,
    TravellerDetailComponent,
    FlightStepperNavComponent,
    FareSummaryComponent


  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
  MaterialModule,
  DirectiveModule,
  NgxSliderModule

  ],
  exports: [RouterModule]
})
export class FlightModule { }
