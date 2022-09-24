import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotelBookingRetryComponent } from './hotel-booking-retry.component';
import { CouponsModule } from 'src/app/coupons/coupons.module';
import { Routes, RouterModule } from '@angular/router';
import {HoteltCheckoutRoutes } from './hotel-booking-retry.routes';
import { MinuteSecondPipe } from '../pipes/minute-second.pipe';

@NgModule({
  declarations: [FlightBookingRetryComponent,MinuteSecondPipe],
  imports: [
    CommonModule,CouponsModule,
     RouterModule.forChild(HotelCheckoutRoutes)
  ],
  exports: [HotelBookingRetryComponent],
})
export class HotelBookingRetryModule { }

