import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { CommonModule } from '@angular/common';
import { FlightSearchModule } from '../flight-search/flight-search.module';
import { BusSearchModule } from '../bus-search/bus-search.module';
import { TrainSearchModule } from '../train-search/train-search.module';
import { CarouselModule } from 'ngx-owl-carousel-o';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
     CommonModule,
   FlightSearchModule,
   CarouselModule,
   BusSearchModule,TrainSearchModule
  ],
  providers: [],
  exports: [HomeComponent  ],
  entryComponents: []
})

export class HomeModule { }
