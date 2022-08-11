import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusListComponent } from './bus-list/bus-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes,RouteReuseStrategy } from '@angular/router';
import { DurationTimePipe } from '../pipes/duration-time.pipe';
import { MaterialModule } from '../material.module';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MinuteSecondPipe } from '../pipes/minute-second.pipe';
import { BusCheckoutComponent } from './bus-checkout/bus-checkout.component';
import { CouponsModule } from 'src/app/coupons/coupons.module';
import { InputMaskModule } from '@ngneat/input-mask';
import { PaymentModule } from 'src/app/payment/payment.module';
import { BusSearchModule } from '../bus-search/bus-search.module';
import { CustomReuseStrategy } from '../route-reuse-strategy';
import { AgePipe } from 'src/app/pipes/age.pipe';
import { FilterPipe } from 'src/app/shared/pipes/filterUnique.pipe';
import { couponDiplayPipe } from 'src/app/shared/pipes/couponDiplay.pipe';
import { CountdownModule } from 'ngx-countdown';
import { DirectiveModule } from '../directives/directive.module';
const routes: Routes = [
  {
    path:"bus-list" ,component:BusListComponent,data: {  shouldReuse: true, },
  },

   {
    path:"bus-checkout" ,component:BusCheckoutComponent,data: {  shouldReuse: true, },
  }


];

@NgModule({
  declarations: [
    BusListComponent,
    DurationTimePipe,
    BusCheckoutComponent,
    MinuteSecondPipe,
     AgePipe,FilterPipe,couponDiplayPipe

  ],
  imports: [
        CommonModule,
        FormsModule,
        InputMaskModule,
        ReactiveFormsModule,
        MaterialModule,
        NgxSliderModule,
        NgxSkeletonLoaderModule,BusSearchModule,
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
export class BusModule { }
