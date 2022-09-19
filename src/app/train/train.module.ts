import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainsComponent,BottomSortbySheet,ChromeExtBusDialog, BottomFilterSheet,seniorCitizenDilog } from './trains/trains.component';
import { TdrComponent } from './tdr/tdr.component';
import { TdrHistoryComponent } from './tdr/tdr-history/tdr-history.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes,RouteReuseStrategy } from '@angular/router';
import { MaterialModule } from '../material.module';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CouponsModule } from 'src/app/coupons/coupons.module';
import { InputMaskModule } from '@ngneat/input-mask';
import { PaymentModule } from 'src/app/payment/payment.module';
import { TrainSearchModule } from './train-search/train-search.module';
import { TdrModule } from './tdr/tdr.module';
import { CustomReuseStrategy } from 'src/app/route-reuse-strategy';
import { CountdownModule } from 'ngx-countdown';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TrainscardModule } from './trains-card/trains-card.module';
import { TrainsFilterModule } from './trains-filter/trains-filter.module';
import { TrainsTravellerComponent } from './trains-traveller/travellers.component';
import { BusHelper } from 'src/app/shared/utils/bus-helper';
import {APP_CONFIG, AppConfig} from '../configs/app.config';
import { IrctcfilterPipe } from 'src/app/shared/pipes/irctc/irctcfilter.pipe';
import { DecimalPipe } from '@angular/common';
import {IrctcregComponent } from './trains/irctcreg/irctcreg.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { NgxSpinnerModule } from "ngx-spinner";
const routes: Routes = [
  { 
    path: 'train/filetdr', component: TdrComponent
  },
  { path: 'train/tdrhistory', component: TdrHistoryComponent
  },
  {
    path:"train/search" ,component:TrainsComponent,
  },
  {
    path:"train/checkout" ,component:TrainsTravellerComponent,
  },
 { path: 'train/registration', component: IrctcregComponent },
   {
    path:"regalia_gold/train/search" ,component:TrainsComponent,
  },
  {
    path:"regalia_gold/train/checkout" ,component:TrainsTravellerComponent,
  },
 { path: 'regalia_gold/train/registration', component: IrctcregComponent },


];

@NgModule({
  declarations: [TrainsComponent,seniorCitizenDilog,
    BottomSortbySheet,IrctcfilterPipe,ChromeExtBusDialog, BottomFilterSheet

  ],
  imports: [
        CommonModule,MatDialogModule,MatDatepickerModule,NgxSpinnerModule,
        FormsModule,
        InputMaskModule,
        ReactiveFormsModule,
        MaterialModule,
        NgxSliderModule,
        NgxSkeletonLoaderModule,TrainSearchModule,
        CouponsModule,PaymentModule,CountdownModule,
        TrainscardModule,TrainsFilterModule,
        RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      onSameUrlNavigation: 'reload'
    }),
    MatExpansionModule
  ],
  
  exports: [RouterModule],
    entryComponents:[BottomSortbySheet,seniorCitizenDilog,ChromeExtBusDialog, BottomFilterSheet],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: CustomReuseStrategy,
    },BusHelper,DecimalPipe,
     {provide: APP_CONFIG, useValue: AppConfig},
  ],
})
export class TrainModule { }
