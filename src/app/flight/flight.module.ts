import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightListComponent } from './flight-list/flight-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes,RouteReuseStrategy } from '@angular/router';
import { DurationTimePipe } from '../pipes/duration-time.pipe';
import { MaterialModule } from '../material.module';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MinuteSecondPipe } from '../pipes/minute-second.pipe';
import { FlightCheckoutComponent } from './flight-checkout/flight-checkout.component';
import { CouponsModule } from 'src/app/coupons/coupons.module';
import { InputMaskModule } from '@ngneat/input-mask';
import { PaymentModule } from 'src/app/payment/payment.module';
import { FlightRoundtripListComponent } from './flight-roundtrip-list/flight-roundtrip-list.component';
import { FlightIntListComponent } from './flight-int-list/flight-int-list.component';
import { FlightSearchModule } from '../flight-search/flight-search.module';
import { CustomReuseStrategy } from '../route-reuse-strategy';
import { AgePipe } from 'src/app/pipes/age.pipe';
import { FilterPipe } from 'src/app/shared/pipes/filterUnique.pipe';
import { couponDiplayPipe } from 'src/app/shared/pipes/couponDiplay.pipe';
import { CountdownModule } from 'ngx-countdown';
import { DirectiveModule } from '../directives/directive.module';

import { FlightMulticityComponent } from './flight-multicity/flight-multicity.component';

const routes: Routes = [
  {
    path:"flight-list" ,component:FlightListComponent,
  },

   {
    path:"flight-checkout" ,component:FlightCheckoutComponent,
  },
  {
    path:"flight-roundtrip" ,component:FlightRoundtripListComponent,
  },
  {

    path:"flight-int" ,component:FlightIntListComponent,data: {  shouldReuse: true, },

  },
  {
    path:"flight-multicity" ,component:FlightMulticityComponent,data:{shouldReuse: true,}

  },
  {
    path:"flight-checkout/retry" ,component:FlightCheckoutComponent,

  }


];

@NgModule({
  declarations: [
    FlightListComponent,
    DurationTimePipe,
    FlightCheckoutComponent,
    MinuteSecondPipe,
    FlightRoundtripListComponent,FlightIntListComponent,AgePipe,FilterPipe, FlightMulticityComponent,couponDiplayPipe

  ],
  imports: [
        CommonModule,
        FormsModule,
        InputMaskModule,
        ReactiveFormsModule,
        MaterialModule,
        NgxSliderModule,
        NgxSkeletonLoaderModule,FlightSearchModule,
        CouponsModule,PaymentModule,CountdownModule,
        DirectiveModule,
            RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      onSameUrlNavigation: 'reload'
    })
  ],
  exports: [RouterModule],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: CustomReuseStrategy,
    },
  ],
})
export class FlightModule { }
