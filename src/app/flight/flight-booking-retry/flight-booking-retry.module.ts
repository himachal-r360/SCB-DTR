import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightBookingRetryComponent } from './flight-booking-retry.component';
import { CouponsModule } from 'src/app/coupons/coupons.module';
import { Routes, RouterModule } from '@angular/router';
import {FlightCheckoutRoutes } from './flight-booking-retry.routes';
import { MinuteSecondPipe } from '../pipes/minute-second.pipe';

@NgModule({
  declarations: [FlightBookingRetryComponent,MinuteSecondPipe],
  imports: [
    CommonModule,CouponsModule,
     RouterModule.forChild(FlightCheckoutRoutes)
  ],
  exports: [FlightBookingRetryComponent],
})
export class FlightBookingRetryModule { }

