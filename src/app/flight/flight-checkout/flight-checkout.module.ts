import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightCheckoutComponent } from './flight-checkout.component';
import { CouponsModule } from 'src/app/coupons/coupons.module';
import { Routes, RouterModule } from '@angular/router';
import {FlightCheckoutRoutes } from './flight-checkout.routes';
import { MinuteSecondPipe } from '../pipes/minute-second.pipe';

@NgModule({
  declarations: [FlightCheckoutComponent,MinuteSecondPipe],
  imports: [
    CommonModule,CouponsModule,
     RouterModule.forChild(FlightCheckoutRoutes)
  ],
  exports: [FlightCheckoutComponent],
})
export class FlightCheckoutModule { }

