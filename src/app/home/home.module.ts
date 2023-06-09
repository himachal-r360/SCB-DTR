import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { CommonModule } from '@angular/common';
import { FlightSearchModule } from '../flight/flight-search/flight-search.module';
import { BusSearchModule } from '../bus/bus-search/bus-search.module';
import { TrainSearchModule } from '../train/train-search/train-search.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { HotelSearchModule } from '../hotel/hotel-search/hotel-search.module';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
     CommonModule,
   FlightSearchModule,
   CarouselModule,
   BusSearchModule,TrainSearchModule,
   HotelSearchModule
  ],
  providers: [],
  exports: [HomeComponent  ],
  entryComponents: []
})

export class HomeModule { }
